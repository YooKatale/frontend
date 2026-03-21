"use client";

import { useState, useEffect } from "react";
import { DB_URL } from "@config/config";
import { FaStar, FaRegStar } from "react-icons/fa";

const VENDOR_KEY = "yookatale-vendor";
const PRIMARY = "#185f2d";

function getAuth() {
  try { return JSON.parse(localStorage.getItem(VENDOR_KEY) || "null"); } catch { return null; }
}

function StarRow({ rating, max = 5 }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: max }).map((_, i) =>
        i < rating
          ? <FaStar key={i} size={14} color="#f59e0b" />
          : <FaRegStar key={i} size={14} color="#d1d5db" />
      )}
    </span>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
      <span style={{ fontSize: "0.78rem", color: "#6b7280", width: "40px" }}>{star} star</span>
      <div style={{ flex: 1, height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#f59e0b", borderRadius: "4px" }} />
      </div>
      <span style={{ fontSize: "0.78rem", color: "#6b7280", width: "24px", textAlign: "right" }}>{count}</span>
    </div>
  );
}

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.vendor?._id) return;
    fetch(`${DB_URL}/vendor/${auth.vendor._id}/ratings`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "Success") {
          setReviews(data.data?.ratings || []);
          setSummary(data.data?.summary || null);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading reviews...</div>;

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => Math.round(r.vendorRating) === s).length,
  }));

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "24px" }}>Reviews</h1>

      {/* Summary card */}
      {summary && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px", display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ textAlign: "center", minWidth: "100px" }}>
            <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#111827", lineHeight: 1 }}>
              {Number(summary.averageRating || 0).toFixed(1)}
            </div>
            <StarRow rating={Math.round(summary.averageRating || 0)} />
            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "4px" }}>
              {summary.totalRatings || reviews.length} reviews
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            {starCounts.map(({ star, count }) => (
              <RatingBar key={star} star={star} count={count} total={reviews.length} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px" }}>
          <FaStar size={40} style={{ color: "#d1d5db", marginBottom: "12px" }} />
          <p style={{ color: "#6b7280", margin: 0, fontWeight: 600 }}>No reviews yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {reviews.map((r) => (
            <div key={r._id} style={{ background: "#fff", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.9rem" }}>
                    {r.customerName || r.user?.firstname || "Customer"}
                  </div>
                  <StarRow rating={r.vendorRating} />
                  {r.vendorRatingComment && (
                    <p style={{ color: "#374151", fontSize: "0.875rem", margin: "8px 0 0" }}>
                      {r.vendorRatingComment}
                    </p>
                  )}
                  {r.vendorRatingTags?.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {r.vendorRatingTags.map((tag, i) => (
                        <span key={i} style={{ padding: "2px 10px", background: "#f3f4f6", borderRadius: "20px", fontSize: "0.75rem", color: "#6b7280" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                  {new Date(r.vendorRatedAt || r.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
