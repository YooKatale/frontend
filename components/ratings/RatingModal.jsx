"use client";

import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaCheckCircle, FaTimes } from "react-icons/fa";
import { DB_URL } from "@config/config";

/* ── Brand tokens — match app exactly ───────────────────────── */
const C = {
  bg:      "#0D0D0D",
  card:    "#111111",
  card2:   "#161616",
  border:  "rgba(255,255,255,0.07)",
  gold:    "#F5A623",
  goldDim: "rgba(245,166,35,0.10)",
  goldBrd: "rgba(245,166,35,0.22)",
  green:   "#185f2d",
  greenLt: "#1a7a36",
  white:   "#ffffff",
  text1:   "#f3f4f6",
  text2:   "#9ca3af",
  text3:   "#6b7280",
};
const font = { fontFamily: "'Sora','DM Sans',system-ui,sans-serif" };

const DRIVER_TAGS  = ["Fast Delivery", "Friendly", "Professional", "Careful with Food", "Late", "Rude"];
const VENDOR_TAGS  = ["Delicious", "Good Portions", "Would Order Again", "Wrong Items", "Cold Food", "Packaging Issue"];

/* ── Star picker ─────────────────────────────────────────────── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = hovered ? hovered >= s : value >= s;
        return (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 2,
              transform: filled ? "scale(1.18)" : "scale(1)",
              transition: "transform 0.15s",
            }}
          >
            {filled
              ? <FaStar style={{ width: 36, height: 36, color: C.gold }} />
              : <FaRegStar style={{ width: 36, height: 36, color: C.text3 }} />
            }
          </button>
        );
      })}
    </div>
  );
}

/* ── Tag chip ────────────────────────────────────────────────── */
function TagChip({ label, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        background: selected ? C.green : "transparent",
        color: selected ? C.white : C.text2,
        border: `1px solid ${selected ? C.green : "rgba(255,255,255,0.15)"}`,
      }}
    >
      {label}
    </button>
  );
}

/* ── Label for star value ────────────────────────────────────── */
const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];

/**
 * RatingModal — 2-step rating modal (driver + vendor/food).
 *
 * Props:
 *   isOpen              Boolean
 *   onClose             () => void
 *   orderId             String
 *   driverId            String
 *   driverName          String
 *   vendorName          String
 *   driverAlreadyRated  Boolean  — skip step 1 if true
 *   vendorAlreadyRated  Boolean  — skip step 2 if true
 */
