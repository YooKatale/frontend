"use client";

import { useEffect, useState } from "react";

function isChunkOrNetworkError(error) {
  if (!error) return false;
  const msg = (error?.message || "").toString();
  const name = (error?.name || "").toString();
  return (
    name === "ChunkLoadError" ||
    msg.includes("Loading chunk") ||
    msg.includes("ChunkLoadError") ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed")
  );
}

export default function GlobalErrorHandler() {
  const [chunkError, setChunkError] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleError = (event) => {
      const err = event?.error || event?.reason;
      if (isChunkOrNetworkError(err)) {
        event.preventDefault?.();
        event.stopPropagation?.();
        setChunkError(true);
        return true;
      }
      return false;
    };

    const handleRejection = (event) => {
      const err = event?.reason;
      if (isChunkOrNetworkError(err)) {
        event.preventDefault?.();
        setChunkError(true);
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    const off = () => setOffline(true);
    const on = () => setOffline(false);
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    if (!navigator.onLine) setOffline(true);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("offline", off);
      window.removeEventListener("online", on);
    };
  }, []);

  if (chunkError) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 28,
            maxWidth: 400,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden>
            🔄
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1e2d22",
              margin: "0 0 10px",
            }}
          >
            We've updated the app
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#637568",
              lineHeight: 1.5,
              margin: "0 0 20px",
            }}
          >
            Please refresh the page to get the latest version and continue.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              background: "#1a6b3a",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  if (offline) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99998,
          background: "#f97316",
          color: "#fff",
          padding: "10px 16px",
          fontSize: 14,
          fontWeight: 600,
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        You're offline. Some content may not load. We'll update when you're back online.
      </div>
    );
  }

  return null;
}
