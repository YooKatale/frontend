/**
 * Invite Friends and Earn Email Template
 * Sent to users to guide them on how to invite friends and earn rewards.
 * New dark UI — no external images.
 */

import { getEmailLayout } from "./emailLayout";

const bodyHtml = `
  <p class="intro">Invite your friends, family, and associates to Yookatale and earn rewards. Share your unique referral link via email or social media. When they sign up using your link and make their first order, you earn cash rewards and loyalty points for future purchases.</p>
  <p class="intro">The more friends you invite, the more you earn. Share your referral link, make sure they sign up using it, and claim your payout.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app/#refer" class="body-btn">Invite friends &amp; earn</a></p>
  <p style="text-align:center;margin-top:16px;"><a href="https://www.yookatale.app/signup" class="body-btn" style="background:#161616;color:#fff;margin-right:8px;">Sign up</a><a href="https://www.yookatale.app/subscription" class="body-btn" style="background:#161616;color:#fff;">Subscribe</a></p>
`;

export const inviteFriendsEmailTemplate = getEmailLayout({
  pageTitle: "Invite Friends & Earn Rewards",
  headerTitle: "Invite Friends & Earn Rewards",
  headerSub: "Yoo mobile food market",
  bodyHtml,
});
