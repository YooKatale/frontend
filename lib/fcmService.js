/**
 * Firebase Cloud Messaging (FCM) Service
 * Handles FCM token management and push notifications
 */

import { messaging, getToken, onMessage } from "@lib/firebase";
import { sendMealNotification } from "./mealNotificationService";

// VAPID key for FCM (Public Key from Firebase Console > Project Settings > Cloud Messaging)
const VAPID_KEY = process.env.NEXT_PUBLIC_FCM_VAPID_KEY || "BA2DeZkowyYHIGJsJ-_lpDmKUeOkeTsMcEqqDC3Ph91iV9ySI9DeB3ZU-nfMzwJgNJ04atoJNRDbwQ44DYZaa0g";

/**
 * Check platform support for push notifications
 */
export function checkPlatformSupport() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS16_4Plus = isIOS && (navigator.userAgent.includes('OS 16_') || navigator.userAgent.includes('OS 17_') || navigator.userAgent.includes('OS 18_'));
  
  return {
    isIOS,
    isSafari,
    isIOS16_4Plus,
    hasNotificationSupport: "Notification" in window,
    hasServiceWorkerSupport: "serviceWorker" in navigator,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || (window.navigator.standalone === true),
    needsHomeScreenInstall: isIOS && isSafari && !isIOS16_4Plus,
  };
}

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  const platformInfo = checkPlatformSupport();
  
  // iOS Safari requires Home Screen installation for web push (iOS 16.4+)
  if (platformInfo.isIOS && platformInfo.isSafari && !platformInfo.isStandalone) {
    console.warn("⚠️ iOS Safari: Web push notifications require the app to be added to Home Screen (iOS 16.4+)");
    // Still request permission - it will work once installed to Home Screen
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
    
    // Provide helpful error messages
    if (error.code === "messaging/token-subscribe-failed") {
      console.error("❌ FCM VAPID key authentication failed. Please:");
      console.error("1. Go to Firebase Console > Project Settings > Cloud Messaging");
      console.error("2. Generate or copy your Web Push certificate (VAPID key)");
      console.error("3. Add it to your .env.local file as: NEXT_PUBLIC_FCM_VAPID_KEY=your-vapid-key");
      console.error("4. Make sure Cloud Messaging API is enabled in your Firebase project");
    }
    
    return null;
  }
}

/**
 * Save FCM token to server
 * This saves the token so the backend can send push notifications via FCM
 */
export async function saveFCMTokenToServer(token, userInfo) {
  try {
    // Send token to your backend server
    // The backend should store this token and use it to send FCM notifications
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yookatale-server-app.onrender.com";
    const response = await fetch(`${backendUrl}/admin/web_push`, {
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
      console.log("✅ FCM token saved to server - backend can now send push notifications");
      return true;
    } else {
      const errorText = await response.text();
      console.error("⚠️ Failed to save FCM token to server:", errorText);
      return false;
    }
  } catch (error) {
    console.error("❌ Error saving FCM token:", error);
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
 * This sets up everything needed for push notifications that work even when app is closed
 */
export async function initializeFCM(userInfo) {
  try {
    // Check if browser supports notifications
    if (typeof window === "undefined") {
      console.log("Window is not available (server-side)");
      return null;
    }

    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return null;
    }

    // Check platform support and log info
    const platformInfo = checkPlatformSupport();
    console.log("📱 Platform info:", {
      platform: platformInfo.isIOS ? "iOS" : platformInfo.isSafari ? "Safari" : "Other",
      hasNotificationSupport: platformInfo.hasNotificationSupport,
      hasServiceWorkerSupport: platformInfo.hasServiceWorkerSupport,
      isStandalone: platformInfo.isStandalone,
      note: platformInfo.isIOS && platformInfo.isSafari && !platformInfo.isStandalone 
        ? "Add to Home Screen for iOS push support (iOS 16.4+)" 
        : "Full push notification support"
    });

    // Request notification permission
    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log("Notification permission denied");
      return null;
    }

    // Register Firebase messaging service worker if not already registered
    // FCM automatically looks for /firebase-messaging-sw.js
    if ("serviceWorker" in navigator) {
      try {
        // Check if firebase-messaging-sw.js is already registered
        const registrations = await navigator.serviceWorker.getRegistrations();
        const hasFirebaseSW = registrations.some(
          (reg) => reg.active?.scriptURL?.includes("firebase-messaging-sw")
        );

        if (!hasFirebaseSW) {
          // Register the Firebase messaging service worker
          await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
          });
          console.log("✅ Firebase messaging service worker registered");
        }
      } catch (swError) {
        console.warn("⚠️ Service worker registration warning:", swError);
        // Continue anyway - FCM might still work
      }
    }

    // Get FCM token
    const token = await getFCMToken();
    if (token) {
      console.log("✅ FCM token obtained:", token.substring(0, 20) + "...");
      
      // Save token to server so backend can send notifications
      await saveFCMTokenToServer(token, userInfo);
      
      // Setup foreground message listener (for when app is open)
      setupForegroundMessageListener(userInfo);
      
      return token;
    } else {
      console.warn("⚠️ Could not get FCM token");
      return null;
    }
  } catch (error) {
    console.error("❌ Error initializing FCM:", error);
    return null;
  }
}

