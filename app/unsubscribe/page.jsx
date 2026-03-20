"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DB_URL } from "@config/config";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(decodeURIComponent(emailParam));
  }, [searchParams]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`${DB_URL}/newsletter/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.status === "Success") {
        setStatus("success");
        setMessage("You have been successfully unsubscribed from Yookatale emails.");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "48px 40px",
        maxWidth: "440px",
        width: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}>
        {/* Logo */}
        <img
          src="https://www.yookatale.app/assets/icons/logo2.png"
          alt="YooKatale"
          style={{ height: "48px", marginBottom: "24px", display: "block", margin: "0 auto 24px" }}
        />

        {status === "success" ? (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>
              Unsubscribed
            </h1>
            <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
              {message}
            </p>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "24px" }}>
              You will no longer receive marketing emails from us. Transactional emails (orders, account activity) will still be sent.
            </p>
            <a
              href="https://www.yookatale.app"
              style={{
                display: "inline-block",
                background: "#185f2d",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Back to YooKatale
            </a>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "10px" }}>
              Unsubscribe from Emails
            </h1>
            <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: "1.6", marginBottom: "32px" }}>
              Enter your email address below to stop receiving marketing emails from YooKatale.
            </p>

            {status === "error" && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#dc2626",
                fontSize: "14px",
                marginBottom: "20px",
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleUnsubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  fontSize: "15px",
                  marginBottom: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                style={{
                  width: "100%",
                  background: status === "loading" ? "#9ca3af" : "#185f2d",
                  color: "#fff",
                  padding: "13px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "15px",
                  border: "none",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  marginBottom: "20px",
                }}
              >
                {status === "loading" ? "Processing..." : "Unsubscribe"}
              </button>
            </form>

            <p style={{ color: "#9ca3af", fontSize: "12px" }}>
              Changed your mind?{" "}
              <a href="https://www.yookatale.app" style={{ color: "#185f2d", textDecoration: "underline" }}>
                Go back to YooKatale
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
