export const metadata = {
  title: "FAQs — Frequently Asked Questions",
  description:
    "Find answers to common questions about Yookatale — orders, delivery, payments, refunds, subscriptions, and more. Uganda's fresh grocery delivery FAQ.",
  keywords: [
    "Yookatale FAQs",
    "grocery delivery questions Uganda",
    "how to order Yookatale",
    "Yookatale refund policy",
    "Yookatale delivery Uganda",
  ],
  openGraph: {
    title: "FAQs | Yookatale",
    description:
      "Got questions? Find everything you need to know about ordering groceries, delivery, payments and subscriptions on Yookatale.",
    url: "https://yookatale.com/faqs",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale FAQs" }],
  },
  twitter: { card: "summary", title: "Yookatale FAQs", description: "Answers to your most common grocery delivery questions." },
  alternates: { canonical: "https://yookatale.com/faqs" },
};

export default function FaqsLayout({ children }) {
  return children;
}
