/**
 * How to Subscribe Email Template
 * Guides users on how to subscribe to meal calendar or subscription plans.
 * New dark UI — no external images.
 */

import { getEmailLayout } from "./emailLayout";

const bodyHtml = `
  <p class="intro">Switch to a new shopping style. Subscribe for our <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> Plan monthly or annually. Get everything delivered at your doorstep.</p>
  <p class="intro">You can subscribe in two ways: (1) Choose a <strong>subscription plan</strong> (Premium, Family, or Business) for comprehensive meal delivery, or (2) Select meals from our <strong>meal calendar</strong> with ready-to-eat or ready-to-cook options. Both options lead to the payment page where you complete your subscription.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app/subscription" class="body-btn">View subscription plans</a></p>
  <p style="text-align:center;margin-top:16px;"><a href="https://www.yookatale.app/signup" class="body-btn" style="background:#161616;color:#fff;">Sign up</a></p>
`;

export const howToSubscribeEmailTemplate = getEmailLayout({
  pageTitle: "How to Subscribe – Yookatale",
  headerTitle: "How to Subscribe",
  headerSub: "Yoo mobile food market",
  bodyHtml,
});
