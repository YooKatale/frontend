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
} from "react-icons/ai";
import {
  FaShoppingBag,
  FaChevronDown,
  FaStore,
  FaBlog,
  FaHandshake,
  FaBriefcase,
  FaGift,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@slices/usersApiSlice";
import { useCartMutation } from "@slices/productsApiSlice";
import { logout } from "@slices/authSlice";
import { ThemeColors } from "@constants/constants";
import ReferralModal from "@components/ReferralModal";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);
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

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!searchParam)
      return chakraToast({
        title: "Error",
        description: "Search cannot be empty",
        status: "error",
        duration: 5000,
        isClosable: false,
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
        title: "Logged Out",
        description: "You have been successfully logged out.",
        status: "success",
        duration: 3000,
        isClosable: true,
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
      });
    }
  };

  const navLinks = [
    { label: "Home", href: "/", icon: AiOutlineHome },
    { label: "Categories", href: "/products", icon: AiOutlineAppstore },
    { label: "Marketplace", href: "/marketplace", icon: FaStore },
    { label: "About", href: "/about", icon: AiOutlineTeam },
    { label: "Blog", href: "/news", icon: FaBlog },
    { label: "Careers", href: "/careers", icon: FaBriefcase },
    { label: "Contact", href: "/contact", icon: AiOutlineContacts },
    { label: "Partner", href: "/partner", icon: FaHandshake },
    { label: "Subscribe", href: "/subscription", icon: AiOutlineCreditCard },
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
        borderBottomWidth="1px"
        borderColor="gray.100"
        position="sticky"
        top={0}
        zIndex="1000"
        boxShadow="sm"
      >
        {/* Top nav links — large devices only, Jumia-style bold, no icons */}
        <Flex
          display={{ base: "none", lg: "flex" }}
          as="nav"
          align="center"
          justify="center"
          gap={{ lg: 3, xl: 5 }}
          maxW="1400px"
          mx="auto"
          px={{ lg: 4, xl: 6 }}
          py={3}
          bg="gray.50"
          borderBottomWidth="1px"
          borderColor="gray.200"
          flexWrap="wrap"
        >
          {visibleNavLinks.map((link) => {
            if (link.isInvite) {
              return (
                <Button
                  key="invite"
                  variant="ghost"
                  size="sm"
                  fontSize="0.9375rem"
                  fontWeight="700"
                  color="gray.800"
                  _hover={{ bg: "white", color: ThemeColors.darkColor }}
                  onClick={openReferral}
                >
                  {link.label}
                </Button>
              );
            }
            return (
              <Link key={link.href} href={link.href}>
                <Flex
                  as="span"
                  align="center"
                  px={2}
                  py={1.5}
                  borderRadius="md"
                  fontSize="0.9375rem"
                  fontWeight="700"
                  color="gray.800"
                  _hover={{ bg: "white", color: ThemeColors.darkColor }}
                >
                  {link.label}
                </Flex>
              </Link>
            );
          })}
        </Flex>

        <Flex
          as="nav"
          align="center"
          justify="space-between"
          maxW="1400px"
          px={{ base: 3, md: 0, lg: 0 }}
          mx="auto"
          minH="64px"
          py={2}
        >
          {/* Logo */}
          <Flex align="center" flexShrink={0}>
            <Link href="/">
              <Box
                as="span"
                display="flex"
                alignItems="center"
                _hover={{ opacity: 0.9 }}
                transition="opacity 0.2s"
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

          {/* Desktop Search Bar - Center */}
          <Box
            mx={{ base: 2, md: 3, lg: 4 }}
            flex="1"
            maxW="600px"
            display={{ base: "none", md: "block" }}
          >
            <form onSubmit={handleSearchFormSubmit}>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <AiOutlineSearch color="#718096" size={20} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search for fresh produce, groceries..."
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                  fontSize="0.9375rem"
                  h="44px"
                  borderRadius="lg"
                  bg="gray.50"
                  borderColor="gray.200"
                  paddingLeft="2.8rem"
                  _focus={{
                    bg: "white",
                    borderColor: ThemeColors.darkColor,
                    boxShadow: `0 0 0 3px ${ThemeColors.darkColor}20`,
                  }}
                  _hover={{ borderColor: "gray.300" }}
                  transition="all 0.2s"
                />
              </InputGroup>
            </form>
          </Box>

          {/* Desktop Navigation Right Section */}
          <Flex align="center" display={{ base: "none", md: "flex" }} gap={2}>
            {/* Call Button */}
            <Button
              as={Link}
              href="tel:+256786118137"
              leftIcon={<AiOutlinePhone size={16} />}
              bg="#F6AD55"
              color="white"
              size="sm"
              fontSize="0.8125rem"
              fontWeight="600"
              px={3}
              py={2}
              borderRadius="lg"
              _hover={{
                bg: "#ED8936",
                color: "white",
                transform: "translateY(-1px)",
                boxShadow: "sm",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              Call Us
            </Button>

            {/* Cart with Badge */}
            <Link href="/cart">
              <Box position="relative" as="span" display="inline-block">
                <IconButton
                  aria-label="Shopping Cart"
                  icon={<AiOutlineShoppingCart size={22} />}
                  variant="ghost"
                  size="lg"
                  color="gray.700"
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
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="0.65rem"
                    minW="5"
                    h="5"
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

            {/* User Profile Menu */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="lg"
                px={2}
                color="gray.700"
                _hover={{ bg: "green.50" }}
                _active={{ bg: "green.50" }}
                rightIcon={<FaChevronDown size={12} />}
              >
                <Flex align="center" gap={2}>
                  <AiOutlineUser size={20} />
                  <Text fontSize="0.875rem" fontWeight="500">
                    {userDisplayName}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList py={0} borderRadius="lg" borderColor="gray.200" boxShadow="lg">
                {userInfo ? (
                  <>
                    <MenuItem 
                      as={Link} 
                      href="/account"
                      py={3}
                      _hover={{ bg: "green.50" }}
                    >
                      <AiOutlineUser size={16} />
                      <Text ml={2}>My Account</Text>
                    </MenuItem>
                    <MenuItem 
                      as={Link} 
                      href="/invoices"
                      py={3}
                      _hover={{ bg: "green.50" }}
                    >
                      <FaShoppingBag size={14} />
                      <Text ml={2}>My Orders</Text>
                    </MenuItem>
                    <MenuItem
                      py={3}
                      _hover={{ bg: "red.50", color: "red.600" }}
                      onClick={handleLogout}
                    >
                      <Text ml={2}>Logout</Text>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem 
                      as={Link} 
                      href="/signin"
                      py={3}
                      _hover={{ bg: "green.50" }}
                    >
                      <AiOutlineLogin size={16} />
                      <Text ml={2}>Sign In</Text>
                    </MenuItem>
                    <MenuItem 
                      as={Link} 
                      href="/signup"
                      py={3}
                      _hover={{ bg: "green.50" }}
                    >
                      <Text ml={2}>Create Account</Text>
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </Flex>

          {/* Mobile Menu Button */}
          <IconButton
            ref={btnRef}
            aria-label="Menu"
            icon={mobileNavOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
            variant="ghost"
            size="lg"
            display={{ base: "flex", md: "none" }}
            onClick={toggleMobileNav}
            ml={2}
          />
        </Flex>

        {/* Mobile Search Bar - Shows below main nav on scroll */}
        <Box
          display={{ base: "block", md: "none" }}
          px={4}
          py={3}
          bg="gray.50"
          borderY="1px"
          borderColor="gray.100"
        >
          <form onSubmit={handleSearchFormSubmit}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <AiOutlineSearch color="#718096" size={18} />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                fontSize="0.9375rem"
                h="40px"
                borderRadius="lg"
                bg="white"
                borderColor="gray.200"
                paddingLeft="2.8rem"
                _focus={{
                  borderColor: ThemeColors.darkColor,
                  boxShadow: `0 0 0 2px ${ThemeColors.darkColor}20`,
                }}
              />
            </InputGroup>
          </form>
        </Box>

        {/* Mobile Drawer Menu */}
        <Drawer
          isOpen={mobileNavOpen}
          placement="right"
          onClose={closeMobileNav}
          finalFocusRef={btnRef}
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton size="lg" />
            <DrawerHeader borderBottomWidth="1px">
              <Flex align="center" gap={3}>
                <AiOutlineUser size={22} />
                <Text fontSize="md" fontWeight="600">
                  {userInfo ? userDisplayName : "Welcome"}
                </Text>
              </Flex>
            </DrawerHeader>

            <DrawerBody px={0}>
              <VStack align="stretch" spacing={0}>
                {visibleNavLinks.map((link) => {
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
                        _hover={{ bg: "green.50" }}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        onClick={openInviteModal}
                      >
                        <Icon size={18} color="#4A5568" />
                        <Text ml={4} fontSize="md" fontWeight="500">
                          {link.label}
                        </Text>
                      </Flex>
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
                        _hover={{ bg: "green.50" }}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                      >
                        <Icon size={18} color="#4A5568" />
                        <Text ml={4} fontSize="md" fontWeight="500">
                          {link.label}
                        </Text>
                      </Flex>
                    </Link>
                  );
                })}
                
                {/* Cart in Mobile Menu */}
                <Link href="/cart" onClick={closeMobileNav}>
                  <Flex
                    align="center"
                    px={6}
                    py={4}
                    _hover={{ bg: "green.50" }}
                    borderBottomWidth="1px"
                    borderColor="gray.100"
                  >
                    <AiOutlineShoppingCart size={18} color="#4A5568" />
                    <Text ml={4} fontSize="md" fontWeight="500">
                      Cart
                    </Text>
                    {cartItemsCount > 0 && (
                      <Badge
                        ml="auto"
                        bg="red.500"
                        color="white"
                        borderRadius="full"
                        fontSize="0.7rem"
                        minW="5"
                        h="5"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="700"
                      >
                        {cartItemsCount > 99 ? "99+" : cartItemsCount}
                      </Badge>
                    )}
                  </Flex>
                </Link>

                {/* Call Button in Mobile Menu */}
                <Box px={6} py={4}>
                  <Button
                    as="a"
                    href="tel:+256786118137"
                    w="full"
                    leftIcon={<AiOutlinePhone />}
                    bg="#F6AD55"
                    color="white"
                    size="lg"
                    fontSize="md"
                    fontWeight="600"
                    py={3}
                    borderRadius="lg"
                    _hover={{
                      bg: "#ED8936",
                      transform: "translateY(-2px)",
                      boxShadow: "md"
                    }}
                    onClick={closeMobileNav}
                  >
                    Call +256 786 118137
                  </Button>
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