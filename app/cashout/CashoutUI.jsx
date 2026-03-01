"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowDownToLine,
  Users,
  Star,
  Gift,
  CreditCard,
  Share2,
  Gamepad2,
  Smartphone,
  Trash2,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  Info,
  CircleDollarSign,
  BadgePercent,
  Landmark,
  Timer,
  CalendarClock,
  AlertCircle,
} from "lucide-react";

const fmt = (n) => "UGX " + Number(n).toLocaleString();

export const StatCard = ({ label, value, sub, Icon, accent, gradient, cta, delay = 0 }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.03)",
      border: "1px solid rgba(0,0,0,.05)",
      display: "flex",
      flexDirection: "column",
      animation: `fadeUp .5s ${delay}ms ease both`,
      transition: "transform .22s, box-shadow .22s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = `0 14px 36px rgba(0,0,0,.1), 0 0 0 2px ${accent}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,.06)";
    }}
  >
    <div style={{ height: 3, background: gradient }} />
    <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: "#94a394", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 8 }}>{label}</p>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, fontStyle: "italic", color: accent, lineHeight: 1 }}>{value}</div>
          <p style={{ fontSize: 12, color: "#7a9a7a", fontWeight: 600, marginTop: 5 }}>{sub}</p>
        </div>
        <div style={{ width: 50, height: 50, borderRadius: 15, flexShrink: 0, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: `0 6px 18px ${accent}44` }}>
          <Icon size={22} strokeWidth={1.8} />
        </div>
      </div>
      {cta}
    </div>
  </div>
);

export const SCard = ({ children, style = {}, delay = 0 }) => (
  <div style={{ background: "#fff", borderRadius: 22, boxShadow: "0 2px 16px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.03)", border: "1px solid rgba(0,0,0,.05)", overflow: "hidden", animation: `fadeUp .5s ${delay}ms ease both`, ...style }}>{children}</div>
);

export const SHead = ({ Icon, title, badge, action }) => (
  <div style={{ padding: "18px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f5f0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#1a5c1a,#2d8c2d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
        <Icon size={17} strokeWidth={2} />
      </div>
      <h2 style={{ fontSize: 15, fontWeight: 900, color: "#0e1e0e" }}>{title}</h2>
      {badge && <span style={{ background: "#fef3c7", color: "#d97706", fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 100, letterSpacing: 0.8, textTransform: "uppercase" }}>{badge}</span>}
    </div>
    {action}
  </div>
);

export const PBtn = ({ children, onClick, Icon: Ic, small, full = false, gradient = "linear-gradient(135deg,#1a5c1a,#2d8c2d)", accent = "#1a5c1a", disabled = false, loading = false }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, width: full ? "100%" : "auto",
      padding: small ? "9px 16px" : "13px 22px", borderRadius: small ? 11 : 14, border: "none", background: gradient, color: "#fff",
      fontSize: small ? 12 : 14, fontWeight: 800, cursor: disabled || loading ? "not-allowed" : "pointer", boxShadow: `0 4px 16px ${accent}3a`, transition: "transform .15s, box-shadow .18s", letterSpacing: 0.2, fontFamily: "inherit", opacity: disabled ? 0.6 : 1,
    }}
    onMouseEnter={(e) => { if (!disabled && !loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}50`; } }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 16px ${accent}3a`; }}
  >
    {loading ? <span style={{ fontSize: 12 }}>...</span> : <>{Ic && <Ic size={15} strokeWidth={2.2} />}{children}</>}
  </button>
);

export const GBtn = ({ children, onClick, Icon: Ic, active = false }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 12,
      border: `1.5px solid ${active ? "#1a5c1a" : "#dde8dd"}`, background: active ? "#f0f7f0" : "#fff", color: active ? "#1a5c1a" : "#4a6a4a",
      fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .16s", fontFamily: "inherit",
    }}
    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#1a5c1a"; e.currentTarget.style.color = "#1a5c1a"; } }}
    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "#dde8dd"; e.currentTarget.style.color = "#4a6a4a"; } }}
  >
    {Ic && <Ic size={14} strokeWidth={2} />}{children}
  </button>
);

