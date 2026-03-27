"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DB_URL } from "@config/config";
import { getAvatarUrl } from "@constants/constants";
import {
  FaShoppingBag, FaMoneyBillWave, FaStar, FaToggleOn, FaToggleOff,
  FaStore, FaClock, FaCheckCircle,
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";

const VENDOR_KEY = "yookatale-vendor";
const PRIMARY = "#185f2d";

function StatCard({ icon: Icon, label, value, sub, color = PRIMARY }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "20px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", gap: "14px", alignItems: "flex-start" }}>
      <div style={{ background: color + "15", borderRadius: "12px", padding: "10px", flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: "0.78rem", color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827" }}>{value}</div>
        {sub && <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>{sub}</div>}
      </div>
    </div>
  );
}

function buildChartData(orders) {
  const map = {};
  for (let i = 6; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "MMM d");
    map[d] = 0;
  }
  (orders || []).forEach((o) => {
    if (o.status === "delivered") {
      const d = format(new Date(o.createdAt), "MMM d");
      if (map[d] !== undefined) map[d] += Number(o.total || 0);
    }
  });
  return Object.entries(map).map(([day, revenue]) => ({ day, revenue }));
}

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [chartData, setChartData] = useState([]);

  const getAuth = () => {
    try {
      const s = localStorage.getItem(VENDOR_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  };

  const fetchDashboard = async () => {
    const auth = getAuth();
    if (!auth?.vendor?._id) return;
    try {
      const res = await fetch(`${DB_URL}/vendor/dashboard/${auth.vendor._id}`);
      const data = await res.json();
      if (data.status === "Success") {
        setVendor(data.data.vendor);
        setStats(data.data.stats);
        setRecentOrders(data.data.recentOrders || []);
        setChartData(buildChartData(data.data.recentOrders || []));
      }
    } catch {}
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleToggleOpen = async () => {
    const auth = getAuth();
    if (!auth?.token) return;
    setToggling(true);
    try {
      const res = await fetch(`${DB_URL}/vendor/toggle-open`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (data.status === "Success") {
        setVendor((v) => ({ ...v, isOpen: data.data.isOpen }));
      }
    } catch {}
    finally { setToggling(false); }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <div style={{ width: "36px", height: "36px", border: `3px solid ${PRIMARY}30`, borderTop: `3px solid ${PRIMARY}`, borderRadius: "50%", animation: "vs-spin 0.8s linear infinite" }} />
        <style>{`@keyframes vs-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: 1 }}>
          {/* Avatar */}
          <Link href="/vendor/profile">
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "12px",
              background: vendor?.profileImage ? "transparent" : `linear-gradient(135deg, ${PRIMARY}, #4cd964)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
              cursor: "pointer",
              border: "2px solid #e5e7eb",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = PRIMARY}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
            >
              {vendor?.profileImage ? (
                <img
                  src={getAvatarUrl(vendor.profileImage)}
                  alt={vendor.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#fff",
                  textTransform: "uppercase",
                }}>
                  {vendor?.name?.charAt(0) || "V"}
                </span>
              )}
            </div>
          </Link>

          {/* Info */}
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              {vendor?.name || "My Store"}
            </h1>
            <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: "0.875rem" }}>
              {vendor?.category} • {vendor?.address}
            </p>
            <Link href="/vendor/profile" style={{ color: PRIMARY, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", marginTop: "8px", display: "inline-block" }}>
              Edit Profile →
            </Link>
          </div>
        </div>

        {/* Open/Closed toggle */}
        <button
          onClick={handleToggleOpen}
          disabled={toggling}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 18px", borderRadius: "12px", border: "none",
            background: vendor?.isOpen ? "#dcfce7" : "#fee2e2",
            color: vendor?.isOpen ? "#166534" : "#991b1b",
            fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {vendor?.isOpen ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
          {vendor?.isOpen ? "Store Open" : "Store Closed"}
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <StatCard icon={FaShoppingBag} label="Total Orders" value={stats?.totalOrders?.toLocaleString() || "0"} />
        <StatCard icon={FaMoneyBillWave} label="Total Revenue" value={`UGX ${(stats?.totalRevenue || 0).toLocaleString()}`} color="#0891b2" />
        <StatCard icon={FaMoneyBillWave} label="Pending Payout" value={`UGX ${(stats?.pendingPayout || 0).toLocaleString()}`} color="#d97706" />
        <StatCard icon={FaStar} label="Avg Rating" value={vendor?.averageRating ? vendor.averageRating.toFixed(1) : "—"} sub={`${vendor?.ratingCount || 0} reviews`} color="#f59e0b" />
      </div>

      {/* Revenue chart */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "28px" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "16px" }}>Revenue — Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <Tooltip formatter={(v) => [`UGX ${v.toLocaleString()}`, "Revenue"]} />
            <Line type="monotone" dataKey="revenue" stroke={PRIMARY} strokeWidth={2.5} dot={{ r: 4, fill: PRIMARY }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "16px" }}>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>
            <FaShoppingBag size={32} style={{ marginBottom: "8px", opacity: 0.3 }} />
            <p style={{ margin: 0 }}>No orders yet</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  {["Order ID", "Total", "Status", "Date"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 10).map((o) => (
                  <tr key={o._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 12px", color: "#374151", fontFamily: "monospace" }}>#{String(o._id).slice(-8)}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: PRIMARY }}>UGX {Number(o.total || 0).toLocaleString()}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600, background: o.status === "delivered" ? "#dcfce7" : o.status === "cancelled" ? "#fee2e2" : "#fef9c3", color: o.status === "delivered" ? "#166534" : o.status === "cancelled" ? "#991b1b" : "#854d0e" }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: "0.8rem" }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
