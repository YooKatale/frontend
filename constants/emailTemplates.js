/**
 * Email Templates for Backend
 * These templates are sent to the backend API for email sending
 */

import { getMealCalendarEmailTemplate } from "./mealCalendarEmailTemplate";
import { emailTemplate, newsletterEmailTemplate } from "./constants";

/**
 * Get email template HTML based on email type
 * @param {string} emailType - 'welcome', 'newsletter', 'meal_notification', or 'invitation'
 * @param {Object} data - Additional data for template (userName, mealType, meals, etc.)
 * @returns {string} HTML template string
 */
export function getEmailTemplate(emailType, data = {}) {
  switch (emailType) {
    case 'welcome':
      return emailTemplate;
    
    case 'newsletter':
      return newsletterEmailTemplate;
    
    case 'meal_notification':
      const { userName = 'Valued Customer', mealType = 'lunch', greeting = 'Hello', meals = [] } = data;
      return getMealCalendarEmailTemplate(userName, mealType, greeting, meals);
    
    case 'invitation':
    default:
      // Return invitation template (handled by backend)
      return null; // Backend has its own invitation template
  }
}

/**
 * Get email subject based on email type
 * @param {string} emailType - 'welcome', 'newsletter', 'meal_notification', or 'invitation'
 * @param {Object} data - Additional data (mealType, greeting, etc.)
 * @returns {string} Email subject
 */
export function getEmailSubject(emailType, data = {}) {
  switch (emailType) {
    case 'welcome':
      return "Welcome to Yookatale - Your Mobile Food Market! 🍽️";
    
    case 'newsletter':
      return "Here For You - Welcome To YooKatale";
    
    case 'meal_notification':
      const { mealType = 'lunch', greeting = 'Hello' } = data;
      const mealNames = {
        breakfast: "Breakfast",
        lunch: "Lunch",
        supper: "Supper",
      };
      const mealName = mealNames[mealType] || "Meal";
      return `${greeting}! Your ${mealName} Reminder - Meal Calendar 🍽️`;
    
    case 'invitation':
    default:
      return "Join YooKatale - Your Mobile Food Market!";
  }
}

// Export templates directly for backend use
export { emailTemplate, newsletterEmailTemplate };
export { getMealCalendarEmailTemplate };

