"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import VendorSidebar from "@components/vendor/VendorSidebar";

const VENDOR_KEY = "yookatale-vendor";
const PUBLIC_PATHS = ["/vendor/login"];

export default function VendorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (isPublic) { setReady(true); return; }
    try {
      const stored = localStorage.getItem(VENDOR_KEY);
      if (!stored) { router.replace("/vendor/login"); return; }
      const parsed = JSON.parse(stored);
      if (!parsed?.token || !parsed?.vendor?._id) { router.replace("/vendor/login"); return; }
      setReady(true);
    } catch {
      router.replace("/vendor/login");
    }
  }, [isPublic, pathname, router]);

  if (!ready) return <div style={{ minHeight: "100vh", background: "#f9fafb" }} />;

  if (isPublic) return <>{children}</>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif" }}>
      <VendorSidebar />
      {/* Main content — offset for desktop sidebar */}
      <div style={{ marginLeft: 0, paddingTop: "60px" }} className="vendor-main-content">
        <div style={{ padding: "20px 16px", maxWidth: "1100px", margin: "0 auto" }} className="vendor-inner-pad">
          {children}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .vendor-main-content { margin-left: 240px !important; padding-top: 0 !important; }
          .vendor-inner-pad { padding: 28px 28px !important; }
        }
      `}</style>
    </div>
  );
}
