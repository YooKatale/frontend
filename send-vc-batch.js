/**
 * Send subscription emails ONLY to the VC/investor emails provided
 * Run: node send-vc-batch.js (with Next.js dev server running)
 */

const VC_EMAILS = [
  "africa@partechpartners.com",
  "bp@yunqi.vc",
  "charlie@castironvc.com",
  "contact@globalfounderscapital.com",
  "contact@greenoaks.com",
  "contact@oriosvp.com",
  "contact@quona.com",
  "contact@swayvc.com",
  "contacto@imantia.com",
  "cooperation@idgcapital.com",
  "enquiries@assetzcapital.co.uk",
  "enquiries@businessgrowthfund.co.uk",
  "felamine@investcorp.com",
  "fundenquiries@mmc.vc",
  "gcinfo@generalcatalyst.com",
  "harshad@ahventures.in",
  "hello@ludlowventures.com",
  "hello@startupdisrupt.com",
  "hi@cosmicvp.com",
  "hi@k2vc.com",
  "inbound@insightpartners.com",
  "info@500.co",
  "info@agdevco.com",
  "info@andcuevas.com",
  "info@b.capital",
  "info@cairoangels.com",
  "info@firestartr.co",
  "info@firstround.com",
  "info@flexcapital.com",
  "info@fsdafrica.org",
  "info@ftcapitalpartners.com",
  "info@gpalminvestments.com",
  "info@indianangelnetwork.com",
  "info@kaporcapital.com",
  "info@lsvp.com",
  "info@madisonrealtycapital.com",
  "info@mayfield.com",
  "info@monroecap.com",
  "info@mosleyventures.com",
  "info@obvious.com",
  "info@octopusventures.com",
  "info@pearlcapital.net",
  "info@startupwiseguys.com",
  "info@tlcomcapital.com",
  "info@troweprice.com",
  "info@truckeecraftventures.com",
  "info@venturefuel.net",
  "info@vision-ridge.com",
  "info@vivocapital.com",
  "infoinvestissement@fondsftq.com",
  "inquiries@accel-kkr.com",
  "inquiry@bequiasecurities.com",
  "invest@acumen.org",
  "investors@northleafcapital.com",
  "iR@apollo.com",
  "japaninfo@cornwallcapital.com",
  "jd@smartmoneyventures.com",
  "johrenk7@gmail.com",
  "judith.flynn@prudential.com",
  "Laurel@hcp.com",
  "mail@collercapital.com",
  "media@carlyle.com",
  "news@adventinternational.com",
  "office.ceohq@gmail.com",
  "paulgregory0000@gmail.com",
  "portfolio@foundersfund.com",
  "post@voxtra.org",
  "press@eqtpartners.com",
  "press@pnptc.com",
  "press@signalfire.com",
  "privacy@blueowl.com",
  "rose@localglobe.vc",
  "submissions@lsvp.com",
  "tc@tiantu.com.cn",
  "team@leapfroginvest.com",
  "trent.vichie@gmail.com",
  "vc@ifc.org",
  "venture.capital@rtaventures.com",
  "venturelab@accion.org",
  "vichie@stonepeakpartners.com",
  "y.usmanbekova@uzcard.uz",
];

const DELAY_MS = 2000;
const BATCH_SIZE = 40;
const BATCH_PAUSE_MS = 90000;
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [5000, 15000, 45000];
const REQUEST_TIMEOUT_MS = 35000;
const PORTS = [3000, 3001];

async function sendOne(baseUrl, email) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}/api/mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "subscription" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await res.json().catch(() => ({}));
    return {
      email,
      ok: res.ok,
      message: data.message || data.error,
      details: data.details,
    };
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

async function main() {
  const total = VC_EMAILS.length;
  console.log("🚀 Sending subscription emails to", total, "VC/investor addresses\n");

  let baseUrl = null;
  for (const port of PORTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const r = await fetch(`http://localhost:${port}`, { method: "HEAD", signal: controller.signal });
      clearTimeout(timeoutId);
      if (r.ok || r.status < 500) {
        baseUrl = `http://localhost:${port}`;
        break;
      }
    } catch (e) {
      // Try next port
    }
  }
  if (!baseUrl) {
    // Try a test send to determine which port works
    for (const port of PORTS) {
      try {
        const testRes = await fetch(`http://localhost:${port}/api/mail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@test.com", type: "subscription" }),
        });
        if (testRes.status !== 404) {
          baseUrl = `http://localhost:${port}`;
          break;
        }
      } catch (_) {}
    }
  }
  if (!baseUrl) {
    console.error("❌ Dev server not running. Start with: npm run dev");
    process.exit(1);
  }
  console.log("✅ Server found at", baseUrl, "\n");

  const results = [];
  for (let i = 0; i < total; i++) {
    const email = VC_EMAILS[i];
    process.stdout.write(`[${i + 1}/${total}] ${email} ... `);

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
