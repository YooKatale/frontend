"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import { useDriverSocket } from "@hooks/useDriverSocket";
import {
  FaMotorcycle, FaCheckCircle, FaBoxOpen, FaShippingFast,
  FaMapMarkerAlt, FaPhone, FaExclamationTriangle, FaRedo,
} from "react-icons/fa";

const ActiveDeliveryMap = dynamic(
  () => import("@components/driver/ActiveDeliveryMap"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#0D0D0D", borderRadius: 18 }} /> }
);

const DRIVER_KEY = "yookatale-driver";

const C = {
  bg:      "#0D0D0D",
  card:    "#111111",
  card2:   "#161616",
  border:  "rgba(255,255,255,0.07)",
  gold:    "#F5A623",
  goldDim: "rgba(245,166,35,0.12)",
  goldBrd: "rgba(245,166,35,0.25)",
  green:   "#185f2d",
  greenLt: "#1a7a36",
  white:   "#ffffff",
  text1:   "#f3f4f6",
  text2:   "#9ca3af",
  text3:   "#6b7280",
  blue:    "#3b82f6",
  amber:   "#f59e0b",
  purple:  "#8b5cf6",
  red:     "#ef4444",
};

const STATUS_CONFIG = {
  assigned:   { label: "Assigned",   color: C.blue,   next: "picked_up",  nextLabel: "Mark Picked Up",   Icon: FaBoxOpen       },
  picked_up:  { label: "Picked Up",  color: C.amber,  next: "in_transit", nextLabel: "Start Delivery",    Icon: FaShippingFast  },
  in_transit: { label: "In Transit", color: C.purple, next: "delivered",  nextLabel: "Mark Delivered",    Icon: FaCheckCircle   },
  delivered:  { label: "Delivered",  color: "#10b981", next: null,         nextLabel: null,               Icon: FaCheckCircle   },
};

const font = { fontFamily: "'Sora','DM Sans',system-ui,sans-serif" };

export default function DriverDeliveryPage() {
  const router = useRouter();
  const [session, setSession]         = useState(null);
  const [delivery, setDelivery]       = useState(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [isUpdating, setIsUpdating]   = useState(false);
  const [myLocation, setMyLocation]   = useState(null);
  const [toast, setToast]             = useState(null);
  const [mounted, setMounted]         = useState(false);

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
      if (parsed?.token && parsed?.driver?._id) setSession(parsed);
      else router.replace("/driver/login");
    } catch { router.replace("/driver/login"); }
  }, [router]);

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.token}`,
  }), [session]);

  const fetchDelivery = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res  = await fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") setDelivery(data.data?.activeDelivery || null);
    } catch {}
    finally { setIsLoading(false); }
  }, [session, authHeaders]);

  useEffect(() => {
    if (session) fetchDelivery();
  }, [session, fetchDelivery]);

  useDriverSocket({
    partnerId: session?.driver?._id,
    driverToken: session?.token,
    onNewOrder: () => fetchDelivery(),
    onLocationUpdate: (loc) => setMyLocation(loc),
  });

  const updateStatus = async (deliveryId, newStatus) => {
    if (!deliveryId || isUpdating) return;
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
        const labels = {
          picked_up:  "Marked as picked up!",
          in_transit: "Delivery started!",
          delivered:  "Delivered! Great work! 🎉",
        };
        showToast(labels[newStatus] || "Status updated!");
        await fetchDelivery();
        if (newStatus === "delivered") {
          setTimeout(() => router.push("/driver/dashboard"), 2000);
        }
      } else {
        showToast(data?.message || "Failed to update", "error");
      }
    } catch { showToast("Failed to update status", "error"); }
    finally { setIsUpdating(false); }
  };

  if (!mounted) return null;

  const statusConfig = delivery?.status ? STATUS_CONFIG[delivery.status] : null;
  const mapDriverLoc = myLocation ? { lat: myLocation.lat, lng: myLocation.lng, heading: myLocation.heading ?? 0 } : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text1, paddingBottom: 88, ...font }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "12px 20px", borderRadius: 14, fontWeight: 600, fontSize: 13,
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
          animation: "fadeSlideDown 0.25s ease",
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(24,95,45,0.95)",
          border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.5)" : "rgba(26,122,54,0.5)"}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", color: C.white, backdropFilter: "blur(12px)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: "0 16px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FaMotorcycle style={{ width: 22, height: 22, color: C.gold }} />
          <span style={{ color: C.text1, fontWeight: 700, fontSize: 15 }}>Active Delivery</span>
        </div>
        <button onClick={fetchDelivery} style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: C.text3 }}>
          <FaRedo style={{ width: 15, height: 15 }} />
        </button>
      </header>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.green}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {/* No active delivery */}
      {!isLoading && !delivery && (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.goldDim, border: `1px solid ${C.goldBrd}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <FaMotorcycle style={{ width: 36, height: 36, color: C.gold }} />
          </div>
          <h2 style={{ color: C.text1, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>No Active Delivery</h2>
          <p style={{ color: C.text2, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            You don't have an active delivery right now.<br />Accept an order from the Home tab.
          </p>
          <button
            onClick={() => router.push("/driver/dashboard")}
            style={{
              padding: "12px 28px", borderRadius: 12,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
              border: "none", color: C.white, fontWeight: 700,
              fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Go to Home
          </button>
        </div>
      )}

      {/* Active delivery */}
      {!isLoading && delivery && (
        <div style={{ padding: "16px 16px 0" }}>

          {/* Status banner */}
          <div style={{
            background: `${statusConfig?.color || C.gold}14`,
            border: `1px solid ${statusConfig?.color || C.gold}40`,
            borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `${statusConfig?.color || C.gold}20`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {statusConfig?.Icon && <statusConfig.Icon style={{ width: 18, height: 18, color: statusConfig.color }} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: C.text3, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                Current Status
              </p>
              <p style={{ color: statusConfig?.color || C.gold, fontWeight: 800, fontSize: 16 }}>
                {statusConfig?.label || delivery.status}
              </p>
            </div>
            <span style={{
              background: `${statusConfig?.color || C.gold}20`,
              color: statusConfig?.color || C.gold,
              fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
              border: `1px solid ${statusConfig?.color || C.gold}40`,
            }}>
              Order #{String(delivery.orderId || delivery._id || "").slice(-6).toUpperCase()}
            </span>
          </div>

          {/* Map */}
          <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 14, height: 340 }}>
            <ActiveDeliveryMap
              activeDelivery={delivery}
              driverLocation={mapDriverLoc}
              onUpdateStatus={updateStatus}
              isUpdating={isUpdating}
            />
          </div>

          {/* Order details */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 14 }}>
            <p style={{ color: C.text3, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Delivery Details
            </p>

            {/* Customer info */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FaMapMarkerAlt style={{ width: 14, height: 14, color: C.blue }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: C.text3, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                  Drop-off
                </p>
                <p style={{ color: C.text1, fontSize: 13, lineHeight: 1.5 }}>
                  {delivery.deliveryAddress?.address || delivery.deliveryAddress?.address1 ||
                   (delivery.deliveryAddress?.lat ? `${Number(delivery.deliveryAddress.lat).toFixed(4)}, ${Number(delivery.deliveryAddress.lng).toFixed(4)}` : "—")}
                </p>
              </div>
            </div>

            {/* Customer contact */}
            {delivery.customerPhone && (
              <a
                href={`tel:${delivery.customerPhone}`}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 12, padding: "10px 14px", textDecoration: "none",
                }}
              >
                <FaPhone style={{ width: 14, height: 14, color: "#10b981", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text3, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Call Customer</p>
                  <p style={{ color: "#10b981", fontSize: 13, fontWeight: 600 }}>{delivery.customerPhone}</p>
                </div>
              </a>
            )}
          </div>

          {/* Status action button */}
          {statusConfig?.next && (
            <button
              onClick={() => updateStatus(delivery._id, statusConfig.next)}
              disabled={isUpdating}
              style={{
                width: "100%", padding: "16px", borderRadius: 16, border: "none",
                background: isUpdating ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}cc)`,
                color: isUpdating ? C.text3 : "#fff", fontWeight: 800, fontSize: 15,
                cursor: isUpdating ? "not-allowed" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: isUpdating ? "none" : `0 6px 24px ${statusConfig.color}40`,
                transition: "all 0.2s", marginBottom: 8,
              }}
            >
              {isUpdating ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Updating...
                </>
              ) : (
                <>
                  {statusConfig.Icon && <statusConfig.Icon style={{ width: 18, height: 18 }} />}
                  {statusConfig.nextLabel}
                </>
              )}
            </button>
          )}

          {delivery.status === "delivered" && (
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <FaCheckCircle style={{ color: "#10b981", width: 20, height: 20, flexShrink: 0 }} />
              <div>
                <p style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>Delivery Complete!</p>
                <p style={{ color: C.text3, fontSize: 12, marginTop: 2 }}>Great job! Returning to home...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
