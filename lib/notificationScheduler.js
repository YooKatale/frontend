/**
 * Notification Scheduler for Meal Times
 * Schedules push notifications and emails for breakfast, lunch, and supper
 * Based on actual meal calendar data
 * 
 * PRODUCTION MODE: Notifications sent at :00 (start of each hour) during meal windows
 * 
 * Notification Times:
 * - Breakfast: 6:00 AM - 10:00 AM (notifications at 6:00, 7:00, 8:00, 9:00, 10:00)
 * - Lunch: 12:00 PM - 3:00 PM (notifications at 12:00, 1:00, 2:00, 3:00)
 * - Supper: 5:00 PM - 10:00 PM (notifications at 5:00, 6:00, 7:00, 8:00, 9:00, 10:00)
 * 
 * Notification Types:
 * - General Users: Generalized notifications promoting meal plans
 * - Subscribed Users: Specific notifications showing their paid meals
 */

import { sendMealNotification } from "./mealNotificationService";
import { sendPushNotificationNow } from "./pushNotificationService";
import { 
  generateGeneralizedMealNotificationMessage,
  generateSpecificMealNotificationMessage 
} from "./mealCalendarService";
import { getUserFullName } from "./mealNotificationService";
import { DB_URL } from "@config/config";

// Meal time schedules - Based on meal calendar
export const MEAL_SCHEDULES = {
  breakfast: {
    startHour: 6,
    endHour: 10,
    notificationTimes: [6, 7, 8, 9, 10], // Hours to send notifications (6:00 AM - 10:00 AM)
  },
  lunch: {
    startHour: 12,
    endHour: 15,
    notificationTimes: [12, 13, 14, 15], // Hours to send notifications (12:00 PM - 3:00 PM)
  },
  supper: {
    startHour: 17,
    endHour: 22,
    notificationTimes: [17, 18, 19, 20, 21, 22], // Hours to send notifications (5:00 PM - 10:00 PM)
  },
};

// Store active notification intervals
const activeIntervals = new Map();

/**
 * Check if user has active meal subscription for a specific meal type
 * @param {string} userId - User ID
 * @param {string} mealType - breakfast, lunch, or supper
 * @returns {Promise<Object>} - { hasSubscription: boolean, subscribedMeals: Array }
 */
async function getUserMealSubscription(userId, mealType) {
  if (!userId) {
    return { hasSubscription: false, subscribedMeals: [] };
  }

  try {
    const response = await fetch(`${DB_URL}/products/orders/${userId}`);
    const data = await response.json();

    if (data?.status === "Success" || data?.status === "success") {
      const paidSubscriptions = data.data?.AllOrders?.filter(
        (order) =>
          order.order?.payment?.paymentMethod !== "" &&
          order.order?.payment?.status === "paid" &&
          order.scheduleFor === "meal_subscription"
      ) || [];

      // Get all subscribed meals for this meal type
      const subscribedMeals = paidSubscriptions
        .flatMap((order) => order.products?.meals || [])
        .filter((meal) => meal.mealType === mealType);

      return {
        hasSubscription: subscribedMeals.length > 0,
        subscribedMeals: subscribedMeals,
      };
    }
    return { hasSubscription: false, subscribedMeals: [] };
  } catch (error) {
    console.error("Error checking meal subscription:", error);
    return { hasSubscription: false, subscribedMeals: [] };
  }
}

/**
 * Schedule notifications for meal times
 * This function should be called after user subscribes to push notifications
 * @param {Object} userInfo - User information including email and notification preferences
 */
