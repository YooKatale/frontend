export const metadata = {
  title: "Marketplace — Buy & Sell Fresh Food",
  description:
    "Explore Yookatale's marketplace. Discover products from local vendors and sellers across Uganda. Fresh food, groceries, meals and more — all in one place.",
  keywords: [
    "Uganda online marketplace",
    "Yookatale marketplace",
    "buy from local vendors Uganda",
    "fresh food marketplace Kampala",
    "seller marketplace Uganda",
    "online food market Uganda",
  ],
  openGraph: {
    title: "Yookatale Marketplace — Uganda's Fresh Food Market",
    description:
      "Shop from verified local vendors and sellers. Fresh produce, packaged goods, and homemade meals — all on Yookatale's marketplace.",
    url: "https://yookatale.com/marketplace",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Marketplace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yookatale Marketplace",
    description: "Discover Uganda's freshest food marketplace. Shop from local vendors near you.",
  },
  alternates: { canonical: "https://yookatale.com/marketplace" },
};

export default function MarketplaceLayout({ children }) {
  return children;
}
