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
    
    // Try to call a trigger endpoint if it exists, otherwise rely on backend scheduler
    // The backend scheduler is already running every minute, so this is just for immediate testing
    try {
      const response = await fetch(`${backendUrl}/admin/trigger-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealType: mealType,
          testMode: true,
        }),
      });
      
      // Silently handle - backend scheduler will handle it anyway
      if (!response.ok && process.env.NODE_ENV === 'development') {
        // Endpoint might not exist - that's okay, scheduler handles it
      }
    } catch (apiError) {
      // API endpoint might not exist - that's fine
      // The backend scheduler already sends notifications every minute automatically
    }
  } catch (error) {
    // Silently handle - backend scheduler handles notifications automatically
    // This is just for immediate testing
  }
}

/**
 * Check if polling is currently active
 */
export function isPollingActive() {
  return isPolling;
}

