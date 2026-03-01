"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { setCredentials } from "@slices/authSlice";
import { useLoginMutation, useRegisterMutation } from "@slices/usersApiSlice";
import { DB_URL, API_ORIGIN } from "@config/config";
import { Images, getOptimizedImageUrl } from "@constants/constants";

const Svg = ({ s = 18, vb = "0 0 24 24", fill = "none", stroke = "currentColor", sw = 1.8, children }) => (
  <svg width={s} height={s} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    {children}
  </svg>
);
const ic = {
  Mail: (s) => <Svg s={s}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></Svg>,
  Lock: (s) => <Svg s={s}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>,
  Eye: (s) => <Svg s={s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Svg>,
  EyeOff: (s) => <Svg s={s}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></Svg>,
  User: (s) => <Svg s={s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>,
  Phone: (s) => <Svg s={s}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.1 12.22 19.79 19.79 0 0 1 1.06 3.6 2 2 0 0 1 3 1.42h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17l.92-.08z"/></Svg>,
  Pin: (s) => <Svg s={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Svg>,
  Cal: (s) => <Svg s={s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>,
  ChevD: (s) => <Svg s={s}><polyline points="6 9 12 15 18 9"/></Svg>,
  ChevR: (s) => <Svg s={s}><polyline points="9 18 15 12 9 6"/></Svg>,
  ChevL: (s) => <Svg s={s}><polyline points="15 18 9 12 15 6"/></Svg>,
  Arrow: (s) => <Svg s={s}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Svg>,
  Check: (s) => <Svg s={s}><polyline points="20 6 9 17 4 12"/></Svg>,
  Leaf: (s) => <Svg s={s}><path d="M2 22 16 8"/><path d="M16 8c0 0 5-2 6-7-5 1-7 6-7 6s2.5 2.5 0 5-5 0-5 0"/></Svg>,
  Shield: (s) => <Svg s={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>,
  Zap: (s) => <Svg s={s} fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>,
  WA: (s) => <Svg s={s} stroke="#25d366"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></Svg>,
  Google: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ display: "block", flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
};

/** Original Yookatale logo from assets when useOriginal; otherwise SVG mark. */
const Logo = ({ scale = 1, useOriginal = true }) => {
  const logoSrc = Images?.logo != null ? (typeof Images.logo === "string" ? Images.logo : Images.logo?.src) : null;
  if (useOriginal && logoSrc) {
    const src = getOptimizedImageUrl(logoSrc) ?? logoSrc;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, userSelect: "none" }}>
        <img src={src} alt="Yookatale" style={{ width: Math.round(120 * scale), height: "auto", objectFit: "contain", display: "block" }} />
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, userSelect: "none" }}>
      <svg width={Math.round(54 * scale)} height={Math.round(46 * scale)} viewBox="0 0 54 46" fill="none">
        <path d="M4 6h5.5l7 26h22l5-18H16" stroke="#1a5c1a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 9.5h3l5 18h16l3-10H17.5" stroke="#2d8c2d" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".45"/>
        <circle cx="19" cy="38" r="3.5" fill="#1a5c1a"/>
        <circle cx="35" cy="38" r="3.5" fill="#1a5c1a"/>
        <path d="M35 10c0 0 6-2 7-8-6 1-8 7-8 7" stroke="#f0c020" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M34 9c0 0 2.5 3 .5 5.5s-4.5 1-4.5 1" stroke="#f0c020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: Math.round(15 * scale), letterSpacing: 3, lineHeight: 1, fontStyle: "italic" }}>
        <span style={{ color: "#1a5c1a" }}>Yoo</span><span style={{ color: "#d4a017" }}>Katale</span>
      </div>
    </div>
  );
};

/** stable: no floating animations (use on signup page to prevent layout shake) */
const Bg = ({ stable = false }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg,#edf5ed 0%,#f6f9f6 50%,#eef7ee 100%)" }}/>
    <div style={{ position: "absolute", top: "-18%", left: "-12%", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle,rgba(26,92,26,.09) 0%,transparent 65%)", ...(stable ? {} : { animation: "oFloat 14s ease-in-out infinite" }) }}/>
    <div style={{ position: "absolute", bottom: "-20%", right: "-12%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,160,23,.08) 0%,transparent 65%)", ...(stable ? {} : { animation: "oFloat 18s ease-in-out infinite reverse" }) }}/>
    <div style={{ position: "absolute", top: "35%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,140,45,.06) 0%,transparent 70%)", ...(stable ? {} : { animation: "oFloat 11s ease-in-out infinite 2s" }) }}/>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(26,92,26,.07) 1px, transparent 1px)", backgroundSize: "30px 30px" }}/>
  </div>
);

const FInput = ({ label, type = "text", value, onChange, Left, Right, onRight, required, autoFocus }) => {
  const [focus, setFocus] = useState(false);
  const ref = useRef();
  const lifted = focus || !!value;
  useEffect(() => { if (autoFocus) setTimeout(() => ref.current?.focus(), 80); }, [autoFocus]);
  return (
    <div onClick={() => ref.current?.focus()} style={{
      position: "relative", borderRadius: 16, cursor: "text", minHeight: 58,
      background: focus ? "#fff" : "#f9fcf9",
      border: `1.5px solid ${focus ? "#1a5c1a" : lifted ? "#a8c8a8" : "#dce8dc"}`,
      boxShadow: focus ? "0 0 0 4px rgba(26,92,26,.1), 0 2px 8px rgba(0,0,0,.04)" : "0 1px 3px rgba(0,0,0,.03)",
      transition: "all .22s cubic-bezier(.4,0,.2,1)",
    }}>
      <label style={{
        position: "absolute", left: Left ? 44 : 15, top: 0, pointerEvents: "none",
        transform: lifted ? "translateY(9px) scale(.72)" : "translateY(50%) translateY(-50%) scale(1)",
        transformOrigin: "left center",
        fontSize: 15, fontWeight: 700,
        color: focus ? "#1a5c1a" : "#8aaa8a",
        transition: "all .22s cubic-bezier(.4,0,.2,1)", whiteSpace: "nowrap",
      }}>
        {label}{required && <span style={{ color: "#e53e3e", marginLeft: 2 }}>*</span>}
      </label>
      {Left && <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focus ? "#1a5c1a" : "#9cac9c", transition: "color .22s", pointerEvents: "none" }}>{Left}</div>}
      <input ref={ref} type={type} value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", background: "transparent", border: "none", outline: "none",
          padding: `${lifted ? "26px" : "18px"} ${Right ? "44px" : "15px"} ${lifted ? "10px" : "18px"} ${Left ? "44px" : "15px"}`,
          fontSize: 15, fontWeight: 600, color: "#0e1e0e", fontFamily: "inherit", transition: "padding .2s",
        }}
      />
      {Right && (
        <button type="button" onClick={onRight} style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", color: "#9cac9c", padding: 4, display: "flex",
        }}>{Right}</button>
      )}
    </div>
  );
};

