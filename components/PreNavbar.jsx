"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CLIENT_DASHBOARD_URL } from "@constants/constants";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.yookataleapp.app&pcampaignid=web_share";

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Svg = ({ children, size = 16, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const StarIcon = ({ s = 13 }) => <Svg size={s} fill="#e07820" stroke="#e07820" sw={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>;
const HelpIcon = ({ s = 13 }) => <Svg size={s}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></Svg>;
const FAQIcon = ({ s = 13 }) => <Svg size={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;
const TruckIcon = ({ s = 13 }) => <Svg size={s}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Svg>;
const DownloadIcon = ({ s = 13 }) => <Svg size={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
const XIcon = ({ s = 12 }) => <Svg size={s}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Svg>;
const SparkleIcon = ({ s = 10 }) => <Svg size={s} fill="#f0c020" stroke="#f0c020" sw={1}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></Svg>;
const ArrowRight = ({ s = 12, c = "currentColor" }) => <Svg size={s} stroke={c}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Svg>;
const FlowerIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
  </svg>
);

function useCountdown(target) {
  const calc = () => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
    return { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000), done: false };
  };
  const [t, set] = useState(calc);
  useEffect(() => { const id = setInterval(() => set(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const Tile = ({ v, label, small }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
    <div style={{
      background: "rgba(0,0,0,.38)", backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,.2)", borderRadius: small ? 6 : 8,
      padding: small ? "3px 5px" : "4px 8px",
      minWidth: small ? 28 : 38, textAlign: "center",
      fontFamily: "'Sora',sans-serif", fontVariantNumeric: "tabular-nums",
      fontSize: small ? 14 : 18, fontWeight: 900, color: "#fff", lineHeight: 1.1,
    }}>{String(v).padStart(2, "0")}</div>
    {label && <span style={{ fontSize: small ? 7 : 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(255,255,255,.55)" }}>{label}</span>}
  </div>
);
const Sep = ({ small }) => (
  <span style={{ fontSize: small ? 12 : 16, fontWeight: 900, color: "rgba(255,255,255,.45)", marginBottom: small ? 6 : 10, lineHeight: 1 }}>:</span>
);

/* Mother's Day & Women's Day offers */
const offers = [
  { tag: "MOTHER'S DAY", title: "Mother's Day Special Offers", sub: "Gift hampers, flowers & gourmet treats", color: "#c0125a" },
  { tag: "UP TO 40% OFF", title: "Women's Wellness Bundles", sub: "Vitamins, superfoods & self-care", color: "#e91e8c" },
  { tag: "BUY 2 GET 1 FREE", title: "Fresh Fruit Hampers", sub: "Hand-picked seasonal fruits for her", color: "#e84393" },
  { tag: "FREE DELIVERY", title: "Flower & Gourmet Gift Sets", sub: "Same-day delivery across Kampala", color: "#c0125a" },
  { tag: "30% OFF", title: "Natural Skincare & Beauty", sub: "Organic, locally sourced beauty", color: "#9c1d6e" },
  { tag: "SPECIAL EDITION", title: "Celebration Cake Box", sub: "Custom cakes + dessert combos", color: "#e05090" },
];

const PRENAVBAR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
.prenav-root *, .prenav-root *::before, .prenav-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.prenav-root { --g: #1a5c1a; --gl: #2d8c2d; --orange: #e07820; --gold: #f0c020; --dark: #0e180e; --surf: #fff; --bg: #edf0ea; --mid: #445444; --muted: #8a9e87; font-family: 'Sora', sans-serif; }
@keyframes prenav-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes prenav-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes prenav-shimmer { from { background-position: 300% 0; } to { background-position: -300% 0; } }
@keyframes prenav-offerIn { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
@keyframes prenav-sparkle { 0%, 100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.3) rotate(15deg); } }
.prenav-wb { position: relative; overflow: hidden; background: linear-gradient(125deg, #1a0028 0%, #4a0060 28%, #8c0050 58%, #c0125a 82%, #e91e8c 100%); }
.prenav-wb-grain { position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: 0.38; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E"); }
.prenav-wb-sweep { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.06) 50%, transparent 65%); background-size: 300% 100%; animation: prenav-shimmer 5s infinite; }
.prenav-wb-blob { position: absolute; border-radius: 50%; background: rgba(255,255,255,.06); pointer-events: none; z-index: 1; }
.prenav-wb-x { position: absolute; top: 8px; right: 8px; z-index: 20; width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,.15); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,.85); transition: background .18s; }
.prenav-wb-x:hover { background: rgba(255,255,255,.3); }
.prenav-pill { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.28); backdrop-filter: blur(6px); border-radius: 100px; padding: 2px 8px; font-size: 8.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #fff; width: fit-content; }
.prenav-pill span { animation: prenav-sparkle 2.5s infinite; display: inline-block; }
.prenav-otag { display: inline-block; font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #fff; background: rgba(255,255,255,.22); border-radius: 4px; padding: 1px 6px; margin-bottom: 2px; }
.prenav-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,.35); cursor: pointer; transition: all .3s; border: none; padding: 0; flex-shrink: 0; }
.prenav-dot.on { width: 16px; border-radius: 2px; background: rgba(255,255,255,.9); }
.prenav-shop-btn { background: #fff; color: #c0125a; border: none; border-radius: 100px; font-family: 'Sora', sans-serif; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 3px 14px rgba(0,0,0,.22); transition: transform .15s, box-shadow .2s; flex-shrink: 0; white-space: nowrap; text-decoration: none; }
.prenav-shop-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.3); }
.prenav-wb-mob { position: relative; z-index: 5; padding: 11px 12px 10px; display: flex; flex-direction: column; gap: 9px; }
.prenav-mob-r1 { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.prenav-mob-brand { display: flex; align-items: center; gap: 7px; min-width: 0; }
.prenav-mob-emoji { font-size: 24px; animation: prenav-float 3s ease-in-out infinite; line-height: 1; flex-shrink: 0; }
.prenav-mob-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.prenav-mob-title { font-family: 'DM Serif Display', serif; font-size: 15px; color: #fff; line-height: 1.1; }
.prenav-mob-title i { color: #f9a8d4; }
.prenav-mob-cd { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; }
.prenav-mob-cd-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: rgba(255,255,255,.6); }
.prenav-mob-cd-row { display: flex; align-items: center; gap: 3px; }
.prenav-mob-r2 { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); backdrop-filter: blur(8px); border-radius: 12px; padding: 9px 10px; animation: prenav-offerIn .35s ease; }
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
.prenav-desk-emoji { font-size: 34px; animation: prenav-float 3s ease-in-out infinite; line-height: 1; }
.prenav-desk-badge { display: flex; flex-direction: column; gap: 3px; }
.prenav-desk-title { font-family: 'DM Serif Display', serif; font-size: clamp(17px, 2vw, 24px); color: #fff; line-height: 1.1; }
.prenav-desk-title i { color: #f9a8d4; }
.prenav-desk-center { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; animation: prenav-offerIn .35s ease; }
.prenav-desk-offer-emoji { font-size: 22px; flex-shrink: 0; }
.prenav-desk-offer-body { min-width: 0; }
.prenav-desk-offer-title { font-size: 14px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.prenav-desk-offer-sub { font-size: 11px; color: rgba(255,255,255,.7); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
.prenav-desk-shop-btn { font-size: 12px; padding: 8px 18px; }
.prenav-desk-dots { display: flex; gap: 5px; flex-shrink: 0; }
.prenav-desk-cd { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
.prenav-desk-cd-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,.6); white-space: nowrap; }
.prenav-desk-cd-row { display: flex; align-items: center; gap: 4px; }
.prenav-ann { background: #0e1a0e; height: 32px; overflow: hidden; position: relative; }
.prenav-ann-item.prenav-ann-link { text-decoration: none; color: inherit; }
.prenav-ann-track { display: flex; white-space: nowrap; height: 100%; align-items: center; animation: prenav-marquee 26s linear infinite; }
.prenav-ann:hover .prenav-ann-track { animation-play-state: paused; }
.prenav-ann-item { display: inline-flex; align-items: center; gap: 6px; padding: 0 22px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.88); white-space: nowrap; letter-spacing: 0.2px; }
.prenav-ann-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--orange); flex-shrink: 0; }
.prenav-ann::before, .prenav-ann::after { content: ''; position: absolute; top: 0; bottom: 0; width: 36px; z-index: 2; pointer-events: none; }
.prenav-ann::before { left: 0; background: linear-gradient(to right, #0e1a0e, transparent); }
.prenav-ann::after { right: 0; background: linear-gradient(to left, #0e1a0e, transparent); }
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

export default function PreNavbar() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);
  const cd = useCountdown("2026-03-08T23:59:59");

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
          <div className="prenav-wb-blob" style={{ width: 180, height: 180, top: -70, right: "22%" }} />
          <div className="prenav-wb-blob" style={{ width: 85, height: 85, bottom: -30, right: "8%" }} />
          <div className="prenav-wb-blob" style={{ width: 50, height: 50, top: 5, left: "44%" }} />
          <button type="button" className="prenav-wb-x" onClick={() => setShow(false)} aria-label="Close"><XIcon s={11} /></button>

          <div className="prenav-wb-mob">
            <div className="prenav-mob-r1">
              <div className="prenav-mob-brand">
                <div className="prenav-mob-emoji"><FlowerIcon s={24} /></div>
                <div className="prenav-mob-text">
                  <div className="prenav-pill"><span><SparkleIcon s={8} /></span>Women&apos;s Day</div>
                  <div className="prenav-mob-title">Celebrate <i>Her</i></div>
                </div>
              </div>
              <div className="prenav-mob-cd">
                <div className="prenav-mob-cd-label">Ends Mar 8</div>
                {cd.done ? <span style={{ fontSize: 10, color: "rgba(255,255,255,.7)", fontWeight: 700 }}>Ended</span> : (
                  <div className="prenav-mob-cd-row">
                    <Tile v={cd.d} small /><Sep small />
                    <Tile v={cd.h} small /><Sep small />
                    <Tile v={cd.m} small /><Sep small />
                    <Tile v={cd.s} small />
                  </div>
                )}
              </div>
            </div>
            <Link href="/search?q=promotions" className="prenav-mob-r2" key={`m${idx}`}>
              <div className="prenav-mob-offer-emoji"><FlowerIcon s={22} /></div>
              <div className="prenav-mob-offer-text">
                <div className="prenav-otag">{o.tag}</div>
                <div className="prenav-mob-offer-title">{o.title}</div>
                <div className="prenav-mob-offer-sub">{o.sub}</div>
              </div>
              <span className="prenav-shop-btn prenav-mob-shop-btn">Shop <ArrowRight s={10} c={o.color} /></span>
            </Link>
            <div className="prenav-mob-r3">
              {offers.map((_, i) => (
                <button key={i} type="button" className={`prenav-dot${idx === i ? " on" : ""}`} onClick={() => setIdx(i)} aria-label={`Offer ${i + 1}`} />
              ))}
            </div>
          </div>

          <div className="prenav-wb-desk">
            <div className="prenav-desk-left">
              <div className="prenav-desk-emoji"><FlowerIcon s={34} /></div>
              <div className="prenav-desk-badge">
                <div className="prenav-pill"><span><SparkleIcon s={9} /></span>International Women&apos;s Day</div>
                <div className="prenav-desk-title">Celebrate <i>Her</i></div>
              </div>
            </div>
            <Link href="/search?q=promotions" className="prenav-desk-center" key={`d${idx}`}>
              <div className="prenav-desk-offer-emoji"><FlowerIcon s={22} /></div>
              <div className="prenav-desk-offer-body">
                <div className="prenav-otag">{o.tag}</div>
                <div className="prenav-desk-offer-title">{o.title}</div>
                <div className="prenav-desk-offer-sub">{o.sub}</div>
              </div>
              <span className="prenav-shop-btn prenav-desk-shop-btn">Shop Now <ArrowRight s={12} c={o.color} /></span>
            </Link>
            <div className="prenav-desk-dots">
              {offers.map((_, i) => (
                <button key={i} type="button" className={`prenav-dot${idx === i ? " on" : ""}`} onClick={() => setIdx(i)} aria-label={`Offer ${i + 1}`} />
              ))}
            </div>
            <div className="prenav-desk-cd">
              <div className="prenav-desk-cd-label">{cd.done ? "Offer Ended" : "Ends March 8th"}</div>
              {!cd.done && (
                <div className="prenav-desk-cd-row">
                  <Tile v={cd.d} label="Days" /><Sep />
                  <Tile v={cd.h} label="Hrs" /><Sep />
                  <Tile v={cd.m} label="Min" /><Sep />
                  <Tile v={cd.s} label="Sec" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="prenav-ann">
        <div className="prenav-ann-track">
          {[0, 1].map((loop) => (
            <span key={loop} style={{ display: "inline-flex", alignItems: "center" }}>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="prenav-ann-item prenav-ann-link">Download YooKatale App</a><span className="prenav-ann-dot" />
              <span className="prenav-ann-item">Free Delivery within 3km</span><span className="prenav-ann-dot" />
              <Link href="/search?q=promotions" className="prenav-ann-item prenav-ann-link" style={{ color: "#f9a8d4" }}>Women&apos;s Day — Up to 40% off until March 8</Link><span className="prenav-ann-dot" />
              <span className="prenav-ann-item">Same-day delivery across Kampala</span><span className="prenav-ann-dot" />
              <span className="prenav-ann-item" style={{ color: "#f0c020" }}>Earn loyalty points on every order</span><span className="prenav-ann-dot" />
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
