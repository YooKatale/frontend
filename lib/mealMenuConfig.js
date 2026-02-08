/**
 * Meal Menu Configuration (2025 Update)
 * 7-day weekly cycle menus for middle and low income earners
 * Supports ready-to-eat (cooked) and ready-to-cook plans
 */

// Helper function to format meal descriptions
const formatMealDescription = (items, isReadyToEat = true) => {
  if (isReadyToEat) {
    // For ready-to-eat, combine into meal names
    return items.join(", ");
  } else {
    // For ready-to-cook, list ingredients
    return `Ingredients: ${items.join(", ")}`;
  }
};

/**
 * Middle Income - Ready to Eat (Cooked) Menus
 */
export const MIDDLE_INCOME_COOKED_MENUS = {
  breakfast: {
    monday: {
      meal: "Katogo (Cassava & Beans) with Chapati",
      description: "200g katogo (cassava & beans), 1 chapati (100g), 200ml tea with milk & sugar, 1 banana (150g)",
      quantity: "~650g",
      image: "/assets/images/meals/katogo-chapati.jpg",
    },
    tuesday: {
      meal: "Maize Porridge with Groundnuts",
      description: "150g maize porridge with milk & sugar, 100g groundnuts, 1 mango (200g), 200ml tea",
      quantity: "~650g",
      image: "/assets/images/meals/porridge-groundnuts.jpg",
    },
    wednesday: {
      meal: "Millet Bread with Peanut Butter",
      description: "2 slices millet bread (150g) with peanut butter (50g), 200ml tea, 1 orange (150g)",
      quantity: "~550g",
      image: "/assets/images/meals/millet-bread.jpg",
    },
    thursday: {
      meal: "Sweet Potato Mash with Beans",
      description: "200g sweet potato mash, 100g beans, 200ml milk tea, 1 apple (150g)",
      quantity: "~650g",
      image: "/assets/images/meals/sweet-potato-beans.jpg",
    },
    friday: {
      meal: "Rice Pudding with Nuts",
      description: "150g rice pudding with sugar, 50g nuts, 200ml tea, 1 banana (150g)",
      quantity: "~550g",
      image: "/assets/images/meals/rice-pudding.jpg",
    },
    saturday: {
      meal: "Rolex (Chapati with Egg)",
      description: "1 rolex (chapati with egg, 150g), 200ml tea, 1 passion fruit (100g)",
      quantity: "~450g",
      image: "/assets/images/meals/rolex.jpg",
    },
    sunday: {
      meal: "Cassava Porridge with Peas",
      description: "200g cassava porridge, 100g peas, 200ml tea, 1 pineapple slice (150g)",
      quantity: "~650g",
      image: "/assets/images/meals/cassava-porridge.jpg",
    },
  },
  lunch: {
    monday: {
      meal: "Rice with Bean Stew & Chicken",
      description: "200g rice, 100g bean stew, 150g mixed veggies (tomatoes, onions, greens), 100g chicken",
      quantity: "~550g",
      image: "/assets/images/meals/rice-beans-chicken.jpg",
    },
    tuesday: {
      meal: "Posho with Pea Stew & Beef",
      description: "200g posho (maize meal), 100g pea stew, 150g cabbage & carrots, 100g beef",
      quantity: "~550g",
      image: "/assets/images/meals/posho-pea-beef.jpg",
    },
    wednesday: {
      meal: "Matoke with Groundnut Sauce & Fish",
      description: "200g matoke mash, 100g groundnut sauce, 150g spinach & onions, 100g fish",
      quantity: "~550g",
      image: "/assets/images/meals/matooke-groundnut-fish.jpg",
    },
    thursday: {
      meal: "Cassava with Lentil Stew & Goat Meat",
      description: "200g cassava, 100g lentil stew, 150g eggplant & tomatoes, 100g goat meat",
      quantity: "~550g",
      image: "/assets/images/meals/cassava-lentil-goat.jpg",
    },
    friday: {
      meal: "Millet Ugali with Bean Curry & Chicken",
      description: "200g millet ugali, 100g bean curry, 150g greens & peppers, 100g chicken",
      quantity: "~550g",
      image: "/assets/images/meals/millet-beans-chicken.jpg",
    },
    saturday: {
      meal: "Rice with Fish Stew & Eggs",
      description: "200g rice, 100g fish stew, 150g mixed veggies, 100g eggs",
      quantity: "~550g",
      image: "/assets/images/meals/rice-fish-eggs.jpg",
    },
    sunday: {
      meal: "Posho with Groundnut Stew & Beef",
      description: "200g posho, 100g groundnut stew, 150g cabbage, 100g beef",
      quantity: "~550g",
      image: "/assets/images/meals/posho-groundnut-beef.jpg",
    },
  },
  supper: {
    monday: {
      meal: "Matoke with Groundnut Sauce & Beef",
      description: "200g matoke, 100g groundnut sauce, 150g veggies (greens, onions), 100g beef",
      quantity: "~550g",
      image: "/assets/images/meals/matooke-groundnut-beef.jpg",
    },
    tuesday: {
      meal: "Rice with Bean Sauce & Fish",
      description: "200g rice, 100g bean sauce, 150g tomatoes & cabbage, 100g fish",
      quantity: "~550g",
      image: "/assets/images/meals/rice-beans-fish.jpg",
    },
    wednesday: {
      meal: "Posho with Pea Sauce & Chicken",
      description: "200g posho, 100g pea sauce, 150g spinach, 100g chicken",
      quantity: "~550g",
      image: "/assets/images/meals/posho-pea-chicken.jpg",
    },
    thursday: {
      meal: "Cassava with Lentil Sauce & Goat",
      description: "200g cassava, 100g lentil sauce, 150g eggplant, 100g goat",
      quantity: "~550g",
      image: "/assets/images/meals/cassava-lentil-goat.jpg",
    },
    friday: {
      meal: "Millet with Groundnut Sauce & Beef",
      description: "200g millet, 100g groundnut sauce, 150g peppers & onions, 100g beef",
      quantity: "~550g",
      image: "/assets/images/meals/millet-groundnut-beef.jpg",
    },
    saturday: {
      meal: "Matoke with Fish Sauce & Eggs",
      description: "200g matoke, 100g fish sauce, 150g greens, 100g eggs",
      quantity: "~550g",
      image: "/assets/images/meals/matooke-fish-eggs.jpg",
    },
    sunday: {
      meal: "Rice with Bean Sauce & Chicken",
      description: "200g rice, 100g bean sauce, 150g cabbage, 100g chicken",
      quantity: "~550g",
      image: "/assets/images/meals/rice-beans-chicken.jpg",
    },
  },
};

