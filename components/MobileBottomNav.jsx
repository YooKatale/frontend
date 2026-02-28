"use client";

import { Box, Flex, Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@slices/authSlice";
import { useCartMutation } from "@slices/productsApiSlice";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser, AiOutlineBarChart } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { getUserAvatarUrl } from "@constants/constants";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: AiOutlineHome },
  { href: "/subscription", label: "Subscribe", icon: AiOutlineBarChart },
  { href: "/cart", label: "Cart", icon: AiOutlineShoppingCart, showBadge: "cart" },
  { href: "/wishlist", label: "Wishlist", icon: FaHeart, showBadge: "wishlist" },
  { href: "/account", label: "Account", icon: AiOutlineUser },
];

const ACTIVE_COLOR = "#1a5c1a";
const INACTIVE_COLOR = "#8a9e87";
const BADGE_BG = "#e07820";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { userInfo } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [fetchCart] = useCartMutation();
  const wishlistItems = useSelector((s) => s.wishlist?.items ?? []);
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

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
      borderTop="1px solid rgba(0,0,0,0.06)"
      padding="10px 0 max(10px, env(safe-area-inset-bottom))"
      boxShadow="0 -4px 24px rgba(0,0,0,0.08)"
      fontFamily="'Sora', sans-serif"
    >
      <Flex justify="space-around" align="center">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
          const badgeType = item.showBadge;
          const badgeCount = badgeType === "cart" ? cartCount : badgeType === "wishlist" ? wishlistCount : 0;
          const isAccount = item.href === "/account";
          const showAvatar = isAccount && userInfo && getUserAvatarUrl(userInfo);
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
          return (
            <Link key={item.label} href={item.href} style={{ position: "relative", textDecoration: "none" }}>
              <Flex
                flexDirection="column"
                alignItems="center"
                gap="4px"
                padding="6px 14px"
                fontSize="10px"
                fontWeight={isActive ? 700 : 600}
                color={color}
                transition="color 0.2s"
              >
                {badgeType && badgeCount > 0 && (
                  <Box
                    position="absolute"
                    top="0"
                    right="2px"
                    bg={BADGE_BG}
                    color="white"
                    minW="16px"
                    h="16px"
                    borderRadius="full"
                    fontSize="9px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="800"
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </Box>
                )}
                <Box as="span" display="inline-flex" alignItems="center" justifyContent="center">
                  {showAvatar ? (
                    <Avatar
                      size="xs"
                      w="24px"
                      h="24px"
                      name={userInfo?.name || userInfo?.firstname || userInfo?.email}
                      src={getUserAvatarUrl(userInfo)}
                      border="2px solid"
                      borderColor={isActive ? ACTIVE_COLOR : "transparent"}
                      borderRadius="full"
                      objectFit="cover"
                    />
                  ) : (
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  )}
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
