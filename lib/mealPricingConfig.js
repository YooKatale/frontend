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
        weekly: 77000,
        monthly: 340000,
      },
      lunch: {
        weekly: 102300,
        monthly: 440000,
      },
      supper: {
        weekly: 90000,
        monthly: 390000,
      },
    },
    low: {
      breakfast: {
        weekly: 40000,
        monthly: 190000,
      },
      lunch: {
        weekly: 52000,
        monthly: 240000,
      },
      supper: {
        weekly: 50000,
        monthly: 210000,
      },
    },
  },
  "ready-to-cook": {
    middle: {
      breakfast: {
        weekly: 200000,
        monthly: 800000,
      },
      lunch: {
        weekly: 200000,
        monthly: 800000,
      },
      supper: {
        weekly: 200000,
        monthly: 800000,
      },
    },
    low: {
      breakfast: {
        weekly: 125000,
        monthly: 500000,
      },
      lunch: {
        weekly: 125000,
        monthly: 500000,
      },
      supper: {
        weekly: 125000,
        monthly: 500000,
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
  const level = MEAL_PRICING[prepType]?.[incomeLevel] ? incomeLevel : (incomeLevel === "high" ? "middle" : incomeLevel);
  return MEAL_PRICING[prepType]?.[level]?.[mealType] || { weekly: 0, monthly: 0 };
}

