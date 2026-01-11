// Firebase Cloud Messaging Service Worker
// This file must be in the public folder and named exactly: firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// Firebase configuration - Must match yookatale-aa476 project for VAPID key to work
const firebaseConfig = {
  apiKey: "AIzaSyC-7kaqMQSnWTywa0oz3IfMWPP7yS6GrJA",
  authDomain: "yookatale-aa476.firebaseapp.com",
  databaseURL: "https://yookatale-aa476-default-rtdb.firebaseio.com",
  projectId: "yookatale-aa476",
  storageBucket: "yookatale-aa476.appspot.com",
  messagingSenderId: "1091927934214",
  appId: "1:1091927934214:web:1a02f21b6eb03f96f0ca87",
  measurementId: "G-2YYF0QCSRV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages (when app is closed)
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);
  console.log("[SW] Payload notification:", payload.notification);
  console.log("[SW] Payload data:", payload.data);

  // Extract notification data from payload
  // FCM sends notifications in payload.notification (for display) and payload.data (for app logic)
  const notificationTitle = payload.notification?.title || payload.data?.title || "YooKatale";
  const notificationBody = payload.notification?.body || payload.data?.body || "You have a new notification";
  
  // Use absolute URLs for icons (required for background notifications) - Use YooKatale original logo
  // Using logo2.png which is the YooKatale logo, or fallback to logo if logo1 doesn't exist
  const iconUrl = "https://www.yookatale.app/assets/icons/logo2.png";
  const badgeUrl = "https://www.yookatale.app/assets/icons/logo2.png";
  
  // Get URL from various possible locations in payload
  const notificationUrl = payload.data?.url || 
                         payload.data?.click_action || 
                         payload.fcmOptions?.link || 
                         payload.webpush?.fcmOptions?.link ||
                         "https://www.yookatale.app/schedule";
  
  const notificationOptions = {
    body: notificationBody,
    icon: iconUrl,
    badge: badgeUrl,
    image: payload.notification?.image || payload.data?.image || undefined,
    tag: payload.data?.mealType || payload.data?.tag || "yookatale-notification",
    requireInteraction: false,
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
    silent: false,
    renotify: true,
    data: {
      url: notificationUrl,
      mealType: payload.data?.mealType || '',
      click_action: notificationUrl,
      title: notificationTitle,
      body: notificationBody,
    },
    actions: [
      {
        action: 'open',
        title: 'View Schedule',
        icon: iconUrl,
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  console.log("[SW] Showing notification:", notificationTitle);
  console.log("[SW] Notification options:", notificationOptions);
  
  // Show notification - this is critical for popups
  return self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log("[SW] ✅ Notification displayed successfully");
    })
    .catch((error) => {
      console.error("[SW] ❌ Error showing notification:", error);
      // Try again with minimal options if full options fail
      return self.registration.showNotification(notificationTitle, {
        body: notificationBody,
        icon: iconUrl,
        data: { url: notificationUrl }
      });
    });
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // If a window is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          const url = event.notification.data?.url || event.notification.data?.click_action || "https://www.yookatale.app/";
          return clients.openWindow(url);
        }
      })
  );
});

