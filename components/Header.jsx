"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  Divider,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineSearch,
  AiOutlineHome,
  AiOutlineTeam,
  AiOutlineContacts,
  AiOutlineLogin,
  AiOutlineAppstore,
  AiOutlineCreditCard,
  AiOutlineLogout,
} from "react-icons/ai";
import {
  FaShoppingBag,
  FaChevronDown,
  FaStore,
  FaBlog,
  FaHandshake,
  FaBriefcase,
  FaGift,
  FaWallet,
  FaHeart,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@slices/usersApiSlice";
import { useCartMutation } from "@slices/productsApiSlice";
import { logout, selectAuth } from "@slices/authSlice";
import { ThemeColors, CLIENT_DASHBOARD_URL } from "@constants/constants";
import ReferralModal from "@components/ReferralModal";

const Header = () => {
  const { userInfo } = useSelector(selectAuth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const router = useRouter();
  const push = router?.push ?? (() => {});
  const _toast = useToast();
  const chakraToast = typeof _toast === "function" ? _toast : (typeof _toast?.toast === "function" ? _toast.toast : () => {});
  const btnRef = useRef();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();
  const [fetchCart] = useCartMutation();
  const _disclosure = useDisclosure();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = _disclosure ?? { isOpen: false, onOpen: () => {}, onClose: () => {} };

  const userDisplayName = userInfo?.name || userInfo?.firstname || userInfo?.email || "Account";

  const loadCartCount = useCallback(async () => {
    if (!userInfo?._id) {
      setCartItemsCount(0);
      return;
    }
    try {
      const res = await fetchCart(userInfo._id).unwrap();
      const items = res?.data?.CartItems ?? [];
      setCartItemsCount(Array.isArray(items) ? items.length : 0);
    } catch {
      setCartItemsCount(0);
    }
  }, [userInfo?._id, fetchCart]);

  useEffect(() => {
    loadCartCount();
  }, [loadCartCount]);

  useEffect(() => {
    const onFocus = () => loadCartCount();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }
  }, [loadCartCount]);

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!searchParam)
      return chakraToast({
        title: "Search Required",
        description: "Please enter a search term",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    push(`/search?q=${searchParam}`);
  };

  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
  };
  const closeMobileNav = () => setMobileNavOpen(false);

  const handleLogout = async () => {
    try {
      try {
        await logoutUser().unwrap();
      } catch (e) {
        console.warn("Logout API error:", e);
      }
      dispatch(logout());
      if (typeof window !== "undefined") {
        localStorage.removeItem("yookatale-app");
        sessionStorage.clear();
      }
      chakraToast({
        title: "Logged Out Successfully",
        description: "Come back soon!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      push("/");
    } catch (err) {
      console.error("Logout error:", err);
      chakraToast({
        title: "Error",
        description: "Could not log out. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const navLinks = [
    { label: "Home", href: "/", icon: AiOutlineHome },
    { label: "Categories", href: "/products", icon: AiOutlineAppstore },
    { label: "Marketplace", href: "/marketplace", icon: FaStore },
    { label: "SELL", href: CLIENT_DASHBOARD_URL, icon: FaStore, isSell: true },
    { label: "About", href: "/about", icon: AiOutlineTeam },
    { label: "Blog", href: "/news", icon: FaBlog },
    { label: "Careers", href: "/careers", icon: FaBriefcase },
    { label: "Contact", href: "/contact", icon: AiOutlineContacts },
    { label: "Partner", href: "/partner", icon: FaHandshake },
    { label: "Subscribe", href: "/subscription", icon: AiOutlineCreditCard },
    { label: "Cashout", href: "/cashout", icon: FaWallet },
    { label: "Invite a friend", href: "/#refer", icon: FaGift, isInvite: true },
    { label: "Sign Up", href: "/signup", icon: AiOutlineLogin, hideWhenLoggedIn: true },
  ];

  const visibleNavLinks = navLinks.filter(
    (link) => !link.hideWhenLoggedIn || !userInfo
  );

  const openInviteModal = () => {
    closeMobileNav();
    openReferral();
  };

  return (
    <>
      <Box
        as="header"
        bg="white"
        position="sticky"
        top={0}
        zIndex="1000"
        boxShadow="0 2px 8px rgba(0,0,0,0.04)"
        backdropFilter="blur(10px)"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        {/* Top Navigation Bar - Desktop Only */}
        <Box
          display={{ base: "none", lg: "block" }}
          bg="linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)"
          borderBottom="1px solid"
          borderColor="gray.100"
        >
          <Flex
            as="nav"
            align="center"
            justify="center"
            gap={{ lg: 2, xl: 4 }}
            maxW="1400px"
            mx="auto"
            px={6}
            py={2.5}
            flexWrap="wrap"
          >
            {visibleNavLinks.map((link) => {
              if (link.isInvite) {
                return (
                  <Button
                    key="invite"
                    variant="ghost"
                    size="sm"
                    fontSize="0.875rem"
                    fontWeight="600"
                    color="gray.700"
                    px={3}
                    py={2}
                    h="auto"
                    borderRadius="lg"
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      bg: "white",
                      color: ThemeColors.darkColor,
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(124, 193, 68, 0.15)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    onClick={openReferral}
                  >
                    {link.label}
                  </Button>
                );
              }
              if (link.isSell) {
                return (
                  <Button
                    key="sell"
                    as={Link}
                    href={link.href}
                    size="sm"
                    fontSize="0.9375rem"
                    fontWeight="700"
                    color="white"
                    bg={ThemeColors.primaryColor}
                    px={4}
                    py={2.5}
                    h="auto"
                    borderRadius="lg"
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      bg: ThemeColors.secondaryColor,
                      color: "white",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(24, 95, 45, 0.35)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                  >
                    {link.label}
                  </Button>
                );
              }
              return (
                <Link key={link.href} href={link.href}>
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    px={3}
                    py={2}
                    borderRadius="lg"
                    fontSize="0.875rem"
                    fontWeight="600"
                    color="gray.700"
                    cursor="pointer"
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      bg: "white",
                      color: ThemeColors.darkColor,
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(124, 193, 68, 0.15)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                  >
                    {link.label}
                  </Box>
                </Link>
              );
            })}
          </Flex>
        </Box>

        {/* Main Navigation Bar */}
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          maxW="1400px"
          px={{ base: 4, md: 6 }}
          mx="auto"
          h={{ base: "72px", md: "80px" }}
        >
          {/* Logo */}
          <Flex align="center" flexShrink={0}>
            <Link href="/">
              <Box
                as="span"
                display="flex"
                alignItems="center"
                transition="all 0.2s"
                _hover={{ transform: "scale(1.02)" }}
                _active={{ transform: "scale(0.98)" }}
              >
                <Image
                  src="/assets/icons/logo2.png"
                  alt="YooKatale Logo"
                  height={60}
                  width={120}
                  priority
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Link>
          </Flex>

          {/* Desktop Search Bar */}
          <Box
            mx={6}
            flex="1"
            maxW="650px"
            display={{ base: "none", md: "block" }}
          >
            <form onSubmit={handleSearchFormSubmit}>
              <InputGroup size="lg">
                <InputLeftElement h="full" pointerEvents="none">
                  <AiOutlineSearch color="#A0AEC0" size={20} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search for fresh produce, groceries..."
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                  fontSize="0.9375rem"
                  h="52px"
                  borderRadius="xl"
                  bg="gray.50"
                  borderWidth="2px"
                  borderColor="gray.200"
                  pl="3rem"
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  _placeholder={{ color: "gray.400" }}
                  _hover={{
                    bg: "white",
                    borderColor: "gray.300",
                  }}
                  _focus={{
                    bg: "white",
                    borderColor: ThemeColors.darkColor,
                    boxShadow: `0 0 0 4px ${ThemeColors.darkColor}15`,
                    outline: "none",
                  }}
                />
              </InputGroup>
            </form>
          </Box>

          {/* Desktop Right Actions */}
          <HStack spacing={3} display={{ base: "none", md: "flex" }}>
            {/* Call Button */}
            <Button
              as={Link}
              href="tel:+256786118137"
              leftIcon={<AiOutlinePhone size={18} />}
              bg="linear-gradient(135deg, #F6AD55 0%, #ED8936 100%)"
              color="white"
              size="md"
              fontSize="0.875rem"
              fontWeight="600"
              px={5}
              h="48px"
              borderRadius="xl"
              boxShadow="0 4px 12px rgba(246, 173, 85, 0.25)"
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(246, 173, 85, 0.35)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
            >
              Call Us
            </Button>

            {/* Wishlist Button */}
            <IconButton
              aria-label="Wishlist"
              icon={<FaHeart size={20} />}
              variant="ghost"
              size="lg"
              h="48px"
              w="48px"
              borderRadius="xl"
              color="gray.600"
              transition="all 0.2s"
              _hover={{
                bg: "red.50",
                color: "red.500",
                transform: "scale(1.05)",
              }}
              _active={{ transform: "scale(0.95)" }}
            />

            {/* Cart Button with Badge */}
            <Link href="/cart">
              <Box position="relative" as="span" display="inline-block">
                <IconButton
                  aria-label="Shopping Cart"
                  icon={<AiOutlineShoppingCart size={22} />}
                  variant="ghost"
                  size="lg"
                  h="48px"
                  w="48px"
                  borderRadius="xl"
                  color="gray.600"
                  transition="all 0.2s"
                  _hover={{
                    bg: "green.50",
                    color: ThemeColors.darkColor,
                    transform: "scale(1.05)",
                  }}
                  _active={{ transform: "scale(0.95)" }}
                />
                {cartItemsCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-4px"
                    right="-4px"
                    bg="linear-gradient(135deg, #E53E3E 0%, #C53030 100%)"
                    color="white"
                    borderRadius="full"
                    fontSize="0.7rem"
                    minW="22px"
                    h="22px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="700"
                    boxShadow="0 2px 8px rgba(229, 62, 62, 0.4)"
                    border="2px solid white"
                  >
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </Badge>
                )}
              </Box>
            </Link>

            {/* User Menu */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="lg"
                h="48px"
                px={3}
                borderRadius="xl"
                color="gray.700"
                rightIcon={<FaChevronDown size={12} />}
                transition="all 0.2s"
                _hover={{
                  bg: "green.50",
                  color: ThemeColors.darkColor,
                }}
                _active={{
                  bg: "green.100",
                }}
              >
                <HStack spacing={2.5}>
                  <Avatar
                    size="sm"
                    name={userDisplayName}
                    bg={ThemeColors.darkColor}
                    color="white"
                    fontSize="0.75rem"
                    fontWeight="700"
                  />
                  <Text fontSize="0.9375rem" fontWeight="600" display={{ base: "none", lg: "block" }}>
                    {userDisplayName}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList
                py={0}
                borderRadius="xl"
                borderColor="gray.200"
                borderWidth="2px"
                boxShadow="0 10px 40px rgba(0,0,0,0.12)"
                minW="240px"
                overflow="hidden"
              >
                {userInfo ? (
                  <>
                    <Box px={4} py={3} bg="gray.50">
                      <Text fontSize="0.75rem" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                        Account
                      </Text>
                      <Text fontSize="0.9375rem" fontWeight="600" color="gray.800" mt={1}>
                        {userDisplayName}
                      </Text>
                      {userInfo?.email && (
                        <Text fontSize="0.8125rem" color="gray.500" mt={0.5}>
                          {userInfo.email}
                        </Text>
                      )}
                    </Box>
                    <Divider />
                    <MenuItem
                      as={Link}
                      href="/account"
                      py={3}
                      px={4}
                      fontSize="0.9375rem"
                      fontWeight="500"
                      icon={<AiOutlineUser size={18} />}
                      transition="all 0.2s"
                      _hover={{
                        bg: "green.50",
                        color: ThemeColors.darkColor,
                      }}
                    >
                      My Account
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href="/invoices"
                      py={3}
                      px={4}
                      fontSize="0.9375rem"
                      fontWeight="500"
                      icon={<FaShoppingBag size={16} />}
                      transition="all 0.2s"
                      _hover={{
                        bg: "green.50",
                        color: ThemeColors.darkColor,
                      }}
                    >
                      My Orders
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      py={3}
                      px={4}
                      fontSize="0.9375rem"
                      fontWeight="500"
                      icon={<AiOutlineLogout size={18} />}
                      color="red.600"
                      transition="all 0.2s"
                      _hover={{
                        bg: "red.50",
                        color: "red.700",
                      }}
                      onClick={handleLogout}
                    >
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      as={Link}
                      href="/signin"
                      py={3}
                      px={4}
                      fontSize="0.9375rem"
                      fontWeight="500"
                      icon={<AiOutlineLogin size={18} />}
                      transition="all 0.2s"
                      _hover={{
                        bg: "green.50",
                        color: ThemeColors.darkColor,
                      }}
                    >
                      Sign In
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href="/signup"
                      py={3}
                      px={4}
                      fontSize="0.9375rem"
                      fontWeight="500"
                      transition="all 0.2s"
                      _hover={{
                        bg: "green.50",
                        color: ThemeColors.darkColor,
                      }}
                    >
                      Create Account
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </HStack>

          {/* Mobile Right Actions */}
          <HStack spacing={2} display={{ base: "flex", md: "none" }}>
            {/* Mobile Cart */}
            <Link href="/cart">
              <Box position="relative" as="span" display="inline-block">
                <IconButton
                  aria-label="Shopping Cart"
                  icon={<AiOutlineShoppingCart size={22} />}
                  variant="ghost"
                  size="lg"
                  h="44px"
                  w="44px"
                  borderRadius="xl"
                  color="gray.600"
                  _hover={{
                    bg: "green.50",
                    color: ThemeColors.darkColor,
                  }}
                />
                {cartItemsCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    bg="linear-gradient(135deg, #E53E3E 0%, #C53030 100%)"
                    color="white"
                    borderRadius="full"
                    fontSize="0.65rem"
                    minW="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="700"
                    boxShadow="0 2px 6px rgba(229, 62, 62, 0.4)"
                    border="2px solid white"
                  >
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </Badge>
                )}
              </Box>
            </Link>

            {/* Mobile Menu Toggle */}
            <IconButton
              ref={btnRef}
              aria-label="Menu"
              icon={mobileNavOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              variant="ghost"
              size="lg"
              h="44px"
              w="44px"
              borderRadius="xl"
              color="gray.700"
              transition="all 0.2s"
              _hover={{
                bg: "green.50",
                color: ThemeColors.darkColor,
              }}
              onClick={toggleMobileNav}
            />
          </HStack>
        </Flex>

        {/* Mobile Search Bar */}
        <Box
          display={{ base: "block", md: "none" }}
          px={4}
          pb={4}
          bg="white"
        >
          <form onSubmit={handleSearchFormSubmit}>
            <InputGroup>
              <InputLeftElement h="full" pointerEvents="none">
                <AiOutlineSearch color="#A0AEC0" size={18} />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                fontSize="0.9375rem"
                h="48px"
                borderRadius="xl"
                bg="gray.50"
                borderWidth="2px"
                borderColor="gray.200"
                pl="2.75rem"
                transition="all 0.2s"
                _placeholder={{ color: "gray.400" }}
                _focus={{
                  bg: "white",
                  borderColor: ThemeColors.darkColor,
                  boxShadow: `0 0 0 3px ${ThemeColors.darkColor}15`,
                  outline: "none",
                }}
              />
            </InputGroup>
          </form>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          isOpen={mobileNavOpen}
          placement="right"
          onClose={closeMobileNav}
          finalFocusRef={btnRef}
          size="xs"
        >
          <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <DrawerContent borderLeftRadius="2xl" maxW="340px">
            <DrawerCloseButton
              size="lg"
              top={4}
              right={4}
              borderRadius="lg"
              _hover={{ bg: "gray.100" }}
            />
            <DrawerHeader borderBottomWidth="2px" borderColor="gray.100" pt={6} pb={4}>
              {userInfo ? (
                <HStack spacing={3}>
                  <Avatar
                    size="md"
                    name={userDisplayName}
                    bg={ThemeColors.darkColor}
                    color="white"
                    fontWeight="700"
                  />
                  <Box>
                    <Text fontSize="1rem" fontWeight="700" color="gray.800">
                      {userDisplayName}
                    </Text>
                    {userInfo?.email && (
                      <Text fontSize="0.8125rem" color="gray.500" fontWeight="500">
                        {userInfo.email}
                      </Text>
                    )}
                  </Box>
                </HStack>
              ) : (
                <HStack spacing={3}>
                  <Avatar
                    size="md"
                    bg="gray.300"
                    icon={<AiOutlineUser size={24} />}
                  />
                  <Text fontSize="1rem" fontWeight="700" color="gray.800">
                    Welcome!
                  </Text>
                </HStack>
              )}
            </DrawerHeader>

            <DrawerBody px={0} py={0}>
              <VStack align="stretch" spacing={0}>
                {visibleNavLinks.map((link, index) => {
                  const Icon = link.icon;
                  if (link.isInvite) {
                    return (
                      <Flex
                        key="invite"
                        as="button"
                        type="button"
                        align="center"
                        px={6}
                        py={4}
                        w="full"
                        textAlign="left"
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        transition="all 0.2s"
                        _hover={{
                          bg: "green.50",
                          pl: 7,
                        }}
                        _active={{ bg: "green.100" }}
                        onClick={openInviteModal}
                      >
                        <Flex
                          align="center"
                          justify="center"
                          w="36px"
                          h="36px"
                          borderRadius="lg"
                          bg="green.50"
                          color={ThemeColors.darkColor}
                          mr={3}
                        >
                          <Icon size={18} />
                        </Flex>
                        <Text fontSize="0.9375rem" fontWeight="600" color="gray.700">
                          {link.label}
                        </Text>
                      </Flex>
                    );
                  }
                  if (link.isSell) {
                    return (
                      <Link
                        key="sell"
                        href={link.href}
                        onClick={closeMobileNav}
                        display="block"
                        mx={4}
                        mt={3}
                        mb={2}
                      >
                        <Flex
                          align="center"
                          justify="center"
                          px={6}
                          py={4}
                          borderRadius="xl"
                          bg={ThemeColors.primaryColor}
                          color="white"
                          fontWeight="700"
                          fontSize="1rem"
                          transition="all 0.2s"
                          _active={{ bg: ThemeColors.secondaryColor }}
                        >
                          {link.label}
                        </Flex>
                      </Link>
                    );
                  }
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileNav}
                    >
                      <Flex
                        align="center"
                        px={6}
                        py={4}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        transition="all 0.2s"
                        _hover={{
                          bg: "green.50",
                          pl: 7,
                        }}
                        _active={{ bg: "green.100" }}
                      >
                        <Flex
                          align="center"
                          justify="center"
                          w="36px"
                          h="36px"
                          borderRadius="lg"
                          bg="gray.100"
                          color="gray.600"
                          mr={3}
                        >
                          <Icon size={18} />
                        </Flex>
                        <Text fontSize="0.9375rem" fontWeight="600" color="gray.700">
                          {link.label}
                        </Text>
                      </Flex>
                    </Link>
                  );
                })}

                {/* Mobile Account Section */}
                {userInfo && (
                  <>
                    <Box px={6} py={3} bg="gray.50" mt={2}>
                      <Text fontSize="0.75rem" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                        My Account
                      </Text>
                    </Box>
                    <Link href="/account" onClick={closeMobileNav}>
                      <Flex
                        align="center"
                        px={6}
                        py={4}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        transition="all 0.2s"
                        _hover={{
                          bg: "green.50",
                          pl: 7,
                        }}
                      >
                        <Flex
                          align="center"
                          justify="center"
                          w="36px"
                          h="36px"
                          borderRadius="lg"
                          bg="blue.50"
                          color="blue.500"
                          mr={3}
                        >
                          <AiOutlineUser size={18} />
                        </Flex>
                        <Text fontSize="0.9375rem" fontWeight="600" color="gray.700">
                          Profile
                        </Text>
                      </Flex>
                    </Link>
                    <Link href="/invoices" onClick={closeMobileNav}>
                      <Flex
                        align="center"
                        px={6}
                        py={4}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        transition="all 0.2s"
                        _hover={{
                          bg: "green.50",
                          pl: 7,
                        }}
                      >
                        <Flex
                          align="center"
                          justify="center"
                          w="36px"
                          h="36px"
                          borderRadius="lg"
                          bg="purple.50"
                          color="purple.500"
                          mr={3}
                        >
                          <FaShoppingBag size={16} />
                        </Flex>
                        <Text fontSize="0.9375rem" fontWeight="600" color="gray.700">
                          My Orders
                        </Text>
                      </Flex>
                    </Link>
                  </>
                )}

                {/* Call Button in Mobile */}
                <Box px={6} py={6} bg="gray.50" mt="auto">
                  <Button
                    as="a"
                    href="tel:+256786118137"
                    w="full"
                    h="56px"
                    leftIcon={<AiOutlinePhone size={20} />}
                    bg="linear-gradient(135deg, #F6AD55 0%, #ED8936 100%)"
                    color="white"
                    fontSize="1rem"
                    fontWeight="700"
                    borderRadius="xl"
                    boxShadow="0 4px 12px rgba(246, 173, 85, 0.3)"
                    transition="all 0.2s"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(246, 173, 85, 0.4)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    onClick={closeMobileNav}
                  >
                    Call +256 786 118137
                  </Button>

                  {userInfo && (
                    <Button
                      w="full"
                      h="52px"
                      mt={3}
                      leftIcon={<AiOutlineLogout size={18} />}
                      variant="outline"
                      colorScheme="red"
                      fontSize="0.9375rem"
                      fontWeight="600"
                      borderRadius="xl"
                      borderWidth="2px"
                      transition="all 0.2s"
                      _hover={{
                        bg: "red.50",
                        transform: "translateY(-1px)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  )}
                </Box>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />
      </Box>
    </>
  );
};

export default Header;
