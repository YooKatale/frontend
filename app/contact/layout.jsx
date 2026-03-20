export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Yookatale. Reach our support team for orders, delivery issues, partnerships, or general inquiries. We're here to help, Kampala Uganda.",
  keywords: [
    "contact Yookatale",
    "Yookatale support",
    "Yookatale phone number",
    "grocery delivery support Uganda",
    "Yookatale Kampala contact",
  ],
  openGraph: {
    title: "Contact Yookatale — We're Here to Help",
    description:
      "Reach out to the Yookatale team for support, partnership inquiries, or feedback. Fast response guaranteed.",
    url: "https://yookatale.com/contact",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Contact Yookatale" }],
  },
  twitter: {
    card: "summary",
    title: "Contact Yookatale",
    description: "Get in touch with Yookatale's support team in Kampala, Uganda.",
  },
  alternates: { canonical: "https://yookatale.com/contact" },
};

export default function ContactLayout({ children }) {
  return children;
}
