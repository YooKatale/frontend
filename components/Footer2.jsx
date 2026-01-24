"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  SimpleGrid,
  IconButton,
  Link,
  FormControl,
  FormErrorMessage,
  Container,
  Divider,
  Badge,
  InputGroup,
  InputRightElement,
  Avatar,
  Heading,
} from "@chakra-ui/react";
import { useNewsletterPostMutation } from "@slices/usersApiSlice";
import NextLink from "next/link";
import { useState } from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaGooglePlay,
  FaAppStore,
} from "react-icons/fa";
import {
  FiMail,
  FiUser,
  FiChevronRight,
  FiCheck,
  FiSend,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiLinkedinFill,
  RiInstagramFill,
  RiYoutubeFill,
  RiTiktokFill,
  RiSendPlaneFill,
  RiShieldCheckFill,
  RiGlobalLine,
} from "react-icons/ri";
import { HiOutlineMailOpen, HiOutlineDeviceMobile } from "react-icons/hi";
import { TbBrandGooglePlay, TbBrandAppstore } from "react-icons/tb";
import { useSelector } from "react-redux";
import NewsletterForm from "./NewsletterForm";
import ReferralModal from "./ReferralModal";

const Footer2 = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [NewsletterEmail, setNewsletterEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createNewsletter] = useNewsletterPostMutation();
  const chakraToast = useToast();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!NewsletterEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(NewsletterEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await createNewsletter({ email: NewsletterEmail }).unwrap();

      if (res.status === "Success") {
        setNewsletterEmail("");
        setIsSubmitted(true);
        
        try {
          await fetch("/api/mail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: NewsletterEmail, type: 'newsletter' }),
          });
        } catch (e) {
          console.error("Failed to send newsletter email:", e);
        }

        chakraToast({
          title: "Welcome to YooKatale! 🎉",
          description: "You've been subscribed to our premium newsletter.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          variant: "subtle",
        });

        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (err) {
      chakraToast({
        title: "Subscription Failed",
        description: err.data?.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "Fresh Produce", href: "/products/fresh-produce" },
        { label: "Groceries", href: "/products/groceries" },
        { label: "Premium Selection", href: "/products/premium" },
        { label: "Weekly Deals", href: "/deals" },
        { label: "Gift Cards", href: "/gift-cards" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Express Delivery", href: "/services/delivery" },
        { label: "Business Solutions", href: "/business" },
        { label: "Farm Connect", href: "/farm-connect" },
        { label: "Subscription Box", href: "/subscription" },
        { label: "Catering", href: "/catering" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Investors", href: "/investors" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Track Order", href: "/track" },
        { label: "Returns", href: "/returns" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  const policyLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  const socialLinks = [
    { icon: RiFacebookFill, href: "https://facebook.com/yookatale", label: "Facebook", color: "#1877F2" },
    { icon: RiTwitterXFill, href: "https://twitter.com/YooKatale", label: "X", color: "#000000" },
    { icon: RiInstagramFill, href: "https://instagram.com/yookatale", label: "Instagram", color: "#E4405F" },
    { icon: RiLinkedinFill, href: "https://linkedin.com/company/yookatale", label: "LinkedIn", color: "#0A66C2" },
    { icon: RiTiktokFill, href: "https://tiktok.com/@yookatale", label: "TikTok", color: "#000000" },
    { icon: RiYoutubeFill, href: "https://youtube.com/yookatale", label: "YouTube", color: "#FF0000" },
  ];

  const trustBadges = [
    { icon: RiShieldCheckFill, label: "Secure Payments", color: "green.500" },
    { icon: FiCheck, label: "Quality Guaranteed", color: "blue.500" },
    { icon: HiOutlineDeviceMobile, label: "Mobile First", color: "purple.500" },
    { icon: RiGlobalLine, label: "Nationwide Delivery", color: "orange.500" },
  ];

  return (
    <>
      <NewsletterForm />
      
      {/* Premium Footer Container */}
      <Box as="footer" bg="gray.900" color="white" position="relative" overflow="hidden">
        {/* Top Gradient Border */}
        <Box 
          h="4px" 
          bgGradient="linear(to-r, #38A169, #F6AD55, #805AD5)"
          w="full"
        />
        
        {/* Decorative Elements */}
        <Box 
          position="absolute"
          top="10%"
          right="5%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(56, 161, 105, 0.1) 0%, transparent 70%)"
          zIndex={0}
        />
        
        <Box 
          position="absolute"
          bottom="20%"
          left="5%"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(246, 173, 85, 0.1) 0%, transparent 70%)"
          zIndex={0}
        />

        {/* Main Content */}
        <Container maxW="8xl" position="relative" zIndex={1}>
          {/* Trust Badges */}
          <Flex 
            justify="center" 
            align="center" 
            py={6} 
            borderBottom="1px solid" 
            borderColor="gray.800"
            flexWrap="wrap"
            gap={8}
          >
            {trustBadges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
              <Flex key={badge.label} align="center" gap={2}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  <BadgeIcon size={20} color={badge.color} />
                </Box>
                <Text fontSize="sm" fontWeight="500" color="gray.300">
                  {badge.label}
                </Text>
              </Flex>
            );
            })}
          </Flex>

          {/* Main Grid */}
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 5 }} 
            spacing={{ base: 8, lg: 12 }}
            py={{ base: 10, lg: 16 }}
          >
            {/* Brand Column */}
            <VStack align="start" spacing={6}>
              <VStack align="start" spacing={3}>
                <Heading 
                  size="lg" 
                  bgGradient="linear(to-r, #38A169, #68D391)"
                  bgClip="text"
                  fontWeight="800"
                >
                  YooKatale
                </Heading>
                <Text fontSize="sm" color="gray.400" lineHeight="tall">
                  Uganda's premium fresh produce marketplace. Farm to table, delivered fresh.
                </Text>
              </VStack>

              {/* Contact Info */}
              <VStack align="start" spacing={3}>
                <Flex align="center" gap={3}>
                  <Box
                    p={2}
                    borderRadius="md"
                    bg="green.900"
                    border="1px solid"
                    borderColor="green.700"
                  >
                    <FaPhone size={16} color="#68D391" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Call us 24/7</Text>
                    <Link 
                      href="tel:+256786118137"
                      fontSize="md"
                      fontWeight="600"
                      color="white"
                      _hover={{ color: "green.300", textDecoration: "none" }}
                    >
                      +256 786 118137
                    </Link>
                  </VStack>
                </Flex>

                <Flex align="center" gap={3}>
                  <Box
                    p={2}
                    borderRadius="md"
                    bg="blue.900"
                    border="1px solid"
                    borderColor="blue.700"
                  >
                    <FiMail size={16} color="#63B3ED" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Email support</Text>
                    <Link 
                      href="mailto:support@yookatale.app"
                      fontSize="sm"
                      fontWeight="500"
                      color="gray.300"
                      _hover={{ color: "white", textDecoration: "none" }}
                    >
                      support@yookatale.app
                    </Link>
                  </VStack>
                </Flex>
              </VStack>
            </VStack>

            {/* Quick Links Sections */}
            {footerSections.map((section) => (
              <VStack key={section.title} align="start" spacing={4}>
                <Text 
                  fontSize="md" 
                  fontWeight="700" 
                  color="white"
                  letterSpacing="wide"
                >
                  {section.title}
                </Text>
                <VStack align="start" spacing={2}>
                  {section.links.map((link) => (
                    <NextLink key={link.label} href={link.href} passHref>
                      <Link
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color="gray.400"
                        fontSize="sm"
                        _hover={{ 
                          color: "white",
                          transform: "translateX(4px)",
                          textDecoration: "none"
                        }}
                        transition="all 0.2s"
                      >
                        <FiChevronRight size={12} />
                        {link.label}
                      </Link>
                    </NextLink>
                  ))}
                </VStack>
              </VStack>
            ))}

            {/* Newsletter Column */}
            <VStack align="start" spacing={6}>
              <VStack align="start" spacing={3}>
                <Text fontSize="md" fontWeight="700" color="white">
                  Stay in the Loop
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Get exclusive deals, recipe tips, and farm stories delivered weekly.
                </Text>
              </VStack>

              <form onSubmit={handleNewsletterSubmit} style={{ width: "100%" }}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!emailError}>
                    <InputGroup size="lg">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={NewsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          setEmailError("");
                        }}
                        bg="gray.800"
                        borderColor="gray.700"
                        color="white"
                        fontSize="sm"
                        _placeholder={{ color: "gray.500" }}
                        _hover={{ borderColor: "gray.600" }}
                        _focus={{ 
                          borderColor: "#38A169",
                          boxShadow: "0 0 0 3px rgba(56, 161, 105, 0.1)"
                        }}
                        borderRadius="lg"
                        pr="4.5rem"
                      />
                      <InputRightElement width="4.5rem" mr={1}>
                        <Button
                          type="submit"
                          size="sm"
                          h="2rem"
                          w="3.5rem"
                          colorScheme="green"
                          isLoading={isLoading}
                          isDisabled={isSubmitted}
                          borderRadius="md"
                          _hover={{ transform: "scale(1.05)" }}
                          transition="all 0.2s"
                        >
                          {isSubmitted ? <FiCheck /> : <RiSendPlaneFill />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage fontSize="xs">{emailError}</FormErrorMessage>
                  </FormControl>
                  
                  {isSubmitted && (
                    <Badge 
                      colorScheme="green" 
                      variant="subtle"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      Subscribed! Check your email
                    </Badge>
                  )}
                </VStack>
              </form>

              {/* Social Media */}
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Connect with us
                </Text>
                <HStack spacing={2}>
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    return (
                    <IconButton
                      key={social.label}
                      as="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      icon={<SocialIcon size={20} />}
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      bg="whiteAlpha.50"
                      _hover={{ 
                        color: social.color,
                        bg: "whiteAlpha.100",
                        transform: "translateY(-2px)",
                        boxShadow: "lg"
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    />
                  );
                  })}
                </HStack>
              </VStack>
            </VStack>
          </SimpleGrid>

          {/* App Downloads */}
          <Box 
            py={8} 
            px={6} 
            bgGradient="linear(to-r, gray.800, gray.900)"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.700"
            mb={8}
          >
            <Flex 
              direction={{ base: "column", md: "row" }} 
              align="center" 
              justify="space-between"
              gap={6}
            >
              <VStack align={{ base: "center", md: "start" }} spacing={2}>
                <Text fontSize="lg" fontWeight="700" color="white">
                  Get the YooKatale App
                </Text>
                <Text fontSize="sm" color="gray.400" textAlign={{ base: "center", md: "left" }}>
                  Shop faster, track orders, and get exclusive mobile-only deals.
                </Text>
              </VStack>

              <HStack spacing={4}>
                <Button
                  as="a"
                  href="https://play.google.com/store/apps/details?id=com.yookataleapp.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<TbBrandGooglePlay size={24} />}
                  colorScheme="green"
                  size="lg"
                  px={6}
                  borderRadius="xl"
                  _hover={{ 
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(56, 161, 105, 0.3)"
                  }}
                  transition="all 0.3s"
                >
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" opacity={0.9}>Get it on</Text>
                    <Text fontSize="md" fontWeight="700">Google Play</Text>
                  </VStack>
                </Button>

                <Button
                  as="a"
                  href="/subscription"
                  leftIcon={<TbBrandAppstore size={24} />}
                  colorScheme="gray"
                  size="lg"
                  px={6}
                  borderRadius="xl"
                  bg="gray.800"
                  border="1px solid"
                  borderColor="gray.700"
                  _hover={{ 
                    bg: "gray.700",
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
                  }}
                  transition="all 0.3s"
                >
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" opacity={0.9}>Download on the</Text>
                    <Text fontSize="md" fontWeight="700">App Store</Text>
                  </VStack>
                </Button>
              </HStack>
            </Flex>
          </Box>

          {/* Bottom Footer */}
          <Box pt={8} borderTop="1px solid" borderColor="gray.800">
            <Flex
              direction={{ base: "column", lg: "row" }}
              align={{ base: "center", lg: "center" }}
              justify="space-between"
              gap={{ base: 6, lg: 0 }}
              py={4}
            >
              {/* Copyright */}
              <VStack align={{ base: "center", lg: "start" }} spacing={2}>
                <Text fontSize="sm" color="gray.500">
                  © {new Date().getFullYear()} YooKatale Technologies Ltd. All rights reserved.
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Registered in Uganda | Company No. 800200
                </Text>
              </VStack>

              {/* Policy Links */}
              <HStack
                spacing={{ base: 3, md: 6 }}
                wrap="wrap"
                justify={{ base: "center", lg: "flex-end" }}
              >
                {policyLinks.map((link) => (
                  <NextLink key={link.label} href={link.href} passHref>
                    <Link
                      fontSize="xs"
                      color="gray.500"
                      _hover={{ 
                        color: "white",
                        textDecoration: "none"
                      }}
                      transition="color 0.2s"
                    >
                      {link.label}
                    </Link>
                  </NextLink>
                ))}
              </HStack>
            </Flex>

            {/* Bottom Bar */}
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={4}
              pt={4}
              pb={6}
            >
              <HStack spacing={4}>
                <Button
                  onClick={openReferral}
                  variant="outline"
                  colorScheme="green"
                  size="sm"
                  leftIcon={<FiUser />}
                  borderRadius="full"
                  _hover={{ 
                    bg: "green.900",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(56, 161, 105, 0.2)"
                  }}
                  transition="all 0.3s"
                >
                  Invite a Friend & Earn
                </Button>
                
                <Button
                  as="a"
                  href="https://wa.me/256786118137"
                  target="_blank"
                  leftIcon={<FaWhatsapp />}
                  colorScheme="whatsapp"
                  size="sm"
                  borderRadius="full"
                  variant="ghost"
                  _hover={{ 
                    bg: "whatsapp.900",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s"
                >
                  Chat on WhatsApp
                </Button>
              </HStack>

              <Text fontSize="xs" color="gray.600" textAlign="center">
                Prices and availability are subject to change. 
                <br />
                YooKatale™ is a registered trademark.
              </Text>
            </Flex>
          </Box>
        </Container>
      </Box>

      <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />
    </>
  );
};

export default Footer2;