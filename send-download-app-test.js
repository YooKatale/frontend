/**
 * Test script to send download app email
 * Run: node send-download-app-test.js (with Next.js dev server running)
 */

const TEST_EMAILS = [
  "timothy.arihoz@protonmail.com",
  "yookatale256@gmail.com"
];

const PORTS = [3000, 3001];
let API_URL = "http://localhost:3000/api/mail";

async function checkServer() {
  for (const port of PORTS) {
    try {
      const url = `http://localhost:${port}/api/mail`;
      const response = await fetch(url, {
        method: "OPTIONS",
        signal: AbortSignal.timeout(5000),
      });
      API_URL = url;
      return true;
    } catch (error) {
      continue;
    }
  }
  return false;
}

async function sendEmail(email) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        type: "download_app",
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
  console.log("🚀 Sending download app email to test address\n");

  // Check if server is running
  console.log("Checking if dev server is running...");
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log("❌ Dev server not running. Start with: npm run dev");
    process.exit(1);
  }
  console.log("✅ Server found at", API_URL, "\n");

  // Send emails
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < TEST_EMAILS.length; i++) {
    const email = TEST_EMAILS[i];
    process.stdout.write(`[${i + 1}/${TEST_EMAILS.length}] ${email} ... `);

    const result = await sendEmail(email);

    if (result.success) {
      console.log("✅");
      successCount++;
    } else {
      console.log("❌ Failed:", result.error);
      failCount++;
    }

    // Small delay between emails
    if (i < TEST_EMAILS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log("\n==================================================");
  console.log(`✅ Test emails sent! Success: ${successCount}, Failed: ${failCount}`);
  console.log("==================================================");
}

main().catch(console.error);
