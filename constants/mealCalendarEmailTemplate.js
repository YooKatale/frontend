/**
 * Meal Calendar Email Template
 * Used ONLY for meal reminder notifications (breakfast, lunch, supper)
 * Based on actual meal calendar data
 */

export const getMealCalendarEmailTemplate = (userName, mealType, greeting, meals) => {
  const mealEmojis = {
    breakfast: "🍳",
    lunch: "🍽️",
    supper: "🌙",
  };

  const mealNames = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    supper: "Supper",
  };

  const mealTimes = {
    breakfast: "6:00 AM - 10:00 AM",
    lunch: "12:00 PM - 3:00 PM",
    supper: "5:00 PM - 10:00 PM",
  };

  // Format meal items
  let mealItemsHtml = "";
  if (meals && meals.length > 0) {
    mealItemsHtml = meals
      .map((item) => {
        const typeBadge = item.type === "ready-to-eat" 
          ? '<span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">Ready-to-Eat</span>'
          : '<span style="background-color: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">Ready-to-Cook</span>';
        
        return `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="color: #1f2937; font-size: 15px;">${item.meal}</strong>
                  ${typeBadge}
                </div>
                <span style="color: #6b7280; font-size: 13px;">${item.quantity}</span>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  } else {
    mealItemsHtml = `
      <tr>
        <td style="padding: 12px; text-align: center; color: #6b7280;">
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

  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="padding: 30px 20px; text-align: center; background-color: #1a202c;">
        <h1 style="font-size: 28px; color: #ffffff; margin: 0;">YooKatale ${mealEmojis[mealType]}</h1>
        <p style="font-size: 16px; color: #cbd5e1; margin: 10px 0 0 0;">Meal Reminder</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 30px 20px;">
        <h2 style="font-size: 22px; color: #1f2937; margin: 0 0 15px 0;">${greeting}, ${userName}!</h2>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
          Your <strong>${mealNames[mealType]}</strong> menu is ready! Here's what's available for ${mealTimes[mealType]}:
        </p>
        
        <!-- Meal Items Table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; text-align: left; color: #1f2937; font-size: 14px; font-weight: 600;">
                Today's ${mealNames[mealType]} Menu
              </th>
            </tr>
          </thead>
          <tbody>
            ${mealItemsHtml}
          </tbody>
        </table>
        
        ${availabilityText ? `<p style="font-size: 14px; color: #059669; margin: 15px 0; padding: 10px; background-color: #d1fae5; border-radius: 6px;">✓ ${availabilityText}</p>` : ''}
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 20px 0;">
          Don't miss out on today's delicious meals. Place your order now and enjoy fresh, customizable meals delivered to your doorstep in 15-45 minutes!
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://yookatale.app/subscription" style="display: inline-block; padding: 14px 32px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            View Meal Calendar & Order
          </a>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f4f4f4; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 14px; color: #777777; margin: 0;">
          &copy; ${new Date().getFullYear()} YooKatale. All rights reserved.
        </p>
        <p style="font-size: 12px; color: #999999; margin: 10px 0 0 0;">
          You're receiving this because you subscribed to meal notifications. 
          <a href="https://yookatale.app/account" style="color: #1a202c; text-decoration: underline;">Manage preferences</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

