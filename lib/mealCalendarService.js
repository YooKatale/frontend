/**
 * Meal Calendar Service
 * Provides meal calendar data and generates notification messages based on actual meals
 */

// Default weekly menu (same as MealCalendar component)
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
 */
export function getTodaysMeals(mealType) {
  const today = getCurrentDay();
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
 * Generate reminder notification message based on meal calendar
 * More reminder-focused, addressing what meals are available
 */
export function generateMealNotificationMessage(mealType, userName = "Valued Customer") {
  const meals = getTodaysMeals(mealType);
  const mealItems = formatMealItems(meals);
  
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
  
  // Create reminder-focused notification message
  const title = `${mealName} Reminder ${emoji}`;
  
  // Build reminder body - more focused on what's available
  let body = `Reminder: Your ${mealName.toLowerCase()} is ready! `;
  
  if (meals && meals.length > 0) {
    // Show first 2-3 meal items as a reminder
    const displayMeals = meals.slice(0, 2);
    const mealList = displayMeals.map((item) => item.meal).join(", ");
    body += `Today's menu: ${mealList}`;
    
    if (meals.length > 2) {
      body += ` and ${meals.length - 2} more option${meals.length - 2 > 1 ? 's' : ''}`;
    }
    
    // Add ready-to-eat vs ready-to-cook info
    const readyToEat = meals.filter((m) => m.type === "ready-to-eat");
    const readyToCook = meals.filter((m) => m.type === "ready-to-cook");
    
    if (readyToEat.length > 0 && readyToCook.length > 0) {
      body += `. Available as ready-to-eat or ready-to-cook. `;
    } else if (readyToEat.length > 0) {
      body += `. All ready-to-eat. `;
    } else if (readyToCook.length > 0) {
      body += `. All ready-to-cook. `;
    }
  } else {
    body += `Check your meal calendar for today's options. `;
  }
  
  body += `Order now to get it delivered in 15-45 minutes!`;
  
  return {
    title,
    body,
    meals, // Include full meal data for email notifications
  };
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

