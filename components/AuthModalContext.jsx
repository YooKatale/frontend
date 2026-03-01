"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { SignInForm, SignUpForm } from "@components/AuthUI";

const AuthModalContext = createContext({ openAuthModal: () => {}, closeAuthModal: () => {} });

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  return ctx;
}

export function AuthModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("signin");
  const toast = useToast();

  const openAuthModal = useCallback((initialView = "signin") => {
    setView(initialView === "signup" ? "signup" : "signin");
    setOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setOpen(false);
    toast({ title: "Signed in successfully", status: "success", duration: 2000, isClosable: true });
  }, [toast]);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "rgba(0,0,0,.5)",
            backdropFilter: "blur(8px)",
            animation: "fadeIn .2s ease-out",
          }}
          onClick={(e) => e.target === e.currentTarget && closeAuthModal()}
        >
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
          <div style={{ position: "relative", maxHeight: "90vh", overflow: "auto", borderRadius: 28 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Close"
              onClick={closeAuthModal}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 10,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,.08)",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                color: "#445444",
              }}
            >
              ×
            </button>
            {view === "signin" ? (
              <SignInForm
                compact
                onSuccess={handleSuccess}
                onSwitch={() => setView("signup")}
              />
            ) : (
              <SignUpForm
                onSuccess={handleSuccess}
                onSwitch={() => setView("signin")}
              />
            )}
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}
