"use client";

import { useEffect } from "react";
import { connectSocket } from "@lib/socket";

/**
 * Manages the driver's socket connection:
 *  - Joins the driver's private room
 *  - Emits GPS location every 4 seconds (server debounces DB writes to every 10s)
 *  - Calls onNewOrder(data) when a new order is pushed to this driver
 *
 * Usage (in driver dashboard):
 *   useDriverSocket({
 *     partnerId: session?.driver?._id,
 *     driverToken: session?.token,
 *     onNewOrder: (data) => showToast("New order!"),
 *   })
 *
 * The PATCH /api/driver/:id/location endpoint is no longer called from the
 * browser — the socket handler on the server writes to MongoDB (debounced).
 */
export function useDriverSocket({ partnerId, driverToken, onNewOrder, onLocationUpdate } = {}) {
  useEffect(() => {
    if (!partnerId) return;

    const socket = connectSocket();
    // Driver token is passed via auth so the server can validate the join:driver room
    socket.auth = { token: driverToken };
    if (!socket.connected) socket.connect();

    socket.emit("join:driver", { partnerId });

    const onAssigned = (data) => {
      if (typeof onNewOrder === "function") onNewOrder(data);
    };
    socket.on("order:assigned", onAssigned);

    // GPS emit every 4s — server broadcasts immediately to order room,
    // writes to MongoDB at most once per 10s
    let locationInterval = null;
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              heading: pos.coords.heading || 0,
            };
            socket.emit("driver:location", { ...loc, partnerId });
            if (typeof onLocationUpdate === "function") onLocationUpdate(loc);
          },
          () => {}
        );
      }, 4000);
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval);
      socket.off("order:assigned", onAssigned);
    };
  }, [partnerId, driverToken]);
}
