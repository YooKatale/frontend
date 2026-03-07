/**
 * App Download Email Template
 * Sent to users after signup to guide them on how to download the Yookatale mobile app.
 * New dark UI — no external images.
 */

import { getEmailLayout } from "./emailLayout";

const bodyHtml = `
  <p class="intro">Switch to a new shopping style. Subscribe <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> monthly or annually. Get everything delivered at your doorstep.</p>
  <p class="intro">Discover and customize your meals, set when and where to eat with friends and family. Earn loyalty points, credit points, gifts and discounts.</p>
  <div class="body-card">
    <p style="font-size:14px;color:#d1d5db;margin:0 0 8px;font-weight:600;">Method 1: Visit our website</p>
    <p class="intro" style="margin-bottom:12px;">Visit <strong>yookatale.app</strong> and scroll to the footer for direct download links for iOS and Android.</p>
    <p style="text-align:center;margin:0;"><a href="https://www.yookatale.app" class="body-btn">Visit yookatale.app</a></p>
  </div>
  <div class="body-card">
    <p style="font-size:14px;color:#d1d5db;margin:0 0 8px;font-weight:600;">Method 2: App stores</p>
    <p class="intro" style="margin-bottom:12px;">Open the <strong>App Store</strong> (iOS) or <strong>Google Play Store</strong> (Android), search for &quot;Yookatale&quot; and download the official app.</p>
    <p style="text-align:center;margin:0;"><a href="https://apps.apple.com/app/yookatale" class="body-btn" style="margin-right:8px;">App Store</a><a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" class="body-btn" style="background:#f59e0b;color:#1c0f00;">Google Play</a></p>
  </div>
  <p class="intro" style="text-align:center;margin-top:16px;">Once downloaded, sign in and start shopping, subscribing, and earning rewards.</p>
`;

export const appDownloadEmailTemplate = getEmailLayout({
  pageTitle: "Get the Yookatale App",
  headerTitle: "Get the Yookatale App",
  headerSub: "Shop faster, track orders, and get exclusive mobile-only deals",
  bodyHtml,
});
