"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { DB_URL } from "@config/config";
import { useDriverSocket } from "@hooks/useDriverSocket";
import { useDriverFCM } from "@hooks/useDriverFCM";
import { FaUserCircle, FaMotorcycle, FaMoneyBillWave, FaStar, FaBell, FaCheckCircle, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ActiveDeliveryMap = dynamic(
  () => import("@components/driver/ActiveDeliveryMap"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#f4f5f7", borderRadius: 18 }} /> }
);
const DriverOrderCard = dynamic(
  () => import("@components/driver/OrderCard"),
  { ssr: false }
);

const DRIVER_KEY    = "yookatale-driver";
const POLL_INTERVAL = 12000;

const C = {
  bg:       "#f4f5f7",
  card:     "#ffffff",
  border:   "#f3f4f6",
  borderMd: "#e5e7eb",
  amber:    "#d97706",
  amberDim: "rgba(217,119,6,0.08)",
  amberBrd: "rgba(217,119,6,0.18)",
  green:    "#0d7c3b",
  greenLt:  "#10a34d",
  greenDim: "rgba(13,124,59,0.08)",
  white:    "#ffffff",
  dark:     "#111827",
  text1:    "#111827",
  text2:    "#6b7280",
  text3:    "#9ca3af",
  blue:     "#3b82f6",
  purple:   "#8b5cf6",
  red:      "#ef4444",
};

const STATUS_CONFIG = {
  assigned:   { label: "Assigned",   color: C.blue,   next: "picked_up",  nextLabel: "Mark Picked Up"  },
  picked_up:  { label: "Picked Up",  color: C.amber,  next: "in_transit", nextLabel: "Start Delivery"  },
  in_transit: { label: "In Transit", color: C.purple, next: "delivered",  nextLabel: "Mark Delivered"  },
  delivered:  { label: "Delivered",  color: "#10b981", next: null,         nextLabel: null              },
};

const font = { fontFamily: "'Bricolage Grotesque','Sora','DM Sans',system-ui,sans-serif" };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...style }}>
    {children}
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: `${color}12`, color, border: `1px solid ${color}30` }}>
    {label}
  </span>
);

function SkeletonCard() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      {[80, 60, 40].map((w, i) => (
        <div key={i} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: "#f3f4f6", marginBottom: 10, animation: "sk-shimmer 1.5s ease-in-out infinite" }} />
      ))}
    </div>
  );
}

