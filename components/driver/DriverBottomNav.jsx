"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaMotorcycle, FaMoneyBillWave, FaUser } from "react-icons/fa";

const C = {
  bg:     "#0D0D0D",
  card:   "#111111",
  border: "rgba(255,255,255,0.07)",
  green:  "#185f2d",
  gold:   "#F5A623",
  white:  "#ffffff",
  text3:  "#6b7280",
};

const TABS = [
  { key: "home",     label: "Home",     Icon: FaHome,           path: "/driver/dashboard" },
  { key: "delivery", label: "Delivery", Icon: FaMotorcycle,     path: "/driver/delivery"  },
  { key: "earnings", label: "Earnings", Icon: FaMoneyBillWave,  path: "/driver/earnings"  },
  { key: "profile",  label: "Profile",  Icon: FaUser,           path: "/driver/profile"   },
];

export default function DriverBottomNav({ hasActiveDelivery = false }) {
  const pathname = usePathname();
  const router   = useRouter();
  const isActive = (tab) => pathname === tab.path;

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(13,13,13,0.95)", backdropFilter: "blur(16px)",
      borderTop: `1px solid ${C.border}`,
      display: "flex",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      fontFamily: "'Sora','DM Sans',system-ui,sans-serif",
    }}>
      <style>{`
        @keyframes dbn-pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes dbn-glow { 0%,100%{box-shadow:0 0 4px rgba(245,166,35,0.3);} 50%{box-shadow:0 0 12px rgba(245,166,35,0.6);} }
      `}</style>

      {TABS.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "10px 0 8px", gap: 3,
              background: "none", border: "none",
              cursor: "pointer",
              color: active ? C.gold : C.text3,
              position: "relative",
              transition: "color 0.2s",
              fontFamily: "inherit",
            }}
          >
            {/* Active indicator */}
            {active && (
              <div style={{
                position: "absolute", top: -1, left: "20%", right: "20%",
                height: 3, borderRadius: "0 0 6px 6px",
                background: `linear-gradient(90deg, ${C.green}, ${C.gold})`,
                boxShadow: `0 2px 8px ${C.gold}50`,
              }} />
            )}

            {/* Icon */}
            <div style={{ position: "relative" }}>
              <tab.Icon style={{
                width: 20, height: 20,
                transition: "transform 0.2s",
                transform: active ? "scale(1.1)" : "scale(1)",
              }} />
              {tab.key === "delivery" && hasActiveDelivery && (
                <span style={{
                  position: "absolute", top: -4, right: -6,
                  width: 9, height: 9, borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 0 2px #0D0D0D",
                  animation: "dbn-pulse 2s ease-in-out infinite",
                }} />
              )}
            </div>

            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
