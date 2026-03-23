"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import { I, DRIVER_STYLES } from "@components/driver/DriverUI";

const DRIVER_KEY = "yookatale-driver";

/* ── Modal wrapper ── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
        width: "100%", maxWidth: 480, maxHeight: "85vh", overflow: "auto",
        animation: "slideUp 0.25s",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 32, height: 3, borderRadius: 2, background: "#d1d5db", margin: "10px auto 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 8px" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{title}</span>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 14, background: "#f3f4f6",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <I.X s={14} c="#6b7280" />
          </button>
        </div>
        <div style={{ padding: "0 16px 20px" }}>
          {children}
        </div>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ── Form field ── */
function Field({ label, value, onChange, disabled, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 8,
          border: "1px solid #e5e7eb", fontSize: 13, color: "#111",
          background: disabled ? "#f9fafb" : "#fff",
          outline: "none", boxSizing: "border-box",
          fontFamily: "'Bricolage Grotesque',sans-serif",
        }}
      />
    </div>
  );
}

/* ── Select field ── */
function SelectField({ label, value, onChange, options, disabled }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 8,
          border: "1px solid #e5e7eb", fontSize: 13, color: "#111",
          background: disabled ? "#f9fafb" : "#fff",
          outline: "none", boxSizing: "border-box",
          fontFamily: "'Bricolage Grotesque',sans-serif",
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

const MENU_ITEMS = [
  { l: "Personal Info", ic: I.User, bg: "#f0fdf4", cl: "#0d7c3b", modal: "personal" },
  { l: "Vehicle Details", ic: I.Bike, bg: "#eff6ff", cl: "#3b82f6", modal: "vehicle" },
  { l: "Documents", ic: I.Shield, bg: "#fefce8", cl: "#d97706", modal: "documents" },
  { l: "Payout Method", ic: I.Wallet, bg: "#f0fdfa", cl: "#14b8a6", modal: "payout" },
  { l: "Ratings & Reviews", ic: I.Star, bg: "#fef2f2", cl: "#ef4444", modal: "ratings" },
  { l: "Settings", ic: I.Gear, bg: "#f5f3ff", cl: "#8b5cf6", modal: "settings" },
];

export default function DriverProfilePage() {
  const router = useRouter();
  const [session, setSession]     = useState(null);
  const [dashData, setDashData]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted]     = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast]         = useState(null);
  const [saving, setSaving]       = useState(false);

  // Payout form state
  const [payoutPhone, setPayoutPhone]       = useState("");
  const [payoutProvider, setPayoutProvider]  = useState("MTN");
  const [payoutName, setPayoutName]          = useState("");

  // Ratings
  const [ratings, setRatings] = useState(null);

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

  const fetchDashboard = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res  = await fetch(`${DB_URL}/driver/dashboard/${session.driver._id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json();
      if (data?.status === "Success") {
        setDashData(data.data);
        // Populate payout form from existing data
        const pm = data.data?.driver?.payoutMethod;
        if (pm) {
          setPayoutPhone(pm.phone || "");
          setPayoutProvider(pm.provider || "MTN");
          setPayoutName(pm.accountName || "");
        }
      }
    } catch {}
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const load = async () => { setIsLoading(true); await fetchDashboard(); setIsLoading(false); };
    load();
  }, [session, fetchDashboard]);

  const fetchRatings = useCallback(async () => {
    if (!session?.driver?._id) return;
    try {
      const res = await fetch(`${DB_URL}/driver/${session.driver._id}/ratings`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json();
      if (data?.status === "Success") setRatings(data.data);
    } catch {}
  }, [session]);

  const handleOpenModal = (modal) => {
    setActiveModal(modal);
    if (modal === "ratings" && !ratings) fetchRatings();
  };

  const handleSavePayout = async () => {
    if (!session?.driver?._id || !payoutPhone) return;
    setSaving(true);
    try {
      const res = await fetch(`${DB_URL}/driver/${session.driver._id}/payout-method`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          phone: payoutPhone,
          provider: payoutProvider,
          accountName: payoutName,
        }),
      });
      const data = await res.json();
      if (data?.status === "Success") {
        showToast("Payout method saved!");
        setActiveModal(null);
        await fetchDashboard();
      } else {
        showToast(data?.message || "Failed to save", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    try { localStorage.removeItem(DRIVER_KEY); } catch {}
    router.replace("/driver/login");
  };

  if (!mounted) return null;

  const driver     = dashData?.driver || session?.driver || {};
  const driverName = driver?.name || driver?.fullName || "Driver";
  const email      = driver?.email || "";
  const phone      = driver?.phone || "";
  const avatar     = driver?.profilePicture || driver?.profileImage || driver?.avatar || "";
  const initials   = driverName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "D";
  const totalDel   = dashData?.totalDeliveries || driver?.totalDeliveries || 0;
  const rating     = (driver?.averageRating || 0).toFixed(1);
  const acceptance = driver?.acceptanceRate != null ? `${driver.acceptanceRate}%` : "N/A";
  const transport  = driver?.transport || "motorcycle";
  const plate      = driver?.numberPlate || "";

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <style>{DRIVER_STYLES}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 99999,
          padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 12,
          display: "flex", alignItems: "center", gap: 6, animation: "fadeIn 0.25s",
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(13,124,59,0.95)",
          color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          {toast.type === "error" ? <I.X s={14} c="#fff" /> : <I.Check s={14} c="#fff" />}
          {toast.msg}
        </div>
      )}

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

            {/* Badges row */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
              <div style={{ padding: "3px 10px", borderRadius: 12, background: "#fefce8", border: "1px solid #fef3c7", fontSize: 10, fontWeight: 600, color: "#d97706", display: "flex", alignItems: "center", gap: 4 }}>
                <I.Star s={10} c="#d97706" f="#d97706" /> {rating}
              </div>
              <div style={{ padding: "3px 10px", borderRadius: 12, background: "#eff6ff", border: "1px solid #dbeafe", fontSize: 10, fontWeight: 600, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4 }}>
                <I.Bike s={10} c="#3b82f6" /> {transport}
              </div>
              {plate && (
                <div style={{ padding: "3px 10px", borderRadius: 12, background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: 10, fontWeight: 700, color: "#374151", fontFamily: "'Azeret Mono',monospace" }}>
                  {plate}
                </div>
              )}
            </div>
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
              <button key={idx} onClick={() => handleOpenModal(item.modal)} style={{
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

      {/* ── Personal Info Modal ── */}
      <Modal open={activeModal === "personal"} onClose={() => setActiveModal(null)} title="Personal Info">
        <div style={{ marginTop: 8 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {avatar ? (
              <img src={avatar} alt={driverName} style={{ width: 64, height: 64, borderRadius: 32, objectFit: "cover", border: "2px solid #0d7c3b" }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: 32, background: "linear-gradient(135deg,#0d7c3b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 20, fontWeight: 800, color: "#fff" }}>{initials}</div>
            )}
          </div>
          <Field label="Full Name" value={driverName} disabled />
          <Field label="Email Address" value={email} disabled />
          <Field label="Phone Number" value={phone} disabled />
          <Field label="Transport Type" value={transport} disabled />
          {plate && <Field label="Number Plate" value={plate} disabled />}
          <div style={{ padding: "8px 0", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Contact support to update your personal information</span>
          </div>
        </div>
      </Modal>

      {/* ── Vehicle Details Modal ── */}
      <Modal open={activeModal === "vehicle"} onClose={() => setActiveModal(null)} title="Vehicle Details">
        <div style={{ marginTop: 8 }}>
          <div style={{
            textAlign: "center", padding: 20, background: "#eff6ff", borderRadius: 12, marginBottom: 16,
          }}>
            <I.Bike s={40} c="#3b82f6" />
          </div>
          <Field label="Vehicle Type" value={transport === "motorcycle" ? "Motorcycle" : transport === "bike" ? "Bicycle" : transport === "vehicle" ? "Car/Van" : transport} disabled />
          <Field label="Number Plate" value={plate || "Not set"} disabled />
          <Field label="Service Area" value={driver?.serviceArea ? `${driver.serviceArea.radiusKm || "?"}km radius` : "Not configured"} disabled />
          <div style={{ padding: "8px 0", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Contact support to update vehicle details</span>
          </div>
        </div>
      </Modal>

      {/* ── Documents Modal ── */}
      <Modal open={activeModal === "documents"} onClose={() => setActiveModal(null)} title="Documents">
        <div style={{ marginTop: 8 }}>
          {[
            { name: "National ID", status: driver?.nationalIdVerified ? "verified" : "pending", icon: I.Shield },
            { name: "Driving License", status: driver?.licenseVerified ? "verified" : "pending", icon: I.Shield },
            { name: "Vehicle Registration", status: driver?.vehicleRegVerified ? "verified" : "pending", icon: I.Shield },
          ].map((doc, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px", background: "#fff", border: "1px solid #f3f4f6",
              borderRadius: 10, marginBottom: 6,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: "#fefce8",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <doc.icon s={16} c="#d97706" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{doc.name}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>Required for verification</div>
              </div>
              <div style={{
                padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600,
                background: doc.status === "verified" ? "#f0fdf4" : "#fefce8",
                color: doc.status === "verified" ? "#0d7c3b" : "#d97706",
                border: `1px solid ${doc.status === "verified" ? "#dcfce7" : "#fef3c7"}`,
              }}>
                {doc.status === "verified" ? "Verified" : "Pending"}
              </div>
            </div>
          ))}
          <div style={{ padding: "12px 0 4px", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Document uploads managed by admin. Contact support for updates.</span>
          </div>
        </div>
      </Modal>

      {/* ── Payout Method Modal (FUNCTIONAL) ── */}
      <Modal open={activeModal === "payout"} onClose={() => setActiveModal(null)} title="Payout Method">
        <div style={{ marginTop: 8 }}>
          <div style={{
            padding: "10px 12px", background: "#f0fdfa", borderRadius: 8, marginBottom: 14,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <I.Wallet s={16} c="#14b8a6" />
            <span style={{ fontSize: 11, color: "#14b8a6", fontWeight: 600 }}>Mobile Money Payout</span>
          </div>
          <SelectField
            label="Provider"
            value={payoutProvider}
            onChange={setPayoutProvider}
            options={[
              { value: "MTN", label: "MTN Mobile Money" },
              { value: "AIRTEL", label: "Airtel Money" },
            ]}
          />
          <Field
            label="Phone Number"
            value={payoutPhone}
            onChange={setPayoutPhone}
            placeholder="e.g. 0771234567"
            type="tel"
          />
          <Field
            label="Account Name"
            value={payoutName}
            onChange={setPayoutName}
            placeholder="Name on mobile money account"
          />
          <button
            onClick={handleSavePayout}
            disabled={saving || !payoutPhone}
            style={{
              width: "100%", padding: "12px", borderRadius: 10, marginTop: 4,
              background: saving || !payoutPhone ? "#d1d5db" : "#0d7c3b",
              color: "#fff", fontWeight: 700, fontSize: 13,
              border: "none", cursor: saving || !payoutPhone ? "not-allowed" : "pointer",
              fontFamily: "'Bricolage Grotesque',sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {saving ? (
              <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <I.Check s={14} c="#fff" />
            )}
            {saving ? "Saving..." : "Save Payout Method"}
          </button>
        </div>
      </Modal>

      {/* ── Ratings Modal ── */}
      <Modal open={activeModal === "ratings"} onClose={() => setActiveModal(null)} title="Ratings & Reviews">
        <div style={{ marginTop: 8 }}>
          {/* Summary */}
          <div style={{ textAlign: "center", padding: "16px", background: "#fefce8", borderRadius: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#111", lineHeight: 1 }}>{rating}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 2, margin: "6px 0" }}>
              {[1,2,3,4,5].map(s => (
                <I.Star key={s} s={16} c={s <= Math.round(driver?.averageRating || 0) ? "#d97706" : "#e5e7eb"} f={s <= Math.round(driver?.averageRating || 0) ? "#d97706" : "none"} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>{driver?.ratingCount || 0} reviews</div>
          </div>

          {/* Reviews list */}
          {ratings?.reviews?.length > 0 ? (
            ratings.reviews.slice(0, 10).map((r, i) => (
              <div key={i} style={{
                padding: "10px 12px", background: "#fff", border: "1px solid #f3f4f6",
                borderRadius: 8, marginBottom: 4,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <I.Star key={s} s={10} c={s <= (r.rating || 0) ? "#d97706" : "#e5e7eb"} f={s <= (r.rating || 0) ? "#d97706" : "none"} />
                    ))}
                  </div>
                  <span style={{ fontSize: 9, color: "#9ca3af" }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-UG", { month: "short", day: "numeric" }) : ""}
                  </span>
                </div>
                {r.comment && <div style={{ fontSize: 12, color: "#374151" }}>{r.comment}</div>}
                {r.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                    {r.tags.map((t, j) => (
                      <span key={j} style={{ padding: "2px 8px", borderRadius: 8, background: "#f3f4f6", fontSize: 9, color: "#6b7280", fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <I.Star s={28} c="#d1d5db" />
              <div style={{ fontWeight: 700, fontSize: 13, color: "#111", marginTop: 8 }}>No reviews yet</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Complete deliveries to receive ratings</div>
            </div>
          )}
        </div>
      </Modal>

      {/* ── Settings Modal ── */}
      <Modal open={activeModal === "settings"} onClose={() => setActiveModal(null)} title="Settings">
        <div style={{ marginTop: 8 }}>
          {[
            { name: "Push Notifications", desc: "Order alerts and updates", enabled: !!driver?.fcmToken },
            { name: "Location Sharing", desc: "Share live location during deliveries", enabled: true },
            { name: "Sound Alerts", desc: "Play sound for new orders", enabled: true },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px", background: "#fff", border: "1px solid #f3f4f6",
              borderRadius: 10, marginBottom: 4,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{s.desc}</div>
              </div>
              <div style={{
                width: 36, height: 20, borderRadius: 10,
                background: s.enabled ? "#0d7c3b" : "#d1d5db",
                position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 8,
                  background: "#fff", position: "absolute", top: 2,
                  left: s.enabled ? 18 : 2,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }} />
              </div>
            </div>
          ))}
          <div style={{ padding: "12px 0 4px" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>App Version 1.0.0</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
