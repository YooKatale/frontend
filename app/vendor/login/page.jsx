"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DB_URL } from "@config/config";
import { FaStore, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const VENDOR_KEY = "yookatale-vendor";
const PRIMARY = "#185f2d";

export default function VendorLoginPage() {
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
      const stored = localStorage.getItem(VENDOR_KEY);
      if (stored) {
        const v = JSON.parse(stored);
        if (v?.token && v?.vendor?._id) {
          router.replace("/vendor/dashboard");
        }
      }
    } catch {}
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${DB_URL}/vendor/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "Success") {
        throw new Error(data.message || "Login failed");
      }
      localStorage.setItem(VENDOR_KEY, JSON.stringify({ token: data.token, vendor: data.vendor }));
      router.replace("/vendor/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: PRIMARY, borderRadius: "16px", width: "64px", height: "64px", marginBottom: "16px" }}>
            <FaStore size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: 0 }}>Vendor Portal</h1>
          <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "0.9rem" }}>Sign in to manage your store</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "32px 28px" }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "6px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                  <FaEnvelope size={14} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@example.com"
                  required
                  style={{
                    width: "100%", padding: "11px 12px 11px 36px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                  <FaLock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%", padding: "11px 40px 11px 36px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "2px" }}
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#dc2626", fontSize: "0.85rem", fontWeight: 500 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", padding: "13px", borderRadius: "12px",
                background: isLoading ? "#d1fae5" : PRIMARY,
                color: "#fff", border: "none", fontWeight: 700,
                fontSize: "1rem", cursor: isLoading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.8rem", marginTop: "20px" }}>
          Credentials are sent by Yookatale admin when your account is verified.
        </p>
      </div>
    </div>
  );
}
