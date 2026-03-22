"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import StarDisplay from "@components/ratings/StarDisplay";
import {
  FaUserCircle, FaMotorcycle, FaCar, FaBicycle,
  FaCheckCircle, FaClock, FaTimesCircle,
  FaEnvelope, FaPhone, FaTruck, FaIdCard, FaCalendarAlt,
  FaMoneyBillWave, FaSignOutAlt, FaEdit,
} from "react-icons/fa";

const DRIVER_KEY = "yookatale-driver";
const PRIMARY    = "#0d7c3b";

const C = {
  bg:      "#f4f5f7",
  card:    "#ffffff",
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

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...style }}>
    {children}
  </div>
);

function TransportIcon({ type }) {
  const t = (type || "").toLowerCase();
  const s = { width: 16, height: 16 };
  if (t.includes("car"))    return <FaCar style={s} />;
  if (t.includes("bike") || t.includes("bicy")) return <FaBicycle style={s} />;
  return <FaMotorcycle style={s} />;
}

export default function DriverProfilePage() {
  const router = useRouter();
  const [session, setSession]       = useState(null);
  const [driver, setDriver]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm]   = useState({ provider: "MTN", phone: "" });
  const [savingPayout, setSavingPayout] = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRIVER_KEY);
      if (!stored) { router.replace("/driver/login"); return; }
      const parsed = JSON.parse(stored);
      if (!parsed?.token || !parsed?.driver?._id) { router.replace("/driver/login"); return; }
      setSession(parsed);
    } catch { router.replace("/driver/login"); }
  }, [router]);

  useEffect(() => {
    if (!session?.driver?._id) return;
    fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.status === "Success") {
          setDriver(d.data.driver || session.driver);
          const pm = d.data.driver?.payoutMethod;
          if (pm?.phone) setPayoutForm({ provider: pm.provider || "MTN", phone: pm.phone });
        }
      })
      .catch(() => { setDriver(session.driver); })
      .finally(() => setLoading(false));
  }, [session]);

  const savePayoutMethod = async () => {
    if (!payoutForm.phone || !session?.driver?._id) {
      showToast("Please enter a phone number", "error");
      return;
    }
    const cleanPhone = payoutForm.phone.replace(/\s+/g, "");
    if (cleanPhone.length < 10) {
      showToast("Enter a valid phone number", "error");
      return;
    }
    setSavingPayout(true);
    try {
      const body = {
        phone: cleanPhone,
        provider: payoutForm.provider || "MTN",
        accountName: session.driver.name || "",
      };
      const res = await fetch(`${DB_URL}/driver/${session.driver._id}/payout-method`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && (data?.status === "Success" || data?.data)) {
        setDriver((prev) => prev ? { ...prev, payoutMethod: { ...body, type: "mobile_money" } } : prev);
        showToast("Payout method saved successfully!");
        setPayoutModal(false);
      } else {
        showToast(data?.message || data?.error || "Failed to save payout method", "error");
      }
    } catch (err) {
      showToast("Network error. Please check your connection.", "error");
    } finally {
      setSavingPayout(false);
    }
  };

  const logout = () => {
    try { localStorage.removeItem(DRIVER_KEY); } catch {}
    router.replace("/driver/login");
  };

  const verificationBadge = () => {
    const st = (driver?.status || "").toLowerCase();
    if (st === "verified")   return { Icon: FaCheckCircle, color: "#10b981", label: "Verified" };
    if (st === "rejected")   return { Icon: FaTimesCircle, color: C.red,     label: "Rejected" };
    return { Icon: FaClock, color: C.amber, label: "Pending" };
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${PRIMARY}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const vBadge = verificationBadge();
  const d      = driver || session?.driver || {};

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
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px 16px 14px", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <p style={{ fontWeight: 800, fontSize: 18, color: C.text1 }}>My Profile</p>
      </header>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Avatar + name card */}
        <Card style={{ padding: "24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            {d.profilePicture || d.avatar ? (
              <img
                src={d.profilePicture || d.avatar}
                alt={d.name || "Driver"}
                style={{
                  width: 68, height: 68, borderRadius: "50%", objectFit: "cover",
                  border: `3px solid ${C.amberBrd}`, flexShrink: 0,
                }}
              />
            ) : (
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.green}, ${C.amber})`,
                border: `3px solid ${C.amberBrd}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, fontWeight: 800, color: C.white, flexShrink: 0,
              }}>
                {(d.name || "D")[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: C.text1, marginBottom: 6 }}>{d.name || "Driver"}</h2>
              <StarDisplay rating={d.averageRating || 0} count={d.ratingCount || 0} size="sm" />
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <vBadge.Icon style={{ width: 13, height: 13, color: vBadge.color }} />
                <span style={{ fontSize: 12, color: vBadge.color, fontWeight: 600 }}>{vBadge.label}</span>
              </div>
            </div>
          </div>

          {/* Vehicle badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 999, background: C.amberDim, border: `1px solid ${C.amberBrd}`, marginBottom: 20 }}>
            <TransportIcon type={d.transport} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.amber, textTransform: "capitalize" }}>{d.transport || "Rider"}</span>
          </div>

          {/* Info rows */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { Icon: FaEnvelope,    label: "Email",        value: d.email },
              { Icon: FaPhone,       label: "Phone",        value: d.phone },
              { Icon: FaIdCard,      label: "Number Plate", value: d.numberPlate },
              { Icon: FaTruck,       label: "Total Trips",  value: d.totalDeliveries ? `${d.totalDeliveries} deliveries` : null },
              { Icon: FaCalendarAlt, label: "Member Since", value: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-UG", { year: "numeric", month: "long" }) : null },
            ].filter((r) => r.value).map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.amberDim, border: `1px solid ${C.amberBrd}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <row.Icon style={{ width: 14, height: 14, color: C.amber }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{row.label}</p>
                  <p style={{ fontSize: 13, color: C.text1, fontWeight: 500, marginTop: 1 }}>{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payout Method Card */}
        <Card style={{ padding: "18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase" }}>Payout Method</p>
            <button
              onClick={() => setPayoutModal(true)}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: PRIMARY, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}
            >
              <FaEdit style={{ width: 12, height: 12 }} />
              Edit
            </button>
          </div>
          {d.payoutMethod?.phone ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.amberDim, border: `1px solid ${C.amberBrd}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FaMoneyBillWave style={{ width: 18, height: 18, color: C.amber }} />
              </div>
              <div>
                <p style={{ color: C.text1, fontSize: 14, fontWeight: 600 }}>{d.payoutMethod.provider === "AIRTEL" ? "Airtel" : d.payoutMethod.provider} Mobile Money</p>
                <p style={{ color: C.text3, fontSize: 12, marginTop: 2 }}>{d.payoutMethod.phone}</p>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: C.text3 }}>No payout method set. Tap Edit to add one.</p>
          )}
        </Card>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            width: "100%", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: 14, padding: "13px 0", color: C.red, fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, fontFamily: "inherit", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.04)"; }}
        >
          <FaSignOutAlt style={{ width: 16, height: 16 }} />
          Sign Out
        </button>
      </div>

      {/* Edit Payout Modal */}
      {payoutModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 480, boxShadow: "0 -10px 40px rgba(0,0,0,0.1)" }}>
            <p style={{ fontWeight: 800, fontSize: 17, color: C.text1, marginBottom: 18 }}>Edit Payout Method</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: C.text3, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Provider</p>
              <div style={{ display: "flex", gap: 8 }}>
                {["MTN", "AIRTEL"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPayoutForm((f) => ({ ...f, provider: p }))}
                    style={{
                      padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                      background: payoutForm.provider === p ? PRIMARY : C.card,
                      color: payoutForm.provider === p ? C.white : C.text2,
                      border: `1px solid ${payoutForm.provider === p ? PRIMARY : C.border}`,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 11, color: C.text3, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Phone Number</p>
              <input
                type="tel"
                placeholder="e.g. 0771234567"
                value={payoutForm.phone}
                onChange={(e) => setPayoutForm((f) => ({ ...f, phone: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: "#f9fafb", border: `1px solid ${C.border}`, color: C.text1, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPayoutModal(false)} style={{ flex: 1, padding: 12, borderRadius: 12, background: "none", border: `1px solid ${C.border}`, color: C.text2, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button
                onClick={savePayoutMethod}
                disabled={savingPayout || !payoutForm.phone}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: PRIMARY, color: C.white, fontWeight: 700, fontSize: 13, border: "none", cursor: savingPayout ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: savingPayout ? 0.7 : 1 }}
              >
                {savingPayout ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
