"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaMotorcycle, FaMoneyBillWave, FaUser } from "react-icons/fa";

const PRIMARY = "#185f2d";
const C = {
  bg:     "#111111",
  border: "rgba(255,255,255,0.07)",
  text3:  "#6b7280",
};

const TABS = [
  { key: "home",     label: "Home",     Icon: FaHome,           path: "/driver/dashboard" },
  { key: "delivery", label: "Delivery", Icon: FaMotorcycle,     path: "/driver/dashboard" },
  { key: "earnings", label: "Earnings", Icon: FaMoneyBillWave,  path: "/driver/earnings"  },
  { key: "profile",  label: "Profile",  Icon: FaUser,           path: "/driver/profile"   },
];

export default function DriverBottomNav({ hasActiveDelivery = false }) {
  const pathname  = usePathname();
  const router    = useRouter();

  const isActive = (tab) => {
    if (tab.key === "home")     return pathname === "/driver/dashboard" && !hasActiveDelivery;
    if (tab.key === "delivery") return pathname === "/driver/dashboard" && hasActiveDelivery;
    return pathname === tab.path;
  };

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      display: "flex",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      fontFamily: "'Sora','DM Sans',system-ui,sans-serif",
    }}>
      <style>{`@keyframes dbn-pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>

      {TABS.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "10px 0 8px", gap: 4,
              background: "none", border: "none",
              cursor: "pointer",
              color: active ? PRIMARY : C.text3,
              position: "relative",
              transition: "color 0.2s",
              fontFamily: "inherit",
            }}
          >
            {/* Active top indicator */}
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "25%", right: "25%",
                height: 2, borderRadius: "0 0 4px 4px",
                background: PRIMARY,
                boxShadow: `0 0 8px ${PRIMARY}60`,
              }} />
            )}

            {/* Icon + delivery badge */}
            <div style={{ position: "relative" }}>
              <tab.Icon style={{ width: 22, height: 22 }} />
              {tab.key === "delivery" && hasActiveDelivery && (
                <span style={{
                  position: "absolute", top: -3, right: -5,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 0 2px #111111",
                  animation: "dbn-pulse 2s ease-in-out infinite",
                }} />
              )}
            </div>

            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: "0.02em" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
