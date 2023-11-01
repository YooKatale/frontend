"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Text,
  InputLeftElement,
  Spacer,
  Stack,
  Spinner,
  CloseButton,
} from "@chakra-ui/react";
import { Images, ThemeColors } from "@constants/constants";
import Image from "next/image";
import Link from "next/link";
import {
  FaShoppingCart,
  FaShoppingBasket,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import {
  AiOutlineArrowLeft,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiTwotoneShopping,
} from "react-icons/ai";
import { CgMenuRight, CgMenuRightAlt, CgMenu } from "react-icons/cg";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@slices/authSlice";
import { useLogoutMutation } from "@slices/usersApiSlice";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
// import { IsAccountValid } from "@middleware/middleware";
import { HiChevronLeft } from "react-icons/hi";
import ButtonComponent from "./Button";
import { LogIn } from "lucide-react";
import { DB_URL } from "@config/config";
import { Badge } from "antd";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [isLoading, setLoading] = useState({ operation: "", status: false });
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [scrollDownState, setScrollDownState] = useState(false);
  const [isLoginMode, setLoginMode] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // IsAccountValid();

  const { push } = useRouter();

  const [logoutApiCall] = useLogoutMutation();

  const chakraToast = useToast();

  const dispatch = useDispatch();

  const logoutHandler = async () => {
    // set loading to be true
    setLoading({ ...isLoading, operation: "logout", status: true });

    // close dropdown menu if open
    if (dropdownMenu) setDropdownMenu(false);

    try {
      const res = await logoutApiCall().unwrap();

      console.log("Logout API response:", res);

      // set loading to be false
      setLoading({ ...isLoading, operation: "", status: false });

      dispatch(logout());

      push("/signin");
    } catch (err) {
      // set loading to be false
      setLoading({ ...isLoading, operation: "", status: false });

      chakraToast({
        title: "Error has occurred",
        description: err.data?.message
          ? err.data?.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();

    // set loading to be true
    setLoading(
      (prevState) => (prevState = { operation: "search", status: true })
    );

    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }

    if (searchParam == "")
      return chakraToast({
        title: "Error",
        description: "Search cannot be empty",
        status: "error",
        duration: 5000,
        isClosable: false,
      });

    // set loading to be false
    setLoading({ ...isLoading, operation: "", status: false });

    push(`/search?q=${searchParam}`);
  };

  const stickyNavbarActivate = () => {
    let lastScrollIndex = 0;

    if (window)
      window.addEventListener("scroll", (e) => {
        const currentScrollIndex = window.scrollY;

        if (currentScrollIndex <= 0) {
          setScrollDownState(true);
        }

        if (currentScrollIndex > lastScrollIndex) setScrollDownState(true);

        if (currentScrollIndex < lastScrollIndex) setScrollDownState(false);

        lastScrollIndex = currentScrollIndex;
      });
  };

  // function to get user IP
  const handleUserIp = async () => {
    const res = await fetch(
      "https://geolocation-db.com/json/4aebddc0-500e-11ee-9b7d-f1b795d54ff5"
    );

    const data = await res.json();

    console.log({ data });
  };

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch(`${DB_URL}/api/subscription`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${userInfo.token}`
          }
        });
        const data = await response.json();
        
        if (data && data.isSubscribed) {
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    if (userInfo) {
      fetchSubscriptionStatus();
    }
  }, [userInfo]);

  useEffect(() => {
    stickyNavbarActivate();

    // get user IP
    handleUserIp();
  }, []);

  const DropdownLinks = [
    { name: "Account", link: "/account" },
    { name: "Schedule a meal", link: "/schedule" },
    { name: "Loyalty Points", link: "/loyalty" },
    { name: "Subscription", link: "/subscription" },
    { name: "Support", link: "/" },
    { name: "Invoices & Receipts", link: "/invoices" },
    { name: "Support", link: "/" },
  ];

  if (userInfo) {
    DropdownLinks.push({ name: "Logout", link: "#" });
  }

  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position={scrollDownState ? "sticky" : "static"}
      top={0}
      zIndex="sticky"
      transition="background-color 0.2s"
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        maxW={{ xl: "1920px" }}
        px={4}
        mx="auto"
      >
        {/* Logo */}
        <Link href="/">
          <div className="relative h-24 w-24 mr-4">
            <Image
              src={"/assets/icons/logo2.png"}
              alt="Logo"
              fill={true}
              className="object-contain h-full w-auto"
            />
          </div>
        </Link>

        {/* Mobile navigation */}
        <Box display={{ base: "block", lg: "none" }}>
          <Button
            variant="link"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            size="lg"
          >
            {mobileNavOpen ? (
              <CloseButton size="24px" />
            ) : (
              <CgMenu size="24px" />
            )}
          </Button>
        </Box>
       
        {/* Desktop navigation */}
        <Stack
          as="ul"
          direction={{ base: "column", lg: "row" }}
          spacing={8}
          display={{ base: mobileNavOpen ? "block" : "none", lg: "flex" }}
          alignItems={{ base: "center", lg: "center" }}
          mt={{ base: 4, lg: 0 }}
          ml={{ base: 0, lg: "auto" }}
          listStyleType="none"
          flexGrow={1}
          pl={0}
          transition="all 0.3s ease-in-out"
        >
          {/* Home */}
          <Box as="li">
            <Link href="/">Home</Link>
          </Box>

          {/* Products */}
          <Box as="li">
            <Link href="/products">Products</Link>
          </Box>

          {/* Contact */}
          <Box as="li">
            <Link href="/contact">Contact</Link>
          </Box>
          {
            userInfo && (
              <a
                style={{cursor: "pointer"}}
                onClick={() => logoutHandler()}
                >
                Logout
              </a>
            )
          }
          {
            userInfo && (
              <Flex align="center">
              {isSubscribed ? (
               <Badge colorScheme="green" className="bg-green px-2 py-1 rounded-full text-white text-sm md:text-base">Subscribed</Badge>
             ) : (
                <Badge colorScheme="red" className="bg-red px-2 py-1 rounded-full text-white text-sm">Not Subscribed</Badge>
            )}
            </Flex>
            )
          }
          {/* Search */}
          <Box as="li">
            <form onSubmit={handleSearchFormSubmit}>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search..."
                  variant="filled"
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                />
              </InputGroup>
            </form>
          </Box>
        </Stack>

        {/* Right section */}
        <Flex align="center">

          {/* Cart */}
          {/* <Box display={{ base: "none", lg: "block" }}  _hover={{ bg: "white", borderColor: "green.500", color:"green.500"}}
          className="p-2 rounded " color="white" bg="green.700"   borderWidth="2px"
          >
          <Link href="/cart">
            <p>
            <AiOutlineShoppingCart size="24px" />
            </p>
          </Link>
          </Box> */}
          <Box display={{ base: "none", lg: "block" }}>
            <ButtonComponent
              variant="icon"
              icon={<AiOutlineShoppingCart size="24px" />}
              onClick={() => push("/cart")}
            />
          </Box>

          {/* User dropdown */}
          {userInfo ? (
            <Box ml={4} display={{ base: "none", lg: "block" }}>
              <ButtonComponent
                variant="icon"
                icon={<FaUser size="20px" />}
                onClick={() => setDropdownMenu(!dropdownMenu)}
              />
              {dropdownMenu && (
                <Box
                  bg="white"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  borderRadius="md"
                  mt={2}
                  position="absolute"
                  right={0}
                  zIndex={3}
                >
                  <ul>
                    {DropdownLinks.map((item, index) => (
                      <li key={index}>
                        <Link href={item.link}>
                          <p
                            onClick={() => setDropdownMenu(false)}
                            className="dropdown-link"
                          >
                            {item.name}
                          </p>
                        </Link>
                      </li>
                    ))}

                  </ul>
                  <Flex align="center">
                {isSubscribed ? (
              <Badge colorScheme="green" className="bg-green px-2 py-1 rounded-full text-white text-xs">Subscribed</Badge>
             ) : (
                <Badge colorScheme="red" className="bg-red px-2 py-1 rounded-full text-white text-xs">Not Subscribed</Badge>
            )}
            </Flex>
                </Box>
              )}
            </Box>
          ) : (
            <Box ml={4} display={{ base: "none", lg: "block" }}>
              <ButtonComponent
                variant="icon"
                icon={<FaSignInAlt size="20px" />}
                onClick={() => push("/signin")}
              />
            </Box>
          )}
          
          {/* Cart mobile */}
          <Box display={{ base: "block", lg: "none" }}>
          <ButtonComponent
              variant="icon"
              icon={<AiOutlineShoppingCart size="24px" />}
              onClick={() => push("/cart")}
            />
          </Box>
          <Box ml={4} display={{ base: "block", lg: "none" }}>
              <ButtonComponent
                variant="icon"
                icon={<FaSignInAlt size="20px" />}
                onClick={() => push("/signin")}
              />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
