import { initializeApp, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC-7kaqMQSnWTywa0oz3IfMWPP7yS6GrJA",
  authDomain: "yookatale-aa476.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://yookatale-aa476-default-rtdb.firebaseio.com",
  projectId: "yookatale-aa476",
  storageBucket: "yookatale-aa476.appspot.com",
  messagingSenderId: "1091927934214",
  appId: "1:1091927934214:web:1a02f21b6eb03f96f0ca87",
  measurementId: "G-2YYF0QCSRV",
};

let app;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

export const storage = getStorage(app);
export const db = getDatabase(app);

// Initialize Firebase Cloud Messaging
let messaging = null;

if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Firebase Messaging initialization error:", error);
  }
}

export { messaging, getToken, onMessage };
export default app;
