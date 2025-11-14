import webPush from "web-push";
import { NextResponse } from "next/server";

// Validate environment variables
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (!publicVapidKey || !privateVapidKey || !vapidSubject) {
  console.error("Missing VAPID keys in environment");
  throw new Error("VAPID keys are not set in environment variables");
}

webPush.setVapidDetails(vapidSubject, publicVapidKey, privateVapidKey);

const subscriptions = new Set();

export async function POST(request) {
  try {
    const { title, body, url } = await request.json();

    const payload = JSON.stringify({ title, body, url });

    const promises = Array.from(subscriptions).map((subStr) => {
      const sub = JSON.parse(subStr);
      return webPush.sendNotification(sub, payload).catch((err) => {
        // Remove invalid subscriptions
        if (err.statusCode === 410) {
          subscriptions.delete(subStr);
        }
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Push Notification send error: ", error);
    return NextResponse.json({
      error: "Failed to send push notification",
      details: error.message,
      status: 500,
    });
  }
}
