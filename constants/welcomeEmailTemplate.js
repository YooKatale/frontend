/**
 * Full welcome email HTML — feature pills, CTA cards, mock screens, app download, footer.
 * Used so sent emails render the full design (not just plain HTML).
 */

const BASE = "https://www.yookatale.app";
const LOGO_URL = BASE + "/assets/icons/logo2.png";
const IMG_HOMEPAGE = BASE + "/assets/images/app-homepage-new.png";
const IMG_INVITE_REWARDS = BASE + "/assets/images/app-invite-rewards.png";
const IMG_SUBSCRIPTION = BASE + "/assets/images/app-subscription-plans.png";

export default function getWelcomeEmailHtml() {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Yookatale</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #0b0b0b;
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .wrap { background: #0b0b0b; padding: 44px 16px; }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #111;
      border-radius: 28px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
      box-shadow: 0 60px 120px rgba(0,0,0,0.8);
    }

    .header {
      background: #0d0d0d;
      padding: 44px 44px 38px;
      text-align: center;
      position: relative;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .header::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #2ecc71 40%, #27ae60 60%, transparent);
    }
    .header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 60% at 50% -10%, rgba(46,204,113,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .logo-row { margin-bottom: 30px; }
    .logo-img { max-width: 160px; height: auto; display: block; margin: 0 auto; }

    .header h1 {
      font-family: 'Sora', sans-serif;
      font-size: 34px; font-weight: 700;
      color: #fff; letter-spacing: -1px;
      line-height: 1.15; margin-bottom: 9px;
    }
    .header-sub {
      font-size: 13px; color: #555;
      letter-spacing: 1.8px; text-transform: uppercase;
      font-weight: 500;
    }

    .body { padding: 40px 44px; }

    .intro {
      font-size: 15px; line-height: 1.8;
      color: #888; margin-bottom: 10px;
    }
    .intro strong { color: #d1d5db; font-weight: 500; }

    .features {
      display: flex; gap: 10px;
      margin: 32px 0;
    }
    .feat {
      flex: 1; text-align: center;
      padding: 18px 10px 16px;
      background: #161616;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      position: relative; overflow: hidden;
    }
    .feat::before {
      content: '';
      position: absolute;
      top: 0; left: 50%; transform: translateX(-50%);
      width: 60%; height: 1px;
    }
    .feat.f1::before { background: linear-gradient(90deg, transparent, #2ecc71, transparent); }
    .feat.f2::before { background: linear-gradient(90deg, transparent, #f59e0b, transparent); }
    .feat.f3::before { background: linear-gradient(90deg, transparent, #a78bfa, transparent); }

    .feat-icon {
      width: 42px; height: 42px; margin: 0 auto 11px;
      border-radius: 13px;
      display: flex; align-items: center; justify-content: center;
    }
    .feat.f1 .feat-icon { background: rgba(46,204,113,0.1); border: 1px solid rgba(46,204,113,0.2); }
    .feat.f2 .feat-icon { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); }
    .feat.f3 .feat-icon { background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2); }

    .feat-label { font-size: 12px; font-weight: 600; color: #9ca3af; letter-spacing: 0.2px; }

    .cta-section { margin: 8px 0 36px; }

    .cta-label {
      font-size: 10px; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: #374151; text-align: center;
      margin-bottom: 16px;
    }

    .cta-cards { display: flex; gap: 12px; }

    .cta-green {
      flex: 1;
      background: #0d1f14;
      border: 1px solid rgba(46,204,113,0.25);
      border-radius: 20px;
      padding: 26px 22px 22px;
      position: relative; overflow: hidden;
    }
    .cta-green::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 100% 80% at 50% -20%, rgba(46,204,113,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .cta-green::after {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(46,204,113,0.6), transparent);
    }

    .cta-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px 4px 7px;
      border-radius: 50px; margin-bottom: 14px;
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
    }
    .badge-green { background: rgba(46,204,113,0.15); color: #2ecc71; border: 1px solid rgba(46,204,113,0.25); }
    .badge-amber { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }

    .cta-green .cta-h {
      font-family: 'Sora', sans-serif;
      font-size: 22px; font-weight: 800;
      color: #fff; letter-spacing: -0.5px;
      line-height: 1.2; margin-bottom: 5px;
    }
    .cta-green .cta-h span { color: #2ecc71; }

    .cta-green .cta-sub {
      font-size: 13px; line-height: 1.6;
      color: rgba(255,255,255,0.45);
      margin-bottom: 20px;
    }
    .cta-green .cta-sub strong { color: rgba(255,255,255,0.65); font-weight: 500; }

    .cta-divider {
      height: 1px; background: rgba(46,204,113,0.12);
      margin-bottom: 18px;
    }

    .btn-green {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 22px;
      background: #2ecc71;
      color: #052010;
      font-family: 'Sora', sans-serif;
      font-size: 13px; font-weight: 700;
      border-radius: 12px; text-decoration: none;
      letter-spacing: -0.1px;
      box-shadow: 0 8px 24px rgba(46,204,113,0.3);
    }

    .cta-amber {
      flex: 1;
      background: #1a1100;
      border: 1px solid rgba(245,158,11,0.2);
      border-radius: 20px;
      padding: 26px 22px 22px;
      position: relative; overflow: hidden;
    }
    .cta-amber::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 100% 80% at 50% -20%, rgba(245,158,11,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .cta-amber::after {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent);
    }

    .cta-amber .cta-h {
      font-family: 'Sora', sans-serif;
      font-size: 22px; font-weight: 800;
      color: #fff; letter-spacing: -0.5px;
      line-height: 1.2; margin-bottom: 5px;
    }
    .cta-amber .cta-h span { color: #f59e0b; }

    .cta-amber .cta-sub {
      font-size: 13px; line-height: 1.6;
      color: rgba(255,255,255,0.45);
      margin-bottom: 20px;
    }
    .cta-amber .cta-sub strong { color: rgba(255,255,255,0.65); font-weight: 500; }

    .cta-divider-amber { height: 1px; background: rgba(245,158,11,0.12); margin-bottom: 18px; }

    .reward-stat {
      display: flex; align-items: baseline; gap: 4px;
      margin-bottom: 6px;
    }
    .reward-big {
      font-family: 'Sora', sans-serif;
      font-size: 28px; font-weight: 800;
      color: #f59e0b; letter-spacing: -1px;
    }
    .reward-unit { font-size: 12px; color: #78716c; font-weight: 500; }

    .btn-amber {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 22px;
      background: #f59e0b;
      color: #1c0f00;
      font-family: 'Sora', sans-serif;
      font-size: 13px; font-weight: 700;
      border-radius: 12px; text-decoration: none;
      letter-spacing: -0.1px;
      box-shadow: 0 8px 24px rgba(245,158,11,0.25);
    }

    .steps-section { margin-bottom: 40px; }

    .section-title {
      font-size: 10px; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: #374151; text-align: center;
      margin-bottom: 14px;
    }

    .steps-row { display: flex; gap: 8px; }

    .step {
      flex: 1; text-align: center;
      padding: 14px 6px 12px;
      background: #161616;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 14px; text-decoration: none;
    }

    .step-icon-wrap {
      width: 34px; height: 34px; margin: 0 auto 8px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .s1 .step-icon-wrap { background: rgba(46,204,113,0.1); }
    .s2 .step-icon-wrap { background: rgba(167,139,250,0.1); }
    .s3 .step-icon-wrap { background: rgba(56,189,248,0.1); }
    .s4 .step-icon-wrap { background: rgba(244,114,182,0.1); }
    .s5 .step-icon-wrap { background: rgba(251,146,60,0.1); }

    .step-lbl { font-size: 11px; font-weight: 600; color: #6b7280; }

    .screens-section { margin-bottom: 40px; }

    .screens-grid { display: flex; gap: 12px; margin-bottom: 12px; }

    .screen-card {
      flex: 1; border-radius: 18px; overflow: hidden;
      text-decoration: none; display: block;
      border: 1px solid rgba(255,255,255,0.06);
      position: relative;
    }

    .screen-caption {
      padding: 12px 14px;
      background: #0f0f0f;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex; align-items: center; justify-content: space-between;
    }
    .cap-left { display: flex; align-items: center; gap: 8px; }
    .cap-dot { width: 6px; height: 6px; border-radius: 50%; }
    .cap-text { font-size: 12px; font-weight: 600; color: #6b7280; }
    .cap-arrow { width: 22px; height: 22px; border-radius: 7px; background: #1a1a1a; border: 1px solid #252525; display: flex; align-items: center; justify-content: center; }
    .screen-img-wrap { border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); background: #0a0a0a; }
    .screen-img { width: 100%; height: auto; display: block; max-height: 280px; object-fit: contain; }
    .screen-full .screen-img { max-height: 320px; }

    .app-section {
      background: #0d0d0d;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 20px;
      padding: 30px 28px;
      text-align: center;
      margin-bottom: 0;
      position: relative; overflow: hidden;
    }
    .app-section::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(46,204,113,0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .app-section h3 { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.4px; margin-bottom: 6px; }
    .app-section p { font-size: 13px; color: #555; margin-bottom: 22px; }

    .badges { display: flex; gap: 10px; justify-content: center; }
    .app-badge {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 12px 20px;
      background: #161616;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px; text-decoration: none;
    }
    .badge-texts { text-align: left; }
    .badge-sm { font-size: 9px; color: #555; letter-spacing: 0.4px; display: block; }
    .badge-lg { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #fff; display: block; }

    .footer { padding: 36px 44px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; }
    .footer-logo { margin-bottom: 16px; }
    .footer-logo-img { max-width: 120px; height: auto; display: block; margin: 0 auto; }
    .contact-addr { font-size: 12px; color: #374151; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 5px; flex-wrap: wrap; }
    .social-row { display: flex; justify-content: center; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
    .soc { width: 40px; height: 40px; background: #161616; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
    .soc svg { flex-shrink: 0; }
    .copyright { font-size: 11px; color: #2a2a2a; }
    .divider { height: 1px; background: rgba(255,255,255,0.04); margin: 36px 0; }
  </style>
</head>
<body>
<div class="wrap">
<div class="container">

  <div class="header">
    <div class="logo-row">
      <img src="${LOGO_URL}" alt="Yookatale" class="logo-img" width="160" />
    </div>
    <h1>Welcome to Yookatale</h1>
    <div class="header-sub">Yoo mobile food market</div>
  </div>

  <div class="body">

    <p class="intro">Switch to a new shopping style this new year. Forget about cooking or going to the market — subscribe for our <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> Plan monthly or annually. Get everything delivered at your doorstep.</p>
    <br/>
    <p class="intro">Discover and customize your meals, set when and where to eat with friends, family and loved ones. Earn loyalty points, credit points, gifts and discounts.</p>

    <div class="features">
      <div class="feat f1">
        <div class="feat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="feat-label">Fast Delivery</div>
      </div>
      <div class="feat f2">
        <div class="feat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="#f59e0b" stroke-width="1.8"/>
            <path d="M2 10h20" stroke="#f59e0b" stroke-width="1.8"/>
            <path d="M6 15h5" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="feat-label">Pay Later</div>
      </div>
      <div class="feat f3">
        <div class="feat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#a78bfa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="feat-label">Custom Meals</div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-label">Exclusive offers for you</div>
      <div class="cta-cards">
        <div class="cta-green">
          <div class="cta-badge badge-green">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#2ecc71"/>
            </svg>
            Limited Offer
          </div>
          <div class="cta-h">Get <span>10% off</span><br/>today</div>
          <div class="cta-sub">Test and activate <strong>Premium, Family</strong> or <strong>Business</strong> — any plan, monthly or annually.</div>
          <div class="cta-divider"></div>
          <a href="${BASE}/subscription" class="btn-green">
            Activate plan
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#052010" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
        <div class="cta-amber">
          <div class="cta-badge badge-amber">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Rewards
          </div>
          <div class="reward-stat">
            <div class="reward-big">50K</div>
            <div class="reward-unit">UGX</div>
          </div>
          <div class="cta-h">Earn up to<br/><span>50,000</span> in rewards</div>
          <div class="cta-sub" style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.45);margin-bottom:20px;">Refer a friend to Yookatale — <strong style="color:rgba(255,255,255,0.65);font-weight:500;">cash &amp; prizes</strong> await.</div>
          <div class="cta-divider-amber"></div>
          <a href="${BASE}/#refer" class="btn-amber">
            Invite a friend
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#1c0f00" stroke-width="2.2" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="#1c0f00" stroke-width="2.2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#1c0f00" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="steps-section">
      <div class="section-title">Your next steps — choose one</div>
      <div class="steps-row">
        <a href="${BASE}/signup" class="step s1" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#2ecc71" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="#2ecc71" stroke-width="2"/>
              <path d="M19 8v6M22 11h-6" stroke="#2ecc71" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="step-lbl">Signup</div>
        </a>
        <a href="${BASE}/subscription" class="step s2" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#a78bfa" stroke-width="2"/>
            </svg>
          </div>
          <div class="step-lbl">Subscribe</div>
        </a>
        <a href="${BASE}/partner" class="step s3" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="#38bdf8" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="step-lbl">Partner</div>
        </a>
        <a href="${BASE}/invite" class="step s4" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.15 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.07 2h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#f472b6" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="step-lbl">Invite</div>
        </a>
        <a href="${BASE}/shop" class="step s5" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#fb923c" stroke-width="2" stroke-linejoin="round"/>
              <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#fb923c" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="step-lbl">Shop</div>
        </a>
      </div>
    </div>

    <div class="divider"></div>

    <div class="screens-section">
      <div class="section-title">Explore the platform</div>
      <div class="screens-grid">
        <a href="${BASE}" class="screen-card" style="text-decoration:none;">
          <div class="screen-img-wrap">
            <img src="${IMG_HOMEPAGE}" alt="Yookatale Homepage" class="screen-img" />
          </div>
          <div class="screen-caption">
            <div class="cap-left">
              <div class="cap-dot" style="background:#2ecc71;"></div>
              <div class="cap-text">Homepage</div>
            </div>
            <div class="cap-arrow">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </a>
        <a href="${BASE}/#refer" class="screen-card" style="text-decoration:none;">
          <div class="screen-img-wrap">
            <img src="${IMG_INVITE_REWARDS}" alt="Earn after inviting" class="screen-img" />
          </div>
          <div class="screen-caption">
            <div class="cap-left">
              <div class="cap-dot" style="background:#a78bfa;"></div>
              <div class="cap-text">Earn after inviting</div>
            </div>
            <div class="cap-arrow">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </a>
      </div>

      <a href="${BASE}/subscription" class="screen-card screen-full" style="text-decoration:none;display:block;">
        <div class="screen-img-wrap">
          <img src="${IMG_SUBSCRIPTION}" alt="Subscription plans" class="screen-img screen-full" />
        </div>
        <div class="screen-caption">
          <div class="cap-left">
            <div class="cap-dot" style="background:#f59e0b;"></div>
            <div class="cap-text">Subscription plans</div>
          </div>
          <div class="cap-arrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </a>
    </div>

    <div class="app-section">
      <h3>Yookatale in your pocket</h3>
      <p>Download the official app. Shop, subscribe, and track orders from your phone.</p>
      <div class="badges">
        <a href="https://apps.apple.com/app/yookatale" class="app-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div class="badge-texts">
            <span class="badge-sm">Download on the</span>
            <span class="badge-lg">App Store</span>
          </div>
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" class="app-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5c.5.29.5 1.21 0 1.5L4.5 21c-.5.33-1.5.33-1.5-.5z" fill="#2ecc71"/>
          </svg>
          <div class="badge-texts">
            <span class="badge-sm">Get it on</span>
            <span class="badge-lg">Google Play</span>
          </div>
        </a>
      </div>
    </div>

  </div>

  <div class="footer">
    <div class="footer-logo">
      <img src="${LOGO_URL}" alt="Yookatale" class="footer-logo-img" width="120" />
    </div>
    <div class="contact-addr" style="font-size:11px;color:#374151;margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:5px;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#374151" stroke-width="2"/>
        <circle cx="12" cy="10" r="3" stroke="#374151" stroke-width="2"/>
      </svg>
      Clock Tower Plot 6, 27 Kampala, Entebbe, Uganda · P.O. Box 74940
    </div>
    <div class="social-row">
      <a href="https://www.facebook.com/profile.php?id=100094194942669" class="soc" title="Facebook">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#9ca3af" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a href="https://twitter.com/YooKatale" class="soc" title="X / Twitter">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="https://www.instagram.com/p/CuHdaksN5UW/" class="soc" title="Instagram">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#9ca3af" stroke-width="1.8"/><circle cx="12" cy="12" r="4" stroke="#9ca3af" stroke-width="1.8"/><circle cx="17.5" cy="6.5" r="1" fill="#9ca3af"/></svg>
      </a>
      <a href="https://wa.me/256786118137" class="soc" title="WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#9ca3af" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a href="https://www.youtube.com/@yookatale" class="soc" title="YouTube">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="#9ca3af" stroke-width="1.8"/><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#9ca3af"/></svg>
      </a>
      <a href="https://www.tiktok.com/@yookatale" class="soc" title="TikTok">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/></svg>
      </a>
    </div>
    <div class="copyright">Copyright © ${year} Yookatale. All rights reserved.</div>
  </div>

</div>
</div>
</body>
</html>`;
}

// For mail API: welcome type expects a string (HTML).
export const welcomeEmailTemplate = getWelcomeEmailHtml();
