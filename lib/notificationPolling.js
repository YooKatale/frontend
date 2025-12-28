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
 * DISABLED: Backend scheduler now handles all notifications automatically
 */
export function startNotificationPolling(userInfo = null) {
  // DISABLED: Backend scheduler handles notifications automatically
  // No need for frontend polling in production
  console.log("ℹ️ Frontend notification polling is disabled - backend scheduler handles all notifications automatically");
  console.log("📅 Notifications are sent at scheduled meal times by the backend server");
  return;
  
  // OLD CODE (disabled):
  // stopNotificationPolling();
  // if (typeof window === "undefined") {
  //   console.log("Window is not available (server-side)");
  //   return;
  // }
  // pollingInterval = setInterval(() => {
  //   triggerNotification(userInfo);
  // }, 60000);
  // isPolling = true;
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
 * DISABLED: Backend scheduler handles all notifications automatically
 */
async function triggerNotification(userInfo = null) {
  // DISABLED: Backend scheduler handles notifications automatically
  // This function is no longer used
  return;
}

/**
 * Check if polling is currently active
 */
export function isPollingActive() {
  return isPolling;
}

