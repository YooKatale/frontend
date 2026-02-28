"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Header from "@components/Header";
import Footer from "@components/Footer";
import ServiceWorker from "@components/ServiceWorker";
import CookiePolicy from "@components/CookiePolicy";
import AdvertCard from "@components/advert";
import AppStoreRatingPrompt from "@components/AppStoreRatingPrompt";
import PlatformFeedbackModal from "@components/PlatformFeedbackModal";
import LocationGate from "@components/LocationGate";
import SupportChatWidget from "@components/SupportChatWidget";
import MobileBottomNav from "@components/MobileBottomNav";
import { hydrateWishlist } from "@slices/wishlistSlice";

const NO_NAVBAR_FOOTER = ["/signin", "/signup"];

/**
 * Client-side layout wrapper
 * Handles all client-side components including LocationGate.
 * Hides navbar and footer on signin/signup pages.
 */
export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const hideNavAndFooter = NO_NAVBAR_FOOTER.includes(pathname || "");

  useEffect(() => {
    dispatch(hydrateWishlist());
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ServiceWorker />
        <LocationGate>
          {!hideNavAndFooter && <Header />}
          {children}
          {!hideNavAndFooter && <Footer />}
          {!hideNavAndFooter && <MobileBottomNav />}
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
