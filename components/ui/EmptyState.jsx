"use client";

import {
  FaShoppingBag, FaUserAlt, FaBoxOpen, FaBell, FaStore, FaSearch,
} from "react-icons/fa";

/**
 * Reusable EmptyState component.
 *
 * Props:
 *   variant   {"orders"|"products"|"drivers"|"notifications"|"vendors"|"search"|"custom"}
 *   title     {string}   — override heading
 *   message   {string}   — override subtext
 *   action    {string}   — button label (optional)
 *   onAction  {fn}       — button click handler (optional)
 *   dark      {boolean}  — dark mode (default: false)
 */

const PRESETS = {
  orders: {
    Icon: FaShoppingBag,
    title: "No orders yet",
    message: "Your orders will appear here once you place one.",
    color: "#185f2d",
  },
  products: {
    Icon: FaBoxOpen,
    title: "No products found",
    message: "There are no products to display right now.",
    color: "#0891b2",
  },
  drivers: {
    Icon: FaUserAlt,
    title: "No drivers available",
    message: "There are currently no drivers assigned to this area.",
    color: "#d97706",
  },
  notifications: {
    Icon: FaBell,
    title: "No notifications",
    message: "You're all caught up! No new notifications.",
    color: "#8b5cf6",
  },
  vendors: {
    Icon: FaStore,
    title: "No vendors found",
    message: "No vendor stores are available in this area.",
    color: "#185f2d",
  },
  search: {
    Icon: FaSearch,
    title: "No results found",
    message: "Try adjusting your search or filters.",
    color: "#6b7280",
  },
  custom: {
    Icon: FaBoxOpen,
    title: "Nothing here yet",
    message: "Check back later.",
    color: "#9ca3af",
  },
};

export default function EmptyState({ variant = "custom", title, message, action, onAction, dark = false, Icon: CustomIcon, color: customColor }) {
  const preset = PRESETS[variant] || PRESETS.custom;
  const Icon = CustomIcon || preset.Icon;
  const color = customColor || preset.color;
  const displayTitle = title || preset.title;
  const displayMessage = message || preset.message;

  const text1 = dark ? "#f3f4f6" : "#111827";
  const text2 = dark ? "#9ca3af" : "#6b7280";
  const bg    = dark ? "#111111" : "#ffffff";
  const borderColor = dark ? "rgba(255,255,255,0.07)" : "#e5e7eb";

  return (
    <div style={{
      background: bg, borderRadius: 20, border: `1px solid ${borderColor}`,
      padding: "48px 24px", textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: color + "15", display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 4,
      }}>
        <Icon size={28} color={color} />
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: text1, margin: 0 }}>{displayTitle}</h3>
      <p style={{ fontSize: "0.875rem", color: text2, margin: 0, maxWidth: 280 }}>{displayMessage}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: 8, padding: "10px 22px", borderRadius: 10, border: "none",
            background: color, color: "#fff", fontWeight: 700, fontSize: "0.875rem",
            cursor: "pointer", transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
