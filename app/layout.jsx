'use client'
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

const WorkSans = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "yookatale",
  description:
    "YooKatale Uganda | Online Food shopping, Organic and Fresh Foods Mobile Market, Affordable, Reliable & Convenient",
};

const RootLayout = ({ children }) => {

  return (
    <html lang="en">
      <body className={WorkSans.className} suppressHydrationWarning>
          {/* <ServiceWorker /> */}
          <Providers>
            <Header />
            {children}
            <Footer />
            <CookiePolicy />
          </Providers>
          {/* <ScriptTag /> */} 
      </body>
    </html>
  );
};

export default RootLayout;
