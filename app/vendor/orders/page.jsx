"use client";

import { useState, useEffect } from "react";
import { DB_URL } from "@config/config";
import { FaShoppingBag, FaSync } from "react-icons/fa";

const VENDOR_KEY = "yookatale-vendor";
const PRIMARY = "#185f2d";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  pending_cod_approval: { bg: "#fef9c3", color: "#854d0e" },
  confirmed: { bg: "#dbeafe", color: "#1e40af" },
  preparing: { bg: "#fde68a", color: "#92400e" },
  ready: { bg: "#d1fae5", color: "#065f46" },
  assigned: { bg: "#e0e7ff", color: "#3730a3" },
  picked_up: { bg: "#ede9fe", color: "#5b21b6" },
  in_transit: { bg: "#e0f2fe", color: "#0369a1" },
  delivered: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

const VENDOR_ACTIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready"],
  ready: [],
};

function getAuth() {
  try { return JSON.parse(localStorage.getItem(VENDOR_KEY) || "null"); } catch { return null; }
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    const auth = getAuth();
    if (!auth?.vendor?._id) return;
    setIsLoading(true);
    try {
      const url = `${DB_URL}/vendor/orders/${auth.vendor._id}${activeTab ? `?status=${activeTab}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "Success") setOrders(data.data.orders || []);
    } catch {}
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [activeTab]);

  const updateStatus = async (orderId, status) => {
    const auth = getAuth();
    if (!auth?.token) return;
    setUpdating(orderId + status);
    try {
      const res = await fetch(`${DB_URL}/vendor/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.status === "Success") {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      }
    } catch {}
    finally { setUpdating(null); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Orders</h1>
        <button
          onClick={fetchOrders}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}
        >
          <FaSync size={13} />
          Refresh
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "20px", paddingBottom: "4px" }}>
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            style={{
              padding: "7px 16px", borderRadius: "20px", border: "1.5px solid",
              borderColor: activeTab === t.value ? PRIMARY : "#e5e7eb",
              background: activeTab === t.value ? PRIMARY : "#fff",
              color: activeTab === t.value ? "#fff" : "#374151",
              fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px" }}>
          <FaShoppingBag size={40} style={{ color: "#d1d5db", marginBottom: "12px" }} />
          <p style={{ color: "#6b7280", margin: 0, fontWeight: 600 }}>No orders found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {orders.map((order) => {
            const sc = STATUS_COLORS[order.status] || { bg: "#f3f4f6", color: "#6b7280" };
            const actions = VENDOR_ACTIONS[order.status] || [];
            return (
              <div key={order._id} style={{ background: "#fff", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#111827", fontFamily: "monospace", fontSize: "0.95rem" }}>
                      #{String(order._id).slice(-8)}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.82rem", marginTop: "2px" }}>
                      {order.customerName || "Customer"} • {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "#374151" }}>
                      {(order.products || []).slice(0, 2).map((p, i) => (
                        <span key={i}>{i > 0 && ", "}{p.name || p.productName || "Item"} x{p.quantity || 1}</span>
                      ))}
                      {(order.products || []).length > 2 && <span style={{ color: "#9ca3af" }}> +{(order.products || []).length - 2} more</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: PRIMARY }}>
                      UGX {Number(order.total || 0).toLocaleString()}
                    </div>
                    <span style={{ display: "inline-block", marginTop: "6px", padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: sc.bg, color: sc.color }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                {actions.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
                    {actions.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(order._id, s)}
                        disabled={updating === order._id + s}
                        style={{
                          padding: "7px 14px", borderRadius: "8px", border: "none",
                          background: s === "cancelled" ? "#fee2e2" : PRIMARY,
                          color: s === "cancelled" ? "#991b1b" : "#fff",
                          fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                          opacity: updating === order._id + s ? 0.6 : 1,
                          textTransform: "capitalize",
                        }}
                      >
                        {updating === order._id + s ? "..." : `Mark ${s}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
