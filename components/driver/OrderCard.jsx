"use client";

import { useState, useEffect, useRef } from "react";

const ACCEPT_COUNTDOWN = 60;

const font = { fontFamily: "'Sora','DM Sans',system-ui,sans-serif" };

/* ── Circular countdown ring ─────────────────────────────── */
function CountdownRing({ seconds, total = ACCEPT_COUNTDOWN }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = circ * (seconds / total);
  const color = seconds > 20 ? "#10b981" : seconds > 10 ? "#F5A623" : "#ef4444";

  return (
    <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
      <svg viewBox="0 0 44 44" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, color,
      }}>
        {seconds}
      </div>
    </div>
  );
}

/* ── Static map thumbnail via Google Static Maps API ─────── */
function StaticMapThumb({ deliveryAddress, vendorLocation }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !deliveryAddress?.lat) return null;

  const { lat, lng } = deliveryAddress;
  let markers = `markers=color:red%7C${lat},${lng}`;
  if (vendorLocation?.lat) {
    markers += `&markers=color:orange%7C${vendorLocation.lat},${vendorLocation.lng}`;
  }

  const src = [
    `https://maps.googleapis.com/maps/api/staticmap`,
    `?center=${lat},${lng}&zoom=13&size=800x220&scale=2`,
    `&maptype=roadmap`,
    `&${markers}`,
    `&style=feature:all|element:labels.icon|visibility:off`,
    `&style=feature:poi|visibility:off`,
    `&key=${apiKey}`,
  ].join("");

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
      <img
        src={src}
        alt="Delivery area"
        style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
        loading="lazy"
      />
      {/* gradient overlay */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 50,
        background: "linear-gradient(to bottom, transparent, rgba(17,17,17,0.92))",
      }} />
    </div>
  );
}

/**
 * DriverOrderCard — driver-facing available-order card.
 *
 * Props:
 *   order        { _id, deliveryAddress, distanceToPickup, estimatedMinutes,
 *                  estimatedEarning, total, customerName, status, vendorId }
 *   onAccept     (orderId) => void
 *   isAccepting  boolean
 */
export default function DriverOrderCard({ order, onAccept, isAccepting }) {
  const [countdown, setCountdown] = useState(ACCEPT_COUNTDOWN);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef(null);

  /* Reset + start countdown each time order changes */
  useEffect(() => {
    setCountdown(ACCEPT_COUNTDOWN);
    setExpired(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) { clearInterval(timerRef.current); setExpired(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [order._id]);

  const addr = order.deliveryAddress;
  const vendorLoc = order.vendorId?.lat
    ? { lat: order.vendorId.lat, lng: order.vendorId.lng }
    : null;
  const deliveryLoc = addr?.lat ? { lat: addr.lat, lng: addr.lng } : null;

  const addrText =
    typeof addr === "object"
      ? addr.address || addr.address1 || null
      : addr || null;

  const disabled = expired || !!isAccepting;

  return (
    <div style={{
      background: "#111111",
      border: `1px solid ${expired ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, overflow: "hidden",
      opacity: expired ? 0.55 : 1,
      transition: "opacity 0.3s, border-color 0.3s",
      ...font,
    }}>

      {/* Static map thumbnail */}
      <StaticMapThumb deliveryAddress={deliveryLoc} vendorLocation={vendorLoc} />

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280" }}>
            #{String(order._id).slice(-6).toUpperCase()}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999,
            background: order.status === "ready" ? "rgba(16,185,129,0.12)" : "rgba(59,130,246,0.12)",
            color: order.status === "ready" ? "#10b981" : "#3b82f6",
            border: `1px solid ${order.status === "ready" ? "rgba(16,185,129,0.3)" : "rgba(59,130,246,0.3)"}`,
          }}>
            {order.status}
          </span>
        </div>

        {/* Distance / ETA / Earning stats row */}
        <div style={{ display: "flex", gap: 8 }}>
          {order.distanceToPickup != null && (
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "9px 10px", textAlign: "center" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#f3f4f6", lineHeight: 1 }}>
                {Number(order.distanceToPickup).toFixed(1)}
              </p>
              <p style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>km pickup</p>
            </div>
          )}
          {order.estimatedMinutes != null && (
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "9px 10px", textAlign: "center" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#f3f4f6", lineHeight: 1 }}>
                {order.estimatedMinutes}
              </p>
              <p style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>min est.</p>
            </div>
          )}
          {order.estimatedEarning != null && (
            <div style={{ flex: 1, background: "rgba(245,166,35,0.08)", borderRadius: 10, padding: "9px 10px", textAlign: "center", border: "1px solid rgba(245,166,35,0.15)" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#F5A623", lineHeight: 1 }}>
                {Math.round(order.estimatedEarning / 1000)}K
              </p>
              <p style={{ fontSize: 10, color: "#9a7c30", marginTop: 3 }}>UGX earn</p>
            </div>
          )}
        </div>

        {/* Customer name */}
        {order.customerName && (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, flexShrink: 0 }}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{order.customerName}</span>
          </div>
        )}

        {/* Delivery address */}
        {addrText && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, marginTop: 1, flexShrink: 0 }}>
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{addrText}</span>
          </div>
        )}

        {/* Order total */}
        {order.total && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#F5A623" }}>
              UGX {Number(order.total).toLocaleString()}
            </span>
            <span style={{ fontSize: 11, color: "#6b7280" }}>order value</span>
          </div>
        )}

        {/* Accept button + countdown ring */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => !disabled && onAccept(order._id)}
            disabled={disabled}
            style={{
              flex: 1,
              background: expired
                ? "rgba(239,68,68,0.08)"
                : `linear-gradient(135deg, #185f2d, #1a7a36)`,
              border: `1px solid ${expired ? "rgba(239,68,68,0.3)" : "transparent"}`,
              borderRadius: 12, padding: "12px 0",
              color: expired ? "#ef4444" : "#ffffff",
              fontSize: 13, fontWeight: 700,
              cursor: disabled ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              opacity: isAccepting ? 0.6 : 1, transition: "all 0.2s",
              boxShadow: expired || isAccepting ? "none" : "0 4px 16px rgba(24,95,45,0.3)",
              fontFamily: "inherit",
            }}
          >
            {isAccepting ? (
              <>
                <svg style={{ width: 14, height: 14, animation: "doc-spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Accepting...
              </>
            ) : expired ? (
              "Order Expired"
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Accept Order
              </>
            )}
          </button>

          {!expired && <CountdownRing seconds={countdown} />}
        </div>
      </div>

      <style>{`@keyframes doc-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