export const FInput = ({ label, value, onChange, type = "text", LeftIcon, prefix }) => {
  const [focus, setFocus] = useState(false);
  const lifted = focus || !!value;
  return (
    <div style={{ position: "relative", borderRadius: 14, minHeight: 56, cursor: "text", background: focus ? "#fff" : "#f8fcf8", border: `1.5px solid ${focus ? "#1a5c1a" : lifted ? "#a8c8a8" : "#dce8dc"}`, boxShadow: focus ? "0 0 0 4px rgba(26,92,26,.09)" : "0 1px 3px rgba(0,0,0,.03)", transition: "all .2s" }}>
      <label style={{ position: "absolute", left: LeftIcon ? 44 : 14, top: 0, pointerEvents: "none", transform: lifted ? "translateY(9px) scale(.72)" : "translateY(50%) translateY(-50%) scale(1)", transformOrigin: "left center", fontSize: 14, fontWeight: 700, color: focus ? "#1a5c1a" : "#8aaa8a", transition: "all .2s", whiteSpace: "nowrap" }}>{label}</label>
      {LeftIcon && <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focus ? "#1a5c1a" : "#9cac9c", transition: "color .2s", pointerEvents: "none" }}><LeftIcon size={16} strokeWidth={1.9} /></div>}
      {prefix && <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "#4a6a4a", pointerEvents: "none" }}>{prefix}</div>}
      <input type={type} value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ width: "100%", background: "transparent", border: "none", outline: "none", padding: `${lifted ? "24px" : "16px"} 14px ${lifted ? "10px" : "16px"} ${LeftIcon ? "44px" : prefix ? "48px" : "14px"}`, fontSize: 15, fontWeight: 600, color: "#0e1e0e", fontFamily: "inherit" }} />
    </div>
  );
};

export const FSelect = ({ label, value, onChange, opts, placeholder = "Select provider" }) => {
  const [focus, setFocus] = useState(false);
  const lifted = focus || !!value;
  return (
    <div style={{ position: "relative", borderRadius: 14, minHeight: 56, background: focus ? "#fff" : "#f8fcf8", border: `1.5px solid ${focus ? "#1a5c1a" : lifted ? "#a8c8a8" : "#dce8dc"}`, boxShadow: focus ? "0 0 0 4px rgba(26,92,26,.09)" : "0 1px 3px rgba(0,0,0,.03)", transition: "all .2s" }}>
      <label style={{ position: "absolute", left: 14, top: 0, pointerEvents: "none", transform: lifted ? "translateY(9px) scale(.72)" : "translateY(50%) translateY(-50%) scale(1)", transformOrigin: "left center", fontSize: 14, fontWeight: 700, color: focus ? "#1a5c1a" : "#8aaa8a", transition: "all .2s" }}>{label}</label>
      <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ width: "100%", background: "transparent", border: "none", outline: "none", appearance: "none", padding: `${lifted ? "24px" : "16px"} 40px ${lifted ? "10px" : "16px"} 14px`, fontSize: 15, fontWeight: 600, color: value ? "#0e1e0e" : "transparent", fontFamily: "inherit", cursor: "pointer" }}>
        <option value="">{placeholder}</option>
        {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9cac9c", pointerEvents: "none" }}><ChevronDown size={16} strokeWidth={2} /></div>
    </div>
  );
};

