/**
 * Notification Polling Service
 * 
 * This service polls the backend API every minute to trigger FCM push notifications.
 * The backend will send notifications via FCM, which means they work even when the app is closed.
 * 
 * This approach works without cron jobs because:
 * 1. The client-side polling triggers the backend
 * 2. The backend sends notifications via FCM (Firebase Cloud Messaging)
 * 3. FCM delivers notifications even when the app/browser is closed (like WhatsApp)
 */

let pollingInterval = null;
let isPolling = false;

/**
 * Start polling for notifications every minute
 * This will call the backend API which will send FCM push notifications
 */
export function startNotificationPolling(userInfo = null) {
  // Stop any existing polling
  stopNotificationPolling();

  if (typeof window === "undefined") {
    console.log("Window is not available (server-side)");
    return;
  }

  console.log("🔄 Starting notification polling (every minute for testing)...");

  // Poll immediately on start
  triggerNotification(userInfo);

  // Then poll every minute (60000 ms) - TEST MODE: Sends notifications every minute
  pollingInterval = setInterval(() => {
    triggerNotification(userInfo);
  }, 60000); // Every minute (60000 ms) - TEST MODE - Change to 3600000 (1 hour) in production

  isPolling = true;
}

/**
 * Stop the notification polling
 */
export function stopNotificationPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    isPolling = false;
    console.log("🛑 Notification polling stopped");
  }
}

/**
 * Trigger notification by calling the backend API
 * The backend will send FCM push notifications to all registered users
 */
async function triggerNotification(userInfo = null) {
  try {
    // TEST MODE: Always send test notifications every minute regardless of time
    // Get current time for notification timestamp
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // For testing, always set testMode to true so notifications are sent every minute
    let mealType = null;
    if (currentHour >= 6 && currentHour <= 10) {
      mealType = "breakfast";
    } else if (currentHour >= 12 && currentHour <= 15) {
      mealType = "lunch";
    } else if (currentHour >= 17 && currentHour <= 22) {
      mealType = "supper";
    }

    // Call our API endpoint which will trigger the backend to send FCM notifications
    const response = await fetch("/api/trigger-push-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mealType: mealType, // Keep mealType for context but testMode will override
        userId: userInfo?._id || null, // Send to current user or all users for testing
        testMode: true, // TEST MODE: Always true to send notifications every minute
        timestamp: Date.now(),
        message: `Test notification at ${currentHour}:${currentMinute.toString().padStart(2, '0')}`
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Notification trigger sent successfully:", data);
    } else {
      console.warn("⚠️ Failed to trigger notification:", await response.text());
    }
  } catch (error) {
    console.error("❌ Error triggering notification:", error);
  }
}

/**
 * Check if polling is currently active
 */
export function isPollingActive() {
  return isPolling;
}

