/**
 * Notification Scheduler for Meal Times
 * Schedules push notifications and emails for breakfast, lunch, and supper
 * Based on actual meal calendar data
 */

import { sendMealNotification } from "./mealNotificationService";
import { sendPushNotificationNow } from "./pushNotificationService";
import { generateMealNotificationMessage } from "./mealCalendarService";
import { getUserFullName } from "./mealNotificationService";

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

  try {
    const registration = await navigator.serviceWorker.ready;

    // Schedule breakfast notifications
    MEAL_SCHEDULES.breakfast.notificationTimes.forEach((hour) => {
      scheduleNotificationForHour(
        registration,
        hour,
        "breakfast",
        userInfo
      );
    });

    // Schedule lunch notifications
    MEAL_SCHEDULES.lunch.notificationTimes.forEach((hour) => {
      scheduleNotificationForHour(
        registration,
        hour,
        "lunch",
        userInfo
      );
    });

    // Schedule supper notifications
    MEAL_SCHEDULES.supper.notificationTimes.forEach((hour) => {
      scheduleNotificationForHour(
        registration,
        hour,
        "supper",
        userInfo
      );
    });

    console.log("Meal notifications scheduled successfully");
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
}

/**
 * Schedule a notification for a specific hour
 * Generates notification message based on meal calendar
 */
function scheduleNotificationForHour(registration, hour, mealType, userInfo) {
  const now = new Date();
  const scheduledTime = new Date();
  
  scheduledTime.setHours(hour, 0, 0, 0); // Set to the specified hour
  
  // If the time has passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  // Use setTimeout for daily scheduling (in production, use a more robust solution)
  setTimeout(async () => {
    // Generate notification message based on meal calendar
    const userName = getUserFullName(userInfo);
    const notificationData = generateMealNotificationMessage(mealType, userName);
    
    // Send push notification with meal calendar data
    try {
      await sendPushNotificationNow(notificationData.title, notificationData.body, mealType);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }

    // Send email/SMS/WhatsApp notifications based on user preferences
    // Pass meal data for detailed email content
    if (userInfo) {
      try {
        await sendMealNotification(userInfo, mealType, notificationData.meals);
      } catch (error) {
        console.error("Error sending meal notification:", error);
      }
    }

    // Reschedule for next day (24 hours)
    scheduleNotificationForHour(registration, hour, mealType, userInfo);
  }, delay);
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


