import { NextResponse } from "next/server";
import { getMealCalendarEmailTemplate } from "@constants/mealCalendarEmailTemplate";
import transporter, { defaultSender } from "@lib/emailConfig";

/**
 * Send meal notification email
 * POST /api/meal-notification
 * Body: { email, userName, mealType, notificationType }
 */
export const POST = async (req) => {
  try {
    const requestData = await req.json();
    const { email, userName, mealType, notificationType = "email", meals } = requestData;

    if (!email || !userName || !mealType) {
      return NextResponse.json(
        { error: "Missing required fields: email, userName, mealType" },
        { status: 400 }
      );
    }

    // Get time-based greeting
    const currentHour = new Date().getHours();
    let greeting = "Hello";
    if (currentHour >= 5 && currentHour < 12) {
      greeting = "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      greeting = "Good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      greeting = "Good evening";
    } else {
      greeting = "Good night";
    }

    // Only send email if notification type is email
    if (notificationType === "email" || notificationType === "all") {
      // Generate email template based on meal calendar (meals data from request)
      const emailHtml = getMealCalendarEmailTemplate(userName, mealType, greeting, meals || []);

      const mailOptions = {
        from: {
          name: defaultSender.name,
          address: defaultSender.email, // yookatale256@gmail.com via sendgrid.net
        },
        replyTo: defaultSender.email,
        to: email,
        subject: `${greeting}! Your ${mealType === "breakfast" ? "Breakfast" : mealType === "lunch" ? "Lunch" : "Supper"} Reminder - Meal Calendar 🍽️`,
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);
    }

    // TODO: Add SMS and WhatsApp sending logic here
    // if (notificationType === "sms" || notificationType === "whatsapp" || notificationType === "all") {
    //   // Send SMS/WhatsApp notification
    // }

    return NextResponse.json(
      { success: true, message: "Meal notification sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending meal notification:", error);
    return NextResponse.json(
      { error: "Failed to send meal notification", details: error.message },
      { status: 500 }
    );
  }
};

