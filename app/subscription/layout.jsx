export const metadata = {
  title: "Yookatale Meal Plan Subscriptions — Fresh Daily & Weekly Food Delivery",
  description:
    "Explore Yookatale meal subscriptions with fresh, nutritious ready-to-eat or ready-to-cook meals delivered across Kampala.",
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
      "Explore meal subscriptions with fresh food delivered across Kampala.",
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
      "Fresh ready-to-eat and ready-to-cook meal subscriptions delivered across Kampala.",
  },
  alternates: { canonical: "https://yookatale.com/subscription" },
};

export default function SubscriptionLayout({ children }) {
  return children;
}

