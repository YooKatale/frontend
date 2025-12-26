/**
 * Firebase Cloud Messaging (FCM) Service
 * Handles FCM token management and push notifications
 */

import { messaging, getToken, onMessage } from "@lib/firebase";
import { sendMealNotification } from "./mealNotificationService";

// VAPID key for FCM (get this from Firebase Console > Project Settings > Cloud Messaging)
const VAPID_KEY = process.env.NEXT_PUBLIC_FCM_VAPID_KEY || "BH0MtpHAEnVacRrstRBYcn8Mot0rJrtWeoNk9TVeVwEtgjDmzJC1iMbH8eSLNlyz7Q1aGhVeCuFeXsTD2CYrqIA";

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Get FCM token for the current user
 */
export async function getFCMToken() {
  try {
    if (typeof window === "undefined") {
      console.log("Window is not available (server-side)");
      return null;
    }

    if (!messaging) {
      console.error("Firebase Messaging is not initialized");
      return null;
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log("Notification permission denied");
      return null;
    }

    // Get registration token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
    return null;
  }
}

/**
 * Save FCM token to server
 */
export async function saveFCMTokenToServer(token, userInfo) {
  try {
    // Send token to your backend server
    const response = await fetch("https://yookatale-server-app.onrender.com/admin/web_push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        userId: userInfo?._id,
        email: userInfo?.email,
        type: "fcm",
      }),
    });

    if (response.ok) {
      console.log("FCM token saved to server");
      return true;
    } else {
      console.error("Failed to save FCM token to server");
      return false;
    }
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return false;
  }
}

/**
 * Listen for foreground messages (when app is open)
 */
export function setupForegroundMessageListener(userInfo) {
  if (typeof window === "undefined") {
    console.log("Window is not available (server-side)");
    return;
  }

  if (!messaging) {
    console.error("Firebase Messaging is not initialized");
    return;
  }

  onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);

    // Show notification
    if (payload.notification) {
      const { title, body, icon } = payload.notification;
      
      // Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body: body,
          icon: icon || "/assets/icons/logo2.png",
          badge: "/assets/icons/logo2.png",
          tag: payload.data?.mealType || "meal-notification",
          data: {
            url: payload.data?.url || "/subscription",
            mealType: payload.data?.mealType,
          },
        });
      }

      // Send email/SMS/WhatsApp notification based on user preferences
      if (userInfo && payload.data?.mealType) {
        sendMealNotification(userInfo, payload.data.mealType);
      }
    }
  });
}

/**
 * Initialize FCM for the user
 */
export async function initializeFCM(userInfo) {
  try {
    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getFCMToken();
    if (token) {
      // Save token to server
      await saveFCMTokenToServer(token, userInfo);
      
      // Setup foreground message listener
      setupForegroundMessageListener(userInfo);
      
      return token;
    }

    return null;
  } catch (error) {
    console.error("Error initializing FCM:", error);
    return null;
  }
}

