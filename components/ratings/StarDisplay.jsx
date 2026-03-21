"use client";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const SIZES = { sm: 12, md: 16, lg: 20 };

/**
 * StarDisplay — renders filled / half / empty stars with review count.
 * Props: rating (Number), count (Number), size ("sm"|"md"|"lg")
 */
export default function StarDisplay({ rating = 0, count = 0, size = "md", showCount = true }) {
  const px = SIZES[size] ?? SIZES.md;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} style={{ width: px, height: px, color: "#F5A623", flexShrink: 0 }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} style={{ width: px, height: px, color: "#F5A623", flexShrink: 0 }} />);
    } else {
      stars.push(<FaRegStar key={i} style={{ width: px, height: px, color: "#6b7280", flexShrink: 0 }} />);
    }
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <div style={{ display: "flex", gap: 2 }}>{stars}</div>
      {showCount && (
        <span style={{
          fontSize: px - 2,
          color: "#9ca3af",
          marginLeft: 4,
          fontFamily: "'Sora','DM Sans',sans-serif",
          whiteSpace: "nowrap",
        }}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
