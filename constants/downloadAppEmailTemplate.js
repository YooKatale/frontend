/**
 * Download App Email Template
 * Sent to users to guide them on how to download the Yookatale mobile app.
 * New dark UI — no external images.
 */

import { getEmailLayout } from "./emailLayout";

const bodyHtml = `
  <p class="intro">Download the Yookatale app for a seamless shopping experience. Two easy ways to get the app:</p>
  <p class="intro"><strong>1.</strong> Visit <strong>yookatale.app</strong> and scroll to the footer for direct download links for Google Play (Android) and App Store (iOS).</p>
  <p class="intro"><strong>2.</strong> Open the <strong>Google Play Store</strong> or <strong>App Store</strong> on your device, search for &quot;Yookatale&quot;, and tap install.</p>
  <p class="intro">Once downloaded, sign in with your account and start shopping, subscribing, and earning rewards from your phone.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app" class="body-btn">Visit website</a> <a href="https://apps.apple.com/app/yookatale" class="body-btn" style="background:#f59e0b;color:#1c0f00;margin-left:8px;">App Store</a> <a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" class="body-btn" style="background:#161616;color:#fff;margin-left:8px;">Google Play</a></p>
`;

export const downloadAppEmailTemplate = getEmailLayout({
  pageTitle: "Download Yookatale App",
  headerTitle: "Download the Yookatale App",
  headerSub: "Yoo mobile food market",
  bodyHtml,
});