export async function scheduleMealNotifications(userInfo = null) {
  if (!("serviceWorker" in navigator) || !("Notification" in window)) {
    console.log("Push notifications not supported");
    return;
  }

  // Clear any existing intervals
  clearAllNotificationIntervals();

  try {
    const registration = await navigator.serviceWorker.ready;

    // Start continuous monitoring for each meal type
    startMealNotificationMonitoring(registration, "breakfast", userInfo);
    startMealNotificationMonitoring(registration, "lunch", userInfo);
    startMealNotificationMonitoring(registration, "supper", userInfo);

    console.log("Meal notifications scheduled successfully");
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
}

/**
 * Start continuous monitoring for meal notifications
 * Checks every minute if current time is within meal window and sends notification
 * PRODUCTION MODE: Sends notifications only at :00 (start of each hour)
 */
function startMealNotificationMonitoring(registration, mealType, userInfo) {
  const schedule = MEAL_SCHEDULES[mealType];
  if (!schedule) return;

  // Check immediately if we're in the time window and it's :00
  checkAndSendNotification(registration, mealType, userInfo);

  // Then check every minute (PRODUCTION: only sends at :00)
  const intervalId = setInterval(() => {
    checkAndSendNotification(registration, mealType, userInfo);
  }, 60000); // Check every minute

  activeIntervals.set(mealType, intervalId);
}

/**
 * Check if current time is within meal window and send notification if needed
 * PRODUCTION MODE: Sends notification only at :00 (start of each hour) during meal windows
 * 
 * Sends to ALL users (registered or not):
 * - Non-subscribed users: Generalized notifications
 * - Subscribed users: Specific notifications for their paid meals
 */
async function checkAndSendNotification(registration, mealType, userInfo) {
  const schedule = MEAL_SCHEDULES[mealType];
  if (!schedule) return;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Check if current time is within the meal window
  if (currentHour >= schedule.startHour && currentHour <= schedule.endHour) {
    // PRODUCTION MODE: Only send notification at the start of each hour (:00)
    // This prevents multiple notifications in the same hour
    if (currentMinute === 0) {
      // Check if user has active subscription for this meal type
      let subscriptionInfo = { hasSubscription: false, subscribedMeals: [] };
      
      if (userInfo?._id) {
        try {
          subscriptionInfo = await getUserMealSubscription(userInfo._id, mealType);
        } catch (error) {
          console.error(`Error checking subscription for ${mealType}:`, error);
          // Continue with generalized notification if subscription check fails
        }
      }

      // Generate notification message based on subscription status
      const userName = getUserFullName(userInfo);
      let notificationData;

      if (subscriptionInfo.hasSubscription && subscriptionInfo.subscribedMeals.length > 0) {
        // User has paid subscription - send specific notification
        notificationData = generateSpecificMealNotificationMessage(
          mealType,
          userName,
          subscriptionInfo.subscribedMeals
        );
        console.log(`[SUBSCRIBED USER] Generating specific notification for ${mealType}`);
      } else {
        // User doesn't have subscription or not logged in - send generalized notification
        notificationData = generateGeneralizedMealNotificationMessage(mealType, userName);
        console.log(`[GENERAL USER] Generating generalized notification for ${mealType}`);
      }

      // Send push notification to ALL users (registered or not)
      try {
        await sendPushNotificationNow(notificationData.title, notificationData.body, mealType);
        const userType = subscriptionInfo.hasSubscription ? "SUBSCRIBED" : "GENERAL";
        console.log(`✅ [${userType}] Push notification sent for ${mealType} at ${currentHour}:00 to ${userName || 'Guest User'}`);
      } catch (error) {
        console.error(`❌ Error sending push notification for ${mealType}:`, error);
      }

      // Send email notifications only for registered users with preferences
      // Push notifications are already sent above via sendPushNotificationNow()
      // SMS and WhatsApp are disabled for now
      if (userInfo) {
        try {
          await sendMealNotification(userInfo, mealType, notificationData.meals);
          
          // Log which channels were used
          const preferences = userInfo.notificationPreferences || { email: true };
          const channels = ["Web App (Push)"]; // Push notifications always sent
          if (preferences.email !== false && userInfo.email) {
            channels.push("Email");
          }
          
          if (channels.length > 0) {
            const userType = subscriptionInfo.hasSubscription ? "SUBSCRIBED" : "GENERAL";
            console.log(`📧 [${userType}] Notifications sent via ${channels.join(", ")} for ${mealType} to ${userInfo.email || 'user'}`);
          }
        } catch (error) {
          console.error(`❌ Error sending meal notification for ${mealType}:`, error);
        }
      }
    }
  }
}

/**
 * Clear all active notification intervals
 */
function clearAllNotificationIntervals() {
  activeIntervals.forEach((intervalId) => {
    clearInterval(intervalId);
  });
  activeIntervals.clear();
}

/**
 * Stop all meal notifications
 */
export function stopMealNotifications() {
  clearAllNotificationIntervals();
  console.log("All meal notifications stopped");
}


/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
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