/**
 * Low Income - Ready to Eat (Cooked) Menus
 */
export const LOW_INCOME_COOKED_MENUS = {
  breakfast: {
    monday: {
      meal: "Maize Porridge",
      description: "150g porridge (maize), 150ml tea with sugar, 1 banana (150g)",
      quantity: "~450g",
      image: "/assets/images/meals/porridge.jpg",
    },
    tuesday: {
      meal: "Katogo (Cassava & Peas)",
      description: "150g katogo (cassava & peas), 150ml tea, 1 orange (150g)",
      quantity: "~450g",
      image: "/assets/images/meals/katogo.jpg",
    },
    wednesday: {
      meal: "Chapati",
      description: "1 chapati (100g), 150ml tea, 1 mango slice (150g)",
      quantity: "~400g",
      image: "/assets/images/meals/chapati.jpg",
    },
    thursday: {
      meal: "Sweet Potato",
      description: "150g sweet potato, 150ml tea, 1 banana (150g)",
      quantity: "~450g",
      image: "/assets/images/meals/sweet-potato.jpg",
    },
    friday: {
      meal: "Millet Porridge",
      description: "150g millet porridge, 150ml tea, 1 passion fruit (100g)",
      quantity: "~400g",
      image: "/assets/images/meals/millet-porridge.jpg",
    },
    saturday: {
      meal: "Cassava Mash",
      description: "150g cassava mash, 150ml tea, 1 apple (150g)",
      quantity: "~450g",
      image: "/assets/images/meals/cassava-mash.jpg",
    },
    sunday: {
      meal: "Rice Porridge",
      description: "150g rice porridge, 150ml tea, 1 pineapple slice (150g)",
      quantity: "~450g",
      image: "/assets/images/meals/rice-porridge.jpg",
    },
  },
  lunch: {
    monday: {
      meal: "Posho with Beans & Vegetables",
      description: "150g posho, 100g beans, 100g veggies (greens, onions)",
      quantity: "~350g",
      image: "/assets/images/meals/posho-beans.jpg",
    },
    tuesday: {
      meal: "Rice with Pea Stew & Cabbage",
      description: "150g rice, 100g pea stew, 100g cabbage",
      quantity: "~350g",
      image: "/assets/images/meals/rice-peas.jpg",
    },
    wednesday: {
      meal: "Matoke with Groundnuts & Tomatoes",
      description: "150g matoke, 100g groundnuts, 100g tomatoes",
      quantity: "~350g",
      image: "/assets/images/meals/matooke-groundnut.jpg",
    },
    thursday: {
      meal: "Cassava with Lentils & Spinach",
      description: "150g cassava, 100g lentils, 100g spinach",
      quantity: "~350g",
      image: "/assets/images/meals/cassava-lentils.jpg",
    },
    friday: {
      meal: "Millet with Beans & Peppers",
      description: "150g millet, 100g beans, 100g peppers",
      quantity: "~350g",
      image: "/assets/images/meals/millet-beans.jpg",
    },
    saturday: {
      meal: "Posho with Peas & Eggplant",
      description: "150g posho, 100g peas, 100g eggplant",
      quantity: "~350g",
      image: "/assets/images/meals/posho-peas.jpg",
    },
    sunday: {
      meal: "Rice with Groundnuts & Greens",
      description: "150g rice, 100g groundnuts, 100g greens",
      quantity: "~350g",
      image: "/assets/images/meals/rice-groundnut.jpg",
    },
  },
  supper: {
    monday: {
      meal: "Matoke with Groundnut Sauce & Vegetables",
      description: "150g matoke, 100g groundnut sauce, 100g veggies (onions)",
      quantity: "~350g",
      image: "/assets/images/meals/matooke-groundnut.jpg",
    },
    tuesday: {
      meal: "Posho with Bean Sauce & Tomatoes",
      description: "150g posho, 100g bean sauce, 100g tomatoes",
      quantity: "~350g",
      image: "/assets/images/meals/posho-beans.jpg",
    },
    wednesday: {
      meal: "Rice with Pea Sauce & Cabbage",
      description: "150g rice, 100g pea sauce, 100g cabbage",
      quantity: "~350g",
      image: "/assets/images/meals/rice-peas.jpg",
    },
    thursday: {
      meal: "Cassava with Lentil Sauce & Spinach",
      description: "150g cassava, 100g lentil sauce, 100g spinach",
      quantity: "~350g",
      image: "/assets/images/meals/cassava-lentils.jpg",
    },
    friday: {
      meal: "Millet with Groundnut Sauce & Peppers",
      description: "150g millet, 100g groundnut sauce, 100g peppers",
      quantity: "~350g",
      image: "/assets/images/meals/millet-groundnut.jpg",
    },
    saturday: {
      meal: "Matoke with Bean Sauce & Eggplant",
      description: "150g matoke, 100g bean sauce, 100g eggplant",
      quantity: "~350g",
      image: "/assets/images/meals/matooke-beans.jpg",
    },
    sunday: {
      meal: "Posho with Peas & Greens",
      description: "150g posho, 100g peas, 100g greens",
      quantity: "~350g",
      image: "/assets/images/meals/posho-peas.jpg",
    },
  },
};

