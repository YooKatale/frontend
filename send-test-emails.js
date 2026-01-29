/**
 * Script to send test subscription emails
 * Run with: node send-test-emails.js
 * 
 * Note: Make sure your Next.js dev server is running on port 3000
 * Run: npm run dev
 */

// Use node-fetch if available, otherwise use global fetch (Node 18+)
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  fetch = globalThis.fetch;
}

const testEmails = [
  "arihotimothy89@gmail.com",
  "timothy.arihoz@protonmail.com",
  "yookatale256@gmail.com"
];

const API_URL = process.env.API_URL || "http://localhost:3000/api/mail";

async function sendTestEmail(email) {
  try {
    console.log(`📧 Sending subscription email to: ${email}`);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        type: "subscription",
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Successfully sent to ${email}`);
      console.log(`   Message: ${result.message || "Email sent"}`);
    } else {
      console.error(`❌ Failed to send to ${email}`);
      console.error(`   Error: ${result.error || "Unknown error"}`);
      console.error(`   Details: ${result.details || "No details"}`);
    }
    
    return { email, success: response.ok, result };
  } catch (error) {
    console.error(`❌ Error sending to ${email}:`, error.message);
    return { email, success: false, error: error.message };
  }
}

async function sendAllTestEmails() {
  console.log("🚀 Starting to send test emails...\n");
  console.log(`📡 API URL: ${API_URL}\n`);
  
  const results = [];
  
  for (const email of testEmails) {
    const result = await sendTestEmail(email);
    results.push(result);
    
    // Wait 1 second between emails to avoid rate limiting
    if (testEmails.indexOf(email) < testEmails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log("\n📊 Summary:");
  console.log("=" .repeat(50));
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("\n📧 Results:");
  results.forEach(({ email, success }) => {
    console.log(`   ${success ? "✅" : "❌"} ${email}`);
  });
}

// Run the script
sendAllTestEmails().catch(console.error);
