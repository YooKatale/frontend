export const metadata = {
  title: "Cashout — Withdraw Your Earnings",
  description:
    "Withdraw your Yookatale wallet earnings and referral bonuses. Fast, secure cashout for sellers and affiliates in Uganda.",
  keywords: ["Yookatale cashout", "withdraw earnings Uganda", "Yookatale wallet", "earn money Yookatale"],
  openGraph: {
    title: "Cashout | Yookatale Wallet",
    description: "Withdraw your Yookatale earnings securely. Fast payments to mobile money in Uganda.",
    url: "https://yookatale.com/cashout",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Cashout" }],
  },
  robots: { index: false, follow: true },
  alternates: { canonical: "https://yookatale.com/cashout" },
};

export default function CashoutLayout({ children }) {
  return children;
}