/**
 * Middle Income - Ready to Cook (Ingredients) Menus
 */
export const MIDDLE_INCOME_READY_TO_COOK_MENUS = {
  breakfast: {
    monday: {
      meal: "Maize Flour Porridge Ingredients",
      description: "100g maize flour, 200ml milk, 50g sugar, 1 banana (150g), 50g groundnuts",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-porridge.jpg",
    },
    tuesday: {
      meal: "Millet Flour Porridge Ingredients",
      description: "100g millet flour, 200ml milk, 50g sugar, 1 mango (200g), 50g peas",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-millet.jpg",
    },
    wednesday: {
      meal: "Chapati Ingredients",
      description: "100g wheat flour (for chapati), 200ml tea leaves & milk, 50g sugar, 1 orange (150g)",
      quantity: "~500g",
      image: "/assets/images/meals/ingredients-chapati.jpg",
    },
    thursday: {
      meal: "Sweet Potato Ingredients",
      description: "200g sweet potatoes, 200ml milk, 50g sugar, 1 apple (150g)",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-sweet-potato.jpg",
    },
    friday: {
      meal: "Rice Pudding Ingredients",
      description: "100g rice, 200ml milk, 50g sugar, 1 banana (150g), 50g nuts",
      quantity: "~550g",
      image: "/assets/images/meals/ingredients-rice.jpg",
    },
    saturday: {
      meal: "Rolex (Chapati & Egg) Ingredients",
      description: "100g cassava flour, 200ml tea, 50g sugar, 1 passion fruit (100g), 1 egg (50g)",
      quantity: "~500g",
      image: "/assets/images/meals/ingredients-rolex.jpg",
    },
    sunday: {
      meal: "Maize Porridge Ingredients",
      description: "100g maize flour, 200ml milk, 50g sugar, 1 pineapple (150g), 50g beans",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-porridge.jpg",
    },
  },
  lunch: {
    monday: {
      meal: "Rice & Bean Stew Ingredients",
      description: "200g rice, 100g dry beans, 150g veggies (tomatoes, onions, greens), 100g chicken, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-rice-beans.jpg",
    },
    tuesday: {
      meal: "Posho & Pea Stew Ingredients",
      description: "200g maize (for posho), 100g peas, 150g cabbage & carrots, 100g beef, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-posho-peas.jpg",
    },
    wednesday: {
      meal: "Matoke & Groundnut Sauce Ingredients",
      description: "200g plantains (matoke), 100g groundnuts, 150g spinach, 100g fish, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-matooke.jpg",
    },
    thursday: {
      meal: "Cassava & Lentil Stew Ingredients",
      description: "200g cassava, 100g lentils, 150g eggplant & tomatoes, 100g goat, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-cassava.jpg",
    },
    friday: {
      meal: "Millet & Bean Curry Ingredients",
      description: "200g millet, 100g beans, 150g greens & peppers, 100g chicken, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-millet-beans.jpg",
    },
    saturday: {
      meal: "Rice & Fish Stew Ingredients",
      description: "200g rice, 100g fish, 150g mixed veggies, 2 eggs (100g), 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-rice-fish.jpg",
    },
    sunday: {
      meal: "Posho & Groundnut Stew Ingredients",
      description: "200g posho maize, 100g groundnuts, 150g cabbage, 100g beef, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-posho-groundnut.jpg",
    },
  },
  supper: {
    monday: {
      meal: "Matoke & Groundnut Sauce Ingredients",
      description: "200g matoke, 100g groundnuts, 150g veggies (greens, onions), 100g beef, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-matooke-groundnut.jpg",
    },
    tuesday: {
      meal: "Rice & Bean Sauce Ingredients",
      description: "200g rice, 100g beans, 150g tomatoes & cabbage, 100g fish, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-rice-beans.jpg",
    },
    wednesday: {
      meal: "Posho & Pea Sauce Ingredients",
      description: "200g posho maize, 100g peas, 150g spinach, 100g chicken, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-posho-peas.jpg",
    },
    thursday: {
      meal: "Cassava & Lentil Sauce Ingredients",
      description: "200g cassava, 100g lentils, 150g eggplant, 100g goat, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-cassava-lentil.jpg",
    },
    friday: {
      meal: "Millet & Groundnut Sauce Ingredients",
      description: "200g millet, 100g groundnuts, 150g peppers & onions, 100g beef, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-millet-groundnut.jpg",
    },
    saturday: {
      meal: "Matoke & Fish Sauce Ingredients",
      description: "200g matoke, 100g fish, 150g greens, 2 eggs (100g), 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-matooke-fish.jpg",
    },
    sunday: {
      meal: "Rice & Bean Sauce Ingredients",
      description: "200g rice, 100g beans, 150g cabbage, 100g chicken, 50ml oil",
      quantity: "~600g",
      image: "/assets/images/meals/ingredients-rice-beans.jpg",
    },
  },
};

