/**
 * Shared email layout – new UI (Sora/DM Sans, dark theme, Yookatale branding).
 * Use for all transactional emails sent via /api/mail.
 * Uses Yookatale original logo image; social icons with proper links and visible SVGs.
 */
const BASE_URL = "https://www.yookatale.app";
const LOGO_URL = BASE_URL + "/assets/icons/logo2.png";

const SHARED_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0b0b0b; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    .wrap { background: #0b0b0b; padding: 44px 16px; }
    .container { max-width: 600px; margin: 0 auto; background: #111; border-radius: 28px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 60px 120px rgba(0,0,0,0.8); }
    .header { background: #0d0d0d; padding: 44px 44px 38px; text-align: center; position: relative; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .header::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #2ecc71 40%, #27ae60 60%, transparent); }
    .header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% -10%, rgba(46,204,113,0.12) 0%, transparent 70%); pointer-events: none; }
    .logo-row { margin-bottom: 30px; }
    .logo-img { max-width: 160px; height: auto; display: block; margin: 0 auto; }
    .header h1 { font-family: 'Sora', sans-serif; font-size: 34px; font-weight: 700; color: #fff; letter-spacing: -1px; line-height: 1.15; margin-bottom: 9px; }
    .header-sub { font-size: 13px; color: #555; letter-spacing: 1.8px; text-transform: uppercase; font-weight: 500; }
    .body { padding: 40px 44px; }
    .intro { font-size: 15px; line-height: 1.8; color: #888; margin-bottom: 10px; }
    .intro strong { color: #d1d5db; font-weight: 500; }
    .body-card { background: #161616; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
    .body-btn { display: inline-block; padding: 14px 28px; background: #2ecc71; color: #052010; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; border-radius: 12px; text-decoration: none; box-shadow: 0 8px 24px rgba(46,204,113,0.3); }
    .footer { padding: 36px 44px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; }
    .footer-logo { margin-bottom: 16px; }
    .footer-logo-img { max-width: 120px; height: auto; display: block; margin: 0 auto; }
    .contact-addr { font-size: 12px; color: #374151; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 5px; flex-wrap: wrap; }
    .social-row { display: flex; justify-content: center; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
    .soc { width: 40px; height: 40px; background: #161616; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
    .soc svg { flex-shrink: 0; }
    .copyright { font-size: 11px; color: #2a2a2a; }
`;

const LOGO_HEADER = `
  <div class="logo-row">
    <img src="${LOGO_URL}" alt="Yookatale" class="logo-img" width="160" />
  </div>`;

const FOOTER_HTML = `
  <div class="footer">
    <div class="footer-logo">
      <img src="${LOGO_URL}" alt="Yookatale" class="footer-logo-img" width="120" />
    </div>
    <div class="contact-addr">
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
      <a href="https://twitter.com/YooKatale" class="soc" title="X">
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
    <div class="copyright">Copyright © ${new Date().getFullYear()} Yookatale. All rights reserved.</div>
  </div>`;

/**
 * @param {{ pageTitle: string, headerTitle: string, headerSub?: string, bodyHtml: string }} opts
 * @returns {string} Full HTML email
 */
export function getEmailLayout({ pageTitle, headerTitle, headerSub = '', bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <style>${SHARED_CSS}</style>
</head>
<body>
<div class="wrap">
<div class="container">
  <div class="header">
    ${LOGO_HEADER}
    <h1>${headerTitle}</h1>
    ${headerSub ? `<div class="header-sub">${headerSub}</div>` : ''}
  </div>
  <div class="body">
    ${bodyHtml}
  </div>
  ${FOOTER_HTML}
</div>
</div>
</body>
</html>`;
}

export { BASE_URL };
