// Firebase Cloud Messaging Service Worker
// This file must be in the public folder and named exactly: firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0-6naVPXSMcsW9s_X0dCXJu5C_5g90Dk",
  authDomain: "yookatale-e3eed.firebaseapp.com",
  projectId: "yookatale-e3eed",
  storageBucket: "yookatale-e3eed.appspot.com",
  messagingSenderId: "910776417074",
  appId: "1:910776417074:web:de9e4d3e15d4b3145a352b",
  measurementId: "G-YGT5LE4NPV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "YooKatale";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: payload.notification?.icon || "/assets/icons/logo2.png",
    badge: "/assets/icons/logo2.png",
    tag: payload.data?.mealType || "yookatale-notification",
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || "/subscription",
      mealType: payload.data?.mealType,
    },
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
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
          const url = event.notification.data?.url || "/";
          return clients.openWindow(url);
        }
      })
  );
});

