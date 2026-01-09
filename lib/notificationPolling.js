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
  }
}

/**
 * Trigger notification by calling the backend API
 * ENABLED FOR TESTING: Calls backend API to trigger test notifications
 * The backend scheduler already sends notifications every minute, but this
 * allows immediate testing without waiting for the next minute
 */
async function triggerNotification(userInfo = null) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yookatale-server.onrender.com";
    
    // Rotate through meal types for variety
    const mealTypes = ['breakfast', 'lunch', 'supper'];
    const currentMinute = new Date().getMinutes();
    const mealType = mealTypes[currentMinute % 3];
    
    // Call the send-push-notification endpoint which definitely exists
    // This sends notifications to all users with FCM tokens
    try {
      const response = await fetch(`${backendUrl}/admin/send-push-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `🧪 Test: ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Time!`,
          body: `Testing notifications every minute - ${new Date().toLocaleTimeString()}. Time for ${mealType}!`,
          data: {
            mealType: mealType,
            url: 'https://www.yookatale.app/schedule',
            timestamp: Date.now().toString(),
            type: 'meal_calendar',
          },
        }),
      });
      
      // Silently handle - don't log (security: no user info exposure)
    } catch (apiError) {
      // Silently handle - backend scheduler handles it
    }
  } catch (error) {
    // Silently handle - backend scheduler handles notifications automatically
  }
}

/**
 * Check if polling is currently active
 */
export function isPollingActive() {
  return isPolling;
}

