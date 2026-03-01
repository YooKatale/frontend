"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "@store";
import ErrorBoundary from "@components/ErrorBoundary";
import { AuthModalProvider } from "@components/AuthModalContext";

export function Providers({ children }) {
  return (
    <ErrorBoundary>
      <CacheProvider>
        <ChakraProvider toastOptions={{ defaultOptions: { position: "bottom" } }}>
          <Provider store={store}>
            <AuthModalProvider>{children}</AuthModalProvider>
          </Provider>
        </ChakraProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}
