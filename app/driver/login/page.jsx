"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DB_URL } from "@config/config";

const DRIVER_STORAGE_KEY = "yookatale-driver";

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconSpinner = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);
const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function DriverLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(DRIVER_STORAGE_KEY);
      if (stored) {
        const driver = JSON.parse(stored);
        if (driver?.token && driver?.driver?._id) {
          router.replace("/driver/dashboard");
        }
      }
    } catch {}
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${DB_URL}/driver/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || data?.status !== "Success") {
        throw new Error(data?.message || "Invalid email or password.");
      }
      localStorage.setItem(DRIVER_STORAGE_KEY, JSON.stringify(data));
      router.replace("/driver/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  /* ── shared input style ────────────────────────────────── */
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const onFocusGold = (e) => {
    e.target.style.borderColor = "rgba(245,166,35,0.7)";
    e.target.style.boxShadow = "0 0 0 3px rgba(245,166,35,0.12)";
  };
  const onBlurGold = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.12)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#0D0D0D",
        fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── diagonal background lines ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.035 }}>
          <defs>
            <pattern id="diag" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="#F5A623" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)"/>
        </svg>
        {/* gold glow top-left */}
        <div style={{ position:"absolute", top:"-15%", left:"-10%", width:"50%", height:"50%", background:"radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)" }} />
        {/* green glow bottom-right */}
        <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"45%", height:"45%", background:"radial-gradient(circle, rgba(24,95,45,0.10) 0%, transparent 70%)" }} />
      </div>

      {/* ════════════ LEFT PANEL — branding ════════════ */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden" style={{ zIndex: 1, borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div style={{ width: 48, height: 48, borderRadius: 14, overflow: "hidden", border: "2px solid rgba(245,166,35,0.35)", boxShadow: "0 0 24px rgba(245,166,35,0.18)" }}>
            <Image src="/assets/icons/logo2.png" alt="Yookatale" width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
          <div>
            <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px", lineHeight: 1 }}>Yookatale</p>
            <p style={{ color: "#F5A623", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 3 }}>Driver Portal</p>
          </div>
        </div>

        {/* Centre copy */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.25)", borderRadius: 999, padding: "4px 12px", marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5A623", boxShadow: "0 0 6px #F5A623" }} className="animate-pulse" />
            <span style={{ color: "#F5A623", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>Uganda's #1 Delivery Network</span>
          </div>

          <h2 style={{ color: "#ffffff", fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.5px" }}>
            Deliver.<br />Earn.<br />
            <span style={{ background: "linear-gradient(90deg, #F5A623, #f7c05a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Grow.
            </span>
          </h2>
          <p style={{ color: "#c9cdd4", fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
            Accept orders, navigate live across Kampala, and get paid weekly — all from one powerful dashboard.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginTop: 36 }}>
            {[
              { value: "500+", label: "Active Riders" },
              { value: "5 min", label: "Avg Response" },
              { value: "98%", label: "On-Time Rate" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ color: "#F5A623", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: "#7c8190", fontSize: 11, marginTop: 4, fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconShield />
          <p style={{ color: "#6b7280", fontSize: 12 }}>
            Not a driver yet?{" "}
            <Link href="/partner" style={{ color: "#F5A623", fontWeight: 600, textDecoration: "none" }}>
              Apply to join the fleet
            </Link>
          </p>
        </div>
      </div>

      {/* ════════════ RIGHT PANEL — form ════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative" style={{ zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div style={{ width: 42, height: 42, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(245,166,35,0.35)" }}>
              <Image src="/assets/icons/logo2.png" alt="Yookatale" width={42} height={42} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
            <div>
              <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>Yookatale</p>
              <p style={{ color: "#F5A623", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>Driver Portal</p>
            </div>
          </div>

          {/* Card */}
          <div style={{ background: "#111111", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", padding: "36px 32px", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>

            {/* Heading */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ color: "#ffffff", fontSize: 24, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 6 }}>
                Welcome back
              </h1>
              <p style={{ color: "#9ca3af", fontSize: 14 }}>
                Sign in to access your delivery dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Email */}
              <div>
                <label style={{ display: "block", color: "#d1d5db", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }}>
                    <IconMail />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    style={{ ...inputStyle, padding: "12px 16px 12px 42px" }}
                    onFocus={onFocusGold}
                    onBlur={onBlurGold}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", color: "#d1d5db", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }}>
                    <IconLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                    required
                    style={{ ...inputStyle, padding: "12px 44px 12px 42px" }}
                    onFocus={onFocusGold}
                    onBlur={onBlurGold}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 0, display: "flex", alignItems: "center" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                  <IconAlert />
                  <p style={{ fontSize: 13, lineHeight: 1.5 }}>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  background: isLoading
                    ? "rgba(24,95,45,0.5)"
                    : "linear-gradient(135deg, #185f2d, #1a7a36)",
                  border: "none",
                  borderRadius: 12,
                  padding: "13px 0",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                  boxShadow: isLoading ? "none" : "0 4px 24px rgba(24,95,45,0.4)",
                  marginTop: 4,
                  fontFamily: "inherit",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(24,95,45,0.5)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isLoading ? "none" : "0 4px 24px rgba(24,95,45,0.4)"; }}
              >
                {isLoading ? (
                  <><IconSpinner /> Signing in...</>
                ) : (
                  <>Sign In <IconArrow /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 24, paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link href="/partner" style={{ color: "#9ca3af", fontSize: 13, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#F5A623"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
              >
                Apply as rider
              </Link>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 13, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#d1d5db"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
              >
                <IconBack />
                Back to Yookatale
              </Link>
            </div>
          </div>

          {/* Secure badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, color: "#4b5563" }}>
            <IconShield />
            <span style={{ fontSize: 12 }}>Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
