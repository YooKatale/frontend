"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  IconButton,
  useToast,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useNewsletterPostMutation } from "@slices/usersApiSlice";
import { ThemeColors } from "@constants/constants";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiX } from "react-icons/fi";

const MotionBox = motion(Box);

const themeBorder = `${ThemeColors.primaryColor}25`;

const NewsletterForm = () => {
  const [NewsletterEmail, setNewsletterEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [userClosed, setUserClosed] = useState(false);
  const [createNewsletter] = useNewsletterPostMutation();
  const chakraToast = useToast();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!NewsletterEmail?.trim()) return;

    setLoading(true);
    const emailToSend = NewsletterEmail.trim();

    try {
      const res = await createNewsletter({ email: emailToSend }).unwrap();

      if (res.status === "Success") {
        setNewsletterEmail("");
        setDisplay(false);
        setUserClosed(true);

        try {
          await fetch("/api/mail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailToSend,
              type: "newsletter",
            }),
          });
        } catch (emailError) {
          console.error("⚠️ Failed to send newsletter email:", emailError);
        }

        chakraToast({
          title: "Subscribed!",
          description:
            "You've been added to our newsletter. Check your inbox for updates.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (err) {
      chakraToast({
        title: "Something went wrong",
        description:
          err.data?.message || err.data || err.error || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userClosed) {
      const t = setTimeout(() => setDisplay(true), 2500);
      return () => clearTimeout(t);
    }
  }, [userClosed]);

  const handleClose = () => {
    setDisplay(false);
    setUserClosed(true);
  };

  return (
    <AnimatePresence>
      {display && (
        <MotionBox
          position="fixed"
          left={{ base: 4, md: 6, lg: 8 }}
          bottom={{ base: 4, md: 6, lg: 8 }}
          zIndex={9999}
          w={{ base: "calc(100% - 2rem)", sm: "400px", lg: "440px" }}
          maxW="calc(100vw - 2rem)"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <Box
            bg="white"
            rounded="2xl"
            shadow="2xl"
            border="1px solid"
            borderColor={themeBorder}
            overflow="hidden"
            position="relative"
            sx={{
              backdropFilter: "blur(12px)",
              bg: "white",
            }}
          >
            {/* Header strip */}
            <Flex
              bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
              px={5}
              py={4}
              align="center"
              justify="space-between"
              position="relative"
            >
              <Box
                position="absolute"
                top={0}
                right={0}
                w="100px"
                h="100px"
                bg="whiteAlpha.100"
                roundedBottomLeft="full"
              />
              <Flex align="center" gap={3}>
                <Box
                  p={2}
                  rounded="xl"
                  bg="whiteAlpha.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiMail size={22} color="white" />
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="white"
                  letterSpacing="wide"
                >
                  Stay in the loop
                </Text>
              </Flex>
              <IconButton
                aria-label="Close newsletter"
                icon={<FiX size={18} />}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.25" }}
                size="sm"
                rounded="full"
                onClick={handleClose}
              />
            </Flex>

            {/* Body */}
            <Box px={5} py={5}>
              <form onSubmit={handleNewsletterSubmit}>
                <MotionBox
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color="gray.800"
                    mb={4}
                    lineHeight="tall"
                  >
                    Subscribe to our newsletter for updates, offers &amp; more.
                  </Text>

                  <InputGroup size="md" mb={4}>
                    <InputLeftElement pointerEvents="none" h="full">
                      <FiMail size={18} color={ThemeColors.primaryColor} />
                    </InputLeftElement>
                    <Input
                      type="email"
                      name="NewsletterEmail"
                      placeholder="Enter your email"
                      value={NewsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      pl={10}
                      variant="filled"
                      rounded="xl"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: ThemeColors.primaryColor,
                        boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                        bg: "white",
                      }}
                      _placeholder={{ color: "gray.500" }}
                    />
                  </InputGroup>

                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={4}
                    lineHeight="tall"
                  >
                    By clicking &quot;Subscribe&quot; you agree to receive news,
                    promotions and offers from YooKatale. Unsubscribe anytime.
                  </Text>

                  <Flex gap={3} align="center">
                    <Button
                      type="submit"
                      flex={1}
                      size="md"
                      rounded="xl"
                      bg={ThemeColors.primaryColor}
                      color="white"
                      _hover={{
                        bg: ThemeColors.secondaryColor,
                        transform: "translateY(-1px)",
                        boxShadow: "lg",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all 0.2s"
                      leftIcon={!isLoading ? <FiMail size={16} /> : undefined}
                      isLoading={isLoading}
                      loadingText="Subscribing…"
                      isDisabled={!NewsletterEmail?.trim()}
                    >
                      Subscribe
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      color="gray.500"
                      onClick={handleClose}
                      _hover={{ bg: "gray.100", color: "gray.700" }}
                    >
                      Maybe later
                    </Button>
                  </Flex>
                </MotionBox>
              </form>
            </Box>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default NewsletterForm;