/**
 * Low Income - Ready to Cook (Ingredients) Menus
 */
export const LOW_INCOME_READY_TO_COOK_MENUS = {
  breakfast: {
    monday: {
      meal: "Maize Flour Ingredients",
      description: "100g maize flour, 150ml milk, 30g sugar, 1 banana (150g)",
      quantity: "~430g",
      image: "/assets/images/meals/ingredients-maize.jpg",
    },
    tuesday: {
      meal: "Millet Flour Ingredients",
      description: "100g millet flour, 150ml milk, 30g sugar, 1 mango (150g)",
      quantity: "~430g",
      image: "/assets/images/meals/ingredients-millet.jpg",
    },
    wednesday: {
      meal: "Wheat Flour (Chapati) Ingredients",
      description: "100g wheat flour, 150ml tea leaves, 30g sugar, 1 orange (150g)",
      quantity: "~430g",
      image: "/assets/images/meals/ingredients-chapati.jpg",
    },
    thursday: {
      meal: "Sweet Potatoes Ingredients",
      description: "150g sweet potatoes, 150ml milk, 30g sugar, 1 banana (150g)",
      quantity: "~480g",
      image: "/assets/images/meals/ingredients-sweet-potato.jpg",
    },
    friday: {
      meal: "Rice Ingredients",
      description: "100g rice, 150ml milk, 30g sugar, 1 passion fruit (100g)",
      quantity: "~380g",
      image: "/assets/images/meals/ingredients-rice.jpg",
    },
    saturday: {
      meal: "Cassava Flour Ingredients",
      description: "100g cassava flour, 150ml tea, 30g sugar, 1 apple (150g)",
      quantity: "~430g",
      image: "/assets/images/meals/ingredients-cassava.jpg",
    },
    sunday: {
      meal: "Maize Flour Ingredients",
      description: "100g maize flour, 150ml milk, 30g sugar, 1 pineapple (150g)",
      quantity: "~430g",
      image: "/assets/images/meals/ingredients-maize.jpg",
    },
  },
  lunch: {
    monday: {
      meal: "Rice & Beans Ingredients",
      description: "150g rice, 100g dry beans, 100g veggies (tomatoes, onions), 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-rice-beans.jpg",
    },
    tuesday: {
      meal: "Posho & Peas Ingredients",
      description: "150g maize (posho), 100g peas, 100g cabbage, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-posho-peas.jpg",
    },
    wednesday: {
      meal: "Matoke & Groundnuts Ingredients",
      description: "150g plantains (matoke), 100g groundnuts, 100g greens, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-matooke.jpg",
    },
    thursday: {
      meal: "Cassava & Lentils Ingredients",
      description: "150g cassava, 100g lentils, 100g tomatoes, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-cassava-lentil.jpg",
    },
    friday: {
      meal: "Millet & Beans Ingredients",
      description: "150g millet, 100g beans, 100g peppers, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-millet-beans.jpg",
    },
    saturday: {
      meal: "Rice & Peas Ingredients",
      description: "150g rice, 100g peas, 100g eggplant, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-rice-peas.jpg",
    },
    sunday: {
      meal: "Posho & Groundnuts Ingredients",
      description: "150g posho maize, 100g groundnuts, 100g cabbage, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-posho-groundnut.jpg",
    },
  },
  supper: {
    monday: {
      meal: "Matoke & Groundnuts Ingredients",
      description: "150g matoke, 100g groundnuts, 100g veggies (greens), 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-matooke-groundnut.jpg",
    },
    tuesday: {
      meal: "Rice & Beans Ingredients",
      description: "150g rice, 100g beans, 100g tomatoes, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-rice-beans.jpg",
    },
    wednesday: {
      meal: "Posho & Peas Ingredients",
      description: "150g posho maize, 100g peas, 100g cabbage, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-posho-peas.jpg",
    },
    thursday: {
      meal: "Cassava & Lentils Ingredients",
      description: "150g cassava, 100g lentils, 100g spinach, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-cassava-lentil.jpg",
    },
    friday: {
      meal: "Millet & Groundnuts Ingredients",
      description: "150g millet, 100g groundnuts, 100g onions, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-millet-groundnut.jpg",
    },
    saturday: {
      meal: "Matoke & Beans Ingredients",
      description: "150g matoke, 100g beans, 100g eggplant, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-matooke-beans.jpg",
    },
    sunday: {
      meal: "Rice & Peas Ingredients",
      description: "150g rice, 100g peas, 100g greens, 50ml oil",
      quantity: "~400g",
      image: "/assets/images/meals/ingredients-rice-peas.jpg",
    },
  },
};

