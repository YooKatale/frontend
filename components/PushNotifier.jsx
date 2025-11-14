// components/PushNotifier.jsx
"use client";

import { usePushNotifications } from "@/lib/usePushNotifications";
import { useEffect } from "react";

export default function PushNotifier() {
  const { subscription, error } = usePushNotifications();

  console.log("ERROR in PushNotifier: ", error);
  console.log("SUBSCRIPTION in PushNotifier: ", subscription);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!subscription) return <p>Subscribing...</p>;

  return <p>Push notifications enabled!</p>;
}
