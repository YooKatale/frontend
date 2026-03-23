"use client";

import { useState, useEffect, useRef } from "react";
import { I, MapBg, PinMarker, CD } from "./DriverUI";

const ACCEPT_COUNTDOWN = 55;

export default function DriverOrderCard({ order, onAccept, onDecline, isAccepting }) {
  const [countdown, setCountdown] = useState(ACCEPT_COUNTDOWN);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef(null);

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
  const addrText = typeof addr === "object"
    ? addr?.address || addr?.address1 || null
    : addr || null;

  const vendorName = order.vendorId?.businessName || order.vendorId?.name || "Restaurant";
  const payType = order.paymentMethod || order.paymentType || "Cash";

  const disabled = expired || !!isAccepting;

  return (
    <div style={{
      borderRadius: 12, overflow: "hidden", marginBottom: 10,
      background: "#fff", border: `1px solid ${expired ? "rgba(239,68,68,0.3)" : "#e5e7eb"}`,
      opacity: expired ? 0.55 : 1, transition: "opacity 0.3s",
    }}>
      {/* Map thumbnail with pins */}
      <MapBg style={{ height: 120, position: "relative" }} dim>
        <PinMarker color="#0d7c3b" icon={<I.Store s={13} c="#fff" />} label="Pickup"
          style={{ position: "absolute", left: "25%", top: "22%" }} />
        <svg style={{ position: "absolute", left: "30%", top: "38%", width: "40%", height: 18 }}>
          <line x1="0" y1="9" x2="100%" y2="9" stroke="#0d7c3b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />
        </svg>
        <PinMarker color="#d97706" icon={<I.Pin s={13} c="#fff" />} label="Drop-off"
          style={{ position: "absolute", right: "18%", top: "28%" }} />
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}>
          <span style={{
            background: "rgba(17,17,17,0.7)", backdropFilter: "blur(4px)",
            color: "#fff", fontSize: 9, fontWeight: 600,
            padding: "2px 7px", borderRadius: 4, fontFamily: "'Azeret Mono',monospace",
          }}>#{String(order._id).slice(-6).toUpperCase()}</span>
          <span style={{
            background: payType === "Cash" ? "#d97706" : "#0d7c3b",
            color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
          }}>{payType}</span>
        </div>
      </MapBg>

      {/* Order details */}
      <div style={{ padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 1 }}>
          <span style={{
            fontSize: 24, fontWeight: 800, color: "#111",
            letterSpacing: -0.5, fontFamily: "'Bricolage Grotesque',sans-serif",
          }}>
            UGX {(order.estimatedEarning || 0).toLocaleString()}
          </span>
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>
          Total {(order.total || 0).toLocaleString()} · {order.items?.length || order.itemCount || ""}
        </div>

        {/* Pickup → Drop-off route */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
            <div style={{ width: 7, height: 7, borderRadius: 4, background: "#0d7c3b" }} />
            <div style={{ width: 1.5, height: 22, background: "linear-gradient(#0d7c3b,#d97706)", margin: "2px 0" }} />
            <div style={{ width: 7, height: 7, borderRadius: 4, background: "#d97706" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Pickup</span>
                {order.distanceToPickup != null && (
                  <span style={{ fontSize: 9, color: "#9ca3af" }}>{Number(order.distanceToPickup).toFixed(1)}km · {order.estimatedMinutes || "?"}min</span>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {vendorName}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Drop-off</span>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {addrText || order.customerName || "Customer location"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, padding: "0 14px 12px", alignItems: "center" }}>
        {onDecline && (
          <button onClick={() => onDecline(order._id)} style={{
            padding: "10px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb",
            background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12,
            color: "#6b7280", fontFamily: "'Bricolage Grotesque',sans-serif",
          }}>Decline</button>
        )}
        <button
          onClick={() => !disabled && onAccept(order._id)}
          disabled={disabled}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 8, border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            background: expired ? "rgba(239,68,68,0.06)" : "#0d7c3b",
            color: expired ? "#ef4444" : "#fff",
            fontWeight: 700, fontSize: 13,
            fontFamily: "'Bricolage Grotesque',sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: isAccepting ? 0.6 : 1,
          }}
        >
          {isAccepting ? (
            <>
              <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Accepting...
            </>
          ) : expired ? (
            "Order Expired"
          ) : (
            <>Accept order <CD sec={countdown} mx={ACCEPT_COUNTDOWN} sz={32} /></>
          )}
        </button>
      </div>
    </div>
  );
}
