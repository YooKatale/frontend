"use client";

import { useState, useEffect } from "react";
import { DB_URL } from "@config/config";
import { FaMoneyBillWave, FaMobileAlt, FaInfoCircle } from "react-icons/fa";

const VENDOR_KEY = "yookatale-vendor";
const PRIMARY = "#185f2d";

function getAuth() {
  try { return JSON.parse(localStorage.getItem(VENDOR_KEY) || "null"); } catch { return null; }
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>{label}</span>
      <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.875rem" }}>{value}</span>
    </div>
  );
}

export default function VendorPayoutsPage() {
  const [vendor, setVendor] = useState(null);
  const [payoutForm, setPayoutForm] = useState({ phone: "", provider: "MTN", accountName: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.vendor?._id) return;
    fetch(`${DB_URL}/vendor/dashboard/${auth.vendor._id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "Success") {
          const v = data.data.vendor;
          setVendor(v);
          if (v.payoutMethod?.phone) {
            setPayoutForm({
              phone: v.payoutMethod.phone || "",
              provider: v.payoutMethod.provider || "MTN",
              accountName: v.payoutMethod.accountName || "",
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    if (!payoutForm.phone.trim()) { setError("Phone number is required."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${DB_URL}/vendor/${auth.vendor._id}/payout-method`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payoutForm),
      });
      const data = await res.json();
      if (data.status === "Success") {
        setVendor(data.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error(data.message || "Save failed");
      }
    } catch (err) {
      setError(err.message || "Failed to save payout method.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading...</div>;

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "24px" }}>Payouts</h1>

      {/* Balance card */}
      <div style={{ background: `linear-gradient(135deg, ${PRIMARY}, #1f793a)`, borderRadius: "20px", padding: "28px", color: "#fff", marginBottom: "24px", boxShadow: "0 8px 24px rgba(24,95,45,0.25)" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, opacity: 0.8, marginBottom: "8px", letterSpacing: "0.04em" }}>PENDING PAYOUT</div>
        <div style={{ fontSize: "2.5rem", fontWeight: 900 }}>
          UGX {Number(vendor?.pendingPayout || 0).toLocaleString()}
        </div>
        <div style={{ marginTop: "12px", fontSize: "0.875rem", opacity: 0.85 }}>
          Total paid out: UGX {Number(vendor?.totalPaidOut || 0).toLocaleString()}
        </div>
      </div>

      {/* Payout info */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <FaInfoCircle size={16} color={PRIMARY} />
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", margin: 0 }}>Payout Schedule</h3>
        </div>
        <InfoRow label="Schedule" value="Weekly (Mondays)" />
        <InfoRow label="Commission rate" value={`${((vendor?.commissionRate || 0.1) * 100).toFixed(0)}%`} />
        <InfoRow label="Total orders" value={(vendor?.totalOrders || 0).toLocaleString()} />
        <InfoRow label="Last payout" value={vendor?.lastPayoutAt ? new Date(vendor.lastPayoutAt).toLocaleDateString() : "—"} />
        <div style={{ marginTop: "16px", background: "#f0fdf4", borderRadius: "10px", padding: "12px 14px", fontSize: "0.82rem", color: "#166534" }}>
          Payouts are processed automatically every Monday to your registered mobile money account. Ensure your payout method below is up to date.
        </div>
      </div>

      {/* Payout method */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <FaMobileAlt size={16} color={PRIMARY} />
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", margin: 0 }}>Payout Method</h3>
        </div>
        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Provider</label>
              <select value={payoutForm.provider} onChange={(e) => setPayoutForm((p) => ({ ...p, provider: e.target.value }))} style={inputStyle}>
                <option value="MTN">MTN Mobile Money</option>
                <option value="AIRTEL">Airtel Money</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Phone Number</label>
              <input type="tel" value={payoutForm.phone} onChange={(e) => setPayoutForm((p) => ({ ...p, phone: e.target.value }))} placeholder="e.g. 0772123456" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Account Name</label>
            <input type="text" value={payoutForm.accountName} onChange={(e) => setPayoutForm((p) => ({ ...p, accountName: e.target.value }))} placeholder="Name on the account" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#dc2626", fontSize: "0.85rem", fontWeight: 500 }}>
              {error}
            </div>
          )}
          {saved && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#166534", fontSize: "0.85rem", fontWeight: 600 }}>
              Payout method saved successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{ padding: "11px 22px", borderRadius: "10px", border: "none", background: saving ? "#d1fae5" : PRIMARY, color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving..." : "Save Payout Method"}
          </button>
        </form>
      </div>
    </div>
  );
}
