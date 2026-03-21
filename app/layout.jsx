import { Providers } from "./providers";
import "./globals.css";
import { Syne, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { V4_CSS } from "@lib/v4Styles";
import PageTransition from "@components/PageTransition";

// Dynamically import ClientLayoutWrapper to avoid SSR issues (contains all client components)
const ClientLayoutWrapper = dynamic(() => import("@components/ClientLayoutWrapper"), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f7f7f7' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #e0e0e0', borderTop: '4px solid #185f2d', borderRadius: '50%', margin: '0 auto 16px' }} />
        <p style={{ color: '#666', fontSize: '14px' }}>Loading Yookatale...</p>
      </div>
    </div>
  ),
});

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://yookatale.com"),
  title: {
    default: "Yookatale — Fresh Groceries & Food Delivery in Kampala, Uganda",
    template: "%s | Yookatale",
  },
  description:
    "Yookatale is Uganda's leading online grocery and fresh food delivery platform. Shop organic produce, meals, beverages, and household essentials — delivered fast in Kampala.",
  keywords: [
    "online groceries Uganda",
    "food delivery Kampala",
    "fresh produce Uganda",
    "organic food Uganda",
    "Yookatale",
    "buy food online Uganda",
    "grocery delivery Kampala",
    "fresh vegetables Uganda",
    "meal delivery Uganda",
    "online supermarket Uganda",
  ],
  authors: [{ name: "Yookatale", url: "https://yookatale.com" }],
  creator: "Yookatale",
  publisher: "Yookatale",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://yookatale.com",
    siteName: "Yookatale",
    title: "Yookatale — Fresh Groceries & Food Delivery in Kampala, Uganda",
    description:
      "Shop fresh produce, organic food, and everyday essentials online. Fast delivery across Kampala. Uganda's favourite grocery app.",
    images: [
      {
        url: "/assets/icons/logo2.png",
        width: 1200,
        height: 630,
        alt: "Yookatale — Fresh Groceries Uganda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yookatale — Fresh Groceries & Food Delivery in Kampala",
    description:
      "Uganda's online grocery marketplace. Fresh produce, meals & essentials delivered to your door in Kampala.",
    images: ["/assets/icons/logo2.png"],
    creator: "@yookatale",
  },
  alternates: {
    canonical: "https://yookatale.com",
  },
  manifest: "/manifest.json",
  themeColor: "#185f2d",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yookatale",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap"
        />
      </head>
      <body className={`${dmSans.variable} ${syne.variable} ${dmSans.className}`} suppressHydrationWarning>
          <style dangerouslySetInnerHTML={{ __html: V4_CSS }} />
          <Providers>
            <ClientLayoutWrapper>
              <div className="yookatale-v4-page">
                <PageTransition>{children}</PageTransition>
              </div>
            </ClientLayoutWrapper>
          </Providers>
          {/* <ScriptTag /> */} 
      </body>
    </html>
  );
};

export default RootLayout;
