/**
 * Send test subscription emails using the existing /api/mail endpoint
 * This uses the exact same logic as NewsletterForm.jsx and signup page
 * 
 * Prerequisites:
 * 1. Make sure Next.js dev server is running: npm run dev
 * 2. EMAIL_PASSWORD should be in .env.local file (already configured)
 * 
 * Run: node send-subscription-emails.js
 */

// Use global fetch (Node 18+) or require node-fetch for older versions
let fetch;
try {
  fetch = globalThis.fetch;
} catch (e) {
  try {
    fetch = require('node-fetch');
  } catch (e2) {
    console.error('❌ fetch is not available. Please use Node.js 18+ or install node-fetch');
    process.exit(1);
  }
}

const testEmails = [
  "arihotimothy89@gmail.com",
  "timothy.arihoz@protonmail.com",
  "yookatale256@gmail.com"
];

const API_URL = "http://localhost:3000/api/mail";

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000", { method: "HEAD" });
    return response.ok || response.status < 500;
  } catch (error) {
    return false;
  }
}

// Send email using the same pattern as NewsletterForm.jsx
async function sendSubscriptionEmail(email) {
  try {
    console.log(`📧 Sending subscription email to: ${email}`);
    
    // Exact same pattern as NewsletterForm.jsx line 48-55
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        email: email,
        type: "subscription", // Uses subscriptionEmailTemplate
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Successfully sent to ${email}`);
      console.log(`   ${result.message || "Email sent successfully"}\n`);
      return { email, success: true, message: result.message };
    } else {
      console.error(`❌ Failed to send to ${email}`);
      console.error(`   Error: ${result.error || "Unknown error"}`);
      if (result.details) {
        console.error(`   Details: ${result.details}\n`);
      } else {
        console.error("");
      }
      return { email, success: false, error: result.error };
    }
  } catch (error) {
    console.error(`❌ Error sending to ${email}:`, error.message);
    console.error("");
    return { email, success: false, error: error.message };
  }
}

async function sendAllEmails() {
  console.log("🚀 Sending test subscription emails...\n");
  console.log(`📡 Using API: ${API_URL}`);
  console.log(`📧 Email sender: info@yookatale.app\n`);
  
  // Check if server is running
  console.log("⏳ Checking if server is running...");
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error("❌ Server is not running!");
    console.error("   Please start the dev server first:");
    console.error("   cd yookatale-app/frontend");
    console.error("   npm run dev");
    console.error("\n   Then wait for it to start and run this script again.\n");
    process.exit(1);
  }
  
  console.log("✅ Server is running!\n");
  
  const results = [];
  
  for (let i = 0; i < testEmails.length; i++) {
    const email = testEmails[i];
    const result = await sendSubscriptionEmail(email);
    results.push(result);
    
    // Wait 1 second between emails (except for the last one)
    if (i < testEmails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${testEmails.length}`);
  console.log(`❌ Failed: ${failed}/${testEmails.length}\n`);
  
  console.log("📧 Detailed Results:");
  results.forEach((result, index) => {
    const status = result.success ? "✅" : "❌";
    console.log(`   ${index + 1}. ${status} ${result.email}`);
    if (result.success && result.message) {
      console.log(`      → ${result.message}`);
    } else if (!result.success && result.error) {
      console.log(`      → Error: ${result.error}`);
    }
  });
  
  console.log("\n" + "=".repeat(60));
  
  if (successful === testEmails.length) {
    console.log("🎉 All emails sent successfully!");
  } else {
    console.log("⚠️  Some emails failed. Check the errors above.");
  }
  console.log("");
}

// Run
sendAllEmails().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
