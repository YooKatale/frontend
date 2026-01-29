/**
 * Wait for server to be ready, then send subscription emails
 * Uses the exact same logic as the codebase
 */

let fetch;
try {
  fetch = globalThis.fetch;
} catch (e) {
  try {
    fetch = require('node-fetch');
  } catch (e2) {
    console.error('❌ fetch is not available');
    process.exit(1);
  }
}

const testEmails = [
  "arihotimothy89@gmail.com",
  "timothy.arihoz@protonmail.com",
  "yookatale256@gmail.com"
];

const API_URL = "http://localhost:3000/api/mail";
const MAX_WAIT_TIME = 60000; // 60 seconds
const CHECK_INTERVAL = 2000; // Check every 2 seconds

async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000", { 
      method: "HEAD",
      signal: AbortSignal.timeout(3000)
    });
    return response.ok || response.status < 500;
  } catch (error) {
    return false;
  }
}

async function waitForServer() {
  console.log("⏳ Waiting for server to start...");
  const startTime = Date.now();
  
  while (Date.now() - startTime < MAX_WAIT_TIME) {
    if (await checkServer()) {
      console.log("✅ Server is ready!\n");
      return true;
    }
    process.stdout.write(".");
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
  
  console.log("\n❌ Server did not start within 60 seconds");
  return false;
}

async function sendSubscriptionEmail(email) {
  try {
    console.log(`📧 Sending subscription email to: ${email}`);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        email: email,
        type: "subscription",
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Successfully sent to ${email}`);
      console.log(`   ${result.message || "Email sent"}\n`);
      return { email, success: true, message: result.message };
    } else {
      console.error(`❌ Failed to send to ${email}`);
      console.error(`   Error: ${result.error || "Unknown error"}`);
      if (result.details) console.error(`   Details: ${result.details}`);
      console.error("");
      return { email, success: false, error: result.error };
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}\n`);
    return { email, success: false, error: error.message };
  }
}

async function main() {
  console.log("🚀 Yookatale Subscription Email Sender\n");
  console.log(`📡 API: ${API_URL}`);
  console.log(`📧 From: info@yookatale.app`);
  console.log(`📧 Template: subscriptionEmailTemplate\n`);
  
  const serverReady = await waitForServer();
  if (!serverReady) {
    console.error("\n❌ Cannot proceed - server is not running");
    console.error("   Please start the server manually:");
    console.error("   cd yookatale-app/frontend");
    console.error("   npm run dev\n");
    process.exit(1);
  }
  
  console.log("📤 Sending emails...\n");
  
  const results = [];
  for (let i = 0; i < testEmails.length; i++) {
    const result = await sendSubscriptionEmail(testEmails[i]);
    results.push(result);
    
    if (i < testEmails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${testEmails.length}`);
  console.log(`❌ Failed: ${failed}/${testEmails.length}\n`);
  
  results.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.success ? "✅" : "❌"} ${r.email}`);
  });
  
  console.log("\n" + "=".repeat(60) + "\n");
  
  if (successful === testEmails.length) {
    console.log("🎉 All emails sent successfully!");
  }
}

main().catch(console.error);
