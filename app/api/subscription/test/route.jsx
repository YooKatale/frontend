/**
 * Test Email API
 *
 * Sends test emails to 3 addresses: arihotimothy89@gmail.com, timothy.arhoz@protonmail.com, yookatale256@gmail.com
 * Use to verify templates before bulk subscription.
 *
 * POST /api/subscription/test
 * Body (optional): { type: 'subscription' | 'welcome' } — default: 'subscription'
 */

import { NextResponse } from "next/server";

const testEmails = [
  'arihotimothy89@gmail.com',
  'timothy.arhoz@protonmail.com',
  'yookatale256@gmail.com'
];

export const POST = async (req) => {
  try {
    let type = 'subscription';
    try {
      const body = await req.json().catch(() => ({}));
      if (body.type === 'welcome' || body.type === 'subscription') type = body.type;
    } catch (_) {}

    console.log(`🧪 Starting test email sending (type: ${type})...`);

    const baseUrl = req.nextUrl.origin;
    const results = [];

    for (const email of testEmails) {
      try {
        console.log(`📧 Sending ${type} to: ${email}...`);

        const response = await fetch(`${baseUrl}/api/mail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            type,
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
        type,
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
