/**
 * Service Worker for YooKatale Web App
 * 
 * This service worker enables:
 * - Push notifications even when the app is closed
 * - Background notification handling
 * - Offline support capabilities
 * 
 * Security:
 * - All notification data is validated before display
 * - URLs are sanitized to prevent XSS attacks
 * 
 * How it works:
 * - When app is closed, service worker remains active
 * - Receives push events from server
 * - Displays notifications to user
 * - Handles notification clicks to open/reopen app
 */

// Service Worker Installation
// This runs when the service worker is first installed or updated
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  // Skip waiting means the new service worker activates immediately
  // This ensures users get the latest version without page reload
  self.skipWaiting();
});

// Service Worker Activation
// This runs when the service worker becomes active
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  // Claim all clients (tabs) immediately
  // This ensures the service worker controls all pages right away
  event.waitUntil(self.clients.claim());
});

/**
 * Push Notification Event Handler
 * 
 * This event fires when a push notification is received from the server.
 * Works even when the app is completely closed - the browser keeps the
 * service worker running in the background.
 * 
 * Security: Validates and sanitizes notification data before display
 */
self.addEventListener("push", (event) => {
  console.log("Push notification received from server");
  
  // Enhanced notification defaults with rich media support
  let notificationData = {
    title: "YooKatale",
    body: "You have a new notification",
    icon: "/assets/icons/logo2.png",
    badge: "/assets/icons/logo2.png",
    image: null, // Large image for rich notifications (if provided)
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
  // Security: Sanitize data to prevent XSS attacks
  if (event.data) {
    try {
      const data = event.data.json();
      // Validate and sanitize notification data
      notificationData = {
        ...notificationData,
        title: (data.title && typeof data.title === 'string') ? data.title.substring(0, 100) : notificationData.title,
        body: (data.body && typeof data.body === 'string') ? data.body.substring(0, 500) : notificationData.body,
        icon: (data.icon && typeof data.icon === 'string') ? data.icon : notificationData.icon,
        url: (data.url && typeof data.url === 'string' && data.url.startsWith('/')) ? data.url : "/subscription",
        mealType: (data.mealType && typeof data.mealType === 'string') ? data.mealType : null,
      };
    } catch (e) {
      // If data is not JSON, use as plain text (sanitized)
      const textData = event.data.text();
      notificationData.body = (textData && typeof textData === 'string') 
        ? textData.substring(0, 500) 
        : notificationData.body;
    }
  }

  // Display the notification to the user with enhanced features
  // This works even when the app is completely closed
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || "/assets/icons/logo2.png",
      badge: notificationData.badge || "/assets/icons/logo2.png",
      image: notificationData.image || null, // Large image for rich notifications (if supported)
      tag: notificationData.tag || "yookatale-notification", // Groups similar notifications
      requireInteraction: notificationData.requireInteraction !== undefined ? notificationData.requireInteraction : false,
      silent: notificationData.silent !== undefined ? notificationData.silent : false,
      vibrate: notificationData.vibrate || [200, 100, 200, 100, 200], // Enhanced vibration pattern
      timestamp: notificationData.timestamp || Date.now(),
      renotify: notificationData.renotify !== undefined ? notificationData.renotify : false,
      data: {
        url: notificationData.url || "/schedule",
        mealType: notificationData.mealType || null,
        ...notificationData.data,
      },
      actions: notificationData.actions || [
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
    })
  );
});

/**
 * Notification Click Event Handler
 * 
 * Handles what happens when a user clicks on a notification.
 * If the app is closed, it will open it. If open, it will focus and navigate.
 * 
 * Security: Validates URLs before navigation to prevent open redirect attacks
 */
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event.action);
  event.notification.close(); // Close the notification

  const action = event.action;
  const notificationData = event.notification.data || {};

  // Handle dismiss action - just close the notification
  if (action === "dismiss") {
    return;
  }

  // Security: Validate URL to prevent open redirect attacks
  // Only allow relative URLs (starting with /)
  let url = "/subscription"; // Default URL
  if (notificationData.url && typeof notificationData.url === 'string') {
    if (notificationData.url.startsWith('/') && !notificationData.url.includes('..')) {
      url = notificationData.url;
    }
  }

  // Open or focus the app window
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true, // Include windows not controlled by this service worker
      })
      .then((clientList) => {
        // Check if app window is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url && "focus" in client) {
            // If it's a meal notification, navigate to the schedule/meal calendar
            if (notificationData.mealType) {
              client.focus();
              // Use navigate if available (modern browsers)
              if (client.navigate) {
                return client.navigate(url);
              } else {
                // Fallback: postMessage to navigate
                client.postMessage({ type: "navigate", url: url });
                return client.focus();
              }
            }
            // Otherwise just focus the existing window
            return client.focus();
          }
        }
        // If no window is open, open a new one
        // This is what makes notifications work when app is closed
        if (clients.openWindow) {
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