const FSelect = ({ label, value, onChange, opts, Left }) => {
  const [focus, setFocus] = useState(false);
  const lifted = focus || !!value;
  return (
    <div style={{
      position: "relative", borderRadius: 16, cursor: "pointer", minHeight: 58,
      background: focus ? "#fff" : "#f9fcf9",
      border: `1.5px solid ${focus ? "#1a5c1a" : lifted ? "#a8c8a8" : "#dce8dc"}`,
      boxShadow: focus ? "0 0 0 4px rgba(26,92,26,.1)" : "0 1px 3px rgba(0,0,0,.03)",
      transition: "all .22s",
    }}>
      <label style={{
        position: "absolute", left: Left ? 44 : 15, top: 0, pointerEvents: "none",
        transform: lifted ? "translateY(9px) scale(.72)" : "translateY(50%) translateY(-50%) scale(1)",
        transformOrigin: "left center",
        fontSize: 15, fontWeight: 700, color: focus ? "#1a5c1a" : "#8aaa8a",
        transition: "all .22s", whiteSpace: "nowrap",
      }}>{label}</label>
      {Left && <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focus ? "#1a5c1a" : "#9cac9c", transition: "color .22s", pointerEvents: "none" }}>{Left}</div>}
      <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", background: "transparent", border: "none", outline: "none", appearance: "none",
          padding: `26px 40px 10px ${Left ? "44px" : "15px"}`,
          fontSize: 15, fontWeight: 600, color: value ? "#0e1e0e" : "transparent",
          fontFamily: "inherit", cursor: "pointer",
        }}>
        <option value="">Select</option>
        {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9cac9c", pointerEvents: "none" }}>{ic.ChevD(16)}</div>
    </div>
  );
};

