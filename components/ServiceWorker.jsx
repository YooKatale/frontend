"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { initializeFCM, setupForegroundMessageListener } from "@lib/fcmService";
import { startNotificationPolling } from "@lib/notificationPolling";

const ServiceWorker = () => {
  // Safely get userInfo from Redux store, default to null if not available
  const userInfo = useSelector((state) => state?.auth?.userInfo || null);

  async function handleSend() {
    try {
      // Initialize Firebase Cloud Messaging (FCM)
      // This will request permission, get FCM token, save it to server, and set up listeners
      const token = await initializeFCM(userInfo);
      
      if (token) {
        // Setup foreground message listener (when app is open)
        setupForegroundMessageListener(userInfo);
        
        // Start polling for notifications (calls backend every minute to trigger FCM notifications)
        // This allows notifications to work even when app is closed
        startNotificationPolling(userInfo);
      }
    } catch (error) {
      // Silently handle errors - notifications will retry on next page load
      if (process.env.NODE_ENV === 'development') {
        console.error("Error setting up FCM notifications:", error);
      }
    }
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
