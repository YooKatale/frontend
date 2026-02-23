import { initializeApp, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// All Firebase config must come from env to avoid committing keys. Set in .env.local and in your host (e.g. Vercel).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

let app = null;
let storage = null;
let db = null;

if (typeof window !== "undefined" && firebaseConfig.apiKey) {
  try {
    app = getApp();
  } catch {
    app = initializeApp(firebaseConfig);
  }
  storage = getStorage(app);
  db = getDatabase(app);
}

export { storage, db };

// Initialize Firebase Cloud Messaging (client only). Do not use `messaging` directly—
// use getMessagingSafe() so callers never pass undefined to getToken/onMessage.
let messaging = null;
if (typeof window !== "undefined" && app && firebaseConfig.apiKey) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Firebase Messaging initialization skipped:", error?.message || error);
    }
    messaging = null;
  }
}

/** Returns messaging instance only when available; never pass its return value to getToken/onMessage without checking. */
export function getMessagingSafe() {
  if (typeof window === "undefined") return null;
  if (!app || !firebaseConfig.apiKey) return null;
  if (messaging != null) return messaging;
  try {
    messaging = getMessaging(app);
    return messaging;
  } catch (e) {
    return null;
  }
}

// Legacy export: prefer getMessagingSafe() and guard before use.
export { messaging, getToken, onMessage };
export default app;
