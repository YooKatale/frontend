/**
 * Notification Polling Service
 * 
 * NOTE: Frontend polling is DISABLED in production.
 * The backend scheduler (node-cron) now handles all notifications automatically.
 * Notifications are sent at scheduled meal times even when the app is closed.
 * 
 * This service is kept for potential future use but is currently disabled.
 */

let pollingInterval = null;
let isPolling = false;

/**
 * Start polling for notifications
 * ENABLED FOR TESTING: Frontend polling triggers notifications every minute for testing
 * Backend scheduler also handles notifications automatically
 */
export function startNotificationPolling(userInfo = null) {
  // Enable frontend polling for testing - triggers notifications every minute
  stopNotificationPolling();
  
  if (typeof window === "undefined") {
    return;
  }
  
  // Poll every minute to trigger test notifications
  pollingInterval = setInterval(() => {
    triggerNotification(userInfo);
  }, 60000); // Every 60 seconds (1 minute)
  
  isPolling = true;
  
  // Also trigger immediately for testing
  triggerNotification(userInfo);
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
 * ENABLED FOR TESTING: Calls backend API to trigger test notifications
 */
async function triggerNotification(userInfo = null) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yookatale-server.onrender.com";
    
    // Call backend API to trigger test notification
    // The backend will send notifications to all users with FCM tokens
    const response = await fetch(`${backendUrl}/api/trigger-push-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mealType: "breakfast", // Default meal type for testing
        testMode: true,
        userId: userInfo?._id || null,
      }),
    });
    
    // Silently handle - don't log sensitive info
    if (!response.ok) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn("Notification trigger failed");
      }
    }
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn("Error triggering notification:", error.message);
    }
  }
}

/**
 * Check if polling is currently active
 */
export function isPollingActive() {
  return isPolling;
}

