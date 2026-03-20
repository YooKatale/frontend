export const metadata = {
  title: "Shop All Products — Fresh Groceries & Food",
  description:
    "Browse hundreds of fresh groceries, organic produce, meals, snacks and household essentials on Yookatale. Shop by category and get fast delivery in Kampala, Uganda.",
  keywords: [
    "buy groceries online Uganda",
    "fresh vegetables Kampala",
    "organic food Uganda",
    "online supermarket Uganda",
    "Yookatale products",
    "food delivery Uganda",
    "buy fresh produce Uganda",
  ],
  openGraph: {
    title: "Shop Fresh Groceries Online | Yookatale Uganda",
    description:
      "From fresh vegetables to packaged foods — browse Yookatale's full product catalogue and get it delivered to your door.",
    url: "https://yookatale.com/products",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Products" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Fresh Groceries | Yookatale",
    description: "Browse fresh produce, snacks, meals and more — delivered fast in Kampala.",
  },
  alternates: { canonical: "https://yookatale.com/products" },
};

export default function ProductsLayout({ children }) {
  return children;
}
