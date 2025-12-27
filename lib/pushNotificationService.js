/**
 * Professional Push Notification Service
 * Enterprise-grade push notifications with rich media, smart actions, and beautiful design
 * Similar to modern platforms like Grok, Linear, Vercel
 */

/**
 * Request notification permission gracefully
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
 * Get meal-specific notification configuration
 * Professional styling and actions based on meal type
 */
function getMealNotificationConfig(mealType, options = {}) {
  const mealConfigs = {
    breakfast: {
      icon: "/assets/icons/logo2.png",
      color: "#f59e0b", // Amber
      emoji: "🍳",
      time: "6:00 AM - 10:00 AM",
      actionTitle: "Order Breakfast",
      actionIcon: "🍳",
    },
    lunch: {
      icon: "/assets/icons/logo2.png",
      color: "#10b981", // Green
      emoji: "🍽️",
      time: "12:00 PM - 3:00 PM",
      actionTitle: "Order Lunch",
      actionIcon: "🍽️",
    },
    supper: {
      icon: "/assets/icons/logo2.png",
      color: "#8b5cf6", // Purple
      emoji: "🌙",
      time: "5:00 PM - 10:00 PM",
      actionTitle: "Order Supper",
      actionIcon: "🍲",
    },
  };

  return mealConfigs[mealType] || mealConfigs.lunch;
}

/**
 * Send professional push notification with rich features
 * Enterprise-grade implementation similar to Grok/Linear/Vercel
 */
export async function sendPushNotificationNow(title, body, mealType = "lunch", options = {}) {
  try {
    if (!("Notification" in window)) {
      return false;
    }

    // Request permission if not granted
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return false;
    }

    // Get meal-specific configuration
    const mealConfig = getMealNotificationConfig(mealType, options);
    
    // Professional notification options
    const notificationOptions = {
      body: body,
      icon: options.icon || mealConfig.icon,
      badge: "/assets/icons/logo2.png",
      image: options.image || null, // Large image for rich notifications
      tag: `meal-${mealType}-${Math.floor(Date.now() / (1000 * 60 * 60))}`, // Group by hour
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200, 100, 200], // Professional vibration pattern
      timestamp: Date.now(),
      renotify: false,
      data: {
        url: options.url || "/schedule",
        mealType: mealType,
        color: mealConfig.color,
        ...options.data,
      },
      actions: [
        {
          action: "view",
          title: mealConfig.actionTitle,
          icon: mealConfig.icon,
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };

    let notificationShown = false;

    // Try service worker first (preferred method)
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
        console.warn("Service worker notification failed, using fallback");
      }
    }

    // Fallback to direct Notification API
    if (!notificationShown && Notification.permission === "granted") {
      try {
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
        
        // Professional click handling
        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          const url = notificationOptions.data?.url || "/schedule";
          window.location.href = url;
          notification.close();
        };
        
        notificationShown = true;
      } catch (directError) {
        console.error("Direct notification API failed:", directError);
      }
    }

    return notificationShown;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return false;
  }
}
