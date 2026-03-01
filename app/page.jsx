"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@slices/authSlice";
import { useAuthModal } from "@components/AuthModalContext";
import {
  useProductsGetMutation,
  useProductsCategoriesGetMutation,
  useGetCountryCuisinesQuery,
  useGetHomepageConfigQuery,
  useCartCreateMutation,
} from "@slices/productsApiSlice";
import { useMealSlotsPublicGetMutation, useMealCalendarOverridesGetMutation } from "@slices/usersApiSlice";
import { CategoriesJson, getImageUrl, getOptimizedImageUrl } from "@constants/constants";
import { getMealForDay } from "@lib/mealMenuConfig";
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
const BowlIcon = ({ s = 14 }) => <Svg size={s}><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/><path d="M5 12c0 3.87 3.13 7 7 7s7-3.13 7-7"/></Svg>;
const SunIcon = ({ s = 14 }) => <Svg size={s}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></Svg>;
const MoonIcon = ({ s = 14 }) => <Svg size={s}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Svg>;

/** Resolve meal image: full URL (http), same-origin /assets, or backend path via getImageUrl */
function resolveMealImage(url) {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/assets")) return url;
  return getImageUrl(url);
}

/** Meal card for homepage: shows meal from calendar config, click -> subscription */
function HomeMealCard({ item }) {
  const router = useRouter();
  const raw = resolveMealImage(item?.image);
  const imgSrc = raw ? (getOptimizedImageUrl(raw) ?? raw) : null;
  const prepLabel = item?.prepType === "ready-to-cook" ? "Ready to cook" : "Ready to eat";
  const col = PLACEHOLDER_COLS[(item?.meal?.length || 0) % PLACEHOLDER_COLS.length];
  return (
    <div
      className="pcard"
      role="button"
      tabIndex={0}
      onClick={() => router.push("/subscription")}
      onKeyDown={(e) => e.key === "Enter" && router.push("/subscription")}
      style={{ cursor: "pointer" }}
    >
      <div className="pcard-img">
        {imgSrc ? <img src={imgSrc} alt={item?.meal} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <PcardImgPlaceholder col={col} name={item?.meal} />}
        <div className="pcard-tag" style={{ textTransform: "none", fontSize: 10 }}>{prepLabel}</div>
        <div className="pcard-sweep" />
      </div>
      <div className="pcard-body">
        <div className="pcard-name" style={{ fontSize: 13, lineHeight: 1.3 }}>{item?.meal || "Meal"}</div>
        <div className="pcard-meta" style={{ marginTop: 4 }}>
          <span className="pcard-sold" style={{ fontSize: 11 }}>Subscribe to get this</span>
        </div>
        <div className="pcard-price-row" style={{ marginTop: 6 }}>
          <span className="pcard-price" style={{ fontSize: 12, fontWeight: 700, color: "#1a5c1a" }}>View plans</span>
          <ChevRight s={12} />
        </div>
      </div>
    </div>
  );
}

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
  const rawImg = product?.images?.[0] ? getImageUrl(product.images[0]) : null;
  const imgSrc = rawImg ? (getOptimizedImageUrl(rawImg) ?? rawImg) : null;
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
        {imgSrc ? <img src={imgSrc} alt={product?.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <PcardImgPlaceholder col={col} name={product?.name} />}
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

function SectionHeader({ icon, label, color, searchQuery, seeAllToSubscription, onPrev, onNext, canPrev, canNext }) {
  const router = useRouter();
  const handleSeeAll = (e) => {
    e.preventDefault();
    if (seeAllToSubscription) router.push("/subscription");
    else if (searchQuery) router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  return (
    <div className="sec-head">
      <div className="sec-head-left">
        <div className="sec-head-icon" style={{ background: color + "22", color }}>{icon}</div>
        <span className="sec-head-label">{label}</span>
      </div>
      <div className="sec-head-right">
        <a className="sec-see-all" href={seeAllToSubscription ? "/subscription" : (searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "#")} onClick={handleSeeAll}>See all <ChevRight s={12} /></a>
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
    const src = getOptimizedImageUrl(getImageUrl(imageUrl)) ?? getImageUrl(imageUrl);
    return (
      <div className="promo-banner" style={{ minHeight: 120 }} onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleClick()}>
        <div className="promo-banner-img"><img src={src} alt="" loading="lazy" decoding="async" /></div>
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


export default function Home() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [slideIdx, setSlideIdx] = useState(0);
  const [modal, setModal] = useState(null);
  const [budget, setBudget] = useState("");
  const [products, setProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [mealSlots, setMealSlots] = useState([]);
  const [mealOverrides, setMealOverrides] = useState([]);

  const [fetchProducts] = useProductsGetMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();
  const [fetchSlots] = useMealSlotsPublicGetMutation();
  const [fetchOverrides] = useMealCalendarOverridesGetMutation();
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
  const { openAuthModal } = useAuthModal();
  const handleAddToCart = (product) => {
    if (!userInfo) { openAuthModal(); return; }
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
    fetchSlots().unwrap().then((res) => {
      if (res?.status === "Success" && Array.isArray(res?.data)) setMealSlots(res.data);
    }).catch(() => {});
  }, [fetchSlots]);
  useEffect(() => {
    fetchOverrides().unwrap().then((res) => {
      if (res?.status === "Success" && Array.isArray(res?.data)) setMealOverrides(res.data);
    }).catch(() => {});
  }, [fetchOverrides]);

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

  const MEAL_PREP_TYPES = ["ready-to-eat", "ready-to-cook"];
  const MEAL_SECTION_CONFIG = [
    { key: "breakfast", label: "Breakfast", color: "#e07820", icon: <SunIcon key="sun" s={15} /> },
    { key: "lunch", label: "Lunch", color: "#1a5c1a", icon: <BowlIcon key="bowl" s={15} /> },
    { key: "supper", label: "Supper", color: "#7c3aed", icon: <MoonIcon key="moon" s={15} /> },
  ];

  const [currentDay, setCurrentDay] = useState("monday");
  useEffect(() => {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    setCurrentDay(dayNames[new Date().getDay()]);
  }, []);

  const MEAL_SECTIONS = useMemo(() => {
    const incomeLevel = "middle";
    const getSlot = (day, mealTypeId, prepTypeId) =>
      mealSlots.find(
        (s) => s.incomeLevel === incomeLevel && s.prepType === prepTypeId && s.day === day && s.mealType === mealTypeId
      );
    const getMealImage = (day, mealTypeId, prepTypeId) => {
      const slot = getSlot(day, mealTypeId, prepTypeId);
      if (slot?.imageUrl) return getImageUrl(slot.imageUrl);
      const override = mealOverrides.find(
        (o) => o.incomeLevel === incomeLevel && o.prepType === prepTypeId && o.day === day && o.mealType === mealTypeId
      );
      return override?.imageUrl ? getImageUrl(override.imageUrl) : null;
    };
    return MEAL_SECTION_CONFIG.map(({ key: mealType, label, color, icon }) => {
      const items = [];
      MEAL_PREP_TYPES.forEach((prepType) => {
        const slot = getSlot(currentDay, mealType, prepType);
        const configMeal = getMealForDay(currentDay, mealType, incomeLevel, prepType);
        const img = getMealImage(currentDay, mealType, prepType) || configMeal?.image;
        if (slot) {
          items.push({
            meal: slot.mealName || configMeal?.meal || "",
            description: slot.description || configMeal?.description || "",
            quantity: slot.quantity || configMeal?.quantity || "—",
            image: img || configMeal?.image,
            id: `${mealType}-${currentDay}-${prepType}`,
            mealType,
            day: currentDay,
            prepType,
          });
        } else if (configMeal) {
          items.push({
            ...configMeal,
            image: img || configMeal.image,
            id: `${mealType}-${currentDay}-${prepType}`,
            mealType,
            day: currentDay,
            prepType,
          });
        }
      });
      return { key: mealType, label, color, icon, items };
    });
  }, [currentDay, mealSlots, mealOverrides]);

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
  const totalSectionCount = SECTIONS.length + MEAL_SECTIONS.length;
  const [scrollState, setScrollState] = useState({});
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;
    const step = () => {
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) return;
        let next = el.scrollLeft + el.offsetWidth * 0.4;
        if (next >= maxScroll) next = 0;
        el.scrollTo({ left: next, behavior: "smooth" });
      });
    };
    const t = setInterval(step, 4500);
    return () => clearInterval(t);
  }, [totalSectionCount]);

  return (
    <>
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
                  {c.isDefault && <span className="c-default-ring" aria-hidden />}
                  <div className="c-flag-wrap"><img src={getOptimizedImageUrl(c.flag || `https://flagcdn.com/w160/${(c.code || "").toLowerCase()}.png`) || c.flag || `https://flagcdn.com/w160/${(c.code || "").toLowerCase()}.png`} alt={c.name} loading="lazy" decoding="async" onError={(e) => { e.target.style.opacity = "0"; }} /></div>
                  <span className="c-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-wrap">
          <div className="budget-wrap">
            <div className="budget-head-title">Budget</div>
            <div className="budget-pills">
              {["low", "middle", "high"].map((b) => (
                <button key={b} type="button" className={`budget-pill${budget === b ? " active" : ""}`} onClick={() => setBudget(b === budget ? "" : b)}>
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="section-wrap">
          <div className="cat-head-row">
            <div className="cat-head-title">Shop by Category</div>
            <button type="button" className="btn-viewall" onClick={() => router.push(`/search?q=categories${budget ? `&budget=${budget}` : ""}`)}>View all <ChevRight s={13} /></button>
          </div>
          {categoriesLoading ? <LoaderSkeleton /> : (
            <div className="cat-grid">
              {displayCategories.map((cat, i) => {
                const rawCatImg = getCategoryImageSrc(cat);
                const imgSrc = rawCatImg ? (getOptimizedImageUrl(rawCatImg) ?? rawCatImg) : null;
                return (
                  <a key={`${cat.name}-${i}`} href={`/search?q=${encodeURIComponent(cat.name)}${budget ? `&budget=${budget}` : ""}`} className={`cat-tile${!imgSrc ? " shimmer-tile" : ""}`} style={{ animationDelay: `${i * 25}ms` }}>
                    <CatPlaceholder col={cat.col || CAT_COLORS[i % CAT_COLORS.length]} name={cat.name} />
                    {imgSrc && <img src={imgSrc} alt={cat.name} loading="lazy" decoding="async" onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }} />}
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

      {promoBanners[0] && (
        <div className="sec-wrap">
          <PromoBannerBlock banner={promoBanners[0]} />
        </div>
      )}
      {!productsLoading && SECTIONS.map((sec, idx) => {
        if (!sec.items?.length) return null;
        const state = scrollState[idx] ?? { canPrev: false, canNext: true };
        const bannerAfter = promoBanners[idx % promoBanners.length];
        return (
          <div key={`cat-${sec.key}`}>
            <div className="sec-wrap">
              <SectionHeader
                icon={sec.icon}
                label={sec.label}
                color={sec.color}
                searchQuery={sec.key}
                onPrev={() => scrollRow(idx, -1)}
                onNext={() => scrollRow(idx, 1)}
                canPrev={state.canPrev}
                canNext={state.canNext}
              />
              <div
                className="prod-row"
                ref={(el) => { sectionRefs.current[idx] = el; }}
                onScroll={() => handleScroll(idx)}
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
      {MEAL_SECTIONS.map((sec, idx) => {
        const i = SECTIONS.length + idx;
        if (!sec.items?.length) return null;
        const state = scrollState[i] ?? { canPrev: false, canNext: true };
        const bannerAfter = promoBanners[i % promoBanners.length];
        return (
          <div key={`meal-${sec.key}`}>
            <div className="sec-wrap">
              <SectionHeader
                icon={sec.icon}
                label={sec.label}
                color={sec.color}
                seeAllToSubscription
                onPrev={() => scrollRow(i, -1)}
                onNext={() => scrollRow(i, 1)}
                canPrev={state.canPrev}
                canNext={state.canNext}
              />
              <div
                className="prod-row"
                ref={(el) => { sectionRefs.current[i] = el; }}
                onScroll={() => handleScroll(i)}
              >
                {sec.items.map((item) => (
                  <HomeMealCard key={item.id} item={item} />
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

      {modal && (
        <div className="m-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }} role="dialog" aria-modal="true">
          <div className="m-sheet">
            <div className="m-banner">
              <div className="m-handle" aria-hidden />
              {(modal.imageUrl || modal.bannerImageUrl || modal.image) && (
                <img
                  className="m-banner-img"
                  src={getOptimizedImageUrl(getImageUrl(modal.imageUrl || modal.bannerImageUrl || modal.image)) ?? getImageUrl(modal.imageUrl || modal.bannerImageUrl || modal.image)}
                  alt={modal.menuName || modal.name || ""}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <div className="m-banner-shade" />
              <div className="m-banner-info">
                {!(modal.imageUrl || modal.bannerImageUrl || modal.image) && (
                  <img className="m-flag" src={getOptimizedImageUrl(modal.flag || `https://flagcdn.com/w160/${(modal.code || "").toLowerCase()}.png`) || modal.flag || `https://flagcdn.com/w160/${(modal.code || "").toLowerCase()}.png`} alt="" loading="lazy" decoding="async" onError={(e) => { e.target.style.display = "none"; }} />
                )}
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
    </>
  );
}
