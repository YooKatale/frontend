"use client";

import { useState } from "react";
import Link from "next/link";
import { useNewsletterPostMutation } from "@slices/usersApiSlice";
import { useToast } from "@chakra-ui/react";
import ReferralModal from "@components/ReferralModal";
import { useDisclosure } from "@chakra-ui/react";

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Svg = ({ children, size = 16, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const ChevRight = ({ s = 12 }) => <Svg size={s}><path d="m9 18 6-6-6-6"/></Svg>;
const PhoneIcon = ({ s = 16 }) => <Svg size={s}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></Svg>;
const MailIcon = ({ s = 16 }) => <Svg size={s}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></Svg>;
const SendIcon = ({ s = 14 }) => <Svg size={s}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Svg>;
const TruckIcon = ({ s = 14 }) => <Svg size={s}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Svg>;
const RefreshIcon = ({ s = 14 }) => <Svg size={s}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Svg>;
const SupportIcon = ({ s = 14 }) => <Svg size={s}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></Svg>;
const ShieldIcon = ({ s = 14 }) => <Svg size={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>;
const SmartphoneIcon = ({ s = 14 }) => <Svg size={s}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></Svg>;
const LocationIcon = ({ s = 14 }) => <Svg size={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Svg>;
const StarIcon = ({ s = 12 }) => <Svg size={s} fill="#f0c020" stroke="#f0c020" sw={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>;

const FbIcon = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const IgIcon = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const TwIcon = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LiIcon = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TkIcon = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.83 1.56V6.79a4.85 4.85 0 0 1-1.06-.1z"/></svg>;
const YtIcon = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1a5c1a"/></svg>;

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.yookataleapp.app&pcampaignid=web_share";
const APP_STORE_URL = "https://apps.apple.com/app/yookatale/id674500123456";
const WHATSAPP_URL = "https://wa.me/256786118137";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100094194942669";
const TWITTER_URL = "https://twitter.com/YooKatale";
const INSTAGRAM_URL = "https://www.instagram.com/p/CuHdaksN5UW/";
const LINKEDIN_URL = "https://www.linkedin.com/company/96071915/admin/feed/posts/";

/* ─── LOGO ───────────────────────────────────────────────────────────────── */
const YooKataleLogo = ({ dark = false }) => (
  <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, userSelect: "none", cursor: "pointer", textDecoration: "none" }}>
    <svg width="42" height="36" viewBox="0 0 44 38" fill="none">
      <path d="M2 2h5l3.5 18h18L32 8H10" stroke={dark ? "#1a5c1a" : "#4cd964"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="34" r="2.5" fill={dark ? "#1a5c1a" : "#4cd964"}/>
      <circle cx="28" cy="34" r="2.5" fill={dark ? "#1a5c1a" : "#4cd964"}/>
      <text x="11" y="22" fontFamily="'Sora',sans-serif" fontWeight="900" fontSize="9" fill="#f0c020" letterSpacing="-0.5">YOO</text>
    </svg>
    <div style={{ lineHeight: 1 }}>
      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 20, color: dark ? "#1a5c1a" : "#ffffff", letterSpacing: "-0.5px" }}>
        YOO<span style={{ color: "#f0c020" }}>KATALE</span>
      </span>
      {!dark && <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 2 }}>Fresh · Fast · Local</div>}
    </div>
  </Link>
);

const features = [
  { icon: <TruckIcon s={18}/>, title: "Fast Delivery", sub: "Same-day delivery across Kampala" },
  { icon: <RefreshIcon s={18}/>, title: "Easy Returns", sub: "30-day hassle-free returns on eligible orders" },
  { icon: <SupportIcon s={18}/>, title: "24/7 Support", sub: "Always here to help via WhatsApp or call" },
  { icon: <ShieldIcon s={18}/>, title: "Quality Guaranteed", sub: "Farm-fresh, inspected before dispatch" },
  { icon: <SmartphoneIcon s={18}/>, title: "Mobile First", sub: "Order, track and pay on the go" },
  { icon: <LocationIcon s={18}/>, title: "Free Delivery within 3km", sub: "Zero delivery fee for nearby orders" },
];

