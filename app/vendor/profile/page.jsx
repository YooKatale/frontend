"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DB_URL } from "@config/config";
import { getAvatarUrl } from "@constants/constants";

const PRIMARY = "#185f2d";
const VENDOR_KEY = "yookatale-vendor";

export default function VendorProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(VENDOR_KEY);
    if (!stored) {
      router.replace("/vendor/login");
      return;
    }
    try {
      const { token, vendor: v } = JSON.parse(stored);
      if (!token || !v?._id) {
        router.replace("/vendor/login");
        return;
      }
      setVendor(v);
      setFormData(v);
      setLoading(false);
    } catch {
      router.replace("/vendor/login");
    }
  }, [router]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or less");
      return;
    }

    setAvatarLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const stored = localStorage.getItem(VENDOR_KEY);
      const { token } = JSON.parse(stored);

      const res = await fetch(`${DB_URL}/vendor/${vendor._id}/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (data?.status === "Success") {
        const updated = { ...vendor, profileImage: data.data?.profileImage };
        setVendor(updated);
        setFormData(updated);
        localStorage.setItem(VENDOR_KEY, JSON.stringify({ token, vendor: updated }));
        setSuccess("Profile image updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data?.message || "Upload failed");
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const stored = localStorage.getItem(VENDOR_KEY);
      const { token } = JSON.parse(stored);

      const res = await fetch(`${DB_URL}/vendor/${vendor._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          openHours: formData.openHours,
        }),
      });

      const data = await res.json();
      if (data?.status === "Success" || res.ok) {
        const updated = { ...vendor, ...formData };
        setVendor(updated);
        localStorage.setItem(VENDOR_KEY, JSON.stringify({ token, vendor: updated }));
        setEditMode(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data?.message || "Update failed");
      }
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bg: "#f9fafb" }}>
        <p style={{ color: "#6b7280" }}>Loading profile...</p>
      </div>
    );
  }

  if (!vendor) return null;

  const avatarUrl = getAvatarUrl(vendor.profileImage);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "24px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              color: PRIMARY,
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: 0 }}>
            Vendor Profile
          </h1>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "16px",
            color: "#991b1b",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            background: "#efe",
            border: "1px solid #cfc",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "16px",
            color: "#166534",
            fontSize: "14px",
          }}>
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "32px" }}>
          {/* Avatar Section */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: avatarUrl ? "transparent" : `linear-gradient(135deg, ${PRIMARY}, #4cd964)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              position: "relative",
              overflow: "hidden",
              marginBottom: "16px",
            }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={vendor.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#fff",
                  textTransform: "uppercase",
                }}>
                  {vendor.name?.charAt(0) || "V"}
                </span>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: PRIMARY,
                  border: "3px solid #fff",
                  color: "#fff",
                  cursor: avatarLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  opacity: avatarLoading ? 0.6 : 1,
                }}
                title="Upload profile image"
              >
                📷
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={avatarLoading}
              style={{ display: "none" }}
            />
            <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "8px" }}>
              {avatarLoading ? "Uploading..." : "Click camera icon to upload"}
            </p>
          </div>

          {/* Profile Details */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
              Store Information
            </h2>

            {editMode ? (
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    name="openHours"
                    value={formData.openHours || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. 8:00 AM - 10:00 PM"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: PRIMARY,
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData(vendor);
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#e5e7eb",
                      color: "#374151",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Store Name</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>{vendor.name || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Email</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>{vendor.email || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Phone</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>{vendor.phone || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Address</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>{vendor.address || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Opening Hours</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>{vendor.openHours || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Status</span>
                    <span style={{
                      color: vendor.status === "Verified" ? "#059669" : "#d97706",
                      fontWeight: "600",
                      textTransform: "capitalize"
                    }}>
                      {vendor.status || "—"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: PRIMARY,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
