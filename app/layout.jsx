import { Providers } from "./providers";
import "./globals.css";
import { Work_Sans } from "next/font/google";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import dynamic from "next/dynamic";

// Dynamically import ClientLayoutWrapper to avoid SSR issues (contains all client components)
const ClientLayoutWrapper = dynamic(() => import("@components/ClientLayoutWrapper"), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f7f7f7' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #e0e0e0', borderTop: '4px solid #185F2D', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading YooKatale...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
});

const WorkSans = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "yookatale",
  description:
    "YooKatale Uganda | Online Food shopping, Organic and Fresh Foods Mobile Market, Affordable, Reliable & Convenient",
  manifest: "/manifest.json",
  themeColor: "#1a202c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YooKatale",
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
      <body className={WorkSans.className} suppressHydrationWarning>
          <Providers>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </Providers>
          {/* <ScriptTag /> */} 
      </body>
    </html>
  );
};

export default RootLayout;
