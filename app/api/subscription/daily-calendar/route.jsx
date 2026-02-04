/**
 * Daily Calendar Email Scheduler API
 * 
 * This endpoint sends daily meal calendar emails to all subscribers
 * at scheduled times (breakfast, lunch, supper)
 * 
 * Should be called via cron job or scheduled task:
 * - Breakfast: 6:00 AM, 7:00 AM, 8:00 AM, 9:00 AM, 10:00 AM
 * - Lunch: 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM
 * - Supper: 5:00 PM, 6:00 PM, 7:00 PM, 8:00 PM, 9:00 PM, 10:00 PM
 * 
 * Usage:
 *   POST /api/subscription/daily-calendar
 *   Body: { mealType: 'breakfast' | 'lunch' | 'supper' }
 */

import { NextResponse } from "next/server";
import { DB_URL } from "@config/config";
import { getTodaysMealsFromCalendar } from "@lib/mealCalendarService";

/**
 * GET handler - Can trigger email send with query param, or returns schedule info
 */
export const GET = async (req) => {
  const url = new URL(req.url);
  const mealType = url.searchParams.get('mealType');
  
  // If mealType provided, trigger email send
  if (mealType && ['breakfast', 'lunch', 'supper'].includes(mealType)) {
    // Call POST handler logic
    return await POST(req);
  }
  const now = new Date();
  const currentHour = now.getHours();
  
  const mealSchedules = {
    breakfast: { start: 6, end: 10, times: [6, 7, 8, 9, 10] },
    lunch: { start: 12, end: 15, times: [12, 13, 14, 15] },
    supper: { start: 17, end: 22, times: [17, 18, 19, 20, 21, 22] }
  };

  let currentMeal = null;
  if (currentHour >= 6 && currentHour <= 10) currentMeal = 'breakfast';
  else if (currentHour >= 12 && currentHour <= 15) currentMeal = 'lunch';
  else if (currentHour >= 17 && currentHour <= 22) currentMeal = 'supper';

  return new NextResponse(
    JSON.stringify({
      currentTime: now.toISOString(),
      currentHour,
      currentMeal,
      schedules: mealSchedules
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

/**
 * POST handler - Sends daily calendar emails to all subscribers
 * Can also be called via GET with query parameter: ?mealType=breakfast
 */
export const POST = async (req) => {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      // If no body, try to get from query params (for cron jobs)
      const url = new URL(req.url);
      body = { mealType: url.searchParams.get('mealType') };
    }
    const { mealType } = body;

    // Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'supper'];
    if (!mealType || !validMealTypes.includes(mealType)) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid meal type",
          details: `Must be one of: ${validMealTypes.join(', ')}`
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`📧 Starting daily calendar email send for ${mealType}...`);

    // Fetch all newsletter subscribers
    let subscribers = [];
    try {
      // Try multiple possible endpoints to get subscribers
      const endpoints = [
        `${DB_URL}/newsletter/all`,
        `${DB_URL}/newsletter`,
        `${DB_URL}/newsletter/subscribers`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Handle different response formats
            if (Array.isArray(data)) {
              subscribers = data.map(s => s.email || s).filter(Boolean);
            } else if (data.data && Array.isArray(data.data)) {
              subscribers = data.data.map(s => s.email || s).filter(Boolean);
            } else if (data.subscribers && Array.isArray(data.subscribers)) {
              subscribers = data.subscribers.map(s => s.email || s).filter(Boolean);
            } else if (data.emails && Array.isArray(data.emails)) {
              subscribers = data.emails.filter(Boolean);
            }
            
            if (subscribers.length > 0) {
              console.log(`✅ Found ${subscribers.length} subscribers from ${endpoint}`);
              break; // Success, stop trying other endpoints
            }
          }
        } catch (endpointError) {
          // Try next endpoint
          continue;
        }
      }

      if (subscribers.length === 0) {
        console.warn('⚠️ Could not fetch subscribers from backend');
      }
    } catch (error) {
      console.error('⚠️ Error fetching subscribers:', error.message);
      // Continue with empty list - will return info message
    }

    if (subscribers.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "No subscribers found",
          sent: 0,
          total: 0
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`📋 Found ${subscribers.length} subscribers`);

    // Meal greetings based on time
    const greetings = {
      breakfast: 'Good Morning',
      lunch: 'Good Afternoon',
      supper: 'Good Evening'
    };

    const greeting = greetings[mealType] || 'Hello';
    const mealNames = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      supper: 'Supper'
    };
    const mealName = mealNames[mealType] || 'Meal';

    // Send emails in batches
    const results = [];
    const batchSize = 5; // Smaller batches for email sending
    const baseUrl = req.nextUrl.origin;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      for (const email of batch) {
        try {
          const emailResponse = await fetch(`${baseUrl}/api/mail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              type: 'meal_notification',
              mealType: mealType,
              greeting: greeting,
              userName: 'Valued Customer',
              meals: getTodaysMealsFromCalendar(mealType),
              subscriptionPlan: null
            }),
          });

          const emailResult = await emailResponse.json();
          const sent = emailResponse.ok && emailResult.success;

          results.push({
            email,
            sent,
            status: sent ? 'success' : 'error',
            message: sent ? 'Email sent' : emailResult.error || 'Failed'
          });

          // Small delay between emails
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`❌ Error sending to ${email}:`, error.message);
          results.push({
            email,
            sent: false,
            status: 'error',
            message: error.message
          });
        }
      }

      // Delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.sent).length;
    const errorCount = results.filter(r => !r.sent).length;

    console.log(`✅ Daily calendar email send completed: ${successCount} sent, ${errorCount} errors`);

    return new NextResponse(
      JSON.stringify({
        success: true,
        mealType,
        mealName,
        total: subscribers.length,
        sent: successCount,
        errors: errorCount,
        results: results.slice(0, 10) // Return first 10 results for preview
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  } catch (error) {
    console.error("❌ Error in daily calendar email send:", error.message);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to send daily calendar emails",
        details: process.env.NODE_ENV === "development" ? error.message : "Please try again later"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }
};
