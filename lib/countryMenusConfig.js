/**
 * Country menus configuration for homepage flags and subscription page menu list.
 * UG is default; each entry links to /subscription.
 */

export const COUNTRY_MENUS = [
  { code: "UG", name: "Uganda", label: "Uganda", menuName: "Uganda Main Cuisine", flagEmoji: "🇺🇬", isDefault: true },
  { code: "BR", name: "Brazil", label: "Brazil", menuName: "Brazilian Combo Menu", flagEmoji: "🇧🇷" },
  { code: "KE", name: "Kenya", label: "Kenya", menuName: "Kenyan Combo Menu", flagEmoji: "🇰🇪" },
  { code: "RW", name: "Rwanda", label: "Rwanda", menuName: "Rwandan Cuisine", flagEmoji: "🇷🇼" },
  { code: "FR", name: "France", label: "France", menuName: "France Bon Appetit Combo", flagEmoji: "🇫🇷" },
  { code: "TZ", name: "Tanzania", label: "Tanzania", menuName: "Tanzanian Meat & Grill", flagEmoji: "🇹🇿" },
  { code: "SS", name: "South Sudan", label: "South Sudan", menuName: "South Sudan Cuisine", flagEmoji: "🇸🇸" },
  { code: "ZA", name: "South Africa", label: "South Africa", menuName: "South Africa Combo Menu", flagEmoji: "🇿🇦" },
  { code: "SO", name: "Somalia", label: "Somalia", menuName: "Somali Cuisine", flagEmoji: "🇸🇴" },
  { code: "CD", name: "Congo", label: "Congo", menuName: "Congolese Combo Menu", flagEmoji: "🇨🇩" },
  { code: "CN", name: "China", label: "China", menuName: "Chinese Menu", flagEmoji: "🇨🇳" },
  { code: "NG", name: "Nigeria", label: "Nigeria", menuName: "Naija Combo Menu", flagEmoji: "🇳🇬" },
  { code: "MA", name: "Morocco", label: "Morocco", menuName: "Moroccan Cuisine", flagEmoji: "🇲🇦" },
  { code: "ET", name: "Ethiopia", label: "Ethiopia", menuName: "Ethiopian Cuisine", flagEmoji: "🇪🇹" },
  { code: "IT", name: "Italy", label: "Italy", menuName: "Italian Menu", flagEmoji: "🇮🇹" },
  { code: "ER", name: "Eritrea", label: "Eritrea", menuName: "Eritrean Main Cuisine", flagEmoji: "🇪🇷" },
  { code: "DK", name: "Denmark", label: "Denmark", menuName: "Danish Cuisine", flagEmoji: "🇩🇰" },
  { code: "RU", name: "Russia", label: "Russia", menuName: "Russian Cuisine", flagEmoji: "🇷🇺" },
  { code: "AO", name: "Angola", label: "Angola", menuName: "Angolan Main Dishes", flagEmoji: "🇦🇴" },
  { code: "ML", name: "Mali", label: "Mali", menuName: "Malian Meat & Grill", flagEmoji: "🇲🇱" },
];

/** Default country code (Uganda) */
export const DEFAULT_COUNTRY_CODE = "UG";

/** Get subscription URL with optional country param */
export function getSubscriptionUrl(countryCode) {
  if (!countryCode || countryCode === DEFAULT_COUNTRY_CODE) return "/subscription";
  return `/subscription?country=${encodeURIComponent(countryCode)}`;
}
