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
} from "@chakra-ui/react";
import { useNewsletterPostMutation } from "@slices/usersApiSlice";
import NextLink from "next/link";
import { useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
  FaWhatsapp,
  FaGooglePlay,
  FaAppStore,
} from "react-icons/fa";
import { FiMail, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import NewsletterForm from "./NewsletterForm";
import ReferralModal from "./ReferralModal";

const Footer2 = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [NewsletterEmail, setNewsletterEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
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
          title: "Subscribed!",
          description: "You've been added to our newsletter. Check your email!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message || "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = [
    { label: "Go Premium", href: "/subscription", condition: userInfo },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "News Blog", href: "/news" },
    { label: "Advertise", href: "/advertising" },
    { label: "Careers", href: "/careers" },
  ];

  const socialLinks = [
    { icon: FaLinkedin, href: "https://www.linkedin.com/company/96071915/admin/feed/posts/", label: "LinkedIn" },
    { icon: FaTwitter, href: "https://twitter.com/YooKatale", label: "Twitter" },
    { icon: FaWhatsapp, href: "https://wa.me/256786118137", label: "WhatsApp" },
    { icon: FaFacebook, href: "https://www.facebook.com/profile.php?id=100094194942669", label: "Facebook" },
    { icon: FaInstagram, href: "https://www.instagram.com/p/CuHdaksN5UW/", label: "Instagram" },
  ];

  const policyLinks = [
    { label: "News", href: "/news" },
    { label: "Partner", href: "/partner" },
    { label: "FAQs", href: "/faqs" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Usage Policy", href: "/usage" },
  ];

  return (
    <>
      <NewsletterForm />
      
      <Box bg="gray.900" color="white">
        {/* Main Footer Content */}
        <Box py={{ base: 8, md: 12 }} borderBottom="1px solid" borderColor="gray.800">
          <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 4 }} 
              spacing={{ base: 8, md: 10 }}
              mb={{ base: 8, md: 12 }}
            >
              {/* Contact & Social */}
              <VStack align="start" spacing={4}>
                <Text fontSize="lg" fontWeight="600" color="white">
                  Get in Touch
                </Text>
                <VStack align="start" spacing={3}>
                  <HStack spacing={3}>
                    <FaPhone color="#38A169" />
                    <Link 
                      href="tel:+256786118137" 
                      color="gray.300"
                      _hover={{ color: "white", textDecoration: "none" }}
                    >
                      +256 786 118137
                    </Link>
                  </HStack>
                  <HStack spacing={3}>
                    <FaEnvelope color="#38A169" />
                    <Link 
                      href="mailto:info@yookatale.app"
                      color="gray.300"
                      _hover={{ color: "white", textDecoration: "none" }}
                    >
                      info@yookatale.app
                    </Link>
                  </HStack>
                </VStack>
                
                <VStack align="start" spacing={3}>
                  <Text fontSize="sm" color="gray.400">Follow us</Text>
                  <HStack spacing={3}>
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <IconButton
                          key={social.label}
                          as="a"
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          icon={<Icon size={18} />}
                          size="sm"
                          variant="ghost"
                          color="gray.300"
                          _hover={{
                            color: "#38A169",
                            bg: "whiteAlpha.100",
                            transform: "translateY(-2px)",
                          }}
                          transition="all 0.2s"
                        />
                      );
                    })}
                  </HStack>
                </VStack>
              </VStack>

              {/* Quick Links */}
              <VStack align="start" spacing={4}>
                <Text fontSize="lg" fontWeight="600" color="white">
                  Quick Links
                </Text>
                <VStack align="start" spacing={2}>
                  {footerLinks
                    .filter(link => !link.condition || userInfo)
                    .map((link) => (
                      <NextLink key={link.label} href={link.href} passHref>
                        <Link
                          color="gray.300"
                          fontSize="sm"
                          _hover={{ 
                            color: "white",
                            textDecoration: "none",
                            transform: "translateX(4px)"
                          }}
                          transition="all 0.2s"
                        >
                          {link.label}
                        </Link>
                      </NextLink>
                    ))}
                </VStack>
              </VStack>

              {/* Newsletter */}
              <VStack align="start" spacing={4}>
                <Text fontSize="lg" fontWeight="600" color="white">
                  Stay Updated
                </Text>
                <form onSubmit={handleNewsletterSubmit} style={{ width: "100%" }}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!emailError}>
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={NewsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          setEmailError("");
                        }}
                        bg="gray.800"
                        borderColor="gray.700"
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                        _hover={{ borderColor: "gray.600" }}
                        _focus={{ 
                          borderColor: "#38A169",
                          boxShadow: "0 0 0 1px #38A169"
                        }}
                        size="lg"
                        fontSize="sm"
                      />
                      <FormErrorMessage>{emailError}</FormErrorMessage>
                    </FormControl>
                    
                    <Text fontSize="xs" color="gray.400">
                      Subscribe to receive news, promotions, and special offers from YooKatale
                    </Text>
                    
                    <Button
                      type="submit"
                      colorScheme="green"
                      size="lg"
                      width="full"
                      isLoading={isLoading}
                      loadingText="Subscribing..."
                      leftIcon={<FiMail />}
                      _hover={{ 
                        bg: "#2F855A",
                        transform: "translateY(-2px)",
                        boxShadow: "lg"
                      }}
                      transition="all 0.2s"
                    >
                      Subscribe
                    </Button>
                  </VStack>
                </form>
              </VStack>

              {/* Download App */}
              <VStack align="start" spacing={4}>
                <Text fontSize="lg" fontWeight="600" color="white">
                  Download Our App
                </Text>
                <Text fontSize="sm" color="gray.300">
                  Get the best experience on mobile
                </Text>
                
                <VStack spacing={3} width="full">
                  <Button
                    as="a"
                    href="https://play.google.com/store/apps/details?id=com.yookataleapp.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    leftIcon={<FaGooglePlay />}
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                    width="full"
                    justifyContent="flex-start"
                    _hover={{
                      bg: "whiteAlpha.100",
                      borderColor: "white",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.400">Get it on</Text>
                      <Text fontSize="sm" fontWeight="600">Google Play</Text>
                    </VStack>
                  </Button>

                  <NextLink href="/subscription" passHref>
                    <Link display="block" width="full" _hover={{ textDecoration: "none" }}>
                      <Button
                        as="span"
                        leftIcon={<FaAppStore />}
                        variant="outline"
                        colorScheme="gray"
                        size="lg"
                        width="full"
                        justifyContent="flex-start"
                        _hover={{
                          bg: "whiteAlpha.100",
                          borderColor: "white",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s"
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color="gray.400">Download on the</Text>
                          <Text fontSize="sm" fontWeight="600">App Store</Text>
                        </VStack>
                      </Button>
                    </Link>
                  </NextLink>
                </VStack>
              </VStack>
            </SimpleGrid>
          </Box>
        </Box>

        {/* Bottom Footer */}
        <Box py={6} bg="gray.900">
          <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
            <Flex
              direction={{ base: "column", lg: "row" }}
              align={{ base: "center", lg: "center" }}
              justify="space-between"
              gap={{ base: 4, lg: 0 }}
            >
              {/* Copyright & Invite */}
              <VStack align={{ base: "center", lg: "start" }} spacing={3}>
                <Flex align="center" gap={2} color="gray.400">
                  <Text fontSize="sm">
                    © {new Date().getFullYear()} YooKatale. All rights reserved.
                  </Text>
                </Flex>
                
                <Button
                  onClick={openReferral}
                  variant="ghost"
                  colorScheme="green"
                  size="sm"
                  leftIcon={<FiUser />}
                  _hover={{ 
                    bg: "whiteAlpha.100",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.2s"
                >
                  Invite a Friend
                </Button>
              </VStack>

              {/* Policy Links */}
              <HStack
                spacing={{ base: 4, md: 6 }}
                wrap="wrap"
                justify={{ base: "center", lg: "flex-end" }}
              >
                {policyLinks.map((link) => (
                  <NextLink key={link.label} href={link.href} passHref>
                    <Link
                      fontSize="sm"
                      color="gray.400"
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
          </Box>
        </Box>
      </Box>

      <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />
    </>
  );
};

export default Footer2;
