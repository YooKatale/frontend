"use client";

import { useEffect, useState } from "react";
import { DB_URL } from "@config/config";
import StarDisplay from "./StarDisplay";

const font = { fontFamily: "'Sora','DM Sans',system-ui,sans-serif" };
const C = {
  card:   "#111111",
  border: "rgba(255,255,255,0.07)",
  text1:  "#f3f4f6",
  text2:  "#9ca3af",
  text3:  "#6b7280",
  gold:   "#F5A623",
  green:  "#185f2d",
};

/**
 * RatingBreakdown — fetches and displays vendor ratings.
 * Props: vendorId (String)
 */
export default function RatingBreakdown({ vendorId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;
    fetch(`${DB_URL}/vendor/${vendorId}/ratings`)
      .then((r) => r.json())
      .then((d) => { if (d?.data) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [vendorId]);

  if (loading) {
    return (
      <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
        <div style={{ width: 20, height: 20, border: "2px solid #185f2d", borderTopColor: "transparent", borderRadius: "50%", animation: "rb-spin 0.8s linear infinite" }} />
        <style>{`@keyframes rb-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) return null;

  const { averageRating = 0, totalRatings = 0, ratings = [] } = data;

  // Build breakdown counts per star
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.vendorRating === star).length,
    pct: totalRatings > 0 ? Math.round((ratings.filter((r) => r.vendorRating === star).length / totalRatings) * 100) : 0,
  }));

  return (
    <div style={{ ...font }}>
      {/* Summary row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: C.gold, lineHeight: 1 }}>
            {Number(averageRating).toFixed(1)}
          </div>
          <StarDisplay rating={averageRating} count={totalRatings} size="md" />
          <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>{totalRatings} reviews</div>
        </div>

        {/* Bar breakdown */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {counts.map(({ star, count: cnt, pct }) => (
            <div key={star} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: C.text3, width: 12, textAlign: "right", flexShrink: 0 }}>{star}</span>
              <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: pct > 0
                    ? `linear-gradient(to right, #185f2d, #1a7a36)`
                    : "transparent",
                  borderRadius: 3,
                  transition: "width 0.5s ease",
                }} />
              </div>
              <span style={{ fontSize: 10, color: C.text3, width: 28, textAlign: "right", flexShrink: 0 }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent comments */}
      {ratings.slice(0, 5).filter((r) => r.vendorRatingComment).length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Recent Reviews
          </p>
          {ratings.slice(0, 5).filter((r) => r.vendorRatingComment).map((r, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <StarDisplay rating={r.vendorRating} count={0} size="sm" showCount={false} />
                <span style={{ fontSize: 10, color: C.text3 }}>
                  {r.vendorRatedAt ? new Date(r.vendorRatedAt).toLocaleDateString("en-UG") : ""}
                </span>
              </div>
              <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>{r.vendorRatingComment}</p>
              {r.customerName && (
                <p style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>— {r.customerName}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
