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
    console.log("🚀 Starting push notification process...");
    console.log("📝 Title:", title);
    console.log("📝 Body:", body);
    console.log("📝 Meal Type:", mealType);
    
    if (!("Notification" in window)) {
      console.error("❌ Browser does not support notifications");
      return false;
    }

    console.log("✅ Browser supports notifications");

    // Request permission if not granted
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.error("❌ Notification permission denied or not granted");
      console.error("Current permission status:", Notification.permission);
      return false;
    }

    console.log("✅ Notification permission granted");
    console.log("🔍 Service worker support:", "serviceWorker" in navigator);

    // Try service worker first, fallback to direct Notification API
    let notificationShown = false;

    // Try service worker if available
    if ("serviceWorker" in navigator) {
      try {
        // Wait for service worker to be ready (with timeout)
        const registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Service worker timeout")), 3000)
          )
        ]).catch(() => null);

        if (registration) {
          console.log("✅ Service worker ready");
          
          await registration.showNotification(title, {
            body: body,
            icon: "/assets/icons/logo2.png",
            badge: "/assets/icons/logo2.png",
            tag: `meal-${mealType}-${Date.now()}`, // Unique tag for test notifications
            requireInteraction: false,
            vibrate: [200, 100, 200],
            timestamp: Date.now(),
            data: {
              url: "/subscription",
              mealType: mealType,
            },
            actions: [
              {
                action: "view",
                title: "View Menu",
              },
              {
                action: "dismiss",
                title: "Dismiss",
              },
            ],
          });

          console.log("✅ Push notification sent via service worker:", title);
          console.log("📱 Notification should appear in your browser now!");
          notificationShown = true;
        } else {
          console.warn("⚠️ Service worker not ready, using fallback");
        }
      } catch (swError) {
        console.warn("⚠️ Service worker notification failed, trying fallback:", swError);
        console.warn("Error details:", {
          message: swError.message,
          name: swError.name,
        });
      }
    }

    // Fallback to direct Notification API
    if (!notificationShown && Notification.permission === "granted") {
      try {
        console.log("🔄 Attempting direct Notification API...");
        const notification = new Notification(title, {
          body: body,
          icon: "/assets/icons/logo2.png",
          badge: "/assets/icons/logo2.png",
          tag: `meal-${mealType}-${Date.now()}`, // Unique tag for test notifications
        });
        
        console.log("✅ Notification object created:", notification);
        
        // Handle notification click
        notification.onclick = () => {
          console.log("👆 Notification clicked!");
          window.focus();
          notification.close();
        };
        
        // Handle notification show
        notification.onshow = () => {
          console.log("👁️ Notification is now visible!");
        };
        
        // Handle notification error
        notification.onerror = (error) => {
          console.error("❌ Notification error event:", error);
        };
        
        console.log("✅ Push notification sent (direct API):", title);
        console.log("📱 Notification should appear in your browser now!");
        notificationShown = true;
      } catch (directError) {
        console.error("❌ Direct notification API also failed:", directError);
        console.error("Error details:", {
          message: directError.message,
          name: directError.name,
          stack: directError.stack,
        });
      }
    }

    if (!notificationShown) {
      console.error("❌ All notification methods failed");
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
    return false;
  }
}


