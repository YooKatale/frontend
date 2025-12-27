"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { scheduleMealNotifications, requestNotificationPermission } from "@lib/notificationScheduler";

const ServiceWorker = () => {
  // Safely get userInfo from Redux store, default to null if not available
  const userInfo = useSelector((state) => state?.auth?.userInfo || null);
  const publicVapidKey =
    "BH0MtpHAEnVacRrstRBYcn8Mot0rJrtWeoNk9TVeVwEtgjDmzJC1iMbH8eSLNlyz7Q1aGhVeCuFeXsTD2CYrqIA";

  async function handleSend() {
    try {
      console.log("🔔 Starting notification setup...");
      
      // Request notification permission first
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        console.warn("⚠️ Notification permission denied or not granted");
        return;
      }

      console.log("✅ Notification permission granted");

      // Register service worker
      let register;
      try {
        register = await navigator.serviceWorker.register("/worker.js", {
          scope: "/",
        });
        console.log("✅ Service worker registered");
      } catch (swError) {
        console.error("❌ Service worker registration failed:", swError);
        // Continue anyway - we can use direct Notification API as fallback
      }

      // Try to subscribe to push notifications (optional - for server-sent pushes)
      if (register?.active) {
        try {
          const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });

          // Send subscription to server
          await fetch("https://yookatale-server-app.onrender.com/admin/web_push", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
              "content-type": "application/json",
            },
          });
          console.log("✅ Push subscription sent to server");
        } catch (pushError) {
          console.warn("⚠️ Push subscription failed (this is okay for local notifications):", pushError);
        }
      }

      // Schedule meal notifications with user info
      // This works even without service worker - uses direct Notification API as fallback
      await scheduleMealNotifications(userInfo);
      console.log("✅ Meal notifications scheduled");
    } catch (error) {
      console.error("❌ Error setting up notifications:", error);
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  useEffect(() => {
    if ("serviceWorker" in navigator && "Notification" in window) {
      // Run for all users (registered or not) - userInfo can be null
      handleSend().catch((err) => console.log({ err }));
    }
  }, [userInfo]); // Re-run when userInfo changes (or when userInfo is null for non-registered users)

  return <></>;
};

export default ServiceWorker;
