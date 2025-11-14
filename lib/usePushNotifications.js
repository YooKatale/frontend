// lib/usePushNotifications.js
import { useEffect, useState } from "react";

export function usePushNotifications() {
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState(null);

  const urlBase64ToUint8Array = (base64String) => {
    try {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      console.log("base64: ", base64);
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
    } catch (error) {
      console.error("VAPID key decode failed:", err);
      throw error;
    }
  };

  useEffect(() => {
    const registerServiceWorker = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setError("Push not supported");
        console.log("ERROR IN IF BLOCK: ", error);
        return;
      }

      try {
        //Register SW
        console.log("Registering service worker");
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("SW registered: ", registration.scope);

        //check existing subscription
        const existingSub = await registration.pushManager.getSubscription();
        console.log("ExistingSub: ", existingSub);
        if (existingSub) {
          setSubscription(existingSub);
          await sendSubscriptionToServer(existingSub);
          return;
        }

        //Get public key
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) throw new Error("VAPID public key is missing");

        console.log(
          "Using VAPID Public Key:",
          vapidPublicKey.slice(0, 20) + "..."
        );

        // Subscribe
        const newSub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        console.log("New subscription: ", newSub.endpoint);
        setSubscription(newSub);

        // Send subscription to your backend
        await sendSubscriptionToServer(newSub);
      } catch (err) {
        setError(err.message);
        console.error("Push subscription failed:", err);
      }
    };

    const sendSubscriptionToServer = async (sub) => {
      console.log("SUB in sendSubscriptionToServer method: ", sub);
      try {
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub),
        });
      } catch (error) {
        console.error("Failed to send subscription to server:", error);
      }
    };

    registerServiceWorker();
  }, [error]);

  console.log("SUBSCRIPTION IN usePushNotifications: ", subscription);

  return { subscription, error };
}
