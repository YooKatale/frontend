//'use client'
import Header from "@components/Header";
import Footer from "@components/Footer";
import { Providers } from "./providers";
import "./globals.css";
import CookiePolicy from "@components/CookiePolicy";
import ScriptTag from "@components/ScriptTag";
import { Work_Sans } from "next/font/google";
import ServiceWorker from "@components/ServiceWorker";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Suspense } from "react";
import AdvertCard from "@components/advert";

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
            <Suspense>
            <ServiceWorker />
            <Header />
            {children}
            <Footer />
            </Suspense>
            <CookiePolicy />
            <AdvertCard />
          </Providers>
          {/* <ScriptTag /> */} 
      </body>
    </html>
  );
};

export default RootLayout;