const footerCols = [
  { heading: "Shop", links: [
    { label: "Fresh Produce", href: "/search?q=vegetables" },
    { label: "Groceries", href: "/products" },
    { label: "Premium Selection", href: "/search?q=premium" },
    { label: "Weekly Deals", href: "/search?q=topdeals" },
    { label: "Marketplace", href: "/marketplace" },
  ]},
  { heading: "Services", links: [
    { label: "Subscription Plans", href: "/subscription" },
    { label: "Business / Partner", href: "/partner" },
    { label: "Advertise", href: "/advertising" },
    { label: "Catering", href: "/contact" },
  ]},
  { heading: "Company", links: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/news" },
    { label: "Contact Us", href: "/contact" },
  ]},
  { heading: "Support", links: [
    { label: "FAQs", href: "/faqs" },
    { label: "Track Order", href: "/account" },
    { label: "Returns", href: "/contact" },
    { label: "Contact Us", href: "/contact" },
  ]},
];

const socials = [
  { Icon: FbIcon, label: "Facebook", href: FACEBOOK_URL },
  { Icon: TwIcon, label: "X / Twitter", href: TWITTER_URL },
  { Icon: IgIcon, label: "Instagram", href: INSTAGRAM_URL },
  { Icon: LiIcon, label: "LinkedIn", href: LINKEDIN_URL },
  { Icon: TkIcon, label: "TikTok", href: "https://tiktok.com" },
  { Icon: YtIcon, label: "YouTube", href: "https://youtube.com" },
];

