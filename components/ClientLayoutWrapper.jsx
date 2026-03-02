"use client";

import { Suspense, useEffect, useRef } from "react";
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
import { useAuth } from "@slices/authSlice";
import { setCredentials } from "@slices/authSlice";
import { DB_URL } from "@config/config";

const NO_NAVBAR_FOOTER = ["/signin", "/signup"];

function AuthSync() {
  const { userInfo } = useAuth();
  const dispatch = useDispatch();
  const didRefetch = useRef(false);

  if (!userInfo?._id) didRefetch.current = false;

  useEffect(() => {
    if (!userInfo?.token && !userInfo?.accessToken) return;
    if (didRefetch.current) return;
    didRefetch.current = true;
    const base = DB_URL.replace(/\/api\/?$/, "");
    let cancelled = false;
    (async () => {
      try {
        const token = userInfo?.token ?? userInfo?.accessToken;
        const res = await fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
        const json = await res.json().catch(() => ({}));
        const fullUser = json?.data ?? json?.user ?? json;
        if (cancelled) return;
        if (fullUser && (fullUser._id || fullUser.id)) {
          dispatch(setCredentials({ ...userInfo, ...fullUser }));
        }
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, [userInfo?._id, dispatch]);

  useEffect(() => {
    const onFocus = () => {
      const token = userInfo?.token ?? userInfo?.accessToken;
      if (!token) return;
      const base = DB_URL.replace(/\/api\/?$/, "");
      fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" })
        .then((r) => r.json().catch(() => ({})))
        .then((json) => {
          const fullUser = json?.data ?? json?.user ?? json;
          if (fullUser && (fullUser._id || fullUser.id)) {
            dispatch(setCredentials({ ...userInfo, ...fullUser }));
          }
        })
        .catch(() => {});
    };
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }
  }, [userInfo?._id, userInfo?.token, dispatch]);

  return null;
}

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
      <AuthSync />
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
