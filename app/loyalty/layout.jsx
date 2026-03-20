export const metadata = {
  title: "Loyalty Program — Earn More With Every Order",
  description:
    "Join Yookatale's loyalty programme. Earn points on every grocery order and redeem them for free deliveries, discounts, and exclusive rewards in Uganda.",
  keywords: [
    "Yookatale loyalty program",
    "grocery loyalty Uganda",
    "earn points food delivery",
    "loyalty rewards Kampala",
  ],
  openGraph: {
    title: "Yookatale Loyalty Programme",
    description: "Earn points on every order and unlock exclusive rewards. Shop more, save more with Yookatale.",
    url: "https://yookatale.com/loyalty",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Loyalty" }],
  },
  alternates: { canonical: "https://yookatale.com/loyalty" },
};

export default function LoyaltyLayout({ children }) {
  return children;
}
