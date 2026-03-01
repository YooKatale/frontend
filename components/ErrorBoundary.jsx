"use client";

import React from "react";

function isChunkLoadError(error) {
  if (!error) return false;
  const msg = (error.message || "").toString();
  const name = (error.name || "").toString();
  return (
    name === "ChunkLoadError" ||
    msg.includes("Loading chunk") ||
    msg.includes("ChunkLoadError") ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed")
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof console !== "undefined" && console.error) {
      console.error("[Yookatale] Error caught:", error?.message || error, errorInfo?.componentStack);
    }
  }

  handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunk = isChunkLoadError(this.state.error);
      const title = isChunk ? "We've updated the app" : "Something went wrong";
      const message = isChunk
        ? "Please refresh the page to get the latest version and continue."
        : "We're sorry for the inconvenience. Please try refreshing the page. If the problem persists, contact support.";
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f4f8f5",
            padding: 24,
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
                lineHeight: 1,
              }}
              aria-hidden
            >
              {isChunk ? "🔄" : "😔"}
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#1e2d22",
                margin: "0 0 12px",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#637568",
                lineHeight: 1.5,
                margin: "0 0 24px",
              }}
            >
              {message}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                background: "#1a6b3a",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(26, 107, 58, 0.3)",
              }}
            >
              Refresh page
            </button>
            <p style={{ fontSize: 13, color: "#9aa89f", marginTop: 20 }}>
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
