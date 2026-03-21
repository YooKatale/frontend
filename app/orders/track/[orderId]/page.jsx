"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DB_URL } from "@config/config";

const STATUS_FLOW = [
  { key: "pending",    label: "Order Placed",      icon: "🛒", desc: "Your order has been received" },
  { key: "confirmed",  label: "Confirmed",          icon: "✅", desc: "Restaurant is preparing your order" },
  { key: "assigned",   label: "Driver Assigned",    icon: "🏍️", desc: "A driver is heading to pick up your order" },
  { key: "picked_up",  label: "Picked Up",          icon: "📦", desc: "Your order is with the driver" },
  { key: "in_transit", label: "On the Way",         icon: "🚀", desc: "Driver is heading to your location" },
  { key: "delivered",  label: "Delivered",          icon: "🎉", desc: "Your order has been delivered!" },
];

const STATUS_IDX = Object.fromEntries(STATUS_FLOW.map((s, i) => [s.key, i]));

const POLL_MS = 5000;

function getStatusIndex(status) {
  return STATUS_IDX[status] ?? 0;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(n) {
  return `UGX ${Number(n || 0).toLocaleString()}`;
}

function StarRow({ rating = 0 }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function PulsingDot({ color = "green" }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${color}-500`} />
    </span>
  );
}

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [driverLoc, setDriverLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const iframeRef = useRef(null);
  const pollRef = useRef(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`${DB_URL}/orders/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Order not found");
      setOrder(data.data);
      setError("");
    } catch (e) {
      setError(e.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const fetchDriverLocation = useCallback(async () => {
    try {
      const res = await fetch(`${DB_URL}/delivery/order/${orderId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.data?.deliveryLocation) setDriverLoc(data.data.deliveryLocation);
    } catch {}
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    fetchDriverLocation();
    pollRef.current = setInterval(() => {
      fetchOrder();
      fetchDriverLocation();
    }, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [fetchOrder, fetchDriverLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-5xl">📋</div>
        <h2 className="text-white text-xl font-bold">Order Not Found</h2>
        <p className="text-gray-400 text-sm text-center">{error || "We couldn't find this order."}</p>
        <Link href="/" className="mt-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-500 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const currentIdx = getStatusIndex(order.status);
  const isDelivered = order.status === "delivered";
  const isCancelled = order.status === "cancelled";
  const hasDriver = !!order.driverId;
  const driver = order.driverId;

  // ETA calculation
  let etaText = null;
  if (driverLoc?.lat && order.deliveryLocation?.coordinates) {
    const [lng2, lat2] = order.deliveryLocation.coordinates;
    const km = haversineKm(driverLoc.lat, driverLoc.lng, lat2, lng2);
    const mins = Math.max(1, Math.round(km / 0.4)); // ~24 km/h avg city speed
    etaText = `~${mins} min away`;
  }

  // Google Maps embed URL with driver marker
  let mapSrc = null;
  if (driverLoc?.lat && driverLoc?.lng) {
    const dest =
      order.deliveryLocation?.coordinates
        ? `${order.deliveryLocation.coordinates[1]},${order.deliveryLocation.coordinates[0]}`
        : "";
    mapSrc = `https://maps.google.com/maps?q=${driverLoc.lat},${driverLoc.lng}&z=15&output=embed`;
  }

  const navUrl = order.deliveryLocation?.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${order.deliveryLocation.coordinates[1]},${order.deliveryLocation.coordinates[0]}`
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/orders" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            My Orders
          </Link>
          <div className="flex items-center gap-2">
            <PulsingDot color="green" />
            <span className="text-xs text-green-400 font-medium">Live Tracking</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-16">

        {/* Order ID + Status Banner */}
        <div className={`rounded-2xl p-5 border ${isDelivered ? "bg-green-950 border-green-800" : isCancelled ? "bg-red-950 border-red-800" : "bg-gray-900 border-gray-800"}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order #{String(order._id).slice(-8).toUpperCase()}</p>
              <h1 className="text-xl font-bold text-white">
                {isDelivered ? "Delivered!" : isCancelled ? "Order Cancelled" : STATUS_FLOW[currentIdx]?.label}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">{STATUS_FLOW[currentIdx]?.desc}</p>
            </div>
            <span className="text-4xl">{isCancelled ? "❌" : STATUS_FLOW[currentIdx]?.icon}</span>
          </div>

          {/* ETA pill */}
          {etaText && !isDelivered && !isCancelled && (
            <div className="mt-3 inline-flex items-center gap-2 bg-green-900 border border-green-700 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Driver is {etaText}
            </div>
          )}
          {isDelivered && (
            <div className="mt-3 text-green-400 text-sm font-medium">
              Delivered at {formatTime(order.deliveredAt || order.updatedAt)}
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-5">Order Progress</h2>
          <div className="space-y-0">
            {STATUS_FLOW.map((step, idx) => {
              const done = idx < currentIdx;
              const active = idx === currentIdx && !isCancelled;
              const future = idx > currentIdx;
              const historyEntry = order.trackingHistory?.find((h) => h.status === step.key);

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-500 ${
                      done ? "bg-green-600 text-white" :
                      active ? "bg-green-500 text-white ring-4 ring-green-500/30 animate-pulse" :
                      "bg-gray-800 text-gray-600"
                    }`}>
                      {done ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs">{idx + 1}</span>
                      )}
                    </div>
                    {idx < STATUS_FLOW.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 min-h-[24px] transition-all duration-500 ${done ? "bg-green-600" : "bg-gray-800"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${done || active ? "text-white" : "text-gray-600"}`}>
                          {step.label}
                        </span>
                        {active && <PulsingDot color="green" />}
                      </div>
                      {historyEntry && (
                        <span className="text-xs text-gray-600">{formatTime(historyEntry.timestamp)}</span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${done || active ? "text-gray-400" : "text-gray-700"}`}>
                      {step.desc}
                    </p>
                    {historyEntry?.note && (
                      <p className="text-xs text-green-500 mt-1 italic">{historyEntry.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Card */}
        {hasDriver && !isCancelled && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">Your Driver</h2>
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-2xl flex-shrink-0">
                {driver?.transport === "motorcycle" ? "🏍️" : driver?.transport === "bicycle" ? "🚲" : "🚗"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-base">{driver?.name || "Driver"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRow rating={driver?.averageRating || 0} />
                  <span className="text-xs text-gray-500">
                    {driver?.averageRating ? `${Number(driver.averageRating).toFixed(1)} rating` : "New driver"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2 py-0.5 rounded-full capitalize">
                    {driver?.transport || "vehicle"}
                  </span>
                  {driver?.numberPlate && (
                    <span className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2 py-0.5 rounded-full font-mono tracking-wide">
                      {driver.numberPlate}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${driver?.isOnline ? "bg-green-900 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                    {driver?.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              {/* Call button */}
              {driver?.phone && (
                <a
                  href={`tel:${driver.phone}`}
                  className="flex-shrink-0 w-12 h-12 rounded-2xl bg-green-600 hover:bg-green-500 flex items-center justify-center text-white transition-colors shadow-lg shadow-green-900/40"
                  title="Call driver"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Live Map */}
        {mapSrc && !isDelivered && !isCancelled && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <PulsingDot color="green" />
                <span className="text-sm font-semibold text-white">Live Driver Location</span>
              </div>
              {etaText && (
                <span className="text-xs text-green-400 font-semibold">{etaText}</span>
              )}
            </div>
            <div className="relative" style={{ height: "240px" }}>
              <iframe
                ref={iframeRef}
                key={`${driverLoc?.lat}-${driverLoc?.lng}`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
                className="absolute inset-0"
              />
              {!mapLoaded && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {navUrl && (
              <a
                href={navUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 text-green-400 text-sm font-medium border-t border-gray-800 hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Open in Google Maps
              </a>
            )}
          </div>
        )}

        {/* No map yet — driver not assigned */}
        {!hasDriver && !isDelivered && !isCancelled && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-2xl">🗺️</div>
            <p className="text-sm font-medium text-gray-300">Live map will appear once a driver is assigned</p>
            <p className="text-xs text-gray-600">We're finding the nearest driver for you</p>
          </div>
        )}

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Delivery Address</h2>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{order.deliveryAddress}</p>
                {order.deliveryInstructions && (
                  <p className="text-gray-500 text-xs mt-1">{order.deliveryInstructions}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Order Summary</h2>
          {Array.isArray(order.products) && order.products.length > 0 ? (
            <div className="space-y-3">
              {order.products.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-sm flex-shrink-0">
                      {item.quantity || 1}x
                    </div>
                    <span className="text-sm text-gray-300 truncate max-w-[180px]">
                      {item.productName || item.name || "Item"}
                    </span>
                  </div>
                  <span className="text-sm text-white font-medium">
                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No item details available</p>
          )}

          <div className="mt-4 pt-4 border-t border-gray-800 space-y-1.5">
            {order.subtotal > 0 && (
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-sm text-gray-400">
                <span>Delivery fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-white pt-1">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount || order.amount || order.total)}</span>
            </div>
          </div>
        </div>

        {/* Help / Support */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Need Help?</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/support"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors border border-gray-700"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Live Chat
            </Link>
            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors border border-gray-700"
            >
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All Orders
            </Link>
          </div>
        </div>

        {/* Delivered — Rate driver */}
        {isDelivered && hasDriver && (
          <div className="bg-gradient-to-br from-green-950 to-gray-900 border border-green-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-lg font-bold text-white mb-1">Order Delivered!</h2>
            <p className="text-gray-400 text-sm mb-4">How was your experience with {driver?.name || "your driver"}?</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="text-3xl hover:scale-110 transition-transform text-yellow-400">
                  ★
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600">Rating feature coming soon</p>
          </div>
        )}

      </div>
    </div>
  );
}
