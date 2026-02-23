"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "@store";
import ErrorBoundary from "@components/ErrorBoundary";

export function Providers({ children }) {
  return (
    <ErrorBoundary>
      <CacheProvider>
        <ChakraProvider toastOptions={{ defaultOptions: { position: "bottom" } }}>
          <Provider store={store}>{children}</Provider>
        </ChakraProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}
