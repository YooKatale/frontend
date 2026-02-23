/**
 * Generates public/firebase-messaging-sw.js from env vars at build time.
 * Run before "next build" so the service worker has config without committing keys.
 * Loads .env.local and .env (simple parse) so env is available when run via "node scripts/generate-firebase-sw.js".
 */
const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const idx = trimmed.indexOf("=");
        if (idx > 0) {
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      }
    });
  } catch (_) {
    // file missing or unreadable
  }
}

const root = path.resolve(__dirname, "..");
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const templatePath = path.join(root, "public", "firebase-messaging-sw.template.js");
const outPath = path.join(root, "public", "firebase-messaging-sw.js");

const vars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

let content;
try {
  content = fs.readFileSync(templatePath, "utf8");
} catch (e) {
  console.warn("scripts/generate-firebase-sw.js: firebase-messaging-sw.template.js not found, skipping.");
  process.exit(0);
}

Object.entries(vars).forEach(([key, value]) => {
  content = content.replace(new RegExp("__" + key + "__", "g"), value.replace(/\\/g, "\\\\").replace(/"/g, '\\"'));
});

fs.writeFileSync(outPath, content, "utf8");
console.log("Generated public/firebase-messaging-sw.js from env.");
