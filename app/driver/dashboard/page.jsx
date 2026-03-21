"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DB_URL } from "@config/config";
import { useDriverSocket } from "@hooks/useDriverSocket";
import { useDriverFCM } from "@hooks/useDriverFCM";

const DRIVER_KEY = "yookatale-driver";
// Location updates now go through Socket.IO (useDriverSocket hook)
// LOCATION_INTERVAL removed — socket handler debounces DB writes server-side
const POLL_INTERVAL = 12000;

/* ── Brand tokens ──────────────────────────────────────── */
const C = {
  bg:       "#0D0D0D",
  card:     "#111111",
  card2:    "#161616",
  border:   "rgba(255,255,255,0.07)",
  gold:     "#F5A623",
  goldDim:  "rgba(245,166,35,0.12)",
  goldBrd:  "rgba(245,166,35,0.25)",
  green:    "#185f2d",
  greenLt:  "#1a7a36",
  white:    "#ffffff",
  text1:    "#f3f4f6",
  text2:    "#9ca3af",
  text3:    "#6b7280",
  blue:     "#3b82f6",
  purple:   "#8b5cf6",
  amber:    "#f59e0b",
  red:      "#ef4444",
};

const STATUS_CONFIG = {
  assigned:   { label: "Assigned",   color: C.blue,   next: "picked_up",  nextLabel: "Mark Picked Up"  },
  picked_up:  { label: "Picked Up",  color: C.amber,  next: "in_transit", nextLabel: "Start Delivery"  },
  in_transit: { label: "In Transit", color: C.purple, next: "delivered",  nextLabel: "Mark Delivered"  },
  delivered:  { label: "Delivered",  color: "#10b981", next: null,         nextLabel: null              },
};

/* ── Haversine ─────────────────────────────────────────── */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapsUrl(destLat, destLng) {
  if (!destLat || !destLng) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
}

/* ── Star Rating ───────────────────────────────────────── */
function StarRating({ rating = 0, count = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} style={{ width: 13, height: 13, color: s <= Math.round(rating) ? C.gold : C.text3 }} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span style={{ fontSize: 11, color: C.text3, marginLeft: 2 }}>({count})</span>
    </div>
  );
}

/* ── Inline SVG Icons ──────────────────────────────────── */
const IcoHome     = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const IcoOrders   = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>;
const IcoEarnings = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>;
const IcoProfile  = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoMap      = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>;
const IcoPhone    = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>;
const IcoPin      = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IcoUser     = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
const IcoCoin     = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>;
const IcoBox      = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg>;
const IcoStar     = ({ a }) => <svg style={a} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>;
const IcoClock    = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoCheck    = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoWarn     = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoRefresh  = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const IcoLogout   = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;
const IcoMoto     = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5h7M15 17.5V9l-3-5h-2L8 9h4l2 3"/><path d="M19 9h-4M5.5 15l1.5-6h2"/></svg>;
const IcoInbox    = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3H10l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>;
const IcoMail     = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>;
const IcoPlate    = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M7 12h10M7 9v6M17 9v6"/></svg>;
const IcoCal      = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoGps      = ({ a }) => <svg style={a} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>;
const IcoSpinner  = ({ a }) => <svg style={{ ...a, animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;

const ico = (w = 16) => ({ width: w, height: w, flexShrink: 0 });

/* ── Card wrapper ─────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, ...style }}>
    {children}
  </div>
);

/* ── Badge ───────────────────────────────────────────── */
const Badge = ({ label, color }) => (
  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: `${color}18`, color, border: `1px solid ${color}40` }}>
    {label}
  </span>
);

