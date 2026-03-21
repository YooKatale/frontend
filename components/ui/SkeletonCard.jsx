"use client";

/**
 * Reusable shimmer skeleton card.
 *
 * Usage:
 *   <SkeletonCard />                          — default product card
 *   <SkeletonCard variant="order" />          — order row
 *   <SkeletonCard variant="driver" />         — driver card
 *   <SkeletonCard variant="text" lines={4} /> — text block
 *   <SkeletonCard count={6} variant="product" /> — grid of 6 cards
 */

const shimmerStyle = `
  @keyframes sk-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .sk-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 800px 100%;
    animation: sk-shimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
  }
`;

function Bone({ w = "100%", h = 16, br = 6, mb = 0 }) {
  return (
    <div
      className="sk-shimmer"
      style={{ width: w, height: h, borderRadius: br, marginBottom: mb }}
    />
  );
}

function ProductCardSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" }}>
      <Bone w="100%" h={180} br={0} mb={0} />
      <div style={{ padding: "14px 16px" }}>
        <Bone w="70%" h={14} mb={8} />
        <Bone w="45%" h={12} mb={10} />
        <Bone w="55%" h={18} />
      </div>
    </div>
  );
}

function OrderRowSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 14 }}>
      <Bone w={48} h={48} br={10} />
      <div style={{ flex: 1 }}>
        <Bone w="50%" h={13} mb={8} />
        <Bone w="30%" h={11} />
      </div>
      <Bone w={70} h={28} br={8} />
    </div>
  );
}

function DriverCardSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0", display: "flex", gap: 14 }}>
      <Bone w={56} h={56} br={28} />
      <div style={{ flex: 1 }}>
        <Bone w="60%" h={14} mb={8} />
        <Bone w="40%" h={11} mb={8} />
        <Bone w="30%" h={11} />
      </div>
    </div>
  );
}

function TextBlockSkeleton({ lines = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Bone key={i} w={i === lines - 1 ? "65%" : "100%"} h={13} />
      ))}
    </div>
  );
}

const VARIANTS = {
  product: ProductCardSkeleton,
  order: OrderRowSkeleton,
  driver: DriverCardSkeleton,
  text: TextBlockSkeleton,
};

export default function SkeletonCard({ variant = "product", count = 1, lines = 3, ...rest }) {
  const Component = VARIANTS[variant] || ProductCardSkeleton;
  const items = Array.from({ length: count });

  return (
    <>
      <style>{shimmerStyle}</style>
      {count === 1 ? (
        <Component lines={lines} {...rest} />
      ) : (
        <>
          {items.map((_, i) => (
            <Component key={i} lines={lines} {...rest} />
          ))}
        </>
      )}
    </>
  );
}
