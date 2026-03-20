export const metadata = {
  title: "Sign In — Access Your Account",
  description:
    "Sign in to your Yookatale account to track orders, manage your meal plan subscription, access rewards, and shop fresh groceries online in Uganda.",
  keywords: ["Yookatale login", "sign in Yookatale", "Yookatale account Uganda"],
  openGraph: {
    title: "Sign In to Yookatale",
    description: "Access your account to shop, track orders, and manage your subscriptions.",
    url: "https://yookatale.com/signin",
    images: [{ url: "/assets/icons/logo2.png", width: 1200, height: 630, alt: "Yookatale Sign In" }],
  },
  robots: { index: false, follow: true },
  alternates: { canonical: "https://yookatale.com/signin" },
};

export default function SigninLayout({ children }) {
  return children;
}
