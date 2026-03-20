export const metadata = {
  title: "Search Products",
  description:
    "Search for fresh groceries, produce, meals and household essentials on Yookatale Uganda. Find what you need and get it delivered fast in Kampala.",
  keywords: ["search groceries Uganda", "buy food online Uganda", "find fresh produce Kampala", "Yookatale search"],
  openGraph: {
    title: "Search Products | Yookatale Uganda",
    description: "Find fresh groceries, meals and essentials — search Yookatale's catalogue and order online.",
    url: "https://yookatale.com/search",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Search" }],
  },
  robots: { index: false, follow: true },
  alternates: { canonical: "https://yookatale.com/search" },
};

export default function SearchLayout({ children }) {
  return children;
}
