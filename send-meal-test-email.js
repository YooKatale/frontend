/**
 * Send one meal reminder test email to timothy.arihoz@protonmail.com
 * Run: node send-meal-test-email.js (with Next.js dev server running on 3000 or 3001)
 */

const TEST_EMAIL = "timothy.arihoz@protonmail.com";
const PORTS = [3000, 3001];

async function send() {
  for (const port of PORTS) {
    try {
      const res = await fetch(`http://localhost:${port}/api/mail/send-meal-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: TEST_EMAIL, mealType: "lunch" }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await res.json();
      console.log("Port", port, ":", res.status, data);
      if (res.ok) {
        console.log("✅ Meal reminder test email sent to", TEST_EMAIL);
        return;
      }
    } catch (e) {
      console.log("Port", port, ":", e.message);
    }
  }
  console.log("❌ Could not send. Is the dev server running?");
}

send();
