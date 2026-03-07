/**
 * Subscription / Welcome email – same design as backend (dark UI, Sora/DM Sans, no external images).
 * Used when admin sends subscription emails via frontend /api/mail (type: 'subscription').
 * Synced from yookatale-server/constants/welcomeEmailTemplate.js
 */

export const subscriptionEmailTemplate = `
<!DOCTYPE html>
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

    /* ─── HEADER ─── */
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

    .logo-row {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      margin-bottom: 30px;
    }
    .logo-mark {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #1a4731, #27ae60);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(46,204,113,0.25);
    }
    .logo-name {
      font-family: 'Sora', sans-serif;
      font-size: 22px; font-weight: 800;
      letter-spacing: -0.6px;
      color: #fff;
    }
    .logo-name span { color: #2ecc71; }

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

    /* ─── BODY ─── */
    .body { padding: 40px 44px; }

    .intro {
      font-size: 15px; line-height: 1.8;
      color: #888; margin-bottom: 10px;
    }
    .intro strong { color: #d1d5db; font-weight: 500; }

    /* ─── FEATURE PILLS ─── */
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

    /* ─── CTA SECTION ─── */
    .cta-section { margin: 8px 0 36px; }

    .cta-label {
      font-size: 10px; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: #374151; text-align: center;
      margin-bottom: 16px;
    }

    .cta-cards { display: flex; gap: 12px; }

    /* Green card */
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

    /* Amber card */
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

    /* ─── NEXT STEPS ─── */
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

    /* ─── SCREENSHOT CARDS ─── */
    .screens-section { margin-bottom: 40px; }

    .screens-grid { display: flex; gap: 12px; margin-bottom: 12px; }

    .screen-card {
      flex: 1; border-radius: 18px; overflow: hidden;
      text-decoration: none; display: block;
      border: 1px solid rgba(255,255,255,0.06);
      position: relative;
    }

    /* Simulated screenshot — full-bleed realistic mockup */
    .screen-inner {
      width: 100%; aspect-ratio: 4/3;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column;
    }

    /* ── Homepage mockup ── */
    .mock-home {
      background: #f9fafb;
    }
    .mock-home .nav-bar {
      background: #fff; padding: 8px 12px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid #e5e7eb;
    }
    .mock-home .nav-logo {
      font-family: 'Sora', sans-serif; font-size: 9px; font-weight: 800;
      color: #1a4731;
    }
    .mock-home .nav-logo span { color: #2ecc71; }
    .mock-home .nav-cart {
      width: 18px; height: 18px; background: #2ecc71;
      border-radius: 5px; display: flex; align-items: center; justify-content: center;
    }
    .mock-home .hero {
      background: linear-gradient(135deg, #1a4731 0%, #0d2b1f 100%);
      padding: 14px 12px 12px; flex: 1;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .mock-home .hero-tag {
      display: inline-block; background: rgba(46,204,113,0.2);
      color: #2ecc71; font-size: 7px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      padding: 3px 7px; border-radius: 20px; margin-bottom: 6px;
    }
    .mock-home .hero-h {
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 800;
      color: #fff; line-height: 1.25; margin-bottom: 8px;
    }
    .mock-home .hero-sub { font-size: 7px; color: rgba(255,255,255,0.5); margin-bottom: 10px; }
    .mock-home .hero-btn {
      display: inline-block; background: #2ecc71;
      color: #052010; font-size: 7px; font-weight: 700;
      padding: 5px 10px; border-radius: 6px;
    }
    .mock-home .cats {
      background: #fff; padding: 8px 10px;
      display: flex; gap: 6px;
    }
    .cat-pill {
      flex: 1; height: 22px; border-radius: 5px;
      background: #f3f4f6; border: 1px solid #e5e7eb;
    }
    .cat-pill.active { background: #dcfce7; border-color: #86efac; }

    /* ── Cashout/Earn mockup ── */
    .mock-earn {
      background: #0f0f0f;
    }
    .mock-earn .earn-nav {
      background: #111; padding: 8px 12px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid #1e1e1e;
    }
    .earn-nav-logo {
      font-family: 'Sora', sans-serif; font-size: 9px; font-weight: 800; color: #fff;
    }
    .earn-nav-logo span { color: #2ecc71; }
    .mock-earn .earn-body { padding: 10px 12px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .earn-card {
      background: #161616; border: 1px solid #1e1e1e;
      border-radius: 10px; padding: 10px 12px;
    }
    .earn-card-header {
      display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
    }
    .earn-dot { width: 8px; height: 8px; border-radius: 3px; background: #2ecc71; flex-shrink: 0; }
    .earn-title { font-family: 'Sora', sans-serif; font-size: 9px; font-weight: 700; color: #fff; }
    .earn-stats { display: flex; gap: 8px; }
    .earn-stat { flex: 1; }
    .earn-stat-val { font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 800; color: #2ecc71; }
    .earn-stat-lbl { font-size: 7px; color: #6b7280; margin-top: 1px; }
    .earn-bar { height: 4px; background: #1e1e1e; border-radius: 2px; overflow: hidden; margin-top: 8px; }
    .earn-bar-fill { height: 100%; width: 65%; background: linear-gradient(90deg, #2ecc71, #27ae60); border-radius: 2px; }

    /* ── Subscription full-width mockup ── */
    .mock-subs {
      background: #0a0a0a;
    }
    .mock-subs .subs-nav {
      background: #0d0d0d; padding: 8px 12px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .subs-nav-logo { font-family: 'Sora', sans-serif; font-size: 9px; font-weight: 800; color: #fff; }
    .subs-nav-logo span { color: #2ecc71; }
    .mock-subs .subs-body { padding: 10px 10px 10px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .subs-heading {
      font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 700; color: #fff;
      text-align: center; margin-bottom: 4px; letter-spacing: -0.2px;
    }
    .subs-cards { display: flex; gap: 6px; flex: 1; }
    .sub-card {
      flex: 1; border-radius: 9px; padding: 8px 7px;
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .sub-card.premium { background: #1e1b2e; border: 1px solid #4c1d95; }
    .sub-card.family { background: #0d1f14; border: 1px solid #166534; }
    .sub-card.business { background: #1c1410; border: 1px solid #92400e; }
    .sub-card-badge {
      position: absolute; top: 5px; right: 5px;
      font-size: 6px; font-weight: 700; letter-spacing: 0.5px;
      padding: 2px 5px; border-radius: 4px;
      text-transform: uppercase;
    }
    .family .sub-card-badge { background: rgba(46,204,113,0.2); color: #2ecc71; }
    .business .sub-card-badge { background: rgba(245,158,11,0.2); color: #f59e0b; }
    .sub-plan-name { font-size: 7px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 4px; }
    .premium .sub-plan-name { color: #c4b5fd; }
    .family .sub-plan-name { color: #86efac; }
    .business .sub-plan-name { color: #fcd34d; }
    .sub-price { font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 800; color: #fff; letter-spacing: -0.3px; margin-bottom: 1px; }
    .sub-period { font-size: 6px; color: #6b7280; margin-bottom: 6px; }
    .sub-features { display: flex; flex-direction: column; gap: 2px; }
    .sub-feat { font-size: 6px; color: #9ca3af; display: flex; align-items: center; gap: 3px; }
    .sub-feat::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: #374151; flex-shrink: 0; }
    .premium .sub-feat::before { background: #7c3aed; }
    .family .sub-feat::before { background: #16a34a; }
    .business .sub-feat::before { background: #b45309; }
    .sub-btn {
      display: block; text-align: center;
      font-size: 6px; font-weight: 700;
      padding: 4px 0; border-radius: 5px; margin-top: 7px;
    }
    .premium .sub-btn { background: rgba(124,58,237,0.3); color: #c4b5fd; }
    .family .sub-btn { background: rgba(46,204,113,0.25); color: #2ecc71; }
    .business .sub-btn { background: rgba(180,83,9,0.3); color: #fcd34d; }

    .screen-caption {
      padding: 12px 14px;
      background: #0f0f0f;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex; align-items: center; justify-content: space-between;
    }
    .cap-left { display: flex; align-items: center; gap: 8px; }
    .cap-dot { width: 6px; height: 6px; border-radius: 50%; }
    .cap-text { font-size: 12px; font-weight: 600; color: #6b7280; }
    .cap-arrow {
      width: 22px; height: 22px; border-radius: 7px;
      background: #1a1a1a; border: 1px solid #252525;
      display: flex; align-items: center; justify-content: center;
    }

    .screen-full .screen-inner { aspect-ratio: 16/7; }

    /* ─── APP DOWNLOAD ─── */
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
    .app-section h3 {
      font-family: 'Sora', sans-serif;
      font-size: 18px; font-weight: 700; color: #fff;
      letter-spacing: -0.4px; margin-bottom: 6px;
    }
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

    /* ─── FOOTER ─── */
    .footer {
      padding: 36px 44px 32px;
      border-top: 1px solid rgba(255,255,255,0.05);
      text-align: center;
    }
    .footer-logo {
      display: inline-flex; align-items: center; gap: 9px;
      margin-bottom: 16px;
    }
    .footer-logo-mark {
      width: 30px; height: 30px;
      background: #0d1f14;
      border: 1px solid rgba(46,204,113,0.2);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .footer-logo-name {
      font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 800;
      color: #fff; letter-spacing: -0.3px;
    }
    .footer-logo-name span { color: #2ecc71; }

    .contact-addr {
      font-size: 12px; color: #374151; margin-bottom: 20px;
      display: flex; align-items: center; justify-content: center; gap: 5px;
    }

    .social-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; }

    .soc {
      width: 36px; height: 36px;
      background: #161616;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px;
      display: inline-flex; align-items: center; justify-content: center;
      text-decoration: none;
    }

    .copyright { font-size: 11px; color: #2a2a2a; }

    /* Divider */
    .divider {
      height: 1px; background: rgba(255,255,255,0.04);
      margin: 36px 0;
    }
  </style>
</head>
<body>
<div class="wrap">
<div class="container">

  <!-- ══ HEADER ══ -->
  <div class="header">
    <div class="logo-row">
      <div class="logo-mark">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#2ecc71" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="logo-name">YOO<span>KATALE</span></div>
    </div>
    <h1>Welcome to Yookatale</h1>
    <div class="header-sub">Yoo mobile food market</div>
  </div>

  <!-- ══ BODY ══ -->
  <div class="body">

    <p class="intro">Switch to a new shopping style this new year. Forget about cooking or going to the market — subscribe for our <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> Plan monthly or annually. Get everything delivered at your doorstep.</p>
    <br/>
    <p class="intro">Discover and customize your meals, set when and where to eat with friends, family and loved ones. Earn loyalty points, credit points, gifts and discounts.</p>

    <!-- ── FEATURES ── -->
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

    <!-- ── CTA CARDS ── -->
    <div class="cta-section">
      <div class="cta-label">Exclusive offers for you</div>
      <div class="cta-cards">

        <!-- GREEN -->
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
          <a href="https://www.yookatale.app/subscription" class="btn-green">
            Activate plan
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#052010" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>

        <!-- AMBER -->
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
          <div class="cta-sub">Refer a friend to Yookatale — <strong>cash &amp; prizes</strong> await.</div>
          <div class="cta-divider-amber"></div>
          <a href="https://www.yookatale.app" class="btn-amber">
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

    <!-- ── NEXT STEPS ── -->
    <div class="steps-section">
      <div class="section-title">Your next steps — choose one</div>
      <div class="steps-row">
        <a href="https://www.yookatale.app/signup" class="step s1" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#2ecc71" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="#2ecc71" stroke-width="2"/>
              <path d="M19 8v6M22 11h-6" stroke="#2ecc71" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="step-lbl">Signup</div>
        </a>
        <a href="https://www.yookatale.app/subscription" class="step s2" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#a78bfa" stroke-width="2"/>
            </svg>
          </div>
          <div class="step-lbl">Subscribe</div>
        </a>
        <a href="https://www.yookatale.app/partner" class="step s3" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="#38bdf8" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="step-lbl">Partner</div>
        </a>
        <a href="https://www.yookatale.app/invite" class="step s4" style="text-decoration:none;">
          <div class="step-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.15 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.07 2h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#f472b6" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="step-lbl">Invite</div>
        </a>
        <a href="https://www.yookatale.app/shop" class="step s5" style="text-decoration:none;">
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

    <!-- ── SCREENSHOT CARDS ── -->
    <div class="screens-section">
      <div class="section-title">Explore the platform</div>

      <!-- Row 1: Homepage + Earn -->
      <div class="screens-grid">

        <!-- Homepage -->
        <a href="https://www.yookatale.app" class="screen-card" style="text-decoration:none;">
          <div class="screen-inner mock-home">
            <div class="nav-bar">
              <div class="nav-logo">YOO<span>KATALE</span></div>
              <div style="display:flex;align-items:center;gap:5px;">
                <div style="width:44px;height:8px;background:#f3f4f6;border-radius:3px;"></div>
                <div class="nav-cart">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#fff" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="hero">
              <div>
                <div class="hero-tag">🍽 Fresh Today</div>
                <div class="hero-h">Eat Better.<br/>Save Time.<br/>Save Money.</div>
                <div class="hero-sub">Fresh groceries & meals delivered</div>
                <div class="hero-btn">Shop Now →</div>
              </div>
            </div>
            <div class="cats">
              <div class="cat-pill active"></div>
              <div class="cat-pill"></div>
              <div class="cat-pill"></div>
              <div class="cat-pill"></div>
              <div class="cat-pill"></div>
            </div>
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

        <!-- Earn after inviting -->
        <a href="https://www.yookatale.app/cashout" class="screen-card" style="text-decoration:none;">
          <div class="screen-inner mock-earn">
            <div class="earn-nav">
              <div class="earn-nav-logo">YOO<span>KATALE</span></div>
              <div style="display:flex;gap:4px;">
                <div style="width:12px;height:12px;background:#1e1e1e;border-radius:4px;"></div>
                <div style="width:12px;height:12px;background:#1e1e1e;border-radius:4px;"></div>
              </div>
            </div>
            <div class="earn-body">
              <div class="earn-card">
                <div class="earn-card-header">
                  <div class="earn-dot"></div>
                  <div class="earn-title">Cashout &amp; Rewards</div>
                </div>
                <div class="earn-stats">
                  <div class="earn-stat">
                    <div class="earn-stat-val">UGX 78K</div>
                    <div class="earn-stat-lbl">Total Earned</div>
                  </div>
                  <div class="earn-stat">
                    <div class="earn-stat-val" style="color:#a78bfa;">8</div>
                    <div class="earn-stat-lbl">Referrals</div>
                  </div>
                  <div class="earn-stat">
                    <div class="earn-stat-val" style="color:#f59e0b;">700</div>
                    <div class="earn-stat-lbl">Points</div>
                  </div>
                </div>
                <div class="earn-bar"><div class="earn-bar-fill"></div></div>
              </div>
              <div class="earn-card" style="background:rgba(46,204,113,0.08);border-color:rgba(46,204,113,0.2);">
                <div style="font-size:7px;color:#6b7280;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.5px;">Redeem</div>
                <div style="display:flex;gap:4px;align-items:center;">
                  <div style="flex:1;height:14px;background:rgba(46,204,113,0.15);border-radius:4px;"></div>
                  <div style="width:28px;height:14px;background:#2ecc71;border-radius:4px;"></div>
                </div>
              </div>
              <div class="earn-card">
                <div style="font-size:7px;color:#6b7280;margin-bottom:3px;">🎁 Gift Cards</div>
                <div style="display:flex;gap:3px;">
                  <div style="flex:1;height:10px;background:#1e1e1e;border-radius:3px;"></div>
                  <div style="flex:1;height:10px;background:#1e1e1e;border-radius:3px;"></div>
                </div>
              </div>
            </div>
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

      <!-- Row 2: Subscription Plans — full width -->
      <a href="https://www.yookatale.app/subscription" class="screen-card screen-full" style="text-decoration:none;display:block;">
        <div class="screen-inner mock-subs">
          <div class="subs-nav">
            <div class="subs-nav-logo">YOO<span>KATALE</span></div>
            <div style="display:flex;gap:12px;">
              <div style="width:24px;height:6px;background:#1a1a1a;border-radius:2px;"></div>
              <div style="width:24px;height:6px;background:#1a1a1a;border-radius:2px;"></div>
              <div style="width:24px;height:6px;background:#1a1a1a;border-radius:2px;"></div>
              <div style="width:24px;height:6px;background:#1a1a1a;border-radius:2px;"></div>
              <div style="width:24px;height:6px;background:#1a1a1a;border-radius:2px;"></div>
            </div>
            <div style="width:52px;height:14px;background:#2ecc71;border-radius:5px;"></div>
          </div>
          <div class="subs-body">
            <div class="subs-heading">Choose Your Plan</div>
            <div class="subs-cards">
              <div class="sub-card premium">
                <div>
                  <div class="sub-plan-name">Premium</div>
                  <div class="sub-price">UGX 30K</div>
                  <div class="sub-period">per month</div>
                  <div class="sub-features">
                    <div class="sub-feat">Fast delivery</div>
                    <div class="sub-feat">Custom meals</div>
                    <div class="sub-feat">Pay later</div>
                  </div>
                </div>
                <div class="sub-btn">Get Started</div>
              </div>
              <div class="sub-card family">
                <div class="sub-card-badge">Popular</div>
                <div>
                  <div class="sub-plan-name">Family</div>
                  <div class="sub-price">UGX 90K</div>
                  <div class="sub-period">per month</div>
                  <div class="sub-features">
                    <div class="sub-feat">Up to 6 members</div>
                    <div class="sub-feat">Shared wallet</div>
                    <div class="sub-feat">Priority support</div>
                  </div>
                </div>
                <div class="sub-btn">Get Started</div>
              </div>
              <div class="sub-card business">
                <div class="sub-card-badge">Best Value</div>
                <div>
                  <div class="sub-plan-name">Business</div>
                  <div class="sub-price">UGX 180K</div>
                  <div class="sub-period">per month</div>
                  <div class="sub-features">
                    <div class="sub-feat">Unlimited orders</div>
                    <div class="sub-feat">Invoice billing</div>
                    <div class="sub-feat">Dedicated agent</div>
                  </div>
                </div>
                <div class="sub-btn">Get Started</div>
              </div>
            </div>
          </div>
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

    <!-- ── APP DOWNLOAD ── -->
    <div class="app-section">
      <h3>Yookatale in your pocket</h3>
      <p>Download the official app. Shop, subscribe, and track orders from your phone.</p>
      <div class="badges">
        <a href="#" class="app-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div class="badge-texts">
            <span class="badge-sm">Download on the</span>
            <span class="badge-lg">App Store</span>
          </div>
        </a>
        <a href="#" class="app-badge">
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

  <!-- ══ FOOTER ══ -->
  <div class="footer">
    <div class="footer-logo">
      <div class="footer-logo-mark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#2ecc71" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="footer-logo-name">YOO<span>KATALE</span></div>
    </div>

    <div class="contact-addr" style="font-size:11px;color:#374151;margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:5px;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#374151" stroke-width="2"/>
        <circle cx="12" cy="10" r="3" stroke="#374151" stroke-width="2"/>
      </svg>
      Clock Tower Plot 6, 27 Kampala, Entebbe, Uganda · P.O. Box 74940
    </div>

    <div class="social-row">
      <a href="#" class="soc" title="Facebook">F</a>
      <a href="#" class="soc" title="X / Twitter">X</a>
      <a href="#" class="soc" title="Instagram">IG</a>
      <a href="#" class="soc" title="WhatsApp">WA</a>
      <a href="#" class="soc" title="YouTube">YT</a>
      <a href="#" class="soc" title="TikTok">TT</a>
    </div>

    <div class="copyright">Copyright © 2026 Yookatale. All rights reserved.</div>
  </div>

</div>
</div>
</body>
</html>`;
