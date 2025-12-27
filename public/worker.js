/**
 * Professional Service Worker for YooKatale Web App
 * Enterprise-grade push notification handling
 * Similar to modern platforms like Grok, Linear, Vercel
 * 
 * Features:
 * - Rich media notifications with images
 * - Professional action buttons
 * - Smart notification grouping
 * - Works even when app is closed
 * - Beautiful, engaging notifications
 */

// Service Worker Installation
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting(); // Activate immediately
});

// Service Worker Activation
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});

/**
 * Professional Push Notification Event Handler
 * Handles server-sent push notifications with rich media support
 */
self.addEventListener("push", (event) => {
  console.log("Push notification received from server");
  
  // Default professional notification data
  let notificationData = {
    title: "YooKatale",
    body: "You have a new notification",
    icon: "/assets/icons/logo2.png",
    badge: "/assets/icons/logo2.png",
    image: null,
    tag: "yookatale-notification",
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200, 100, 200],
    actions: [
      {
        action: "view",
        title: "View Menu",
        icon: "/assets/icons/logo2.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  // Parse and validate push notification data
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        title: (data.title && typeof data.title === 'string') 
          ? data.title.substring(0, 100) 
          : notificationData.title,
        body: (data.body && typeof data.body === 'string') 
          ? data.body.substring(0, 500) 
          : notificationData.body,
        icon: (data.icon && typeof data.icon === 'string') 
          ? data.icon 
          : notificationData.icon,
        image: (data.image && typeof data.image === 'string') 
          ? data.image 
          : notificationData.image,
        url: (data.url && typeof data.url === 'string' && data.url.startsWith('/')) 
          ? data.url 
          : "/schedule",
        mealType: (data.mealType && typeof data.mealType === 'string') 
          ? data.mealType 
          : null,
        tag: (data.tag && typeof data.tag === 'string') 
          ? data.tag 
          : notificationData.tag,
      };
    } catch (e) {
      const textData = event.data.text();
      if (textData && typeof textData === 'string') {
        notificationData.body = textData.substring(0, 500);
      }
    }
  }

  // Display professional notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      image: notificationData.image, // Large image for rich notifications
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      vibrate: notificationData.vibrate,
      timestamp: Date.now(),
      renotify: false,
      data: {
        url: notificationData.url,
        mealType: notificationData.mealType,
      },
      actions: notificationData.actions,
    })
  );
});

/**
 * Professional Notification Click Handler
 * Smart navigation and window management
 */
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event.action);
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};

  // Handle dismiss action
  if (action === "dismiss") {
    return;
  }

  // Validate and construct URL
  let url = "/schedule"; // Default to meal schedule
  if (notificationData.url && typeof notificationData.url === 'string') {
    if (notificationData.url.startsWith('/') && !notificationData.url.includes('..')) {
      url = notificationData.url;
    }
  }

  // If it's a meal notification, go to schedule page
  if (notificationData.mealType) {
    url = "/schedule";
  }

  // Professional window management
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Focus existing window and navigate
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url && "focus" in client) {
            if (notificationData.mealType && client.navigate) {
              client.focus();
              return client.navigate(url);
            }
            client.focus();
            // Fallback: postMessage if navigate not available
            if (!client.navigate) {
              client.postMessage({ type: "navigate", url: url });
            }
            return client.focus();
          }
        }
        
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Background sync for offline support
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event.tag);
});
