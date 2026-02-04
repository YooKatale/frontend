/**
 * Test script to send get started email
 * Run: node send-get-started-test.js (with Next.js dev server running)
 */

const TEST_EMAILS = [
  "timothy.arihoz@protonmail.com",
  "yookatale256@gmail.com"
];

const API_URL = "http://localhost:3000/api/mail";

async function checkServer() {
  try {
    const response = await fetch(API_URL, {
      method: "OPTIONS",
      signal: AbortSignal.timeout(5000),
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function sendEmail(email) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        type: "get_started",
      }),
      signal: AbortSignal.timeout(35000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log("🚀 Sending get started emails to test addresses\n");

  // Check if server is running
  console.log("Checking if dev server is running...");
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log("❌ Dev server not running. Start with: npm run dev");
    process.exit(1);
  }
  console.log("✅ Server found at", API_URL, "\n");

  // Send emails
  for (let i = 0; i < TEST_EMAILS.length; i++) {
    const email = TEST_EMAILS[i];
    process.stdout.write(`[${i + 1}/${TEST_EMAILS.length}] ${email} ... `);

    const result = await sendEmail(email);

    if (result.success) {
      console.log("✅");
    } else {
      console.log("❌ Failed:", result.error);
    }

    // Small delay between emails
    if (i < TEST_EMAILS.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\n==================================================");
  console.log("✅ Test emails sent!");
  console.log("==================================================");
}

main().catch(console.error);
