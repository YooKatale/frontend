/**
 * Bulk Subscription API Route
 * 
 * This endpoint handles bulk subscription of users from CSV file
 * - Subscribes users to newsletter database
 * - Sends subscription welcome email
 * - Returns success/failure status for each email
 * 
 * Security:
 * - Rate limiting recommended for production
 * - Email validation on all addresses
 * - Batch processing to prevent timeout
 */

import { NextResponse } from "next/server";
import { DB_URL } from "@config/config";

/**
 * Validates email address format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * POST handler for bulk subscription
 * Expects: { emails: string[] }
 */
export const POST = async (req) => {
  try {
    const body = await req.json();
    const { emails } = body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Invalid request",
          details: "Please provide an array of email addresses"
        }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate and filter emails
    const validEmails = emails
      .map(email => email?.toString().trim().toLowerCase())
      .filter(email => isValidEmail(email));

    if (validEmails.length === 0) {
      return new NextResponse(
        JSON.stringify({ 
          error: "No valid emails",
          details: "Please provide at least one valid email address"
        }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Remove duplicates
    const uniqueEmails = [...new Set(validEmails)];

    console.log(`📧 Processing ${uniqueEmails.length} email subscriptions...`);

    const results = [];
    const batchSize = 10; // Process in batches to avoid timeout

    // Process emails in batches
    for (let i = 0; i < uniqueEmails.length; i += batchSize) {
      const batch = uniqueEmails.slice(i, i + batchSize);
      
      for (const email of batch) {
        try {
          // Subscribe to newsletter database
          const subscribeResponse = await fetch(`${DB_URL}/newsletter`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const subscribeResult = await subscribeResponse.json();
          const subscribed = subscribeResponse.ok && subscribeResult.status === 'Success';

          // Send subscription email
          let emailSent = false;
          try {
            const emailResponse = await fetch(`${req.nextUrl.origin}/api/mail`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email, 
                type: 'subscription' 
              }),
            });

            const emailResult = await emailResponse.json();
            emailSent = emailResponse.ok && emailResult.success;
          } catch (emailError) {
            console.error(`⚠️ Failed to send email to ${email}:`, emailError.message);
          }

          results.push({
            email,
            subscribed,
            emailSent,
            status: subscribed && emailSent ? 'success' : 'partial',
            message: subscribed && emailSent 
              ? 'Subscribed and email sent' 
              : subscribed 
                ? 'Subscribed but email failed' 
                : emailSent 
                  ? 'Email sent but subscription failed' 
                  : 'Both failed'
          });

          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Error processing ${email}:`, error.message);
          results.push({
            email,
            subscribed: false,
            emailSent: false,
            status: 'error',
            message: error.message
          });
        }
      }

      // Delay between batches
      if (i + batchSize < uniqueEmails.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const partialCount = results.filter(r => r.status === 'partial').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    console.log(`✅ Bulk subscription completed: ${successCount} success, ${partialCount} partial, ${errorCount} errors`);

    return new NextResponse(
      JSON.stringify({
        success: true,
        total: uniqueEmails.length,
        successCount,
        partialCount,
        errorCount,
        results
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  } catch (error) {
    console.error("❌ Error in bulk subscription:", error.message);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to process bulk subscription",
        details: process.env.NODE_ENV === "development" ? error.message : "Please try again later"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }
};