const FOOTER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
.footer-root *, .footer-root *::before, .footer-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.footer-root { --g: #1a5c1a; --gl: #2d8c2d; --gp: #e6f0e6; --orange: #e07820; --gold: #f0c020; --dark: #0e180e; --mid: #445444; --muted: #8a9e87; --surf: #ffffff; --bg: #edf0ea; --f-bg: #0d1a0d; --f-surface: #162316; --f-border: rgba(255,255,255,0.07); --r: 20px; --sh: 0 2px 18px rgba(0,0,0,0.08); --sh2: 0 10px 40px rgba(0,0,0,0.16); font-family: 'Sora', sans-serif; }
.footer-feat-strip { background: var(--dark); padding: 0 16px; overflow-x: auto; scrollbar-width: none; }
.footer-feat-strip::-webkit-scrollbar { display: none; }
.footer-feat-strip-inner { display: flex; align-items: stretch; min-width: max-content; gap: 0; max-width: 1440px; margin: 0 auto; }
@media(min-width:768px) { .footer-feat-strip { padding: 0 24px; } .footer-feat-strip-inner { min-width: unset; } }
.footer-feat-item { display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-right: 1px solid rgba(255,255,255,.07); flex: 1; min-width: 140px; transition: background .18s; cursor: default; }
.footer-feat-item:last-child { border-right: none; }
.footer-feat-item:hover { background: rgba(255,255,255,.04); }
.footer-feat-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #4cd964; }
.footer-feat-text-title { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 2px; white-space: nowrap; }
.footer-feat-text-sub { font-size: 10px; color: rgba(255,255,255,.45); font-weight: 500; white-space: nowrap; max-width: 160px; overflow: hidden; text-overflow: ellipsis; }
.footer-main { background: var(--f-bg); padding: 48px 16px 0; }
@media(min-width:768px) { .footer-main { padding: 56px 24px 0; } }
@media(min-width:1280px) { .footer-main { padding: 64px 32px 0; } }
.footer-inner { max-width: 1440px; margin: 0 auto; }
.footer-grid { display: grid; grid-template-columns: 1fr; gap: 36px 40px; }
@media(min-width:600px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media(min-width:900px) { .footer-grid { grid-template-columns: 1.6fr repeat(4, 1fr); } }
.footer-brand { display: flex; flex-direction: column; gap: 16px; }
.footer-brand-tagline { font-size: 12.5px; color: rgba(255,255,255,.5); line-height: 1.65; font-weight: 500; max-width: 220px; }
.footer-contact-row { display: flex; align-items: center; gap: 10px; font-size: 12px; color: rgba(255,255,255,.7); font-weight: 600; cursor: pointer; transition: color .18s; text-decoration: none; }
.footer-contact-row:hover { color: #4cd964; }
.footer-contact-icon { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,.07); display: flex; align-items: center; justify-content: center; color: #4cd964; flex-shrink: 0; }
.footer-contact-label { font-size: 9px; color: rgba(255,255,255,.35); font-weight: 600; text-transform: uppercase; letter-spacing: .6px; }
.footer-contact-val { font-size: 13px; color: #fff; font-weight: 700; }
.footer-col-heading { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,.45); margin-bottom: 14px; }
.footer-link { display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,.65); font-weight: 500; margin-bottom: 10px; cursor: pointer; transition: color .18s; text-decoration: none; }
.footer-link:hover { color: #fff; }
.footer-link svg { opacity: .5; transition: opacity .18s; }
.footer-link:hover svg { opacity: 1; }
.footer-newsletter { margin-top: 40px; border-top: 1px solid var(--f-border); padding-top: 36px; display: grid; grid-template-columns: 1fr; gap: 28px; align-items: center; }
@media(min-width:768px) { .footer-newsletter { grid-template-columns: 1fr 1fr; gap: 40px; } }
.footer-nl-left-title { font-family: 'DM Serif Display', serif; font-size: clamp(18px, 2.2vw, 24px); color: #fff; margin-bottom: 5px; line-height: 1.2; }
.footer-nl-left-sub { font-size: 12px; color: rgba(255,255,255,.45); font-weight: 500; line-height: 1.5; }
.footer-nl-form { display: flex; background: rgba(255,255,255,.06); border: 1.5px solid rgba(255,255,255,.1); border-radius: 14px; overflow: hidden; transition: border-color .2s; }
.footer-nl-form:focus-within { border-color: #4cd964; }
.footer-nl-input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500; color: #fff; padding: 12px 16px; }
.footer-nl-input::placeholder { color: rgba(255,255,255,.3); }
.footer-nl-submit { background: var(--g); border: none; padding: 0 18px; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; font-family: 'Sora', sans-serif; transition: background .18s; white-space: nowrap; }
.footer-nl-submit:hover { background: var(--gl); }
.footer-nl-success { display: flex; align-items: center; gap: 8px; color: #4cd964; font-size: 13px; font-weight: 700; padding: 12px 0; }
.footer-nl-socials { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.footer-social-btn { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,.55); transition: background .18s, color .18s, transform .15s; text-decoration: none; }
.footer-social-btn:hover { background: rgba(255,255,255,.14); color: #fff; transform: translateY(-2px); }
.footer-app-strip { margin-top: 32px; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: var(--r); padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.footer-app-text-title { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 3px; }
.footer-app-text-sub { font-size: 11.5px; color: rgba(255,255,255,.45); font-weight: 500; }
.footer-app-badges { display: flex; gap: 10px; flex-wrap: wrap; }
.footer-app-badge { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; padding: 8px 16px; cursor: pointer; transition: background .18s, transform .15s; text-decoration: none; }
.footer-app-badge:hover { background: rgba(255,255,255,.14); transform: translateY(-2px); }
.footer-app-badge-label { font-size: 9px; color: rgba(255,255,255,.5); font-weight: 600; text-transform: uppercase; letter-spacing: .6px; }
.footer-app-badge-store { font-size: 13px; font-weight: 800; color: #fff; }
.footer-bottom { margin-top: 32px; border-top: 1px solid var(--f-border); padding: 18px 0 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.footer-bottom-copy { font-size: 11.5px; color: rgba(255,255,255,.35); font-weight: 500; }
.footer-bottom-links { display: flex; gap: 16px; flex-wrap: wrap; }
.footer-bottom-link { font-size: 11.5px; color: rgba(255,255,255,.4); font-weight: 600; cursor: pointer; transition: color .18s; text-decoration: none; }
.footer-bottom-link:hover { color: rgba(255,255,255,.8); }
`;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createNewsletter] = useNewsletterPostMutation();
  const toast = useToast();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email?.trim()) return;
    setIsLoading(true);
    const emailToSend = email.trim();
    try {
      const res = await createNewsletter({ email: emailToSend }).unwrap();
      if (res?.status === "Success") {
        setEmail("");
        setSubscribed(true);
        toast({ title: "Subscribed!", description: "Welcome to the YooKatale family.", status: "success", duration: 4000, position: "bottom-right" });
      }
    } catch (err) {
      toast({ title: "Subscription failed", description: err?.data?.message || "Please try again.", status: "error", duration: 4000, position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="footer-root" id="refer">
      <style dangerouslySetInnerHTML={{ __html: FOOTER_CSS }} />
      <div className="footer-feat-strip">
        <div className="footer-feat-strip-inner">
          {features.map((f, i) => (
            <div className="footer-feat-item" key={i}>
              <div className="footer-feat-icon">{f.icon}</div>
              <div>
                <div className="footer-feat-text-title">{f.title}</div>
                <div className="footer-feat-text-sub">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer-main">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <YooKataleLogo dark={false} />
              <p className="footer-brand-tagline">
                Uganda&apos;s premium fresh produce marketplace. Farm to table, delivered fresh.
              </p>
              <a href="tel:+256786118137" className="footer-contact-row">
                <div className="footer-contact-icon"><PhoneIcon s={13}/></div>
                <div>
                  <div className="footer-contact-label">Call us 24/7</div>
                  <div className="footer-contact-val">+256 786 118137</div>
                </div>
              </a>
              <a href="mailto:info@yookatale.app" className="footer-contact-row">
                <div className="footer-contact-icon"><MailIcon s={13}/></div>
                <div>
                  <div className="footer-contact-label">Email support</div>
                  <div className="footer-contact-val">info@yookatale.app</div>
                </div>
              </a>
            </div>

            {footerCols.map((col) => (
              <div key={col.heading}>
                <div className="footer-col-heading">{col.heading}</div>
                {col.links.map((link) => (
                  <Link key={link.label} href={link.href} className="footer-link">
                    <ChevRight s={10} />{link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="footer-newsletter">
            <div>
              <div className="footer-nl-left-title">Stay in the Loop</div>
              <div className="footer-nl-left-sub">
                Get exclusive deals, recipe tips and farm stories delivered weekly.
              </div>
              <div className="footer-nl-socials">
                {socials.map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title={label}>
                    <Icon s={16} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              {subscribed ? (
                <div className="footer-nl-success">
                  <StarIcon s={16}/> You&apos;re subscribed! Welcome to the YooKatale family.
                </div>
              ) : (
                <form className="footer-nl-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    className="footer-nl-input"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="footer-nl-submit" disabled={isLoading}>
                    <SendIcon s={13}/> {isLoading ? "Subscribing…" : "Subscribe"}
                  </button>
                </form>
              )}
              <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,.3)", fontWeight: 500 }}>
                No spam, ever. Unsubscribe anytime.
              </div>
            </div>
          </div>

          <div className="footer-app-strip">
            <div>
              <div className="footer-app-text-title">Get the YooKatale App</div>
              <div className="footer-app-text-sub">Shop faster, track orders, and get exclusive mobile-only deals.</div>
            </div>
            <div className="footer-app-badges">
              <a className="footer-app-badge" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                <span className="gplay-icon" style={{ fontSize: 22 }}>▶</span>
                <div>
                  <div className="footer-app-badge-label">Get it on</div>
                  <div className="footer-app-badge-store">Google Play</div>
                </div>
              </a>
              <a className="footer-app-badge" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,.7)"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div className="footer-app-badge-label">Download on the</div>
                  <div className="footer-app-badge-store">App Store</div>
                </div>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-copy">© {new Date().getFullYear()} YooKatale. All rights reserved.</div>
            <div className="footer-bottom-links">
              <Link href="/privacy" className="footer-bottom-link">Privacy Policy</Link>
              <Link href="/usage" className="footer-bottom-link">Usage Policy</Link>
              <Link href="/faqs" className="footer-bottom-link">FAQs</Link>
              <Link href="/terms" className="footer-bottom-link">Terms of Service</Link>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--f-border)" }}>
            <button type="button" onClick={openReferral} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,.14)", borderRadius: 12, padding: "11px 16px", fontSize: "12.5px", fontWeight: 800, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              <StarIcon s={14}/> Invite a Friend & Earn
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 7, background: "#25d366", color: "#fff", border: "none", borderRadius: 12, padding: "11px 16px", fontSize: "12.5px", fontWeight: 800, textDecoration: "none", fontFamily: "'Sora',sans-serif" }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </footer>

      <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />
    </div>
  );
}
