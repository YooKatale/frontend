/**
 * Subscription email – full welcome HTML (feature pills, CTA cards, mock screens, app download, footer).
 * Used when admin sends subscription emails via frontend /api/mail (type: 'subscription').
 */

import getWelcomeEmailHtml from "./welcomeEmailTemplate";

export const subscriptionEmailTemplate = getWelcomeEmailHtml();
