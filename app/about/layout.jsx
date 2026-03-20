export const metadata = {
  title: "About Us",
  description:
    "Learn about Yookatale — Uganda's leading fresh grocery and food delivery platform. Our mission, story, and commitment to bringing fresh produce to every home in Kampala.",
  keywords: [
    "about Yookatale",
    "Yookatale Uganda",
    "fresh food delivery company Uganda",
    "online grocery Uganda company",
    "Kampala food delivery startup",
  ],
  openGraph: {
    title: "About Yookatale — Uganda's Fresh Grocery Platform",
    description:
      "Discover the story behind Yookatale and our mission to make fresh, affordable groceries accessible to every household in Uganda.",
    url: "https://yookatale.com/about",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "About Yookatale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Yookatale",
    description: "Learn about Uganda's favourite online grocery delivery platform.",
  },
  alternates: { canonical: "https://yookatale.com/about" },
};

export default function AboutLayout({ children }) {
  return children;
}
