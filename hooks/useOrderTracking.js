"use client";

import { useState, useEffect } from "react";
import { connectSocket } from "@lib/socket";

/**
 * Subscribes to real-time order status and driver location updates.
 *
 * Usage:
 *   const { socketStatus, driverLocation } = useOrderTracking(orderId)
 *
 * socketStatus  – { status, message, timestamp, driverInfo? } or null
 * driverLocation – { lat, lng, heading } or null (updates ~every 4s while driver is active)
 *
 * The hook only receives *updates*. Always do one initial HTTP fetch on mount
 * to get current state, then let this hook overlay live changes on top.
 */
export function useOrderTracking(orderId) {
  const [socketStatus, setSocketStatus] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [socketEta, setSocketEta] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    // No auth required — order room is public (orderId is the only key needed)
    const socket = connectSocket();

    socket.emit("join:order", { orderId });

    const onStatus = (data) => setSocketStatus(data);
    const onLocation = (data) =>
      setDriverLocation({ lat: data.lat, lng: data.lng, heading: data.heading || 0 });
    const onEta = (data) => setSocketEta(data.eta || null);

    socket.on("order:status_changed", onStatus);
    socket.on("order:driver_location", onLocation);
    socket.on("order:eta_update", onEta);

    return () => {
      socket.off("order:status_changed", onStatus);
      socket.off("order:driver_location", onLocation);
      socket.off("order:eta_update", onEta);
    };
  }, [orderId]);

  return { socketStatus, driverLocation, socketEta };
}
