export const metadata = {
  title: "Blog — Food Tips, Recipes & News",
  description:
    "Read Yookatale's blog for healthy eating tips, delicious recipes, food news, and updates from Uganda's leading grocery delivery platform.",
  keywords: [
    "Uganda food blog",
    "healthy eating tips Uganda",
    "Kampala recipes",
    "food news Uganda",
    "Yookatale blog",
    "grocery tips Uganda",
  ],
  openGraph: {
    title: "Yookatale Blog — Recipes, Tips & Food News",
    description:
      "Explore recipes, nutrition tips, and the latest food news from Uganda's freshest grocery platform.",
    url: "https://yookatale.com/blog",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yookatale Blog",
    description: "Recipes, healthy eating tips, and food news from Uganda.",
    creator: "@yookatale",
  },
  alternates: { canonical: "https://yookatale.com/blog" },
};

export default function BlogLayout({ children }) {
  return children;
}
