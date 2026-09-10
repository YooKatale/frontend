export const metadata = {
  title: "Yookatale Meal Plan Subscriptions — Fresh Daily & Weekly Food Delivery",
  description:
    "Subscribe to Yookatale's affordable meal plans starting from UGX 40,000. Enjoy fresh, nutritious ready-to-eat or ready-to-cook meals delivered daily or weekly across Kampala.",
  keywords: [
    "meal plan Uganda",
    "weekly meal subscription Uganda",
    "daily food delivery Kampala",
    "Yookatale meal plans",
    "fresh food subscription Uganda",
    "ready to eat meals Kampala",
    "ready to cook ingredients Uganda",
    "affordable meal plans Uganda",
  ],
  openGraph: {
    title: "Yookatale Meal Plan Subscriptions — Fresh Food Delivered in Kampala",
    description:
      "Choose from individual, family, or business meal plans. Fresh food delivered daily or weekly. Plans start at UGX 40,000.",
    url: "https://yookatale.com/subscription",
    images: [
      {
        url: "/assets/icons/logo2.png",
        width: 1200,
        height: 630,
        alt: "Yookatale Meal Plan Subscription",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yookatale Meal Plans — Fresh Food Delivered",
    description:
      "Affordable meal plans starting at UGX 40,000. Fresh ready-to-eat and ready-to-cook meals delivered across Kampala.",
  },
  alternates: { canonical: "https://yookatale.com/subscription" },
};

export default function SubscriptionLayout({ children }) {
  return children;
}

