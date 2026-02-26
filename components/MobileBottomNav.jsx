"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@slices/authSlice";
import { useCartMutation } from "@slices/productsApiSlice";
import { useState, useEffect, useCallback } from "react";
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { RiHandHeartLine } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: AiOutlineHome },
  { href: "/subscription", label: "Subscribe", icon: RiHandHeartLine },
  { href: "/cart", label: "Cart", icon: AiOutlineShoppingCart, showBadge: true },
  { href: "/wishlist", label: "Wishlist", icon: FaHeart },
  { href: "/account", label: "Account", icon: AiOutlineUser },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { userInfo } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [fetchCart] = useCartMutation();

  const loadCartCount = useCallback(async () => {
    if (!userInfo?._id) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetchCart(userInfo._id).unwrap();
      const items = res?.data?.CartItems ?? [];
      setCartCount(Array.isArray(items) ? items.length : 0);
    } catch {
      setCartCount(0);
    }
  }, [userInfo?._id, fetchCart]);

  useEffect(() => {
    loadCartCount();
  }, [loadCartCount]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("focus", loadCartCount);
    return () => window.removeEventListener("focus", loadCartCount);
  }, [loadCartCount]);

  return (
    <Box
      as="nav"
      aria-label="Mobile navigation"
      display={{ base: "block", md: "none" }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={999}
      bg="white"
      borderTop="1px solid var(--border)"
      padding="8px 0 max(8px, env(safe-area-inset-bottom))"
      boxShadow="0 -4px 20px rgba(0,0,0,0.08)"
    >
      <Flex justify="space-around" align="center">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
          const isCart = item.showBadge;
          return (
            <Link key={item.label} href={item.href} style={{ position: "relative" }}>
              <Flex
                flexDirection="column"
                alignItems="center"
                gap="3px"
                padding="6px 12px"
                fontSize="10px"
                fontWeight="600"
                color={isActive ? "orange.500" : "var(--muted)"}
                transition="color 0.22s"
              >
                {isCart && cartCount > 0 && (
                  <Box
                    position="absolute"
                    top="2px"
                    right="4px"
                    bg="var(--brand)"
                    color="white"
                    minW="15px"
                    h="15px"
                    borderRadius="full"
                    fontSize="8px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="700"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </Box>
                )}
                <Box as="span" display="inline-flex">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </Box>
                <span>{item.label}</span>
              </Flex>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
}
