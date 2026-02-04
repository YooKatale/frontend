/**
 * Send subscription emails to all addresses in emailnew.csv
 * Run: node send-subscription-batch.js [startIndex]
 *   startIndex = optional (e.g. 477 to resume from email #477)
 * With Next.js dev server running.
 */

const fs = require("fs");
const path = require("path");

const CSV_PATHS = [
  path.join(__dirname, "..", "..", "emailnew.csv"),
  path.join(__dirname, "emailnew.csv"),
  path.resolve(process.cwd(), "emailnew.csv"),
];

const DELAY_MS = 2000;           // 2s between each email (reduces rate-limit)
const BATCH_SIZE = 40;            // every N emails...
const BATCH_PAUSE_MS = 90000;    // ...pause 90s (SMTP cooldown)
const MAX_RETRIES = 3;           // retry each failed email up to 3 times
const RETRY_DELAYS_MS = [5000, 15000, 45000]; // backoff: 5s, 15s, 45s
const REQUEST_TIMEOUT_MS = 35000;

function loadEmailsFromCsv() {
  for (const p of CSV_PATHS) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf8");
      const lines = content.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      const emails = lines.slice(1).filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
      return { emails, path: p };
    }
  }
  return null;
}

const PORTS = [3000, 3001];

async function sendOne(baseUrl, email) {
  const res = await fetch(`${baseUrl}/api/mail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, type: "subscription" }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const data = await res.json().catch(() => ({}));
  return {
    email,
    ok: res.ok,
    message: data.message || data.error,
    details: data.details,
  };
}

async function main() {
  const startIndex = parseInt(process.argv[2], 10) || 0;

  const loaded = loadEmailsFromCsv();
  if (!loaded) {
    console.error("❌ emailnew.csv not found.");
    process.exit(1);
  }
  const { emails: ALL_EMAILS, path: csvPath } = loaded;
  const SUBSCRIPTION_EMAILS = ALL_EMAILS.slice(startIndex);
  const total = SUBSCRIPTION_EMAILS.length;
  const offset = startIndex;

  if (total === 0) {
    console.log("Nothing to send (startIndex >= list length).");
    return;
  }

  console.log("📂 Loaded", ALL_EMAILS.length, "emails from", path.basename(csvPath));
  if (offset > 0) console.log("▶️  Resuming from index", offset, "(", total, "remaining )\n");

  let baseUrl = null;
  for (const port of PORTS) {
    try {
      const r = await fetch(`http://localhost:${port}`, { method: "HEAD", signal: AbortSignal.timeout(3000) });
      if (r.ok || r.status < 500) {
        baseUrl = `http://localhost:${port}`;
        break;
      }
    } catch (_) {}
  }
  if (!baseUrl) {
    console.error("❌ Dev server not running. Start with: npm run dev");
    process.exit(1);
  }

  console.log("🚀 Sending to", total, "addresses (delay", DELAY_MS + "ms, pause every", BATCH_SIZE, "emails)\n");

  const results = [];
  for (let i = 0; i < total; i++) {
    const email = SUBSCRIPTION_EMAILS[i];
    const num = offset + i + 1;
    process.stdout.write(`[${num}/${ALL_EMAILS.length}] ${email} ... `);

    let lastError = null;
    let ok = false;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const r = await sendOne(baseUrl, email);
        lastError = r;
        if (r.ok) {
          ok = true;
          results.push({ email, ok: true });
          console.log("✅");
          break;
        }
        if (attempt < MAX_RETRIES - 1) {
          const wait = RETRY_DELAYS_MS[attempt];
          process.stdout.write(`retry in ${wait / 1000}s ... `);
          await new Promise((r) => setTimeout(r, wait));
        } else {
          results.push({ email, ok: false, message: r.message, details: r.details });
          console.log("❌", r.message || "", r.details ? r.details : "");
        }
      } catch (e) {
        lastError = e;
        if (attempt < MAX_RETRIES - 1) {
          const wait = RETRY_DELAYS_MS[attempt];
          process.stdout.write(`retry in ${wait / 1000}s ... `);
          await new Promise((r) => setTimeout(r, wait));
        } else {
          results.push({ email, ok: false, message: e.message });
          console.log("❌", e.message);
        }
      }
    }

    if (i < total - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
      if ((i + 1) % BATCH_SIZE === 0 && i + 1 < total) {
        console.log("\n⏸️  Pausing", BATCH_PAUSE_MS / 1000, "s to avoid rate limit ...\n");
        await new Promise((r) => setTimeout(r, BATCH_PAUSE_MS));
      }
    }
  }

  const okCount = results.filter((r) => r.ok).length;
  console.log("\n" + "=".repeat(50));
  console.log("✅ Sent:", okCount + "/" + total);
  console.log("=".repeat(50));
}

main().catch(console.error);
