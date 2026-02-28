"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@slices/authSlice";
import {
  useProductsGetMutation,
  useProductsCategoriesGetMutation,
  useGetCountryCuisinesQuery,
  useGetHomepageConfigQuery,
  useCartCreateMutation,
} from "@slices/productsApiSlice";
import { CategoriesJson, getImageUrl } from "@constants/constants";
import LoaderSkeleton from "@components/LoaderSkeleton";

/** Same as CategoryCard: normalize category name to match /public/assets/images/categories/ filenames */
function normalizeCategoryName(name) {
  if (!name || typeof name !== "string") return "";
  const map = {
    "Popular Product": "Popular Products", "popular product": "Popular Products", "Popular Products": "Popular Products",
    "Root Tubers": "root tubers", "root tubers": "root tubers", "Root tubers": "root tubers",
    "Roughhages": "roughages", "roughhages": "roughages", "Roughages": "roughages", "roughages": "roughages",
    "Juice": "juice", "juice": "juice", "Breakfast": "breakfast", "breakfast": "breakfast",
    "Vegetables": "vegetables", "vegetables": "vegetables",
    "juice&meals": "juice&meals", "Juice&meals": "juice&meals", "Juice & Meals": "juice&meals",
  };
  return map[name] || map[name.toLowerCase()] || name;
}

/** Resolve category image: backend imageUrl/image (via getImageUrl) or local /assets/images/categories/<name>.jpg */
function getCategoryImageSrc(cat) {
  const fromApi = cat?.imageUrl || cat?.image;
  if (fromApi && typeof fromApi === "string") return getImageUrl(fromApi);
  const normalized = normalizeCategoryName(cat?.name || "");
  if (normalized) return `/assets/images/categories/${normalized}.jpg`;
  return null;
}

const PLAY_STORE_APP_URL = "https://play.google.com/store/apps/details?id=com.yookataleapp.app&pcampaignid=web_share";

const Svg = ({ children, size = 16, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const XIcon = ({ s = 14 }) => <Svg size={s}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Svg>;
const ArrowRight = ({ s = 16, c = "currentColor" }) => <Svg size={s} stroke={c}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Svg>;
const ChevRight = ({ s = 14 }) => <Svg size={s}><path d="m9 18 6-6-6-6"/></Svg>;
const ChevLeft = ({ s = 16, c = "currentColor" }) => <Svg size={s} stroke={c}><path d="m15 18-6-6 6-6"/></Svg>;
const StarFill = ({ s = 12 }) => <Svg size={s} fill="#e07820" stroke="#e07820" sw={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>;
const HeartIcon = ({ s = 15 }) => <Svg size={s}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Svg>;
const CartAdd = ({ s = 15 }) => <Svg size={s}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><line x1="17" y1="9" x2="17" y2="13"/><line x1="15" y1="11" x2="19" y2="11"/></Svg>;
const FlameIcon = ({ s = 12 }) => <Svg size={s}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></Svg>;
const CompassIcon = ({ s = 12 }) => <Svg size={s}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></Svg>;
const GlobeIcon = ({ s = 12 }) => <Svg size={s}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></Svg>;
const TagIcon = ({ s = 10 }) => <Svg size={s}><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l9.29-9.29a1 1 0 0 0 0-1.41L12 2Z"/><path d="M7 7h.01"/></Svg>;
const DownloadIcon = ({ s = 16, c = "currentColor" }) => <Svg size={s} stroke={c}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
const GiftIcon = ({ s = 16, c = "currentColor" }) => <Svg size={s} stroke={c}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></Svg>;
const TruckIcon = ({ s = 16, c = "currentColor" }) => <Svg size={s} stroke={c}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Svg>;

const DEFAULT_SLIDES = [
  { tag: "YOOKATALE APP", title: "Fresh Groceries", accent: "Delivered Fast", desc: "Farm-fresh produce at your door in under 2 hours. Track in real-time on Android & iOS.", cta: "Download App", ctaSec: "Browse Web", accentColor: "#f0c020", bg: ["#061806", "#1a5c1a"] },
  { tag: "BEST SELLERS", title: "Top Picks", accent: "This Week", desc: "Freshness curated daily. From local farms to your table, always at the best price.", cta: "Shop Now", ctaSec: "View All", accentColor: "#ff8c42", bg: ["#160800", "#3d1800"] },
  { tag: "WORLD MENUS", title: "Authentic Meals", accent: "From Every Nation", desc: "Subscribe to receive authentic, chef-prepared world cuisine plans on your schedule.", cta: "Subscribe", ctaSec: "Learn More", accentColor: "#00c8a0", bg: ["#00130f", "#003328"] },
];

const DEFAULT_CARDS = [
  { eyebrow: "Occasion", title: "Mother's Day Special Offers", ctaText: "Shop now", link: "/search?q=promotions", gradientColors: ["#1a0510", "#5c0a30"] },
  { eyebrow: "Free Delivery", title: "Free delivery within 3km", ctaText: "See details", link: "/subscription", gradientColors: ["#001a2e", "#003d6b"] },
  { eyebrow: "Download", title: "Yookatale App — Android & iOS", ctaText: "Get the app", link: PLAY_STORE_APP_URL, gradientColors: ["#0a1a00", "#294d00"] },
];

const DEFAULT_PROMO_BANNERS = [
  { title: "Discover meals & cuisines everyday", sub: "Authentic recipes from 21 countries — delivered fresh to your door", cta: "Explore Now", ctaColor: "#e07820", link: "/subscription", bg: "linear-gradient(120deg, #0e1e0e 0%, #1a5c1a 50%, #2d8c2d 100%)", order: 0 },
  { title: "Flexible Payment Options", sub: "Mobile money · Visa & Mastercard accepted", cta: "Learn More", ctaColor: "#f0c020", link: "/search?q=promotions", bg: "linear-gradient(120deg, #0a1628 0%, #1a3a6b 55%, #2a5a9b 100%)", order: 1 },
  { title: "Get Yookatale Boda Loan", sub: "Instant delivery credit for boda boda riders — apply in 2 minutes", cta: "Apply Now", ctaColor: "#f0c020", link: "/subscription", bg: "linear-gradient(120deg, #1a0a00 0%, #4a1a00 50%, #7a2e00 100%)", order: 2 },
];

const CAT_COLORS = ["#8B6914", "#4a8fa8", "#7a3e3e", "#1a5c1a", "#3a6b8a", "#8a4a1a", "#b85c00", "#2d6b2d", "#5c3a7a", "#c0392b", "#d4851a", "#4a5c6a", "#1a7a1a", "#8a1a1a", "#a07850", "#1a5c8a", "#8a1a5c"];

const DEFAULT_COUNTRIES = [
  { code: "UG", name: "Uganda", flag: "https://flagcdn.com/w160/ug.png", specialty: "Matooke, Rolex & Luwombo", desc: "Rich East African home cooking.", isDefault: true },
  { code: "NG", name: "Nigeria", flag: "https://flagcdn.com/w160/ng.png", specialty: "Jollof, Suya & Egusi" },
  { code: "KE", name: "Kenya", flag: "https://flagcdn.com/w160/ke.png", specialty: "Nyama Choma & Ugali" },
  { code: "RW", name: "Rwanda", flag: "https://flagcdn.com/w160/rw.png", specialty: "Isombe & Ibirayi" },
  { code: "TZ", name: "Tanzania", flag: "https://flagcdn.com/w160/tz.png", specialty: "Pilau & Zanzibar Mix" },
  { code: "ZA", name: "S. Africa", flag: "https://flagcdn.com/w160/za.png", specialty: "Braai & Bobotie" },
  { code: "ET", name: "Ethiopia", flag: "https://flagcdn.com/w160/et.png", specialty: "Injera & Doro Wat" },
  { code: "GH", name: "Ghana", flag: "https://flagcdn.com/w160/gh.png", specialty: "Fufu & Light Soup" },
  { code: "CD", name: "Congo", flag: "https://flagcdn.com/w160/cd.png", specialty: "Moambe Chicken" },
  { code: "SO", name: "Somalia", flag: "https://flagcdn.com/w160/so.png", specialty: "Canjeero & Hilib" },
  { code: "SS", name: "S. Sudan", flag: "https://flagcdn.com/w160/ss.png", specialty: "Asida & Ful Medames" },
  { code: "AO", name: "Angola", flag: "https://flagcdn.com/w160/ao.png", specialty: "Muamba de Galinha" },
  { code: "ML", name: "Mali", flag: "https://flagcdn.com/w160/ml.png", specialty: "Tô & Maafe" },
  { code: "MA", name: "Morocco", flag: "https://flagcdn.com/w160/ma.png", specialty: "Tagine & Couscous" },
  { code: "ER", name: "Eritrea", flag: "https://flagcdn.com/w160/er.png", specialty: "Zigni & Injera" },
  { code: "BR", name: "Brazil", flag: "https://flagcdn.com/w160/br.png", specialty: "Feijoada & Churrasco" },
  { code: "FR", name: "France", flag: "https://flagcdn.com/w160/fr.png", specialty: "Coq au Vin & Ratatouille" },
  { code: "IT", name: "Italy", flag: "https://flagcdn.com/w160/it.png", specialty: "Pasta & Risotto" },
  { code: "CN", name: "China", flag: "https://flagcdn.com/w160/cn.png", specialty: "Dim Sum & Peking Duck" },
  { code: "DK", name: "Denmark", flag: "https://flagcdn.com/w160/dk.png", specialty: "Smørrebrød & Frikadeller" },
  { code: "RU", name: "Russia", flag: "https://flagcdn.com/w160/ru.png", specialty: "Borscht & Pelmeni" },
];

function CatPlaceholder({ col, name }) {
  const angle = (name.charCodeAt(0) * 37 + (name.length && name.charCodeAt(name.length - 1) * 13)) % 360;
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${angle}deg, ${col}ee, ${col}88)`, display: "flex", alignItems: "center", justifyContent: "center" }} />
  );
}

const PLACEHOLDER_COLS = ["#7a3e1a", "#5c2a0a", "#4a6b2a", "#1a3a5c", "#8a1a5c"];
function PcardImgPlaceholder({ col, name }) {
  const angle = (name?.length ? (name.charCodeAt(0) * 41 + name.charCodeAt(name.length - 1) * 17) : 0) % 360;
  const lighter = col + "bb";
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${angle}deg, ${col}f0 0%, ${lighter} 100%)` }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.18 }}>
        <Svg size={52} stroke="#fff" sw={1.2}><path d="M3 11l19-9-9 19-2-8-8-2z"/></Svg>
      </div>
    </div>
  );
}