export default function DriverDashboardPage() {
  const [session, setSession]               = useState(null);
  const [dashData, setDashData]             = useState(null);
  const [availableOrders, setOrders]        = useState([]);
  const [isLoadingDash, setIsLoadingDash]   = useState(true);
  const [isTogglingAvail, setIsToggling]    = useState(false);
  const [isAccepting, setIsAccepting]       = useState(null);
  const [isUpdatingStatus, setIsUpdating]   = useState(false);
  const [myLocation, setMyLocation]         = useState(null);
  const [toast, setToast]                   = useState(null);
  const [banner, setBanner]                 = useState(null);
  const [mounted, setMounted]               = useState(false);
  const bannerTimerRef  = useRef(null);
  const pollIntervalRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed?.token && parsed?.driver?._id) setSession(parsed);
    } catch {}
  }, []);

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.token}`,
  }), [session]);

  const fetchDashboard = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res  = await fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") setDashData(data.data);
    } catch {}
  }, [session, authHeaders]);

  const fetchAvailableOrders = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res  = await fetch(`${DB_URL}/driver/${session.driver._id}/available-orders`, { headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") setOrders(data.data || []);
    } catch {}
  }, [session, authHeaders]);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setIsLoadingDash(true);
      await Promise.all([fetchDashboard(), fetchAvailableOrders()]);
      setIsLoadingDash(false);
    };
    load();
  }, [session, fetchDashboard, fetchAvailableOrders]);

  useEffect(() => {
    if (!session) return;
    pollIntervalRef.current = setInterval(() => {
      fetchDashboard();
      fetchAvailableOrders();
    }, POLL_INTERVAL);
    return () => clearInterval(pollIntervalRef.current);
  }, [session, fetchDashboard, fetchAvailableOrders]);

  useDriverSocket({
    partnerId: session?.driver?._id,
    driverToken: session?.token,
    onNewOrder: (data) => {
      setBanner({ text: `New order nearby! #${data?.shortId || ""}` });
      clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = setTimeout(() => setBanner(null), 8000);
      fetchDashboard();
      fetchAvailableOrders();
    },
    onLocationUpdate: (loc) => setMyLocation(loc),
  });

  useDriverFCM({ partnerId: session?.driver?._id, driverToken: session?.token });

  const toggleAvailability = async () => {
    if (!session?.driver?._id || isTogglingAvail) return;
    setIsToggling(true);
    try {
      const res  = await fetch(`${DB_URL}/driver/${session.driver._id}/availability`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") {
        setDashData((prev) => prev ? { ...prev, driver: { ...prev.driver, isAvailable: data.data.isAvailable } } : prev);
        showToast(data.message);
      }
    } catch { showToast("Failed to update availability", "error"); }
    finally { setIsToggling(false); }
  };

  const acceptOrder = async (orderId) => {
    if (!session?.driver?._id || isAccepting) return;
    setIsAccepting(orderId);
    try {
      const res  = await fetch(`${DB_URL}/driver/accept-order`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ orderId, partnerId: session.driver._id }),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        showToast("Order accepted! Navigate to pickup.");
        await Promise.all([fetchDashboard(), fetchAvailableOrders()]);
      } else {
        showToast(data?.message || "Failed to accept order", "error");
      }
    } catch { showToast("Failed to accept order", "error"); }
    finally { setIsAccepting(null); }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    if (!deliveryId || isUpdatingStatus) return;
    setIsUpdating(true);
    try {
      const body = { status: newStatus };
      if (myLocation) { body.lat = myLocation.lat; body.lng = myLocation.lng; }
      const res  = await fetch(`${DB_URL}/driver/delivery/${deliveryId}/status`, {
        method: "PATCH", headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        const labels = { picked_up: "Marked as picked up!", in_transit: "Delivery started!", delivered: "Delivered! Great work!" };
        showToast(labels[newStatus] || "Status updated!");
        await fetchDashboard();
      } else { showToast(data?.message || "Failed to update", "error"); }
    } catch { showToast("Failed to update status", "error"); }
    finally { setIsUpdating(false); }
  };

  if (!mounted) return null;

  const driver               = dashData?.driver || session?.driver || {};
  const activeDelivery       = dashData?.activeDelivery;
  const activeStatusConfig   = activeDelivery?.status ? STATUS_CONFIG[activeDelivery.status] : null;
  const isAvailable          = driver?.isAvailable ?? false;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text1, paddingBottom: 88, ...font }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes sk-shimmer { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        @media (max-width: 380px) { .driver-stats-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "12px 20px", borderRadius: 14, fontWeight: 600, fontSize: 13,
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
          animation: "fadeSlideDown 0.25s ease",
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(13,124,59,0.95)",
          border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.5)" : "rgba(13,124,59,0.5)"}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)", color: C.white, backdropFilter: "blur(12px)",
        }}>
          {toast.type === "error" ? <FaExclamationTriangle /> : <FaCheckCircle />}
          {toast.msg}
        </div>
      )}

      {/* New Order Banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, zIndex: 9998,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 4px 20px rgba(13,124,59,0.3)",
              cursor: "pointer",
            }}
            onClick={() => { setBanner(null); document.getElementById("available-orders")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            <FaBell style={{ width: 18, height: 18, color: C.white, flexShrink: 0 }} />
            <span style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{banner.text}</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginLeft: "auto" }}>Tap to view</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header style={{
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 16px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, overflow: "hidden",
            border: `1.5px solid ${C.amberBrd}`, flexShrink: 0,
          }}>
            <Image src="/assets/icons/logo2.png" alt="Yookatale" width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
          <div>
            <p style={{ color: C.green, fontWeight: 800, fontSize: 14, lineHeight: 1.1, letterSpacing: "-0.3px" }}>Yookatale</p>
            <p style={{ color: C.text3, fontSize: 10, marginTop: 1, fontWeight: 500 }}>Driver Portal</p>
          </div>
        </div>
        <button
          onClick={() => { fetchDashboard(); fetchAvailableOrders(); }}
          style={{
            padding: 8, background: "#f9fafb",
            borderRadius: 10, border: `1px solid ${C.border}`,
            cursor: "pointer", color: C.text2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <FaRedo style={{ width: 14, height: 14 }} />
        </button>
      </header>

      {/* Loading skeletons */}
      {isLoadingDash && (
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Main content */}
      {!isLoadingDash && (
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Top section: avatar + greeting + toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flexShrink: 0, position: "relative" }}>
              {driver?.profilePicture || driver?.avatar ? (
                <img
                  src={driver.profilePicture || driver.avatar}
                  alt={driver.name || "Driver"}
                  style={{
                    width: 56, height: 56, borderRadius: "50%", objectFit: "cover",
                    border: `3px solid ${isAvailable ? C.green : C.border}`,
                  }}
                />
              ) : (
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.green}, ${C.amber})`,
                  border: `3px solid ${isAvailable ? C.green : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 800, color: C.white,
                }}>
                  {(driver?.name || "D")[0].toUpperCase()}
                </div>
              )}
              {/* Online indicator dot */}
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                width: 14, height: 14, borderRadius: "50%",
                background: isAvailable ? "#10b981" : C.text3,
                border: "2.5px solid #f4f5f7",
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: C.text3, marginBottom: 2 }}>{greeting()}</p>
              <p style={{ fontWeight: 800, fontSize: 18, color: C.text1, lineHeight: 1.2 }}>
                {driver?.name?.split(" ")[0] || "Driver"}
              </p>
            </div>
            {/* Large pill toggle */}
            <button
              onClick={toggleAvailability}
              disabled={isTogglingAvail}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                background: isAvailable
                  ? `linear-gradient(135deg, ${C.green}, ${C.greenLt})`
                  : "#f9fafb",
                border: `1px solid ${isAvailable ? C.greenLt : C.borderMd}`,
                color: isAvailable ? C.white : C.text2,
                cursor: isTogglingAvail ? "not-allowed" : "pointer",
                opacity: isTogglingAvail ? 0.6 : 1,
                transition: "all 0.25s",
                fontFamily: "inherit",
                boxShadow: isAvailable ? "0 4px 16px rgba(13,124,59,0.25)" : "none",
                minWidth: 96,
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: isAvailable ? C.white : C.text3,
                animation: isAvailable ? "pulse 2s ease-in-out infinite" : "none",
                flexShrink: 0,
              }} />
              {isTogglingAvail ? "..." : isAvailable ? "Online" : "Offline"}
            </button>
          </div>

          {/* Stats row */}
          <div className="driver-stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Today", value: dashData?.todayDeliveries ?? 0, sub: "deliveries", Icon: FaMotorcycle, color: C.blue },
              { label: "This Week", value: `${((dashData?.weekEarnings || 0) / 1000).toFixed(0)}K`, sub: "UGX earned", Icon: FaMoneyBillWave, color: "#10b981" },
              { label: "Rating", value: (driver?.averageRating || 0).toFixed(1), sub: `${driver?.ratingCount || 0} reviews`, Icon: FaStar, color: C.amber },
            ].map((s) => (
              <Card key={s.label} style={{ padding: "14px 10px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: s.color }}>
                  <s.Icon style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: C.text3, marginTop: 4, fontWeight: 500 }}>{s.sub}</div>
              </Card>
            ))}
          </div>

          {/* Active Delivery */}
          {activeDelivery && (
            <Card style={{
              overflow: "hidden",
              border: `1px solid ${activeStatusConfig?.color || C.green}30`,
              boxShadow: `0 0 40px ${activeStatusConfig?.color || C.green}08`,
            }}>
              <div style={{ height: 480, position: "relative" }}>
                <ActiveDeliveryMap
                  activeDelivery={activeDelivery}
                  driverLocation={myLocation ? { lat: myLocation.lat, lng: myLocation.lng, heading: myLocation.heading ?? 0 } : null}
                  onUpdateStatus={updateDeliveryStatus}
                  isUpdating={isUpdatingStatus}
                />
              </div>
            </Card>
          )}

          {/* Available Orders */}
          <div id="available-orders">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.text2, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Nearby Orders
              </p>
              {availableOrders.length > 0 && (
                <span style={{ background: C.green, color: C.white, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>
                  {availableOrders.length}
                </span>
              )}
            </div>

            {!isAvailable && (
              <div style={{ background: C.amberDim, border: `1px solid ${C.amberBrd}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <FaExclamationTriangle style={{ color: C.amber, width: 18, height: 18, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.amber, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>You are offline</p>
                  <p style={{ color: "#b45309", fontSize: 11 }}>Go online to receive orders</p>
                </div>
                <button onClick={toggleAvailability} style={{ fontSize: 12, background: C.amber, color: "#fff", padding: "7px 14px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Go Online
                </button>
              </div>
            )}

            {availableOrders.length === 0 ? (
              <Card style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, color: C.text3 }}>
                  <FaMotorcycle style={{ width: 48, height: 48 }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, color: C.text1, marginBottom: 6 }}>No orders nearby</p>
                <p style={{ fontSize: 12, color: C.text3, lineHeight: 1.6 }}>
                  Stay online to receive new orders
                </p>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {availableOrders.map((order) => (
                  <DriverOrderCard
                    key={order._id}
                    order={order}
                    onAccept={acceptOrder}
                    isAccepting={isAccepting === order._id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
