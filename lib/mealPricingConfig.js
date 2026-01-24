/**
 * Meal Pricing Configuration (2025 Update)
 * Defines pricing for ready-to-eat and ready-to-cook meals
 * by meal type (breakfast, lunch, supper), duration (weekly, monthly), and income level
 * Prices in UGX (Ugandan Shillings)
 */

export const MEAL_PRICING = {
  "ready-to-eat": {
    middle: {
      breakfast: {
        weekly: 87500, // 350,000 / 4 = ~87,500 per week
        monthly: 350000, // UGX per month
      },
      lunch: {
        weekly: 112500, // 450,000 / 4
        monthly: 450000,
      },
      supper: {
        weekly: 100000, // 400,000 / 4
        monthly: 400000,
      },
    },
    low: {
      breakfast: {
        weekly: 50000, // 200,000 / 4
        monthly: 200000,
      },
      lunch: {
        weekly: 62500, // 250,000 / 4
        monthly: 250000,
      },
      supper: {
        weekly: 56250, // 225,000 / 4
        monthly: 225000,
      },
    },
  },
  "ready-to-cook": {
    middle: {
      breakfast: {
        weekly: 62500, // 250,000 / 4
        monthly: 250000,
      },
      lunch: {
        weekly: 75000, // 300,000 / 4
        monthly: 300000,
      },
      supper: {
        weekly: 75000, // 300,000 / 4
        monthly: 300000,
      },
    },
    low: {
      breakfast: {
        weekly: 37500, // 150,000 / 4
        monthly: 150000,
      },
      lunch: {
        weekly: 43750, // 175,000 / 4
        monthly: 175000,
      },
      supper: {
        weekly: 43750, // 175,000 / 4
        monthly: 175000,
      },
    },
  },
};

// Default to middle income for backwards compatibility
const DEFAULT_INCOME_LEVEL = "middle";

/**
 * Calculate total price for selected meals
 * @param {Array} selectedMeals - Array of meal selections
 * @param {String} incomeLevel - "middle" or "low" (defaults to "middle")
 * @returns {Number} Total price in UGX
 */
export function calculateMealTotal(selectedMeals, incomeLevel = DEFAULT_INCOME_LEVEL) {
  if (!selectedMeals || selectedMeals.length === 0) return 0;

  return selectedMeals.reduce((total, meal) => {
    const mealType = meal.mealType; // breakfast, lunch, supper
    const prepType = meal.prepType; // ready-to-eat, ready-to-cook
    const duration = meal.duration; // weekly, monthly
    const level = meal.incomeLevel || incomeLevel; // middle or low

    const price = MEAL_PRICING[prepType]?.[level]?.[mealType]?.[duration] || 0;
    return total + price;
  }, 0);
}

/**
 * Format price with currency
 * @param {Number} amount - Amount in UGX
 * @returns {String} Formatted price string
 */
export function formatPrice(amount) {
  const n = Number(amount);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
  }).format(safe);
}

/**
 * Get meal pricing breakdown
 * @param {String} mealType - breakfast, lunch, or supper
 * @param {String} prepType - ready-to-eat or ready-to-cook
 * @param {String} incomeLevel - "middle" or "low" (defaults to "middle")
 * @returns {Object} Pricing object with weekly and monthly prices
 */
export function getMealPricing(mealType, prepType, incomeLevel = DEFAULT_INCOME_LEVEL) {
  return MEAL_PRICING[prepType]?.[incomeLevel]?.[mealType] || { weekly: 0, monthly: 0 };
}

