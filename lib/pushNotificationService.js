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
 * Shows browser popup notification
 */
export async function sendPushNotificationNow(title, body, mealType = "lunch") {
  try {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      console.log("Push notifications not supported");
      return false;
    }

    // Request permission if not granted
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log("Notification permission denied");
      return false;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Show notification using service worker (for better browser support)
    await registration.showNotification(title, {
      body: body,
      icon: "/assets/icons/logo2.png",
      badge: "/assets/icons/logo2.png",
      tag: `meal-${mealType}-${Date.now()}`,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: {
        url: "/subscription",
        mealType: mealType,
      },
    });

    console.log("Push notification sent (browser popup):", title);
    return true;
  } catch (error) {
    console.error("Error sending push notification:", error);
    
    // Fallback to direct Notification API if service worker fails
    try {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body: body,
          icon: "/assets/icons/logo2.png",
          badge: "/assets/icons/logo2.png",
          tag: `meal-${mealType}-${Date.now()}`,
        });
        console.log("Push notification sent (fallback):", title);
        return true;
      }
    } catch (fallbackError) {
      console.error("Fallback notification also failed:", fallbackError);
    }
    
    return false;
  }
}