const Toggle = ({ on, onChange }) => (
  <button type="button" onClick={() => onChange(!on)} style={{
    width: 46, height: 26, borderRadius: 100, border: "none", cursor: "pointer", flexShrink: 0,
    background: on ? "linear-gradient(135deg,#1a5c1a,#3aaa3a)" : "#dce8dc",
    position: "relative", transition: "background .22s",
    boxShadow: on ? "0 2px 10px rgba(26,92,26,.3)" : "none",
  }}>
    <span style={{
      position: "absolute", top: 4, left: on ? "calc(100% - 22px)" : 4,
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,.18)", transition: "left .22s cubic-bezier(.4,0,.2,1)",
    }}/>
  </button>
);

const Chk = ({ on, onChange, label, sub, icon, ic2 = "#1a5c1a" }) => (
  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "5px 0", userSelect: "none" }}>
    <div style={{
      width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
      border: `2px solid ${on ? "#1a5c1a" : "#ccd8cc"}`,
      background: on ? "linear-gradient(135deg,#1a5c1a,#2d8c2d)" : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s",
      boxShadow: on ? "0 2px 8px rgba(26,92,26,.22)" : "none",
    }}>
      {on && <span style={{ color: "#fff" }}>{ic.Check(12)}</span>}
    </div>
    <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} style={{ display: "none" }}/>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <span style={{ color: ic2 }}>{icon}</span>}
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a2b1a" }}>{label}</span>
      </div>
      {sub && <div style={{ fontSize: 11, color: "#7a9a7a", fontWeight: 500, marginTop: 2 }}>{sub}</div>}
    </div>
  </label>
);

const Or = ({ t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,#ccd8cc)" }}/>
    <span style={{ fontSize: 11, fontWeight: 900, color: "#9aaa9a", letterSpacing: 1.2, textTransform: "uppercase", whiteSpace: "nowrap" }}>{t}</span>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,#ccd8cc)" }}/>
  </div>
);

const Btn = ({ children, onClick, disabled, icon, full = true }) => (
  <button type="button" onClick={onClick} disabled={disabled} style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: full ? "100%" : "auto", padding: "15px 24px", borderRadius: 16, border: "none",
    background: disabled ? "#c8d8c8" : "linear-gradient(135deg,#1a5c1a 0%,#2d8c2d 55%,#3aaa3a 100%)",
    color: "#fff", fontSize: 15, fontWeight: 900, cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 6px 24px rgba(26,92,26,.3), 0 2px 8px rgba(0,0,0,.07)",
    transition: "all .18s", letterSpacing: 0.3,
  }}
  onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,92,26,.38)"; } }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = disabled ? "none" : "0 6px 24px rgba(26,92,26,.3)"; }}
  >
    {children}{icon && <span style={{ display: "flex" }}>{icon}</span>}
  </button>
);

