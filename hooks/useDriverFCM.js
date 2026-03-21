"use client";

import { useEffect } from "react";
import { getFCMToken } from "@lib/fcmService";
import { getMessagingSafe, onMessage } from "@lib/firebase";
import { playNotificationSound } from "@lib/utils/playNotificationSound";
import { DB_URL } from "@config/config";

/**
 * Sets up FCM push notifications for the driver:
 *  1. Requests browser notification permission
 *  2. Obtains an FCM token and saves it to the driver's Partner record
 *  3. Sets up a foreground message listener that plays a sound and shows a
 *     browser notification while the driver has the app open
 *
 * Usage (in driver dashboard):
 *   useDriverFCM({ partnerId: session?.driver?._id, driverToken: session?.token })
 */
export function useDriverFCM({ partnerId, driverToken } = {}) {
  useEffect(() => {
    if (!partnerId || !driverToken) return;
    if (typeof window === "undefined") return;

    async function setup() {
      try {
        const token = await getFCMToken();
        if (!token) return;

        await fetch(`${DB_URL}/driver/${partnerId}/fcm-token`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${driverToken}`,
          },
          body: JSON.stringify({ fcmToken: token }),
        }).catch(() => {});
      } catch {}
    }

    setup();

    // Foreground message handler — fires when app is open
    const messaging = getMessagingSafe();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      playNotificationSound();

      const title = payload.notification?.title || payload.data?.title || "YooKatale Driver";
      const body = payload.notification?.body || payload.data?.body || "You have a new notification";

      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const n = new Notification(title, {
            body,
            icon: "/assets/icons/logo2.png",
            badge: "/assets/icons/logo2.png",
            tag: "driver-notification",
            requireInteraction: true,
            data: { url: payload.data?.url || "/driver/dashboard" },
          });
          n.onclick = () => {
            window.focus();
            const url = payload.data?.url || "/driver/dashboard";
            window.location.href = url;
            n.close();
          };
        } catch {}
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [partnerId, driverToken]);
}
