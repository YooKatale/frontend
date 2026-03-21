"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";

const DRIVER_KEY = "yookatale-driver";
const LOCATION_INTERVAL = 10000; // send location every 10s
const POLL_INTERVAL = 12000;    // poll orders every 12s

const STATUS_CONFIG = {
  assigned:   { label: "Assigned",   color: "#3b82f6", next: "picked_up",   nextLabel: "Mark Picked Up" },
  picked_up:  { label: "Picked Up",  color: "#f59e0b", next: "in_transit",  nextLabel: "Start Delivery" },
  in_transit: { label: "In Transit", color: "#8b5cf6", next: "delivered",   nextLabel: "Mark Delivered" },
  delivered:  { label: "Delivered",  color: "#10b981", next: null,          nextLabel: null },
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapsUrl(destLat, destLng, label = "") {
  if (!destLat || !destLng) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
}

function StarRating({ rating = 0, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400">({count})</span>
    </div>
  );
}

export default function DriverDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("home"); // home | orders | earnings | profile
  const [isLoadingDash, setIsLoadingDash] = useState(true);
  const [isTogglingAvail, setIsTogglingAvail] = useState(false);
  const [isAccepting, setIsAccepting] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);
  const locationIntervalRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Auth guard
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) { router.replace("/driver/login"); return; }
      const parsed = JSON.parse(stored);
      if (!parsed?.token || !parsed?.driver?._id) { router.replace("/driver/login"); return; }
      setSession(parsed);
    } catch { router.replace("/driver/login"); }
  }, [router]);

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.token}`,
  }), [session]);

  const fetchDashboard = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res = await fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") setDashData(data.data);
    } catch {}
  }, [session, authHeaders]);

  const fetchAvailableOrders = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res = await fetch(`${DB_URL}/driver/${session.driver._id}/available-orders`, { headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") setAvailableOrders(data.data || []);
    } catch {}
  }, [session, authHeaders]);

  // Initial load
  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setIsLoadingDash(true);
      await Promise.all([fetchDashboard(), fetchAvailableOrders()]);
      setIsLoadingDash(false);
    };
    load();
  }, [session, fetchDashboard, fetchAvailableOrders]);

  // Poll for updates
  useEffect(() => {
    if (!session) return;
    pollIntervalRef.current = setInterval(() => {
      fetchDashboard();
      fetchAvailableOrders();
    }, POLL_INTERVAL);
    return () => clearInterval(pollIntervalRef.current);
  }, [session, fetchDashboard, fetchAvailableOrders]);

  // GPS location sharing
  useEffect(() => {
    if (!session?.driver?._id) return;
    const sendLocation = (lat, lng) => {
      fetch(`${DB_URL}/driver/${session.driver._id}/location`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ lat, lng }),
      }).catch(() => {});
    };

    const startTracking = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setMyLocation({ lat, lng });
        sendLocation(lat, lng);
      }, () => {});

      locationIntervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setMyLocation({ lat, lng });
          sendLocation(lat, lng);
        }, () => {});
      }, LOCATION_INTERVAL);
    };

    startTracking();
    return () => clearInterval(locationIntervalRef.current);
  }, [session, authHeaders]);

  const toggleAvailability = async () => {
    if (!session?.driver?._id || isTogglingAvail) return;
    setIsTogglingAvail(true);
    try {
      const res = await fetch(`${DB_URL}/driver/${session.driver._id}/availability`, {
        method: "PATCH", headers: authHeaders(),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        setDashData((prev) => prev ? { ...prev, driver: { ...prev.driver, isAvailable: data.data.isAvailable } } : prev);
        showToast(data.message);
      }
    } catch { showToast("Failed to update availability", "error"); }
    finally { setIsTogglingAvail(false); }
  };

  const acceptOrder = async (orderId) => {
    if (!session?.driver?._id || isAccepting) return;
    setIsAccepting(orderId);
    try {
      const res = await fetch(`${DB_URL}/driver/accept-order`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ orderId, partnerId: session.driver._id }),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        showToast("Order accepted! Navigate to pickup.");
        await Promise.all([fetchDashboard(), fetchAvailableOrders()]);
        setActiveTab("home");
      } else {
        showToast(data?.message || "Failed to accept order", "error");
      }
    } catch { showToast("Failed to accept order", "error"); }
    finally { setIsAccepting(null); }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    if (!deliveryId || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      const body = { status: newStatus };
      if (myLocation) { body.lat = myLocation.lat; body.lng = myLocation.lng; }
      const res = await fetch(`${DB_URL}/driver/delivery/${deliveryId}/status`, {
        method: "PATCH", headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        const labels = { picked_up: "Marked as picked up!", in_transit: "Delivery started!", delivered: "Delivered! Great work 🎉" };
        showToast(labels[newStatus] || "Status updated!");
        await fetchDashboard();
      } else {
        showToast(data?.message || "Failed to update", "error");
      }
    } catch { showToast("Failed to update status", "error"); }
    finally { setIsUpdatingStatus(false); }
  };

  const logout = () => {
    try { localStorage.removeItem(DRIVER_KEY); } catch {}
    router.replace("/driver/login");
  };

  if (!mounted) return null;

  if (!session) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const driver = dashData?.driver || session.driver;
  const activeDelivery = dashData?.activeDelivery;
  const recentDeliveries = dashData?.recentDeliveries || [];
  const payoutHistory = dashData?.payoutHistory || [];
  const isAvailable = driver?.isAvailable ?? false;

  const activeDeliveryStatus = activeDelivery?.status;
  const activeStatusConfig = activeDeliveryStatus ? STATUS_CONFIG[activeDeliveryStatus] : null;
  const deliveryOrder = activeDelivery?.orderId;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-fade-in transition-all
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {toast.type === "error" ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          )} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center font-bold text-sm">
            {(driver?.name || "D")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-white leading-none">{driver?.name || "Driver"}</p>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">{driver?.transport || "bike"} rider</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Availability toggle */}
          <button
            onClick={toggleAvailability}
            disabled={isTogglingAvail}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border
              ${isAvailable
                ? "bg-green-900 border-green-700 text-green-400"
                : "bg-gray-800 border-gray-700 text-gray-400"
              } disabled:opacity-50`}
          >
            <div className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
            {isTogglingAvail ? "..." : isAvailable ? "Online" : "Offline"}
          </button>

          <button onClick={logout} className="text-gray-600 hover:text-gray-400 transition-colors p-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Loading */}
      {isLoadingDash && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading dashboard...</p>
          </div>
        </div>
      )}

      {!isLoadingDash && (
        <div className="flex-1 overflow-y-auto pb-24">
          {/* HOME TAB */}
          {activeTab === "home" && (
            <div className="px-4 py-5 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Today", value: dashData?.weekDeliveries ?? 0, sub: "deliveries", iconColor: "text-blue-400", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8l-2 4h12l-2-4z"/></svg> },
                  { label: "Rating", value: (driver?.averageRating || 0).toFixed(1), sub: `${driver?.ratingCount || 0} reviews`, iconColor: "text-yellow-400", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> },
                  { label: "Earnings", value: `${(driver?.totalEarnings || 0).toLocaleString()}`, sub: "UGX total", iconColor: "text-green-400", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg> },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
                    <div className={`flex justify-center mb-1 ${s.iconColor}`}>{s.icon}</div>
                    <div className="font-bold text-white text-sm">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Active Delivery */}
              {activeDelivery ? (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeStatusConfig?.color || "#10b981" }} />
                      <span className="text-sm font-semibold text-white">Active Delivery</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${activeStatusConfig?.color}20`, color: activeStatusConfig?.color }}>
                      {activeStatusConfig?.label || activeDeliveryStatus}
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Order info */}
                    <div className="space-y-2">
                      {deliveryOrder?.customerName && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm text-white font-medium">{deliveryOrder.customerName}</span>
                        </div>
                      )}
                      {deliveryOrder?.customerPhone && (
                        <a href={`tel:${deliveryOrder.customerPhone}`} className="flex items-center gap-2 group">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm text-green-400 group-hover:text-green-300">{deliveryOrder.customerPhone}</span>
                        </a>
                      )}
                      {deliveryOrder?.deliveryAddress && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-300">
                            {typeof deliveryOrder.deliveryAddress === "object"
                              ? deliveryOrder.deliveryAddress.address || JSON.stringify(deliveryOrder.deliveryAddress)
                              : deliveryOrder.deliveryAddress}
                          </span>
                        </div>
                      )}
                      {deliveryOrder?.total && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-green-400">UGX {Number(deliveryOrder.total).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Navigation button */}
                    {(() => {
                      const addr = deliveryOrder?.deliveryAddress;
                      const destLat = addr?.lat || addr?.latitude;
                      const destLng = addr?.lng || addr?.longitude;
                      const navUrl = mapsUrl(destLat, destLng);
                      return navUrl ? (
                        <a
                          href={navUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Navigate with Google Maps
                        </a>
                      ) : (
                        <div className="text-xs text-gray-600 text-center">No coordinates — ask customer for location</div>
                      );
                    })()}

                    {/* Status update */}
                    {activeStatusConfig?.next && (
                      <button
                        onClick={() => updateDeliveryStatus(activeDelivery._id, activeStatusConfig.next)}
                        disabled={isUpdatingStatus}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60"
                        style={{ backgroundColor: activeStatusConfig.color }}
                      >
                        {isUpdatingStatus ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Updating...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            {activeStatusConfig.nextLabel}
                          </span>
                        )}
                      </button>
                    )}
                    {activeDeliveryStatus === "delivered" && (
                      <div className="text-center py-2 text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Delivery Complete! Looking for new orders...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* No active delivery */
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-3 text-gray-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                      <circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/>
                      <path d="M8 17.5h7M15 17.5V9l-3-5h-2L8 9h4l2 3"/><path d="M19 9h-4M5.5 15l1.5-6h2"/>
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1">No active delivery</p>
                  <p className="text-gray-500 text-sm mb-4">
                    {isAvailable ? "You're online. Check available orders!" : "Go online to receive orders."}
                  </p>
                  {!isAvailable ? (
                    <button onClick={toggleAvailability} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors">
                      Go Online
                    </button>
                  ) : (
                    <button onClick={() => setActiveTab("orders")} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
                      Browse Orders
                    </button>
                  )}
                </div>
              )}

              {/* Recent Deliveries */}
              {recentDeliveries.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 px-1">Recent Deliveries</h3>
                  <div className="space-y-2">
                    {recentDeliveries.slice(0, 5).map((d) => (
                      <div key={d._id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {d.orderId?.customerName || "Order"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {d.deliveredAt ? new Date(d.deliveredAt).toLocaleDateString() : new Date(d.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium
                            ${d.status === "delivered" ? "bg-green-900 text-green-400" :
                              d.status === "in_transit" ? "bg-purple-900 text-purple-400" :
                              "bg-gray-800 text-gray-400"}`}>
                            {d.status?.replace(/_/g, " ")}
                          </span>
                          {d.commissionAmount > 0 && (
                            <p className="text-xs text-green-400 mt-1">+UGX {d.commissionAmount.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="px-4 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white">Available Orders</h2>
                <button onClick={() => fetchAvailableOrders()} className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              {!isAvailable && (
                <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-2xl p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">You're currently offline</p>
                    <p className="text-yellow-600 text-xs mt-0.5">Go online to accept orders</p>
                  </div>
                  <button onClick={toggleAvailability} className="ml-auto text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-medium">
                    Go Online
                  </button>
                </div>
              )}

              {availableOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-4 text-gray-700">
                    <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3H10l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
                  </div>
                  <p className="text-gray-400 font-medium">No available orders</p>
                  <p className="text-gray-600 text-sm mt-1">Check back soon — orders update every 12 seconds</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableOrders.map((order) => {
                    const addr = order.deliveryAddress;
                    const destLat = addr?.lat || addr?.latitude;
                    const destLng = addr?.lng || addr?.longitude;
                    const navUrl = mapsUrl(destLat, destLng);
                    return (
                      <div key={order._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500">#{String(order._id).slice(-6)}</span>
                            {order.distanceKm != null && (
                              <span className="text-xs bg-blue-900 text-blue-400 px-2 py-0.5 rounded-full">{order.distanceKm} km away</span>
                            )}
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                            ${order.status === "ready" ? "bg-green-900 text-green-400" :
                              order.status === "confirmed" ? "bg-blue-900 text-blue-400" :
                              "bg-gray-800 text-gray-400"}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="space-y-1.5">
                            {order.customerName && (
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-gray-300">{order.customerName}</span>
                              </div>
                            )}
                            {addr && (
                              <div className="flex items-start gap-2 text-sm">
                                <svg className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-gray-400 text-xs">
                                  {typeof addr === "object" ? addr.address || addr.address1 || "Address on map" : addr}
                                </span>
                              </div>
                            )}
                            {order.total && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-green-400">UGX {Number(order.total).toLocaleString()}</span>
                                <span className="text-xs text-gray-600">• Commission ~UGX {Math.round(Number(order.total) * 0.05).toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptOrder(order._id)}
                              disabled={!!isAccepting || !isAvailable}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                              {isAccepting === order._id ? (
                                <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Accepting...</>
                              ) : (
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                  Accept Order
                                </span>
                              )}
                            </button>
                            {navUrl && (
                              <a href={navUrl} target="_blank" rel="noopener noreferrer"
                                className="px-3 py-2.5 bg-blue-900 hover:bg-blue-800 text-blue-400 rounded-xl transition-colors flex items-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === "earnings" && (
            <div className="px-4 py-5 space-y-4">
              <h2 className="font-bold text-white">Earnings & Payouts</h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Earned", value: `UGX ${(driver?.totalEarnings || 0).toLocaleString()}`, color: "green", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg> },
                  { label: "Unpaid Balance", value: `UGX ${(driver?.commissionEarned || 0).toLocaleString()}`, color: "yellow", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                  { label: "Total Deliveries", value: driver?.totalDeliveries || 0, color: "blue", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg> },
                  { label: "Avg Rating", value: `${(driver?.averageRating || 0).toFixed(1)}`, color: "purple", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className={`mb-2 ${s.color === "green" ? "text-green-400" : s.color === "yellow" ? "text-yellow-400" : s.color === "blue" ? "text-blue-400" : "text-purple-400"}`}>{s.icon}</div>
                    <div className={`font-bold text-lg ${
                      s.color === "green" ? "text-green-400" :
                      s.color === "yellow" ? "text-yellow-400" :
                      s.color === "blue" ? "text-blue-400" : "text-purple-400"
                    }`}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Payout method */}
              {driver?.payoutMethod?.phone ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Payout Method</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-900 rounded-xl flex items-center justify-center text-green-400 font-bold text-sm">
                      {driver.payoutMethod.provider?.[0] || "M"}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{driver.payoutMethod.provider} Mobile Money</p>
                      <p className="text-gray-400 text-xs">{driver.payoutMethod.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-2xl p-4">
                  <p className="text-yellow-400 text-sm font-medium">No payout method set</p>
                  <p className="text-yellow-700 text-xs mt-1">Contact admin to add your Mobile Money details</p>
                </div>
              )}

              {/* Payout history */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Payout History</h3>
                {payoutHistory.length === 0 ? (
                  <div className="text-center py-10 text-gray-600 text-sm">No payouts yet — payouts run weekly by admin</div>
                ) : (
                  <div className="space-y-2">
                    {payoutHistory.map((p) => (
                      <div key={p._id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white font-medium">UGX {Number(p.amount).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{p.note || "Weekly payout"}</p>
                        </div>
                        <p className="text-xs text-gray-600">{new Date(p.paidAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="px-4 py-5 space-y-4">
              <h2 className="font-bold text-white">My Profile</h2>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                    {(driver?.name || "D")[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{driver?.name || "Driver"}</h3>
                    <StarRating rating={driver?.averageRating} count={driver?.ratingCount} />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-800">
                  {[
                    { label: "Email", value: driver?.email, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg> },
                    { label: "Phone", value: driver?.phone, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> },
                    { label: "Transport", value: driver?.transport, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5h7M15 17.5V9l-3-5h-2L8 9h4l2 3"/><path d="M19 9h-4M5.5 15l1.5-6h2"/></svg> },
                    { label: "Number Plate", value: driver?.numberPlate, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M7 12h10M7 9v6M17 9v6"/></svg> },
                    { label: "Member Since", value: driver?.createdAt ? new Date(driver.createdAt).toLocaleDateString() : "-", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                  ].filter((r) => r.value).map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="text-gray-500 w-5 flex-shrink-0">{row.icon}</span>
                      <div>
                        <p className="text-xs text-gray-500">{row.label}</p>
                        <p className="text-sm text-white capitalize">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location status */}
              <div className={`border rounded-2xl p-4 flex items-center gap-3 ${myLocation ? "border-green-800 bg-green-900 bg-opacity-20" : "border-gray-800 bg-gray-900"}`}>
                <div className={`w-2 h-2 rounded-full ${myLocation ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
                <div>
                  <p className="text-sm font-medium text-white">GPS Location</p>
                  <p className="text-xs text-gray-500">
                    {myLocation ? `Sharing: ${myLocation.lat.toFixed(4)}, ${myLocation.lng.toFixed(4)}` : "Location not shared"}
                  </p>
                </div>
              </div>

              <button onClick={logout} className="w-full border border-red-900 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-2xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-40 safe-area-pb">
        {[
          { key: "home", label: "Home", icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )},
          { key: "orders", label: "Orders", icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ), badge: availableOrders.length },
          { key: "earnings", label: "Earnings", icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )},
          { key: "profile", label: "Profile", icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )},
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors relative
              ${activeTab === tab.key ? "text-green-400" : "text-gray-600 hover:text-gray-400"}`}
          >
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
            {tab.badge > 0 && (
              <span className="absolute top-2 right-1/4 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {tab.badge > 9 ? "9+" : tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
