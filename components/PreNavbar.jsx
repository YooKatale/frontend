"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CLIENT_DASHBOARD_URL } from "@constants/constants";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.yookataleapp.app&pcampaignid=web_share";

const CHRISTMAS_END = new Date("2026-12-26T23:59:59");

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Svg = ({ children, size = 16, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const StarIcon = ({ s = 13 }) => <Svg size={s} fill="#e07820" stroke="#e07820" sw={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>;
const HelpIcon = ({ s = 13 }) => <Svg size={s}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></Svg>;
const FAQIcon  = ({ s = 13 }) => <Svg size={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;
const TruckIcon = ({ s = 13 }) => <Svg size={s}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Svg>;
const DownloadIcon = ({ s = 13 }) => <Svg size={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
const XIcon = ({ s = 12 }) => <Svg size={s}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Svg>;
const ArrowRight = ({ s = 12, c = "currentColor" }) => <Svg size={s} stroke={c}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Svg>;

/* ─── CHRISTMAS ICONS ────────────────────────────────────────────────────── */
const ChristmasTree = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M12 2 8.5 7h2L7 12h3l-4 5h12l-4-5h3l-3.5-5h2L12 2Z" fill="#2d8c2d" stroke="#f0c020" strokeWidth="1" strokeLinejoin="round"/>
    <path d="M10 17h4v5h-4z" fill="#8b4513"/>
    <circle cx="12" cy="2.5" r="1.2" fill="#f0c020"/>
    <circle cx="9" cy="11" r=".8" fill="#c62828"/>
    <circle cx="15" cy="14" r=".8" fill="#f0c020"/>
  </svg>
);

const Ornament = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M10 4h4l-.7 2.2a8 8 0 1 1-2.6 0L10 4Z" fill="#c62828" stroke="#f0c020" strokeWidth="1.2"/>
    <path d="M10 4h4M12 4V2" stroke="#f0c020" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8 13h8M9 16h6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity=".9"/>
  </svg>
);

const SnowflakeIcon = ({ s = 14, opacity = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={`rgba(255,255,255,${opacity})`} strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7"/>
    <path d="m8 4 4 2 4-2M8 20l4-2 4 2M3 11l4-1 1-4M20 18l-4 1-1 4M3 13l4 1 1 4M20 6l-4-1-1-4"/>
  </svg>
);

/* ─── Christmas offers ───────────────────────────────────────────────────── */
const offers = [
  { tag: "CHRISTMAS SPECIAL", title: "Christmas Food Hampers",          sub: "Festive baskets delivered fresh to your door",       color: "#c62828", emoji: "🎄" },
  { tag: "FESTIVE BAKES",     title: "Holiday Treats & Desserts",         sub: "Make celebrations sweeter with seasonal favourites", color: "#e07820", emoji: "🍰" },
  { tag: "GIFT-WORTHY PICKS", title: "Sweets & Chocolate Collection",     sub: "Share something delicious this Christmas",           color: "#c62828", emoji: "🍫" },
  { tag: "FAMILY FEAST",      title: "Christmas Feast Boxes",             sub: "Generous meal picks for gathering loved ones",       color: "#e07820", emoji: "🍽️" },
  { tag: "SAME-DAY DELIVERY", title: "Fresh Holiday Produce Bundle",      sub: "Farm-fresh ingredients for festive cooking",         color: "#2e7d32", emoji: "🥬" },
  { tag: "SEASONAL FAVOURITE",title: "Organic Fruit & Veg Bundle",        sub: "Bright, fresh produce for the Christmas table",      color: "#c62828", emoji: "🍎" },
];

function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    return { days, hours, mins, secs, done: false };
  };
  const [cd, setCd] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setCd(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return cd;
}

const pad = (n) => String(n).padStart(2, "0");

const PRENAVBAR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
.prenav-root *, .prenav-root *::before, .prenav-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.prenav-root { --g: #1a5c1a; --gl: #2d8c2d; --orange: #e07820; --red: #c62828; --dark: #0d1b2a; --surf: #fff; --bg: #edf0ea; --mid: #445444; --muted: #8a9e87; font-family: 'Sora', sans-serif; }

@keyframes prenav-twinkle  { 0%, 100% { opacity: 1; transform: scale(1); }       50% { opacity: 0.3; transform: scale(0.6); } }
@keyframes prenav-float    { 0%, 100% { transform: translateY(0); }               50% { transform: translateY(-6px); } }
@keyframes prenav-marquee  { from { transform: translateX(0); }                   to   { transform: translateX(-50%); } }
@keyframes prenav-shimmer  { from { background-position: 300% 0; }               to   { background-position: -300% 0; } }
@keyframes prenav-offerIn  { from { opacity: 0; transform: translateY(7px); }    to   { opacity: 1; transform: translateY(0); } }
@keyframes prenav-sparkle  { 0%, 100% { transform: scale(1) rotate(0); }         50% { transform: scale(1.4) rotate(20deg); } }
@keyframes prenav-bounce   { 0%, 100% { transform: translateY(0) rotate(-3deg);} 50% { transform: translateY(-5px) rotate(3deg); } }

/* Christmas gradient — evergreen, cranberry, and warm gold */
.prenav-wb { position: relative; overflow: hidden; background: linear-gradient(125deg, #3b1018 0%, #0d2416 30%, #1a3a2a 58%, #551720 80%, #1a4a2a 100%); }
.prenav-wb-grain { position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: 0.18; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E"); }
.prenav-wb-sweep { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: linear-gradient(105deg, transparent 35%, rgba(240,192,32,.12) 50%, transparent 65%); background-size: 300% 100%; animation: prenav-shimmer 6s infinite; }

.prenav-wb-x { position: absolute; top: 8px; right: 8px; z-index: 20; width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,.15); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,.85); transition: background .18s; }
.prenav-wb-x:hover { background: rgba(255,255,255,.3); }

.prenav-pill { display: inline-flex; align-items: center; gap: 4px; background: rgba(198,40,40,.25); border: 1px solid rgba(240,192,32,.5); backdrop-filter: blur(6px); border-radius: 100px; padding: 2px 9px; font-size: 8.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #ffe29a; width: fit-content; }
.prenav-pill span { animation: prenav-sparkle 2.5s infinite; display: inline-block; }
.prenav-otag { display: inline-block; font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #ffe29a; background: rgba(198,40,40,.2); border-radius: 4px; padding: 1px 6px; margin-bottom: 2px; border: 1px solid rgba(240,192,32,.35); }
.prenav-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,.35); cursor: pointer; transition: all .3s; border: none; padding: 0; flex-shrink: 0; }
.prenav-dot.on { width: 16px; border-radius: 2px; background: #f0c020; }

.prenav-shop-btn { background: linear-gradient(135deg, #c62828, #e07820); color: #fff; border: none; border-radius: 100px; font-family: 'Sora', sans-serif; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 3px 14px rgba(198,40,40,.35); transition: transform .15s, box-shadow .2s; flex-shrink: 0; white-space: nowrap; text-decoration: none; }
.prenav-shop-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(198,40,40,.45); }

/* Countdown tiles */
.prenav-cd-wrap { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.prenav-cd-tile { display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,.12); border: 1px solid rgba(240,192,32,.35); border-radius: 7px; padding: 3px 6px; min-width: 32px; }
.prenav-cd-num { font-size: 15px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -0.5px; }
.prenav-cd-num.sm { font-size: 12px; }
.prenav-cd-lbl { font-size: 7.5px; font-weight: 600; color: rgba(255,255,255,.55); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px; }
.prenav-cd-sep { font-size: 15px; font-weight: 800; color: rgba(168,85,247,.8); align-self: flex-start; padding-top: 2px; }

/* Mobile layout */
.prenav-wb-mob { position: relative; z-index: 5; padding: 11px 12px 10px; display: flex; flex-direction: column; gap: 9px; }
.prenav-mob-r1 { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.prenav-mob-brand { display: flex; align-items: center; gap: 7px; min-width: 0; }
.prenav-mob-emoji { font-size: 24px; animation: prenav-bounce 3s ease-in-out infinite; line-height: 1; flex-shrink: 0; }
.prenav-mob-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.prenav-mob-title { font-family: 'DM Serif Display', serif; font-size: 15px; color: #fff; line-height: 1.1; }
.prenav-mob-title i { color: #ffe29a; }
.prenav-mob-r2 { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,.08); border: 1px solid rgba(168,85,247,.25); backdrop-filter: blur(8px); border-radius: 12px; padding: 9px 10px; animation: prenav-offerIn .35s ease; text-decoration: none; }
.prenav-mob-offer-emoji { font-size: 22px; flex-shrink: 0; line-height: 1; }
.prenav-mob-offer-text { flex: 1; min-width: 0; }
.prenav-mob-offer-title { font-size: 12.5px; font-weight: 800; color: #fff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 1.25; }
.prenav-mob-offer-sub { font-size: 10px; color: rgba(255,255,255,.7); font-weight: 500; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.prenav-mob-shop-btn { font-size: 10.5px; padding: 6px 12px; }
.prenav-mob-r3 { display: flex; gap: 4px; justify-content: center; }
.prenav-wb-mob { display: flex; }
.prenav-wb-desk { display: none; }
@media(min-width:768px) { .prenav-wb-mob { display: none; } .prenav-wb-desk { display: flex; align-items: center; gap: 14px; position: relative; z-index: 5; max-width: 1440px; margin: 0 auto; padding: 14px 24px; } }
@media(min-width:1280px) { .prenav-wb-desk { padding: 16px 32px; } }
.prenav-desk-left { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.prenav-desk-emoji { font-size: 34px; animation: prenav-bounce 3s ease-in-out infinite; line-height: 1; }
.prenav-desk-badge { display: flex; flex-direction: column; gap: 3px; }
.prenav-desk-title { font-family: 'DM Serif Display', serif; font-size: clamp(17px, 2vw, 24px); color: #fff; line-height: 1.1; }
.prenav-desk-title i { color: #ffe29a; }
.prenav-desk-center { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; animation: prenav-offerIn .35s ease; text-decoration: none; }
.prenav-desk-offer-emoji { font-size: 22px; flex-shrink: 0; }
.prenav-desk-offer-body { min-width: 0; }
.prenav-desk-offer-title { font-size: 14px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.prenav-desk-offer-sub { font-size: 11px; color: rgba(255,255,255,.7); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
.prenav-desk-shop-btn { font-size: 12px; padding: 8px 18px; }
.prenav-desk-dots { display: flex; gap: 5px; flex-shrink: 0; }

/* Ticker */
.prenav-ann { background: #0d0a1a; height: 32px; overflow: hidden; position: relative; }
.prenav-ann-item.prenav-ann-link { text-decoration: none; color: inherit; }
.prenav-ann-track { display: flex; white-space: nowrap; height: 100%; align-items: center; animation: prenav-marquee 28s linear infinite; }
.prenav-ann:hover .prenav-ann-track { animation-play-state: paused; }
.prenav-ann-item { display: inline-flex; align-items: center; gap: 6px; padding: 0 22px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.88); white-space: nowrap; letter-spacing: 0.2px; }
.prenav-ann-dot { width: 3px; height: 3px; border-radius: 50%; background: #f0c020; flex-shrink: 0; }
.prenav-ann::before, .prenav-ann::after { content: ''; position: absolute; top: 0; bottom: 0; width: 36px; z-index: 2; pointer-events: none; }
.prenav-ann::before { left: 0; background: linear-gradient(to right, #0d0a1a, transparent); }
.prenav-ann::after  { right: 0; background: linear-gradient(to left,  #0d0a1a, transparent); }
.prenav-util { display: none; background: var(--surf); border-bottom: 1px solid rgba(0,0,0,.07); height: 36px; }
@media(min-width:640px) { .prenav-util { display: flex; align-items: center; } }
.prenav-util-inner { max-width: 1440px; margin: 0 auto; width: 100%; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
@media(min-width:1280px) { .prenav-util-inner { padding: 0 32px; } }
.prenav-util-l { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--mid); cursor: pointer; transition: color .18s; text-decoration: none; }
.prenav-util-l:hover { color: var(--orange); }
.prenav-util-r { display: flex; align-items: center; gap: 2px; }
.prenav-util-btn { display: flex; align-items: center; gap: 4px; font-size: 11.5px; font-weight: 600; color: var(--mid); background: none; border: none; cursor: pointer; padding: 4px 9px; border-radius: 7px; font-family: 'Sora', sans-serif; white-space: nowrap; transition: background .18s, color .18s; text-decoration: none; }
.prenav-util-btn:hover { background: #f2f4f0; color: var(--dark); }
.prenav-util-sep { width: 1px; height: 13px; background: rgba(0,0,0,.1); margin: 0 1px; }
`;

/* ─── Countdown tile component ───────────────────────────────────────────── */
function CdTile({ num, label, small }) {
  return (
    <div className="prenav-cd-tile">
      <span className={`prenav-cd-num${small ? " sm" : ""}`}>{pad(num)}</span>
      <span className="prenav-cd-lbl">{label}</span>
    </div>
  );
}

function Countdown({ small }) {
  const { days, hours, mins, secs, done } = useCountdown(CHRISTMAS_END);
  if (done) return <span style={{ fontSize: 11, fontWeight: 800, color: "#ffe29a" }}>🎄 Merry Christmas!</span>;
  return (
    <div className="prenav-cd-wrap">
      <CdTile num={days}  label="days"  small={small} />
      <span className="prenav-cd-sep">:</span>
      <CdTile num={hours} label="hrs"   small={small} />
      <span className="prenav-cd-sep">:</span>
      <CdTile num={mins}  label="min"   small={small} />
      <span className="prenav-cd-sep">:</span>
      <CdTile num={secs}  label="sec"   small={small} />
    </div>
  );
}

export default function PreNavbar() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);
  const [snowflakes] = useState(() =>
    Array.from({ length: 16 }, () => ({
      x: 5 + Math.random() * 90,
      y: 4 + Math.random() * 80,
      s: 8 + Math.random() * 8,
      delay: (Math.random() * 3).toFixed(1),
      dur:   (1.8 + Math.random() * 2).toFixed(1),
    }))
  );

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % offers.length), 3800);
    return () => clearInterval(t);
  }, []);

  const o = offers[idx];

  return (
    <div className="prenav-root">
      <style dangerouslySetInnerHTML={{ __html: PRENAVBAR_CSS }} />
      {show && (
        <div className="prenav-wb">
          <div className="prenav-wb-grain" />
          <div className="prenav-wb-sweep" />

          {/* Scattered snowflakes */}
          {snowflakes.map((fl, i) => (
            <div key={i} style={{ position: "absolute", left: `${fl.x}%`, top: `${fl.y}%`, zIndex: 1, pointerEvents: "none", animation: `prenav-twinkle ${fl.dur}s infinite ${fl.delay}s` }}>
              <SnowflakeIcon s={fl.s} opacity={0.45 + Math.random() * 0.4} />
            </div>
          ))}

          <button type="button" className="prenav-wb-x" onClick={() => setShow(false)} aria-label="Close"><XIcon s={11} /></button>

          {/* ── MOBILE ── */}
          <div className="prenav-wb-mob">
            <div className="prenav-mob-r1">
              <div className="prenav-mob-brand">
                <div className="prenav-mob-emoji"><ChristmasTree s={28} /></div>
                <div className="prenav-mob-text">
                  <div className="prenav-pill"><span>🎄</span>Christmas Festival</div>
                  <div className="prenav-mob-title">Celebrate <i>Christmas</i> with us</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", color: "rgba(255,255,255,.55)" }}>Ends in</span>
                <Countdown small />
              </div>
            </div>

            <Link href="/marketplace" className="prenav-mob-r2" key={`m${idx}`}>
              <div className="prenav-mob-offer-emoji">{o.emoji}</div>
              <div className="prenav-mob-offer-text">
                <div className="prenav-otag">{o.tag}</div>
                <div className="prenav-mob-offer-title">{o.title}</div>
                <div className="prenav-mob-offer-sub">{o.sub}</div>
              </div>
              <span className="prenav-shop-btn prenav-mob-shop-btn">Shop <ArrowRight s={10} c="#fff" /></span>
            </Link>

            <div className="prenav-mob-r3">
              {offers.map((_, i) => (
                <button key={i} type="button" className={`prenav-dot${idx === i ? " on" : ""}`} onClick={() => setIdx(i)} aria-label={`Offer ${i + 1}`} />
              ))}
            </div>
          </div>

          {/* ── DESKTOP ── */}
          <div className="prenav-wb-desk">
            <div className="prenav-desk-left">
              <div className="prenav-desk-emoji"><Ornament s={42} /></div>
              <div className="prenav-desk-badge">
                <div className="prenav-pill"><span>🎄</span>Christmas Festival</div>
                <div className="prenav-desk-title">Celebrate <i>Christmas</i> with YooKatale</div>
              </div>
            </div>

            <Link href="/marketplace" className="prenav-desk-center" key={`d${idx}`}>
              <div className="prenav-desk-offer-emoji">{o.emoji}</div>
              <div className="prenav-desk-offer-body">
                <div className="prenav-otag">{o.tag}</div>
                <div className="prenav-desk-offer-title">{o.title}</div>
                <div className="prenav-desk-offer-sub">{o.sub}</div>
              </div>
              <span className="prenav-shop-btn prenav-desk-shop-btn">Shop Now <ArrowRight s={12} c="#fff" /></span>
            </Link>

            <div className="prenav-desk-dots">
              {offers.map((_, i) => (
                <button key={i} type="button" className={`prenav-dot${idx === i ? " on" : ""}`} onClick={() => setIdx(i)} aria-label={`Offer ${i + 1}`} />
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", color: "rgba(255,255,255,.55)" }}>Christmas sale ends in</span>
              <Countdown />
            </div>
          </div>
        </div>
      )}

      {/* ── Ticker ── */}
      <div className="prenav-ann">
        <div className="prenav-ann-track">
          {[0, 1].map((loop) => (
            <span key={loop} style={{ display: "inline-flex", alignItems: "center" }}>
              <span className="prenav-ann-item" style={{ color: "#ffe29a" }}>🎄 Merry Christmas from YooKatale!</span><span className="prenav-ann-dot" />
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="prenav-ann-item prenav-ann-link">Download YooKatale App</a><span className="prenav-ann-dot" />
              <span className="prenav-ann-item">Free Delivery within 3km</span><span className="prenav-ann-dot" />
              <Link href="/marketplace" className="prenav-ann-item prenav-ann-link" style={{ color: "#ffe29a" }}>Christmas Special Offers — Celebrate with great food</Link><span className="prenav-ann-dot" />
              <span className="prenav-ann-item">Same-day delivery across Kampala</span><span className="prenav-ann-dot" />
              <span className="prenav-ann-item" style={{ color: "#ffe29a" }}>Earn loyalty points on every Christmas order 🎁</span><span className="prenav-ann-dot" />
            </span>
          ))}
        </div>
      </div>

      <div className="prenav-util">
        <div className="prenav-util-inner">
          <Link href={CLIENT_DASHBOARD_URL} className="prenav-util-l"><StarIcon s={13} /> Sell on YooKatale</Link>
          <div className="prenav-util-r">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="prenav-util-btn"><DownloadIcon s={12} /> Get App</a>
            <div className="prenav-util-sep" />
            <Link href="/contact" className="prenav-util-btn"><HelpIcon s={12} /> Help</Link>
            <div className="prenav-util-sep" />
            <Link href="/faqs" className="prenav-util-btn"><FAQIcon s={12} /> FAQs</Link>
            <div className="prenav-util-sep" />
            <Link href="/account" className="prenav-util-btn"><TruckIcon s={12} /> Track Order</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
