"use client";

export default function Error({ error, reset }) {
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
        <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }} aria-hidden>
          😔
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#1e2d22",
            margin: "0 0 12px",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#637568",
            lineHeight: 1.5,
            margin: "0 0 24px",
          }}
        >
          We&apos;re sorry for the inconvenience. Please try refreshing the page. If the problem persists, contact support.
        </p>
        <button
          type="button"
          onClick={() => reset?.()}
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
