"use client";

import { useState, useEffect, useCallback } from "react";
import { DB_URL } from "@config/config";
import { I, Chart, DRIVER_STYLES } from "@components/driver/DriverUI";

const DRIVER_KEY = "yookatale-driver";

export default function DriverEarningsPage() {
  const [session, setSession]       = useState(null);
  const [dashData, setDashData]     = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [mounted, setMounted]       = useState(false);
  const [period, setPeriod]         = useState("week");

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

  if (!mounted) return null;

  const driver          = dashData?.driver || session?.driver || {};
  const totalEarnings   = dashData?.totalEarnings || driver?.totalEarnings || 0;
  const weekEarnings    = dashData?.weekEarnings || 0;
  const pendingPayout   = dashData?.pendingPayout || 0;
  const todayDeliveries = dashData?.todayDeliveries || 0;
  const totalDeliveries = driver?.totalDeliveries || 0;
  const acceptanceRate  = driver?.acceptanceRate ?? dashData?.driver?.acceptanceRate ?? 100;
  const recentDeliveries = dashData?.recentDeliveries || [];
  const payoutHistory   = dashData?.payoutHistory || [];

  const chartData = [
    { d: "Mon", v: 0 }, { d: "Tue", v: 0 }, { d: "Wed", v: 0 },
    { d: "Thu", v: 0 }, { d: "Fri", v: 0 }, { d: "Sat", v: 0 }, { d: "Sun", v: 0 },
  ];
  if (dashData?.weeklyBreakdown) {
    dashData.weeklyBreakdown.forEach((item) => {
      const found = chartData.find(c => c.d === item.day);
      if (found) found.v = item.earnings || 0;
    });
  }

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <style>{DRIVER_STYLES}</style>

      {/* Dark header */}
      <div style={{
        background: "#111", padding: "18px 16px 24px", color: "#fff",
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Earnings</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["week", "month"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                background: period === p ? "rgba(255,255,255,0.1)" : "transparent",
                color: period === p ? "#fff" : "#6b7280",
                fontSize: 11, fontWeight: 600,
              }}>{p === "week" ? "Week" : "Month"}</button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Bricolage Grotesque',sans-serif", marginBottom: 2 }}>
          UGX {totalEarnings.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>Total earnings</div>

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <I.Up s={12} c="#22c55e" />
              <span style={{ fontSize: 9, color: "#6b7280", fontWeight: 600 }}>This Week</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
              UGX {weekEarnings.toLocaleString()}
            </div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <I.Clock s={12} c="#d97706" />
              <span style={{ fontSize: 9, color: "#6b7280", fontWeight: 600 }}>Pending</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#d97706" }}>
              UGX {pendingPayout.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "12px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 10, padding: "10px", border: "1px solid #f3f4f6", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0d7c3b" }}>{todayDeliveries}</div>
          <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600 }}>Today</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, padding: "10px", border: "1px solid #f3f4f6", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{totalDeliveries}</div>
          <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600 }}>Total Trips</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, padding: "10px", border: "1px solid #f3f4f6", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: acceptanceRate >= 80 ? "#0d7c3b" : "#d97706" }}>{acceptanceRate}%</div>
          <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600 }}>Acceptance</div>
        </div>
      </div>

      {/* Chart section */}
      <div style={{ padding: "16px", margin: "0 16px 0", background: "#fff", borderRadius: 12, marginTop: 10, border: "1px solid #f3f4f6" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 10 }}>Weekly Overview</div>
        <Chart data={chartData} />
      </div>

      {/* Payout button */}
      {pendingPayout > 0 && (
        <div style={{ padding: "12px 16px 0" }}>
          <button style={{
            width: "100%", padding: "12px", borderRadius: 10,
            background: "#0d7c3b", color: "#fff", fontWeight: 700, fontSize: 13,
            border: "none", cursor: "pointer",
            fontFamily: "'Bricolage Grotesque',sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <I.Wallet s={16} c="#fff" />
            Request Payout — UGX {pendingPayout.toLocaleString()}
          </button>
        </div>
      )}

      {/* Payout History */}
      {payoutHistory.length > 0 && (
        <div style={{ padding: "16px" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111", marginBottom: 8 }}>Payout History</div>
          {payoutHistory.map((p, idx) => (
            <div key={p._id || idx} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", background: "#fff", borderRadius: 8,
              marginBottom: 4, border: "1px solid #f3f4f6",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: "#f0fdf4",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <I.Wallet s={14} c="#0d7c3b" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{p.note || "Payout"}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-UG", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0d7c3b" }}>
                UGX {(p.amount || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delivery history */}
      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#111", marginBottom: 8 }}>Recent Deliveries</div>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <div style={{ width: 24, height: 24, border: "2px solid #0d7c3b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          </div>
        ) : recentDeliveries.length > 0 ? (
          recentDeliveries.map((d, idx) => {
            const order = d.orderId || {};
            const addr = typeof order.deliveryAddress === "object"
              ? order.deliveryAddress?.address || order.deliveryAddress?.address1 || ""
              : order.deliveryAddress || "";
            const earning = d.commissionAmount || d.estimatedEarning || d.driverEarning || 0;
            return (
              <div key={d._id || idx} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", background: "#fff", borderRadius: 8,
                marginBottom: 4, border: "1px solid #f3f4f6",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: d.status === "delivered" ? "#f0fdf4" : "#fef3c7",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {d.status === "delivered"
                    ? <I.Check s={14} c="#0d7c3b" />
                    : <I.Clock s={14} c="#d97706" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {order.customerName || order.vendorId?.businessName || order.vendorId?.name || "Delivery"}
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {addr || (d.status === "delivered" ? "Completed" : d.status)}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0d7c3b" }}>
                    +UGX {earning.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 9, color: "#9ca3af" }}>
                    {d.deliveredAt ? new Date(d.deliveredAt).toLocaleDateString("en-UG", { month: "short", day: "numeric" }) : d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-UG", { month: "short", day: "numeric" }) : ""}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "32px 16px", background: "#fff", borderRadius: 10, border: "1px solid #f3f4f6" }}>
            <I.Dollar s={28} c="#d1d5db" />
            <div style={{ fontWeight: 700, fontSize: 13, color: "#111", marginTop: 8 }}>No deliveries yet</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Complete deliveries to see your history</div>
          </div>
        )}
      </div>
    </div>
  );
}
