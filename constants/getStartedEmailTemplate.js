/**
 * Get Started Email Template
 * Sent to users after signup to guide them on how to get started with Yookatale.
 * New dark UI — no external images.
 */

import { getEmailLayout } from "./emailLayout";

const bodyHtml = `
  <p class="intro">Get started with Yookatale in just a few steps. Visit <strong>yookatale.app</strong> in your browser, or download our mobile app from the <strong>Play Store</strong> (Android) or <strong>App Store</strong> (iOS).</p>
  <p class="intro">Create your account by signing up with the required details. After signing up, log in with your email and password, or sign in quickly with your <strong>Google account</strong>.</p>
  <p class="intro">Once logged in, you can browse meals, subscribe to plans, and start ordering delicious food delivered to your doorstep.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app/signup" class="body-btn">Sign up</a> <a href="https://www.yookatale.app/subscription" class="body-btn" style="background:#f59e0b;color:#1c0f00;margin-left:8px;">Subscribe</a></p>
  <p style="text-align:center;margin-top:16px;"><a href="https://apps.apple.com/app/yookatale" class="body-btn" style="background:#161616;color:#fff;margin-right:8px;">App Store</a><a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" class="body-btn" style="background:#161616;color:#fff;">Google Play</a></p>
`;

export const getStartedEmailTemplate = getEmailLayout({
  pageTitle: "Get Started with Yookatale",
  headerTitle: "Get Started with Yookatale",
  headerSub: "Yoo mobile food market",
  bodyHtml,
});
