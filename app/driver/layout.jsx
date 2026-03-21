"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DriverBottomNav from "@components/driver/DriverBottomNav";
import { DB_URL } from "@config/config";

const DRIVER_KEY  = "yookatale-driver";
const PUBLIC_PATHS = ["/driver/login"];

export default function DriverLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [ready, setReady]                     = useState(false);
  const [hasActiveDelivery, setHasActive]     = useState(false);

  const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (isPublic) { setReady(true); return; }
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) { router.replace("/driver/login"); return; }
      const parsed = JSON.parse(stored);
      if (!parsed?.token || !parsed?.driver?._id) { router.replace("/driver/login"); return; }
      setReady(true);
      // Check for active delivery (fire-and-forget; badge is optional UX)
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

  // Blank dark screen while auth check runs
  if (!ready) return <div style={{ minHeight: "100vh", background: "#0D0D0D" }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", fontFamily: "'Sora','DM Sans',system-ui,sans-serif" }}>
      {children}
      {!isPublic && <DriverBottomNav hasActiveDelivery={hasActiveDelivery} />}
    </div>
  );
}
