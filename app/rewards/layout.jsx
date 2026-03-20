export const metadata = {
  title: "Rewards — Earn Points on Every Order",
  description:
    "Earn Yookatale reward points on every purchase. Redeem points for discounts, free deliveries, and exclusive offers. Shop and save more every time.",
  keywords: [
    "Yookatale rewards",
    "grocery loyalty points Uganda",
    "earn points food delivery Uganda",
    "Yookatale discount program",
    "food rewards Kampala",
  ],
  openGraph: {
    title: "Yookatale Rewards — Earn & Redeem Points",
    description:
      "Every order earns you points. Redeem them for discounts and free deliveries on Yookatale Uganda.",
    url: "https://yookatale.com/rewards",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Rewards" }],
  },
  twitter: { card: "summary", title: "Yookatale Rewards", description: "Earn points on every grocery order and get rewarded." },
  alternates: { canonical: "https://yookatale.com/rewards" },
};

export default function RewardsLayout({ children }) {
  return children;
}
