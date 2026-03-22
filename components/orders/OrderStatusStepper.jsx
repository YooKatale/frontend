"use client";

import {
  FaClipboardList, FaCheckCircle, FaUserClock, FaMotorcycle,
  FaBoxOpen, FaShippingFast, FaStar, FaMoneyBillWave,
} from "react-icons/fa";

/**
 * OrderStatusStepper — horizontal on desktop, vertical on mobile
 *
 * Props:
 *   currentStatus {string}  — current order status key
 *   trackingHistory {Array} — [{ status, timestamp, note }]
 *   vertical {boolean}      — force vertical layout (default: false = auto)
 *   dark {boolean}          — dark background mode
 */

const STEPS = [
  { key: "pending",    label: "Placed",        Icon: FaClipboardList },
  { key: "confirmed",  label: "Confirmed",     Icon: FaCheckCircle   },
  { key: "preparing",  label: "Preparing",     Icon: FaUserClock     },
  { key: "assigned",   label: "Driver",        Icon: FaMotorcycle    },
  { key: "picked_up",  label: "Picked Up",     Icon: FaBoxOpen       },
  { key: "in_transit", label: "On the Way",    Icon: FaShippingFast  },
  { key: "delivered",  label: "Delivered",     Icon: FaStar          },
];

// COD flow inserts an approval step after "pending"
const COD_STEPS = [
  { key: "pending",              label: "Placed",        Icon: FaClipboardList },
  { key: "pending_cod_approval", label: "COD Approval",  Icon: FaMoneyBillWave },
  { key: "confirmed",            label: "Confirmed",     Icon: FaCheckCircle   },
  { key: "preparing",            label: "Preparing",     Icon: FaUserClock     },
  { key: "assigned",             label: "Driver",        Icon: FaMotorcycle    },
  { key: "picked_up",            label: "Picked Up",     Icon: FaBoxOpen       },
  { key: "in_transit",           label: "On the Way",    Icon: FaShippingFast  },
  { key: "delivered",            label: "Delivered",     Icon: FaStar          },
];

const STATUS_ORDER = STEPS.map((s) => s.key);
const COD_STATUS_ORDER = COD_STEPS.map((s) => s.key);

function getStepState(stepKey, currentStatus, isCod = false) {
  const order = isCod ? COD_STATUS_ORDER : STATUS_ORDER;
  const currentIdx = order.indexOf(currentStatus);
  const stepIdx    = order.indexOf(stepKey);
  // Handle unmapped statuses: treat as pending at step 0
  if (currentIdx === -1) return stepIdx === 0 ? "active" : "pending";
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

function getTimestamp(stepKey, trackingHistory) {
  const entry = [...(trackingHistory || [])].reverse().find((h) => h.status === stepKey);
  if (!entry?.timestamp) return null;
  return new Date(entry.timestamp).toLocaleString("en-UG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function OrderStatusStepper({ currentStatus = "pending", trackingHistory = [], vertical = false, dark = false, paymentMethod }) {
  const isCancelled = currentStatus === "cancelled";
  const isCod = paymentMethod === "cash_on_delivery" || currentStatus === "pending_cod_approval"
    || (trackingHistory || []).some((h) => h.status === "pending_cod_approval");
  const steps = isCod ? COD_STEPS : STEPS;

  const text1 = dark ? "#f3f4f6" : "#111827";
  const text2 = dark ? "#9ca3af" : "#6b7280";
  const bg    = dark ? "#111111" : "#ffffff";
  const primary = "#185f2d";
  const completedColor = "#10b981";

  if (isCancelled) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12 }}>
        <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>Order Cancelled</span>
      </div>
    );
  }

  if (vertical) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((step, i) => {
          const state = getStepState(step.key, currentStatus, isCod);
          const ts    = getTimestamp(step.key, trackingHistory);
          const isLast = i === steps.length - 1;
          return (
            <div key={step.key} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {/* Icon + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: state === "completed" ? completedColor : state === "active" ? primary : (dark ? "#222" : "#f3f4f6"),
                  border: state === "active" ? `2px solid ${primary}` : "none",
                  flexShrink: 0,
                }}>
                  <step.Icon size={14} color={state === "pending" ? (dark ? "#4b5563" : "#9ca3af") : "#fff"} />
                </div>
                {!isLast && (
                  <div style={{ width: 2, flex: 1, minHeight: 24, background: state === "completed" ? completedColor : (dark ? "#222" : "#e5e7eb"), marginTop: 4 }} />
                )}
              </div>
              {/* Label */}
              <div style={{ paddingTop: 6, paddingBottom: isLast ? 0 : 20 }}>
                <div style={{ fontSize: 13, fontWeight: state === "active" ? 700 : 600, color: state === "pending" ? text2 : text1 }}>
                  {step.label}
                </div>
                {ts && <div style={{ fontSize: 11, color: text2, marginTop: 2 }}>{ts}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "flex-start", minWidth: 520, gap: 0 }}>
        {steps.map((step, i) => {
          const state = getStepState(step.key, currentStatus, isCod);
          const ts    = getTimestamp(step.key, trackingHistory);
          const isLast = i === steps.length - 1;
          return (
            <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* Connector line left */}
              {i > 0 && (
                <div style={{
                  position: "absolute", top: 15, right: "50%", width: "50%", height: 2,
                  background: state === "completed" || state === "active" ? completedColor : (dark ? "#222" : "#e5e7eb"),
                }} />
              )}
              {/* Connector line right */}
              {!isLast && (
                <div style={{
                  position: "absolute", top: 15, left: "50%", width: "50%", height: 2,
                  background: state === "completed" ? completedColor : (dark ? "#222" : "#e5e7eb"),
                }} />
              )}
              {/* Icon circle */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: state === "completed" ? completedColor : state === "active" ? primary : (dark ? "#1a1a1a" : "#f3f4f6"),
                border: state === "active" ? `2px solid ${primary}` : "none",
                position: "relative", zIndex: 1,
                boxShadow: state === "active" ? `0 0 0 4px ${primary}20` : "none",
              }}>
                <step.Icon size={13} color={state === "pending" ? (dark ? "#4b5563" : "#9ca3af") : "#fff"} />
              </div>
              {/* Label */}
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: state === "active" ? 700 : 600, color: state === "pending" ? text2 : text1, whiteSpace: "nowrap" }}>
                  {step.label}
                </div>
                {ts && <div style={{ fontSize: 10, color: text2, marginTop: 1 }}>{ts}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
