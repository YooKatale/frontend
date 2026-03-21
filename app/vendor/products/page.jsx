"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DB_URL } from "@config/config";
import { FaBoxOpen, FaPlus, FaSync } from "react-icons/fa";

const VENDOR_KEY = "yookatale-vendor";
const PRIMARY = "#185f2d";

function getAuth() {
  try { return JSON.parse(localStorage.getItem(VENDOR_KEY) || "null"); } catch { return null; }
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    const auth = getAuth();
    if (!auth?.vendor?._id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${DB_URL}/products?vendorId=${auth.vendor._id}&limit=50`);
      const data = await res.json();
      if (data?.status === "Success") {
        setProducts(data.data?.products || data.data || []);
      }
    } catch {}
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Products</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={fetchProducts}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}
          >
            <FaSync size={12} />
            Refresh
          </button>
          <Link href="/vendor/products/new">
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", border: "none", background: PRIMARY, color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
              <FaPlus size={13} />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px" }}>
          <FaBoxOpen size={40} style={{ color: "#d1d5db", marginBottom: "12px" }} />
          <p style={{ color: "#6b7280", margin: "0 0 16px", fontWeight: 600 }}>No products yet</p>
          <Link href="/vendor/products/new">
            <button style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: PRIMARY, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              Add Your First Product
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {products.map((p) => (
            <div key={p._id} style={{ background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
              {p.image && (
                <div style={{ height: "140px", overflow: "hidden", background: "#f3f4f6" }}>
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem", marginBottom: "4px" }}>{p.name || p.productName}</div>
                <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {p.description || p.about}
                </div>
                <div style={{ fontWeight: 800, color: PRIMARY, fontSize: "1rem" }}>
                  UGX {Number(p.price || 0).toLocaleString()}
                </div>
                {p.category && (
                  <span style={{ display: "inline-block", marginTop: "6px", padding: "2px 8px", background: "#f3f4f6", borderRadius: "20px", fontSize: "0.75rem", color: "#6b7280" }}>
                    {p.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
