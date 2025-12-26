// Service Worker for YooKatale Web App Push Notifications

// Install event - cache resources
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim()); // Take control of all pages
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Push notification received");
  
  let notificationData = {
    title: "YooKatale",
    body: "You have a new notification",
    icon: "/assets/icons/logo2.png",
    badge: "/assets/icons/logo2.png",
    tag: "yookatale-notification",
    requireInteraction: false,
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (e) {
      // If not JSON, use as text
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      vibrate: [200, 100, 200],
      data: {
        url: notificationData.url || "/",
      },
    })
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked");
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

// Background sync for offline support (optional)
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event.tag);
  // Handle background sync tasks here
});
