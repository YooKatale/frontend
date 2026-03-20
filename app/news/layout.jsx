export const metadata = {
  title: "News & Updates | YooKatale — Uganda's Food Marketplace",
  description:
    "Stay up to date with YooKatale news, food recipes, exclusive promotions, agriculture insights and more from Uganda's leading digital food marketplace.",
  keywords:
    "YooKatale news, Uganda food marketplace, food delivery Uganda, Kampala food news, Ugandan recipes, agriculture Uganda, food promotions Kampala",
  openGraph: {
    title: "YooKatale News — Stories from Uganda's Food Marketplace",
    description:
      "Company updates, food recipes, promotions, market insights and agriculture news from YooKatale.",
    url: "https://www.yookatale.app/news",
    siteName: "YooKatale",
    images: [
      {
        url: "https://www.yookatale.app/assets/icons/logo2.png",
        width: 400,
        height: 400,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YooKatale News",
    description: "Company updates, recipes, promotions and agriculture insights from Uganda's food marketplace.",
    images: ["https://www.yookatale.app/assets/icons/logo2.png"],
  },
  alternates: {
    canonical: "https://www.yookatale.app/news",
  },
};

export default function NewsLayout({ children }) {
  return children;
}
