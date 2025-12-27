/**
 * Push Notification Service
 * Handles sending push notifications immediately using Web Notification API
 */

/**
 * Request notification permission
 */
async function requestNotificationPermission() {
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
 * Send push notification immediately using Web Notification API
 * Enhanced with rich media, better visuals, and professional design
 * Similar to modern platforms like Vercel, Linear, etc.
 */
export async function sendPushNotificationNow(title, body, mealType = "lunch", options = {}) {
  try {
    if (!("Notification" in window)) {
      console.error("❌ Browser does not support notifications");
      return false;
    }

    // Request permission if not granted
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.error("❌ Notification permission denied or not granted");
      return false;
    }

    // Enhanced notification options with rich media
    const mealIcons = {
      breakfast: "/assets/icons/logo2.png",
      lunch: "/assets/icons/logo2.png",
      supper: "/assets/icons/logo2.png",
    };

    const mealColors = {
      breakfast: "#fbbf24", // Amber for breakfast
      lunch: "#10b981", // Green for lunch
      supper: "#8b5cf6", // Purple for supper
    };

    const notificationOptions = {
      body: body,
      icon: options.icon || mealIcons[mealType] || "/assets/icons/logo2.png",
      badge: "/assets/icons/logo2.png",
      image: options.image || null, // Large image for rich notifications
      tag: `meal-${mealType}-${Math.floor(Date.now() / (1000 * 60))}`, // Group by meal type and minute
      requireInteraction: false, // Auto-dismiss after a few seconds
      silent: false, // Play sound
      vibrate: [200, 100, 200, 100, 200], // Enhanced vibration pattern
      timestamp: Date.now(),
      renotify: false, // Don't renotify if tag already exists
      data: {
        url: options.url || "/schedule",
        mealType: mealType,
        ...options.data,
      },
      actions: [
        {
          action: "view",
          title: mealType === "breakfast" ? "🍳 Order Breakfast" : mealType === "lunch" ? "🍽️ Order Lunch" : "🍲 Order Supper",
          icon: "/assets/icons/logo2.png",
        },
        {
          action: "dismiss",
          title: "✕ Dismiss",
        },
      ],
    };

    // Try service worker first for better control and rich features
    let notificationShown = false;

    if ("serviceWorker" in navigator) {
      try {
        const registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Service worker timeout")), 2000)
          )
        ]).catch(() => null);

        if (registration) {
          await registration.showNotification(title, notificationOptions);
          notificationShown = true;
        }
      } catch (swError) {
        console.warn("⚠️ Service worker notification failed, using fallback");
      }
    }

    // Fallback to direct Notification API
    if (!notificationShown && Notification.permission === "granted") {
      try {
        // Direct API doesn't support all features (like image), so we use what's available
        const directOptions = {
          body: notificationOptions.body,
          icon: notificationOptions.icon,
          badge: notificationOptions.badge,
          tag: notificationOptions.tag,
          requireInteraction: notificationOptions.requireInteraction,
          vibrate: notificationOptions.vibrate,
          data: notificationOptions.data,
        };

        const notification = new Notification(title, directOptions);
        
        // Handle notification click
        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          const url = notificationOptions.data?.url || "/schedule";
          window.location.href = url;
          notification.close();
        };
        
        notificationShown = true;
      } catch (directError) {
        console.error("❌ Direct notification API failed:", directError);
      }
    }

    return notificationShown;
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
    return false;
  }
}


