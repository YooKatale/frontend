"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <IconButton
      aria-label="Back to top"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
          <polyline points="18,15 12,9 6,15" />
        </svg>
      }
      position="fixed"
      bottom={{ base: "80px", md: "24px" }}
      right="20px"
      zIndex="900"
      size="lg"
      w="44px"
      h="44px"
      borderRadius="full"
      bg="var(--brand)"
      color="white"
      boxShadow="var(--shadow)"
      opacity={visible ? 1 : 0}
      pointerEvents={visible ? "auto" : "none"}
      transform={visible ? "translateY(0)" : "translateY(10px)"}
      transition="opacity 0.2s, transform 0.2s"
      _hover={{ bg: "var(--brand-dk)", transform: "translateY(-2px)" }}
      onClick={scrollToTop}
    />
  );
}
