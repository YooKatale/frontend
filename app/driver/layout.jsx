"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DriverBottomNav from "@components/driver/DriverBottomNav";
import DriverSidebar from "@components/driver/DriverSidebar";
import { DB_URL } from "@config/config";
import { DRIVER_STYLES } from "@components/driver/DriverUI";

const DRIVER_KEY   = "yookatale-driver";
const PUBLIC_PATHS = ["/driver/login"];

export default function DriverLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [ready, setReady]               = useState(false);
  const [hasActiveDelivery, setHasActive] = useState(false);
  const [driverInfo, setDriverInfo]     = useState({ name: "", avatar: "" });
  const [isOnline, setIsOnline]         = useState(false);

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
        .then((d) => {
          if (d?.data?.activeDelivery) setHasActive(true);
          if (d?.data?.driver?.isAvailable != null) setIsOnline(d.data.driver.isAvailable);
        })
        .catch(() => {});
    } catch {
      router.replace("/driver/login");
    }
  }, [isPublic, pathname, router]);

  const handleToggleOnline = async () => {
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const res = await fetch(`${DB_URL}/driver/${parsed.driver._id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${parsed.token}` },
      });
      const data = await res.json();
      if (data?.status === "Success") {
        setIsOnline(data.data.isAvailable);
      }
    } catch {}
  };

  if (!ready) return <div style={{ minHeight: "100vh", background: "#f4f5f7" }} />;

  return (
    <div style={{ width: "100%", minHeight: "100vh", display: "flex", fontFamily: "'Bricolage Grotesque','Outfit','DM Sans',sans-serif", background: "#f4f5f7", color: "#111" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Azeret+Mono:wght@500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{DRIVER_STYLES}</style>
      <style>{`
        @media(max-width:767px){.ySide{display:none!important}.yBnav{display:flex!important}.yMain{padding-bottom:64px!important}}
        @media(min-width:768px){.ySide{display:flex!important}.yBnav{display:none!important}}
      `}</style>

      {/* Desktop sidebar */}
      {!isPublic && (
        <DriverSidebar
          hasActiveDelivery={hasActiveDelivery}
          driverName={driverInfo.name}
          driverAvatar={driverInfo.avatar}
          isOnline={isOnline}
          onToggleOnline={handleToggleOnline}
        />
      )}

      {/* Main content */}
      <main className={!isPublic ? "yMain" : ""} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      {!isPublic && (
        <DriverBottomNav hasActiveDelivery={hasActiveDelivery} />
      )}
    </div>
  );
}
