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
      // Don't log full token - security risk
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log("FCM Token obtained (hidden in production)");
      }
      return token;
    } else {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log("No registration token available. Request permission to generate one.");
      }
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yookatale-server.onrender.com";
    
    // Don't log token or sensitive info - security risk
    // Only log minimal info in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Saving FCM token to server...");
    }
    
    const response = await fetch(`${backendUrl}/admin/web_push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        token: token,
        userId: userInfo?._id || null,
        email: userInfo?.email || null,
        type: "fcm",
      }),
    });

    if (response.ok) {
      // Don't log full response - may contain sensitive data
      // Only log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log("FCM token saved successfully");
      }
      return true;
    } else {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        const errorText = await response.text();
        console.warn("Failed to save FCM token:", response.status);
      }
      return false;
    }
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn("Error saving FCM token:", error.message);
    }
    return false;
  }
}

/**
 * Listen for foreground messages (when app is open)
 */
export function setupForegroundMessageListener(userInfo) {
  if (typeof window === "undefined") {
    return;
  }

  if (!messaging) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Firebase Messaging is not initialized");
    }
    return;
  }

  onMessage(messaging, (payload) => {
    // Don't log full payload - may contain sensitive data
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Message received in foreground");
    }

    // Extract notification data - check both payload.notification and payload.data
    const notificationTitle = payload.notification?.title || payload.data?.title || "YooKatale";
    const notificationBody = payload.notification?.body || payload.data?.body || "You have a new notification";
    
    // Show browser notification when app is in foreground
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notification = new Notification(notificationTitle, {
          body: notificationBody,
          icon: payload.notification?.icon || payload.data?.icon || "/assets/icons/logo2.png",
          badge: "/assets/icons/logo2.png",
          tag: payload.data?.mealType || "meal-notification",
          requireInteraction: false,
          vibrate: [200, 100, 200],
          data: {
            url: payload.data?.url || "/schedule",
            mealType: payload.data?.mealType,
          },
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          const url = payload.data?.url || payload.fcmOptions?.link || "/schedule";
          window.open(url, '_blank');
          notification.close();
        };

        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log("Foreground notification displayed");
        }
      } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error displaying foreground notification:", error.message);
        }
      }
    }

    // Send email/SMS/WhatsApp notification based on user preferences
    if (userInfo && payload.data?.mealType) {
      try {
        sendMealNotification(userInfo, payload.data.mealType);
      } catch (error) {
        console.error("❌ Error sending meal notification:", error);
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

    // Check platform support (don't log - may expose device info)
    const platformInfo = checkPlatformSupport();
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Platform info checked");
    }

    // Request notification permission
    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log("Notification permission denied");
      return null;
    }

    // Register Firebase messaging service worker only when FCM is available
    if ("serviceWorker" in navigator && messaging) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const hasFirebaseSW = registrations.some(
          (reg) => reg.active?.scriptURL?.includes("firebase-messaging-sw")
        );

        if (!hasFirebaseSW) {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
          });
          if (process.env.NODE_ENV === "development") {
            console.log("✅ Firebase messaging service worker registered");
          }
        }
      } catch (swError) {
        if (process.env.NODE_ENV === "development") {
          console.warn("⚠️ Service worker registration warning:", swError);
        }
      }
    }

    // Get FCM token
    const token = await getFCMToken();
    if (token) {
      // Don't log token - security risk
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log("FCM token obtained successfully");
      }
      
      // Save token to server so backend can send notifications
      const tokenSaved = await saveFCMTokenToServer(token, userInfo);
      if (!tokenSaved && process.env.NODE_ENV === 'development') {
        console.warn("FCM token not saved - notifications may not work");
      }
      
      // Setup foreground message listener (for when app is open)
      setupForegroundMessageListener(userInfo);
      
      return token;
    } else {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn("Could not get FCM token - notifications will not work");
      }
      return null;
    }
  } catch (error) {
    console.error("❌ Error initializing FCM:", error);
    return null;
  }
}

