"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthModalContext = createContext({ openAuthModal: () => {}, closeAuthModal: () => {} });

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  return ctx;
}

/**
 * Auth is handled by /signin and /signup pages only (no modals).
 * openAuthModal(initialView) redirects to the signin or signup page with returnUrl so the user comes back after logging in.
 */
export function AuthModalProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const openAuthModal = useCallback(
    (initialView = "signin") => {
      const returnPath = pathname && pathname !== "/signin" && pathname !== "/signup" ? pathname : "/";
      const returnUrl = encodeURIComponent(returnPath);
      if (initialView === "signup") {
        router.push(`/signup?returnUrl=${returnUrl}`);
      } else {
        router.push(`/signin?returnUrl=${returnUrl}`);
      }
    },
    [router, pathname]
  );

  const closeAuthModal = useCallback(() => {
    // No modal; no-op for compatibility
  }, []);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}
