"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DriverBottomNav from "@components/driver/DriverBottomNav";
import DriverSidebar from "@components/driver/DriverSidebar";
import { DB_URL } from "@config/config";

const DRIVER_KEY   = "yookatale-driver";
const PUBLIC_PATHS = ["/driver/login"];

export default function DriverLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [ready, setReady]               = useState(false);
  const [hasActiveDelivery, setHasActive] = useState(false);
  const [driverInfo, setDriverInfo]     = useState({ name: "", avatar: "" });

  const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (isPublic) { setReady(true); return; }
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) { router.replace("/driver/login"); return; }
      const parsed = JSON.parse(stored);
      if (!parsed?.token || !parsed?.driver?._id) { router.replace("/driver/login"); return; }
      setReady(true);
      setDriverInfo({
        name: parsed.driver.fullName || parsed.driver.name || "",
        avatar: parsed.driver.profilePicture || parsed.driver.avatar || "",
      });
      fetch(`${DB_URL}/driver/dashboard/${parsed.driver._id}`, {
        headers: { Authorization: `Bearer ${parsed.token}` },
      })
        .then((r) => r.json())
        .then((d) => { if (d?.data?.activeDelivery) setHasActive(true); })
        .catch(() => {});
    } catch {
      router.replace("/driver/login");
    }
  }, [isPublic, pathname, router]);

  if (!ready) return <div style={{ minHeight: "100vh", background: "#f4f5f7" }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "'Bricolage Grotesque','Sora','DM Sans',system-ui,sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Azeret+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Desktop sidebar - hidden on mobile */}
      {!isPublic && (
        <div className="driver-sidebar-wrap">
          <DriverSidebar
            hasActiveDelivery={hasActiveDelivery}
            driverName={driverInfo.name}
            driverAvatar={driverInfo.avatar}
          />
        </div>
      )}

      {/* Main content */}
      <div className={!isPublic ? "driver-main-content" : ""}>
        {children}
      </div>

      {/* Mobile bottom nav - hidden on desktop */}
      {!isPublic && (
        <div className="driver-bottom-nav-wrap">
          <DriverBottomNav hasActiveDelivery={hasActiveDelivery} />
        </div>
      )}

      <style>{`
        .driver-sidebar-wrap { display: none; }
        .driver-bottom-nav-wrap { display: block; }
        .driver-main-content { padding-bottom: 80px; }

        @media (min-width: 1024px) {
          .driver-sidebar-wrap { display: block; }
          .driver-bottom-nav-wrap { display: none; }
          .driver-main-content { margin-left: 240px; padding-bottom: 0; }
        }
      `}</style>
    </div>
  );
}