const Ghost = ({ children, onClick, icon }) => (
  <button type="button" onClick={onClick} style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flex: 1,
    padding: "13px 16px", borderRadius: 16, border: "1.5px solid #ccd8cc", background: "#fff",
    fontSize: 14, fontWeight: 700, color: "#4a6a4a", cursor: "pointer", transition: "all .16s",
  }}
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1a5c1a"; e.currentTarget.style.color = "#1a5c1a"; }}
  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ccd8cc"; e.currentTarget.style.color = "#4a6a4a"; }}
  >
    {icon}{children}
  </button>
);

const GoogleBtn = ({ label, onClick }) => (
  <button type="button" onClick={onClick} style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%",
    padding: "14px 20px", borderRadius: 16, border: "1.5px solid #dce8dc", background: "#fff",
    fontSize: 15, fontWeight: 800, color: "#1a2b1a", cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,.04)", transition: "all .18s",
  }}
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a8c8a8"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.09)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#dce8dc"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"; e.currentTarget.style.transform = ""; }}
  >
    {ic.Google(20)}{label}
  </button>
);

const STEPS_CFG = [
  { n: 1, label: "Account", Icon: (s) => ic.Lock(s) },
  { n: 2, label: "Profile", Icon: (s) => ic.User(s) },
  { n: 3, label: "Delivery", Icon: (s) => ic.Pin(s) },
  { n: 4, label: "Prefs", Icon: (s) => ic.Leaf(s) },
];

const StepBar = ({ cur }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 28, padding: "0 2px" }}>
    {STEPS_CFG.map((s, i) => {
      const done = cur > s.n; const active = cur === s.n;
      return (
        <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < STEPS_CFG.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: done ? "linear-gradient(135deg,#1a5c1a,#2d8c2d)" : active ? "#fff" : "#f0f6f0",
              border: `2.5px solid ${done || active ? "#1a5c1a" : "#ccd8cc"}`,
              boxShadow: active ? "0 0 0 6px rgba(26,92,26,.1), 0 4px 14px rgba(26,92,26,.18)" : done ? "0 2px 8px rgba(26,92,26,.18)" : "none",
              transition: "all .3s cubic-bezier(.4,0,.2,1)",
              color: done ? "#fff" : active ? "#1a5c1a" : "#a0b4a0",
            }}>
              {done ? <span style={{ color: "#fff" }}>{ic.Check(16)}</span> : s.Icon(16)}
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, color: done || active ? "#1a5c1a" : "#a0b4a0", transition: "color .3s", whiteSpace: "nowrap" }}>{s.label}</span>
          </div>
          {i < STEPS_CFG.length - 1 && (
            <div style={{ flex: 1, height: 2.5, borderRadius: 100, margin: "0 6px 18px", background: done ? "linear-gradient(90deg,#1a5c1a,#2d8c2d)" : "#e0eae0", transition: "background .4s" }}/>
          )}
        </div>
      );
    })}
  </div>
);

const Card = ({ children, mw = 440, noAnimation = false }) => (
  <div style={{
    background: "rgba(255,255,255,.96)", backdropFilter: "blur(28px)",
    borderRadius: 28, border: "1px solid rgba(26,92,26,.09)",
    padding: "36px 30px 30px", width: "100%", maxWidth: mw, position: "relative", overflow: "hidden",
    boxShadow: "0 8px 48px rgba(26,92,26,.1), 0 2px 12px rgba(0,0,0,.04), inset 0 1px 0 rgba(255,255,255,.9)",
    ...(noAnimation ? {} : { animation: "cardIn .45s cubic-bezier(.22,.84,.44,1) both" }),
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3.5, background: "linear-gradient(90deg,#1a5c1a,#2d8c2d 30%,#d4a017 50%,#2d8c2d 70%,#1a5c1a)", backgroundSize: "200% 100%", ...(noAnimation ? {} : { animation: "shimH 5s linear infinite" }) }}/>
    {children}
  </div>
);

