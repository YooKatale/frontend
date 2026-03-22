"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaHome, FaMotorcycle, FaMoneyBillWave, FaUser,
  FaSignOutAlt, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";

const C = {
  sidebar: "#111111",
  border:  "rgba(255,255,255,0.07)",
  green:   "#0d7c3b",
  greenLt: "#10a34d",
  amber:   "#d97706",
  amberDim:"rgba(217,119,6,0.12)",
  amberBrd:"rgba(217,119,6,0.25)",
  white:   "#ffffff",
  text1:   "#f3f4f6",
  text2:   "#9ca3af",
  text3:   "#6b7280",
};

const TABS = [
  { key: "home",     label: "Home",     Icon: FaHome,           path: "/driver/dashboard" },
  { key: "delivery", label: "Delivery", Icon: FaMotorcycle,     path: "/driver/delivery"  },
  { key: "earnings", label: "Earnings", Icon: FaMoneyBillWave,  path: "/driver/earnings"  },
  { key: "profile",  label: "Profile",  Icon: FaUser,           path: "/driver/profile"   },
];

export default function DriverSidebar({ hasActiveDelivery = false, driverName = "", driverAvatar = "" }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (tab) => pathname === tab.path;

  const logout = () => {
    try { localStorage.removeItem("yookatale-driver"); } catch {}
    router.replace("/driver/login");
  };

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        minHeight: "100vh",
        background: C.sidebar,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        fontFamily: "'Bricolage Grotesque','Sora','DM Sans',system-ui,sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Logo area */}
      <div style={{
        padding: collapsed ? "20px 0" : "20px 16px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        gap: 10,
        minHeight: 68,
      }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <FaMotorcycle style={{ width: 18, height: 18, color: C.white }} />
            </div>
            <div>
              <p style={{ color: C.amber, fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>Yookatale</p>
              <p style={{ color: C.text3, fontSize: 10, fontWeight: 500 }}>Driver Portal</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FaMotorcycle style={{ width: 18, height: 18, color: C.white }} />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${C.border}`,
            color: C.text3, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            position: collapsed ? "absolute" : "relative",
            right: collapsed ? -14 : "auto",
            top: collapsed ? 24 : "auto",
            zIndex: 51,
          }}
        >
          {collapsed ? <FaChevronRight style={{ width: 10, height: 10 }} /> : <FaChevronLeft style={{ width: 10, height: 10 }} />}
        </button>
      </div>

      {/* Driver info */}
      {!collapsed && driverName && (
        <div style={{
          padding: "16px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {driverAvatar ? (
            <img
              src={driverAvatar}
              alt={driverName}
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.amberBrd}` }}
            />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.green}, ${C.amber})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 16, color: C.white,
              border: `2px solid ${C.amberBrd}`,
            }}>
              {(driverName || "D")[0].toUpperCase()}
            </div>
          )}
          <div style={{ overflow: "hidden" }}>
            <p style={{ color: C.text1, fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{driverName}</p>
            <p style={{ color: C.text3, fontSize: 11 }}>Driver</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: collapsed ? "12px 8px" : "12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {TABS.map((tab) => {
          const active = isActive(tab);
          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.path)}
              title={collapsed ? tab.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "12px 0" : "11px 14px",
                borderRadius: 12,
                background: active
                  ? `linear-gradient(135deg, ${C.green}, ${C.greenLt})`
                  : "transparent",
                border: "none",
                cursor: "pointer",
                color: active ? C.white : C.text2,
                fontWeight: active ? 700 : 500,
                fontSize: 13,
                fontFamily: "inherit",
                transition: "all 0.2s",
                position: "relative",
                justifyContent: collapsed ? "center" : "flex-start",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <tab.Icon style={{ width: 18, height: 18 }} />
                {tab.key === "delivery" && hasActiveDelivery && (
                  <span style={{
                    position: "absolute", top: -3, right: -5,
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: `0 0 0 2px ${active ? C.green : C.sidebar}`,
                    animation: "dbn-pulse 2s ease-in-out infinite",
                  }} />
                )}
              </div>
              {!collapsed && <span>{tab.label}</span>}
              {active && !collapsed && (
                <div style={{
                  marginLeft: "auto",
                  width: 6, height: 6, borderRadius: "50%",
                  background: C.amber,
                  boxShadow: `0 0 8px ${C.amber}80`,
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: collapsed ? "12px 8px" : "12px 16px", borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={logout}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "10px 0" : "10px 14px",
            borderRadius: 10, background: "none", border: "none",
            cursor: "pointer", color: "#ef4444",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            width: "100%",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <FaSignOutAlt style={{ width: 16, height: 16, flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      <style>{`@keyframes dbn-pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>
    </aside>
  );
}
