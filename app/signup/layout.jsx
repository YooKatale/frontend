export const metadata = {
  title: "Sign Up — Create Your Yookatale Account",
  description:
    "Create a free Yookatale account and start shopping for fresh groceries online in Uganda. Get exclusive offers, track your orders, and earn reward points.",
  keywords: [
    "Yookatale sign up",
    "create account Yookatale Uganda",
    "register Yookatale",
    "join Yookatale",
    "free grocery account Uganda",
  ],
  openGraph: {
    title: "Create a Free Yookatale Account",
    description:
      "Join thousands of Ugandans shopping for fresh groceries online. Sign up free and get your first order delivered fast.",
    url: "https://yookatale.com/signup",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Sign Up Yookatale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up for Yookatale",
    description: "Join Uganda's fresh grocery platform. Shop online, earn rewards, get fast delivery.",
  },
  alternates: { canonical: "https://yookatale.com/signup" },
};

export default function SignupLayout({ children }) {
  return children;
}
