"use client";

import { useState, useEffect, useCallback } from "react";
import { DB_URL } from "@config/config";
import { FaMoneyBillWave, FaMotorcycle, FaStar, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";

const DRIVER_KEY = "yookatale-driver";
const PRIMARY    = "#0d7c3b";

const C = {
  bg:      "#f4f5f7",
  card:    "#ffffff",
  card2:   "#f9fafb",
  border:  "#f3f4f6",
  borderMd:"#e5e7eb",
  amber:   "#d97706",
  amberDim:"rgba(217,119,6,0.08)",
  amberBrd:"rgba(217,119,6,0.18)",
  green:   "#0d7c3b",
  greenLt: "#10a34d",
  white:   "#ffffff",
  text1:   "#111827",
  text2:   "#6b7280",
  text3:   "#9ca3af",
  red:     "#ef4444",
};

const font = { fontFamily: "'Bricolage Grotesque','Sora','DM Sans',system-ui,sans-serif" };

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week",  label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "all",   label: "All Time" },
];

const PAGE_SIZE = 15;

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...style }}>
    {children}
  </div>
);

function filterByPeriod(deliveries, period) {
  const now  = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart  = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 6);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return deliveries.filter((d) => {
    const date = new Date(d.deliveredAt || d.createdAt);
    if (period === "today") return date >= todayStart;
    if (period === "week")  return date >= weekStart;
    if (period === "month") return date >= monthStart;
    return true;
  });
}

function buildChartData(deliveries) {
  const map = {};
  for (let i = 6; i >= 0; i--) {
    const d   = subDays(new Date(), i);
    const key = format(d, "yyyy-MM-dd");
    map[key]  = { day: format(d, "EEE"), earnings: 0 };
  }
  deliveries.forEach((d) => {
    const key = format(new Date(d.deliveredAt || d.createdAt), "yyyy-MM-dd");
    if (map[key]) map[key].earnings += d.commissionAmount || 0;
  });
  return Object.values(map);
}

