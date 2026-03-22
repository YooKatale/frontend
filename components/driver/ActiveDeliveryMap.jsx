"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const DeliveryMap = dynamic(
  () => import("@components/map/DeliveryMap"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} /> }
);

const STATUS_CONFIG = {
  assigned:   { label: "Assigned",    color: "#3b82f6", next: "picked_up",  nextLabel: "Mark Picked Up"  },
  picked_up:  { label: "Picked Up",   color: "#f59e0b", next: "in_transit", nextLabel: "Start Delivery"  },
  in_transit: { label: "In Transit",  color: "#8b5cf6", next: "delivered",  nextLabel: "Mark Delivered"  },
  delivered:  { label: "Delivered",   color: "#10b981", next: null,         nextLabel: null              },
};

const ico = (w) => ({ width: w, height: w, flexShrink: 0 });
const font = { fontFamily: "'Sora','DM Sans',system-ui,sans-serif" };

/**
 * ActiveDeliveryMap — driver navigation screen.
 *
 * Shows a full-screen map with route, floating turn instruction bar at top,
 * and status action bar at bottom.
 *
 * Props:
 *   activeDelivery  object     – the active delivery doc (with orderId populated)
 *   driverLocation  { lat, lng, heading }
 *   onUpdateStatus  (deliveryId, newStatus) => void
 *   isUpdating      boolean
 */
export default function ActiveDeliveryMap({
  activeDelivery,
  driverLocation,
  onUpdateStatus,
  isUpdating,
}) {
  const [nextStep, setNextStep] = useState(null);

  const order = activeDelivery?.orderId;
  const deliveryStatus = activeDelivery?.status;
  const statusConfig = STATUS_CONFIG[deliveryStatus] || {};
  const statusColor = statusConfig.color || "#185f2d";

  const deliveryAddress = order?.deliveryAddress;
  const customerLocation =
    deliveryAddress?.lat && deliveryAddress?.lng
      ? { lat: deliveryAddress.lat, lng: deliveryAddress.lng }
      : null;

  const vendor = order?.vendorId;
  const vendorLocation =
    vendor?.lat && vendor?.lng
      ? { lat: vendor.lat, lng: vendor.lng }
      : null;

  /* Only show vendor marker when driver hasn't picked up yet */
  const showVendor = deliveryStatus === "assigned";

  const handleDirections = (result) => {
    const leg = result?.routes?.[0]?.legs?.[0];
    const step = leg?.steps?.[0];
    if (!step) return;
    setNextStep({
      instruction: step.instructions?.replace(/<[^>]*>/g, "").trim() || "",
      distance: step.distance?.text || "",
    });
  };

  if (!activeDelivery) return null;

  const addrText =
    typeof deliveryAddress === "object"
      ? deliveryAddress.address || deliveryAddress.address1 || "See map"
      : deliveryAddress || "See map";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 18, overflow: "hidden", ...font }}>

      {/* Full-screen map */}
      <DeliveryMap
        driverLocation={driverLocation}
        customerLocation={customerLocation}
        vendorLocation={showVendor ? vendorLocation : null}
        customerName={order?.customerName}
        height="100%"
        showCenterFab
        showETA
        onDirectionsReady={handleDirections}
      />

      {/* ── Floating turn instruction bar ── */}
      {nextStep && (
        <div style={{
          position: "absolute", top: 12, left: 12, right: 12, zIndex: 20,
          background: "rgba(13,13,13,0.94)", borderRadius: 16,
          padding: "12px 16px", backdropFilter: "blur(14px)",
          border: `1px solid ${statusColor}28`,
          display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `${statusColor}18`, border: `1px solid ${statusColor}38`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={statusColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={ico(17)}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <p style={{ color: "#f3f4f6", fontSize: 13, fontWeight: 600, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 2 }}>
              {nextStep.instruction}
            </p>
            <p style={{ color: "#6b7280", fontSize: 11 }}>{nextStep.distance}</p>
          </div>
        </div>
      )}

      {/* ── Bottom action bar ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
        background: "rgba(13,13,13,0.96)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        padding: "14px 16px 20px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>

        {/* Customer info strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <p style={{ color: "#f3f4f6", fontSize: 14, fontWeight: 700, marginBottom: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {order?.customerName || "Customer"}
            </p>
            <p style={{ color: "#9ca3af", fontSize: 11, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {addrText}
            </p>
          </div>
          {order?.customerPhone && (
            <a
              href={`tel:${order.customerPhone}`}
              style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={ico(16)}>
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          )}
        </div>

        {/* Status update button */}
        {statusConfig.next && (
          <button
            onClick={() => onUpdateStatus(activeDelivery._id, statusConfig.next)}
            disabled={isUpdating}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, #185f2d, #1a7a36)`,
              border: "none", borderRadius: 14, padding: "14px 0",
              color: "#ffffff", fontWeight: 700, fontSize: 14,
              cursor: isUpdating ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: isUpdating ? 0.6 : 1, transition: "all 0.2s",
              boxShadow: `0 4px 20px rgba(24,95,45,0.4)`,
              fontFamily: "inherit",
            }}
          >
            {isUpdating ? (
              <>
                <svg style={{ ...ico(16), animation: "adm-spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={ico(16)}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {statusConfig.nextLabel}
              </>
            )}
          </button>
        )}

        {deliveryStatus === "delivered" && (
          <div style={{ textAlign: "center", padding: "8px 0", color: "#10b981", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={ico(18)}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Delivery Complete!
          </div>
        )}
      </div>

      <style>{`@keyframes adm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