export default function DriverDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
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

  // Socket hook: emits GPS every 4s via WebSocket and listens for new order assignments
  // The server handler broadcasts to the order room immediately and debounces DB writes
  useDriverSocket({
    partnerId: session?.driver?._id,
    driverToken: session?.token,
    onNewOrder: (data) => {
      showToast(`New order assigned! #${data?.shortId || ""}`, "success");
      fetchDashboard();
      fetchAvailableOrders();
    },
  });

  // FCM hook: requests notification permission, saves token to backend, handles foreground messages
  useDriverFCM({ partnerId: session?.driver?._id, driverToken: session?.token });

  const toggleAvailability = async () => {
    if (!session?.driver?._id || isTogglingAvail) return;
    setIsTogglingAvail(true);
    try {
      const res = await fetch(`${DB_URL}/driver/${session.driver._id}/availability`, { method: "PATCH", headers: authHeaders() });
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
        const labels = { picked_up: "Marked as picked up!", in_transit: "Delivery started!", delivered: "Delivered! Great work!" };
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
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <IcoSpinner a={ico(36)} />
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

  const navTabs = [
    { key: "home",     label: "Home",     Icon: IcoHome },
    { key: "orders",   label: "Orders",   Icon: IcoOrders,   badge: availableOrders.length },
    { key: "earnings", label: "Earnings", Icon: IcoEarnings },
    { key: "profile",  label: "Profile",  Icon: IcoProfile },
  ];

  /* ── font style applied everywhere ── */
  const fontStyle = { fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text1, display: "flex", flexDirection: "column", ...fontStyle }}>

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        .tab-btn:hover { background: rgba(255,255,255,0.04) !important; }
        .order-card:hover { border-color: rgba(245,166,35,0.2) !important; transform: translateY(-1px); transition: all 0.2s; }
        .delivery-card:hover { border-color: rgba(245,166,35,0.2) !important; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "12px 20px", borderRadius: 14, fontWeight: 600, fontSize: 13,
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
          animation: "fadeSlideDown 0.25s ease",
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(24,95,45,0.95)",
          border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.5)" : "rgba(26,122,54,0.5)"}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          color: C.white,
          backdropFilter: "blur(12px)",
        }}>
          {toast.type === "error"
            ? <IcoWarn a={ico(16)} />
            : <IcoCheck a={ico(16)} />
          }
          {toast.msg}
        </div>
      )}

      {/* ════════════ HEADER ════════════ */}
      <header style={{
        background: C.card,
        borderBottom: `1px solid ${C.border}`,
        padding: "0 16px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}>
        {/* Logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", border: `1.5px solid ${C.goldBrd}`, flexShrink: 0 }}>
            <Image src="/assets/icons/logo2.png" alt="Yookatale" width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
          <div>
            <p style={{ color: C.text1, fontWeight: 700, fontSize: 14, lineHeight: 1.1 }}>{driver?.name || "Driver"}</p>
            <p style={{ color: C.text3, fontSize: 11, marginTop: 1, textTransform: "capitalize" }}>{driver?.transport || "rider"} · Yookatale</p>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Availability toggle */}
          <button
            onClick={toggleAvailability}
            disabled={isTogglingAvail}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
              border: `1px solid ${isAvailable ? C.goldBrd : C.border}`,
              background: isAvailable ? C.goldDim : "rgba(255,255,255,0.04)",
              color: isAvailable ? C.gold : C.text3,
              cursor: isTogglingAvail ? "not-allowed" : "pointer",
              opacity: isTogglingAvail ? 0.6 : 1,
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: isAvailable ? C.gold : C.text3,
              boxShadow: isAvailable ? `0 0 8px ${C.gold}` : "none",
              animation: isAvailable ? "pulse 2s ease-in-out infinite" : "none",
            }} />
            {isTogglingAvail ? "..." : isAvailable ? "Online" : "Offline"}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            style={{ padding: 8, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: C.text3, display: "flex", alignItems: "center", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.red}
            onMouseLeave={(e) => e.currentTarget.style.color = C.text3}
          >
            <IcoLogout a={ico(18)} />
          </button>
        </div>
      </header>

      {/* ════════════ LOADING ════════════ */}
      {isLoadingDash && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
          <IcoSpinner a={ico(36)} />
          <p style={{ color: C.text3, fontSize: 14 }}>Loading dashboard...</p>
        </div>
      )}

      {/* ════════════ MAIN CONTENT ════════════ */}
      {!isLoadingDash && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 88, animation: "fadeIn 0.3s ease" }}>

          {/* ─────────────── HOME TAB ─────────────── */}
          {activeTab === "home" && (
            <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Deliveries", value: dashData?.weekDeliveries ?? 0, sub: "this week", Icon: IcoBox, color: C.blue },
                  { label: "Rating", value: (driver?.averageRating || 0).toFixed(1), sub: `${driver?.ratingCount || 0} reviews`, Icon: IcoStar, color: C.gold },
                  { label: "Earnings", value: `${((driver?.totalEarnings || 0) / 1000).toFixed(0)}K`, sub: "UGX total", Icon: IcoCoin, color: "#10b981" },
                ].map((s) => (
                  <Card key={s.label} style={{ padding: "14px 10px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: s.color }}>
                      <s.Icon a={ico(18)} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: C.text3, marginTop: 4, fontWeight: 500 }}>{s.sub}</div>
                  </Card>
                ))}
              </div>

              {/* Active Delivery */}
              {activeDelivery ? (
                <div style={{
                  background: "linear-gradient(135deg, #111111 0%, #161616 100%)",
                  border: `1px solid ${activeStatusConfig?.color || C.gold}40`,
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: `0 0 40px ${activeStatusConfig?.color || C.gold}10`,
                }}>
                  {/* Card header */}
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeStatusConfig?.color || C.gold, boxShadow: `0 0 8px ${activeStatusConfig?.color}`, animation: "pulse 2s ease-in-out infinite" }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: C.text1 }}>Active Delivery</span>
                    </div>
                    <Badge label={activeStatusConfig?.label || activeDeliveryStatus} color={activeStatusConfig?.color || C.gold} />
                  </div>

                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Order info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {deliveryOrder?.customerName && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: `${C.gold}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <IcoUser a={{ ...ico(14), color: C.gold }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{deliveryOrder.customerName}</span>
                        </div>
                      )}
                      {deliveryOrder?.customerPhone && (
                        <a href={`tel:${deliveryOrder.customerPhone}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <IcoPhone a={{ ...ico(14), color: C.blue }} />
                          </div>
                          <span style={{ fontSize: 14, color: C.blue, fontWeight: 500 }}>{deliveryOrder.customerPhone}</span>
                        </a>
                      )}
                      {deliveryOrder?.deliveryAddress && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <IcoPin a={{ ...ico(14), color: C.purple }} />
                          </div>
                          <span style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>
                            {typeof deliveryOrder.deliveryAddress === "object"
                              ? deliveryOrder.deliveryAddress.address || JSON.stringify(deliveryOrder.deliveryAddress)
                              : deliveryOrder.deliveryAddress}
                          </span>
                        </div>
                      )}
                      {deliveryOrder?.total && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <IcoCoin a={{ ...ico(14), color: "#10b981" }} />
                          </div>
                          <span style={{ fontSize: 15, fontWeight: 700, color: C.gold }}>UGX {Number(deliveryOrder.total).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Navigate button */}
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
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            width: "100%", background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                            border: "none", borderRadius: 12, padding: "12px 0",
                            color: C.white, fontSize: 14, fontWeight: 600, textDecoration: "none",
                            boxShadow: "0 4px 20px rgba(29,78,216,0.3)", transition: "all 0.2s",
                          }}
                        >
                          <IcoMap a={ico(16)} />
                          Navigate with Google Maps
                        </a>
                      ) : (
                        <div style={{ textAlign: "center", fontSize: 12, color: C.text3, padding: "8px 0" }}>
                          No GPS coordinates — ask customer for location
                        </div>
                      );
                    })()}

                    {/* Status update button */}
                    {activeStatusConfig?.next && (
                      <button
                        onClick={() => updateDeliveryStatus(activeDelivery._id, activeStatusConfig.next)}
                        disabled={isUpdatingStatus}
                        style={{
                          width: "100%", background: `linear-gradient(135deg, ${activeStatusConfig.color}, ${activeStatusConfig.color}cc)`,
                          border: "none", borderRadius: 12, padding: "13px 0",
                          color: C.white, fontWeight: 700, fontSize: 14, cursor: isUpdatingStatus ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          opacity: isUpdatingStatus ? 0.6 : 1, transition: "all 0.2s",
                          boxShadow: `0 4px 20px ${activeStatusConfig.color}30`,
                          fontFamily: "inherit",
                        }}
                      >
                        {isUpdatingStatus ? (
                          <><IcoSpinner a={ico(16)} /> Updating...</>
                        ) : (
                          <><IcoCheck a={ico(16)} /> {activeStatusConfig.nextLabel}</>
                        )}
                      </button>
                    )}

                    {activeDeliveryStatus === "delivered" && (
                      <div style={{ textAlign: "center", padding: "10px 0", color: "#10b981", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <IcoCheck a={ico(16)} />
                        Delivery Complete! Looking for new orders...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* No active delivery */
                <Card style={{ padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: C.text3 }}>
                    <IcoMoto a={ico(52)} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: C.text1, marginBottom: 6 }}>No active delivery</p>
                  <p style={{ fontSize: 13, color: C.text3, marginBottom: 20, lineHeight: 1.6 }}>
                    {isAvailable ? "You're online. Check available orders!" : "Go online to start receiving orders."}
                  </p>
                  {!isAvailable ? (
                    <button
                      onClick={toggleAvailability}
                      style={{ padding: "10px 24px", background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`, border: "none", borderRadius: 10, color: C.white, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(24,95,45,0.35)" }}
                    >
                      Go Online
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab("orders")}
                      style={{ padding: "10px 24px", background: "linear-gradient(135deg, #1d4ed8, #1e40af)", border: "none", borderRadius: 10, color: C.white, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(29,78,216,0.3)" }}
                    >
                      Browse Orders
                    </button>
                  )}
                </Card>
              )}

              {/* Recent Deliveries */}
              {recentDeliveries.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, paddingLeft: 2 }}>Recent Deliveries</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {recentDeliveries.slice(0, 5).map((d) => (
                      <Card key={d._id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="delivery-card">
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: C.text1, marginBottom: 3 }}>
                            {d.orderId?.customerName || "Order"}
                          </p>
                          <p style={{ fontSize: 11, color: C.text3 }}>
                            {d.deliveredAt ? new Date(d.deliveredAt).toLocaleDateString() : new Date(d.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Badge
                            label={d.status?.replace(/_/g, " ")}
                            color={d.status === "delivered" ? "#10b981" : d.status === "in_transit" ? C.purple : C.text3}
                          />
                          {d.commissionAmount > 0 && (
                            <p style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>+UGX {d.commissionAmount.toLocaleString()}</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────── ORDERS TAB ─────────────── */}
          {activeTab === "orders" && (
            <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: C.text1, letterSpacing: "-0.3px" }}>Available Orders</h2>
                <button
                  onClick={fetchAvailableOrders}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.gold, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}
                >
                  <IcoRefresh a={ico(13)} />
                  Refresh
                </button>
              </div>

              {!isAvailable && (
                <div style={{ background: "rgba(245,166,35,0.07)", border: `1px solid ${C.goldBrd}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <IcoWarn a={{ ...ico(18), color: C.gold, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: C.gold, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>You are currently offline</p>
                    <p style={{ color: "#9a7c30", fontSize: 11 }}>Go online to accept delivery orders</p>
                  </div>
                  <button
                    onClick={toggleAvailability}
                    style={{ fontSize: 12, background: C.gold, color: "#000", padding: "7px 14px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}
                  >
                    Go Online
                  </button>
                </div>
              )}

              {availableOrders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: C.text3 }}>
                    <IcoInbox a={ico(56)} />
                  </div>
                  <p style={{ color: C.text2, fontWeight: 600, fontSize: 15, marginBottom: 6 }}>No available orders</p>
                  <p style={{ color: C.text3, fontSize: 12 }}>Orders refresh every 12 seconds automatically</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {availableOrders.map((order) => {
                    const addr = order.deliveryAddress;
                    const destLat = addr?.lat || addr?.latitude;
                    const destLng = addr?.lng || addr?.longitude;
                    const navUrl = mapsUrl(destLat, destLng);
                    return (
                      <Card key={order._id} style={{ overflow: "hidden" }} className="order-card">
                        {/* Order header */}
                        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, fontFamily: "monospace", color: C.text3 }}>#{String(order._id).slice(-6).toUpperCase()}</span>
                            {order.distanceKm != null && (
                              <span style={{ fontSize: 11, background: "rgba(59,130,246,0.12)", color: C.blue, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
                                {order.distanceKm} km away
                              </span>
                            )}
                          </div>
                          <Badge label={order.status} color={order.status === "ready" ? "#10b981" : order.status === "confirmed" ? C.blue : C.text3} />
                        </div>

                        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                          {order.customerName && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <IcoUser a={{ ...ico(13), color: C.text3 }} />
                              <span style={{ fontSize: 13, color: C.text2 }}>{order.customerName}</span>
                            </div>
                          )}
                          {addr && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <IcoPin a={{ ...ico(13), color: C.text3, marginTop: 1 }} />
                              <span style={{ fontSize: 12, color: C.text3, lineHeight: 1.5 }}>
                                {typeof addr === "object" ? addr.address || addr.address1 || "Address on map" : addr}
                              </span>
                            </div>
                          )}
                          {order.total && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>UGX {Number(order.total).toLocaleString()}</span>
                              <span style={{ fontSize: 11, color: C.text3 }}>· ~UGX {Math.round(Number(order.total) * 0.05).toLocaleString()} commission</span>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <button
                              onClick={() => acceptOrder(order._id)}
                              disabled={!!isAccepting || !isAvailable}
                              style={{
                                flex: 1, background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
                                border: "none", borderRadius: 10, padding: "11px 0",
                                color: C.white, fontSize: 13, fontWeight: 700, cursor: (!!isAccepting || !isAvailable) ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                opacity: (!!isAccepting || !isAvailable) ? 0.5 : 1,
                                boxShadow: "0 4px 16px rgba(24,95,45,0.3)",
                                fontFamily: "inherit",
                              }}
                            >
                              {isAccepting === order._id ? (
                                <><IcoSpinner a={ico(14)} /> Accepting...</>
                              ) : (
                                <><IcoCheck a={ico(14)} /> Accept Order</>
                              )}
                            </button>
                            {navUrl && (
                              <a
                                href={navUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: "11px 14px", background: "rgba(29,78,216,0.15)", border: `1px solid rgba(29,78,216,0.3)`,
                                  borderRadius: 10, color: C.blue, display: "flex", alignItems: "center", textDecoration: "none",
                                }}
                              >
                                <IcoMap a={ico(16)} />
                              </a>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─────────────── EARNINGS TAB ─────────────── */}
          {activeTab === "earnings" && (
            <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontWeight: 800, fontSize: 18, color: C.text1, letterSpacing: "-0.3px" }}>Earnings & Payouts</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Total Earned", value: `UGX ${(driver?.totalEarnings || 0).toLocaleString()}`, color: C.gold, Icon: IcoCoin },
                  { label: "Unpaid Balance", value: `UGX ${(driver?.commissionEarned || 0).toLocaleString()}`, color: C.amber, Icon: IcoClock },
                  { label: "Total Deliveries", value: driver?.totalDeliveries || 0, color: C.blue, Icon: IcoBox },
                  { label: "Avg Rating", value: (driver?.averageRating || 0).toFixed(1), color: C.gold, Icon: IcoStar },
                ].map((s) => (
                  <Card key={s.label} style={{ padding: "18px 16px" }}>
                    <s.Icon a={{ ...ico(18), color: s.color, marginBottom: 10 }} />
                    <div style={{ fontWeight: 800, fontSize: 20, color: s.color, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: C.text3, fontWeight: 500 }}>{s.label}</div>
                  </Card>
                ))}
              </div>

              {/* Payout method */}
              {driver?.payoutMethod?.phone ? (
                <Card style={{ padding: "18px 16px" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Payout Method</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: C.goldDim, border: `1px solid ${C.goldBrd}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: C.gold, fontWeight: 800, fontSize: 16 }}>{driver.payoutMethod.provider?.[0] || "M"}</span>
                    </div>
                    <div>
                      <p style={{ color: C.text1, fontSize: 14, fontWeight: 600 }}>{driver.payoutMethod.provider} Mobile Money</p>
                      <p style={{ color: C.text3, fontSize: 12, marginTop: 2 }}>{driver.payoutMethod.phone}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div style={{ background: C.goldDim, border: `1px solid ${C.goldBrd}`, borderRadius: 14, padding: "16px" }}>
                  <p style={{ color: C.gold, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>No payout method set</p>
                  <p style={{ color: "#9a7c30", fontSize: 12 }}>Contact admin to add your Mobile Money details</p>
                </div>
              )}

              {/* Payout history */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Payout History</p>
                {payoutHistory.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0", color: C.text3, fontSize: 13 }}>
                    No payouts yet — payouts run weekly by admin
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {payoutHistory.map((p) => (
                      <Card key={p._id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontSize: 14, color: C.text1, fontWeight: 600 }}>UGX {Number(p.amount).toLocaleString()}</p>
                          <p style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{p.note || "Weekly payout"}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 11, color: C.text3 }}>{new Date(p.paidAt).toLocaleDateString()}</p>
                          <Badge label="Paid" color="#10b981" />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─────────────── PROFILE TAB ─────────────── */}
          {activeTab === "profile" && (
            <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontWeight: 800, fontSize: 18, color: C.text1, letterSpacing: "-0.3px" }}>My Profile</h2>

              {/* Profile card */}
              <Card style={{ padding: "24px 20px" }}>
                {/* Avatar + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: `linear-gradient(135deg, ${C.green}, ${C.goldDim})`,
                    border: `2px solid ${C.goldBrd}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, fontWeight: 800, color: C.gold,
                  }}>
                    {(driver?.name || "D")[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: 18, color: C.text1, marginBottom: 4 }}>{driver?.name || "Driver"}</h3>
                    <StarRating rating={driver?.averageRating} count={driver?.ratingCount} />
                    <div style={{ marginTop: 6 }}>
                      <Badge label={driver?.status || "Active"} color={driver?.status === "Verified" ? "#10b981" : C.gold} />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Email", value: driver?.email, Icon: IcoMail },
                    { label: "Phone", value: driver?.phone, Icon: IcoPhone },
                    { label: "Transport Type", value: driver?.transport, Icon: IcoMoto },
                    { label: "Number Plate", value: driver?.numberPlate, Icon: IcoPlate },
                    { label: "Member Since", value: driver?.createdAt ? new Date(driver.createdAt).toLocaleDateString("en-UG", { year: "numeric", month: "long" }) : null, Icon: IcoCal },
                  ].filter((r) => r.value).map((row) => (
                    <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: C.goldDim, border: `1px solid ${C.goldBrd}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <row.Icon a={{ ...ico(15), color: C.gold }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{row.label}</p>
                        <p style={{ fontSize: 13, color: C.text1, fontWeight: 500, marginTop: 2, textTransform: "capitalize" }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* GPS status */}
              <div style={{
                border: `1px solid ${myLocation ? C.goldBrd : C.border}`,
                background: myLocation ? C.goldDim : C.card,
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}>
                <IcoGps a={{ ...ico(18), color: myLocation ? C.gold : C.text3 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: myLocation ? C.gold : C.text2 }}>GPS Location</p>
                  <p style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>
                    {myLocation ? `Sharing: ${myLocation.lat.toFixed(4)}, ${myLocation.lng.toFixed(4)}` : "Location not shared"}
                  </p>
                </div>
                {myLocation && (
                  <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: C.gold, animation: "pulse 2s ease-in-out infinite" }} />
                )}
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                style={{
                  width: "100%",
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 12,
                  padding: "13px 0",
                  color: C.red,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
              >
                <IcoLogout a={ico(16)} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* ════════════ BOTTOM NAV ════════════ */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        zIndex: 40,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="tab-btn"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 0 8px",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isActive ? C.gold : C.text3,
                position: "relative",
                transition: "color 0.2s",
                fontFamily: "inherit",
                borderRadius: 0,
              }}
            >
              {/* Active indicator line */}
              {isActive && (
                <div style={{
                  position: "absolute", top: 0, left: "25%", right: "25%",
                  height: 2, borderRadius: "0 0 4px 4px",
                  background: `linear-gradient(90deg, ${C.gold}, #f7c05a)`,
                  boxShadow: `0 0 8px ${C.gold}60`,
                }} />
              )}
              <tab.Icon a={{ ...ico(22), color: isActive ? C.gold : C.text3 }} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: "0.02em" }}>{tab.label}</span>
              {tab.badge > 0 && (
                <span style={{
                  position: "absolute", top: 8, right: "18%",
                  background: C.red,
                  color: C.white,
                  fontSize: 9,
                  fontWeight: 700,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}>
                  {tab.badge > 9 ? "9+" : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