/**
 * Get weekly menu based on income level and prep type
 * @param {String} incomeLevel - "middle" or "low"
 * @param {String} prepType - "ready-to-eat" or "ready-to-cook"
 * @returns {Object} Weekly menu object
 */
export function getWeeklyMenu(incomeLevel = "middle", prepType = "ready-to-eat") {
  if (incomeLevel === "low") {
    return prepType === "ready-to-eat" ? LOW_INCOME_COOKED_MENUS : LOW_INCOME_READY_TO_COOK_MENUS;
  } else {
    return prepType === "ready-to-eat" ? MIDDLE_INCOME_COOKED_MENUS : MIDDLE_INCOME_READY_TO_COOK_MENUS;
  }
}

/**
 * Get menu for a specific day and meal type
 * @param {String} day - Day of week (monday, tuesday, etc.)
 * @param {String} mealType - breakfast, lunch, or supper
 * @param {String} incomeLevel - "middle" or "low"
 * @param {String} prepType - "ready-to-eat" or "ready-to-cook"
 * @returns {Object} Meal object
 */
export function getMealForDay(day, mealType, incomeLevel = "middle", prepType = "ready-to-eat") {
  const menu = getWeeklyMenu(incomeLevel, prepType);
  return menu[mealType]?.[day] || null;
}

/**
 * Format menu for calendar display
 * Converts the menu structure to the format expected by MealCalendar component
 * @param {String} incomeLevel - "middle" or "low"  
 * @param {String} prepType - "ready-to-eat" or "ready-to-cook"
 * @returns {Object} Formatted menu object
 */
export function formatMenuForCalendar(incomeLevel = "middle", prepType = "ready-to-eat") {
  const menu = getWeeklyMenu(incomeLevel, prepType);
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const mealTypes = ["breakfast", "lunch", "supper"];
  
  const formattedMenu = {};
  
  days.forEach((day) => {
    formattedMenu[day] = {};
    mealTypes.forEach((mealType) => {
      const meal = menu[mealType]?.[day];
      if (meal) {
        // Convert single meal to array format expected by component
        formattedMenu[day][mealType] = [
          {
            meal: meal.meal,
            type: prepType,
            quantity: meal.quantity,
            description: meal.description,
            image: meal.image || "",
          },
        ];
      }
    });
  });
  
  return formattedMenu;
}

