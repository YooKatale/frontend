"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import { FaArrowLeft, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";

const VENDOR_KEY = "yookatale-vendor";
const PRIMARY = "#185f2d";

function getAuth() {
  try { return JSON.parse(localStorage.getItem(VENDOR_KEY) || "null"); } catch { return null; }
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "6px" }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb",
  borderRadius: "10px", fontSize: "0.9rem", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", description: "", price: "", quantity: "",
    category: "", imageUrl: "", discountPercentage: "0",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    if (!form.name.trim() || !form.price || !form.quantity || !form.category || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${DB_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          quantity: Number(form.quantity),
          category: form.category.trim(),
          imageUrl: form.imageUrl.trim() || undefined,
          discountPercentage: Number(form.discountPercentage) || 0,
          vendorId: auth?.vendor?._id,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.status === "Success")) {
        setSuccess(true);
        setTimeout(() => router.push("/vendor/products"), 1500);
      } else {
        throw new Error(data.message || "Failed to create product");
      }
    } catch (err) {
      setError(err.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link href="/vendor/products">
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}>
            <FaArrowLeft size={12} />
            Back
          </button>
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Add New Product</h1>
      </div>

      <div style={{ maxWidth: "600px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: PRIMARY }}>
              <FaBoxOpen size={40} style={{ marginBottom: "12px" }} />
              <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>Product created! Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Field label="Product Name" required>
                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Jollof Rice" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
              </Field>

              <Field label="Description" required>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your product..." rows={3} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Field label="Price (UGX)" required>
                  <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="15000" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
                </Field>
                <Field label="Quantity in Stock" required>
                  <input type="number" min="0" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="50" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Field label="Category" required>
                  <input type="text" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Rice Dishes" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
                </Field>
                <Field label="Discount %">
                  <input type="number" min="0" max="100" value={form.discountPercentage} onChange={(e) => set("discountPercentage", e.target.value)} placeholder="0" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
                </Field>
              </div>

              <Field label="Image URL">
                <input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." style={inputStyle} onFocus={(e) => { e.target.style.borderColor = PRIMARY; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
              </Field>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#dc2626", fontSize: "0.85rem", fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{ width: "100%", padding: "13px", borderRadius: "12px", background: isLoading ? "#d1fae5" : PRIMARY, color: "#fff", border: "none", fontWeight: 700, fontSize: "1rem", cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                {isLoading ? "Creating..." : "Create Product"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
