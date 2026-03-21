"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "@store";
import ErrorBoundary from "@components/ErrorBoundary";
import { AuthModalProvider } from "@components/AuthModalContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  return (
    <ErrorBoundary>
      <CacheProvider>
        <ChakraProvider toastOptions={{ defaultOptions: { position: "bottom" } }}>
          <Provider store={store}>
            <AuthModalProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: { borderRadius: "10px", fontFamily: "inherit", fontSize: "0.875rem" },
                  success: { iconTheme: { primary: "#185f2d", secondary: "#fff" } },
                }}
              />
            </AuthModalProvider>
          </Provider>
        </ChakraProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}
