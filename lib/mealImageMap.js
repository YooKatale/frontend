/**
 * Meal image URLs (Unsplash) for meal calendar.
 * Maps config image keys (e.g. katogo-chapati) to relevant food photos.
 * Fallback: generic meal image.
 */

const U = (id, w = 500, h = 350) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

const MEAL_IMAGES = {
  // Breakfast – cooked
  "katogo-chapati": U("1598047192992-71e2e0a82b8f"), // beans, starch
  "porridge-groundnuts": U("1546069901-ba9599a7e63c"), // porridge / grains
  "millet-bread": U("1509440158956-6d6bfc3f7c67"), // bread
  "sweet-potato-beans": U("1512621776951-a65551f14633"), // rice/beans style
  "rice-pudding": U("1488477181946-6428a0291777"), // rice dish
  "rolex": U("1525351484162-ef0914e42151"), // egg wrap / breakfast
  "cassava-porridge": U("1494597564530-871f2b93ac55"), // porridge
  // Lunch / supper – cooked
  "rice-beans-chicken": U("1565299502907-afc6a9efd09c"), // rice chicken
  "posho-pea-beef": U("1544025162-d766342659c0"), // meat starch
  "matooke-groundnut-fish": U("1563379926898-05f4575a45d8"), // fish dish
  "cassava-lentil-goat": U("1546069901-d5bfd2cbfb1f"), // lentils meat
  "millet-beans-chicken": U("1565299502907-afc6a9efd09c"),
  "rice-fish-eggs": U("1559847844-5315695dadae"), // fish rice
  "posho-groundnut-beef": U("1544025162-d766342659c0"),
  "matooke-groundnut-beef": U("1534422298391-e4f8c172dddb"), // plantain meat
  "rice-beans-fish": U("1563379926898-05f4575a45d8"),
  "posho-pea-chicken": U("1604329760661-999f4c130b16"), // chicken
  "millet-groundnut-beef": U("1544025162-d766342659c0"),
  "matooke-fish-eggs": U("1559847844-5315695dadae"),
  // Low-income cooked
  "porridge": U("1494597564530-871f2b93ac55"),
  "katogo": U("1598047192992-71e2e0a82b8f"),
  "chapati": U("1604329760661-999f4c130b16"),
  "sweet-potato": U("1512621776951-a65551f14633"),
  "millet-porridge": U("1494597564530-871f2b93ac55"),
  "cassava-mash": U("1547592166-4db649c13261"),
  "rice-porridge": U("1488477181946-6428a0291777"),
  "posho-beans": U("1565299502907-afc6a9efd09c"),
  "rice-peas": U("1512621776951-a65551f14633"),
  "matooke-groundnut": U("1534422298391-e4f8c172dddb"),
  "cassava-lentils": U("1546069901-d5bfd2cbfb1f"),
  "millet-beans": U("1565299502907-afc6a9efd09c"),
  "posho-peas": U("1512621776951-a65551f14633"),
  "rice-groundnut": U("1512621776951-a65551f14633"),
  "millet-groundnut": U("1544025162-d766342659c0"),
  "matooke-beans": U("1534422298391-e4f8c172dddb"),
  // Ready-to-cook ingredients
  "ingredients-porridge": U("1488477181946-6428a0291777"),
  "ingredients-millet": U("1488477181946-6428a0291777"),
  "ingredients-chapati": U("1509440158956-6d6bfc3f7c67"),
  "ingredients-sweet-potato": U("1512621776951-a65551f14633"),
  "ingredients-rice": U("1586202395784-68f48e08a637"),
  "ingredients-rolex": U("1525351484162-ef0914e42151"),
  "ingredients-rice-beans": U("1512621776951-a65551f14633"),
  "ingredients-posho-peas": U("1512621776951-a65551f14633"),
  "ingredients-matooke": U("1534422298391-e4f8c172dddb"),
  "ingredients-cassava": U("1547592166-4db649c13261"),
  "ingredients-millet-beans": U("1565299502907-afc6a9efd09c"),
  "ingredients-rice-fish": U("1563379926898-05f4575a45d8"),
  "ingredients-posho-groundnut": U("1544025162-d766342659c0"),
  "ingredients-matooke-groundnut": U("1534422298391-e4f8c172dddb"),
  "ingredients-cassava-lentil": U("1546069901-d5bfd2cbfb1f"),
  "ingredients-millet-groundnut": U("1544025162-d766342659c0"),
  "ingredients-matooke-fish": U("1563379926898-05f4575a45d8"),
  "ingredients-maize": U("1488477181946-6428a0291777"),
  "ingredients-matooke-beans": U("1534422298391-e4f8c172dddb"),
  "ingredients-rice-peas": U("1512621776951-a65551f14633"),
};

const FALLBACK = U("1546069901-ba9599a7e63c", 500, 350);

/**
 * Resolve meal image URL. Prefer Unsplash map; else fallback.
 * Never throws.
 * @param {Object} meal - { meal, image, ... }
 * @returns {string} Image URL
 */
export function getMealImageUrl(meal) {
  try {
    if (!meal || typeof meal !== "object") return FALLBACK;
    const path = typeof meal.image === "string" ? meal.image : "";
    const key = path.replace(/^.*\/meals\//, "").replace(/\.(jpg|jpeg|png|webp)$/i, "").trim() || null;
    if (key && MEAL_IMAGES[key]) return MEAL_IMAGES[key];
    if (path.startsWith("http")) return path;
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export default MEAL_IMAGES;
