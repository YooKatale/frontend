"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const { push } = useRouter();
  const chakraToast = useToast();

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
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex="sticky"
      transition="background-color 0.2s"
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        maxW="1920px"
        px={4}
        mx="auto"
        height="80px"
      >
        {/* Left Section - Logo and Categories Dropdown */}
        <Flex align="center">
          <Link href="/">
            <Image
              src="/assets/icons/logo2.png"
              alt="Logo"
              height={100}
              width={100}
              className="object-contain"
            />
          </Link>
          <Box ml={4} display={{ base: "none", md: "block" }}>
            <Link href="/products" passHref>
              <Button variant="outline" leftIcon={<AiOutlineMenu />}>
                All Categories
              </Button>
            </Link>
          </Box>
        </Flex>

        {/* Search Bar */}
        <Box flexGrow={1} mx={8} display={{ base: "none", md: "block" }}>
          <form onSubmit={handleSearchFormSubmit}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search for products"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
            </InputGroup>
          </form>
        </Box>

        {/* Mobile Menu Icon */}
        <Box display={{ base: "block", md: "none" }}>
          <Button variant="outline" onClick={toggleMobileNav}>
            {mobileNavOpen ? <AiOutlineClose size="24px" /> : <AiOutlineMenu size="24px" />}
          </Button>
        </Box>

        {/* Navigation Links */}
        <Stack
          as="ul"
          direction={{ base: "column", md: "row" }}
          spacing={8}
          display={{ base: mobileNavOpen ? "block" : "none", md: "flex" }}
          alignItems="center"
          listStyleType="none"
          flexGrow={1}
          pl={0}
        >
          <Box as="li">
            <Link href="/">Home</Link>
          </Box>
          <Box as="li">
            <Link href="/about">About Us</Link>
          </Box>
          <Box as="li">
            <Link href="/news">Blog</Link>
          </Box>
          <Box as="li">
            <Link href="/careers">Careers</Link>
          </Box>
          <Box as="li">
            <Link href="/contact">Contact</Link>
          </Box>
        </Stack>

        {/* Right Section */}
        <Flex align="center" display={{ base: "none", md: "flex" }}>
          {/* Account and Cart */}
          <Flex align="center">
            {/* Cart Button */}
            <Link href="/cart">
              <Button
                variant="outline"
                sx={{
                  mr: 2,
                  background: "green",
                  color: "white",
                  _hover: {
                    backgroundColor: "gray.100", // Light gray background on hover
                    color: "green",              // Green text on hover
                  },
                }}
                leftIcon={<FaShoppingCart />}
              >
                Cart
              </Button>
            </Link>

            {/* Sign In or Account Button */}
            {userInfo ? (
              <Link href="/account" ml={4}>
                <FaUser size="20px" />
              </Link>
            ) : (
              <Link href="/signin" ml={4}>
                <Button
                  variant="outline"
                  sx={{
                    mr: 2,
                    background: "green",
                    color: "white",
                    _hover: {
                      backgroundColor: "gray.100", // Light gray background on hover
                      color: "green",              // Green text on hover
                    },
                  }}
                  leftIcon={<FaUser />}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </Flex>

          {/* Call to Action Button */}
          <Box ml={4}>
            <Button
              bg="orange.400"
              color="white"
              size="lg"
              _hover={{ bg: "orange.500" }}
            >
              Call: +256 754 615840
            </Button>
          </Box>
        </Flex>
      </Flex>

      {/* Mobile Search Bar */}
      {mobileNavOpen && (
        <Box px={4} pb={4} display={{ base: "block", md: "none" }}>
          <form onSubmit={handleSearchFormSubmit}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search for products"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
            </InputGroup>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default Header;
