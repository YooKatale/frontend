"use client";
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
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdvertCard from "@components/advert";
import AppStoreRatingPrompt from "@components/AppStoreRatingPrompt";
import PlatformFeedbackModal from "@components/PlatformFeedbackModal";

// Dynamically import LocationGate to avoid SSR issues
const LocationGate = dynamic(() => import("@components/LocationGate"), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Loading...</div>
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
            <Suspense>
            <ServiceWorker />
            <LocationGate>
              <Header />
              {children}
              <Footer />
            </LocationGate>
            </Suspense>
            <CookiePolicy />
            <AdvertCard />
            <AppStoreRatingPrompt />
            <PlatformFeedbackModal />
          </Providers>
          {/* <ScriptTag /> */} 
      </body>
    </html>
  );
};

export default RootLayout;
