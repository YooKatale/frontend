"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Box,
  Flex,
  VStack,
  Text,
  useColorModeValue,
  Spinner,
  Center,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useLastSeenMutation } from "@slices/sellerApiSlice";
import {
  RiStore2Line,
  RiListCheck2,
  RiAddCircleLine,
  RiDashboardLine,
  RiUserLine,
  RiBarChartBoxLine,
  RiFileList3Line,
  RiMenuLine,
} from "react-icons/ri";

const nav = [
  { href: "/sell", label: "Dashboard", Icon: RiDashboardLine },
  { href: "/sell/stores", label: "My Stores", Icon: RiStore2Line },
  { href: "/sell/listings", label: "My Listings", Icon: RiListCheck2 },
  { href: "/sell/listings/new", label: "Add Listing", Icon: RiAddCircleLine },
  { href: "/sell/orders", label: "Orders", Icon: RiFileList3Line },
  { href: "/sell/performance", label: "Performance", Icon: RiBarChartBoxLine },
  { href: "/sell/profile", label: "Profile", Icon: RiUserLine },
];

export default function SellerLayout({ children }) {
  const { userInfo } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const [lastSeen] = useLastSeenMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // All hooks must be called before any conditional returns
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const activeBg = ThemeColors.primaryColor;
  const activeColor = "white";
  const inactiveColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const contentBg = useColorModeValue("gray.50", "gray.900");

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!userInfo) {
      router.push("/signin?redirect=sell");
    }
  }, [userInfo, router]);

  // Last-seen heartbeat (PATCH /seller/me/last-seen) every 2 min while in dashboard
  const heartbeatRef = useRef(null);
  useEffect(() => {
    if (!userInfo) return;
    const tick = () => {
      lastSeen().catch(() => {});
    };
    tick();
    heartbeatRef.current = setInterval(tick, 2 * 60 * 1000);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [userInfo, lastSeen]);

  if (!userInfo) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color={ThemeColors.primaryColor} />
      </Center>
    );
  }

  const displayName =
    [userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") ||
    userInfo?.email ||
    "Seller";

  const SidebarContent = () => (
    <VStack align="stretch" spacing={2}>
      <Text
        fontSize="lg"
        fontWeight="bold"
        color={ThemeColors.primaryColor}
        mb={2}
        display={{ base: "none", md: "block" }}
      >
        Seller Center
      </Text>
      <Text
        fontSize="sm"
        color="gray.500"
        mb={4}
        display={{ base: "none", md: "block" }}
      >
        {displayName}
      </Text>
      {nav.map(({ href, label, Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/sell" && pathname?.startsWith(href));
        return (
          <Link key={href} href={href} onClick={() => onClose()}>
            <Flex
              align="center"
              gap={2}
              px={4}
              py={2.5}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="medium"
              transition="all 0.2s"
              bg={isActive ? activeBg : "transparent"}
              color={isActive ? activeColor : inactiveColor}
              _hover={{
                bg: isActive ? activeBg : hoverBg,
              }}
            >
              <Icon size={20} />
              <Text>{label}</Text>
            </Flex>
          </Link>
        );
      })}
    </VStack>
  );

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
      {/* Mobile Hamburger Button */}
      <IconButton
        aria-label="Open menu"
        icon={<RiMenuLine />}
        onClick={onOpen}
        display={{ base: "block", md: "none" }}
        position="fixed"
        top={4}
        left={4}
        zIndex={1000}
        bg={ThemeColors.primaryColor}
        color="white"
        _hover={{ bg: ThemeColors.secondaryColor }}
        size="md"
      />

      {/* Desktop Sidebar */}
      <Box
        as="aside"
        w={{ base: "100%", md: "240px" }}
        bg={sidebarBg}
        borderBottom={{ base: "1px", md: "none" }}
        borderRight={{ base: "none", md: "1px" }}
        borderColor={borderColor}
        p={{ base: 4, md: 6 }}
        display={{ base: "none", md: "block" }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text color={ThemeColors.primaryColor} fontWeight="bold">
              Seller Center
            </Text>
            <Text fontSize="sm" color="gray.500">
              {displayName}
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex="1" p={{ base: 4, md: 6 }} bg={contentBg} pt={{ base: 16, md: 6 }}>
        {children}
      </Box>
    </Flex>
  );
}
