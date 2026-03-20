export const metadata = {
  title: "Gift Cards — Give the Gift of Fresh Food",
  description:
    "Send a Yookatale gift card to someone you love. The perfect gift for birthdays, Eid, Christmas and special occasions — redeemable for fresh groceries and food delivery.",
  keywords: [
    "Yookatale gift card",
    "food gift card Uganda",
    "grocery gift Uganda",
    "gift card Kampala",
    "send food gift Uganda",
    "Eid gift Uganda food",
  ],
  openGraph: {
    title: "Yookatale Gift Cards — Give Fresh Food",
    description:
      "The perfect gift — send a Yookatale gift card for any occasion. Redeemable for groceries and food delivery across Kampala.",
    url: "https://yookatale.com/gift-cards",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Gift Cards" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yookatale Gift Cards",
    description: "Give the gift of fresh food. Redeemable for groceries and delivery in Kampala.",
  },
  alternates: { canonical: "https://yookatale.com/gift-cards" },
};

export default function GiftCardsLayout({ children }) {
  return children;
}
