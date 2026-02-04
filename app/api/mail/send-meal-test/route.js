/**
 * Send a single meal reminder test email with real meal calendar data.
 * POST body: { email?, mealType? } — defaults: timothy.arihoz@protonmail.com, lunch
 */

import { NextResponse } from "next/server";
import { getMealCalendarEmailTemplate } from "@constants/mealCalendarEmailTemplate";
import { getTodaysMealsFromCalendar } from "@lib/mealCalendarService";
import transporter from "@lib/emailConfig";

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

const GREETINGS = { breakfast: "Good Morning", lunch: "Good Afternoon", supper: "Good Evening" };
const MEAL_NAMES = { breakfast: "Breakfast", lunch: "Lunch", supper: "Supper" };

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const email = body.email || "timothy.arihoz@protonmail.com";
    const mealType = (body.mealType || "lunch").toLowerCase();
    if (!["breakfast", "lunch", "supper"].includes(mealType)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid mealType", details: "Use breakfast, lunch, or supper" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!isValidEmail(email)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!transporter) {
      return new NextResponse(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const meals = getTodaysMealsFromCalendar(mealType);
    const greeting = GREETINGS[mealType] || "Hello";
    const mealName = MEAL_NAMES[mealType] || "Meal";
    const userName = body.userName || "Valued Customer";
    const subscriptionPlan = body.subscriptionPlan || null;

    const emailHtml = getMealCalendarEmailTemplate(userName, mealType, greeting, meals, subscriptionPlan);
    const subject = `${greeting}! Your ${mealName} Reminder - Meal Calendar`;

    await transporter.sendMail({
      from: { name: "YooKatale", address: "info@yookatale.app" },
      replyTo: "info@yookatale.app",
      to: email,
      subject,
      html: emailHtml,
    });

    console.log(`✅ Meal test email sent to ${email} (${mealType}, ${meals?.length || 0} meals)`);
    return new NextResponse(
      JSON.stringify({ success: true, message: "Meal reminder test email sent", email, mealType, mealsCount: meals?.length || 0 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Send meal test email error:", error.message);
    return new NextResponse(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
