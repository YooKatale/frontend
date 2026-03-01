"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import { getMealForDay } from "@lib/mealMenuConfig";
import { getMealPricing, formatPrice, calculateMealTotal } from "@lib/mealPricingConfig";
import { useNewScheduleMutation } from "@slices/productsApiSlice";
import {
  usePlanRatingCreateMutation,
  useGetPlanRatingsQuery,
  useMealCalendarOverridesGetMutation,
  useMealSlotsPublicGetMutation,
} from "@slices/usersApiSlice";
import { useAuth } from "@slices/authSlice";
import { useAuthModal } from "@components/AuthModalContext";
import { getOptimizedImageUrl } from "@constants/constants";

/* ─── SVG ICON SYSTEM ─────────────────────────────────────────────────────── */
const Ico = ({ d, s = 16, sw = 1.8, fill = "none", stroke = "currentColor", vb = "0 0 24 24", children }) => (
  <svg width={s} height={s} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  Calendar: ({ s = 16 }) => <Ico s={s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Ico>,
  Crown: ({ s = 16 }) => <Ico s={s}><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><line x1="5" y1="20" x2="19" y2="20"/></Ico>,
  Users: ({ s = 16 }) => <Ico s={s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>,
  Briefcase: ({ s = 16 }) => <Ico s={s}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Ico>,
  Clock: ({ s = 16 }) => <Ico s={s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Ico>,
  Truck: ({ s = 16 }) => <Ico s={s}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Ico>,
  Share: ({ s = 16 }) => <Ico s={s}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></Ico>,
  Star: ({ s = 16, filled = false }) => <Ico s={s} fill={filled ? "#e8a020" : "none"} stroke="#e8a020" sw={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Ico>,
  Cart: ({ s = 16 }) => <Ico s={s}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></Ico>,
  Leaf: ({ s = 16 }) => <Ico s={s}><path d="M2 22 16 8M17.5 6.5c0 0 2.5 2.5 0 5s-5 0-5 0"/><path d="M16 8c0 0 5-2 6-7-5 1-7 6-7 6"/></Ico>,
  ChevronR: ({ s = 16 }) => <Ico s={s}><polyline points="9 18 15 12 9 6"/></Ico>,
  ChevronL: ({ s = 16 }) => <Ico s={s}><polyline points="15 18 9 12 15 6"/></Ico>,
  Flame: ({ s = 16 }) => <Ico s={s}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></Ico>,
  Utensils: ({ s = 16 }) => <Ico s={s}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></Ico>,
  Info: ({ s = 16 }) => <Ico s={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Ico>,
  Check: ({ s = 16, c = "currentColor" }) => <Ico s={s} stroke={c}><polyline points="20 6 9 17 4 12"/></Ico>,
  Sun: ({ s = 16 }) => <Ico s={s}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Ico>,
  Moon: ({ s = 16 }) => <Ico s={s}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Ico>,
  Bowl: ({ s = 16 }) => <Ico s={s}><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/><path d="M5 12c0 3.87 3.13 7 7 7s7-3.13 7-7"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></Ico>,
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_TO_BACKEND = { Mon: "monday", Tue: "tuesday", Wed: "wednesday", Thu: "thursday", Fri: "friday", Sat: "saturday", Sun: "sunday" };
const MEAL_TYPES = [
  { id: "breakfast", name: "Breakfast", time: "6:00 – 10:00 AM", icon: "Sun" },
  { id: "lunch", name: "Lunch", time: "12:00 – 3:00 PM", icon: "Bowl" },
  { id: "supper", name: "Supper", time: "6:00 – 10:00 PM", icon: "Moon" },
];
const MEAL_COLORS = {
  Breakfast: { accent: "#e8a020", light: "#fff8ec" },
  Lunch: { accent: "#16a34a", light: "#f0fdf4" },
  Supper: { accent: "#7c3aed", light: "#faf5ff" },
};
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' fill='%23e2e8f0'%3E%3Crect width='200' height='150' fill='%23f7fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14' font-family='sans-serif'%3ENo image%3C/text%3E%3C/svg%3E";

/* ─── MEAL CARD ──────────────────────────────────────────────────────────── */
function MealCard({ item, mode, onAdd, isSelected }) {
  const col = MEAL_COLORS[item.meal] || MEAL_COLORS.Lunch;
  const IconComp = Icons[item.icon] || Icons.Bowl;
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)",
        border: `1px solid ${isSelected ? col.accent : col.accent + "22"}`,
        display: "flex",
        flexDirection: "column",
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,.12), 0 0 0 2px ${col.accent}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)";
      }}
    >
      <div style={{ position: "relative", height: 180, overflow: "hidden", background: col.light, flexShrink: 0 }}>
        {item.img ? (
          <img src={getOptimizedImageUrl(item.img) ?? item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${col.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", color: col.accent }}>
              <Icons.Utensils s={24} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: col.accent, letterSpacing: 0.5, textTransform: "uppercase" }}>Ingredients provided</span>
          </div>
        )}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: col.accent,
          color: "#fff", borderRadius: 100, padding: "5px 11px",
          display: "flex", alignItems: "center", gap: 5,
          fontSize: 11, fontWeight: 800, letterSpacing: 0.4,
          boxShadow: `0 2px 8px ${col.accent}55`,
        }}>
          <IconComp s={11} />
          {item.meal}
        </div>
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: mode === "eat" ? "#16a34a" : "#0ea5e9",
          color: "#fff", borderRadius: 100, padding: "4px 9px",
          fontSize: 9, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
        }}>
          {mode === "eat" ? "Ready to eat" : "Ready to cook"}
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280" }}>
          <Icons.Clock s={12} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{item.time}</span>
        </div>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#111827", lineHeight: 1.35, margin: 0 }}>{item.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9ca3af" }}>
          <Icons.Flame s={11} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{item.weight}</span>
        </div>
        <div style={{ height: 1, background: "#f3f4f6", margin: "2px 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>/ {item.pricePeriod || "month"}</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#111827", lineHeight: 1.1 }}>{item.price}</div>
          </div>
          <button
            type="button"
            style={{
              background: col.accent, color: "#fff",
              border: "none", borderRadius: 12, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 800, cursor: "pointer",
              boxShadow: `0 4px 14px ${col.accent}44`,
              transition: "opacity .15s, transform .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}
            onClick={() => onAdd(item)}
          >
            <Icons.Cart s={13} /> {isSelected ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

const PLAN_STYLES = {
  premium: { id: "premium", label: "Premium", icon: Icons.Crown, color: "#7c3aed", bg: "#f5f3ff" },
  family: { id: "family", label: "Family", icon: Icons.Users, color: "#e07820", bg: "#fff7ed" },
  business: { id: "business", label: "Business", icon: Icons.Briefcase, color: "#0ea5e9", bg: "#f0f9ff" },
};

const MP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.mp-wrap{font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased;background:transparent}
.mp-wrap button{font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer}
@keyframes mp-fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.meal-page{max-width:1200px;margin:0 auto;padding:0 16px 48px}
@media(min-width:768px){.meal-page{padding:0 28px 48px}}
.mp-header{display:flex;align-items:center;justify-content:space-between;padding:20px 0 24px;gap:12px;flex-wrap:wrap;}
.mp-title-group{display:flex;align-items:center;gap:10px}
.mp-icon-box{width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,#1a5c1a,#2d8c2d);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 14px rgba(26,92,26,.3);}
.mp-heading{font-family:'DM Serif Display',serif;font-size:clamp(18px,3vw,24px);color:#111827}
.mp-sub{font-size:12px;color:#6b7280;font-weight:500;margin-top:2px}
.plan-tabs{display:flex;gap:6px;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:5px;box-shadow:0 1px 4px rgba(0,0,0,.05);}
.plan-tab{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;border:none;font-size:13px;font-weight:700;transition:all .18s;background:transparent;color:#6b7280;}
.plan-tab.active{color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.15);}
.plan-tab:not(.active):hover{background:#f9fafb;color:#374151}
.mp-card{background:#fff;border-radius:24px;box-shadow:0 2px 20px rgba(0,0,0,.06);border:1px solid #e5e7eb;overflow:hidden;animation:mp-fadeUp .35s ease both;}
.mp-topbar{padding:18px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-bottom:1px solid #f3f4f6;}
.mp-plan-badge{display:flex;align-items:center;gap:8px;}
.mp-plan-label{font-size:16px;font-weight:900;color:#111827}
.mp-plan-sub{font-size:11px;color:#6b7280;font-weight:500}
.mp-cart-btn{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:100px;background:linear-gradient(135deg,#1a5c1a,#2d8c2d);color:#fff;border:none;font-size:13px;font-weight:800;box-shadow:0 4px 14px rgba(26,92,26,.3);transition:transform .15s,box-shadow .18s;}
.mp-cart-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(26,92,26,.35)}
.cart-badge{background:#fff;color:#1a5c1a;width:20px;height:20px;border-radius:100%;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;}
.mp-meta-row{padding:12px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #f3f4f6;flex-wrap:wrap;}
.share-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:100px;border:1.5px solid #e5e7eb;background:#fff;font-size:12px;font-weight:700;color:#374151;transition:all .16s;}
.share-btn:hover{border-color:#d1d5db;background:#f9fafb}
.stars-row{display:flex;align-items:center;gap:2px;margin-left:auto}
.rate-label{font-size:11px;color:#6b7280;font-weight:600;margin-left:6px}
.beta-pill{background:#dcfce7;color:#15803d;padding:3px 9px;border-radius:100px;font-size:9px;font-weight:900;letter-spacing:.8px;text-transform:uppercase;}
.mp-controls{padding:16px 20px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;border-bottom:1px solid #f3f4f6;background:#fafafa;}
.ctrl-group{display:flex;flex-direction:column;gap:5px}
.ctrl-label{font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px}
.ctrl-btns{display:flex;gap:4px}
.ctrl-btn{padding:7px 14px;border-radius:100px;border:1.5px solid #e5e7eb;font-size:12px;font-weight:700;background:#fff;color:#6b7280;transition:all .16s;}
.ctrl-btn.active{border-color:transparent;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.ctrl-btn:not(.active):hover{border-color:#d1d5db;color:#374151}
.day-selector{padding:16px 20px;border-bottom:1px solid #f3f4f6}
.day-label{font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}
.day-scroll{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.day-scroll::-webkit-scrollbar{display:none}
.day-btn{flex-shrink:0;min-width:52px;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 8px;border-radius:14px;border:1.5px solid #e5e7eb;background:#fff;transition:all .18s;}
.day-btn.active{border-color:transparent;color:#fff}
.day-btn:not(.active):hover{background:#f9fafb;border-color:#d1d5db}
.day-short{font-size:13px;font-weight:800}
.day-dot{width:5px;height:5px;border-radius:100%;background:rgba(255,255,255,.6)}
.mode-tabs{padding:14px 20px;display:flex;gap:6px;border-bottom:1px solid #f3f4f6;}
.mode-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:12px;border-radius:14px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:800;color:#6b7280;transition:all .18s;}
.mode-tab.active{border-color:transparent;box-shadow:0 2px 12px rgba(0,0,0,.1);}
.mode-tab:not(.active):hover{border-color:#d1d5db;color:#374151}
.meals-grid{padding:20px;display:grid;grid-template-columns:1fr;gap:16px;}
@media(min-width:640px){.meals-grid{grid-template-columns:1fr 1fr}}
@media(min-width:900px){.meals-grid{grid-template-columns:repeat(3,1fr)}}
.veg-row{margin:0 20px 20px;display:flex;align-items:center;gap:10px;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:12px 16px;cursor:pointer;user-select:none;transition:background .18s;}
.veg-row:hover{background:#dcfce7}
.toggle-track{width:38px;height:22px;border-radius:100px;transition:background .18s;position:relative;flex-shrink:0;}
.toggle-thumb{position:absolute;top:3px;width:16px;height:16px;border-radius:100%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);transition:transform .18s;}
.veg-label{font-size:13px;font-weight:700;color:#15803d}
.veg-sub{font-size:11px;color:#4ade80;font-weight:500;margin-left:auto}
.mp-footer{margin:0 20px 20px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:1.5px solid #bbf7d0;border-radius:16px;padding:12px 16px;display:flex;align-items:center;gap:10px;color:#15803d;}
.footer-text{font-size:12px;font-weight:700}
.footer-sub{font-size:11px;color:#4ade80;font-weight:500}
`;

export default function MealPlanCalendarNew({ planType = "premium", subscriptionPackages = [], onPlanSelect }) {
  const [activeDay, setActiveDay] = useState("Mon");
  const [mode, setMode] = useState("eat");
  const [duration, setDuration] = useState("weekly");
  const [income, setIncome] = useState("middle");
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [planRating, setPlanRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [mealOverrides, setMealOverrides] = useState([]);
  const [mealSlots, setMealSlots] = useState([]);

  const toast = useToast();
  const router = useRouter();
  const { userInfo } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [createSchedule] = useNewScheduleMutation();
  const [createPlanRating] = usePlanRatingCreateMutation();
  const [fetchOverrides] = useMealCalendarOverridesGetMutation();
  const [fetchSlots] = useMealSlotsPublicGetMutation();

  useEffect(() => {
    fetchOverrides().unwrap().then((res) => {
      if (res?.status === "Success" && Array.isArray(res?.data)) setMealOverrides(res.data);
    }).catch(() => {});
  }, [fetchOverrides]);
  useEffect(() => {
    fetchSlots().unwrap().then((res) => {
      if (res?.status === "Success" && Array.isArray(res?.data)) setMealSlots(res.data);
    }).catch(() => {});
  }, [fetchSlots]);

  const { data: ratingsData, refetch: refetchRatings } = useGetPlanRatingsQuery(
    { planType: planType?.toLowerCase(), context: "meal_plan" },
    { skip: !planType }
  );
  const avgRating = ratingsData?.stats?.average ?? ratingsData?.data?.average ?? 0;
  const totalRatings = ratingsData?.stats?.total ?? ratingsData?.data?.total ?? 0;

  const prepType = mode === "eat" ? "ready-to-eat" : "ready-to-cook";
  const dayBackend = DAY_TO_BACKEND[activeDay];
  const incomeLevel = income;

  const getSlot = (day, mealTypeId, prepTypeId) =>
    mealSlots.find(
      (s) =>
        s.incomeLevel === incomeLevel &&
        s.prepType === prepTypeId &&
        s.day === day &&
        s.mealType === mealTypeId
    );

  const getMealImage = (day, mealTypeId, prepTypeId) => {
    const slot = getSlot(day, mealTypeId, prepTypeId);
    if (slot?.imageUrl) return slot.imageUrl;
    const override = mealOverrides.find(
      (o) =>
        o.incomeLevel === incomeLevel &&
        o.prepType === prepTypeId &&
        o.day === day &&
        o.mealType === mealTypeId
    );
    if (override?.imageUrl) return override.imageUrl;
    return null;
  };

  const getMeal = (day, mealTypeId, prepTypeId) => {
    const slot = getSlot(day, mealTypeId, prepTypeId);
    const configMeal = getMealForDay(day, mealTypeId, incomeLevel, prepTypeId);
    const pricing = getMealPricing(mealTypeId, prepTypeId, incomeLevel);
    const priceKey = duration === "weekly" ? "weekly" : "monthly";
    const amount = slot?.priceWeekly != null || slot?.priceMonthly != null
      ? (duration === "weekly" ? (slot.priceWeekly ?? pricing?.weekly) : (slot.priceMonthly ?? pricing?.monthly))
      : (pricing?.[priceKey] ?? 0);
    if (slot) {
      return {
        meal: slot.mealName || configMeal?.meal || "",
        description: slot.description || configMeal?.description || "",
        quantity: slot.quantity || configMeal?.quantity || "—",
        image: slot.imageUrl || getMealImage(day, mealTypeId, prepTypeId),
        type: prepTypeId,
        pricing: { weekly: slot.priceWeekly ?? pricing?.weekly ?? 0, monthly: slot.priceMonthly ?? pricing?.monthly ?? 0 },
      };
    }
    if (configMeal) {
      return {
        ...configMeal,
        type: prepTypeId,
        pricing,
      };
    }
    return null;
  };

  const mealsForDay = [];
  MEAL_TYPES.forEach((mt) => {
    const meal = getMeal(dayBackend, mt.id, prepType);
    if (!meal) return;
    const img = getMealImage(dayBackend, mt.id, prepType) || meal.image;
    mealsForDay.push({
      meal: mt.name,
      time: mt.time,
      icon: mt.icon,
      name: meal.meal,
      weight: meal.quantity || "—",
      price: formatPrice(duration === "weekly" ? (meal.pricing?.weekly ?? 0) : (meal.pricing?.monthly ?? 0)),
      pricePeriod: duration === "weekly" ? "week" : "month",
      img: img || meal.image || (prepType === "ready-to-cook" ? null : PLACEHOLDER_IMAGE),
      _key: { day: dayBackend, mealType: mt.id, prepType },
      _pricing: meal.pricing,
    });
  });

  const defaultPlanStyle = { id: "plan", label: "Plan", icon: Icons.Crown, color: "#1a5c1a", bg: "#e6f0e6" };
  const plansList = subscriptionPackages?.length > 0
    ? subscriptionPackages.map((p) => ({
        id: (p.type || "").toLowerCase(),
        label: (p.type || "").charAt(0).toUpperCase() + (p.type || "").slice(1),
        ...(PLAN_STYLES[(p.type || "").toLowerCase()] || defaultPlanStyle),
      }))
    : Object.values(PLAN_STYLES);
  const planStyle = PLAN_STYLES[planType?.toLowerCase()] || defaultPlanStyle;
  const PlanIcon = planStyle.icon;

  const isMealSelected = (item) =>
    selectedMeals.some(
      (m) => m.day === item._key.day && m.mealType === item._key.mealType && m.prepType === item._key.prepType
    );

  const handleMealSelect = (item) => {
    const key = { day: item._key.day, mealType: item._key.mealType, prepType: item._key.prepType, pricing: item._pricing, meal: item.name, incomeLevel };
    setSelectedMeals((prev) => {
      const exists = prev.some((m) => m.day === key.day && m.mealType === key.mealType && m.prepType === key.prepType);
      if (exists) return prev.filter((m) => !(m.day === key.day && m.mealType === key.mealType && m.prepType === key.prepType));
      return [...prev, key];
    });
  };

  const handleSharePlan = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${planType} Meal Plan – Yookatale`;
    const text = `Check out the ${planType} meal plan on Yookatale.`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url, text });
        toast({ title: "Shared!", status: "success", duration: 2000, isClosable: true });
      } else {
        await navigator.clipboard?.writeText(url);
        toast({ title: "Link copied!", status: "success", duration: 2000, isClosable: true });
      }
    } catch (e) {
      if (e?.name !== "AbortError") {
        try {
          await navigator.clipboard?.writeText(url);
          toast({ title: "Link copied!", status: "success", duration: 2000, isClosable: true });
        } catch {
          toast({ title: "Could not share", status: "error", duration: 3000, isClosable: true });
        }
      }
    }
  };

  const handleSubmitRating = async () => {
    if (planRating < 1) return;
    if (!userInfo?._id) {
      toast({ title: "Login required to rate", status: "warning", duration: 3000, isClosable: true });
      openAuthModal();
      return;
    }
    try {
      await createPlanRating({
        userId: userInfo._id,
        planType: planType?.toLowerCase(),
        context: "meal_plan",
        rating: planRating,
        userEmail: userInfo?.email || null,
        userName: userInfo?.name || null,
      }).unwrap();
      setRatingSubmitted(true);
      refetchRatings();
      toast({ title: "Thanks for your rating!", status: "success", duration: 2000, isClosable: true });
    } catch (e) {
      toast({ title: "Could not submit rating", description: e?.data?.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleViewCart = () => {
    if (!userInfo?._id) {
      toast({ title: "Please sign in to continue", status: "info", duration: 3000, isClosable: true });
      openAuthModal();
      return;
    }
    if (selectedMeals.length === 0) {
      toast({ title: "Add at least one meal", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    handleSubscribe();
  };

  const handleSubscribe = async () => {
    if (!userInfo?._id) {
      openAuthModal();
      return;
    }
    if (selectedMeals.length === 0) return;
    const total = selectedMeals.reduce(
      (sum, m) => sum + (duration === "weekly" ? (m.pricing?.weekly ?? 0) : (m.pricing?.monthly ?? 0)),
      0
    );
    try {
      const schedulePayload = {
        user: userInfo._id,
        products: {
          mealSubscription: true,
          planType: planType?.toLowerCase(),
          incomeLevel,
          meals: selectedMeals.map((meal) => ({
            mealType: meal.mealType,
            prepType: meal.prepType,
            duration,
            price: duration === "weekly" ? (meal.pricing?.weekly || 0) : (meal.pricing?.monthly || 0),
            mealName: meal.meal,
          })),
        },
        scheduleDays: [],
        scheduleTime: "",
        repeatSchedule: false,
        scheduleFor: "meal_subscription",
        order: {
          payment: { paymentMethod: "", transactionId: "" },
          deliveryAddress: "NAN",
          specialRequests: vegOnly ? "Vegetarian option requested." : "",
          orderTotal: total,
        },
      };
      const res = await createSchedule(schedulePayload).unwrap();
      if (res.status === "Success" || res.status === "success") {
        const orderId = res.data?.Order || res.data?.order;
        toast({ title: "Success! Redirecting to payment...", status: "success", duration: 2000, isClosable: true });
        router.push(`/payment/${orderId}`);
      } else {
        throw new Error(res.message || "Subscription failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.message || error?.message || "Failed to create subscription",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <style>{MP_CSS}</style>
      <div className="mp-wrap">
        <div className="meal-page">
          <div className="mp-header">
            <div className="mp-title-group">
              <div className="mp-icon-box"><Icons.Calendar s={20} /></div>
              <div>
                <div className="mp-heading">Meal planning &amp; calendar</div>
                <div className="mp-sub">View your selected plan&apos;s weekly meal calendar and pricing.</div>
              </div>
            </div>
            {plansList.length > 0 && (
              <div className="plan-tabs">
                {plansList.map((p) => {
                  const PIcon = p.icon || Icons.Crown;
                  const isActive = (planType || "").toLowerCase() === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`plan-tab${isActive ? " active" : ""}`}
                      style={isActive ? { background: `linear-gradient(135deg, ${p.color}cc, ${p.color})` } : {}}
                      onClick={() => onPlanSelect?.(p.id)}
                    >
                      <PIcon s={13} /> {p.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mp-card" key={planType}>
            <div className="mp-topbar">
              <div className="mp-plan-badge">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: planStyle.bg, display: "flex", alignItems: "center", justifyContent: "center", color: planStyle.color }}>
                  <PlanIcon s={18} />
                </div>
                <div>
                  <div className="mp-plan-label">Weekly meal plan</div>
                  <div className="mp-plan-sub">{planStyle.label} plan &nbsp;•&nbsp; Free delivery within 3km</div>
                </div>
              </div>
              <button type="button" className="mp-cart-btn" onClick={handleViewCart}>
                <Icons.Cart s={15} /> View cart
                <span className="cart-badge">{selectedMeals.length}</span>
              </button>
            </div>

            <div className="mp-meta-row">
              <button type="button" className="share-btn" onClick={handleSharePlan}>
                <Icons.Share s={13} /> Share to social &amp; email
              </button>
              <span className="beta-pill">Beta</span>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    style={{ background: "none", border: "none", padding: 0, cursor: ratingSubmitted ? "default" : "pointer" }}
                    onClick={() => !ratingSubmitted && setPlanRating(i)}
                    onMouseEnter={() => !ratingSubmitted && setPlanRating(i)}
                  >
                    <Icons.Star s={14} filled={i <= (ratingSubmitted ? planRating : planRating) || i <= Math.round(avgRating)} />
                  </button>
                ))}
                <span className="rate-label">Rate this plan</span>
              </div>
              {totalRatings > 0 && <span className="rate-label">({Number(avgRating).toFixed(1)} · {totalRatings} reviews)</span>}
              <button
                type="button"
                style={{ marginLeft: 8, padding: "4px 10px", borderRadius: 100, border: "1px solid #1a5c1a", background: "#1a5c1a", color: "#fff", fontSize: 11, fontWeight: 800 }}
                onClick={handleSubmitRating}
                disabled={planRating < 1 || ratingSubmitted}
              >
                {ratingSubmitted ? "Rated" : "Rate"}
              </button>
            </div>

            <div className="mp-controls">
              <div className="ctrl-group">
                <div className="ctrl-label">Purchase duration</div>
                <div className="ctrl-btns">
                  {["weekly", "monthly"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`ctrl-btn${duration === d ? " active" : ""}`}
                      style={duration === d ? { background: "#1a5c1a", borderColor: "#1a5c1a" } : {}}
                      onClick={() => setDuration(d)}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ctrl-group">
                <div className="ctrl-label">Income level</div>
                <div className="ctrl-btns">
                  {[["low", "Low income"], ["middle", "Middle income"]].map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      className={`ctrl-btn${income === v ? " active" : ""}`}
                      style={income === v ? { background: "#1a5c1a", borderColor: "#1a5c1a" } : {}}
                      onClick={() => setIncome(v)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="day-selector">
              <div className="day-label">Select day</div>
              <div className="day-scroll">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`day-btn${activeDay === d ? " active" : ""}`}
                    style={activeDay === d ? { background: planStyle.color, borderColor: planStyle.color } : {}}
                    onClick={() => setActiveDay(d)}
                  >
                    <span className="day-short">{d}</span>
                    {activeDay === d && <span className="day-dot" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mode-tabs">
              {[
                { id: "eat", label: "Ready to eat", icon: Icons.Utensils, color: "#16a34a", bg: "#f0fdf4" },
                { id: "cook", label: "Ready to cook", icon: Icons.Flame, color: "#0ea5e9", bg: "#f0f9ff" },
              ].map((m) => {
                const MIcon = m.icon;
                const isActive = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`mode-tab${isActive ? " active" : ""}`}
                    style={isActive ? { background: m.bg, color: m.color, borderColor: `${m.color}44` } : {}}
                    onClick={() => setMode(m.id)}
                  >
                    <MIcon s={16} /> {m.label}
                  </button>
                );
              })}
            </div>

            <div className="meals-grid">
              {mealsForDay.map((item, i) => (
                <div key={`${item._key.day}-${item._key.mealType}`} style={{ animation: `mp-fadeUp .35s ${i * 80}ms ease both` }}>
                  <MealCard
                    item={item}
                    mode={mode}
                    onAdd={handleMealSelect}
                    isSelected={isMealSelected(item)}
                  />
                </div>
              ))}
            </div>

            <div className="veg-row" onClick={() => setVegOnly((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setVegOnly((v) => !v)}>
              <div className="toggle-track" style={{ background: vegOnly ? "#16a34a" : "#d1d5db" }}>
                <div className="toggle-thumb" style={{ transform: vegOnly ? "translateX(16px)" : "translateX(0)" }} />
              </div>
              <Icons.Leaf s={15} />
              <span className="veg-label">Vegetarian meals only</span>
              {vegOnly && <span className="veg-sub">Active</span>}
            </div>

            <div className="mp-footer">
              <Icons.Truck s={16} />
              <div>
                <div className="footer-text">Free delivery within 3km</div>
                <div className="footer-sub">Extra: 950 UGX per km beyond 3km</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