function V4ProductCard({ product, userInfo, categoryTag, onAddCart }) {
  const [wished, setWished] = useState(false);
  const router = useRouter();
  const discount = product?.discountPercentage ? Number(product.discountPercentage) : 0;
  const originalPrice = product?.price ?? 0;
  const displayPrice = discount ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
  const imgSrc = product?.images?.[0] ? getImageUrl(product.images[0]) : null;
  const col = PLACEHOLDER_COLS[(product?.name?.length || 0) % PLACEHOLDER_COLS.length];
  const tag = (categoryTag || product?.category || "Product").toUpperCase();
  const fmt = (n) => `UGX ${Number(n).toLocaleString()}`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddCart) onAddCart(product); else router.push(`/product/${product?._id}`);
  };

  return (
    <Link href={`/product/${product?._id}`} className="pcard">
      <div className="pcard-img">
        {imgSrc ? <img src={imgSrc} alt={product?.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <PcardImgPlaceholder col={col} name={product?.name} />}
        <div className="pcard-tag">{tag}</div>
        {discount > 0 && <div className="pcard-discount">-{discount}%</div>}
        <button type="button" className={`pcard-wish${wished ? " wished" : ""}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished((w) => !w); }} aria-label="Wishlist"><HeartIcon s={13} /></button>
        <div className="pcard-sweep" />
      </div>
      <div className="pcard-body">
        <div className="pcard-name">{product?.name}</div>
        <div className="pcard-meta">
          <StarFill s={10} />
          <span className="pcard-rating">{Number(product?.rating) || 4.5}</span>
          <span className="pcard-sold">{product?.reviewCount ?? 0} sold</span>
        </div>
        <div className="pcard-price-row">
          <div>
            <span className="pcard-price">{fmt(displayPrice)}</span>
            {discount > 0 && <span className="pcard-old">{fmt(originalPrice)}</span>}
          </div>
          <button type="button" className="pcard-add" onClick={handleAdd} aria-label="Add to cart"><CartAdd s={13} /></button>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ icon, label, color, searchQuery, onPrev, onNext, canPrev, canNext }) {
  const router = useRouter();
  return (
    <div className="sec-head">
      <div className="sec-head-left">
        <div className="sec-head-icon" style={{ background: color + "22", color }}>{icon}</div>
        <span className="sec-head-label">{label}</span>
      </div>
      <div className="sec-head-right">
        <a className="sec-see-all" href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "#"} onClick={(e) => { e.preventDefault(); if (searchQuery) router.push(`/search?q=${encodeURIComponent(searchQuery)}`); }}>See all <ChevRight s={12} /></a>
        <div className="sec-nav-btns">
          <button type="button" className={`sec-nav-btn${canPrev ? "" : " disabled"}`} onClick={onPrev} disabled={!canPrev} aria-label="Previous"><ChevLeft s={14} /></button>
          <button type="button" className={`sec-nav-btn${canNext ? "" : " disabled"}`} onClick={onNext} disabled={!canNext} aria-label="Next"><ChevRight s={14} /></button>
        </div>
      </div>
    </div>
  );
}

function PromoBannerBlock({ banner }) {
  const router = useRouter();
  if (!banner) return null;
  const { imageUrl, title, sub, cta, link, ctaColor, bg } = banner;
  const handleClick = () => {
    const href = link || "#";
    if (href.startsWith("http")) window.open(href, "_blank"); else router.push(href);
  };
  if (imageUrl && !title && !cta) {
    return (
      <div className="promo-banner" style={{ minHeight: 120 }} onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleClick()}>
        <div className="promo-banner-img"><img src={getImageUrl(imageUrl)} alt="" /></div>
      </div>
    );
  }
  return (
    <div className="promo-banner" style={{ background: bg || "linear-gradient(120deg, #0e1e0e 0%, #1a5c1a 100%)" }} onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleClick()}>
      <div className="promo-banner-grain" />
      <div className="promo-banner-content">
        {title && <div className="promo-banner-title">{title}</div>}
        {sub && <div className="promo-banner-sub">{sub}</div>}
        {cta && <button type="button" className="promo-banner-cta" style={{ background: ctaColor || "#e07820", color: "#fff" }} onClick={(e) => { e.stopPropagation(); handleClick(); }}>{cta} <ArrowRight s={13} c="#fff" /></button>}
      </div>
      <div className="promo-banner-deco" />
    </div>
  );
}

const V4_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--g:#1a5c1a;--gl:#2d8c2d;--gp:#e6f0e6;--gold:#f0c020;--dark:#0e180e;--mid:#445444;--muted:#8a9e87;--surf:#fff;--bg:#edf0ea;--r:20px;--rs:14px;--sh:0 2px 18px rgba(0,0,0,.08);--sh2:0 10px 40px rgba(0,0,0,.16);}
.yookatale-v4-page{font-family:'Sora',sans-serif;background:var(--bg);color:var(--dark);min-height:100vh;}
.yookatale-v4-page .page{width:100%;max-width:1440px;margin:0 auto;}
.yookatale-v4-page .hero-grid{display:flex;flex-direction:column;gap:10px;padding:12px 12px 0;}
@media(min-width:700px){.yookatale-v4-page .hero-grid{flex-direction:row;align-items:stretch;padding:16px 16px 0;gap:12px;}}
@media(min-width:1024px){.yookatale-v4-page .hero-grid{padding:20px 24px 0;gap:14px;}}
.yookatale-v4-page .hero-main{border-radius:var(--r);overflow:hidden;position:relative;min-height:300px;display:flex;flex-direction:column;justify-content:flex-end;flex-shrink:0;width:100%;}
@media(min-width:700px){.yookatale-v4-page .hero-main{flex:0 0 68%;min-height:420px;width:auto;}}
@media(min-width:1024px){.yookatale-v4-page .hero-main{flex:0 0 70%;min-height:520px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-main{min-height:560px;}}
.yookatale-v4-page .hero-bg-layer{position:absolute;inset:0;z-index:0;transition:background 1.1s ease;}
.yookatale-v4-page .hero-grain{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.55;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");}
.yookatale-v4-page .hero-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 30% 50%, transparent 40%, rgba(0,0,0,.35) 100%);}
.yookatale-v4-page .hero-content-wrap{position:relative;z-index:4;padding:22px 20px 24px;}
@media(min-width:1024px){.yookatale-v4-page .hero-content-wrap{padding:36px 40px 40px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-content-wrap{padding:44px 48px 48px;}}
.yookatale-v4-page .hero-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(8px);border-radius:100px;padding:4px 12px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.92);margin-bottom:10px;}
@media(min-width:1024px){.yookatale-v4-page .hero-pill{font-size:10px;padding:5px 14px;margin-bottom:12px;}}
.yookatale-v4-page .hero-title{font-family:'DM Serif Display',serif;font-size:clamp(24px,4.5vw,42px);line-height:1.05;color:#fff;margin-bottom:4px;}
@media(min-width:1024px){.yookatale-v4-page .hero-title{font-size:clamp(32px,3.5vw,52px);margin-bottom:6px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-title{font-size:56px;}}
.yookatale-v4-page .hero-title i{display:block;}
.yookatale-v4-page .hero-desc{font-size:clamp(11px,1.4vw,13px);color:rgba(255,255,255,.75);line-height:1.65;margin-bottom:20px;max-width:400px;}
@media(min-width:1024px){.yookatale-v4-page .hero-desc{font-size:15px;max-width:480px;margin-bottom:24px;}}
@media(min-width:1280px){.yookatale-v4-page .hero-desc{font-size:16px;max-width:520px;margin-bottom:28px;}}
.yookatale-v4-page .hero-btns{display:flex;gap:10px;flex-wrap:wrap;}
@media(min-width:1024px){.yookatale-v4-page .hero-btns{gap:14px;}}
.yookatale-v4-page .btn-primary{display:inline-flex;align-items:center;gap:7px;background:var(--gold);color:#111;border:none;border-radius:100px;padding:10px 20px;font-size:13px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;transition:transform .15s,box-shadow .2s;}
@media(min-width:1024px){.yookatale-v4-page .btn-primary{padding:14px 28px;font-size:15px;}}
@media(min-width:1280px){.yookatale-v4-page .btn-primary{padding:16px 32px;font-size:16px;}}
.yookatale-v4-page .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(240,192,32,.55);}
.yookatale-v4-page .btn-outline{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.28);border-radius:100px;padding:10px 18px;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(6px);font-family:'Sora',sans-serif;}
@media(min-width:1024px){.yookatale-v4-page .btn-outline{padding:14px 24px;font-size:15px;}}
@media(min-width:1280px){.yookatale-v4-page .btn-outline{padding:16px 28px;font-size:16px;}}
.yookatale-v4-page .btn-outline:hover{background:rgba(255,255,255,.22);}
.yookatale-v4-page .hero-dots{display:flex;gap:5px;margin-top:18px;}
@media(min-width:1024px){.yookatale-v4-page .hero-dots{margin-top:24px;gap:6px;}.yookatale-v4-page .hero-dots .dot{width:6px;height:6px;}.yookatale-v4-page .hero-dots .dot.on{width:22px;}}
.yookatale-v4-page .dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer;transition:all .35s;}
.yookatale-v4-page .dot.on{width:20px;border-radius:3px;background:var(--gold);}
.yookatale-v4-page .side-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
@media(min-width:700px){.yookatale-v4-page .side-cards{display:flex;flex-direction:column;flex:0 0 32%;gap:12px;min-width:0;}}
@media(min-width:1024px){.yookatale-v4-page .side-cards{flex:0 0 30%;}}
.yookatale-v4-page .s-card{border-radius:var(--r);overflow:hidden;position:relative;min-height:120px;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;transition:transform .2s,box-shadow .2s;}
@media(min-width:700px){.yookatale-v4-page .s-card{min-height:0;flex:1;min-height:1px;}}
.yookatale-v4-page .s-card:hover{transform:translateY(-3px) scale(1.01);box-shadow:var(--sh2);}
.yookatale-v4-page .s-card-wide{grid-column:1/-1;}
@media(min-width:700px){.yookatale-v4-page .s-card-wide{grid-column:unset;}}
.yookatale-v4-page .s-card-bg{position:absolute;inset:0;z-index:0;}
.yookatale-v4-page .s-card-grain{position:absolute;inset:0;z-index:1;opacity:.4;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");}
.yookatale-v4-page .s-card-shade{position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,rgba(0,0,0,.1) 60%,transparent 100%);}
.yookatale-v4-page .s-card-body{position:relative;z-index:3;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;height:100%;gap:4px;}
.yookatale-v4-page .s-card-eyebrow-row{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:2px;}
.yookatale-v4-page .s-card-eyebrow{font-size:clamp(8px,0.9vw,11px);font-weight:700;text-transform:uppercase;letter-spacing:1px;flex:1;}
.yookatale-v4-page .s-card-title{font-size:clamp(13px,1.4vw,17px);font-weight:700;color:#fff;line-height:1.25;margin-bottom:6px;}
.yookatale-v4-page .s-card-cta{display:inline-flex;align-items:center;gap:5px;font-size:clamp(10px,0.9vw,12px);font-weight:700;color:#fff;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25);border-radius:100px;padding:4px 10px;backdrop-filter:blur(6px);}
.yookatale-v4-page .s-card-dot{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;}
.yookatale-v4-page .section-wrap{padding:14px 12px 0;}
@media(min-width:700px){.yookatale-v4-page .section-wrap{padding:18px 16px 0;}}
@media(min-width:1024px){.yookatale-v4-page .section-wrap{padding:22px 24px 0;}}
.yookatale-v4-page .cuisine-card{background:var(--surf);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);}
.yookatale-v4-page .cuisine-header{background:linear-gradient(135deg,#0e1e0e,#1a5c1a);padding:18px 20px 16px;position:relative;overflow:hidden;}
.yookatale-v4-page .cuisine-header-grain{position:absolute;inset:0;pointer-events:none;opacity:.4;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");}
.yookatale-v4-page .cuisine-header-eyebrow{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,.6);display:flex;align-items:center;gap:5px;margin-bottom:4px;position:relative;z-index:2;}
.yookatale-v4-page .cuisine-header-title{font-family:'DM Serif Display',serif;font-size:22px;color:#fff;line-height:1.1;position:relative;z-index:2;}
.yookatale-v4-page .cuisine-header-sub{font-size:11px;color:rgba(255,255,255,.65);margin-top:3px;position:relative;z-index:2;}
.yookatale-v4-page .cuisine-header-globe{position:absolute;right:-10px;top:50%;transform:translateY(-50%);opacity:.08;pointer-events:none;}
.yookatale-v4-page .country-grid{display:grid;padding:14px 16px;gap:8px;grid-template-columns:repeat(5,1fr);}
@media(min-width:480px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(7,1fr);}}
@media(min-width:700px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(6,1fr);}}
@media(min-width:900px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(8,1fr);}}
@media(min-width:1100px){.yookatale-v4-page .country-grid{grid-template-columns:repeat(10,1fr);gap:10px;}}
.yookatale-v4-page .c-btn{display:flex;flex-direction:column;align-items:center;gap:5px;border-radius:14px;padding:9px 4px 8px;border:1.5px solid transparent;background:#f4f7f1;cursor:pointer;transition:all .2s;position:relative;-webkit-tap-highlight-color:transparent;}
.yookatale-v4-page .c-btn:hover{background:#e0ecdf;border-color:#b4ccb4;transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.1);}
.yookatale-v4-page .c-btn.dflt{background:var(--gp);border-color:var(--g);}
.yookatale-v4-page .c-flag-wrap{width:36px;height:24px;border-radius:5px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.22);flex-shrink:0;background:#ccc;}
.yookatale-v4-page .c-flag-wrap img{width:100%;height:100%;object-fit:cover;display:block;}
.yookatale-v4-page .c-name{font-size:8.5px;font-weight:700;color:var(--mid);text-align:center;line-height:1.2;}
.yookatale-v4-page .c-btn.dflt .c-name{color:var(--g);}
.yookatale-v4-page .c-default-ring{position:absolute;inset:-1.5px;border-radius:15px;border:2px solid var(--g);pointer-events:none;opacity:.7;}
.yookatale-v4-page .c-default-label{position:absolute;top:-7px;left:50%;transform:translateX(-50%);background:var(--g);color:#fff;font-size:7px;font-weight:800;padding:1px 5px;border-radius:6px;text-transform:uppercase;white-space:nowrap;}
.yookatale-v4-page .cat-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.yookatale-v4-page .cat-head-title{font-family:'DM Serif Display',serif;font-size:20px;color:var(--dark);}
.yookatale-v4-page .btn-viewall{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--g);background:var(--gp);border:none;border-radius:100px;padding:6px 13px;cursor:pointer;font-family:'Sora',sans-serif;}
.yookatale-v4-page .btn-viewall:hover{background:#d4e8d4;}
.yookatale-v4-page .cat-grid{display:grid;gap:8px;grid-template-columns:repeat(3,1fr);}
@media(min-width:480px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(4,1fr);}}
@media(min-width:640px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(5,1fr);}}
@media(min-width:900px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(6,1fr);gap:10px;}}
@media(min-width:1100px){.yookatale-v4-page .cat-grid{grid-template-columns:repeat(7,1fr);}}
.yookatale-v4-page .cat-tile{border-radius:16px;overflow:hidden;aspect-ratio:1/1;position:relative;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.09);transition:transform .2s,box-shadow .2s;}
.yookatale-v4-page .cat-tile:hover{transform:scale(1.04);box-shadow:0 8px 24px rgba(0,0,0,.15);}
.yookatale-v4-page .cat-tile img{width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0;}
.yookatale-v4-page .cat-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(0,0,0,.05) 55%,transparent 100%);}
.yookatale-v4-page .cat-label{position:absolute;bottom:0;left:0;right:0;padding:5px 7px;font-size:9.5px;font-weight:700;color:#fff;text-align:center;line-height:1.2;text-shadow:0 1px 4px rgba(0,0,0,.5);}
.yookatale-v4-page .shimmer-tile{animation:shimmer 1.7s infinite;background:linear-gradient(90deg,#d4dcd4 25%,#c2cec2 50%,#d4dcd4 75%);background-size:300% 100%;}
@keyframes shimmer{from{background-position:300% 0}to{background-position:-300% 0}}
.yookatale-v4-page .m-overlay{position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.78);backdrop-filter:blur(10px);display:flex;align-items:flex-end;justify-content:center;animation:fadeBlur .22s ease;}
@media(min-width:600px){.yookatale-v4-page .m-overlay{align-items:center;padding:24px;}}
@keyframes fadeBlur{from{opacity:0}to{opacity:1}}
.yookatale-v4-page .m-sheet{background:#000;border-radius:24px 24px 0 0;width:100%;max-width:500px;overflow:hidden;animation:slideUp .32s cubic-bezier(.32,.72,0,1);position:relative;max-height:95vh;display:flex;flex-direction:column;}
@media(min-width:600px){.yookatale-v4-page .m-sheet{border-radius:24px;animation:scaleIn .28s cubic-bezier(.34,1.4,.64,1);}}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes scaleIn{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
.yookatale-v4-page .m-banner{position:relative;width:100%;height:clamp(240px,55vw,340px);flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,#0e1e0e,#1a5c1a);}
@media(min-width:600px){.yookatale-v4-page .m-banner{height:320px;}}
.yookatale-v4-page .m-banner img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.02);}
.yookatale-v4-page .m-banner-shade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.08) 0%,transparent 35%,transparent 45%,rgba(0,0,0,.82) 100%);}
.yookatale-v4-page .m-handle{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:36px;height:4px;background:rgba(255,255,255,.35);border-radius:2px;z-index:10;}
@media(min-width:600px){.yookatale-v4-page .m-handle{display:none;}}
.yookatale-v4-page .m-banner-info{position:absolute;bottom:0;left:0;right:0;z-index:5;padding:16px 20px;display:flex;align-items:flex-end;gap:12px;}
.yookatale-v4-page .m-flag{width:46px;height:31px;border-radius:6px;object-fit:cover;flex-shrink:0;box-shadow:0 3px 12px rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.2);}
.yookatale-v4-page .m-title-block{flex:1;min-width:0;}
.yookatale-v4-page .m-country-name{font-family:'DM Serif Display',serif;font-size:22px;color:#fff;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.yookatale-v4-page .m-specialty{font-size:11px;color:rgba(255,255,255,.78);font-weight:600;margin-top:2px;}
.yookatale-v4-page .m-close{position:absolute;top:14px;right:14px;z-index:10;width:32px;height:32px;border-radius:50%;border:none;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;}
.yookatale-v4-page .m-close:hover{background:rgba(0,0,0,.75);}
.yookatale-v4-page .m-body{background:var(--surf);padding:12px 16px 16px;flex:1;overflow-y:auto;}
@media(max-width:599px){.yookatale-v4-page .m-body{padding-bottom:max(24px, env(safe-area-inset-bottom) + 80px);}}
.yookatale-v4-page .sub-btn{width:100%;border:none;cursor:pointer;padding:0;border-radius:14px;overflow:hidden;position:relative;box-shadow:0 8px 32px rgba(26,92,26,.38);transition:transform .16s,box-shadow .22s;font-family:'Sora',sans-serif;}
.yookatale-v4-page .sub-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(26,92,26,.48);}
.yookatale-v4-page .sub-btn-bg{background:linear-gradient(130deg,#0e2e0e 0%,#1a5c1a 45%,#2d8c2d 100%);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;position:relative;overflow:hidden;}
.yookatale-v4-page .sub-btn-text{position:relative;z-index:2;text-align:left;}
.yookatale-v4-page .sub-btn-eyebrow{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,.6);margin-bottom:3px;}
.yookatale-v4-page .sub-btn-label{font-size:13px;font-weight:800;color:#fff;line-height:1.2;}
.yookatale-v4-page .sub-btn-ring{position:relative;z-index:2;flex-shrink:0;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;}
.yookatale-v4-page .sub-btn:hover .sub-btn-ring{background:rgba(255,255,255,.25);transform:rotate(45deg);}
.yookatale-v4-page .pb{height:32px;}
.yookatale-v4-page .sec-wrap{padding:14px 12px 0;}@media(min-width:768px){.yookatale-v4-page .sec-wrap{padding:18px 20px 0;}}@media(min-width:1280px){.yookatale-v4-page .sec-wrap{padding:22px 24px 0;}}
.yookatale-v4-page .sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px;}
.yookatale-v4-page .sec-head-left{display:flex;align-items:center;gap:10px;}
.yookatale-v4-page .sec-head-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.yookatale-v4-page .sec-head-label{font-size:clamp(18px,2.2vw,24px);color:var(--dark);font-weight:400;line-height:1;font-family:'DM Serif Display',serif;}
.yookatale-v4-page .sec-head-right{display:flex;align-items:center;gap:10px;}
.yookatale-v4-page .sec-see-all{display:inline-flex;align-items:center;gap:3px;font-size:12px;font-weight:700;color:#e07820;background:#fff4ea;border-radius:100px;padding:5px 12px;cursor:pointer;text-decoration:none;white-space:nowrap;transition:background .18s;}
.yookatale-v4-page .sec-see-all:hover{background:#fde8d0;}
.yookatale-v4-page .sec-nav-btns{display:none;gap:6px;}@media(min-width:640px){.yookatale-v4-page .sec-nav-btns{display:flex;}}
.yookatale-v4-page .sec-nav-btn{width:32px;height:32px;border-radius:50%;background:var(--surf);border:1.5px solid rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dark);transition:background .18s,transform .15s;box-shadow:var(--sh);}
.yookatale-v4-page .sec-nav-btn:hover:not(.disabled){background:var(--dark);color:#fff;border-color:var(--dark);transform:scale(1.06);}.yookatale-v4-page .sec-nav-btn.disabled{opacity:.35;cursor:default;}
.yookatale-v4-page .prod-row{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px;}
.yookatale-v4-page .prod-row::-webkit-scrollbar{display:none;}
@media(min-width:1024px){.yookatale-v4-page .prod-row{display:grid;grid-template-columns:repeat(6,1fr);overflow-x:visible;scroll-snap-type:none;}}
@media(min-width:768px) and (max-width:1023px){.yookatale-v4-page .prod-row{display:grid;grid-template-columns:repeat(4,1fr);overflow-x:visible;}}
.yookatale-v4-page .pcard{background:var(--surf);border-radius:16px;overflow:hidden;flex-shrink:0;width:148px;cursor:pointer;scroll-snap-align:start;transition:transform .2s,box-shadow .2s;box-shadow:var(--sh);border:1px solid rgba(0,0,0,.04);}
.yookatale-v4-page .pcard:hover{transform:translateY(-4px);box-shadow:var(--sh2);}
@media(min-width:480px){.yookatale-v4-page .pcard{width:168px;}}@media(min-width:768px){.yookatale-v4-page .pcard{width:auto;}}
.yookatale-v4-page .pcard-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:#d0d8cc;}
.yookatale-v4-page .pcard-sweep{position:absolute;inset:0;background:linear-gradient(105deg, transparent 35%, rgba(255,255,255,.15) 50%, transparent 65%);background-size:300% 100%;animation:shimmer 3s infinite;pointer-events:none;}
.yookatale-v4-page .pcard-tag{position:absolute;top:8px;left:8px;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:#fff;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);border-radius:6px;padding:3px 7px;}
.yookatale-v4-page .pcard-discount{position:absolute;top:8px;right:8px;font-size:9px;font-weight:800;color:#fff;background:#e07820;border-radius:6px;padding:3px 7px;}
.yookatale-v4-page .pcard-wish{position:absolute;bottom:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.85);backdrop-filter:blur(6px);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:background .18s,color .18s,transform .15s;}
.yookatale-v4-page .pcard-wish:hover,.yookatale-v4-page .pcard-wish.wished{background:#fff;color:#e07820;transform:scale(1.1);}.yookatale-v4-page .pcard-wish.wished svg{fill:#e07820;stroke:#e07820;}
.yookatale-v4-page .pcard-body{padding:10px 10px 12px;}
.yookatale-v4-page .pcard-name{font-size:11.5px;font-weight:700;color:var(--dark);line-height:1.35;margin-bottom:5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}@media(min-width:768px){.yookatale-v4-page .pcard-name{font-size:12.5px;}}
.yookatale-v4-page .pcard-meta{display:flex;align-items:center;gap:4px;margin-bottom:7px;}
.yookatale-v4-page .pcard-rating{font-size:10px;font-weight:700;color:var(--dark);}.yookatale-v4-page .pcard-sold{font-size:10px;color:var(--muted);font-weight:500;margin-left:2px;}
.yookatale-v4-page .pcard-price-row{display:flex;align-items:center;justify-content:space-between;gap:4px;}
.yookatale-v4-page .pcard-price{font-size:12px;font-weight:800;color:#e07820;display:block;line-height:1;}@media(min-width:768px){.yookatale-v4-page .pcard-price{font-size:13px;}}
.yookatale-v4-page .pcard-old{font-size:10px;color:var(--muted);text-decoration:line-through;font-weight:500;}
.yookatale-v4-page .pcard-add{width:28px;height:28px;border-radius:9px;background:var(--g);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;flex-shrink:0;transition:background .18s,transform .15s;}
.yookatale-v4-page .pcard-add:hover{background:var(--gl);transform:scale(1.08);}
.yookatale-v4-page .promo-banner{border-radius:var(--r);overflow:hidden;position:relative;min-height:90px;display:flex;align-items:center;cursor:pointer;transition:transform .2s;}@media(min-width:768px){.yookatale-v4-page .promo-banner{min-height:110px;}}
.yookatale-v4-page .promo-banner-grain{position:absolute;inset:0;pointer-events:none;z-index:1;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");opacity:.5;}
.yookatale-v4-page .promo-banner-content{position:relative;z-index:3;padding:18px 20px;flex:1;}@media(min-width:768px){.yookatale-v4-page .promo-banner-content{padding:22px 28px;}}
.yookatale-v4-page .promo-banner-title{font-family:'DM Serif Display',serif;font-size:clamp(18px,2.8vw,30px);color:#fff;line-height:1.15;margin-bottom:6px;text-shadow:0 2px 12px rgba(0,0,0,.3);}
.yookatale-v4-page .promo-banner-sub{font-size:12px;color:rgba(255,255,255,.78);font-weight:500;margin-bottom:12px;}@media(min-width:768px){.yookatale-v4-page .promo-banner-sub{font-size:13px;}}
.yookatale-v4-page .promo-banner-cta{display:inline-flex;align-items:center;gap:6px;border:none;border-radius:100px;padding:9px 20px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;letter-spacing:.2px;transition:transform .15s,opacity .18s;box-shadow:0 4px 16px rgba(0,0,0,.25);}
.yookatale-v4-page .promo-banner-cta:hover{transform:translateY(-2px);opacity:.9;}
.yookatale-v4-page .promo-banner-deco{position:absolute;top:-30px;right:-30px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.07);z-index:2;pointer-events:none;}
.yookatale-v4-page .promo-banner-img{position:absolute;inset:0;z-index:0;}.yookatale-v4-page .promo-banner-img img{width:100%;height:100%;object-fit:cover;display:block;}
.yookatale-v4-page .pg-spacer{height:28px;}@media(min-width:768px){.yookatale-v4-page .pg-spacer{height:48px;}}
`;

export default function Home() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [slideIdx, setSlideIdx] = useState(0);
  const [modal, setModal] = useState(null);
  const [products, setProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [fetchProducts] = useProductsGetMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();
  const { data: countryCuisinesData } = useGetCountryCuisinesQuery(undefined, { skip: false });
  const { data: homepageConfigData } = useGetHomepageConfigQuery(undefined, { skip: false });

  const countries = useMemo(() => {
    const fromApi = countryCuisinesData?.data;
    if (fromApi && fromApi.length > 0) return fromApi;
    return DEFAULT_COUNTRIES;
  }, [countryCuisinesData]);
  const slides = useMemo(() => homepageConfigData?.data?.heroSlides ?? DEFAULT_SLIDES, [homepageConfigData]);
  const sideCards = useMemo(() => homepageConfigData?.data?.sideCards ?? DEFAULT_CARDS, [homepageConfigData]);
  const promoBanners = useMemo(() => {
    const list = homepageConfigData?.data?.promoBanners;
    return Array.isArray(list) && list.length > 0 ? [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : DEFAULT_PROMO_BANNERS;
  }, [homepageConfigData]);

  const [addCartApi] = useCartCreateMutation();
  const handleAddToCart = (product) => {
    if (!userInfo) { router.push("/signin"); return; }
    const discount = product?.discountPercentage ? Number(product.discountPercentage) : 0;
    const discountedPrice = discount ? Math.round((product?.price ?? 0) * (1 - discount / 100)) : (product?.price ?? 0);
    addCartApi({ productId: product._id, userId: userInfo._id, discountedPrice }).unwrap().catch(() => {});
  };

  const displayCategories = useMemo(() => {
    if (apiCategories?.length) return apiCategories.map((c, i) => ({
      name: typeof c === "string" ? c : (c?.name || c?.title || ""),
      imageUrl: typeof c === "object" && (c?.imageUrl || c?.image) ? (c.imageUrl || c.image) : null,
      image: typeof c === "object" ? c?.image : null,
      col: CAT_COLORS[i % CAT_COLORS.length],
    })).filter((c) => c.name);
    return (CategoriesJson || []).map((name, i) => ({ name: typeof name === "string" ? name : name?.name || "", imageUrl: null, image: null, col: CAT_COLORS[i % CAT_COLORS.length] }));
  }, [apiCategories]);

  useEffect(() => {
    (async () => {
      setProductsLoading(true);
      try {
        const res = await fetchProducts().unwrap();
        setProducts(Array.isArray(res?.data) ? res.data : []);
      } catch { setProducts([]); }
      finally { setProductsLoading(false); }
    })();
  }, [fetchProducts]);

  useEffect(() => {
    (async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetchCategories().unwrap();
        if (res?.success && Array.isArray(res?.categories)) setApiCategories(res.categories);
        else if (res?.data && Array.isArray(res.data)) setApiCategories(res.data);
        else setApiCategories([]);
      } catch { setApiCategories([]); }
      finally { setCategoriesLoading(false); }
    })();
  }, [fetchCategories]);

  useEffect(() => {
    const t = setInterval(() => setSlideIdx((s) => (s + 1) % (slides.length || 1)), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  const sl = slides[slideIdx] || slides[0];
  const heroCtaPrimary = () => {
    if (!sl) return;
    if (slideIdx === 0) window.open(PLAY_STORE_APP_URL, "_blank");
    else if (slideIdx === 1) router.push("/search?q=topdeals");
    else router.push("/subscription");
  };
  const heroCtaSecondary = () => {
    if (!sl) return;
    if (slideIdx === 0) router.push("/products");
    else if (slideIdx === 1) router.push("/search?q=popular");
    else router.push("/subscription");
  };

  // Priority order for known categories; others sorted alphabetically after
  const CATEGORY_PRIORITY = ["popular", "discover", "promotional", "recommended", "topdeals"];
  const SECTION_COLORS = ["#e07820", "#1a5c1a", "#8a1a5c", "#1a5c1a", "#e07820"];
  const SECTION_ICONS = [<FlameIcon key="f" s={15} />, <CompassIcon key="c" s={15} />, <TagIcon key="t" s={15} />, <TagIcon key="t2" s={15} />, <FlameIcon key="f2" s={15} />];

  const SECTIONS = useMemo(() => {
    const byCat = {};
    products.forEach((p) => {
      const cat = (p?.category || "").trim();
      if (!cat) return;
      const key = cat.toLowerCase();
      if (!byCat[key]) byCat[key] = { key, raw: cat, items: [] };
      byCat[key].items.push(p);
    });
    const keys = Object.keys(byCat).sort((a, b) => {
      const i = CATEGORY_PRIORITY.indexOf(a);
      const j = CATEGORY_PRIORITY.indexOf(b);
      if (i >= 0 && j >= 0) return i - j;
      if (i >= 0) return -1;
      if (j >= 0) return 1;
      return a.localeCompare(b);
    });
    return keys.map((key, idx) => {
      const { raw, items } = byCat[key];
      const label = raw.charAt(0).toUpperCase() + raw.slice(1);
      const colorIdx = CATEGORY_PRIORITY.indexOf(key) >= 0 ? CATEGORY_PRIORITY.indexOf(key) % SECTION_COLORS.length : idx % SECTION_COLORS.length;
      const iconIdx = colorIdx % SECTION_ICONS.length;
      return { key, label, color: SECTION_COLORS[colorIdx], icon: SECTION_ICONS[iconIdx], items };
    });
  }, [products]);

  const sectionRefs = useRef([]);
  const [scrollState, setScrollState] = useState({});
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  // Auto-scroll product rows when untouched; pause on touch/scroll
  useEffect(() => {
    if (autoScrollPaused || SECTIONS.length === 0) return;
    const iv = setInterval(() => {
      sectionRefs.current.forEach((el, idx) => {
        if (!el || el.scrollWidth <= el.clientWidth) return;
        const next = el.scrollLeft + 160;
        if (next >= el.scrollWidth - el.clientWidth - 4) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollTo({ left: next, behavior: "smooth" });
        }
      });
    }, 3500);
    return () => clearInterval(iv);
  }, [autoScrollPaused, SECTIONS.length]);

  const pauseAutoScroll = useCallback(() => {
    setAutoScrollPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setAutoScrollPaused(false), 4000);
  }, []);

  useEffect(() => () => { if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current); }, []);

  const handleScroll = (idx) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    setScrollState((prev) => ({
      ...prev,
      [idx]: { canPrev: el.scrollLeft > 4, canNext: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 },
    }));
  };
  const scrollRow = (idx, dir) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    el.scrollBy({ left: dir * (el.offsetWidth * 0.72), behavior: "smooth" });
  };

  return (
    <div className="yookatale-v4-page">
      <style dangerouslySetInnerHTML={{ __html: V4_CSS }} />
      <div className="page">
        <div className="hero-grid">
          <div className="hero-main">
            <div className="hero-bg-layer" style={{ background: sl ? `linear-gradient(148deg,${sl.bg[0]},${sl.bg[1]})` : undefined }} />
            <div className="hero-grain" />
            <div className="hero-vignette" />
            <div className="hero-content-wrap">
              <div className="hero-pill"><TagIcon s={9} />{sl?.tag}</div>
              <h1 className="hero-title">{sl?.title}<i style={{ color: sl?.accentColor }}>{sl?.accent}</i></h1>
              <p className="hero-desc">{sl?.desc}</p>
              <div className="hero-btns">
                <button type="button" className="btn-primary" style={sl?.accentColor ? { boxShadow: `0 4px 20px ${sl.accentColor}55` } : {}} onClick={heroCtaPrimary}>{sl?.cta} <ArrowRight s={14} c="#111" /></button>
                <button type="button" className="btn-outline" onClick={heroCtaSecondary}>{sl?.ctaSec}</button>
              </div>
              <div className="hero-dots">
                {slides.map((_, i) => <div key={i} role="button" tabIndex={0} className={`dot${slideIdx === i ? " on" : ""}`} onClick={() => setSlideIdx(i)} onKeyDown={(e) => e.key === "Enter" && setSlideIdx(i)} aria-label={`Slide ${i + 1}`} />)}
              </div>
            </div>
          </div>
          <div className="side-cards">
            {sideCards.slice(0, 3).map((card, i) => {
              const isWide = i === 2;
              const href = card.link || "#";
              const external = href.startsWith("http");
              return (
                <div key={i} className={`s-card${isWide ? " s-card-wide" : ""}`} role="button" tabIndex={0} onClick={() => external ? window.open(href, "_blank") : router.push(href)} onKeyDown={(e) => e.key === "Enter" && (external ? window.open(href, "_blank") : router.push(href))}>
                  <div className="s-card-bg" style={{ background: `linear-gradient(145deg,${card.gradientColors?.[0] || "#1a0510"},${card.gradientColors?.[1] || "#5c0a30"})` }} />
                  <div className="s-card-grain" />
                  <div className="s-card-shade" />
                  <div className="s-card-body">
                    <div className="s-card-eyebrow-row">
                      <div className="s-card-eyebrow" style={{ color: i === 0 ? "#ff80b3" : i === 1 ? "#7fd4ff" : "#a8e060" }}>{card.eyebrow}</div>
                      <div className="s-card-dot">{i === 0 ? <GiftIcon s={12} c="rgba(255,200,200,.8)" /> : i === 1 ? <TruckIcon s={12} c="rgba(100,200,255,.8)" /> : <DownloadIcon s={12} c="rgba(180,240,120,.8)" />}</div>
                    </div>
                    <div className="s-card-title">{card.title}</div>
                    <div className="s-card-cta">{card.ctaText} <ChevRight s={10} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-wrap">
          <div className="cuisine-card">
            <div className="cuisine-header">
              <div className="cuisine-header-grain" />
              <div className="cuisine-header-eyebrow"><GlobeIcon s={11} /> World Cuisines</div>
              <div className="cuisine-header-title">Choose Your Menu</div>
              <div className="cuisine-header-sub">Tap any country to preview & subscribe</div>
              <div className="cuisine-header-globe">
                <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,1)" strokeWidth=".5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><path d="M2 8h20M2 16h20"/></svg>
              </div>
            </div>
            <div className="country-grid">
              {(countries.length ? countries : [{ code: "UG", name: "Uganda", flag: "https://flagcdn.com/w160/ug.png", isDefault: true }]).map((c) => (
                <div key={c.code} role="button" tabIndex={0} className={`c-btn${c.isDefault ? " dflt" : ""}`} onClick={() => setModal(c)} onKeyDown={(e) => e.key === "Enter" && setModal(c)}>
                  {c.isDefault && <span className="c-default-label">Default</span>}
                  {c.isDefault && <span className="c-default-ring" aria-hidden />}
                  <div className="c-flag-wrap"><img src={c.flag || `https://flagcdn.com/w160/${(c.code || "").toLowerCase()}.png`} alt={c.name} loading="lazy" onError={(e) => { e.target.style.opacity = "0"; }} /></div>
                  <span className="c-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-wrap">
          <div className="cat-head-row">
            <div className="cat-head-title">Shop by Category</div>
            <button type="button" className="btn-viewall" onClick={() => router.push("/search?q=categories")}>View all <ChevRight s={13} /></button>
          </div>
          {categoriesLoading ? <LoaderSkeleton /> : (
            <div className="cat-grid">
              {displayCategories.map((cat, i) => {
                const imgSrc = getCategoryImageSrc(cat);
                return (
                  <a key={`${cat.name}-${i}`} href={`/search?q=${encodeURIComponent(cat.name)}`} className={`cat-tile${!imgSrc ? " shimmer-tile" : ""}`} style={{ animationDelay: `${i * 25}ms` }}>
                    <CatPlaceholder col={cat.col || CAT_COLORS[i % CAT_COLORS.length]} name={cat.name} />
                    {imgSrc && <img src={imgSrc} alt={cat.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }} />}
                    <div className="cat-shade" />
                    <div className="cat-label">{cat.name}</div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="pb" />
      </div>

      {!productsLoading && (
        <>
          {promoBanners[0] && (
            <div className="sec-wrap">
              <PromoBannerBlock banner={promoBanners[0]} />
            </div>
          )}
          {SECTIONS.map((sec, i) => {
            if (!sec.items?.length) return null;
            const state = scrollState[i] ?? { canPrev: false, canNext: true };
            const bannerAfter = promoBanners[i % promoBanners.length];
            return (
              <div key={sec.key}>
                <div className="sec-wrap">
                  <SectionHeader
                    icon={sec.icon}
                    label={sec.label}
                    color={sec.color}
                    searchQuery={sec.key}
                    onPrev={() => scrollRow(i, -1)}
                    onNext={() => scrollRow(i, 1)}
                    canPrev={state.canPrev}
                    canNext={state.canNext}
                  />
                  <div
                    className="prod-row"
                    ref={(el) => { sectionRefs.current[i] = el; }}
                    onScroll={() => handleScroll(i)}
                    onTouchStart={pauseAutoScroll}
                    onTouchMove={pauseAutoScroll}
                    onMouseDown={pauseAutoScroll}
                  >
                    {sec.items.map((product) => (
                      <V4ProductCard
                        key={product._id || product.id}
                        product={product}
                        userInfo={userInfo}
                        categoryTag={sec.label}
                        onAddCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
                {bannerAfter && (
                  <div className="sec-wrap">
                    <PromoBannerBlock banner={bannerAfter} />
                  </div>
                )}
              </div>
            );
          })}
          <div className="pg-spacer" />
        </>
      )}

      {modal && (
        <div className="m-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }} role="dialog" aria-modal="true">
          <div className="m-sheet">
            <div className="m-banner">
              <div className="m-handle" aria-hidden />
              {modal.imageUrl && <img src={getImageUrl(modal.imageUrl)} alt={modal.name} onError={(e) => { e.target.style.display = "none"; }} />}
              <div className="m-banner-shade" />
              <div className="m-banner-info">
                <img className="m-flag" src={modal.flag || `https://flagcdn.com/w160/${(modal.code || "").toLowerCase()}.png`} alt="" onError={(e) => { e.target.style.display = "none"; }} />
                <div className="m-title-block">
                  <div className="m-country-name">{modal.menuName || `${modal.name} Menu`}</div>
                  <div className="m-specialty">{modal.specialty}</div>
                </div>
              </div>
              <button type="button" className="m-close" onClick={() => setModal(null)} aria-label="Close"><XIcon s={13} /></button>
            </div>
            <div className="m-body">
              <button type="button" className="sub-btn" onClick={() => { setModal(null); router.push(`/subscription?country=${encodeURIComponent(modal.code)}`); }}>
                <div className="sub-btn-bg">
                  <div className="sub-btn-text">
                    <div className="sub-btn-eyebrow">Weekly meal plan</div>
                    <div className="sub-btn-label">Subscribe to {modal.menuName || `${modal.name} Menu`}</div>
                  </div>
                  <div className="sub-btn-ring"><ArrowRight s={16} c="#fff" /></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
