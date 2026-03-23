"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import { useDriverSocket } from "@hooks/useDriverSocket";
import { useDriverFCM } from "@hooks/useDriverFCM";
import { I, MapBg, PinMarker, STEPS, DRIVER_STYLES, greeting } from "@components/driver/DriverUI";

const ActiveDeliveryMap = dynamic(
  () => import("@components/driver/ActiveDeliveryMap"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#e5e3dd", borderRadius: 10 }} /> }
);
const DriverOrderCard = dynamic(() => import("@components/driver/OrderCard"), { ssr: false });

const DRIVER_KEY    = "yookatale-driver";
const POLL_INTERVAL = 12000;

export default function DriverDashboardPage() {
  const router = useRouter();
  const [session, setSession]               = useState(null);
  const [dashData, setDashData]             = useState(null);
  const [availableOrders, setOrders]        = useState([]);
  const [isLoadingDash, setIsLoadingDash]   = useState(true);
  const [isTogglingAvail, setIsToggling]    = useState(false);
  const [isAccepting, setIsAccepting]       = useState(null);
  const [isUpdatingStatus, setIsUpdating]   = useState(false);
  const [myLocation, setMyLocation]         = useState(null);
  const [toast, setToast]                   = useState(null);
  const [banner, setBanner]                 = useState(null);
  const [mounted, setMounted]               = useState(false);
  const bannerTimerRef  = useRef(null);
  const pollIntervalRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed?.token && parsed?.driver?._id) setSession(parsed);
    } catch {}
  }, []);

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.token}`,
  }), [session]);

  const fetchDashboard = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res  = await fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") setDashData(data.data);
    } catch {}
  }, [session, authHeaders]);

  const fetchAvailableOrders = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res  = await fetch(`${DB_URL}/driver/${session.driver._id}/available-orders`, { headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") setOrders(data.data || []);
    } catch {}
  }, [session, authHeaders]);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setIsLoadingDash(true);
      await Promise.all([fetchDashboard(), fetchAvailableOrders()]);
      setIsLoadingDash(false);
    };
    load();
  }, [session, fetchDashboard, fetchAvailableOrders]);

  useEffect(() => {
    if (!session) return;
    pollIntervalRef.current = setInterval(() => {
      fetchDashboard();
      fetchAvailableOrders();
    }, POLL_INTERVAL);
    return () => clearInterval(pollIntervalRef.current);
  }, [session, fetchDashboard, fetchAvailableOrders]);

  useDriverSocket({
    partnerId: session?.driver?._id,
    driverToken: session?.token,
    onNewOrder: (data) => {
      setBanner({ text: `New order nearby! #${data?.shortId || ""}` });
      clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = setTimeout(() => setBanner(null), 8000);
      fetchDashboard();
      fetchAvailableOrders();
    },
    onLocationUpdate: (loc) => setMyLocation(loc),
  });

  useDriverFCM({ partnerId: session?.driver?._id, driverToken: session?.token });

  const toggleAvailability = async () => {
    if (!session?.driver?._id || isTogglingAvail) return;
    setIsToggling(true);
    try {
      const res  = await fetch(`${DB_URL}/driver/${session.driver._id}/availability`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (data?.status === "Success") {
        setDashData((prev) => prev ? { ...prev, driver: { ...prev.driver, isAvailable: data.data.isAvailable } } : prev);
        showToast(data.message);
      }
    } catch { showToast("Failed to update availability", "error"); }
    finally { setIsToggling(false); }
  };

  const acceptOrder = async (orderId) => {
    if (!session?.driver?._id || isAccepting) return;
    setIsAccepting(orderId);
    try {
      const res  = await fetch(`${DB_URL}/driver/accept-order`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ orderId, partnerId: session.driver._id }),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        showToast("Order accepted! Navigate to pickup.");
        await Promise.all([fetchDashboard(), fetchAvailableOrders()]);
      } else {
        showToast(data?.message || "Failed to accept order", "error");
      }
    } catch { showToast("Failed to accept order", "error"); }
    finally { setIsAccepting(null); }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    if (!deliveryId || isUpdatingStatus) return;
    setIsUpdating(true);
    try {
      const body = { status: newStatus };
      if (myLocation) { body.lat = myLocation.lat; body.lng = myLocation.lng; }
      const res  = await fetch(`${DB_URL}/driver/delivery/${deliveryId}/status`, {
        method: "PATCH", headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        const labels = { picked_up: "Marked as picked up!", in_transit: "Delivery started!", delivered: "Delivered! Great work!" };
        showToast(labels[newStatus] || "Status updated!");
        await fetchDashboard();
      } else { showToast(data?.message || "Failed to update", "error"); }
    } catch { showToast("Failed to update status", "error"); }
    finally { setIsUpdating(false); }
  };

  if (!mounted) return null;

  const driver           = dashData?.driver || session?.driver || {};
  const activeDelivery   = dashData?.activeDelivery;
  const isAvailable      = driver?.isAvailable ?? false;
  const driverName       = driver?.name || driver?.fullName || "Driver";
  const activeStep       = activeDelivery?.status ? STEPS.find(s => s.k === activeDelivery.status) : null;

  return (
    <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
      <style>{DRIVER_STYLES}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 12,
          display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
          animation: "fadeIn 0.25s",
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(13,124,59,0.95)",
          color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          {toast.type === "error" ? <I.X s={14} c="#fff" /> : <I.Check s={14} c="#fff" />}
          {toast.msg}
        </div>
      )}

      {/* New Order Banner */}
      {banner && (
        <div
          onClick={() => { setBanner(null); document.getElementById("available-orders")?.scrollIntoView({ behavior: "smooth" }); }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 9998,
            background: "#0d7c3b", padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 4px 20px rgba(13,124,59,0.3)", cursor: "pointer",
          }}
        >
          <I.Bell s={18} c="#fff" />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{banner.text}</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginLeft: "auto" }}>Tap to view</span>
        </div>
      )}

      {/* Header */}
      <header style={{
        background: "#fff", padding: "8px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #e5e7eb", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img src="/assets/icons/logo2.png" alt="Yookatale" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>Yookatale</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: "#92400e", background: "#fef3c7", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", letterSpacing: 0.3 }}>Driver</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={toggleAvailability} disabled={isTogglingAvail} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6,
            border: "none", cursor: isTogglingAvail ? "not-allowed" : "pointer",
            background: isAvailable ? "#0d7c3b" : "#6b7280", color: "#fff", fontWeight: 600, fontSize: 11,
            opacity: isTogglingAvail ? 0.6 : 1,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: isAvailable ? "#86efac" : "#d1d5db" }} />
            {isTogglingAvail ? "..." : isAvailable ? "Online" : "Offline"}
          </button>
          <button onClick={() => { fetchDashboard(); fetchAvailableOrders(); }} style={{
            width: 32, height: 32, borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
          }}>
            <I.Bell s={14} c="#111" />
          </button>
          {(driver?.profileImage || driver?.profilePicture) ? (
            <img src={driver.profileImage || driver.profilePicture} alt={driverName}
              style={{ width: 28, height: 28, borderRadius: 14, objectFit: "cover", cursor: "pointer" }}
              onClick={() => router.push("/driver/profile")} />
          ) : (
            <div onClick={() => router.push("/driver/profile")} style={{
              width: 28, height: 28, borderRadius: 14, background: "#111",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff", cursor: "pointer",
            }}>
              {driverName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "D"}
            </div>
          )}
        </div>
      </header>

      {/* Loading */}
      {isLoadingDash && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #0d7c3b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {/* Main content */}
      {!isLoadingDash && (
        <div style={{ animation: "fadeIn 0.25s" }}>
          {/* Greeting */}
          <div style={{ padding: "16px 16px 10px" }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{greeting()}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginTop: 1 }}>{driverName}</div>
          </div>

          {/* Stats grid */}
          <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { l: "Today", v: dashData?.todayDeliveries ?? 0, u: "trips", ic: <I.Pkg s={14} c="#0d7c3b" />, bg: "#f0fdf4" },
              { l: "Week", v: `${((dashData?.weekEarnings || 0) / 1000).toFixed(0)}K`, u: "UGX", ic: <I.Up s={14} c="#d97706" />, bg: "#fffbeb" },
              { l: "Rating", v: (driver?.averageRating || 0).toFixed(1), u: `${driver?.ratingCount || 0}`, ic: <I.Star s={14} c="#d97706" f="#d97706" />, bg: "#fefce8" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "10px", border: "1px solid #f3f4f6" }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>{s.ic}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>{s.u} · {s.l}</div>
              </div>
            ))}
          </div>

          {/* Active Delivery Banner */}
          {activeDelivery && (
            <div style={{ padding: "10px 16px 0" }}>
              <button onClick={() => router.push("/driver/delivery")} style={{
                width: "100%", background: "#111", borderRadius: 10, padding: "12px 14px",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16, background: "#0d7c3b", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><I.Nav s={14} c="#fff" /></div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Active Delivery</div>
                  <div style={{ fontSize: 10, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeDelivery.deliveryAddress?.address || activeDelivery.deliveryAddress?.address1 || "In progress"}
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#0d7c3b", background: "rgba(13,124,59,0.12)", padding: "2px 6px", borderRadius: 4 }}>
                  {activeStep?.sh || activeDelivery.status}
                </span>
                <I.Right s={14} c="#6b7280" />
              </button>
            </div>
          )}

          {/* Available Orders */}
          <div id="available-orders">
            <div style={{ padding: "10px 16px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>Nearby Orders</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#0d7c3b", background: "#f0fdf4", padding: "2px 8px", borderRadius: 4, border: "1px solid #dcfce7" }}>
                {availableOrders.length}
              </span>
            </div>
            <div style={{ padding: "0 16px 16px" }}>
              {isAvailable ? (
                availableOrders.length > 0 ? (
                  availableOrders.map((order) => (
                    <DriverOrderCard
                      key={order._id}
                      order={order}
                      onAccept={acceptOrder}
                      isAccepting={isAccepting === order._id}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "36px 16px", background: "#fff", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                    <I.Pkg s={28} c="#d1d5db" />
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#111", marginTop: 8 }}>No orders right now</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Stay online</div>
                  </div>
                )
              ) : (
                <div style={{ textAlign: "center", padding: "36px 16px", background: "#fff", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                  <I.Zap s={28} c="#d1d5db" />
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111", marginTop: 8 }}>You&apos;re offline</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Go online to receive orders</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
