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
        const mealName = item.meal || item.mealName || item.name || "Meal";
        const quantity = item.quantity || item.qty || "1 serving";
        const mealType = item.type || item.prepType || "ready-to-eat";
        // Get meal image - check various possible property names
        const mealImage = item.image || item.mealImage || item.img || item.photo || 
                         item.images?.[0] || item.picture || null;
        
        const typeBadge = mealType === "ready-to-eat" 
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
          ? `<td style="width: 100px; padding: 12px; vertical-align: top;">
              <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(mealName)}" style="width: 100%; max-width: 100px; height: auto; border-radius: 8px; object-fit: cover;" />
            </td>`
          : `<td style="width: 100px; padding: 12px; vertical-align: top; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: #e5e7eb; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <span style="color: #6b7280; font-size: 20px; font-weight: bold;">MEAL</span>
              </div>
            </td>`;
        
        return `
          <tr>
            ${imageHtml}
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div>
                  <strong style="color: #1f2937; font-size: 15px; display: block; margin-bottom: 4px;">${escapeHtml(mealName)}</strong>
                  ${typeBadge}
                </div>
                <span style="color: #6b7280; font-size: 13px;">${escapeHtml(quantity)}</span>
              </div>
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

  // Subscription-specific message
  const subscriptionMessage = subscriptionPlan 
    ? `<p style="font-size: 14px; color: #185f2d; margin: 15px 0; padding: 12px; background-color: #f0fdf4; border-left: 4px solid #185f2d; border-radius: 6px;">
        <strong>${subscriptionPlan} Plan:</strong> Your personalized meal options are ready!
      </p>`
    : `<p style="font-size: 14px; color: #6b7280; margin: 15px 0; padding: 12px; background-color: #f9fafb; border-left: 4px solid #6b7280; border-radius: 6px;">
        <strong>Not subscribed?</strong> <a href="https://www.yookatale.app/subscription" style="color: #185f2d; text-decoration: underline; font-weight: bold;">Subscribe now</a> to get personalized meal recommendations and exclusive benefits!
      </p>`;

  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
    <!-- Header with Logo - Black Background -->
    <tr>
      <td style="padding: 30px 20px; text-align: center; background-color: #000000;">
        <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="YooKatale Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
      </td>
    </tr>
    
    <!-- Meal Notification Content -->
    <tr>
      <td style="padding: 40px 30px; background-color: #ffffff;">
        <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 10px 0; font-weight: 600;">${greeting || "Hello"}, ${userName || "Valued Customer"}!</h2>
        
        <p style="font-size: 18px; color: #374151; line-height: 1.6; margin: 0 0 25px 0; font-weight: 500;">
          Your <strong style="color: #185f2d;">${mealName}</strong> menu is ready! Here's what's available for <strong>${mealTime}</strong>:
        </p>
        
        ${subscriptionMessage}
        
        <!-- Meal Items Table with Images -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0; border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: linear-gradient(135deg, #185f2d 0%, #1f793a 100%);">
              <th colspan="2" style="padding: 16px 20px; text-align: left; color: #ffffff; font-size: 16px; font-weight: 600;">
                Today's ${mealName} Menu
              </th>
            </tr>
          </thead>
          <tbody style="background-color: #ffffff;">
            ${mealItemsHtml}
          </tbody>
        </table>
        
        ${availabilityText ? `<p style="font-size: 14px; color: #059669; margin: 15px 0; padding: 12px; background-color: #d1fae5; border-radius: 8px; border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">●</strong> ${availabilityText}
        </p>` : ''}
        
        <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 25px 0; text-align: center;">
          Don't miss out on today's delicious meals. Place your order now and enjoy fresh, customizable meals delivered to your doorstep in <strong style="color: #185f2d;">15-45 minutes</strong>!
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.yookatale.app/subscription" style="display: inline-block; padding: 16px 36px; background: linear-gradient(135deg, #185f2d 0%, #1f793a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(24, 95, 45, 0.3);">
            View Meal Calendar & Order Now
          </a>
        </div>
      </td>
    </tr>
    
    <!-- Footer - Black Background -->
    <tr>
      <td style="padding: 30px 20px; text-align: center; background-color: #000000; border-top: 2px solid #333333;">
        <p style="font-size: 13px; color: #9ca3af; margin: 0 0 8px 0; line-height: 1.6;">
          P.O. Box 74940<br>
          Clock-Tower Plot 6, 27 Kampala<br>
          Entebbe, Uganda
        </p>
        <p style="font-size: 12px; color: #6b7280; margin: 15px 0 0 0;">
          Copyright © ${new Date().getFullYear()} YooKatale. All rights reserved.
        </p>
        <p style="font-size: 11px; color: #6b7280; margin: 10px 0 0 0;">
          You're receiving this because you subscribed to meal notifications. 
          <a href="https://www.yookatale.app/account" style="color: #10b981; text-decoration: underline;">Manage preferences</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

