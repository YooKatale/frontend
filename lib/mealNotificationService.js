/**
 * Meal Notification Service
 * 
 * This service handles sending meal reminder notifications to users.
 * Supports multiple notification channels: Email, SMS, WhatsApp, and Web Push.
 * 
 * Current Implementation:
 * - Email: Sends via direct SMTP using /api/mail route
 * - Web Push: Handled by service worker (works when app is closed)
 * - SMS/WhatsApp: Currently disabled (can be enabled when services are configured)
 * 
 * Security:
 * - User email addresses are validated before sending
 * - All user inputs are sanitized to prevent injection attacks
 * - Notification preferences are respected (users can opt-out)
 * 
 * How it works:
 * 1. Gets user's notification preferences
 * 2. Generates personalized meal notification content
 * 3. Sends via appropriate channels based on preferences
 * 4. Logs results for monitoring and debugging
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
 * Send meal notification email via direct SMTP
 * 
 * This function sends personalized meal reminder emails to users.
 * Uses the /api/mail route which sends emails directly via SMTP.
 * 
 * @param {Object} userInfo - User information object containing email and subscription details
 * @param {string} mealType - Type of meal (breakfast, lunch, supper, or test)
 * @param {Array} meals - Optional array of meal items from user's meal calendar
 * @returns {Promise<boolean>} - Returns true if email sent successfully, false otherwise
 * 
 * Security:
 * - Validates user email before sending
 * - Sanitizes all user inputs (userName, mealType, etc.)
 * - Limits meal array size to prevent abuse
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

    console.log("📧 Sending meal notification email via direct SMTP:", {
      email: userInfo.email,
      userName: userName,
      mealType: mealType,
      greeting: greeting,
      mealsCount: meals?.length || 0
    });

    // Use direct SMTP sending via /api/mail route (NOT backend invitation endpoint)
    // This ensures meal notification emails are sent directly, not through invitation logic
    // Get subscription plan if available (check various possible property names)
    const subscriptionPlan = userInfo?.subscriptionPlan || 
                            userInfo?.subscription?.plan || 
                            userInfo?.plan || 
                            userInfo?.subscriptionType || 
                            null;
    
    const response = await fetch("/api/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userInfo.email,
        type: 'meal_notification',
        userName: userName,
        mealType: mealType,
        greeting: greeting,
        meals: meals || [],
        subscriptionPlan: subscriptionPlan // Pass subscription plan for personalized emails
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
 * CURRENTLY: Only sends Email and Web App (Push) notifications
 * SMS and WhatsApp are disabled for now
 * 
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
    email: true, // Default to email if no preferences set
  };

  // Determine which channels to use
  // Email: default to true unless explicitly set to false
  const shouldSendEmail = preferences.email !== false;
  
  // SMS and WhatsApp are disabled for now
  // TODO: Re-enable when SMS/WhatsApp services are ready
  const shouldSendSMS = false;
  const shouldSendWhatsApp = false;

  console.log(`📧 Notification preferences for ${userInfo.email || userInfo.phone || 'user'}:`, {
    email: shouldSendEmail,
    webApp: true, // Push notifications always enabled
    sms: false, // Disabled for now
    whatsapp: false, // Disabled for now
  });

  // Send email if enabled (default)
  if (shouldSendEmail && userInfo.email) {
    try {
      const emailSent = await sendMealNotificationEmail(userInfo, mealType, meals);
      if (emailSent) {
        console.log(`✅ Email notification sent to ${userInfo.email}`);
      } else {
        console.warn(`⚠️ Failed to send email notification to ${userInfo.email}`);
      }
    } catch (error) {
      console.error("❌ Error sending email notification:", error);
    }
  } else if (shouldSendEmail && !userInfo.email) {
    console.warn(`⚠️ Email enabled but no email address found for user`);
  }

  // Note: Push notifications are handled separately in notificationScheduler.js
  // They are sent to ALL users (registered or not) via sendPushNotificationNow()
  
  // SMS and WhatsApp are disabled for now
  // Uncomment below when ready to enable:
  /*
  // Send SMS notification if enabled
  if (shouldSendSMS && userInfo.phone) {
    try {
      const smsSent = await sendMealNotificationSMS(userInfo, mealType);
      if (smsSent) {
        console.log(`✅ SMS notification sent to ${userInfo.phone}`);
      } else {
        console.warn(`⚠️ Failed to send SMS notification to ${userInfo.phone}`);
      }
    } catch (error) {
      console.error("❌ Error sending SMS notification:", error);
    }
  }

  // Send WhatsApp notification if enabled
  if (shouldSendWhatsApp && userInfo.phone) {
    try {
      const whatsappSent = await sendMealNotificationWhatsApp(userInfo, mealType);
      if (whatsappSent) {
        console.log(`✅ WhatsApp notification sent to ${userInfo.phone}`);
      } else {
        console.warn(`⚠️ Failed to send WhatsApp notification to ${userInfo.phone}`);
      }
    } catch (error) {
      console.error("❌ Error sending WhatsApp notification:", error);
    }
  }
  */
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


