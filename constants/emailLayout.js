/**
 * Shared email layout – new UI (Sora/DM Sans, dark theme, Yookatale branding).
 * Use for all transactional emails sent via /api/mail.
 */
const BASE_URL = "https://www.yookatale.app";

const SHARED_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0b0b0b; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    .wrap { background: #0b0b0b; padding: 44px 16px; }
    .container { max-width: 600px; margin: 0 auto; background: #111; border-radius: 28px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 60px 120px rgba(0,0,0,0.8); }
    .header { background: #0d0d0d; padding: 44px 44px 38px; text-align: center; position: relative; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .header::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #2ecc71 40%, #27ae60 60%, transparent); }
    .header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% -10%, rgba(46,204,113,0.12) 0%, transparent 70%); pointer-events: none; }
    .logo-row { display: inline-flex; align-items: center; gap: 11px; margin-bottom: 30px; }
    .logo-mark { width: 44px; height: 44px; background: linear-gradient(135deg, #1a4731, #27ae60); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(46,204,113,0.25); }
    .logo-name { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.6px; color: #fff; }
    .logo-name span { color: #2ecc71; }
    .header h1 { font-family: 'Sora', sans-serif; font-size: 34px; font-weight: 700; color: #fff; letter-spacing: -1px; line-height: 1.15; margin-bottom: 9px; }
    .header-sub { font-size: 13px; color: #555; letter-spacing: 1.8px; text-transform: uppercase; font-weight: 500; }
    .body { padding: 40px 44px; }
    .intro { font-size: 15px; line-height: 1.8; color: #888; margin-bottom: 10px; }
    .intro strong { color: #d1d5db; font-weight: 500; }
    .body-card { background: #161616; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
    .body-btn { display: inline-block; padding: 14px 28px; background: #2ecc71; color: #052010; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; border-radius: 12px; text-decoration: none; box-shadow: 0 8px 24px rgba(46,204,113,0.3); }
    .footer { padding: 36px 44px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; }
    .footer-logo { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 16px; }
    .footer-logo-mark { width: 30px; height: 30px; background: #0d1f14; border: 1px solid rgba(46,204,113,0.2); border-radius: 9px; display: flex; align-items: center; justify-content: center; }
    .footer-logo-name { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
    .footer-logo-name span { color: #2ecc71; }
    .contact-addr { font-size: 12px; color: #374151; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 5px; }
    .social-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; }
    .soc { width: 36px; height: 36px; background: #161616; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: #4b5563; font-size: 12px; font-weight: 600; }
    .copyright { font-size: 11px; color: #2a2a2a; }
`;

const LOGO_HEADER = `
  <div class="logo-row">
    <div class="logo-mark">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#2ecc71" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="logo-name">YOO<span>KATALE</span></div>
  </div>`;

const FOOTER_HTML = `
  <div class="footer">
    <div class="footer-logo">
      <div class="footer-logo-mark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#2ecc71" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="footer-logo-name">YOO<span>KATALE</span></div>
    </div>
    <div class="contact-addr">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#374151" stroke-width="2"/>
        <circle cx="12" cy="10" r="3" stroke="#374151" stroke-width="2"/>
      </svg>
      Clock Tower Plot 6, 27 Kampala, Entebbe, Uganda · P.O. Box 74940
    </div>
    <div class="social-row">
      <a href="#" class="soc" title="Facebook">F</a>
      <a href="#" class="soc" title="X">X</a>
      <a href="#" class="soc" title="Instagram">IG</a>
      <a href="#" class="soc" title="WhatsApp">WA</a>
      <a href="#" class="soc" title="YouTube">YT</a>
      <a href="#" class="soc" title="TikTok">TT</a>
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
