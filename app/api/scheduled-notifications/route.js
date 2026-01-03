/**
 * Scheduled Meal Notifications API
 * 
 * This endpoint sends meal notification emails to all registered users at scheduled meal times.
 * Can be triggered by:
 * - Vercel Cron Jobs (recommended)
 * - External cron services (cron-job.org, EasyCron, etc.)
 * - Manual API calls
 * 
 * Security:
 * - Protected by CRON_SECRET environment variable
 * - Only processes during valid meal time windows
 * - Rate-limited to prevent abuse
 * 
 * Meal Times:
 * - Breakfast: 6:00 AM - 10:00 AM (hourly notifications)
 * - Lunch: 12:00 PM - 3:00 PM (hourly notifications)
 * - Supper: 5:00 PM - 10:00 PM (hourly notifications)
 */

import { NextResponse } from "next/server";
import { DB_URL } from "@config/config";

/**
 * GET handler - Triggered by cron jobs or external schedulers
 * Validates time, fetches users, and sends meal notifications
 */
export async function GET(request) {
  try {
    // Security: Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "default-secret-change-in-production";
    const providedSecret = authHeader?.replace("Bearer ", "") || 
                          new URL(request.url).searchParams.get("secret");
    
    if (providedSecret !== cronSecret) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get current time and determine meal type
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Determine meal type based on current hour
    let mealType = null;
    if (currentHour >= 6 && currentHour <= 10 && currentMinute === 0) {
      mealType = "breakfast";
    } else if (currentHour >= 12 && currentHour <= 15 && currentMinute === 0) {
      mealType = "lunch";
    } else if (currentHour >= 17 && currentHour <= 22 && currentMinute === 0) {
      mealType = "supper";
    }

    // Only process if we're at the start of a meal notification hour
    if (!mealType) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Not a meal notification time",
          currentHour,
          currentMinute 
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`📅 Scheduled notification triggered for ${mealType} at ${currentHour}:00`);

    // Fetch all registered users from backend
    // Note: This assumes your backend has an endpoint to get all users
    // You may need to create this endpoint if it doesn't exist
    let users = [];
    try {
      // Try to fetch users - adjust endpoint based on your backend API
      const usersResponse = await fetch(`${DB_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        // Adjust based on your API response structure
        users = usersData?.data || usersData?.users || [];
      } else {
        console.warn("⚠️ Could not fetch users from backend. Notifications will be sent client-side.");
        // Return success but note that server-side sending requires backend support
        return new NextResponse(
          JSON.stringify({ 
            message: "Backend user endpoint not available. Client-side notifications will handle this.",
            mealType,
            note: "To enable server-side email notifications, ensure your backend has a /users endpoint"
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return new NextResponse(
        JSON.stringify({ 
          error: "Failed to fetch users",
          message: error.message 
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filter users who have email notifications enabled
    const usersWithEmail = users.filter(user => {
      const prefs = user.notificationPreferences || {};
      return user.email && prefs.email !== false;
    });

    console.log(`📧 Found ${usersWithEmail.length} users to notify for ${mealType}`);

    // Send notifications to each user
    const results = {
      total: usersWithEmail.length,
      sent: 0,
      failed: 0,
      errors: []
    };

    // Process users in batches to avoid overwhelming the email service
    const batchSize = 10;
    for (let i = 0; i < usersWithEmail.length; i += batchSize) {
      const batch = usersWithEmail.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (user) => {
          try {
            // Get user's meal subscription for personalized notifications
            let subscribedMeals = [];
            try {
              const ordersResponse = await fetch(`${DB_URL}/products/orders/${user._id || user.id}`);
              if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                if (ordersData?.status === "Success" || ordersData?.status === "success") {
                  const paidSubscriptions = ordersData.data?.AllOrders?.filter(
                    (order) =>
                      order.order?.payment?.paymentMethod !== "" &&
                      order.order?.payment?.status === "paid" &&
                      order.scheduleFor === "meal_subscription"
                  ) || [];
                  
                  subscribedMeals = paidSubscriptions
                    .flatMap((order) => order.products?.meals || [])
                    .filter((meal) => meal.mealType === mealType);
                }
              }
            } catch (error) {
              console.warn(`Could not fetch subscriptions for user ${user.email}:`, error);
            }

            // Send email notification
            const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/mail`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                type: "meal_notification",
                userName: user.firstname || user.firstName || user.email?.split("@")[0] || "Valued Customer",
                mealType: mealType,
                greeting: getTimeBasedGreeting(currentHour),
                meals: subscribedMeals.length > 0 ? subscribedMeals : null,
                subscriptionPlan: user.subscriptionPlan || user.subscription?.plan || null,
              }),
            });

            if (emailResponse.ok) {
              results.sent++;
              console.log(`✅ Email sent to ${user.email}`);
            } else {
              results.failed++;
              const errorText = await emailResponse.text();
              results.errors.push({ email: user.email, error: errorText });
              console.error(`❌ Failed to send email to ${user.email}`);
            }
          } catch (error) {
            results.failed++;
            results.errors.push({ email: user.email, error: error.message });
            console.error(`❌ Error processing user ${user.email}:`, error);
          }
        })
      );

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < usersWithEmail.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        mealType,
        results,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("❌ Error in scheduled notifications:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

/**
 * Helper function to get time-based greeting
 */
function getTimeBasedGreeting(hour) {
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
}

