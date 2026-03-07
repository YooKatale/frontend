/**
 * Meal Calendar Email Template
 * Used ONLY for meal reminder notifications (breakfast, lunch, supper).
 * New dark UI via getEmailLayout — no external icons/images in shell.
 */

import { getEmailLayout } from "./emailLayout";

const escapeHtml = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getImageUrl = (img) => {
  if (!img || typeof img !== "string") return null;
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) return img;
  return null;
};

export const getMealCalendarEmailTemplate = (userName, mealType, greeting, meals, subscriptionPlan = null) => {
  const mealNames = { breakfast: "Breakfast", lunch: "Lunch", supper: "Supper", test: "Test Meal" };
  const mealTimes = { breakfast: "6:00 AM - 10:00 AM", lunch: "12:00 PM - 3:00 PM", supper: "5:00 PM - 10:00 PM", test: "Anytime" };
  const mealName = mealNames[mealType] || "Meal";
  const mealTime = mealTimes[mealType] || "Available now";

  let mealItemsHtml = "";
  if (meals && Array.isArray(meals) && meals.length > 0) {
    mealItemsHtml = meals
      .map((item) => {
        const itemMealName = item.meal || item.mealName || item.name || "Meal";
        const quantity = item.quantity || item.qty || "1 serving";
        const mealTypeVal = item.type || item.prepType || "ready-to-eat";
        let mealImage = item.image || item.mealImage || item.img || item.photo || item.images?.[0] || item.picture || null;
        if (mealImage && typeof mealImage === "string" && mealImage.startsWith("/")) {
          mealImage = "https://www.yookatale.app" + mealImage;
        }
        const typeBadge =
          mealTypeVal === "ready-to-eat"
            ? '<span style="background:#0d3d20;color:#2ecc71;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:8px;">Ready-to-Eat</span>'
            : '<span style="background:#1e3a5f;color:#93c5fd;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:8px;">Ready-to-Cook</span>';
        const imageUrl = getImageUrl(mealImage);
        const imageHtml = imageUrl
          ? `<td style="width:80px;padding:6px;vertical-align:middle;"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(itemMealName)}" style="width:72px;height:72px;object-fit:cover;border-radius:6px;display:block;" /></td>`
          : `<td style="width:80px;padding:6px;vertical-align:middle;background:rgba(255,255,255,0.04);border-radius:6px;text-align:center;"><span style="color:#555;font-size:10px;">—</span></td>`;
        return `
          <tr>
            ${imageHtml}
            <td style="padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.06);vertical-align:middle;">
              <strong style="color:#d1d5db;font-size:13px;">${escapeHtml(itemMealName)}</strong>
              ${typeBadge}
              <span style="color:#888;font-size:11px;display:block;margin-top:2px;">${escapeHtml(quantity)}</span>
            </td>
          </tr>
        `;
      })
      .join("");
  } else {
    mealItemsHtml = `
      <tr>
        <td colspan="2" style="padding:12px;text-align:center;color:#888;">Check your meal calendar for today's options</td>
      </tr>
    `;
  }

  const readyToEat = meals?.filter((m) => m.type === "ready-to-eat") || [];
  const readyToCook = meals?.filter((m) => m.type === "ready-to-cook") || [];
  let availabilityText = "";
  if (readyToEat.length > 0 && readyToCook.length > 0) availabilityText = "Available as ready-to-eat and ready-to-cook options.";
  else if (readyToEat.length > 0) availabilityText = "All items available as ready-to-eat.";
  else if (readyToCook.length > 0) availabilityText = "All items available as ready-to-cook.";

  const subscriptionMessage =
    subscriptionPlan
      ? `<p style="font-size:12px;color:#2ecc71;margin:0 0 10px;padding:8px 10px;background:rgba(46,204,113,0.1);border-radius:6px;"><strong>${escapeHtml(subscriptionPlan)} Plan</strong> — Your options are ready.</p>`
      : "";

  const bodyHtml = `
    <p class="intro">${escapeHtml(greeting || "Hello")}, ${escapeHtml(userName || "Valued Customer")}!</p>
    <p class="intro">Your <strong>${mealName}</strong> menu — ${mealTime}</p>
    ${subscriptionMessage}
    <div class="body-card" style="padding:0;overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr style="background:rgba(46,204,113,0.15);">
            <th colspan="2" style="padding:8px 12px;text-align:left;color:#2ecc71;font-size:13px;font-weight:600;">Today's ${mealName} Menu</th>
          </tr>
        </thead>
        <tbody>
          ${mealItemsHtml}
        </tbody>
      </table>
    </div>
    ${availabilityText ? `<p class="intro" style="font-size:11px;color:#2ecc71;margin:0 0 10px;padding:6px 8px;background:rgba(46,204,113,0.08);border-radius:6px;">${availabilityText}</p>` : ""}
    <p style="text-align:center;margin-top:16px;"><a href="https://www.yookatale.app/subscription" class="body-btn">View meal calendar &amp; order</a></p>
  `;

  return getEmailLayout({
    pageTitle: `${mealName} – Yookatale`,
    headerTitle: `Your ${mealName} menu`,
    headerSub: mealTime,
    bodyHtml,
  });
};
