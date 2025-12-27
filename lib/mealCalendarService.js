/**
 * Meal Calendar Service
 * Provides meal calendar data and generates notification messages based on actual meals
 * Uses the meal menu configuration from mealMenuConfig.js
 */

import { getMealForDay } from "./mealMenuConfig";

// Legacy weekly menu (kept for backward compatibility)
const weeklyMenu = {
  monday: {
    breakfast: [
      { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces" },
      { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl" },
      { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
    lunch: [
      { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate" },
    ],
    supper: [
      { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
  },
  tuesday: {
    breakfast: [
      { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces" },
      { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl" },
      { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
    lunch: [
      { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate" },
    ],
    supper: [
      { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
  },
  wednesday: {
    breakfast: [
      { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces" },
      { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl" },
      { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
    lunch: [
      { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate" },
    ],
    supper: [
      { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
  },
  thursday: {
    breakfast: [
      { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces" },
      { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl" },
      { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
    lunch: [
      { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate" },
    ],
    supper: [
      { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
  },
  friday: {
    breakfast: [
      { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces" },
      { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl" },
      { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
    lunch: [
      { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate" },
    ],
    supper: [
      { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
  },
  saturday: {
    breakfast: [
      { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces" },
      { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl" },
      { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
    lunch: [
      { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate" },
    ],
    supper: [
      { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
  },
  sunday: {
    breakfast: [
      { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces" },
      { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl" },
      { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
    lunch: [
      { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate" },
    ],
    supper: [
      { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate" },
      { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate" },
      { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate" },
    ],
  },
};

/**
 * Get current day of week in lowercase (monday, tuesday, etc.)
 */
export function getCurrentDay() {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = new Date().getDay();
  return days[today];
}

/**
 * Get today's meals for a specific meal type
 * Uses mealMenuConfig.js for actual meal data
 */
export function getTodaysMeals(mealType) {
  const today = getCurrentDay();
  
  // Try to get meal from mealMenuConfig (middle income, ready-to-eat as default)
  try {
    const meal = getMealForDay(today, mealType, "middle", "ready-to-eat");
    if (meal) {
      // Format to match expected structure
      return [{
        meal: meal.meal,
        type: "ready-to-eat",
        quantity: meal.quantity,
        description: meal.description,
        image: meal.image,
      }];
    }
  } catch (error) {
    console.error("Error getting meal from mealMenuConfig:", error);
  }

  // Fallback to legacy menu
  const dayMenu = weeklyMenu[today];
  if (!dayMenu || !dayMenu[mealType]) {
    return [];
  }
  
  return dayMenu[mealType];
}

/**
 * Format meal items into a readable string
 */
export function formatMealItems(meals) {
  if (!meals || meals.length === 0) {
    return "No meals available";
  }
  
  // Format: "Meal 1 (quantity), Meal 2 (quantity), Meal 3 (quantity)"
  return meals
    .map((item) => `${item.meal} (${item.quantity})`)
    .join(", ");
}

/**
 * Generate generalized notification message for non-subscribed users
 * Promotes meal subscription and shows available options
 */
export function generateGeneralizedMealNotificationMessage(mealType, userName = "Valued Customer") {
  const meals = getTodaysMeals(mealType);
  
  const mealNames = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    supper: "Supper",
  };
  
  const emojis = {
    breakfast: "🍳",
    lunch: "🍽️",
    supper: "🌙",
  };
  
  const mealName = mealNames[mealType] || mealType;
  const emoji = emojis[mealType] || "🍽️";
  
  // Generalized title
  const title = `${mealName} Time! ${emoji}`;
  
  // Generalized body - promotes subscription
  let body = `Good ${mealName.toLowerCase()} time! `;
  
  if (meals && meals.length > 0) {
    const todayMeal = meals[0];
    body += `Today's special: ${todayMeal.meal}. `;
    body += `Subscribe to our meal plans to get personalized ${mealName.toLowerCase()} delivered to you! `;
  } else {
    body += `Subscribe to our meal plans for delicious ${mealName.toLowerCase()} options! `;
  }
  
  body += `Visit yookatale.app/subscription to get started!`;
  
  return {
    title,
    body,
    meals: meals || [], // Include meal data for email
  };
}

/**
 * Generate specific notification message for subscribed users
 * Shows their actual subscribed meals
 */
export function generateSpecificMealNotificationMessage(mealType, userName = "Valued Customer", subscribedMeals = []) {
  const mealNames = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    supper: "Supper",
  };
  
  const emojis = {
    breakfast: "🍳",
    lunch: "🍽️",
    supper: "🌙",
  };
  
  const mealName = mealNames[mealType] || mealType;
  const emoji = emojis[mealType] || "🍽️";
  
  // Specific title for subscribed users
  const title = `Your ${mealName} is Ready! ${emoji}`;
  
  // Specific body - shows their subscribed meals
  let body = `Good ${mealName.toLowerCase()} time, ${userName}! `;
  
  if (subscribedMeals && subscribedMeals.length > 0) {
    // Show their subscribed meal options
    const mealList = subscribedMeals
      .map((meal) => {
        const prepType = meal.prepType === "ready-to-eat" ? "Ready-to-eat" : "Ready-to-cook";
        return `${meal.mealName || meal.meal} (${prepType})`;
      })
      .join(", ");
    
    body += `Your subscribed ${mealName.toLowerCase()}: ${mealList}. `;
    
    // Add duration info if available
    const durations = [...new Set(subscribedMeals.map(m => m.duration))];
    if (durations.length > 0) {
      body += `Subscription: ${durations.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" & ")}. `;
    }
    
    body += `Your meal will be delivered according to your schedule!`;
  } else {
    // Fallback if no meal details
    body += `Your ${mealName.toLowerCase()} subscription is active! Check your meal calendar for details.`;
  }
  
  return {
    title,
    body,
    meals: subscribedMeals, // Include subscribed meal data for email
  };
}

/**
 * Generate reminder notification message based on meal calendar
 * More reminder-focused, addressing what meals are available
 * (Kept for backward compatibility)
 */
export function generateMealNotificationMessage(mealType, userName = "Valued Customer") {
  // Default to generalized message
  return generateGeneralizedMealNotificationMessage(mealType, userName);
}

/**
 * Get meal calendar data for a specific day
 */
export function getDayMenu(day) {
  return weeklyMenu[day.toLowerCase()] || null;
}

/**
 * Get full weekly menu
 */
export function getWeeklyMenu() {
  return weeklyMenu;
}

