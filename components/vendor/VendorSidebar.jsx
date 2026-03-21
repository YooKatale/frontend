"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FaChartBar, FaShoppingBag, FaBoxOpen, FaStar, FaMoneyBillWave,
  FaSignOutAlt, FaBars, FaTimes, FaStore,
} from "react-icons/fa";

const PRIMARY = "#185f2d";

const NAV_LINKS = [
  { label: "Dashboard",  path: "/vendor/dashboard", Icon: FaChartBar },
  { label: "Orders",     path: "/vendor/orders",    Icon: FaShoppingBag },
  { label: "Products",   path: "/vendor/products",  Icon: FaBoxOpen },
  { label: "Reviews",    path: "/vendor/reviews",   Icon: FaStar },
  { label: "Payouts",    path: "/vendor/payouts",   Icon: FaMoneyBillWave },
];

const VENDOR_KEY = "yookatale-vendor";

function NavItem({ label, path, Icon, mobile, onClose }) {
  const pathname = usePathname();
  const isActive = pathname === path || pathname?.startsWith(path + "/");

  return (
    <Link href={path} onClick={mobile ? onClose : undefined}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          borderRadius: "10px",
          margin: "2px 0",
          background: isActive ? PRIMARY : "transparent",
          color: isActive ? "#fff" : "#374151",
          fontWeight: isActive ? 700 : 500,
          fontSize: "0.875rem",
          cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f3f4f6"; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <Icon size={16} />
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default function VendorSidebar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(VENDOR_KEY);
    router.replace("/vendor/login");
  };

  const SidebarInner = ({ onClose }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0 12px 16px" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 4px 16px", borderBottom: "1px solid #e5e7eb", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: PRIMARY, borderRadius: "10px", padding: "6px", display: "flex" }}>
            <FaStore size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>Yookatale</div>
            <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Vendor Portal</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}>
            <FaTimes size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, overflowY: "auto" }}>
        {NAV_LINKS.map(({ label, path, Icon }) => (
          <NavItem key={path} label={label} path={path} Icon={Icon} mobile={!!onClose} onClose={onClose} />
        ))}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "8px" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "10px 14px", borderRadius: "10px",
            background: "none", border: "none", cursor: "pointer",
            color: "#ef4444", fontWeight: 600, fontSize: "0.875rem",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <FaSignOutAlt size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div style={{
        display: "none",
        position: "fixed", left: 0, top: 0, bottom: 0, width: "240px",
        background: "#fff", borderRight: "1px solid #e5e7eb",
        boxShadow: "2px 0 12px rgba(0,0,0,0.06)", zIndex: 50,
      }} className="vendor-sidebar-desktop">
        <SidebarInner />
      </div>

      {/* Mobile top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "60px",
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }} className="vendor-topbar-mobile">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ background: PRIMARY, borderRadius: "8px", padding: "5px", display: "flex" }}>
            <FaStore size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>Vendor Portal</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: "6px" }}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "260px", background: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarInner onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .vendor-sidebar-desktop { display: block !important; }
          .vendor-topbar-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
