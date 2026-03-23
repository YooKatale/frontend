"use client";

import { usePathname, useRouter } from "next/navigation";
import { I } from "./DriverUI";

const TABS = [
  { key: "home",     label: "Home",     Ic: I.Home,   path: "/driver/dashboard" },
  { key: "delivery", label: "Delivery", Ic: I.Nav,    path: "/driver/delivery"  },
  { key: "earnings", label: "Earnings", Ic: I.Dollar, path: "/driver/earnings"  },
  { key: "profile",  label: "Profile",  Ic: I.User,   path: "/driver/profile"   },
];

export default function DriverBottomNav({ hasActiveDelivery = false }) {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <nav className="yBnav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#fff", borderTop: "1px solid #e5e7eb",
      zIndex: 100, display: "flex",
      padding: "4px 0 env(safe-area-inset-bottom, 6px)",
      fontFamily: "'Bricolage Grotesque','Outfit','DM Sans',sans-serif",
    }}>
      {TABS.map((tab) => {
        const active = pathname === tab.path;
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 1,
              background: "none", border: "none",
              cursor: "pointer", padding: "3px 0",
              position: "relative",
            }}
          >
            {active && (
              <div style={{
                position: "absolute", top: 0, width: 16, height: 2,
                borderRadius: 1, background: "#0d7c3b",
              }} />
            )}
            <div style={{ position: "relative" }}>
              <tab.Ic s={18} c={active ? "#0d7c3b" : "#9ca3af"} />
              {tab.key === "delivery" && hasActiveDelivery && (
                <div style={{
                  position: "absolute", top: -1, right: -1, width: 5, height: 5,
                  borderRadius: 3, background: "#0d7c3b", border: "1px solid #fff",
                }} />
              )}
            </div>
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? "#0d7c3b" : "#9ca3af" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
