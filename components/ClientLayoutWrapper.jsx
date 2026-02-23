"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@components/Header";
import Footer from "@components/Footer";
import ServiceWorker from "@components/ServiceWorker";
import CookiePolicy from "@components/CookiePolicy";
import AdvertCard from "@components/advert";
import AppStoreRatingPrompt from "@components/AppStoreRatingPrompt";
import PlatformFeedbackModal from "@components/PlatformFeedbackModal";
import dynamic from "next/dynamic";
import LocationGate from "@components/LocationGate";

const SupportChatWidget = dynamic(() => import("@components/SupportChatWidget"), { ssr: false });

const NO_NAVBAR_FOOTER = ["/signin", "/signup"];

/**
 * Client-side layout wrapper
 * Handles all client-side components including LocationGate.
 * Hides navbar and footer on signin/signup pages.
 */
export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideNavAndFooter = NO_NAVBAR_FOOTER.includes(pathname || "");

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ServiceWorker />
        <LocationGate>
          {!hideNavAndFooter && <Header />}
          {children}
          {!hideNavAndFooter && <Footer />}
        </LocationGate>
      </Suspense>
      <CookiePolicy />
      <AdvertCard />
      <AppStoreRatingPrompt />
      <PlatformFeedbackModal />
      <SupportChatWidget />
    </>
  );
}
