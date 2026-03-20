export const metadata = {
  title: "Careers — Join the Yookatale Team",
  description:
    "We're hiring! Join Yookatale — Uganda's leading fresh food delivery platform. View open positions in tech, operations, delivery, and marketing and apply today.",
  keywords: [
    "jobs in Uganda",
    "Yookatale careers",
    "tech jobs Kampala",
    "food delivery jobs Uganda",
    "startup jobs Uganda",
    "hiring Kampala",
  ],
  openGraph: {
    title: "We're Hiring | Join Yookatale Uganda",
    description:
      "Yookatale is growing and we want you on our team. Browse open roles and apply to work at Uganda's favourite grocery delivery platform.",
    url: "https://yookatale.com/careers",
    siteName: "Yookatale",
    images: [
      {
        url: "/assets/icons/logo2.png",
        width: 1200,
        height: 630,
        alt: "Yookatale — We Are Hiring",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "We're Hiring at Yookatale",
    description: "Join Uganda's fastest-growing food delivery platform. View open positions and apply today.",
    images: ["/assets/icons/logo2.png"],
    creator: "@yookatale",
  },
  alternates: { canonical: "https://yookatale.com/careers" },
};

export default function CareersLayout({ children }) {
  return children;
}