export default function RatingModal({
  isOpen,
  onClose,
  orderId,
  driverId,
  driverName,
  vendorName,
  driverAlreadyRated = false,
  vendorAlreadyRated = false,
}) {
  // Determine starting step
  const startStep = driverAlreadyRated ? 2 : 1;
  const [step, setStep] = useState(startStep);
  const [pointsTotal, setPointsTotal] = useState(0);

  // Step 1 state
  const [driverRating, setDriverRating] = useState(0);
  const [driverComment, setDriverComment] = useState("");
  const [driverTags, setDriverTags] = useState([]);
  const [isSubmittingDriver, setIsSubmittingDriver] = useState(false);
  const [driverError, setDriverError] = useState("");

  // Step 2 state
  const [vendorRating, setVendorRating] = useState(0);
  const [vendorComment, setVendorComment] = useState("");
  const [vendorTags, setVendorTags] = useState([]);
  const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);
  const [vendorError, setVendorError] = useState("");

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(driverAlreadyRated ? 2 : 1);
      setDriverRating(0); setDriverComment(""); setDriverTags([]); setDriverError("");
      setVendorRating(0); setVendorComment(""); setVendorTags([]); setVendorError("");
      setPointsTotal(0);
    }
  }, [isOpen, driverAlreadyRated]);

  // Auto-close step 3 after 3s
  useEffect(() => {
    if (step !== 3) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [step, onClose]);

  const toggleDriverTag = (tag) =>
    setDriverTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const toggleVendorTag = (tag) =>
    setVendorTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const submitDriverRating = async () => {
    if (!driverRating) { setDriverError("Please select a star rating"); return; }
    if (!driverId) { advanceToVendor(0); return; }
    setIsSubmittingDriver(true);
    setDriverError("");
    try {
      const res = await fetch(`${DB_URL}/driver/${driverId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, rating: driverRating, comment: driverComment, tags: driverTags }),
      });
      const data = await res.json();
      const pts = data?.data?.pointsAwarded ?? 0;
      setPointsTotal((p) => p + pts);
      advanceToVendor(pts);
    } catch {
      setDriverError("Failed to submit. Please try again.");
    } finally {
      setIsSubmittingDriver(false);
    }
  };

  const advanceToVendor = (pts) => {
    if (vendorAlreadyRated) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const submitVendorRating = async () => {
    if (!vendorRating) { setVendorError("Please select a star rating"); return; }
    setIsSubmittingVendor(true);
    setVendorError("");
    try {
      const res = await fetch(`${DB_URL}/orders/${orderId}/rate-vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: vendorRating, comment: vendorComment, tags: vendorTags }),
      });
      const data = await res.json();
      const pts = data?.data?.pointsAwarded ?? 0;
      setPointsTotal((p) => p + pts);
      setStep(3);
    } catch {
      setVendorError("Failed to submit. Please try again.");
    } finally {
      setIsSubmittingVendor(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      ...font,
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 24, padding: "28px 24px",
        width: "100%", maxWidth: 400,
        position: "relative",
        animation: "rm-fadeIn 0.22s ease",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", cursor: "pointer",
            color: C.text3, padding: 4, display: "flex",
          }}
        >
          <FaTimes style={{ width: 18, height: 18 }} />
        </button>

        {/* ── Step indicator dots ── */}
        {step < 3 && (
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{
                width: s === step ? 20 : 8, height: 8, borderRadius: 4,
                background: s === step ? C.green : "rgba(255,255,255,0.12)",
                transition: "width 0.25s ease, background 0.25s ease",
              }} />
            ))}
          </div>
        )}

        {/* ══════════ STEP 1 — Rate Driver ══════════ */}
        {step === 1 && (
          <>
            <h2 style={{ color: C.text1, fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 4 }}>
              How was your delivery?
            </h2>
            <p style={{ color: C.text2, fontSize: 13, textAlign: "center", marginBottom: 24 }}>
              Rate {driverName || "your rider"}
            </p>

            <StarPicker value={driverRating} onChange={setDriverRating} />

            {driverRating > 0 && (
              <p style={{ textAlign: "center", color: C.gold, fontWeight: 700, fontSize: 14, marginTop: 10 }}>
                {STAR_LABELS[driverRating]}
              </p>
            )}

            {/* Tag chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", margin: "18px 0 14px" }}>
              {DRIVER_TAGS.map((tag) => (
                <TagChip key={tag} label={tag} selected={driverTags.includes(tag)} onToggle={() => toggleDriverTag(tag)} />
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={driverComment}
              onChange={(e) => setDriverComment(e.target.value)}
              maxLength={300}
              placeholder="Tell us more about your experience... (optional)"
              rows={3}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)",
                border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "10px 12px", color: C.text1, fontSize: 13,
                resize: "none", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", marginBottom: 8,
              }}
            />

            {driverError && (
              <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8, textAlign: "center" }}>{driverError}</p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => advanceToVendor(0)}
                style={{
                  flex: 1, padding: "12px 0", background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${C.border}`, borderRadius: 12,
                  color: C.text2, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Skip
              </button>
              <button
                onClick={submitDriverRating}
                disabled={isSubmittingDriver}
                style={{
                  flex: 2, padding: "12px 0",
                  background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
                  border: "none", borderRadius: 12,
                  color: C.white, fontSize: 13, fontWeight: 700,
                  cursor: isSubmittingDriver ? "not-allowed" : "pointer",
                  opacity: isSubmittingDriver ? 0.7 : 1, fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(24,95,45,0.3)",
                }}
              >
                {isSubmittingDriver ? "Submitting..." : "Submit & Continue"}
              </button>
            </div>
          </>
        )}

        {/* ══════════ STEP 2 — Rate Vendor/Food ══════════ */}
        {step === 2 && (
          <>
            <h2 style={{ color: C.text1, fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 4 }}>
              How was your food?
            </h2>
            <p style={{ color: C.text2, fontSize: 13, textAlign: "center", marginBottom: 24 }}>
              Rate your order{vendorName ? ` from ${vendorName}` : ""}
            </p>

            <StarPicker value={vendorRating} onChange={setVendorRating} />

            {vendorRating > 0 && (
              <p style={{ textAlign: "center", color: C.gold, fontWeight: 700, fontSize: 14, marginTop: 10 }}>
                {STAR_LABELS[vendorRating]}
              </p>
            )}

            {/* Tag chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", margin: "18px 0 14px" }}>
              {VENDOR_TAGS.map((tag) => (
                <TagChip key={tag} label={tag} selected={vendorTags.includes(tag)} onToggle={() => toggleVendorTag(tag)} />
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={vendorComment}
              onChange={(e) => setVendorComment(e.target.value)}
              maxLength={300}
              placeholder="Tell us more about your food... (optional)"
              rows={3}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)",
                border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "10px 12px", color: C.text1, fontSize: 13,
                resize: "none", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", marginBottom: 8,
              }}
            />

            {vendorError && (
              <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8, textAlign: "center" }}>{vendorError}</p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1, padding: "12px 0", background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${C.border}`, borderRadius: 12,
                  color: C.text2, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Skip
              </button>
              <button
                onClick={submitVendorRating}
                disabled={isSubmittingVendor}
                style={{
                  flex: 2, padding: "12px 0",
                  background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
                  border: "none", borderRadius: 12,
                  color: C.white, fontSize: 13, fontWeight: 700,
                  cursor: isSubmittingVendor ? "not-allowed" : "pointer",
                  opacity: isSubmittingVendor ? 0.7 : 1, fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(24,95,45,0.3)",
                }}
              >
                {isSubmittingVendor ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}

        {/* ══════════ STEP 3 — Thank You ══════════ */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <FaCheckCircle style={{ width: 60, height: 60, color: C.green }} />
            </div>
            <h2 style={{ color: C.text1, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              Thank you!
            </h2>
            <p style={{ color: C.text2, fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
              Your feedback helps us improve our service.
            </p>
            {pointsTotal > 0 && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(245,166,35,0.10)", border: "1px solid rgba(245,166,35,0.22)",
                borderRadius: 12, padding: "10px 20px", marginBottom: 20,
              }}>
                <FaCheckCircle style={{ width: 16, height: 16, color: C.gold }} />
                <span style={{ color: C.gold, fontWeight: 700, fontSize: 14 }}>
                  +{pointsTotal} loyalty points earned!
                </span>
              </div>
            )}
            <p style={{ color: C.text3, fontSize: 12, marginBottom: 20 }}>
              Closing automatically...
            </p>
            <button
              onClick={onClose}
              style={{
                padding: "12px 32px",
                background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`,
                border: "none", borderRadius: 12,
                color: C.white, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(24,95,45,0.3)",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rm-fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
