/**
 * Send subscription emails to the provided batch
 * Run: node send-batch-emails.js (with Next.js dev server running)
 */

const BATCH_EMAILS = [
  "ajts@gmail.com",
  "ajueyitsihelen2018@yahoo.com",
  "alphatoursandtravel2@gmail.com",
  "amurimuhindo23@gmail.com",
  "amutabi@gmail.com",
  "anitamuhairwe@gmail.com",
  "anneabaho@gmail.com",
  "arboridia@gmail.com",
  "bahatijohnbosco0@gmail.com",
  "bakerlwanga@yahoo.com",
  "barakalexham2@gmail.com",
  "bbamanya.lynn5@gmail.com",
  "ben.odoki@gmail.com",
  "binkagodfrey@gmail.com",
  "biolakz@yahoo.com",
  "bisherurwa@outlook.com",
  "bolusteve2002@yahoo.com",
  "chakato@gmail.com",
  "cheteob@yahoo.com",
  "chewachong01@gmail.com",
  "clement_lutaaya@yahoo.com",
  "cmuweesi@gmail.com",
  "collegemhc@gmail.com",
  "d.p.mirembe@gmail.com",
  "dabgarf42@gmail.com",
  "dakwango@gmail.com",
  "ddungustanley@gmail.com",
  "deborah.jegede.2017@gmail.com",
  "dkakeeto@gmail.com",
  "donenotoo@gmail.com",
  "dpmirembe@gmail.com",
  "dropoffcouriers23@gmail.com",
  "drpbcandler@gmail.com",
  "dssebuggwawo@gmail.com",
  "duukirich@gmail.com",
  "e.edromal@gmail.com",
  "edentendo@gmail.com",
  "elijahkihooto@yahoo.com",
  "emurongo@gmail.com",
  "eton.marus@gmail.com",
  "evaristank@gmail.com",
  "f.kasekende2012@gmail.com",
  "fredericks.dennis@gmail.com",
  "fredsekindi@gmail.com",
  "funbose@gmail.com",
  "gamemose94@gmail.com",
  "gkirungi@gmail.com",
  "gloria.longbaam@chuss.mak.ac.ug",
  "glorinice@yahoo.com",
  "godfreysundayonekalit@outlook.com",
  "happymartstore1@gmail.com",
  "hbuwule@ndejjeuniversity.ac.ug",
  "hildakyobe@gmail.com",
  "hmpogole@yahoo.com",
  "idibayow@gmail.com",
  "imokola@gmail.com",
  "japoamasuomo@gmail.com",
  "jbukirwa12@gmail.com",
  "jonpkasujja@gmail.com",
  "joshuamugane6@gmail.com",
  "judelubega@gmail.com",
  "judlub@gmail.com",
  "kabuukadeo@gmail.com",
  "kajuraannet2@gmail.com",
  "kalnegash@gmail.com",
  "kembabazidc@gmail.com",
  "kfrankpio@gmail.com",
  "kfrankpio@yahoo.com",
  "kibalmoses@gmail.com",
  "kjnathan5@gmail.com",
  "kknathanael@gmail.com",
  "krichardnelson@gmail.com",
  "latorach@gmail.com",
  "lawpointuganda@gmail.com",
  "lawsocietynkumbauniversity@gmail.com",
  "lenagod51@gmail.com",
  "ljsherjamayne@yahoo.com",
  "loinatukunda@gmail.com",
  "lrjamwani@gmail.com",
  "lulesimon2013@gmail.com",
  "maklawsociety50@gmail.com",
  "mandewm@gmail.com",
  "mandewm@yahoo.com",
  "manjusunil.vs@gmail.com",
  "marius.gatta@gmail.com",
  "masembekamaradi@gmail.com",
  "mauriceamutabi@gmail.com",
  "mondayirene@gmail.com",
  "mosesddumba@gmail.com",
  "muramu2001@yahoo.com",
  "najeeb.shebani@gmail.com",
  "nakabuyeannet694@gmail.com",
  "nakacwapatricia6@gmail.com",
  "namulemerobinah@gmail.com",
  "neddylinnet@gmail.com",
  "nnsereko@nkumbauniverity.ac.ug",
  "noahsendawula@nkumbauniversity.ac.ug",
  "nserekon@gmail.com",
  "nshabaruhangapraise@gmail.com",
  "nyaombayo@gmail.com",
  "ochienggodfrey123@gmail.com",
  "olazdesignhouse@gmail.com",
  "osapirijohnldp12@gmail.com",
  "owolegerald18@gmail.com",
  "padrekenkel@yahoo.com",
  "pakwelo@gmail.com",
  "peterbukenya90@gmail.com",
  "peterkayizzi1@gmail.com",
  "pulesamu@gmail.com",
  "rajaamoaiad@gmail.com",
  "rosettekaggwa@gmail.com",
  "rt.rev.dr.alfredolwa@gmail.com",
  "ruhagogm@gmail.com",
  "rus.tadz67@gmail.com",
  "sanyups@gmail.com",
  "sarah.atimango99@gmail.com",
  "sasiimwes@gmail.com",
  "shripad2008@gmail.com",
  "siribily2@gmail.com",
  "sokidavi@yahoo.com",
  "spawar335@gmail.com",
  "spnamubiru@gmail.com",
  "ssebuyungogeofrey@gmail.com",
  "stanfieldpp@gmail.com",
  "stephennamulengo@gmail.com",
  "studentsjournal2020@gmail.com",
  "suigenerislubogo@gmail.com",
  "tarek.dokhan@gmail.com",
  "theafricansistersnetwork@gmail.com",
  "thecampustimes.ug@gmail.com",
  "tkochumba@gmail.com",
  "trusoke@nkumbauniversity.ac.ug",
  "tuhaiserobert@gmail.com",
  "tumwesigyef7@gmail.com",
  "tusiime.chris20@gmail.com",
  "ulsajournal@gmail.com",
  "victorianyanzi@gmail.com",
  "walusimbi.peaceaidah@students.mak.ac.ug",
  "wokaka65@gmail.com",
  "writerdismas@gmail.com",
  "wummymak@gmail.com",
  "xaver.mbunda@gmail.com",
];

const DELAY_MS = 2000;
const BATCH_SIZE = 40;
const BATCH_PAUSE_MS = 90000;
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [5000, 15000, 45000];
const REQUEST_TIMEOUT_MS = 35000;
const PORTS = [3000, 3001];
const START_INDEX = 38; // Start from beginning (change to resume from a specific email)

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
  const total = BATCH_EMAILS.length;
  const startIndex = START_INDEX || 0;
  const remaining = total - startIndex;
  console.log("🚀 Sending subscription emails starting from email", startIndex + 1);
  console.log("📧 Remaining emails to send:", remaining, "out of", total, "total\n");

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
  for (let i = startIndex; i < total; i++) {
    const email = BATCH_EMAILS[i];
    const emailNumber = i + 1;
    process.stdout.write(`[${emailNumber}/${total}] ${email} ... `);

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
      const emailsSentFromStart = i + 1 - startIndex;
      if (emailsSentFromStart > 0 && emailsSentFromStart % BATCH_SIZE === 0 && i + 1 < total) {
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
