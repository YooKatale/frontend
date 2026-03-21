"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DB_URL } from "@config/config";
import { useOrderTracking } from "@hooks/useOrderTracking";

/* ── Brand tokens ─────────────────────────────────────────── */
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
  blue:    "#3b82f6",
  red:     "#ef4444",
};

// Polling replaced by Socket.IO — kept only as a fallback constant (unused)
// const POLL_MS = 5000;

const STATUS_FLOW = [
  { key: "pending",    label: "Order Placed",    desc: "Your order has been received" },
  { key: "confirmed",  label: "Confirmed",        desc: "Your order is confirmed" },
  { key: "assigned",   label: "Driver Assigned",  desc: "A rider is heading to collect your order" },
  { key: "picked_up",  label: "Picked Up",        desc: "Rider has your order" },
  { key: "in_transit", label: "On the Way",       desc: "Rider is heading to you" },
  { key: "delivered",  label: "Delivered",        desc: "Your order has arrived!" },
];
const STATUS_IDX = Object.fromEntries(STATUS_FLOW.map((s, i) => [s.key, i]));

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Inline SVG icons ─────────────────────────────────────── */
const IcoBack   = () => <svg style={ico(16)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const IcoPhone  = () => <svg style={ico(16)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>;
const IcoStar   = ({ fill }) => <svg style={{ width: 20, height: 20 }} fill={fill ? C.gold : "none"} viewBox="0 0 24 24" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoPin    = () => <svg style={ico(15)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IcoMap    = () => <svg style={ico(15)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>;
const IcoClock  = () => <svg style={ico(14)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoCheck  = () => <svg style={ico(16)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoMoto   = () => <svg style={ico(20)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5h7M15 17.5V9l-3-5h-2L8 9h4l2 3"/><path d="M19 9h-4M5.5 15l1.5-6h2"/></svg>;
const IcoSpinner = () => <svg style={{ ...ico(24), animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IcoClose  = () => <svg style={ico(18)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoMsg    = () => <svg style={ico(15)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;

function ico(w = 16) { return { width: w, height: w, flexShrink: 0 }; }

const font = { fontFamily: "'Sora','DM Sans',system-ui,sans-serif" };

/* ── Star Picker ──────────────────────────────────────────── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {[1,2,3,4,5].map((s) => (
        <button
          key={s}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, transform: (hovered >= s || value >= s) ? "scale(1.2)" : "scale(1)", transition: "transform 0.15s" }}
        >
          <IcoStar fill={hovered >= s || value >= s} />
        </button>
      ))}
    </div>
  );
}

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRateModal, setShowRateModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const justRated = useRef(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [eta, setEta] = useState(null);         // { durationSeconds, durationText, distanceText }
  const [countdown, setCountdown] = useState(null); // remaining seconds (ticks locally)
  const countdownTimer = useRef(null);

  // Real-time socket hook — overlay status + driver location + ETA updates
  const { socketStatus, driverLocation, socketEta } = useOrderTracking(orderId);

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch(`${DB_URL}/delivery/order/${orderId}/live`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Order not found");
      setLiveData(data.data);
      if (data.data?.eta) setEta(data.data.eta);
      setError("");
    } catch (e) {
      setError(e.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // One initial fetch only — sockets handle all subsequent updates
  useEffect(() => {
    fetchLive();
  }, [fetchLive]);

  const showStatusToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  // Apply real-time status updates from socket
  useEffect(() => {
    if (!socketStatus?.status) return;
    setLiveData((prev) =>
      prev ? { ...prev, orderStatus: socketStatus.status } : prev
    );
    // Toast for every status update
    if (socketStatus.message) showStatusToast(socketStatus.message);
    // Auto-open rating modal when order is delivered
    if (socketStatus.status === "delivered") {
      setTimeout(() => {
        setShowRateModal((open) => {
          if (!open && !justRated.current) return true;
          return open;
        });
      }, 1500);
    }
  }, [socketStatus]);

  // Apply real-time driver location from socket
  useEffect(() => {
    if (!driverLocation) return;
    setLiveData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        driver: prev.driver
          ? { ...prev.driver, location: { lat: driverLocation.lat, lng: driverLocation.lng, updatedAt: new Date().toISOString() } }
          : prev.driver,
      };
    });
  }, [driverLocation]);

  // Update ETA from socket (every ~30s from server)
  useEffect(() => {
    if (!socketEta) return;
    setEta(socketEta);
  }, [socketEta]);

  // Countdown tick — resets when eta.durationSeconds changes, ticks down every second
  useEffect(() => {
    if (!eta?.durationSeconds) return;
    setCountdown(eta.durationSeconds);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    countdownTimer.current = setInterval(() => {
      setCountdown((s) => (s != null && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(countdownTimer.current);
  }, [eta?.durationSeconds]);

  const submitRating = async () => {
    if (!rating || !liveData?.driver?._id) return;
    setIsSubmittingRating(true);
    try {
      await fetch(`${DB_URL}/driver/${liveData.driver._id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, rating, comment: ratingComment }),
      });
      justRated.current = true;
      setRatingSubmitted(true);
      setShowRateModal(false);
    } catch {}
    finally { setIsSubmittingRating(false); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, ...font }}>
      <IcoSpinner />
      <p style={{ color: C.text3, fontSize: 14 }}>Loading your order...</p>
    </div>
  );

  /* ── Error ── */
  if (error || !liveData) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, ...font }}>
      <div style={{ fontSize: 48, color: C.text3 }}>
        <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      </div>
      <h2 style={{ color: C.text1, fontSize: 20, fontWeight: 700 }}>Order Not Found</h2>
      <p style={{ color: C.text2, fontSize: 14, textAlign: "center" }}>{error}</p>
      <Link href="/" style={{ padding: "10px 24px", background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`, color: C.white, borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
        Back to Home
      </Link>
    </div>
  );

  const { orderStatus, driver, delivery, deliveryAddress, total, trackingHistory } = liveData;
  const currentIdx = STATUS_IDX[orderStatus] ?? 0;
  const isDelivered = orderStatus === "delivered";
  const isCancelled = orderStatus === "cancelled";
  const hasDriver = !!driver;
  const canRate = isDelivered && hasDriver && !delivery?.rated && !ratingSubmitted && !justRated.current;

  /* ETA display — server ETA preferred; haversine client fallback */
  const etaDisplay = useMemo(() => {
    if (eta?.durationText) {
      const secs = countdown != null ? countdown : eta.durationSeconds;
      const mins = Math.floor(secs / 60);
      const sec  = secs % 60;
      const countdownStr = secs <= 0 ? "Arriving now" : mins > 0 ? `${mins}m ${sec}s` : `${sec}s`;
      return { text: countdownStr, dist: eta.distanceText, fromServer: true };
    }
    if (driver?.location?.lat && driver?.location?.lng && deliveryAddress?.lat && deliveryAddress?.lng) {
      const km = haversineKm(driver.location.lat, driver.location.lng, deliveryAddress.lat, deliveryAddress.lng);
      const mins = Math.max(1, Math.round(km / 0.4));
      return {
        text: km < 0.2 ? "Almost there!" : `~${mins} min`,
        dist: `${km.toFixed(1)} km`,
        fromServer: false,
      };
    }
    return null;
  }, [eta, countdown, driver, deliveryAddress]);

  /* Google Maps embed */
  let mapSrc = null;
  if (driver?.location?.lat && driver?.location?.lng) {
    const lat = driver.location.lat;
    const lng = driver.location.lng;
    mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  /* Nav link */
  const navUrl = deliveryAddress?.lat && deliveryAddress?.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${deliveryAddress.lat},${deliveryAddress.lng}&travelmode=driving`
    : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text1, ...font }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes ping  { 0%{transform:scale(1);opacity:0.8;} 100%{transform:scale(2.2);opacity:0;} }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        .track-card { animation: fadeIn 0.3s ease both; }
      `}</style>

      {/* ── Status Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          background: C.green, color: C.white, padding: "10px 20px", borderRadius: 10,
          fontWeight: 600, fontSize: 14, zIndex: 1000, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          animation: "slideDown 0.3s ease", whiteSpace: "nowrap", maxWidth: "90vw",
          textAlign: "center",
        }}>
          {toast}
        </div>
      )}

      {/* ── Rate Driver Modal ── */}
      {showRateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(6px)" }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: "32px 28px", width: "100%", maxWidth: 380, position: "relative", animation: "fadeIn 0.25s ease" }}>
            <button onClick={() => setShowRateModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: C.text3 }}>
              <IcoClose />
            </button>

            {/* Driver avatar */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: C.gold, margin: "0 auto 12px" }}>
                {(driver?.name || "D")[0].toUpperCase()}
              </div>
              <h3 style={{ color: C.text1, fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Rate your delivery</h3>
              <p style={{ color: C.text2, fontSize: 13 }}>How was {driver?.name || "your rider"}'s service?</p>
            </div>

            {/* Stars */}
            <div style={{ marginBottom: 20 }}>
              <StarPicker value={rating} onChange={setRating} />
              {rating > 0 && (
                <p style={{ textAlign: "center", color: C.gold, fontSize: 13, fontWeight: 600, marginTop: 10 }}>
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Leave a comment (optional)..."
              rows={3}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text1, fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            />

            <button
              onClick={submitRating}
              disabled={!rating || isSubmittingRating}
              style={{
                width: "100%", marginTop: 14,
                background: !rating ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${C.gold}, #f7c05a)`,
                border: "none", borderRadius: 12, padding: "13px 0",
                color: !rating ? C.text3 : "#000",
                fontWeight: 700, fontSize: 14, cursor: !rating ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: "inherit",
              }}
            >
              {isSubmittingRating ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(13,13,13,0.95)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: C.text2, textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
            <IcoBack />
            Back
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/assets/icons/logo2.png" alt="Yookatale" width={28} height={28} style={{ borderRadius: 7, objectFit: "cover" }} />
            <span style={{ color: C.text1, fontWeight: 700, fontSize: 14 }}>Order Tracking</span>
          </div>
          {/* Live pulse */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative", width: 10, height: 10 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: isDelivered ? C.gold : "#10b981", animation: "ping 1.5s ease-out infinite" }} />
              <div style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", background: isDelivered ? C.gold : "#10b981" }} />
            </div>
            <span style={{ fontSize: 11, color: isDelivered ? C.gold : "#10b981", fontWeight: 600 }}>
              {isDelivered ? "Delivered" : "Live"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Status Banner ── */}
        <div className="track-card" style={{
          background: isDelivered
            ? `linear-gradient(135deg, rgba(16,185,129,0.12), rgba(24,95,45,0.08))`
            : isCancelled
            ? "rgba(239,68,68,0.08)"
            : `linear-gradient(135deg, rgba(245,166,35,0.08), rgba(24,95,45,0.06))`,
          border: `1px solid ${isDelivered ? "rgba(16,185,129,0.3)" : isCancelled ? "rgba(239,68,68,0.25)" : C.goldBrd}`,
          borderRadius: 20,
          padding: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: C.text3, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Order #{String(liveData._id || orderId).slice(-8).toUpperCase()}
              </p>
              <h1 style={{ color: C.text1, fontSize: 22, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 4 }}>
                {isDelivered ? "Order Delivered!" : isCancelled ? "Order Cancelled" : STATUS_FLOW[currentIdx]?.label}
              </h1>
              <p style={{ color: C.text2, fontSize: 13, lineHeight: 1.5 }}>
                {isCancelled ? "This order was cancelled" : STATUS_FLOW[currentIdx]?.desc}
              </p>
            </div>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: isDelivered ? "rgba(16,185,129,0.15)" : C.goldDim, border: `1px solid ${isDelivered ? "rgba(16,185,129,0.3)" : C.goldBrd}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isDelivered
                ? <IcoCheck />
                : isCancelled
                ? <svg style={ico(22)} fill="none" viewBox="0 0 24 24" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                : <IcoMoto />
              }
            </div>
          </div>

          {/* ETA */}
          {etaDisplay && !isDelivered && !isCancelled && (
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 999, padding: "5px 14px" }}>
                <IcoClock />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{etaDisplay.text}</span>
              </div>
              {etaDisplay.dist && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
                  <IcoPin />
                  <span style={{ fontSize: 12, color: C.text2 }}>{etaDisplay.dist} away</span>
                </div>
              )}
            </div>
          )}

          {/* Order total */}
          {total && (
            <div style={{ marginTop: etaDisplay ? 10 : 14, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.text3, fontSize: 12 }}>Order total:</span>
              <span style={{ color: C.gold, fontWeight: 700, fontSize: 14 }}>UGX {Number(total).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* ── Live Map ── */}
        {mapSrc && !isDelivered && (
          <div className="track-card" style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ padding: "12px 16px", background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "ping 1.5s ease-out infinite" }} />
                <span style={{ color: C.text1, fontWeight: 600, fontSize: 13 }}>Live Driver Location</span>
              </div>
              {navUrl && (
                <a href={navUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.blue, textDecoration: "none", fontWeight: 600 }}>
                  <IcoMap />
                  Directions
                </a>
              )}
            </div>
            <div style={{ height: 220, position: "relative" }}>
              <iframe
                src={mapSrc}
                style={{ width: "100%", height: "100%", border: "none" }}
                loading="lazy"
                title="Driver location"
              />
            </div>
          </div>
        )}

        {/* ── Driver Card ── */}
        {hasDriver && (
          <div className="track-card" style={{ background: C.card, border: `1px solid ${C.goldBrd}`, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 3 }}>
              <IcoMoto />
              <span style={{ color: C.text3, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: 6 }}>Your Rider</span>
            </div>
            <div style={{ padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.green}, ${C.goldDim})`, border: `2px solid ${C.goldBrd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: C.gold, flexShrink: 0 }}>
                  {(driver.name || "D")[0].toUpperCase()}
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text1, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{driver.name}</p>
                  {/* Stars */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} style={{ width: 12, height: 12 }} fill={s <= Math.round(driver.averageRating) ? C.gold : "none"} viewBox="0 0 24 24" stroke={C.gold} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                    <span style={{ color: C.text3, fontSize: 11 }}>{driver.averageRating?.toFixed(1)} ({driver.ratingCount} trips)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, background: C.goldDim, color: C.gold, border: `1px solid ${C.goldBrd}`, borderRadius: 6, padding: "2px 8px", fontWeight: 600, textTransform: "capitalize" }}>
                      {driver.transport}
                    </span>
                    {driver.numberPlate && (
                      <span style={{ fontSize: 11, color: C.text3, fontFamily: "monospace" }}>{driver.numberPlate}</span>
                    )}
                  </div>
                </div>
                {/* Call button */}
                {driver.phone && (
                  <a
                    href={`tel:${driver.phone}`}
                    style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${C.green}, ${C.greenLt})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textDecoration: "none", boxShadow: "0 4px 16px rgba(24,95,45,0.35)" }}
                  >
                    <IcoPhone />
                  </a>
                )}
              </div>

              {/* Driver GPS freshness */}
              {driver.location?.updatedAt && (
                <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "ping 2s ease-out infinite" }} />
                  <span style={{ color: C.text3, fontSize: 11 }}>
                    Location updated {Math.round((Date.now() - new Date(driver.location.updatedAt)) / 1000)}s ago
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Progress Timeline ── */}
        {!isCancelled && (
          <div className="track-card" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 18px" }}>
            <p style={{ color: C.text3, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>Delivery Progress</p>
            <div style={{ position: "relative" }}>
              {/* Connector line */}
              <div style={{ position: "absolute", left: 11, top: 12, bottom: 12, width: 2, background: `linear-gradient(to bottom, ${C.gold} ${(currentIdx / (STATUS_FLOW.length - 1)) * 100}%, rgba(255,255,255,0.08) ${(currentIdx / (STATUS_FLOW.length - 1)) * 100}%)`, borderRadius: 2 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {STATUS_FLOW.map((step, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div key={step.key} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", position: "relative" }}>
                      {/* Dot */}
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                        background: done ? (active ? C.gold : "rgba(245,166,35,0.3)") : "rgba(255,255,255,0.05)",
                        border: `2px solid ${done ? C.gold : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: active ? `0 0 12px ${C.gold}60` : "none",
                        transition: "all 0.3s",
                      }}>
                        {done && <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke={active ? "#000" : C.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      {/* Text */}
                      <div style={{ paddingTop: 1 }}>
                        <p style={{ fontWeight: active ? 700 : 500, fontSize: 13, color: done ? (active ? C.gold : C.text2) : C.text3 }}>{step.label}</p>
                        {active && <p style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{step.desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Delivery Address ── */}
        {deliveryAddress && (
          <div className="track-card" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IcoPin />
              </div>
              <div>
                <p style={{ color: C.text3, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Delivery Address</p>
                <p style={{ color: C.text1, fontSize: 14, lineHeight: 1.5 }}>
                  {typeof deliveryAddress === "object"
                    ? deliveryAddress.address || deliveryAddress.address1 || `${deliveryAddress.lat?.toFixed(4)}, ${deliveryAddress.lng?.toFixed(4)}`
                    : deliveryAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Rate Driver CTA ── */}
        {canRate && (
          <div className="track-card" style={{ background: `linear-gradient(135deg, rgba(245,166,35,0.08), rgba(24,95,45,0.06))`, border: `1px solid ${C.goldBrd}`, borderRadius: 20, padding: "20px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h3 style={{ color: C.text1, fontWeight: 700, fontSize: 17, marginBottom: 6 }}>How was your delivery?</h3>
            <p style={{ color: C.text2, fontSize: 13, marginBottom: 16 }}>Rate {driver?.name || "your rider"} to help improve our service</p>
            <button
              onClick={() => setShowRateModal(true)}
              style={{ padding: "11px 28px", background: `linear-gradient(135deg, ${C.gold}, #f7c05a)`, border: "none", borderRadius: 12, color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 20px ${C.gold}30` }}
            >
              Rate Rider
            </button>
          </div>
        )}

        {/* ── Rating submitted confirmation ── */}
        {ratingSubmitted && (
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <IcoCheck />
            <p style={{ color: "#10b981", fontSize: 13, fontWeight: 600 }}>Thanks! Your rating has been submitted.</p>
          </div>
        )}

        {/* ── Tracking History ── */}
        {trackingHistory?.length > 0 && (
          <div className="track-card" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px 18px" }}>
            <p style={{ color: C.text3, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Activity Log</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...trackingHistory].reverse().map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.text2, textTransform: "capitalize" }}>{h.status?.replace(/_/g, " ")}</p>
                    {h.note && <p style={{ fontSize: 11, color: C.text3, marginTop: 1 }}>{h.note}</p>}
                    <p style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{new Date(h.timestamp).toLocaleString("en-UG")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Help section ── */}
        <div className="track-card" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px 18px" }}>
          <p style={{ color: C.text3, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Need Help?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/support" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 10, color: C.text2, textDecoration: "none", fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}>
              <IcoMsg />
              Support Chat
            </Link>
            <Link href="/" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 10, color: C.text2, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              <svg style={ico(15)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
