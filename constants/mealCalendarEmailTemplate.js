/**
 * Meal Calendar Email Template
 * Used ONLY for meal reminder notifications (breakfast, lunch, supper)
 * Based on actual meal calendar data
 */

export const getMealCalendarEmailTemplate = (userName, mealType, greeting, meals, subscriptionPlan = null) => {
  // Default values for unknown meal types (like "test")
  const mealEmojis = {
    breakfast: "🍳",
    lunch: "🍽️",
    supper: "🌙",
    test: "🧪",
  };

  const mealNames = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    supper: "Supper",
    test: "Test Meal",
  };

  const mealTimes = {
    breakfast: "6:00 AM - 10:00 AM",
    lunch: "12:00 PM - 3:00 PM",
    supper: "5:00 PM - 10:00 PM",
    test: "Anytime",
  };

  // Get values with fallbacks
  const emoji = mealEmojis[mealType] || mealEmojis.lunch;
  const mealName = mealNames[mealType] || "Meal";
  const mealTime = mealTimes[mealType] || "Available now";

  // Format meal items with images - handle different meal object structures
  let mealItemsHtml = "";
  if (meals && Array.isArray(meals) && meals.length > 0) {
    mealItemsHtml = meals
      .map((item) => {
        // Handle different property names (meal vs mealName, etc.)
        const itemMealName = item.meal || item.mealName || item.name || "Meal";
        const quantity = item.quantity || item.qty || "1 serving";
        const mealTypeVal = item.type || item.prepType || "ready-to-eat";
        // Get meal image - check various possible property names; make absolute for email
        let mealImage = item.image || item.mealImage || item.img || item.photo || 
                         item.images?.[0] || item.picture || null;
        if (mealImage && typeof mealImage === "string" && mealImage.startsWith("/")) {
          mealImage = "https://www.yookatale.app" + mealImage;
        }
        
        const typeBadge = mealTypeVal === "ready-to-eat" 
          ? '<span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">Ready-to-Eat</span>'
          : '<span style="background-color: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">Ready-to-Cook</span>';
        
        // Escape HTML to prevent XSS
        const escapeHtml = (text) => {
          if (!text) return "";
          return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        };
        
        // Validate image URL to prevent XSS
        const getImageUrl = (img) => {
          if (!img || typeof img !== 'string') return null;
          // Only allow http/https URLs or relative paths starting with /
          if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
            return img;
          }
          return null;
        };
        
        const imageUrl = getImageUrl(mealImage);
        const imageHtml = imageUrl 
          ? `<td style="width: 80px; padding: 6px; vertical-align: middle;">
              <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(itemMealName)}" style="width: 72px; height: 72px; object-fit: cover; border-radius: 6px; display: block;" />
            </td>`
          : `<td style="width: 80px; padding: 6px; vertical-align: middle; background-color: #f3f4f6; border-radius: 6px; text-align: center;"><span style="color: #9ca3af; font-size: 10px;">—</span></td>`;
        
        return `
          <tr>
            ${imageHtml}
            <td style="padding: 6px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: middle;">
              <strong style="color: #1f2937; font-size: 13px;">${escapeHtml(itemMealName)}</strong>
              ${typeBadge}
              <span style="color: #6b7280; font-size: 11px; display: block; margin-top: 2px;">${escapeHtml(quantity)}</span>
            </td>
          </tr>
        `;
      })
      .join("");
  } else {
    mealItemsHtml = `
      <tr>
        <td colspan="2" style="padding: 12px; text-align: center; color: #6b7280;">
          Check your meal calendar for today's options
        </td>
      </tr>
    `;
  }

  const readyToEat = meals?.filter((m) => m.type === "ready-to-eat") || [];
  const readyToCook = meals?.filter((m) => m.type === "ready-to-cook") || [];
  
  let availabilityText = "";
  if (readyToEat.length > 0 && readyToCook.length > 0) {
    availabilityText = "Available as ready-to-eat and ready-to-cook options.";
  } else if (readyToEat.length > 0) {
    availabilityText = "All items available as ready-to-eat.";
  } else if (readyToCook.length > 0) {
    availabilityText = "All items available as ready-to-cook.";
  }

  // Subscription-specific message (only when plan is set; no "Not subscribed?" block)
  const subscriptionMessage = subscriptionPlan 
    ? `<p style="font-size: 12px; color: #185f2d; margin: 0 0 10px 0; padding: 8px 10px; background-color: #f0fdf4; border-radius: 6px;"><strong>${subscriptionPlan} Plan</strong> — Your options are ready.</p>`
    : "";

  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 16px 20px; text-align: center; background-color: #000000;">
        <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="YooKatale Logo" style="max-width: 120px; height: auto; display: block; margin: 0 auto;" />
      </td>
    </tr>
    <tr>
      <td style="padding: 14px 18px; background-color: #ffffff;">
        <p style="font-size: 15px; color: #1f2937; margin: 0 0 4px 0; font-weight: 600;">${greeting || "Hello"}, ${userName || "Valued Customer"}!</p>
        <p style="font-size: 12px; color: #6b7280; margin: 0 0 10px 0;">Your <strong>${mealName}</strong> menu — ${mealTime}</p>
        ${subscriptionMessage}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 12px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: linear-gradient(135deg, #185f2d 0%, #1f793a 100%);">
              <th colspan="2" style="padding: 8px 12px; text-align: left; color: #ffffff; font-size: 13px; font-weight: 600;">Today's ${mealName} Menu</th>
            </tr>
          </thead>
          <tbody style="background-color: #ffffff;">
            ${mealItemsHtml}
          </tbody>
        </table>
        ${availabilityText ? `<p style="font-size: 11px; color: #059669; margin: 0 0 10px 0; padding: 6px 8px; background-color: #d1fae5; border-radius: 6px;">${availabilityText}</p>` : ''}
        <div style="text-align: center; margin: 12px 0;">
          <a href="https://www.yookatale.app/subscription" style="display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #185f2d 0%, #1f793a 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px;">View meal calendar & order</a>
        </div>

        <p style="color: #111827; font-size: 12px; font-weight: 700; margin: 14px 0 6px; text-align: center;">Your next steps</p>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 12px;">
          <tr>
            <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/signup" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 11px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/add-user-male.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Signup</a></td>
            <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/subscription" style="display: inline-block; padding: 8px 10px; background-color: #185f2d; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 11px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Subscribe</a></td>
            <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/partner" style="display: inline-block; padding: 8px 10px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 11px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/handshake.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Partner</a></td>
            <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/#refer" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 11px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/gift.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Invite</a></td>
            <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app" style="display: inline-block; padding: 8px 10px; background-color: #4b5563; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 11px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shop.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Shop</a></td>
          </tr>
        </table>

        <div style="margin-top: 12px; padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #0f172a; font-size: 12px; font-weight: 700; margin: 0 0 2px;">Yookatale in your pocket</p>
          <p style="color: #64748b; font-size: 11px; margin: 0 0 8px;">Download the app — shop, subscribe, track orders.</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 auto;">
            <tr>
              <td align="center" style="padding: 0 6px;">
                <a href="https://www.yookatale.app/subscription" style="text-decoration: none; display: inline-block;">
                  <img src="https://assets.stickpng.com/images/5a902db97f96951c82922874.png" alt="Download on the App Store" width="140" style="display: block; border: 0; height: auto; max-width: 140px;" />
                </a>
              </td>
              <td align="center" style="padding: 0 6px;">
                <a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" style="text-decoration: none; display: inline-block;">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width="140" style="display: block; border: 0; height: auto;" />
                </a>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 14px 18px; text-align: center; background-color: #000000; border-top: 1px solid #333;">
        <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px 0;">P.O. Box 74940 · Clock-Tower Plot 6, 27 Kampala · Entebbe, Uganda</p>
        <p style="font-size: 10px; color: #6b7280; margin: 0;">© ${new Date().getFullYear()} Yookatale. <a href="https://www.yookatale.app/account" style="color: #10b981; text-decoration: underline;">Manage preferences</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

