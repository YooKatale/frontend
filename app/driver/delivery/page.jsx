"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import { useDriverSocket } from "@hooks/useDriverSocket";
import {
  FaMotorcycle, FaCheckCircle, FaBoxOpen, FaShippingFast,
  FaMapMarkerAlt, FaPhone, FaExclamationTriangle, FaRedo,
  FaUser, FaClock, FaRoute,
} from "react-icons/fa";

const ActiveDeliveryMap = dynamic(
  () => import("@components/driver/ActiveDeliveryMap"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#f4f5f7", borderRadius: 18 }} /> }
);

const DRIVER_KEY = "yookatale-driver";

const C = {
  bg:      "#f4f5f7",
  card:    "#ffffff",
  card2:   "#f9fafb",
  border:  "#f3f4f6",
  borderMd:"#e5e7eb",
  amber:   "#d97706",
  amberDim:"rgba(217,119,6,0.08)",
  amberBrd:"rgba(217,119,6,0.18)",
  green:   "#0d7c3b",
  greenLt: "#10a34d",
  white:   "#ffffff",
  text1:   "#111827",
  text2:   "#6b7280",
  text3:   "#9ca3af",
  blue:    "#3b82f6",
  purple:  "#8b5cf6",
  red:     "#ef4444",
};

const STATUS_CONFIG = {
  assigned:   { label: "Assigned",   color: C.blue,    next: "picked_up",  nextLabel: "Mark Picked Up",  Icon: FaBoxOpen      },
  picked_up:  { label: "Picked Up",  color: C.amber,   next: "in_transit", nextLabel: "Start Delivery",   Icon: FaShippingFast },
  in_transit: { label: "In Transit", color: C.purple,  next: "delivered",  nextLabel: "Mark Delivered",   Icon: FaCheckCircle  },
  delivered:  { label: "Delivered",  color: "#10b981",  next: null,         nextLabel: null,               Icon: FaCheckCircle  },
};

export default function DriverDeliveryPage() {
  const router = useRouter();
  const [session, setSession]       = useState(null);
  const [delivery, setDelivery]     = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [myLocation, setMyLocation] = useState(null);
  const [toast, setToast]           = useState(null);
  const [mounted, setMounted]       = useState(false);

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
        const labels = { picked_up: "Marked as picked up!", in_transit: "Delivery started!", delivered: "Delivered! Great work!" };
        showToast(labels[newStatus] || "Status updated!");
        await fetchDelivery();
        if (newStatus === "delivered") setTimeout(() => router.push("/driver/dashboard"), 2000);
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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text1, fontFamily: "'Bricolage Grotesque','Sora','DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        .delivery-layout { display: flex; flex-direction: column; min-height: 100vh; }
        .delivery-map-section { flex: 1; min-height: 50vh; position: relative; }
        .delivery-info-panel {
          background: ${C.card}; border-top: 1px solid ${C.border};
          padding: 16px; max-height: 45vh; overflow-y: auto;
        }
        @media (min-width: 1024px) {
          .delivery-layout { flex-direction: row; height: 100vh; }
          .delivery-map-section { flex: 1; min-height: 100vh; }
          .delivery-info-panel {
            width: 400px; flex-shrink: 0; border-top: none;
            border-left: 1px solid ${C.border};
            max-height: 100vh; overflow-y: auto;
            padding: 24px;
          }
        }
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
          {toast.msg}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.green}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: C.text2, fontSize: 14 }}>Loading delivery...</p>
          </div>
        </div>
      )}

      {/* No active delivery */}
      {!isLoading && !delivery && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 380 }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: C.amberDim,
              border: `2px solid ${C.amberBrd}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <FaMotorcycle style={{ width: 44, height: 44, color: C.amber }} />
            </div>
            <h2 style={{ color: C.text1, fontWeight: 800, fontSize: 22, marginBottom: 10 }}>No Active Delivery</h2>
            <p style={{ color: C.text2, fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
              You don't have an active delivery right now. New orders will appear on your Home tab.
            </p>
            <button
              onClick={() => router.push("/driver/dashboard")}
              style={{
                padding: "14px 32px", borderRadius: 14,
                background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
                border: "none", color: C.white, fontWeight: 700,
                fontSize: 15, cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(13,124,59,0.25)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Go to Home
            </button>
          </div>
        </div>
      )}

      {/* Active delivery - full-screen map + side panel layout */}
      {!isLoading && delivery && (
        <div className="delivery-layout">
          {/* Map section */}
          <div className="delivery-map-section">
            {/* Floating status badge on map */}
            <div style={{
              position: "absolute", top: 16, left: 16, zIndex: 20,
              background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
              border: `1px solid ${statusConfig?.color || C.green}30`,
              borderRadius: 14, padding: "10px 16px",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: statusConfig?.color || C.green,
                boxShadow: `0 0 8px ${statusConfig?.color || C.green}80`,
                animation: delivery.status !== "delivered" ? "pulse 2s ease-in-out infinite" : "none",
              }} />
              <span style={{ color: statusConfig?.color || C.green, fontWeight: 700, fontSize: 13 }}>
                {statusConfig?.label || delivery.status}
              </span>
              <span style={{
                background: "#f3f4f6", borderRadius: 8,
                padding: "3px 10px", fontSize: 11, fontWeight: 600, color: C.text2,
                fontFamily: "'Azeret Mono',monospace",
              }}>
                #{String(delivery.orderId || delivery._id || "").slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchDelivery}
              style={{
                position: "absolute", top: 16, right: 16, zIndex: 20,
                width: 40, height: 40, borderRadius: 12,
                background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
                border: `1px solid ${C.border}`,
                color: C.text2, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <FaRedo style={{ width: 14, height: 14 }} />
            </button>

            <ActiveDeliveryMap
              activeDelivery={delivery}
              driverLocation={mapDriverLoc}
              onUpdateStatus={updateStatus}
              isUpdating={isUpdating}
            />
          </div>

          {/* Info panel */}
          <div className="delivery-info-panel">
            {/* Customer info card */}
            <div style={{
              background: C.card2, borderRadius: 16, padding: 16, marginBottom: 14,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <FaUser style={{ width: 16, height: 16, color: C.white }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text3, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Customer
                  </p>
                  <p style={{ color: C.text1, fontWeight: 700, fontSize: 14 }}>
                    {delivery.customerName || "Customer"}
                  </p>
                </div>
                {delivery.customerPhone && (
                  <a href={`tel:${delivery.customerPhone}`} style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none",
                  }}>
                    <FaPhone style={{ width: 14, height: 14, color: "#10b981" }} />
                  </a>
                )}
              </div>

              {/* Delivery address */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: "rgba(59,130,246,0.04)", borderRadius: 12, padding: "12px",
                border: "1px solid rgba(59,130,246,0.1)",
              }}>
                <FaMapMarkerAlt style={{ width: 14, height: 14, color: C.blue, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ color: C.text3, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                    Drop-off Location
                  </p>
                  <p style={{ color: C.text1, fontSize: 13, lineHeight: 1.5 }}>
                    {delivery.deliveryAddress?.address || delivery.deliveryAddress?.address1 ||
                     (delivery.deliveryAddress?.lat ? `${Number(delivery.deliveryAddress.lat).toFixed(4)}, ${Number(delivery.deliveryAddress.lng).toFixed(4)}` : "No address")}
                  </p>
                </div>
              </div>
            </div>

            {/* Status progression */}
            <div style={{
              background: C.card2, borderRadius: 16, padding: 16, marginBottom: 14,
              border: `1px solid ${C.border}`,
            }}>
              <p style={{ color: C.text3, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Delivery Progress
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg], i, arr) => {
                  const statusOrder = ["assigned", "picked_up", "in_transit", "delivered"];
                  const currentIdx = statusOrder.indexOf(delivery.status);
                  const stepIdx = statusOrder.indexOf(key);
                  const isDone = stepIdx <= currentIdx;
                  const isCurrent = key === delivery.status;

                  return (
                    <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: isDone ? `${cfg.color}15` : "#f9fafb",
                          border: `2px solid ${isDone ? cfg.color : C.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.3s",
                        }}>
                          <cfg.Icon style={{
                            width: 12, height: 12,
                            color: isDone ? cfg.color : C.text3,
                          }} />
                        </div>
                        {i < arr.length - 1 && (
                          <div style={{
                            width: 2, height: 24,
                            background: isDone && stepIdx < currentIdx ? cfg.color : C.border,
                            transition: "background 0.3s",
                          }} />
                        )}
                      </div>
                      <div style={{ paddingTop: 4, paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                        <p style={{
                          fontSize: 13, fontWeight: isCurrent ? 700 : 500,
                          color: isDone ? C.text1 : C.text3,
                        }}>
                          {cfg.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action button */}
            {statusConfig?.next && (
              <button
                onClick={() => updateStatus(delivery._id, statusConfig.next)}
                disabled={isUpdating}
                style={{
                  width: "100%", padding: "16px", borderRadius: 14, border: "none",
                  background: isUpdating
                    ? "#f3f4f6"
                    : `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
                  color: isUpdating ? C.text3 : "#fff",
                  fontWeight: 800, fontSize: 15,
                  cursor: isUpdating ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: isUpdating ? "none" : "0 6px 24px rgba(13,124,59,0.25)",
                  transition: "all 0.2s", marginBottom: 8,
                }}
              >
                {isUpdating ? (
                  <>
                    <div style={{ width: 18, height: 18, border: "2px solid rgba(156,163,175,0.3)", borderTop: "2px solid #6b7280", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
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
              <div style={{
                background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
                borderRadius: 14, padding: "16px", display: "flex", alignItems: "center", gap: 12,
              }}>
                <FaCheckCircle style={{ color: "#10b981", width: 22, height: 22, flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#10b981", fontWeight: 700, fontSize: 15 }}>Delivery Complete!</p>
                  <p style={{ color: C.text3, fontSize: 12, marginTop: 2 }}>Great job! Returning to home...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
