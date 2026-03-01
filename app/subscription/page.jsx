"use client";

/**
 * Subscription page — test-plan UI, plan selection, meal calendar.
 * Backend: useSubscriptionPackageGetMutation, useSubscriptionPostMutation.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  useToast,
  Icon,
  Spinner,
  SlideFade,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import { useAuthModal } from "@components/AuthModalContext";
import {
  useSubscriptionPackageGetMutation,
  useSubscriptionPostMutation,
  useGetPlanRatingsQuery,
} from "@slices/usersApiSlice";
import MealPlanCalendarNew from "@components/MealPlanCalendarNew";
import SubscriptionTerms from "@components/SubscriptionTerms";
import { FormatCurr } from "@utils/utils";
import { FaAppleAlt, FaUsers, FaChartLine, FaHeart } from "react-icons/fa";

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const IconSvg = ({ children, s = 18, stroke = "currentColor", fill = "none", sw = 1.7 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const CheckCircle = ({ s = 16, c = "#1a5c1a" }) => (
  <IconSvg s={s} stroke={c}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </IconSvg>
);
const StarFill = ({ s = 14, filled = true }) => (
  <IconSvg s={s} fill={filled ? "#f0c020" : "none"} stroke={filled ? "#f0c020" : "rgba(0,0,0,.2)"} sw={1.2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </IconSvg>
);
const ChevRight = ({ s = 16, c = "currentColor" }) => (
  <IconSvg s={s} stroke={c}><path d="m9 18 6-6-6-6" /></IconSvg>
);
const TruckIcon = ({ s = 14 }) => (
  <IconSvg s={s}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </IconSvg>
);
const UserPlusIcon = ({ s = 14 }) => (
  <IconSvg s={s}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </IconSvg>
);
const InfoIcon = ({ s = 13 }) => (
  <IconSvg s={s}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </IconSvg>
);
const ZapIcon = ({ s = 16 }) => (
  <IconSvg s={s} fill="currentColor" stroke="none">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </IconSvg>
);

/* Benefit icons (professional) — used for PLAN BENEFITS list */
const BenefitIcons = {
  card: ({ s = 14, c = "currentColor" }) => <IconSvg s={s} stroke={c}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></IconSvg>,
  test: ({ s = 14, c = "currentColor" }) => <IconSvg s={s} stroke={c}><path d="M9 2v6l4-3-4-3z"/><path d="M4.5 20h15a2.5 2.5 0 0 0 0-5h-15a2.5 2.5 0 0 0 0 5z"/><path d="M12 16v4"/></IconSvg>,
  delivery: ({ s = 14 }) => <TruckIcon s={s} />,
  clock: ({ s = 14, c = "currentColor" }) => <IconSvg s={s} stroke={c}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></IconSvg>,
  calendar: ({ s = 14, c = "currentColor" }) => <IconSvg s={s} stroke={c}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></IconSvg>,
  support: ({ s = 14, c = "currentColor" }) => <IconSvg s={s} stroke={c}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></IconSvg>,
  check: ({ s = 14, c = "currentColor" }) => <CheckCircle s={s} c={c} />,
};
function getBenefitIcon(text) {
  const t = (text || "").toLowerCase();
  if (/membership fee|fee|payment|price|cashless|card|shopping/.test(t)) return BenefitIcons.card;
  if (/food test|test|premium test/.test(t)) return BenefitIcons.test;
  if (/delivery|mins|minutes|same day|express/.test(t)) return BenefitIcons.delivery;
  if (/24\/7|support|customer|help/.test(t)) return BenefitIcons.support;
  if (/month|year|membership|12 month/.test(t)) return BenefitIcons.calendar;
  if (/time|clock|schedule/.test(t)) return BenefitIcons.clock;
  return BenefitIcons.check;
}