export default function DriverEarningsPage() {
  const [session, setSession]     = useState(null);
  const [dashData, setDashData]   = useState(null);
  const [period, setPeriod]       = useState("week");
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed?.token && parsed?.driver?._id) setSession(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    if (!session?.driver?._id) return;
    setLoading(true);
    fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d?.status === "Success") setDashData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  const requestPayout = async () => {
    if (!session?.driver?._id || payoutLoading) return;
    setPayoutLoading(true);
    try {
      const res  = await fetch(`${DB_URL}/partners/drivers/payouts/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ driverId: session.driver._id }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Payout request submitted!"); setPayoutModal(false); }
      else showToast(data?.message || "Payout request failed", "error");
    } catch { showToast("Request failed", "error"); }
    finally { setPayoutLoading(false); }
  };

  const driver          = dashData?.driver || session?.driver || {};
  const allDeliveries   = dashData?.recentDeliveries || [];
  const filtered        = filterByPeriod(allDeliveries, period);
  const chartData       = buildChartData(allDeliveries);
  const totalFiltered   = filtered.reduce((s, d) => s + (d.commissionAmount || 0), 0);
  const paginated       = filtered.slice(0, page * PAGE_SIZE);
  const hasMore         = paginated.length < filtered.length;
  const unpaidBalance   = driver?.commissionEarned || 0;
  const MIN_PAYOUT      = 10000;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${PRIMARY}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text1, paddingBottom: 88, ...font }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-10px);} to{opacity:1;transform:translateY(0);} }`}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "12px 20px", borderRadius: 14, fontWeight: 600, fontSize: 13,
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
          animation: "fadeSlideDown 0.25s ease",
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(13,124,59,0.95)",
          color: C.white, backdropFilter: "blur(12px)",
        }}>
          {toast.type === "error" ? <FaExclamationTriangle /> : <FaCheckCircle />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px 16px 12px", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FaMoneyBillWave style={{ width: 22, height: 22, color: PRIMARY }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 20, color: C.text1 }}>
              UGX {totalFiltered.toLocaleString()}
            </p>
            <p style={{ fontSize: 11, color: C.text3 }}>
              {filtered.length} {period === "today" ? "today" : period === "week" ? "this week" : period === "month" ? "this month" : "all time"}
            </p>
          </div>
        </div>
      </header>

      <div style={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Period tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => { setPeriod(p.key); setPage(1); }}
              style={{
                padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: period === p.key ? PRIMARY : C.card,
                color: period === p.key ? C.white : C.text2,
                border: `1px solid ${period === p.key ? PRIMARY : C.border}`,
                cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: period === p.key ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chart: last 7 days */}
        <Card style={{ padding: "18px 12px 12px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, paddingLeft: 4 }}>
            Last 7 Days
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fill: C.text3, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.text3, fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
              <Tooltip
                contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text1, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                formatter={(v) => [`UGX ${v.toLocaleString()}`, "Earned"]}
              />
              <Bar dataKey="earnings" fill={PRIMARY} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Delivery History */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            Delivery History
          </p>
          {paginated.length === 0 ? (
            <Card style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ color: C.text3, fontSize: 13 }}>No deliveries in this period</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {paginated.map((d, i) => (
                <Card key={d._id || i} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(13,124,59,0.06)", border: "1px solid rgba(13,124,59,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FaMotorcycle style={{ width: 16, height: 16, color: PRIMARY }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.text1, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.orderId?.vendor?.businessName || d.orderId?.customerName || "Order"}
                    </p>
                    <p style={{ fontSize: 11, color: C.text3 }}>
                      {d.deliveredAt || d.createdAt ? new Date(d.deliveredAt || d.createdAt).toLocaleDateString("en-UG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "\u2014"}
                    </p>
                    {d.rating > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
                        {[1,2,3,4,5].map((s) => (
                          <FaStar key={s} style={{ width: 10, height: 10, color: s <= d.rating ? C.amber : "#e5e7eb" }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {d.commissionAmount > 0 ? (
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>+UGX {d.commissionAmount.toLocaleString()}</p>
                    ) : (
                      <p style={{ fontSize: 12, color: C.text3 }}>\u2014</p>
                    )}
                  </div>
                </Card>
              ))}

              {hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  style={{ padding: "12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, color: C.text2, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  Load more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Payout Section */}
        <Card style={{ padding: "18px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Payout</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 12, color: C.text3 }}>Available Balance</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: unpaidBalance >= MIN_PAYOUT ? C.amber : C.text3 }}>
                UGX {unpaidBalance.toLocaleString()}
              </p>
            </div>
            {driver?.payoutMethod?.phone && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 11, color: C.text3 }}>Payout to</p>
                <p style={{ fontSize: 12, color: C.text1, fontWeight: 600 }}>{driver.payoutMethod.provider}</p>
                <p style={{ fontSize: 11, color: C.text3 }}>{driver.payoutMethod.phone}</p>
              </div>
            )}
          </div>
          {unpaidBalance < MIN_PAYOUT && (
            <p style={{ fontSize: 11, color: C.text3, marginBottom: 10 }}>
              Minimum payout: UGX {MIN_PAYOUT.toLocaleString()}
            </p>
          )}
          <button
            onClick={() => setPayoutModal(true)}
            disabled={unpaidBalance < MIN_PAYOUT}
            style={{
              width: "100%", padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 14,
              background: unpaidBalance >= MIN_PAYOUT ? `linear-gradient(135deg, ${C.green}, ${C.greenLt})` : "#f3f4f6",
              color: unpaidBalance >= MIN_PAYOUT ? C.white : C.text3,
              border: "none", cursor: unpaidBalance >= MIN_PAYOUT ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              boxShadow: unpaidBalance >= MIN_PAYOUT ? "0 4px 16px rgba(13,124,59,0.25)" : "none",
            }}
          >
            Request Payout
          </button>
        </Card>
      </div>

      {/* Payout Confirmation Modal */}
      {payoutModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <p style={{ fontWeight: 800, fontSize: 17, color: C.text1, marginBottom: 6 }}>Confirm Payout Request</p>
            <p style={{ fontSize: 13, color: C.text2, marginBottom: 4 }}>Request payment of:</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: C.amber, marginBottom: 16 }}>UGX {unpaidBalance.toLocaleString()}</p>
            {driver?.payoutMethod?.phone && (
              <p style={{ fontSize: 12, color: C.text3, marginBottom: 20 }}>
                To: {driver.payoutMethod.provider} \u2014 {driver.payoutMethod.phone}
              </p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPayoutModal(false)} style={{ flex: 1, padding: 12, borderRadius: 12, background: "none", border: `1px solid ${C.border}`, color: C.text2, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button
                onClick={requestPayout}
                disabled={payoutLoading}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: PRIMARY, color: C.white, fontWeight: 700, fontSize: 13, border: "none", cursor: payoutLoading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: payoutLoading ? 0.7 : 1 }}
              >
                {payoutLoading ? "Sending..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