const statusMap = { FAILED: { bg: "#fef2f2", color: "#dc2626", Icon: AlertCircle }, SUCCESS: { bg: "#f0fdf4", color: "#16a34a", Icon: CheckCircle2 }, completed: { bg: "#f0fdf4", color: "#16a34a", Icon: CheckCircle2 }, failed: { bg: "#fef2f2", color: "#dc2626", Icon: AlertCircle }, processing: { bg: "#fffbeb", color: "#d97706", Icon: Timer }, PENDING: { bg: "#fffbeb", color: "#d97706", Icon: Timer } };
export const TxBadge = ({ status }) => {
  const s = statusMap[status] || statusMap.PENDING;
  const StatusIcon = s.Icon;
  const label = status === "completed" ? "SUCCESS" : status === "failed" ? "FAILED" : status === "processing" ? "PENDING" : status;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, borderRadius: 100, padding: "5px 10px", fontSize: 10, fontWeight: 900, letterSpacing: 0.6, textTransform: "uppercase" }}>
      <StatusIcon size={11} strokeWidth={2.5} />{label}
    </span>
  );
};

export const WithdrawModal = ({ onClose, balance, defaultMethodDisplay, onConfirm, loading }) => {
  const [amount, setAmount] = useState("");
  const presets = [5000, 10000, 20000, 50000, 70000];
  const handleWithdraw = () => {
    const amt = Number(amount);
    if (Number.isFinite(amt) && amt >= 1000) onConfirm(amt);
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.48)", backdropFilter: "blur(5px)", padding: 16, animation: "fadeIn .2s ease" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 26, width: "100%", maxWidth: 420, overflow: "hidden", animation: "modalUp .32s cubic-bezier(.22,.84,.44,1) both", boxShadow: "0 28px 72px rgba(0,0,0,.22)" }}>
        <div style={{ padding: "24px 26px 20px", background: "linear-gradient(135deg,#0e2e0e,#1a5c1a,#2d8c2d)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowDownToLine size={16} strokeWidth={2} color="#fff" /></div>
                <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,.9)", letterSpacing: 0.3 }}>Withdraw funds</span>
              </div>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Available balance</p>
            <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 36, color: "#fff", fontStyle: "italic", lineHeight: 1 }}>{fmt(balance)}</p>
          </div>
        </div>
        <div style={{ padding: "22px 26px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 900, color: "#94a394", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Quick amounts</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {presets.map((p) => (
                <button key={p} onClick={() => setAmount(String(p))} style={{ padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${amount === String(p) ? "#1a5c1a" : "#dde8dd"}`, background: amount === String(p) ? "#f0f7f0" : "#fff", color: amount === String(p) ? "#1a5c1a" : "#4a6a4a", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}>{fmt(p)}</button>
              ))}
            </div>
          </div>
          <FInput label="Custom amount (UGX)" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" LeftIcon={CircleDollarSign} />
          {defaultMethodDisplay && (
            <div style={{ background: "#f0f7f0", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 9, border: "1px solid #cce8cc" }}>
              <Landmark size={15} strokeWidth={2} color="#1a5c1a" />
              <p style={{ fontSize: 12, color: "#2d6a2d", fontWeight: 700 }}>{defaultMethodDisplay}</p>
            </div>
          )}
          <PBtn Icon={ArrowDownToLine} full onClick={handleWithdraw} loading={loading}>Withdraw now</PBtn>
        </div>
      </div>
    </div>
  );
};

export const CashoutGlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0 }
    body { font-family:'Nunito',sans-serif; -webkit-font-smoothing:antialiased; background:#f2f6f2 }
    button, input, select { font-family:'Nunito',sans-serif }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes modalUp  { from{opacity:0;transform:translateY(22px) scale(.97)} to{opacity:1;transform:none} }
    @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    ::-webkit-scrollbar { width:5px }
    ::-webkit-scrollbar-thumb { background:#a8c8a8; border-radius:100px }
  `}</style>
);

export { Wallet, ArrowDownToLine, Users, Star, Gift, CreditCard, Share2, Gamepad2, Smartphone, Trash2, ArrowRight, CheckCircle2, Copy, Check, Plus, Lock, Eye, EyeOff, TrendingUp, Sparkles, Zap, Shield, Info, CircleDollarSign, BadgePercent, Landmark, CalendarClock };