/* ─── PLAN CONFIG (content in sentence case; headers unchanged) ─────────────── */
const PLAN_CONFIG = {
  premium: {
    id: "premium",
    name: "Premium",
    tagline: "SINGLE USER",
    color: "#7c3aed",
    colorLight: "#ede9fe",
    gradient: "linear-gradient(135deg,#4c1d95 0%,#7c3aed 100%)",
    ctaGradient: "linear-gradient(135deg,#6d28d9,#7c3aed)",
    ctaLabel: "Subscribe to premium",
    popular: false,
    originalPrice: "UGX 40,000",
    saveAmt: "SAVE 10,000",
    currentPrice: "UGX 30,000",
    discount: "25% OFF",
    stars: 4.5,
    reviews: 128,
    features: [
      "Premium Membership Fee",
      "1 Premium Food Test",
      "24 - 45 mins Delivery",
      "Cashless Shopping",
      "Same Day Delivery",
      "12 months Membership",
      "24/7 Customer Support",
    ],
  },
  family: {
    id: "family",
    name: "Family",
    tagline: "2-6 FAMILY MEMBERS",
    color: "#e07820",
    colorLight: "#fff4ea",
    gradient: "linear-gradient(135deg,#92400e 0%,#e07820 100%)",
    ctaGradient: "linear-gradient(135deg,#b45309,#e07820)",
    ctaLabel: "Subscribe to family",
    popular: true,
    originalPrice: "UGX 100,000",
    saveAmt: "SAVE 30,000",
    currentPrice: "UGX 90,000",
    discount: "25% OFF",
    stars: 4.5,
    reviews: 128,
    features: [
      "2-6 users",
      "Benefits:",
      "• Account activation",
      "• 1 Food test",
      "• Diet insights: Personalized nutrition advice and meal planning tips.",
      "• Promotional offers & discounts: Exclusive deals for the entire family.",
      "• Credit line: A flexible micro-credit option that caters to family grocery needs, allowing a pay-later model.",
      "• Unlimited food varieties in different quantities: Access to a wide selection of groceries, catering to diverse family dietary needs.",
      "• Loyalty points: Redeem cash for loyalty points, offering cost savings over time.",
      "• Gas credit: Access to gas refills, ensuring customers never run out of cooking fuel.",
      "• Express delivery 24/7: Priority delivery service with around-the-clock availability, perfect for busy families with tight schedules.",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    tagline: "10+ EMPLOYEES",
    color: "#0ea5e9",
    colorLight: "#e0f2fe",
    gradient: "linear-gradient(135deg,#0c4a6e 0%,#0ea5e9 100%)",
    ctaGradient: "linear-gradient(135deg,#0369a1,#0ea5e9)",
    ctaLabel: "Subscribe to business",
    popular: false,
    originalPrice: "UGX 240,000",
    saveAmt: "SAVE 60,000",
    currentPrice: "UGX 180,000",
    discount: "25% OFF",
    stars: 4.5,
    reviews: 128,
    features: [
      "10+ users",
      "Benefits:",
      "• Account activation",
      "• 1 Food test",
      "• Employee meal cards: Ensure your team is well-nourished with employee meal cards.",
      "• Gym and wellness cards: Promote wellness with gym memberships and wellness benefits for employees.",
      "• Diet insights: Personalized nutrition advice and meal planning tips.",
      "• Promotional offers & discounts: Exclusive access to deals for your business.",
      "• Credit line: A flexible micro-credit option that allows businesses to purchase groceries with a pay-later model.",
      "• Unlimited food varieties in different quantities: Access to a wide selection of groceries tailored to meet business needs.",
      "• Loyalty points: Redeem cash for loyalty points, providing long-term savings.",
      "• Gas credit: Access to gas refills for business operations, ensuring an uninterrupted fuel supply.",
      "• Express delivery 24/7: Fast and priority delivery for businesses at any time.",
    ],
  },
};

/* ─── PLAN CARD ──────────────────────────────────────────────────────────── */
function PlanCard({ plan, delay, onSubmit, isLoading, onTnc, onInvite }) {
  const features = Array.isArray(plan.features) ? plan.features : [];
  const benefits = features
    .map((f) => (typeof f === "string" ? f.replace(/^[\s•\-]\s*/, "").trim() : String(f)))
    .filter((t) => t && !/^benefits?\s*:?\s*$/i.test(t));
  return (
    <div
      className={`sub-plan-card${plan.popular ? " sub-plan-popular" : ""}`}
      style={{ "--accent": plan.color, "--accent-light": plan.colorLight, animationDelay: `${delay}ms` }}
    >
      {plan.popular && (
        <div className="sub-popular-badge">
          <ZapIcon s={11} /> MOST POPULAR
        </div>
      )}

      <div className="sub-plan-header" style={{ background: plan.gradient }}>
        <div className="sub-plan-header-grain" />
        <div className="sub-plan-header-sweep" />
        <div className="sub-plan-top-row">
          <div className="sub-plan-icon-wrap" style={{ background: "rgba(255,255,255,.18)" }}>
            {plan.type === "premium" && <Icon as={FaHeart} boxSize={4} color="white" />}
            {plan.type === "family" && <Icon as={FaUsers} boxSize={4} color="white" />}
            {plan.type === "business" && <Icon as={FaChartLine} boxSize={4} color="white" />}
            {!["premium", "family", "business"].includes(plan.type) && <Icon as={FaAppleAlt} boxSize={4} color="white" />}
          </div>
          <div className="sub-plan-discount-pill">{plan.discount || "25% OFF"}</div>
        </div>
        <div className="sub-plan-title-row">
          <span className="sub-plan-name">{plan.name}</span>
          <span className="sub-plan-title-sep">·</span>
          <span className="sub-plan-tagline-pill">{plan.tagline}</span>
        </div>
        <div className="sub-plan-pricing">
          <div className="sub-plan-orig-row">
            <span className="sub-plan-orig">{plan.originalPrice}</span>
            {plan.saveAmt && <span className="sub-plan-save">{plan.saveAmt}</span>}
          </div>
          <div className="sub-plan-price">{plan.currentPrice}</div>
        </div>
      </div>

      <div className="sub-plan-features">
        <div className="sub-features-label">PLAN BENEFITS</div>
        {benefits.map((text, i) => {
          const IconComp = getBenefitIcon(text);
          return (
            <div key={i} className="sub-feature-row">
              <div className="sub-feature-check" style={{ color: plan.color }}>
                <IconComp s={14} c={plan.color} />
              </div>
              <span className="sub-feature-text">{text}</span>
            </div>
          );
        })}
      </div>

      <div className="sub-plan-footer">
        <div className="sub-plan-stars">
          {[1, 2, 3, 4, 5].map((i) => {
            const rating = Number(plan.stars) || 0;
            const filled = i <= Math.round(rating);
            return <span key={i}><StarFill s={13} filled={filled} /></span>;
          })}
          <span className="sub-plan-rating">{Number(plan.stars) ? Number(plan.stars).toFixed(1) : "—"}</span>
          <span className="sub-plan-reviews">{plan.reviews != null ? plan.reviews : "—"} reviews</span>
        </div>
        <button
          type="button"
          className="sub-plan-cta"
          style={{ background: plan.ctaGradient }}
          onClick={() => onSubmit(plan.packageId)}
          disabled={isLoading}
        >
          {isLoading ? "Processing…" : plan.ctaLabel} <ChevRight s={14} c="#fff" />
        </button>
        <button type="button" className="sub-plan-invite" onClick={onInvite}>
          <UserPlusIcon s={13} /> Invite Friend to Test
        </button>
        <div className="sub-plan-delivery">
          <TruckIcon s={13} />
          <div>
            <div className="sub-delivery-title">Delivery terms:</div>
            <div className="sub-delivery-body">Free: Within 3km • Extra: 950 UGX/km beyond 3km</div>
          </div>
        </div>
        <button type="button" className="sub-plan-tnc" onClick={onTnc}>
          <InfoIcon s={12} /> View Terms &amp; Conditions
        </button>
      </div>
    </div>
  );
}

const SUB_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--g:#1a5c1a;--gl:#2d8c2d;--gp:#e6f0e6;--orange:#e07820;--gold:#f0c020;--dark:#0e180e;--mid:#445444;--muted:#8a9e87;--surf:#fff;--bg:#edf0ea;--bdr:rgba(0,0,0,.07);--r:22px;--sh:0 4px 24px rgba(0,0,0,.08);--sh2:0 16px 48px rgba(0,0,0,.16)}
body{font-family:'Sora',sans-serif;background:var(--bg);-webkit-font-smoothing:antialiased}
@keyframes sub-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes sub-shimmer{from{background-position:300% 0}to{background-position:-300% 0}}
@keyframes sub-pulse-badge{0%,100%{box-shadow:0 0 0 0 rgba(224,120,32,.5)}70%{box-shadow:0 0 0 8px rgba(224,120,32,0)}}
.sub-page{max-width:1440px;margin:0 auto;padding:0 14px 80px;padding-top:24px;}
@media(min-width:768px){.sub-page{padding:0 24px 80px;}}
@media(min-width:1280px){.sub-page{padding:0 40px 80px;}}
.promo-bar{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(120deg,#0e1e0e,#1a5c1a,#2d8c2d);border-radius:16px;padding:14px 20px;margin-bottom:32px;position:relative;overflow:hidden;animation:sub-fadeUp .4s ease;}
.promo-bar::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.06) 50%,transparent 70%);background-size:300% 100%;animation:sub-shimmer 5s infinite;}
.promo-left{display:flex;align-items:center;gap:10px;z-index:1;}
.promo-zap{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;color:var(--gold);flex-shrink:0;}
.promo-title{font-size:14px;font-weight:800;color:#fff;}
.promo-sub{font-size:11px;color:rgba(255,255,255,.65);font-weight:500;}
.promo-right{z-index:1;text-align:right;flex-shrink:0;}
.promo-pct{font-family:'DM Serif Display',serif;font-size:clamp(22px,4vw,32px);color:var(--gold);line-height:1;}
.promo-pct-sub{font-size:10px;color:rgba(255,255,255,.6);font-weight:600;}
.hero-head{text-align:center;margin-bottom:36px;animation:sub-fadeUp .5s .1s ease both;}
.hero-head h1{font-family:'DM Serif Display',serif;font-size:clamp(28px,5vw,52px);color:var(--dark);line-height:1.1;margin-bottom:10px;}
.hero-head p{font-size:clamp(13px,1.6vw,15px);color:var(--muted);max-width:460px;margin:0 auto;line-height:1.7;font-weight:500;}
.plans-grid{display:grid;grid-template-columns:1fr;gap:20px;align-items:start;}
@media(min-width:640px){.plans-grid{grid-template-columns:1fr 1fr;}}
@media(min-width:960px){.plans-grid{grid-template-columns:repeat(3,1fr);}}
.sub-plan-card{background:var(--surf);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);border:1.5px solid var(--bdr);display:flex;flex-direction:column;position:relative;animation:sub-fadeUp .5s ease both;transition:transform .25s,box-shadow .25s;}
.sub-plan-card:hover{transform:translateY(-6px);box-shadow:var(--sh2);}
.sub-plan-popular{border-color:var(--orange);box-shadow:0 0 0 2px rgba(224,120,32,.2),var(--sh);}
.sub-plan-popular:hover{box-shadow:0 0 0 2px rgba(224,120,32,.3),var(--sh2);}
.sub-popular-badge{position:absolute;top:16px;right:-1px;z-index:10;background:var(--orange);color:#fff;font-size:9px;font-weight:900;letter-spacing:1px;text-transform:uppercase;padding:4px 12px 4px 10px;border-radius:100px 0 0 100px;display:flex;align-items:center;gap:4px;animation:sub-pulse-badge 2s infinite;}
.sub-plan-header{position:relative;overflow:hidden;padding:14px 16px 16px;}
.sub-plan-header-grain{position:absolute;inset:0;pointer-events:none;opacity:.35;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");}
.sub-plan-header-sweep{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.08) 50%,transparent 65%);background-size:300% 100%;animation:sub-shimmer 6s infinite;}
.sub-plan-top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;position:relative;z-index:2;}
.sub-plan-icon-wrap{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;}
.sub-plan-discount-pill{background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.3);backdrop-filter:blur(6px);border-radius:100px;padding:3px 8px;font-size:9px;font-weight:800;color:#fff;letter-spacing:.5px;}
.sub-plan-title-row{display:flex;align-items:center;flex-wrap:wrap;gap:6px;position:relative;z-index:2;margin-bottom:10px;}
.sub-plan-name{font-family:'DM Serif Display',serif;font-size:18px;color:#fff;line-height:1.2;}
.sub-plan-title-sep{color:rgba(255,255,255,.7);font-size:14px;font-weight:600;}
.sub-plan-tagline-pill{display:inline-flex;align-items:center;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);border-radius:100px;padding:2px 8px;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.9);}
.sub-plan-pricing{position:relative;z-index:2;}
.sub-plan-orig-row{display:flex;align-items:center;gap:6px;margin-bottom:2px;}
.sub-plan-orig{font-size:11px;font-weight:600;color:rgba(255,255,255,.55);text-decoration:line-through;}
.sub-plan-save{background:rgba(255,255,255,.2);border-radius:100px;padding:1px 6px;font-size:8px;font-weight:800;color:#fff;}
.sub-plan-price{font-family:'DM Serif Display',serif;font-size:clamp(20px,3vw,26px);color:#fff;line-height:1;font-style:italic;}
.sub-plan-features{padding:12px 14px 0;flex:1;}
.sub-features-label{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:var(--muted);margin-bottom:8px;}
.sub-feature-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;}
.sub-feature-check{flex-shrink:0;margin-top:1px;}
.sub-feature-text{font-size:11px;color:var(--mid);font-weight:500;line-height:1.45;}
.sub-feature-meta{margin-bottom:4px;}
.sub-feature-text-meta{font-size:11px;font-weight:500;color:var(--dark);letter-spacing:.02em;}
.sub-plan-footer{padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--bdr);margin-top:10px;}
.sub-plan-stars{display:flex;align-items:center;gap:2px;}
.sub-plan-rating{font-size:11px;font-weight:800;color:var(--dark);margin-left:3px;}
.sub-plan-reviews{font-size:10px;color:var(--muted);font-weight:500;margin-left:3px;}
.sub-plan-cta{display:flex;align-items:center;justify-content:center;gap:5px;width:100%;padding:10px 16px;border-radius:100px;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:12px;font-weight:800;color:#fff;letter-spacing:.2px;transition:transform .15s,box-shadow .2s,opacity .18s;box-shadow:0 4px 18px rgba(0,0,0,.22);}
.sub-plan-cta:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.28);opacity:.92;}
.sub-plan-cta:active{transform:scale(.98);}
.sub-plan-cta:disabled{opacity:.7;cursor:not-allowed;}
.sub-plan-invite{display:flex;align-items:center;justify-content:center;gap:5px;background:transparent;border:1.5px solid var(--bdr);border-radius:100px;padding:7px;width:100%;font-family:'Sora',sans-serif;font-size:11px;font-weight:700;color:var(--mid);cursor:pointer;transition:background .18s,color .18s;}
.sub-plan-invite:hover{background:var(--bg);color:var(--dark);}
.sub-plan-delivery{display:flex;align-items:flex-start;gap:6px;background:var(--bg);border-radius:8px;padding:8px 10px;color:var(--muted);}
.sub-delivery-title{font-size:9px;font-weight:800;color:var(--dark);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;}
.sub-delivery-body{font-size:10px;color:var(--muted);font-weight:500;}
.sub-plan-tnc{display:flex;align-items:center;justify-content:center;gap:4px;background:none;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:10.5px;font-weight:600;color:var(--muted);transition:color .18s;}
.sub-plan-tnc:hover{color:var(--dark);}
.bottom-note{text-align:center;margin-top:36px;padding:24px;background:var(--surf);border-radius:18px;border:1px solid var(--bdr);box-shadow:var(--sh);animation:sub-fadeUp .5s .3s ease both;}
.bottom-note p{font-size:12.5px;color:var(--muted);font-weight:500;line-height:1.6;}
.bottom-note strong{color:var(--dark);font-weight:800;}
.sub-calendar-wrap{margin-top:32px;}
.sub-plan-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;}
.sub-plan-pill{padding:8px 16px;border-radius:100px;border:1.5px solid var(--bdr);background:var(--surf);font-family:'Sora',sans-serif;font-size:13px;font-weight:600;color:var(--mid);cursor:pointer;transition:background .18s,color .18s;}
.sub-plan-pill:hover{background:var(--bg);color:var(--dark);}
.sub-plan-pill.active{background:var(--g);color:#fff;border-color:var(--g);}
`;

export default function SubscriptionPage() {
  const [subscriptionPackages, setSubscriptionPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { isOpen: isTncOpen, onOpen: onTncOpen, onClose: onTncClose } = useDisclosure();

  const { data: ratingPremium } = useGetPlanRatingsQuery(
    { planType: "premium", context: "subscription" },
    { skip: !subscriptionPackages.some((p) => (p.type || "").toLowerCase() === "premium") }
  );
  const { data: ratingFamily } = useGetPlanRatingsQuery(
    { planType: "family", context: "subscription" },
    { skip: !subscriptionPackages.some((p) => (p.type || "").toLowerCase() === "family") }
  );
  const { data: ratingBusiness } = useGetPlanRatingsQuery(
    { planType: "business", context: "subscription" },
    { skip: !subscriptionPackages.some((p) => (p.type || "").toLowerCase() === "business") }
  );
  const getRatingForType = (type) => {
    const t = (type || "").toLowerCase();
    const data = t === "premium" ? ratingPremium : t === "family" ? ratingFamily : t === "business" ? ratingBusiness : null;
    const res = data?.data ?? data;
    const avg = res?.averageRating ?? res?.average ?? res?.rating;
    const count = res?.totalCount ?? res?.count ?? res?.reviews;
    return { stars: Number(avg) || null, reviews: Number(count) || null };
  };

  const chakraToast = useToast();
  const router = useRouter();
  const [fetchPackages] = useSubscriptionPackageGetMutation();
  const [createSubscription] = useSubscriptionPostMutation();
  const { userInfo } = useAuth();
  const { openAuthModal } = useAuthModal();

  const handleSubscriptionCardFetch = async () => {
    try {
      const res = await fetchPackages().unwrap();
      if (res?.status === "Success") {
        setSubscriptionPackages(res?.data || []);
        if (res?.data?.[0]) setSelectedPlan(res.data[0].type);
      }
    } catch (error) {
      console.error("Error fetching subscription packages:", error);
      chakraToast({
        title: "Error",
        description: "Failed to load subscription packages",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    handleSubscriptionCardFetch();
  }, []);

  const handleSubmit = async (packageId) => {
    if (!userInfo?._id) {
      openAuthModal();
      return;
    }
    setIsLoading(true);
    try {
      const res = await createSubscription({
        user: userInfo._id,
        packageId,
      }).unwrap();
      if (res.status === "Success") {
        router.push(`/payment/${res.data.Order}`);
      }
    } catch (err) {
      chakraToast({
        title: "Subscription Error",
        description: err.data?.message || "Failed to create subscription",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (planType) => setSelectedPlan(planType);

  const handleInviteShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/signup` : "";
    const title = "Try Yookatale – Fresh meals & groceries";
    const text = "Join me on Yookatale for fresh groceries and meal plans delivered to your door.";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url, text });
        chakraToast({ title: "Shared!", status: "success", duration: 2000, isClosable: true });
      } else {
        await navigator.clipboard?.writeText(url);
        chakraToast({ title: "Link copied! Share with friends.", status: "success", duration: 2000, isClosable: true });
      }
    } catch (e) {
      if (e?.name !== "AbortError") {
        try {
          await navigator.clipboard?.writeText(url);
          chakraToast({ title: "Link copied!", status: "success", duration: 2000, isClosable: true });
        } catch {
          chakraToast({ title: "Could not share", status: "error", duration: 3000, isClosable: true });
        }
      }
    }
  };

  // Merge API packages with PLAN_CONFIG (keep original wording; use API price when available)
  const plansForDisplay = subscriptionPackages.map((pkg) => {
    const type = (pkg.type || "").toLowerCase();
    const config = PLAN_CONFIG[type] || {
      id: type,
      name: pkg.name || pkg.type || "Plan",
      tagline: "SUBSCRIBER",
      color: "#1a5c1a",
      colorLight: "#e6f0e6",
      gradient: "linear-gradient(135deg,#0e1e0e,#1a5c1a)",
      ctaGradient: "linear-gradient(135deg,#1a5c1a,#2d8c2d)",
      ctaLabel: `Subscribe to ${pkg.type || "plan"}`,
      popular: false,
      features: Array.isArray(pkg.details) && pkg.details.length > 0
        ? pkg.details
        : ["Benefits included with this plan."],
    };
    const price = pkg.price != null ? Number(pkg.price) : null;
    const previousPrice = pkg.previousPrice != null ? Number(pkg.previousPrice) : null;
    const currentPrice = price != null ? `UGX ${FormatCurr(price)}` : (config.currentPrice || "—");
    const originalPrice = previousPrice != null ? `UGX ${FormatCurr(previousPrice)}` : (config.originalPrice || null);
    const saveAmt = previousPrice != null && price != null ? `SAVE ${FormatCurr(previousPrice - price)}` : (config.saveAmt || null);
    const backendRating = getRatingForType(type);
    return {
      ...config,
      type,
      packageId: pkg._id,
      currentPrice,
      originalPrice,
      saveAmt,
      discount: config.discount || "25% OFF",
      stars: backendRating.stars ?? pkg.rating ?? config.stars ?? 4.5,
      reviews: backendRating.reviews ?? pkg.ratingCount ?? config.reviews ?? 128,
      features: Array.isArray(pkg.details) && pkg.details.length > 0 ? pkg.details : config.features,
    };
  });

  return (
    <>
      <style>{SUB_CSS}</style>
      <Modal isOpen={isTncOpen} onClose={onTncClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody py={6}>
            <SubscriptionTerms handleModalClose={onTncClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="sub-page">
        <div className="promo-bar">
          <div className="promo-left">
            <div className="promo-zap">
              <ZapIcon s={18} />
            </div>
            <div>
              <div className="promo-title">Limited Time Offer</div>
              <div className="promo-sub">Subscribe today and save big!</div>
            </div>
          </div>
          <div className="promo-right">
            <div className="promo-pct">25% OFF</div>
            <div className="promo-pct-sub">On all subscription plans</div>
          </div>
        </div>

        <div className="hero-head">
          <h1>Choose Your Perfect Plan</h1>
          <p>
            Select from our carefully crafted meal plans designed to fit your lifestyle and dietary preferences.
          </p>
        </div>

        {subscriptionPackages.length > 0 ? (
          <div className="plans-grid">
            {plansForDisplay.map((plan, i) => (
              <PlanCard
                key={plan.packageId || plan.id}
                plan={plan}
                delay={i * 80}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onTnc={onTncOpen}
                onInvite={handleInviteShare}
              />
            ))}
          </div>
        ) : (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" color="var(--g)" />
          </Flex>
        )}

        <div className="bottom-note">
          <p>
            <strong>Delivery Terms:</strong> Free delivery within 3km. Extra: <strong>950 UGX/km</strong> beyond 3km.{" "}
            All plans include a <strong>25% limited-time discount</strong>. Cancel anytime. Prices in Ugandan Shillings (UGX).
          </p>
        </div>

        {subscriptionPackages.length > 0 && selectedPlan && (
          <SlideFade in={!!selectedPlan} offsetY="20px">
            <Box mb={{ base: 10, md: 14 }} className="sub-calendar-wrap">
              <MealPlanCalendarNew
                planType={selectedPlan}
                subscriptionPackages={subscriptionPackages}
                onPlanSelect={(id) => {
                  const pkg = subscriptionPackages.find((p) => (p.type || "").toLowerCase() === id);
                  handlePlanSelect(pkg ? pkg.type : id);
                }}
              />
            </Box>
          </SlideFade>
        )}
      </div>
    </>
  );
}
