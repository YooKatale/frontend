"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import { I, DRIVER_STYLES } from "@components/driver/DriverUI";

const DRIVER_KEY = "yookatale-driver";

const MENU_ITEMS = [
  { l: "Personal Info", ic: I.User, bg: "#f0fdf4", cl: "#0d7c3b" },
  { l: "Vehicle Details", ic: I.Bike, bg: "#eff6ff", cl: "#3b82f6" },
  { l: "Documents", ic: I.Shield, bg: "#fefce8", cl: "#d97706" },
  { l: "Notifications", ic: I.Bell, bg: "#fef2f2", cl: "#ef4444" },
  { l: "Settings", ic: I.Gear, bg: "#f5f3ff", cl: "#8b5cf6" },
  { l: "Support", ic: I.Msg, bg: "#f0fdfa", cl: "#14b8a6" },
];

export default function DriverProfilePage() {
  const router = useRouter();
  const [session, setSession]     = useState(null);
  const [dashData, setDashData]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed?.token && parsed?.driver?._id) setSession(parsed);
    } catch {}
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res  = await fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json();
      if (data?.status === "Success") setDashData(data.data);
    } catch {}
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const load = async () => { setIsLoading(true); await fetchDashboard(); setIsLoading(false); };
    load();
  }, [session, fetchDashboard]);

  const handleLogout = () => {
    try { localStorage.removeItem(DRIVER_KEY); } catch {}
    router.replace("/driver/login");
  };

  if (!mounted) return null;

  const driver     = dashData?.driver || session?.driver || {};
  const driverName = driver?.name || driver?.fullName || "Driver";
  const email      = driver?.email || "";
  const phone      = driver?.phone || "";
  const avatar     = driver?.profilePicture || driver?.avatar || "";
  const initials   = driverName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "D";
  const totalDel   = dashData?.totalDeliveries || 0;
  const rating     = (driver?.averageRating || 0).toFixed(1);
  const acceptance = driver?.acceptanceRate != null ? `${driver.acceptanceRate}%` : "N/A";

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <style>{DRIVER_STYLES}</style>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #0d7c3b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {!isLoading && (
        <div style={{ animation: "fadeIn 0.25s" }}>
          {/* Avatar + name */}
          <div style={{ textAlign: "center", padding: "24px 16px 12px" }}>
            {avatar ? (
              <img src={avatar} alt={driverName} style={{
                width: 72, height: 72, borderRadius: 36, objectFit: "cover",
                border: "3px solid #0d7c3b", margin: "0 auto 10px", display: "block",
              }} />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: 36,
                background: "linear-gradient(135deg,#0d7c3b,#d97706)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px", fontSize: 22, fontWeight: 800, color: "#fff",
              }}>{initials}</div>
            )}
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{driverName}</div>
            {email && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{email}</div>}
            {phone && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{phone}</div>}
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "0 16px 10px" }}>
            {[
              { l: "Deliveries", v: totalDel, ic: <I.Pkg s={14} c="#0d7c3b" />, bg: "#f0fdf4" },
              { l: "Rating", v: rating, ic: <I.Star s={14} c="#d97706" f="#d97706" />, bg: "#fefce8" },
              { l: "Acceptance", v: acceptance, ic: <I.Check s={14} c="#3b82f6" />, bg: "#eff6ff" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 10, padding: "12px 10px",
                border: "1px solid #f3f4f6", textAlign: "center",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7, background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 6px",
                }}>{s.ic}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 16px" }}>
            {MENU_ITEMS.map((item, idx) => (
              <button key={idx} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "12px", background: "#fff", border: "1px solid #f3f4f6",
                borderRadius: 10, marginBottom: 4, cursor: "pointer",
                textAlign: "left",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: item.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <item.ic s={15} c={item.cl} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111", flex: 1 }}>{item.l}</span>
                <I.Right s={14} c="#d1d5db" />
              </button>
            ))}
          </div>

          {/* Sign out */}
          <div style={{ padding: "12px 16px 24px" }}>
            <button onClick={handleLogout} style={{
              width: "100%", padding: "12px", borderRadius: 10,
              background: "#fef2f2", border: "1px solid #fecaca",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
            }}>
              <I.Logout s={16} c="#dc2626" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
