"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { I } from "./DriverUI";

const TABS = [
  { key: "home",     label: "Home",     Ic: I.Home,   path: "/driver/dashboard" },
  { key: "delivery", label: "Delivery", Ic: I.Nav,    path: "/driver/delivery"  },
  { key: "earnings", label: "Earnings", Ic: I.Dollar, path: "/driver/earnings"  },
  { key: "profile",  label: "Profile",  Ic: I.User,   path: "/driver/profile"   },
];

export default function DriverSidebar({ hasActiveDelivery = false, driverName = "", driverAvatar = "", isOnline = false, onToggleOnline }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sideO, setSideO] = useState(true);

  const initials = driverName
    ? driverName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "D";

  const logout = () => {
    try { localStorage.removeItem("yookatale-driver"); } catch {}
    router.replace("/driver/login");
  };

  return (
    <aside className="ySide" style={{
      width: sideO ? 220 : 60,
      transition: "width 0.2s",
      background: "#111",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.05)",
      position: "fixed",
      left: 0, top: 0, bottom: 0,
      zIndex: 50,
      overflow: "hidden",
      fontFamily: "'Bricolage Grotesque','Outfit','DM Sans',sans-serif",
    }}>
      {/* Logo */}
      <div style={{
        padding: sideO ? "14px 16px" : "14px 10px",
        display: "flex", alignItems: "center", gap: 8,
        borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: "#0d7c3b",
          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Y</span>
        </div>
        {sideO && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1 }}>Yookatale</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: 1.5 }}>Driver</div>
          </div>
        )}
        <button onClick={() => setSideO(!sideO)} style={{
          marginLeft: "auto", background: "none", border: "none",
          cursor: "pointer", padding: 2, opacity: 0.4,
        }}>
          <I.Menu s={14} c="#fff" />
        </button>
      </div>

      {/* Driver info + online toggle */}
      {sideO && (
        <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {driverAvatar ? (
              <img src={driverAvatar} alt={driverName} style={{
                width: 34, height: 34, borderRadius: 17, objectFit: "cover", flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 34, height: 34, borderRadius: 17,
                background: "linear-gradient(135deg,#0d7c3b,#d97706)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>{initials}</div>
            )}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{driverName || "Driver"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <I.Star s={9} c="#d97706" f="#d97706" />
              </div>
            </div>
          </div>
          {onToggleOnline && (
            <button onClick={onToggleOnline} style={{
              width: "100%", padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
              background: isOnline ? "rgba(13,124,59,0.12)" : "rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: isOnline ? "#22c55e" : "#6b7280" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: isOnline ? "#22c55e" : "#6b7280", flex: 1, textAlign: "left" }}>
                {isOnline ? "Online" : "Offline"}
              </span>
              <div style={{
                width: 28, height: 16, borderRadius: 8, position: "relative",
                background: isOnline ? "#0d7c3b" : "rgba(255,255,255,0.08)", transition: "0.2s",
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: 6, background: "#fff",
                  position: "absolute", top: 2, left: isOnline ? 14 : 2, transition: "0.2s",
                }} />
              </div>
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "6px", display: "flex", flexDirection: "column", gap: 1 }}>
        {TABS.map((tab) => {
          const active = pathname === tab.path;
          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.path)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: sideO ? "8px 10px" : "8px 0",
                justifyContent: sideO ? "flex-start" : "center",
                borderRadius: 6, border: "none", cursor: "pointer",
                position: "relative",
                background: active ? "rgba(13,124,59,0.1)" : "transparent",
              }}
            >
              <div style={{ position: "relative" }}>
                <tab.Ic s={17} c={active ? "#0d7c3b" : "#6b7280"} />
                {tab.key === "delivery" && hasActiveDelivery && (
                  <div style={{
                    position: "absolute", top: -1, right: -1, width: 5, height: 5,
                    borderRadius: 3, background: "#0d7c3b", border: "1px solid #111",
                  }} />
                )}
              </div>
              {sideO && <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "#fff" : "#9ca3af" }}>{tab.label}</span>}
              {active && (
                <div style={{
                  position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: 2.5, height: 16, borderRadius: 2, background: "#0d7c3b",
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "8px 6px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: sideO ? "8px 10px" : "8px 0",
          justifyContent: sideO ? "flex-start" : "center",
          borderRadius: 6, border: "none", cursor: "pointer",
          background: "transparent", width: "100%",
        }}>
          <I.Logout s={17} c="#dc2626" />
          {sideO && <span style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
