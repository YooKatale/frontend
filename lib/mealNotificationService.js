/**
 * Meal Notification Service
 * Handles sending meal notifications via email, SMS, and WhatsApp
 * based on user preferences
 */

/**
 * Get time-based greeting
 */
export function getTimeBasedGreeting() {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
}

/**
 * Get user's full name
 */
export function getUserFullName(userInfo) {
  if (!userInfo) return "Valued Customer";
  const firstName = userInfo.firstname || userInfo.firstName || "";
  const lastName = userInfo.lastname || userInfo.lastName || "";
  return `${firstName} ${lastName}`.trim() || userInfo.email?.split("@")[0] || "Valued Customer";
}

/**
 * Send meal notification via email using backend API (same way as invitations)
 * @param {Object} userInfo - User information
 * @param {string} mealType - Type of meal (breakfast, lunch, supper)
 * @param {Array} meals - Optional array of meal items from calendar
 */
export async function sendMealNotificationEmail(userInfo, mealType, meals = null) {
  try {
    if (!userInfo?.email) {
      console.log("No email found for user");
      return false;
    }

    const userName = getUserFullName(userInfo);
    const greeting = getTimeBasedGreeting();
    
    const mealNames = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      supper: "Supper",
    };

    // Format meal items if provided
    let mealItemsText = "";
    if (meals && meals.length > 0) {
      mealItemsText = meals
        .map((item) => `${item.meal} (${item.quantity})`)
        .join(", ");
    }

    // Use frontend API route for meal notifications (NOT invitation endpoint)
    // This ensures meal calendar emails are sent, not invitation emails
    const response = await fetch("/api/meal-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userInfo.email,
        userName: userName,
        mealType: mealType,
        notificationType: "email",
        meals: meals || [], // Full meal calendar data
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Meal notification email sent to ${userInfo.email}`, result);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("Failed to send meal notification email:", errorData);
      return false;
    }
  } catch (error) {
    console.error("Error sending meal notification email:", error);
    return false;
  }
}

/**
 * Send meal notification based on user preferences
 * @param {Object} userInfo - User information
 * @param {string} mealType - Type of meal (breakfast, lunch, supper)
 * @param {Array} meals - Optional array of meal items from calendar
 */
export async function sendMealNotification(userInfo, mealType, meals = null) {
  if (!userInfo) {
    console.log("No user info provided");
    return;
  }

  // Get notification preferences - email is default if not specified
  const preferences = userInfo.notificationPreferences || {
    email: true, // Default
    calls: false,
    whatsapp: false,
  };

  // If no preferences set, default to email
  const shouldSendEmail = preferences.email !== false;
  const shouldSendSMS = preferences.calls === true || preferences.sms === true;
  const shouldSendWhatsApp = preferences.whatsApp === true || preferences.whatsapp === true;

  // Send email if enabled (default)
  if (shouldSendEmail) {
    try {
      await sendMealNotificationEmail(userInfo, mealType, meals);
      console.log(`Email notification sent to ${userInfo.email}`);
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }

  // Send SMS notification if enabled
  if (shouldSendSMS) {
    try {
      await sendMealNotificationSMS(userInfo, mealType);
      console.log(`SMS notification sent to ${userInfo.phone}`);
    } catch (error) {
      console.error("Error sending SMS notification:", error);
    }
  }

  // Send WhatsApp notification if enabled
  if (shouldSendWhatsApp) {
    try {
      await sendMealNotificationWhatsApp(userInfo, mealType);
      console.log(`WhatsApp notification sent to ${userInfo.phone}`);
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
    }
  }
}

/**
 * Send meal notification via SMS
 */
export async function sendMealNotificationSMS(userInfo, mealType) {
  try {
    if (!userInfo?.phone) {
      console.log("No phone number found for SMS");
      return false;
    }

    const userName = getUserFullName(userInfo);
    const greeting = getTimeBasedGreeting();
    
    const mealNames = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      supper: "Supper",
    };

    const message = `${greeting}, ${userName}! Your ${mealNames[mealType]} menu is ready. Check your meal calendar at yookatale.app/subscription`;

    // TODO: Integrate with SMS service (Twilio, etc.)
    // For now, log the message
    console.log(`SMS would be sent to ${userInfo.phone}:`, message);
    
    // In production, call your SMS API here
    // await fetch("/api/sms", {
    //   method: "POST",
    //   body: JSON.stringify({ phone: userInfo.phone, message }),
    // });

    return true;
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    return false;
  }
}

/**
 * Send meal notification via WhatsApp
 */
export async function sendMealNotificationWhatsApp(userInfo, mealType) {
  try {
    if (!userInfo?.phone) {
      console.log("No phone number found for WhatsApp");
      return false;
    }

    const userName = getUserFullName(userInfo);
    const greeting = getTimeBasedGreeting();
    
    const mealNames = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      supper: "Supper",
    };

    const message = `${greeting}, ${userName}! Your ${mealNames[mealType]} menu is ready. Check your meal calendar at yookatale.app/subscription`;

    // TODO: Integrate with WhatsApp Business API
    // For now, log the message
    console.log(`WhatsApp would be sent to ${userInfo.phone}:`, message);
    
    // In production, call your WhatsApp API here
    // await fetch("/api/whatsapp", {
    //   method: "POST",
    //   body: JSON.stringify({ phone: userInfo.phone, message }),
    // });

    return true;
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return false;
  }
}


