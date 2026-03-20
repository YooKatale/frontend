export const metadata = {
  title: "Meal Plan Subscriptions — Weekly Fresh Food Delivery",
  description:
    "Subscribe to Yookatale's weekly meal plans. Get fresh, nutritious food delivered to your door every week in Kampala. Affordable plans starting from UGX 50,000.",
  keywords: [
    "meal plan Uganda",
    "weekly grocery subscription Uganda",
    "food subscription Kampala",
    "Yookatale subscription",
    "fresh food plan Uganda",
    "weekly delivery Uganda",
    "affordable meal plan Kampala",
  ],
  openGraph: {
    title: "Subscribe to Weekly Meal Plans | Yookatale Uganda",
    description:
      "Get fresh, healthy food delivered to your home every week. Choose a Yookatale meal plan that fits your lifestyle and budget.",
    url: "https://yookatale.com/subscription",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Meal Plan Subscription" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekly Meal Plans | Yookatale",
    description: "Fresh food delivered weekly to your door. Subscribe to a Yookatale meal plan today.",
  },
  alternates: { canonical: "https://yookatale.com/subscription" },
};

export default function SubscriptionLayout({ children }) {
  return children;
}
