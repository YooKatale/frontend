"use client";

import { Suspense } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import ServiceWorker from "@components/ServiceWorker";
import CookiePolicy from "@components/CookiePolicy";
import AdvertCard from "@components/advert";
import AppStoreRatingPrompt from "@components/AppStoreRatingPrompt";
import PlatformFeedbackModal from "@components/PlatformFeedbackModal";
import dynamic from "next/dynamic";
import LocationGate from "@components/LocationGate";

/**
 * Client-side layout wrapper
 * Handles all client-side components including LocationGate
 */
export default function ClientLayoutWrapper({ children }) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
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
    </>
  );
}
