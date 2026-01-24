"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
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
    <> 
      <Box
        as="header"
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex="sticky"
        transition="background-color 0.2s"
        fontSize="1rem" // Set a base font size to maintain consistency
        py={1}
      >
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          //maxW="1920px"
          px={4}
          mx="auto"
          height="4rem" // Height of 4rem for the nav bar
          justifyContent={'center'}
        >
          {/* Left Section - Logo and Categories Dropdown */}
          <Flex align="center">
            <Link href="/">
              <Box
                as="span"
                display="flex"
                alignItems="center"
                _hover={{ transform: 'scale(1.05)' }}
                transition="transform 0.2s"
              >
                <Image
                  src="/assets/icons/logo2.png"
                  alt="YooKatale Logo"
                  height={90}
                  width={90}
                  priority
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Link>
            <Box display={{ base: "none", md: "block" }}>
              <Button
                as={Link}
                href="/products"
                variant="outline"
                fontSize="0.875rem"
                leftIcon={<AiOutlineMenu />}
              >
                All Categories
              </Button>
            </Box>
          </Flex>

          {/* Search Bar - Glovo Style */}
          <Box mx={4} display={{ base: "none", md: "block" }} w={"16rem"} >
            <form onSubmit={handleSearchFormSubmit}>
              <InputGroup size="md" w={'16rem'}>
                <InputLeftElement pointerEvents="none" pl={3}>
                  <FaSearch color="gray.400" size={18} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                  fontSize="0.9375rem"
                  h="42px"
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.300"
                  paddingLeft="3rem"
                  _focus={{
                    bg: 'white',
                    borderColor: '#185F2D',
                    boxShadow: '0 0 0 2px rgba(24, 95, 45, 0.1)',
                  }}
                  _hover={{
                    borderColor: 'gray.400',
                    bg: 'white',
                  }}
                  transition="all 0.2s"
                />
              </InputGroup>
            </form>
          </Box>
        {/* Navigation Links - Desktop */}
          <Stack
            direction="row"
            spacing={4}
            display={{ base: "none", md: "flex" }}
            listStyleType="none"
            pl={0}
            pr={6}
            alignItems="center"
            flexWrap="wrap"
          >
            <Box as="li" fontSize="md"><Link href="/">Home</Link></Box>
            <Box as="li" fontSize="md"><Link href="/about">About</Link></Box>
            <Box as="li" fontSize="md"><Link href="/news">Blog</Link></Box>
            <Box as="li" fontSize="md"><Link href="/careers">Careers</Link></Box>
            <Box as="li" fontSize="md"><Link href="/contact">Contact</Link></Box>
            <Box as="li" fontSize="md"><Link href="/signup">Signup</Link></Box>
            <Box as="li" fontSize="md"><Link href="/subscription">Subscribe</Link></Box>
            <Box as="li" fontSize="md"><Link href="/partner">Partner</Link></Box>
            <Box as="li" fontSize="md"><Link href="/#refer">Invite a friend</Link></Box>
            <Box as="li" fontSize="md"><Link href="/marketplace">Marketplace</Link></Box>
          </Stack>
          {/* Mobile Menu Icon */}
            <Button variant="outline" onClick={toggleMobileNav} display={{ base: "block", md: "none" }} style={{marginLeft:'auto'}} >
              {mobileNavOpen ? <AiOutlineClose size="20px"/> : <AiOutlineMenu size="24px" />}
            </Button>
        
          {/* Right Section */}
          <Flex align="center" display={{ base: "none", md: "flex" }}>
            {/* Account and Cart */}
            <Flex align="center">
              {/* Cart Button */}
              <Button
                as={Link}
                href="/cart"
                variant="outline"
                sx={{
                  mr: 2,
                  background: "green",
                  color: "white",
                  fontSize: "0.875rem",
                  _hover: {
                    backgroundColor: "gray.100",
                    color: "green",
                  },
                }}
                leftIcon={<FaShoppingCart />}
              >
                Cart
              </Button>
              {/* Sign In or Account Button */}
              {userInfo ? (
                <Box as={Link} href="/account" ml={4} display="flex" alignItems="center">
                  <FaUser size="20px" />
                </Box>
              ) : (
                <Button
                  as={Link}
                  href="/signin"
                  ml={4}
                  variant="outline"
                  sx={{
                    mr: 2,
                    background: "green",
                    color: "white",
                    fontSize: "0.875rem",
                    _hover: {
                      backgroundColor: "gray.100",
                      color: "green",
                    },
                  }}
                  leftIcon={<FaUser />}
                >
                  Sign In
                </Button>
              )}
            </Flex>
            {/* Call to Action Button */}
            <Box mx={4}>
              <Button
                bg="orange.400"
                color="white"
                size="lg"
                fontSize="0.875rem" // Make sure the CTA button has a smaller font
                padding="0.75rem 1.5rem" // Consistent padding
                _hover={{ bg: "orange.500" }}
              >
                Call: +256 786 118137
              </Button>
            </Box>
          </Flex>
        </Flex>

      {/* Mobile menu: search + nav links */}
        {mobileNavOpen && (
          <Box px={4} pb={4} display={{ base: "block", md: "none" }} borderTopWidth="1px" borderColor="gray.200">
            <form onSubmit={handleSearchFormSubmit}>
              <InputGroup size="md" mb={4}>
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search for products"
                  _placeholder={{ px: 7 }}
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                  fontSize="0.875rem"
                  padding="0.75rem"
                />
              </InputGroup>
            </form>
            <Stack as="nav" spacing={3} listStyleType="none" pl={0}>
              <Box as="li"><Link href="/" onClick={toggleMobileNav}>Home</Link></Box>
              <Box as="li"><Link href="/products" onClick={toggleMobileNav}>All Categories</Link></Box>
              <Box as="li"><Link href="/about" onClick={toggleMobileNav}>About</Link></Box>
              <Box as="li"><Link href="/news" onClick={toggleMobileNav}>Blog</Link></Box>
              <Box as="li"><Link href="/careers" onClick={toggleMobileNav}>Careers</Link></Box>
              <Box as="li"><Link href="/contact" onClick={toggleMobileNav}>Contact</Link></Box>
              <Box as="li"><Link href="/signup" onClick={toggleMobileNav}>Signup</Link></Box>
              <Box as="li"><Link href="/subscription" onClick={toggleMobileNav}>Subscribe</Link></Box>
              <Box as="li"><Link href="/partner" onClick={toggleMobileNav}>Partner</Link></Box>
              <Box as="li"><Link href="/#refer" onClick={toggleMobileNav}>Invite a friend</Link></Box>
              <Box as="li"><Link href="/marketplace" onClick={toggleMobileNav}>Marketplace</Link></Box>
              <Box as="li"><Link href="/cart" onClick={toggleMobileNav}>Cart</Link></Box>
              <Box as="li">
                {userInfo ? (
                  <Link href="/account" onClick={toggleMobileNav}>Account</Link>
                ) : (
                  <Link href="/signin" onClick={toggleMobileNav}>Sign In</Link>
                )}
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Header;
