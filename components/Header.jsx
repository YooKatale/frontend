"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
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
  Select,
  Icon,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  AiOutlineLogout,
  AiOutlineQuestionCircle,
  AiOutlineInfoCircle,
  AiOutlineBarChart,
} from "react-icons/ai";
import {
  FaShoppingBag,
  FaChevronDown,
  FaStore,
  FaStar,
  FaBlog,
  FaHandshake,
  FaBriefcase,
  FaGift,
  FaWallet,
  FaHeart,
  FaTruck,
  FaBolt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@slices/usersApiSlice";
import { useCartMutation } from "@slices/productsApiSlice";
import { logout, useAuth } from "@slices/authSlice";
import { ThemeColors, CLIENT_DASHBOARD_URL, CategoriesJson, getUserAvatarUrl } from "@constants/constants";
import ReferralModal from "@components/ReferralModal";

// Categories to hide from the navbar strip (case-insensitive)
const NAVBAR_HIDDEN_CATEGORIES = [
  "vitamins", "protein", "dairy", "vegetables", "fats and oils", "root tubers",
  "carbohydrates", "herbs and spices", "breakfast", "markets & shops nearby",
  "juice", "meals", "cuisines", "kitchen", "supplements",
];

const PLAY_STORE_APP_URL = "https://play.google.com/store/apps/details?id=com.yookataleapp.app&pcampaignid=web_share";

const Header = () => {
  const { userInfo } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const mobileSearchRef = useRef(null);
  const { push } = useRouter();
  const pathname = usePathname() ?? "";
  const chakraToast = useToast();
  const btnRef = useRef();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();
  const [fetchCart] = useCartMutation();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();

  const userDisplayName = userInfo?.name || userInfo?.firstname || userInfo?.email || "Account";
  const wishlistItems = useSelector((s) => s.wishlist?.items ?? []);
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    const q = searchParam.trim();
    const cat = searchCategory && searchCategory !== "All" ? `&category=${encodeURIComponent(searchCategory)}` : "";
    push(`/search?q=${encodeURIComponent(q)}${cat}`);
  };

  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
  };
  const closeMobileNav = () => setMobileNavOpen(false);

  const handleLogout = async () => {
    closeMobileNav();
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
    { label: "Marketplace", href: "/marketplace", icon: FaShoppingBag, badge: "New" },
    { label: "Promotions", href: "/search?q=promotions", icon: FaBolt, badge: "HOT" },
    { label: "SELL", href: CLIENT_DASHBOARD_URL, icon: FaStore, isSell: true },
    { label: "About", href: "/about", icon: AiOutlineInfoCircle },
    { label: "Blog", href: "/news", icon: FaBlog },
    { label: "Careers", href: "/careers", icon: FaBriefcase, badge: "Hiring" },
    { label: "Contact", href: "/contact", icon: AiOutlineContacts },
    { label: "Partner", href: "/partner", icon: FaHandshake },
    { label: "Subscribe", href: "/subscription", icon: AiOutlineBarChart },
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
      {/* Sticky nav: search, logo, toggle (+ account/cart on desktop) */}
      <Box
        as="header"
        bg="white"
        position="sticky"
        top={0}
        zIndex="1000"
        boxShadow={scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)"}
        backdropFilter="blur(10px)"
        borderBottom="1px solid"
        borderColor="rgba(0,0,0,0.06)"
        transition="box-shadow var(--transition, 0.2s ease)"
        fontFamily="'Sora', sans-serif"
      >
        {/* Main Navigation Bar */}
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          gap={{ base: 2, md: 4 }}
          maxW="1400px"
          px={{ base: 3, md: 6 }}
          py={{ base: 2, md: 0 }}
          mx="auto"
          h={{ base: "56px", md: "64px" }}
          minH={{ base: "56px", md: "64px" }}
        >
          {/* Left: Desktop only – same sidebar toggle + Logo (opens same drawer as mobile) */}
          <HStack spacing={{ base: 2, md: 3 }} flexShrink={0} display={{ base: "none", md: "flex" }}>
            <IconButton
              aria-label="Menu"
              icon={mobileNavOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
              variant="ghost"
              size="lg"
              h="44px"
              w="44px"
              borderRadius="lg"
              color="gray.700"
              _hover={{ bg: "gray.50", color: ThemeColors.primaryColor }}
              _active={{ bg: "gray.100" }}
              onClick={toggleMobileNav}
            />

            {/* Logo – to the right of menu */}
            <Flex align="center" minW={0}>
              <Link href="/">
                <Box
                  as="span"
                  display="flex"
                  alignItems="center"
                  w={{ base: "100px", sm: "120px", md: "140px" }}
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.02)" }}
                  _active={{ transform: "scale(0.98)" }}
                >
                  <Image
                    src="/assets/icons/logo2.png"
                    alt="Yookatale"
                    width={140}
                    height={48}
                    priority
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  />
                </Box>
              </Link>
            </Flex>
          </HStack>

          {/* Mobile: Menu toggle – extreme left */}
          <Box display={{ base: "block", md: "none" }} flexShrink={0}>
            <IconButton
              ref={btnRef}
              aria-label="Menu"
              icon={mobileNavOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              variant="ghost"
              size="lg"
              h="48px"
              w="48px"
              minW="48px"
              borderRadius="lg"
              color="gray.700"
              _hover={{ bg: "gray.50", color: ThemeColors.darkColor }}
              _active={{ bg: "gray.100" }}
              onClick={toggleMobileNav}
            />
          </Box>

          {/* Mobile: search bar always visible – orange border, magnifying glass, placeholder (same as image) */}
          <Flex
            as="form"
            onSubmit={handleSearchFormSubmit}
            display={{ base: "flex", md: "none" }}
            flex="1"
            minW={0}
            mx={1}
            align="center"
            h="48px"
            borderRadius="12px"
            bg="#edf0ea"
            borderWidth="1.5px"
            borderColor="#1a5c1a"
            overflow="hidden"
            _focusWithin={{ borderColor: "#2d8c2d", boxShadow: "0 0 0 2px rgba(26, 92, 26, 0.2)" }}
          >
            <InputGroup size="md" flex="1" minW={0}>
              <InputLeftElement h="48px" pl={3} pointerEvents="none">
                <AiOutlineSearch size={18} color="#637568" />
              </InputLeftElement>
              <Input
                ref={mobileSearchRef}
                type="search"
                placeholder="Search products..."
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                variant="unstyled"
                pl="2.5rem"
                pr={2}
                h="48px"
                fontSize="0.9375rem"
                _placeholder={{ color: "gray.500" }}
              />
            </InputGroup>
          </Flex>

          {/* Desktop Search Bar – balanced width, not stretching into gap */}
          <Flex
            as="form"
            onSubmit={handleSearchFormSubmit}
            flex="1"
            maxW="420px"
            minW="200px"
            mx={{ md: 4, lg: 6 }}
            display={{ base: "none", md: "flex" }}
            align="stretch"
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="lg"
            bg="white"
            overflow="hidden"
            transition="all 0.2s"
            _focusWithin={{
              borderColor: "#1a5c1a",
              boxShadow: "0 0 0 2px rgba(26, 92, 26, 0.2)",
            }}
          >
            <InputGroup flex="1" size="lg">
              <InputLeftElement h="48px" pl={4} pointerEvents="none">
                <AiOutlineSearch size={20} color="var(--muted)" />
              </InputLeftElement>
              <Input
                type="search"
                placeholder="Search products, brands and categories"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                variant="unstyled"
                fontSize="14px"
                pl="3rem"
                pr={4}
                h="48px"
                _placeholder={{ color: "gray.500" }}
              />
            </InputGroup>
            <Button
              type="submit"
              h="48px"
              px={6}
              bg="#1a5c1a"
              color="white"
              fontWeight="700"
              fontSize="0.9375rem"
              borderRadius="0"
              _hover={{ bg: "#2d8c2d" }}
            >
              Search
            </Button>
          </Flex>

          {/* Desktop Right Actions – Account, Help, Cart */}
          <HStack spacing={1} display={{ base: "none", md: "flex" }} flexShrink={0}>
            {/* Account */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="md"
                h="44px"
                px={3}
                borderRadius="lg"
                color="gray.700"
                rightIcon={<FaChevronDown size={10} />}
                leftIcon={
                  getUserAvatarUrl(userInfo) ? (
                    <Avatar
                      size="xs"
                      name={userDisplayName}
                      src={getUserAvatarUrl(userInfo)}
                      bg="green.100"
                      color="gray.700"
                      flexShrink={0}
                      objectFit="cover"
                    />
                  ) : (
                    <AiOutlineUser size={18} />
                  )
                }
                fontWeight="600"
                fontSize="0.875rem"
                _hover={{ bg: "gray.50", color: "#1a5c1a" }}
              >
                Account
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
                      <HStack spacing={3} mb={2}>
                        {getUserAvatarUrl(userInfo) && (
                          <Avatar
                            size="sm"
                            name={userDisplayName}
                            src={getUserAvatarUrl(userInfo)}
                            bg="green.100"
                            color="gray.700"
                            flexShrink={0}
                            objectFit="cover"
                          />
                        )}
                        <VStack align="flex-start" spacing={0} flex={1} minW={0}>
                          <Text fontSize="0.75rem" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                            Account
                          </Text>
                          <Text fontSize="0.9375rem" fontWeight="600" color="gray.800" mt={1} noOfLines={1}>
                            {userDisplayName}
                          </Text>
                          {userInfo?.email && (
                            <Text fontSize="0.8125rem" color="gray.500" mt={0.5} noOfLines={1}>
                              {userInfo.email}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
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
                    bg: "#e6f0e6",
                    color: "#1a5c1a",
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
                    bg: "#e6f0e6",
                    color: "#1a5c1a",
                  }}
                    >
                      My Orders
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href="/cashout"
                      py={3}
                      px={4}
                      fontSize="0.9375rem"
                      fontWeight="500"
                      icon={<FaWallet size={16} />}
                      transition="all 0.2s"
                _hover={{
                    bg: "#e6f0e6",
                    color: "#1a5c1a",
                  }}
                    >
                      Cashout
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
                    bg: "#e6f0e6",
                    color: "#1a5c1a",
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
                    bg: "#e6f0e6",
                    color: "#1a5c1a",
                  }}
                    >
                      Create Account
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>

            {/* Help – dropdown */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="md"
                h="44px"
                px={3}
                borderRadius="lg"
                color="gray.700"
                rightIcon={<FaChevronDown size={10} />}
                leftIcon={<AiOutlineQuestionCircle size={18} />}
                fontWeight="600"
                fontSize="0.875rem"
                _hover={{ bg: "gray.50", color: "#1a5c1a" }}
              >
                Help
              </MenuButton>
              <MenuList minW="200px" py={1}>
                <MenuItem as={Link} href="/faqs" py={2.5}>FAQs</MenuItem>
                <MenuItem as={Link} href="/contact" py={2.5}>Contact Us</MenuItem>
                <MenuItem as={Link} href="/account" py={2.5}>Track Order</MenuItem>
              </MenuList>
            </Menu>

            {/* Wishlist – desktop */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="md"
                h="44px"
                px={3}
                borderRadius="lg"
                color="gray.700"
                leftIcon={<FaHeart size={18} />}
                fontWeight="600"
                fontSize="0.875rem"
                position="relative"
                _hover={{ bg: "gray.50", color: "#1a5c1a" }}
              >
                Wishlist
                {wishlistCount > 0 && (
                  <Badge
                    position="absolute"
                    top="6px"
                    right="2px"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="0.65rem"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="700"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart – icon + label + badge */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="md"
                h="44px"
                px={3}
                borderRadius="lg"
                color="gray.700"
                leftIcon={<AiOutlineShoppingCart size={20} />}
                fontWeight="600"
                fontSize="0.875rem"
                position="relative"
                _hover={{ bg: "gray.50", color: "#1a5c1a" }}
              >
                Cart
                {cartItemsCount > 0 && (
                  <Badge
                    position="absolute"
                    top="6px"
                    right="2px"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="0.65rem"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="700"
                  >
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </HStack>

          {/* Mobile Right – Logo only (cart removed from top bar on mobile) */}
          <HStack spacing={0} display={{ base: "flex", md: "none" }} flexShrink={0}>
            <Link href="/">
              <Box
                as="span"
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="48px"
                w="48px"
                minW="48px"
                transition="all 0.2s"
                _hover={{ transform: "scale(1.02)" }}
                _active={{ transform: "scale(0.98)" }}
              >
                <Image
                  src="/assets/icons/logo2.png"
                  alt="Yookatale"
                  width={48}
                  height={48}
                  style={{ width: "auto", height: "100%", maxWidth: "120px", objectFit: "contain" }}
                />
              </Box>
            </Link>
          </HStack>
        </Flex>

        {/* Category strip - Desktop */}
        <Box
          display={{ base: "none", md: "block" }}
          borderTop="1px solid"
          borderColor="gray.100"
          bg="white"
          overflow="hidden"
        >
          <Flex
            as="nav"
            maxW="1400px"
            mx="auto"
            px={{ md: 4, lg: 6 }}
            py={2}
            gap={1}
            overflowX="auto"
            scrollBehavior="smooth"
            sx={{ "&::-webkit-scrollbar": { height: "4px" }, "&::-webkit-scrollbar-thumb": { bg: "gray.300", borderRadius: "full" } }}
          >
            {CategoriesJson.filter(
              (cat) => !NAVBAR_HIDDEN_CATEGORIES.includes((cat || "").toLowerCase().trim())
            ).map((cat) => (
              <Link key={cat} href={`/search?q=${encodeURIComponent(cat)}`}>
                <Box
                  as="span"
                  display="inline-block"
                  whiteSpace="nowrap"
                  px={4}
                  py={2}
                  borderRadius="lg"
                  fontSize="0.8125rem"
                  fontWeight="600"
                  color="gray.600"
                  transition="all 0.2s"
                  _hover={{
                    bg: ThemeColors.lightColor,
                    color: ThemeColors.primaryColor,
                  }}
                >
                  {cat}
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>

        {/* Mobile Drawer – left sidebar, YooKatale design */}
        <Drawer
          isOpen={mobileNavOpen}
          placement="left"
          onClose={closeMobileNav}
          finalFocusRef={btnRef}
          size="xs"
        >
          <DrawerOverlay bg="rgba(0,0,0,0.45)" backdropFilter="blur(3px)" />
          <DrawerContent maxW="290px" maxH="100vh" h="100%" bg="white" boxShadow="2xl" display="flex" flexDirection="column">
            {/* Top accent */}
            <Box h="3px" bg="linear-gradient(90deg, #1a6b3a 0%, #2d9556 50%, #f5c800 100%)" flexShrink={0} />

            {/* User header – green gradient */}
            <Box
              px="18px"
              pt="18px"
              pb="14px"
              bg="linear-gradient(135deg, #0f3d20 0%, #1a6b3a 100%)"
              position="relative"
              overflow="hidden"
            >
              <Box position="absolute" top="-40px" right="-40px" w="140px" h="140px" bg="radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" borderRadius="full" />
              <Box position="absolute" bottom="-30px" left="-20px" w="100px" h="100px" bg="radial-gradient(circle, rgba(245,200,0,0.07) 0%, transparent 70%)" borderRadius="full" />
              <Flex justify="space-between" align="flex-start" mb="14px">
                {userInfo ? (
                  <HStack spacing={2.5} flex={1} minW={0}>
                    {getUserAvatarUrl(userInfo) ? (
                      <Avatar
                        size="md"
                        w="44px"
                        h="44px"
                        name={userDisplayName}
                        src={getUserAvatarUrl(userInfo)}
                        border="2.5px solid rgba(255,255,255,0.3)"
                        flexShrink={0}
                        bg="#f5c800"
                        color="#0c1a10"
                        objectFit="cover"
                      />
                    ) : (
                      <Flex w="44px" h="44px" borderRadius="full" bg="#f5c800" align="center" justify="center" fontFamily="Syne, sans-serif" fontSize="16px" fontWeight="800" color="#0c1a10" border="2.5px solid rgba(255,255,255,0.3)" flexShrink={0}>
                        {(userDisplayName || "A").slice(0, 2).toUpperCase()}
                      </Flex>
                    )}
                    <Box minW={0}>
                      <Text fontFamily="Syne, sans-serif" fontSize="15px" fontWeight="700" color="white" lineHeight="1" mb="3px" noOfLines={1}>{userDisplayName}</Text>
                      <Text fontSize="11px" color="rgba(255,255,255,0.6)" noOfLines={1}>{userInfo?.email}</Text>
                    </Box>
                  </HStack>
                ) : (
                  <Link href="/signin" onClick={closeMobileNav}>
                    <Button size="sm" colorScheme="green" fontWeight="700">Sign In</Button>
                  </Link>
                )}
                <IconButton
                  aria-label="Close menu"
                  icon={<AiOutlineClose size={16} />}
                  size="sm"
                  w="30px"
                  h="30px"
                  borderRadius="lg"
                  bg="rgba(255,255,255,0.1)"
                  color="white"
                  _hover={{ bg: "rgba(255,255,255,0.2)" }}
                  onClick={closeMobileNav}
                  flexShrink={0}
                />
              </Flex>
              {userInfo && (
                <Flex gridTemplateColumns="repeat(3,1fr)" gap={0} bg="rgba(255,255,255,0.06)" borderRadius="12px" overflow="hidden" as="div" display="grid">
                  <Box py="9px" textAlign="center" borderRight="1px solid rgba(255,255,255,0.08)">
                    <Text fontFamily="Syne, sans-serif" fontSize="14px" fontWeight="800" color="white">0</Text>
                    <Text fontSize="9px" color="rgba(255,255,255,0.55)" textTransform="uppercase" letterSpacing="0.05em" mt="1px">Orders</Text>
                  </Box>
                  <Box py="9px" textAlign="center" borderRight="1px solid rgba(255,255,255,0.08)">
                    <Text fontFamily="Syne, sans-serif" fontSize="14px" fontWeight="800" color="white">{wishlistCount}</Text>
                    <Text fontSize="9px" color="rgba(255,255,255,0.55)" textTransform="uppercase" letterSpacing="0.05em" mt="1px">Wishlist</Text>
                  </Box>
                  <Box py="9px" textAlign="center">
                    <Text fontFamily="Syne, sans-serif" fontSize="14px" fontWeight="800" color="white">UGX 0</Text>
                    <Text fontSize="9px" color="rgba(255,255,255,0.55)" textTransform="uppercase" letterSpacing="0.05em" mt="1px">Wallet</Text>
                  </Box>
                </Flex>
              )}
            </Box>

            <DrawerBody px={0} py={0} flex="1" minH={0} display="flex" flexDirection="column" overflow="hidden">
              {/* Scrollable area – only this scrolls; Call + Logout stay fixed at bottom */}
              <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" sx={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }} pt="8px">
              {/* Sell CTA – HTML exact: orange gradient, house icon, arrow */}
              <Link href={CLIENT_DASHBOARD_URL} onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                <Flex mx="14px" mt="12px" mb="8px" align="center" gap="10px" p="12px 14px" borderRadius="12px" bg="linear-gradient(135deg, #f97316 0%, #ea580c 100%)" boxShadow="0 3px 12px rgba(249,115,22,0.3)" _active={{ transform: "scale(0.98)" }} transition="transform 0.15s">
                  <Flex w="36px" h="36px" borderRadius="10px" bg="rgba(255,255,255,0.2)" align="center" justify="center" flexShrink={0}>
                    <AiOutlineHome size={18} color="white" />
                  </Flex>
                  <Box flex={1}>
                    <Text fontFamily="Syne, sans-serif" fontSize="13px" fontWeight="800" color="white">Start Selling Today</Text>
                    <Text fontSize="10px" color="rgba(255,255,255,0.75)" mt="1px">List your products on YooKatale</Text>
                  </Box>
                  <Box><FaChevronDown size={16} style={{ transform: "rotate(-90deg)", color: "rgba(255,255,255,0.8)" }} /></Box>
                </Flex>
              </Link>

              {/* Shop & Explore – HTML: section label #637568, nav-icon bg #f4f8f5, nav-label #1e2d22, chevron #c0cfc4 */}
              <Text fontSize="9.5px" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color="#637568" px="18px" pt="14px" pb="6px">Shop &amp; Explore</Text>
              {visibleNavLinks.filter((l) => ["/", "/products", "/marketplace"].includes(l.href) || (l.href && l.href.startsWith("/search") && l.label === "Promotions")).map((link) => {
                const Icon = link.icon;
                const isActive = pathname === (link.href ?? "") || (link.href?.startsWith("/search") && pathname.startsWith("/search"));
                const badge = link.badge;
                const badgeBg = badge === "New" ? "#1a6b3a" : badge === "HOT" ? "#f5c800" : "#f97316";
                const badgeColor = badge === "HOT" ? "#0c1a10" : "white";
                return (
                  <Link key={String(link.href) + link.label} href={link.href ?? "#"} onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                    <Flex align="center" gap="12px" py="11px" px="18px" position="relative" bg={isActive ? "#e8f5ee" : "transparent"} _hover={{ bg: "#e8f5ee" }} _active={{ bg: "#e8f5ee" }} transition="background 0.12s">
                      {isActive && <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" w="3px" h="22px" borderRadius="0 3px 3px 0" bg="#1a6b3a" />}
                      <Flex w="34px" h="34px" borderRadius="10px" bg={isActive ? "#e8f5ee" : "#f4f8f5"} align="center" justify="center" flexShrink={0}>
                        <Icon size={17} color={isActive ? "#1a6b3a" : "#637568"} />
                      </Flex>
                      <Text fontSize="13px" fontWeight={isActive ? 700 : 500} color={isActive ? "#1a6b3a" : "#1e2d22"} flex={1}>{link.label}</Text>
                      {badge && <Badge fontSize="9px" fontWeight="800" px="7px" py="2px" borderRadius="full" bg={badgeBg} color={badgeColor} flexShrink={0}>{badge}</Badge>}
                      <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
                    </Flex>
                  </Link>
                );
              })}

              {/* Company */}
              <Divider my="6px" mx="14px" borderColor="#e8f0eb" />
              <Text fontSize="9.5px" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color="#637568" px="18px" pt="14px" pb="6px">Company</Text>
              {visibleNavLinks.filter((l) => ["/about", "/news", "/careers", "/contact", "/partner", "/subscription"].includes(l.href)).map((link) => {
                const Icon = link.icon;
                const isActive = pathname === (link.href ?? "");
                const badge = link.badge;
                const badgeBg = badge === "Hiring" ? "#f97316" : "#1a6b3a";
                return (
                  <Link key={link.href} href={link.href ?? "#"} onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                    <Flex align="center" gap="12px" py="11px" px="18px" position="relative" bg={isActive ? "#e8f5ee" : "transparent"} _hover={{ bg: "#e8f5ee" }} _active={{ bg: "#e8f5ee" }} transition="background 0.12s">
                      {isActive && <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" w="3px" h="22px" borderRadius="0 3px 3px 0" bg="#1a6b3a" />}
                      <Flex w="34px" h="34px" borderRadius="10px" bg={isActive ? "#e8f5ee" : "#f4f8f5"} align="center" justify="center" flexShrink={0}>
                        <Icon size={17} color={isActive ? "#1a6b3a" : "#637568"} />
                      </Flex>
                      <Text fontSize="13px" fontWeight={isActive ? 700 : 500} color={isActive ? "#1a6b3a" : "#1e2d22"} flex={1}>{link.label}</Text>
                      {badge && <Badge fontSize="9px" fontWeight="800" px="7px" py="2px" borderRadius="full" bg={badgeBg} color="white" flexShrink={0}>{badge}</Badge>}
                      <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
                    </Flex>
                  </Link>
                );
              })}

              {/* My Account – HTML colors */}
              <Divider my="6px" mx="14px" borderColor="#e8f0eb" />
              <Text fontSize="9.5px" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color="#637568" px="18px" pt="14px" pb="6px">My Account</Text>
              {userInfo && (
                <>
                  <Link href="/account" onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                    <Flex align="center" gap="12px" py="11px" px="18px" position="relative" bg={pathname === "/account" ? "#e8f5ee" : "transparent"} _hover={{ bg: "#e8f5ee" }} transition="background 0.12s">
                      {pathname === "/account" && <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" w="3px" h="22px" borderRadius="0 3px 3px 0" bg="#1a6b3a" />}
                      <Flex w="34px" h="34px" borderRadius="10px" bg={pathname === "/account" ? "#e8f5ee" : "#f4f8f5"} align="center" justify="center" flexShrink={0}><AiOutlineUser size={17} color={pathname === "/account" ? "#1a6b3a" : "#637568"} /></Flex>
                      <Text fontSize="13px" fontWeight={pathname === "/account" ? 700 : 500} color={pathname === "/account" ? "#1a6b3a" : "#1e2d22"} flex={1}>My Profile</Text>
                      <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
                    </Flex>
                  </Link>
                  <Link href="/invoices" onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                    <Flex align="center" gap="12px" py="11px" px="18px" position="relative" bg={pathname === "/invoices" ? "#e8f5ee" : "transparent"} _hover={{ bg: "#e8f5ee" }} transition="background 0.12s">
                      {pathname === "/invoices" && <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" w="3px" h="22px" borderRadius="0 3px 3px 0" bg="#1a6b3a" />}
                      <Flex w="34px" h="34px" borderRadius="10px" bg={pathname === "/invoices" ? "#e8f5ee" : "#f4f8f5"} align="center" justify="center" flexShrink={0}><FaShoppingBag size={17} color={pathname === "/invoices" ? "#1a6b3a" : "#637568"} /></Flex>
                      <Text fontSize="13px" fontWeight={pathname === "/invoices" ? 700 : 500} color={pathname === "/invoices" ? "#1a6b3a" : "#1e2d22"} flex={1}>My Orders</Text>
                      <Badge fontSize="9px" fontWeight="800" px="7px" py="2px" borderRadius="full" bg="#1a6b3a" color="white">0</Badge>
                      <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
                    </Flex>
                  </Link>
                  <Link href="/wishlist" onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                    <Flex align="center" gap="12px" py="11px" px="18px" position="relative" bg={pathname === "/wishlist" ? "#e8f5ee" : "transparent"} _hover={{ bg: "#e8f5ee" }} transition="background 0.12s">
                      {pathname === "/wishlist" && <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" w="3px" h="22px" borderRadius="0 3px 3px 0" bg="#1a6b3a" />}
                      <Flex w="34px" h="34px" borderRadius="10px" bg={pathname === "/wishlist" ? "#e8f5ee" : "#f4f8f5"} align="center" justify="center" flexShrink={0}><FaHeart size={17} color={pathname === "/wishlist" ? "#1a6b3a" : "#637568"} /></Flex>
                      <Text fontSize="13px" fontWeight={pathname === "/wishlist" ? 700 : 500} color={pathname === "/wishlist" ? "#1a6b3a" : "#1e2d22"} flex={1}>Wishlist</Text>
                      {wishlistCount > 0 && <Badge fontSize="9px" fontWeight="800" px="7px" py="2px" borderRadius="full" bg="#f97316" color="white">{wishlistCount}</Badge>}
                      <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
                    </Flex>
                  </Link>
                </>
              )}
              <Link href="/cashout" onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                <Flex align="center" gap="12px" py="11px" px="18px" position="relative" bg={pathname === "/cashout" ? "#e8f5ee" : "transparent"} _hover={{ bg: "#e8f5ee" }} transition="background 0.12s">
                  {pathname === "/cashout" && <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" w="3px" h="22px" borderRadius="0 3px 3px 0" bg="#1a6b3a" />}
                  <Flex w="34px" h="34px" borderRadius="10px" bg={pathname === "/cashout" ? "#e8f5ee" : "#f4f8f5"} align="center" justify="center" flexShrink={0}><FaWallet size={17} color={pathname === "/cashout" ? "#1a6b3a" : "#637568"} /></Flex>
                  <Text fontSize="13px" fontWeight={pathname === "/cashout" ? 700 : 500} color={pathname === "/cashout" ? "#1a6b3a" : "#1e2d22"} flex={1}>Cashout</Text>
                  <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
                </Flex>
              </Link>
              <Flex as="button" type="button" align="center" gap="12px" py="11px" px="18px" w="100%" textAlign="left" bg="transparent" _hover={{ bg: "#e8f5ee" }} _active={{ bg: "#e8f5ee" }} onClick={openInviteModal} transition="background 0.12s">
                <Flex w="34px" h="34px" borderRadius="10px" bg="#f4f8f5" align="center" justify="center" flexShrink={0}><FaGift size={17} color="#637568" /></Flex>
                <Text fontSize="13px" fontWeight="500" color="#1e2d22" flex={1}>Invite a Friend</Text>
                <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
              </Flex>
              {!userInfo && (
                <Link href="/signup" onClick={closeMobileNav} _hover={{ textDecoration: "none" }}>
                  <Flex align="center" gap="12px" py="11px" px="18px" position="relative" bg={pathname === "/signup" ? "#e8f5ee" : "transparent"} _hover={{ bg: "#e8f5ee" }} transition="background 0.12s">
                    {pathname === "/signup" && <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" w="3px" h="22px" borderRadius="0 3px 3px 0" bg="#1a6b3a" />}
                    <Flex w="34px" h="34px" borderRadius="10px" bg={pathname === "/signup" ? "#e8f5ee" : "#f4f8f5"} align="center" justify="center" flexShrink={0}><AiOutlineLogin size={17} color={pathname === "/signup" ? "#1a6b3a" : "#637568"} /></Flex>
                    <Text fontSize="13px" fontWeight={pathname === "/signup" ? 700 : 500} color={pathname === "/signup" ? "#1a6b3a" : "#1e2d22"} flex={1}>Sign Up</Text>
                    <Box flexShrink={0} color="#c0cfc4"><FaChevronDown size={14} style={{ transform: "rotate(-90deg)" }} /></Box>
                  </Flex>
                </Link>
              )}

              <Box h="16px" />
              </Box>

              {/* Footer – fixed at bottom when scrolling (Call + Logout + version) */}
              <Box px="14px" py="14px" pb="28px" borderTop="1px solid" borderColor="#e8f0eb" bg="white" flexShrink={0}>
                <Button
                  as="a"
                  href="tel:+256786118137"
                  w="full"
                  h="52px"
                  leftIcon={<AiOutlinePhone size={16} />}
                  bg={ThemeColors.primaryColor}
                  color="white"
                  fontFamily="Syne, sans-serif"
                  fontSize="13px"
                  fontWeight="700"
                  borderRadius="12px"
                  mb="8px"
                  boxShadow="0 3px 12px rgba(26,107,58,0.3)"
                  _active={{ bg: "#145530", transform: "scale(0.98)" }}
                  onClick={closeMobileNav}
                >
                  Call +256 786 118137
                </Button>
                {userInfo && (
                  <Button
                    w="full"
                    h="48px"
                    leftIcon={<AiOutlineLogout size={16} />}
                    variant="outline"
                    borderColor="red.200"
                    borderWidth="1.5px"
                    color="red.500"
                    fontFamily="Syne, sans-serif"
                    fontSize="13px"
                    fontWeight="700"
                    borderRadius="12px"
                    _hover={{ bg: "red.50" }}
                    _active={{ bg: "red.50" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
                <Text textAlign="center" mt="10px" fontSize="10px" color="gray.500">YooKatale · <Text as="span" color={ThemeColors.primaryColor} fontWeight="600">fresh produce &amp; groceries, Kampala</Text></Text>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />
      </Box>
    </>
  );
};

export default Header;