const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
@keyframes oFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-26px)}}
@keyframes shimH{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes cardIn{from{opacity:0;transform:translateY(22px) scale(.97)}to{opacity:1;transform:none}}
@keyframes sIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

async function fetchAuthMeAndMerge(dispatch, setCredentials, data, onSuccess) {
  const token = data?.token ?? data?.accessToken;
  if (!token) {
    onSuccess?.();
    return;
  }
  try {
    const base = DB_URL.replace(/\/api\/?$/, "");
    const res = await fetch(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const json = await res.json().catch(() => ({}));
    const user = json?.data ?? json?.user ?? json;
    if (user && (user._id || user.id)) {
      dispatch(setCredentials({ ...data, ...user }));
    }
  } catch (_) {}
  onSuccess?.();
}

export function SignInForm({ onSuccess, onSwitch, compact, inModal, returnUrl }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const onSuccessWithReturn = (url) => onSuccess?.(url ?? returnUrl);

  const handleContinueWithGoogle = () => {
    if (typeof window === "undefined") return;
    const returnPath = window.location.pathname + window.location.search;
    const signinPath = "/signin" + (returnPath && returnPath !== "/" && returnPath !== "/signin" ? "?returnUrl=" + encodeURIComponent(returnPath) : "");
    const redirectUrl = window.location.origin + signinPath;
    const base = API_ORIGIN || DB_URL.replace(/\/api\/?$/, "");
    const url = `${base}/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = url;
  };

  const handleSubmit = async () => {
    if (!email?.trim() || !pw) return;
    try {
      const res = await login({ email: email.trim(), password: pw }).unwrap();
      const data = res?.data ?? res;
      if (data?.token != null || data?._id != null) {
        dispatch(setCredentials(data));
        await fetchAuthMeAndMerge(dispatch, setCredentials, data, onSuccessWithReturn);
      }
    } catch (err) {
      toast({
        title: "Sign in failed",
        description: err?.data?.message || err?.message || "Invalid email or password",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const cardMw = inModal ? 460 : (compact ? 380 : 420);
  return (
    <>
      <style>{AUTH_CSS}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card mw={cardMw}>
            <div style={{ textAlign: "center", marginBottom: (compact && !inModal) ? 18 : 26 }}>
            <Logo scale={(compact && !inModal) ? 0.9 : 1} />
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: (compact && !inModal) ? 24 : 30, color: "#0e1e0e", lineHeight: 1.1, marginTop: (compact && !inModal) ? 12 : 18, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ fontSize: 13, color: "#7a9a7a", fontWeight: 600 }}>Sign in to continue shopping fresh</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 22 }}>
            {[{ I: ic.Shield(13), t: "Secure" }, { I: ic.Zap(13), t: "Instant" }, { I: ic.Leaf(13), t: "Fresh daily" }].map((b) => (
              <div key={b.t} style={{ display: "flex", alignItems: "center", gap: 5, color: "#2d8c2d" }}>
                {b.I}<span style={{ fontSize: 11, fontWeight: 800, color: "#3a6a3a" }}>{b.t}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <GoogleBtn label="Continue with Google" onClick={handleContinueWithGoogle} />
            <Or t="or sign in with email" />
            <FInput label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} Left={ic.Mail(16)} required autoFocus />
            <FInput label="Password" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)}
              Left={ic.Lock(16)} Right={show ? ic.EyeOff(16) : ic.Eye(16)} onRight={() => setShow((v) => !v)} required />
            <Btn onClick={handleSubmit} disabled={!email?.trim() || !pw || isLoading}
              icon={isLoading ? <div style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }}/> : ic.Arrow(16)}>
              {isLoading ? "Signing in…" : "Sign in"}
            </Btn>
            {onSwitch && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#7a9a7a", fontWeight: 600 }}>
                New to YooKatale? <button onClick={onSwitch} type="button" style={{ background: "none", border: "none", color: "#1a5c1a", fontWeight: 900, cursor: "pointer", fontSize: 13 }}>Create account</button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

const SMETA = [
  { title: "Create account", sub: "Set up your secure login" },
  { title: "Personal details", sub: "A little bit about you" },
  { title: "Delivery address", sub: "Where we bring your groceries" },
  { title: "Your preferences", sub: "Make it yours" },
];

export function SignUpForm({ onSuccess, onSwitch, inModal, stable = false, returnUrl }) {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", confirm: "",
    firstName: "", lastName: "", phone: "", dob: "", gender: "",
    address: "", city: "", district: "", instructions: "",
    veg: false, notifEmail: true, notifPhone: false, notifWA: false, agree: false,
  });
  const dispatch = useDispatch();
  const toast = useToast();
  const [register, { isLoading }] = useRegisterMutation();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onSuccessWithReturn = (url) => onSuccess?.(url ?? returnUrl);

  const handleContinueWithGoogle = () => {
    if (typeof window === "undefined") return;
    const returnPath = window.location.pathname + window.location.search;
    const signupPath = "/signup" + (returnPath && returnPath !== "/" && returnPath !== "/signup" ? "?returnUrl=" + encodeURIComponent(returnPath) : "");
    const redirectUrl = window.location.origin + signupPath;
    const base = API_ORIGIN || DB_URL.replace(/\/api\/?$/, "");
    const url = `${base}/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = url;
  };

  const handleSubmit = async () => {
    if (!form.agree) return;
    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: [form.firstName, form.lastName].filter(Boolean).join(" ") || form.email,
        phone: form.phone || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        district: form.district || undefined,
      };
      const res = await register(payload).unwrap();
      const data = res?.data ?? res;
      if (data?.token != null || data?._id != null) {
        dispatch(setCredentials(data));
        await fetchAuthMeAndMerge(dispatch, setCredentials, data, onSuccessWithReturn);
      }
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Please try again";
      const isEmailExists = /already|exist|registered|in use/i.test(String(msg));
      toast({
        title: isEmailExists ? "Email already registered" : "Sign up failed",
        description: isEmailExists
          ? "This email is already in use. Sign in instead or use Continue with Google."
          : msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const meta = SMETA[step - 1];
  const str = form.password.length;
  const strength = str === 0 ? 0 : str < 5 ? 1 : str < 8 ? 2 : str < 12 ? 3 : 4;
  const strColor = ["#e0eae0", "#ef4444", "#f59e0b", "#3b82f6", "#16a34a"][strength];
  const strLabel = ["", "Too short", "Weak", "Good", "Strong"][strength];
  const validStep1 = form.email && form.password.length >= 6 && form.password === form.confirm;
  const stepContentStyle = { display: "flex", flexDirection: "column", gap: 13 };
  const signUpCardMw = inModal ? 520 : 480;

  return (
    <>
      <style>{AUTH_CSS}</style>
      <Card mw={signUpCardMw} noAnimation={stable}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Logo />
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, color: "#0e1e0e", lineHeight: 1.1, marginTop: 16 }}>{meta.title}</h1>
          <p style={{ fontSize: 13, color: "#7a9a7a", fontWeight: 600, marginTop: 5 }}>{meta.sub}</p>
        </div>
        <StepBar cur={step} />
        {step === 1 && (
          <div style={stepContentStyle}>
            <GoogleBtn label="Sign up with Google" onClick={handleContinueWithGoogle} />
            <Or t="or create with email" />
            <FInput label="Email address" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} Left={ic.Mail(16)} required autoFocus />
            <FInput label="Create password" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)}
              Left={ic.Lock(16)} Right={showPw ? ic.EyeOff(16) : ic.Eye(16)} onRight={() => setShowPw((v) => !v)} required />
            {form.password.length > 0 && (
              <div style={{ marginTop: -6, padding: "0 2px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map((i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: i <= strength ? strColor : "#e0eae0", transition: "background .3s" }}/>)}
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: strColor }}>{strLabel}</span>
              </div>
            )}
            <FInput label="Confirm password" type={showConfirm ? "text" : "password"} value={form.confirm} onChange={(e) => set("confirm", e.target.value)}
              Left={ic.Lock(16)} Right={showConfirm ? ic.EyeOff(16) : ic.Eye(16)} onRight={() => setShowConfirm((v) => !v)} />
            {form.confirm && form.password !== form.confirm && <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginTop: -8 }}>Passwords do not match</p>}
            <Btn onClick={() => setStep(2)} disabled={!validStep1} icon={ic.ChevR(16)}>Continue</Btn>
          </div>
        )}
        {step === 2 && (
          <div style={stepContentStyle}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FInput label="First name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} Left={ic.User(16)} required autoFocus />
              <FInput label="Last name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} Left={ic.User(16)} required />
            </div>
            <FInput label="Phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} Left={ic.Phone(16)} />
            <div style={{ display: "flex", gap: 10 }}>
              <Ghost onClick={() => setStep(1)} icon={ic.ChevL(16)}>Back</Ghost>
              <div style={{ flex: 1 }}><Btn onClick={() => setStep(3)} disabled={!form.firstName || !form.lastName} icon={ic.ChevR(16)}>Continue</Btn></div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={stepContentStyle}>
            <FInput label="Street / Area" value={form.address} onChange={(e) => set("address", e.target.value)} Left={ic.Pin(16)} autoFocus />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FInput label="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
              <FInput label="District" value={form.district} onChange={(e) => set("district", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Ghost onClick={() => setStep(2)} icon={ic.ChevL(16)}>Back</Ghost>
              <div style={{ flex: 1 }}><Btn onClick={() => setStep(4)} icon={ic.ChevR(16)}>Continue</Btn></div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div style={stepContentStyle}>
            <div style={{ background: "#f8fdf8", borderRadius: 16, padding: "14px 16px", border: "1px solid #cce8cc" }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#1a5c1a", textTransform: "uppercase", letterSpacing: 0.9, marginBottom: 8 }}>Notifications</div>
              <Chk on={form.notifEmail} onChange={(v) => set("notifEmail", v)} icon={ic.Mail(14)} ic2="#3b82f6" label="Email" />
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "4px 0", userSelect: "none" }}>
              <div style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                border: `2px solid ${form.agree ? "#1a5c1a" : "#ccd8cc"}`,
                background: form.agree ? "linear-gradient(135deg,#1a5c1a,#2d8c2d)" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s",
                boxShadow: form.agree ? "0 2px 8px rgba(26,92,26,.22)" : "none",
              }}>
                {form.agree && <span style={{ color: "#fff" }}>{ic.Check(12)}</span>}
              </div>
              <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} style={{ display: "none" }}/>
              <p style={{ fontSize: 13, color: "#4a6a4a", fontWeight: 500, lineHeight: 1.6 }}>
                I agree to the Terms of Service and Privacy Policy
              </p>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <Ghost onClick={() => setStep(3)} icon={ic.ChevL(16)}>Back</Ghost>
              <div style={{ flex: 1 }}><Btn onClick={handleSubmit} disabled={!form.agree || isLoading} icon={isLoading ? <div style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }}/> : ic.Arrow(16)}>Create account</Btn></div>
            </div>
          </div>
        )}
        {onSwitch && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#7a9a7a", fontWeight: 600, marginTop: 18 }}>
            Already have an account? <button onClick={onSwitch} type="button" style={{ background: "none", border: "none", color: "#1a5c1a", fontWeight: 900, cursor: "pointer", fontSize: 13 }}>Sign in</button>
          </p>
        )}
      </Card>
    </>
  );
}

export { Logo, Bg, Card };
