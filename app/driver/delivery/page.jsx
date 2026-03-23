"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import { I, MapBg, PinMarker, STEPS, DRIVER_STYLES } from "@components/driver/DriverUI";

const ActiveDeliveryMap = dynamic(
  () => import("@components/driver/ActiveDeliveryMap"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#e5e3dd" }} /> }
);

const DRIVER_KEY = "yookatale-driver";

export default function DriverDeliveryPage() {
  const router = useRouter();
  const [session, setSession]         = useState(null);
  const [dashData, setDashData]       = useState(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [isUpdating, setIsUpdating]   = useState(false);
  const [myLocation, setMyLocation]   = useState(null);
  const [toast, setToast]             = useState(null);
  const [mounted, setMounted]         = useState(false);

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

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      setIsLoading(true);
      await fetchDashboard();
      setIsLoading(false);
    };
    load();
    const iv = setInterval(fetchDashboard, 10000);
    return () => clearInterval(iv);
  }, [session, fetchDashboard]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const wid = navigator.geolocation.watchPosition(
      (pos) => setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(wid);
  }, []);

  const updateStatus = async (deliveryId, newStatus) => {
    if (!deliveryId || isUpdating) return;
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
        const labels = { picked_up: "Marked as picked up!", in_transit: "On the way!", delivered: "Delivered!" };
        showToast(labels[newStatus] || "Updated!");
        await fetchDashboard();
      } else showToast(data?.message || "Failed", "error");
    } catch { showToast("Network error", "error"); }
    finally { setIsUpdating(false); }
  };

  if (!mounted) return null;

  const delivery     = dashData?.activeDelivery;
  const curStepIdx   = delivery ? STEPS.findIndex(s => s.k === delivery.status) : -1;
  const nextStep     = curStepIdx >= 0 && curStepIdx < STEPS.length - 1 ? STEPS[curStepIdx + 1] : null;
  const isComplete   = delivery?.status === "delivered";

  const pickupCoords  = delivery?.vendorId?.location || delivery?.pickupLocation;
  const dropoffCoords = delivery?.deliveryLocation || delivery?.deliveryAddress;
  const customerName  = delivery?.userId?.firstname
    ? `${delivery.userId.firstname} ${delivery.userId.lastname || ""}`
    : delivery?.customerName || "Customer";
  const customerPhone = delivery?.userId?.phone || delivery?.customerPhone || "";
  const vendorName    = delivery?.vendorId?.businessName || delivery?.vendorId?.name || "Restaurant";
  const addrText      = typeof delivery?.deliveryAddress === "object"
    ? delivery?.deliveryAddress?.address || delivery?.deliveryAddress?.address1 || ""
    : delivery?.deliveryAddress || "";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{DRIVER_STYLES}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 12,
          display: "flex", alignItems: "center", gap: 6,
          animation: "fadeIn 0.25s",
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(13,124,59,0.95)",
          color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          {toast.type === "error" ? <I.X s={14} c="#fff" /> : <I.Check s={14} c="#fff" />}
          {toast.msg}
        </div>
      )}

      {/* No active delivery */}
      {!isLoading && !delivery && (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 32, textAlign: "center",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: "#f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <I.Nav s={24} c="#d1d5db" />
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#111" }}>No active delivery</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, maxWidth: 240 }}>
            Accept an order from the dashboard to start delivering
          </div>
          <button onClick={() => router.push("/driver/dashboard")} style={{
            marginTop: 16, padding: "10px 24px", borderRadius: 8,
            background: "#0d7c3b", color: "#fff", fontWeight: 700, fontSize: 13,
            border: "none", cursor: "pointer",
          }}>Go to Dashboard</button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #0d7c3b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {/* Active delivery full-screen */}
      {!isLoading && delivery && (
        <>
          {/* Map area */}
          <div style={{ flex: 1, position: "relative" }}>
            <MapBg style={{ position: "absolute", inset: 0 }}>
              {/* Navigation header overlay */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
                padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
                background: "linear-gradient(rgba(0,0,0,0.5),transparent)",
              }}>
                <button onClick={() => router.push("/driver/dashboard")} style={{
                  width: 32, height: 32, borderRadius: 16, background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(4px)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <I.Left s={16} c="#fff" />
                </button>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                    {STEPS[curStepIdx]?.l || delivery.status}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
                    {curStepIdx <= 1 ? vendorName : addrText || "Destination"}
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 6,
                  background: "rgba(13,124,59,0.85)", backdropFilter: "blur(4px)",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "'Azeret Mono',monospace" }}>
                    {delivery.estimatedMinutes || "?"}min
                  </span>
                </div>
              </div>

              {/* Map pins */}
              <PinMarker color="#0d7c3b" icon={<I.Store s={12} c="#fff" />} label="Pickup" pulse
                style={{ position: "absolute", left: "22%", top: "30%" }} />
              <svg style={{ position: "absolute", left: "28%", top: "42%", width: "44%", height: 24 }}>
                <line x1="0" y1="12" x2="100%" y2="12" stroke="#0d7c3b" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
              </svg>
              <PinMarker color="#d97706" icon={<I.Pin s={12} c="#fff" />} label="Drop-off"
                style={{ position: "absolute", right: "16%", top: "36%" }} />

              {/* Driver position */}
              {myLocation && (
                <div style={{
                  position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                  width: 16, height: 16, borderRadius: 8, background: "#3b82f6", border: "2.5px solid #fff",
                  boxShadow: "0 0 0 4px rgba(59,130,246,0.15), 0 2px 8px rgba(0,0,0,0.15)", zIndex: 5,
                }} />
              )}
            </MapBg>
          </div>

          {/* Bottom sheet */}
          <div style={{
            background: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", position: "relative", zIndex: 10,
            maxHeight: "48vh", overflow: "auto",
          }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: "#d1d5db", margin: "8px auto 10px" }} />

            {/* Customer info */}
            <div style={{ padding: "0 16px 10px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 19,
                background: "linear-gradient(135deg,#0d7c3b,#d97706)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {customerName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{customerName}</div>
                <div style={{ fontSize: 11, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {addrText || "Customer location"}
                </div>
              </div>
              {customerPhone && (
                <a href={`tel:${customerPhone}`} style={{
                  width: 34, height: 34, borderRadius: 17, background: "#f0fdf4", border: "1px solid #dcfce7",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <I.Phone s={15} c="#0d7c3b" />
                </a>
              )}
            </div>

            {/* Progress stepper */}
            <div style={{ padding: "6px 16px 12px" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {STEPS.map((step, idx) => {
                  const done    = idx <= curStepIdx;
                  const current = idx === curStepIdx;
                  return (
                    <div key={step.k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        height: 3, width: "100%", borderRadius: 2,
                        background: done ? "#0d7c3b" : "#e5e7eb",
                        position: "relative",
                      }}>
                        {current && (
                          <div style={{
                            position: "absolute", right: 0, top: -3, width: 9, height: 9,
                            borderRadius: 5, background: "#0d7c3b", border: "2px solid #fff",
                            boxShadow: "0 0 0 2px rgba(13,124,59,0.15)",
                          }} />
                        )}
                      </div>
                      <span style={{
                        fontSize: 8, fontWeight: current ? 700 : 500,
                        color: done ? "#0d7c3b" : "#9ca3af",
                        textAlign: "center",
                      }}>{step.sh}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order details */}
            <div style={{ padding: "0 16px 8px" }}>
              <div style={{ display: "flex", gap: 8, background: "#f9fafb", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>From</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111", marginTop: 1 }}>{vendorName}</div>
                </div>
                <div style={{ width: 1, background: "#e5e7eb" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Order</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111", marginTop: 1 }}>
                    UGX {(delivery.total || 0).toLocaleString()}
                  </div>
                </div>
                <div style={{ width: 1, background: "#e5e7eb" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Earning</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0d7c3b", marginTop: 1 }}>
                    UGX {(delivery.estimatedEarning || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div style={{ padding: "4px 16px 16px" }}>
              {isComplete ? (
                <button onClick={() => router.push("/driver/dashboard")} style={{
                  width: "100%", padding: "14px", borderRadius: 10,
                  background: "#111", color: "#fff", fontWeight: 700, fontSize: 14,
                  border: "none", cursor: "pointer",
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                }}>
                  <I.Check s={16} c="#fff" /> Back to Dashboard
                </button>
              ) : nextStep ? (
                <button
                  onClick={() => updateStatus(delivery._id, nextStep.k)}
                  disabled={isUpdating}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 10,
                    background: "#0d7c3b", color: "#fff", fontWeight: 700, fontSize: 14,
                    border: "none", cursor: isUpdating ? "not-allowed" : "pointer",
                    opacity: isUpdating ? 0.6 : 1,
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {isUpdating ? (
                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  ) : (
                    <I.Right s={16} c="#fff" />
                  )}
                  {isUpdating ? "Updating..." : nextStep.l}
                </button>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
