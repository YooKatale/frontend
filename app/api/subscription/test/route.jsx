/**
 * Test Subscription Email API
 * 
 * Sends test subscription emails to 3 test addresses
 * Use this to verify email template before bulk subscription
 * 
 * Usage:
 *   POST /api/subscription/test
 *   No body required
 */

import { NextResponse } from "next/server";

const testEmails = [
  'arihotimothy89@gmail.com',
  'timothy.arihoz@protonmail.com',
  'yookatale256@gmail.com'
];

export const POST = async (req) => {
  try {
    console.log('🧪 Starting test email sending...');
    
    const baseUrl = req.nextUrl.origin;
    const results = [];

    for (const email of testEmails) {
      try {
        console.log(`📧 Sending test email to: ${email}...`);

        const response = await fetch(`${baseUrl}/api/mail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            type: 'subscription'
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log(`✅ Successfully sent to ${email}`);
          results.push({ email, status: 'success', message: result.message });
        } else {
          console.error(`❌ Failed to send to ${email}:`, result.error || result.details);
          results.push({ email, status: 'error', message: result.error || result.details });
        }
      } catch (error) {
        console.error(`❌ Error sending to ${email}:`, error.message);
        results.push({ email, status: 'error', message: error.message });
      }

      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    console.log(`✅ Test email sending completed: ${successCount} success, ${errorCount} errors`);

    return new NextResponse(
      JSON.stringify({
        success: true,
        total: testEmails.length,
        successCount,
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
    console.error("❌ Error in test email sending:", error.message);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to send test emails",
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
