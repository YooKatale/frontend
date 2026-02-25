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
  AiOutlineQuestionCircle,
  AiOutlineInfoCircle,
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
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@slices/usersApiSlice";
import { useCartMutation } from "@slices/productsApiSlice";
import { logout, useAuth } from "@slices/authSlice";
import { ThemeColors, CLIENT_DASHBOARD_URL, CategoriesJson } from "@constants/constants";
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
  const chakraToast = useToast();
  const btnRef = useRef();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();
  const [fetchCart] = useCartMutation();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();

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
        boxShadow={scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)"}
        backdropFilter="blur(10px)"
        borderBottom="1px solid"
        borderColor="gray.100"
        transition="box-shadow var(--transition, 0.2s ease)"
      >
        {/* Black banner: Download app + Free delivery – orange accent */}
        <Box
          as="a"
          href={PLAY_STORE_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          display="block"
          bg="black"
          color="white"
          py={{ base: 1.5, md: 2 }}
          px={{ base: 3, md: 4 }}
          textAlign="center"
          fontSize={{ base: "0.7rem", sm: "0.8125rem" }}
          fontWeight="600"
          _hover={{ bg: "gray.900" }}
          transition="background 0.2s"
        >
          <Text as="span">Download the Yookatale mobile app</Text>
          <Text as="span" color="orange.400" mx={2}>•</Text>
          <Text as="span">Free delivery within 3km distance</Text>
        </Box>

        {/* Top bar – Sell / Help / FAQs / Track Order – orange, icon spacing, star for Sell */}
        <Box
          bg="gray.50"
          borderBottom="1px solid"
          borderColor="gray.200"
          py={{ base: 1.5, md: 2 }}
          px={{ base: 3, md: 4 }}
        >
          <Flex maxW="1400px" mx="auto" justify="space-between" align="center" fontSize={{ base: "0.75rem", sm: "0.8125rem" }} flexWrap="wrap" gap={{ base: 2, md: 0 }}>
            <Link href={CLIENT_DASHBOARD_URL} display="flex" alignItems="center" gap={2.5} fontWeight="700" color="orange.500" _hover={{ color: "orange.600" }}>
              <Icon as={FaStar} boxSize={4} flexShrink={0} />
              Sell on Yookatale
            </Link>
            <HStack spacing={{ base: 4, sm: 6 }} color="gray.600">
              <Link href="/contact" display="flex" alignItems="center" gap={2.5} color="orange.500" _hover={{ color: "orange.600" }}>
                <Icon as={AiOutlineQuestionCircle} boxSize={4} flexShrink={0} />
                Help
              </Link>
              <Link href="/faqs" display="flex" alignItems="center" gap={2.5} color="orange.500" _hover={{ color: "orange.600" }}>
                <Icon as={AiOutlineInfoCircle} boxSize={4} flexShrink={0} />
                FAQs
              </Link>
              <Link href="/account" display="flex" alignItems="center" gap={2.5} color="orange.500" _hover={{ color: "orange.600" }}>
                <Icon as={FaTruck} boxSize={4} flexShrink={0} />
                Track Order
              </Link>
            </HStack>
          </Flex>
        </Box>

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
          {/* Left: Menu button first (last on left = leftmost), then Logo */}
          <HStack spacing={{ base: 2, md: 3 }} flexShrink={0}>
            {/* Desktop: Hamburger menu – opens dropdown */}
            <Box display={{ base: "none", md: "block" }}>
              <Menu placement="bottom-start" gutter={0}>
                <MenuButton
                  as={IconButton}
                  aria-label="Menu"
                  icon={<AiOutlineMenu size={22} />}
                  variant="ghost"
                  size="lg"
                  h="44px"
                  w="44px"
                  borderRadius="lg"
                  color="gray.700"
                  _hover={{ bg: "gray.50", color: ThemeColors.primaryColor }}
                  _expanded={{ bg: "gray.50", color: ThemeColors.primaryColor }}
                />
              <MenuList
                minW="280px"
                maxH="85vh"
                overflowY="auto"
                py={0}
                borderRadius="var(--radius)"
                borderWidth="2px"
                borderColor="var(--border)"
                boxShadow="var(--shadow-lg)"
              >
                <MenuGroup title="Shop" fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color="gray.500" pt={3} pb={1} px={4}>
                  <MenuItem as={Link} href="/" fontSize="14px" fontWeight="500" py={2.5}>Home</MenuItem>
                  <MenuItem as={Link} href="/products" fontSize="14px" fontWeight="500" py={2.5}>Categories</MenuItem>
                  <MenuItem as={Link} href="/marketplace" fontSize="14px" fontWeight="500" py={2.5}>Marketplace</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem as={Link} href={CLIENT_DASHBOARD_URL} fontSize="14px" fontWeight="700" py={3} color={ThemeColors.primaryColor}>
                  SELL on Yookatale
                </MenuItem>
                <MenuDivider />
                <MenuGroup title="Company" fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color="gray.500" pt={2} pb={1} px={4}>
                  <MenuItem as={Link} href="/about" fontSize="14px" fontWeight="500" py={2.5}>About</MenuItem>
                  <MenuItem as={Link} href="/news" fontSize="14px" fontWeight="500" py={2.5}>Blog</MenuItem>
                  <MenuItem as={Link} href="/careers" fontSize="14px" fontWeight="500" py={2.5}>Careers</MenuItem>
                  <MenuItem as={Link} href="/contact" fontSize="14px" fontWeight="500" py={2.5}>Contact</MenuItem>
                  <MenuItem as={Link} href="/partner" fontSize="14px" fontWeight="500" py={2.5}>Partner</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Account" fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color="gray.500" pt={2} pb={1} px={4}>
                  <MenuItem as={Link} href="/subscription" fontSize="14px" fontWeight="500" py={2.5}>Subscribe</MenuItem>
                  <MenuItem as={Link} href="/cashout" fontSize="14px" fontWeight="500" py={2.5}>Cashout</MenuItem>
                  <MenuItem fontSize="14px" fontWeight="500" py={2.5} onClick={openReferral}>Invite a friend</MenuItem>
                  {!userInfo && (
                    <MenuItem as={Link} href="/signup" fontSize="14px" fontWeight="600" py={2.5} color={ThemeColors.primaryColor}>Sign Up</MenuItem>
                  )}
                </MenuGroup>
                <Box pb={3} />
              </MenuList>
            </Menu>
            </Box>

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

          {/* Mobile: inline search on same bar – compact, expands on focus */}
          <Flex
            as="form"
            onSubmit={(e) => { handleSearchFormSubmit(e); setMobileSearchExpanded(false); }}
            display={{ base: "flex", md: "none" }}
            flex={mobileSearchExpanded ? 1 : "0 0 auto"}
            minW={mobileSearchExpanded ? 0 : "44px"}
            maxW={mobileSearchExpanded ? "100%" : "44px"}
            mx={1}
            align="center"
            h="44px"
            borderRadius="lg"
            bg="gray.100"
            borderWidth="1px"
            borderColor={mobileSearchExpanded ? "orange.400" : "transparent"}
            overflow="hidden"
            transition="all 0.25s ease"
            _focusWithin={{ boxShadow: "0 0 0 2px var(--chakra-colors-orange-200)" }}
          >
            {!mobileSearchExpanded ? (
              <IconButton
                aria-label="Search"
                icon={<AiOutlineSearch size={20} />}
                variant="ghost"
                size="lg"
                h="44px"
                w="44px"
                minW="44px"
                color="gray.600"
                onClick={() => { setMobileSearchExpanded(true); setTimeout(() => mobileSearchRef.current?.focus(), 100); }}
              />
            ) : (
              <InputGroup size="md" flex="1" minW={0}>
                <InputLeftElement h="44px" pl={3} pointerEvents="none">
                  <AiOutlineSearch size={18} color="var(--muted)" />
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
                  h="44px"
                  fontSize="0.9375rem"
                  _placeholder={{ color: "gray.500" }}
                  onBlur={() => setTimeout(() => setMobileSearchExpanded(false), 200)}
                />
              </InputGroup>
            )}
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
              borderColor: ThemeColors.primaryColor,
              boxShadow: `0 0 0 2px ${ThemeColors.primaryColor}25`,
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
              bg="orange.500"
              color="white"
              fontWeight="700"
              fontSize="0.9375rem"
              borderRadius="0"
              _hover={{ bg: "orange.600" }}
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
                leftIcon={<AiOutlineUser size={18} />}
                fontWeight="600"
                fontSize="0.875rem"
                _hover={{ bg: "gray.50", color: ThemeColors.darkColor }}
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
                        bg: "green.50",
                        color: ThemeColors.darkColor,
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
                _hover={{ bg: "gray.50", color: ThemeColors.darkColor }}
              >
                Help
              </MenuButton>
              <MenuList minW="200px" py={1}>
                <MenuItem as={Link} href="/faqs" py={2.5}>FAQs</MenuItem>
                <MenuItem as={Link} href="/contact" py={2.5}>Contact Us</MenuItem>
                <MenuItem as={Link} href="/account" py={2.5}>Track Order</MenuItem>
              </MenuList>
            </Menu>

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
                _hover={{ bg: "gray.50", color: ThemeColors.darkColor }}
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

          {/* Mobile Right Actions - compact, clear touch targets */}
          <HStack spacing={0} display={{ base: "flex", md: "none" }} flexShrink={0}>
            <Link href="/cart">
              <Box position="relative" as="span" display="inline-block">
                <IconButton
                  aria-label="Cart"
                  icon={<AiOutlineShoppingCart size={22} />}
                  variant="ghost"
                  size="lg"
                  h="44px"
                  w="44px"
                  minW="44px"
                  borderRadius="lg"
                  color="gray.700"
                  _hover={{ bg: "gray.50", color: ThemeColors.darkColor }}
                  _active={{ bg: "gray.100" }}
                />
                {cartItemsCount > 0 && (
                  <Badge
                    position="absolute"
                    top="2px"
                    right="2px"
                    bg="var(--brand)"
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
              </Box>
            </Link>
            <IconButton
              ref={btnRef}
              aria-label="Menu"
              icon={mobileNavOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
              variant="ghost"
              size="lg"
              h="44px"
              w="44px"
              minW="44px"
              borderRadius="lg"
              color="gray.700"
              _hover={{ bg: "gray.50", color: ThemeColors.darkColor }}
              _active={{ bg: "gray.100" }}
              onClick={toggleMobileNav}
            />
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

        {/* Mobile Drawer – modern, professional */}
        <Drawer
          isOpen={mobileNavOpen}
          placement="right"
          onClose={closeMobileNav}
          finalFocusRef={btnRef}
          size="sm"
        >
          <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
          <DrawerContent borderLeftRadius="2xl" maxW="min(360px, 100vw)">
            <DrawerCloseButton
              size="lg"
              top={4}
              right={4}
              borderRadius="full"
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              zIndex={2}
            />
            <DrawerHeader pt={8} pb={4} px={6} borderBottomWidth="1px" borderColor="gray.100">
              <Flex align="center" justify="space-between">
                <Text fontFamily="var(--font-syne), Syne, sans-serif" fontSize="1.25rem" fontWeight="800" color="var(--dark)">
                  Menu
                </Text>
                {userInfo ? (
                  <HStack spacing={3}>
                    <Avatar size="sm" name={userDisplayName} bg={ThemeColors.darkColor} color="white" fontWeight="700" />
                    <Box textAlign="left">
                      <Text fontSize="0.875rem" fontWeight="700" color="gray.800" noOfLines={1}>{userDisplayName}</Text>
                      <Text fontSize="0.75rem" color="gray.500" noOfLines={1}>{userInfo?.email}</Text>
                    </Box>
                  </HStack>
                ) : (
                  <Link href="/signin" onClick={closeMobileNav}>
                    <Button size="sm" colorScheme="green" fontWeight="600">Sign In</Button>
                  </Link>
                )}
              </Flex>
            </DrawerHeader>

            <DrawerBody px={0} py={0} overflowY="auto" display="flex" flexDirection="column">
              <Box px={6} py={3} bg="gray.50">
                <Text fontSize="0.7rem" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                  Shop & Explore
                </Text>
              </Box>
              <VStack align="stretch" spacing={0} flex="1">
                {visibleNavLinks.map((link, index) => {
                  const Icon = link.icon;
                  const mobileHref = link.href ?? "#";
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
                        href={mobileHref}
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
                      key={mobileHref}
                      href={mobileHref}
                      onClick={closeMobileNav}
                    >
                      <Flex
                        align="center"
                        px={6}
                        py={4}
                        minH="56px"
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        transition="all 0.2s"
                        _hover={{
                          bg: "gray.50",
                          pl: 7,
                        }}
                        _active={{ bg: "green.50" }}
                      >
                        <Flex
                          align="center"
                          justify="center"
                          w="40px"
                          h="40px"
                          borderRadius="xl"
                          bg="white"
                          borderWidth="1px"
                          borderColor="gray.200"
                          color="var(--brand)"
                          mr={4}
                        >
                          <Icon size={20} />
                        </Flex>
                        <Text fontSize="1rem" fontWeight="600" color="gray.800">
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
                    <Link href="/cashout" onClick={closeMobileNav}>
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
                          bg="green.50"
                          color={ThemeColors.darkColor}
                          mr={3}
                        >
                          <FaWallet size={16} />
                        </Flex>
                        <Text fontSize="0.9375rem" fontWeight="600" color="gray.700">
                          Cashout
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
