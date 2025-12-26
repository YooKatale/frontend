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
      // Request notification permission first
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        console.log("Notification permission denied");
        return;
      }

      // Register service worker
      const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/",
      });

      if (register.active) {
        // Register push subscription using Web Push API
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

        // Schedule meal notifications with user info for email notifications
        await scheduleMealNotifications(userInfo);
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
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
      handleSend().catch((err) => console.log({ err }));
    }
  }, [userInfo]); // Re-run when userInfo changes

  return <></>;
};

export default ServiceWorker;
