import { Providers } from "./providers";
import "./globals.css";
import { Syne, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { V4_CSS } from "@lib/v4Styles";

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
  title: "Yookatale — Shop Fresh, Live Better",
  description:
    "YooKatale Uganda | Online Food shopping, Organic and Fresh Foods Mobile Market, Affordable, Reliable & Convenient",
  manifest: "/manifest.json",
  themeColor: "#0D0D0D",
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
                {children}
              </div>
            </ClientLayoutWrapper>
          </Providers>
          {/* <ScriptTag /> */} 
      </body>
    </html>
  );
};

export default RootLayout;
