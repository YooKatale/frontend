// Firebase Cloud Messaging Service Worker (generated at build from env - do not commit real keys)
// This file must be in the public folder and named exactly: firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// Firebase configuration - Injected at build from env (see scripts/generate-firebase-sw.js)
const firebaseConfig = {
  apiKey: "__NEXT_PUBLIC_FIREBASE_API_KEY__",
  authDomain: "__NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN__",
  databaseURL: "__NEXT_PUBLIC_FIREBASE_DATABASE_URL__",
  projectId: "__NEXT_PUBLIC_FIREBASE_PROJECT_ID__",
  storageBucket: "__NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET__",
  messagingSenderId: "__NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID__",
  appId: "__NEXT_PUBLIC_FIREBASE_APP_ID__",
  measurementId: "__NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID__"
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

  const notificationTitle = payload.notification?.title || payload.data?.title || "YooKatale";
  const notificationBody = payload.notification?.body || payload.data?.body || "You have a new notification";

  const iconUrl = "https://www.yookatale.app/assets/icons/logo2.png";
  const badgeUrl = "https://www.yookatale.app/assets/icons/logo2.png";

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
      { action: 'open', title: 'View Schedule', icon: iconUrl },
      { action: 'close', title: 'Close' },
    ],
  };

  console.log("[SW] Showing notification:", notificationTitle);
  return self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => { console.log("[SW] Notification displayed successfully"); })
    .catch((error) => {
      console.error("[SW] Error showing notification:", error);
      return self.registration.showNotification(notificationTitle, {
        body: notificationBody,
        icon: iconUrl,
        data: { url: notificationUrl }
      });
    });
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) {
          const url = event.notification.data?.url || event.notification.data?.click_action || "https://www.yookatale.app/";
          return clients.openWindow(url);
        }
      })
  );
});
