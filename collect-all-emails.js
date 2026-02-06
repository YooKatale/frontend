/**
 * Collect all emails from all sources and merge into emailnew.csv
 * Run: node collect-all-emails.js
 */

const fs = require("fs");
const path = require("path");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return emailRegex.test(email.trim()) && email.trim().length <= 254;
}

// Set to store unique emails (case-insensitive)
const emailSet = new Set();

// Function to add emails from an array
function addEmailsFromArray(emails) {
  emails.forEach(email => {
    if (isValidEmail(email)) {
      emailSet.add(email.trim().toLowerCase());
    }
  });
}

// Function to add emails from CSV file
function addEmailsFromCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  
  // Skip header if it exists
  const startIndex = lines[0] && lines[0].toLowerCase().includes('email') ? 1 : 0;
  
  lines.slice(startIndex).forEach(line => {
    // Handle comma-separated emails in a single line
    const emails = line.split(',').map(e => e.trim()).filter(Boolean);
    emails.forEach(email => {
      if (isValidEmail(email)) {
        emailSet.add(email.toLowerCase());
      }
    });
  });
  
  console.log(`✅ Loaded ${lines.length - startIndex} emails from ${path.basename(filePath)}`);
}

// 1. Load from emailnew.csv (frontend/public)
const csvPath1 = path.join(__dirname, "public", "emailnew.csv");
addEmailsFromCsv(csvPath1);

// 2. Load from emailnew.csv (root)
const csvPath2 = path.join(__dirname, "..", "..", "emailnew.csv");
addEmailsFromCsv(csvPath2);

// 3. Load VC emails from send-vc-batch.js
const vcEmails = [
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
addEmailsFromArray(vcEmails);
console.log(`✅ Loaded ${vcEmails.length} VC emails`);

// 4. Load batch emails from send-batch-emails.js
const batchEmails = [
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
addEmailsFromArray(batchEmails);
console.log(`✅ Loaded ${batchEmails.length} batch emails`);

// 5. Load emails from constants.js
const constantsEmails = [
  "abenakyonaomi@gmail.com",
  "aggy0703@yahoo.com",
  "akibric@gmail.com",
  "anywar234@gmail.com",
  "asaphnuwagaba183@gmail.com",
  "atwineflavia@outlook.com",
  "ayikorujoan1629@gmail.com",
  "batwagainenasser@gmail.com",
  "birungilisa101@gmail.com",
  "blessingkasiita256@gmail.com",
  "brian.raymond1@gmail.com",
  "bridgetangel289@gmail.com",
  "calebkamana626@gmail.com",
  "catherinenamungoma2@gmail.com",
  "ceaserssekimpi4@gmail.com",
  "chukwunenyeemmanuelokoro@gmail.com",
  "cindypirani@gmail.com",
  "derrickkirabo2333@gmail.com",
  "derricksupreme05@gmail.com",
  "dnalubaale@gmail.com",
  "edinaatuhura2@gmail.com",
  "elizabethnassolo52@gmail.com",
  "emmawebusa@gmail.com",
  "esumaisaac3@gmail.com",
  "fibiyiga@gmail.com",
  "giramiakevin08@gmail.com",
  "gloriaapio575@gmail.com",
  "hello@unitedsocialventures.org",
  "hiraxjosh016@gmail.com",
  "hunrikky@gmail.com",
  "ivanoede18@gmail.com",
  "joramwanderas@gmail.com",
  "joramyiga@gmail.com",
  "juniorbromy@gmail.com",
  "lex.alek@gmail.com",
  "lubegajoel54@gmail.com",
  "masigaemmanuel67@gmail.com",
  "maxmaya542@gmail.com",
  "morynchadhash@gmail.com",
  "muhiirwemo@gmail.com",
  "muwanguziemmanuel890@gmail.com",
  "mwakaronald5@gmail.com",
  "naluggwapauline@gmail.com",
  "namalejosephine16@gmail.com",
  "namatovugidha@gmail.com",
  "nambozosharon21@gmail.com",
  "nantegeruth@gmail.com",
  "naomeaguti3@gmail.com",
  "natashasarah720@gmail.com",
  "nenakitende@gmail.com",
  "nickrogers793@gmail.com",
  "nkinzie9000@gmail.com",
  "nmwajjuma@gmail.com",
  "nr116563@students.cavendish.ac.ug",
  "ocularonnie@gmail.com",
  "olukasamuel557@gmail.com",
  "orishabajustine58@gmail.com",
  "Packsjesse@gmail.com",
  "pamela.namara025@gmail.com",
  "peruthnamugaya@gmail.com",
  "phionanamuyaba2000@gmail.com",
  "pridelagum@gmail.com",
  "ramah.cher82@gmail.com",
  "rndagire1402@gmail.com",
  "rossettetrisa@gmail.com",
  "ruthkalembe@yahoo.com",
  "samanthabarbra6@gmail.com",
  "samuelesterban@gmail.com",
  "starkshoward00@gmail.com",
  "tashajulian803@gmail.com",
  "tracybarie@gmail.com",
  "tumusiimed319@gmail.com",
  "valentinalceaser@gmail.com",
  "winnieamanda2015@gmail.com",
];
addEmailsFromArray(constantsEmails);
console.log(`✅ Loaded ${constantsEmails.length} emails from constants.js`);

// 6. Add test emails that were sent
const testEmails = [
  "timothy.arihoz@protonmail.com",
  "yookatale256@gmail.com",
  "arihotimothy89@gmail.com",
];
addEmailsFromArray(testEmails);
console.log(`✅ Loaded ${testEmails.length} test emails`);

// Convert Set to sorted array
const allEmails = Array.from(emailSet).sort();

console.log(`\n📊 Total unique emails collected: ${allEmails.length}`);

// Write to emailnew.csv
const outputPath = path.join(__dirname, "public", "emailnew.csv");
const csvContent = "Email\n" + allEmails.join("\n") + "\n";

fs.writeFileSync(outputPath, csvContent, "utf8");
console.log(`\n✅ Successfully wrote ${allEmails.length} unique emails to ${outputPath}`);

// Also write to root emailnew.csv
const rootOutputPath = path.join(__dirname, "..", "..", "emailnew.csv");
fs.writeFileSync(rootOutputPath, csvContent, "utf8");
console.log(`✅ Also wrote to ${rootOutputPath}`);

console.log("\n✨ Done! All emails have been collected and deduplicated.");
