/**
 * Subscription Confirmation Email Template
 * Sent to users when they subscribe from the webapp.
 * New dark UI — no external images.
 */

import { getEmailLayout } from "./emailLayout";

const bodyHtml = `
  <p class="intro" style="text-align:center;font-weight:600;">We're thrilled to have you join the Yookatale family!</p>
  <p class="intro">Thank you for subscribing to Yookatale. You're now part of our community, and we'll keep you updated on the latest news, exclusive offers, meal recommendations, and updates.</p>
  <p class="intro">Discover and customize your meals, set when and where to eat with friends and family. Earn loyalty points, credit points, gifts and discounts.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app/subscription" class="body-btn">View plans</a> <a href="https://www.yookatale.app/#refer" class="body-btn" style="background:#f59e0b;color:#1c0f00;margin-left:8px;">Invite friends</a></p>
`;

export const subscriptionConfirmationEmailTemplate = getEmailLayout({
  pageTitle: "Thank You for Subscribing – Yookatale",
  headerTitle: "Thank You for Subscribing!",
  headerSub: "Yoo mobile food market",
  bodyHtml,
});
