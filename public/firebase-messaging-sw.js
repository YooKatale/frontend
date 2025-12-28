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

  // Extract notification data from payload
  // FCM sends notifications in payload.notification (for display) and payload.data (for app logic)
  const notificationTitle = payload.notification?.title || payload.data?.title || "YooKatale";
  const notificationBody = payload.notification?.body || payload.data?.body || "You have a new notification";
  
  // Use absolute URLs for icons (required for background notifications)
  const iconUrl = payload.notification?.icon || payload.data?.icon || "https://www.yookatale.app/assets/icons/logo2.png";
  const badgeUrl = "https://www.yookatale.app/assets/icons/logo2.png";
  
  const notificationOptions = {
    body: notificationBody,
    icon: iconUrl,
    badge: badgeUrl,
    image: payload.notification?.image || payload.data?.image || undefined, // Large image for rich notifications
    tag: payload.data?.mealType || payload.notification?.tag || "yookatale-notification",
    requireInteraction: false, // Don't require user interaction (auto-dismiss)
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
    silent: false, // Make sure notifications make sound
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || "https://www.yookatale.app/schedule",
      mealType: payload.data?.mealType,
      click_action: payload.data?.url || payload.fcmOptions?.link || "https://www.yookatale.app/schedule",
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: iconUrl,
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  console.log("[SW] Showing notification:", notificationTitle, notificationOptions);
  
  return self.registration.showNotification(notificationTitle, notificationOptions).catch((error) => {
    console.error("[SW] Error showing notification:", error);
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

