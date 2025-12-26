/**
 * Meal Notification Email Template
 * Personalized email template for meal reminders
 */
export const getMealNotificationEmailTemplate = (userName, mealType, greeting) => {
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

  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 30px 20px; text-align: center; background-color: #1a202c;">
        <h1 style="font-size: 28px; color: #ffffff; margin: 0;">YooKatale ${mealEmojis[mealType]}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <h2 style="font-size: 22px; color: #333333; margin: 0 0 15px 0;">${greeting}, ${userName}!</h2>
        <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 20px 0;">
          Your ${mealNames[mealType]} menu is ready! Check your meal calendar to see what's available for ${mealTimes[mealType]}.
        </p>
        <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 20px 0;">
          Don't miss out on today's delicious meals. Place your order now and enjoy fresh, customizable meals delivered to your doorstep!
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://yookatale.app/subscription" style="display: inline-block; padding: 12px 30px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">View Meal Calendar</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f4f4f4; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 14px; color: #777777; margin: 0;">
          &copy; ${new Date().getFullYear()} YooKatale. All rights reserved.
        </p>
        <p style="font-size: 12px; color: #999999; margin: 10px 0 0 0;">
          You're receiving this because you subscribed to meal notifications. 
          <a href="https://yookatale.app/account" style="color: #1a202c;">Manage preferences</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

