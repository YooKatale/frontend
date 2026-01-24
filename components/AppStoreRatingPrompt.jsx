"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useToast,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Star, X, ExternalLink } from "lucide-react";
import { useAppRatingCreateMutation } from "@slices/usersApiSlice";

const AppStoreRatingPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showStoreRedirect, setShowStoreRedirect] = useState(false);
  const [userAgent, setUserAgent] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const chakraToast = useToast();
  const [createAppRating] = useAppRatingCreateMutation();

  useEffect(() => {
    // Detect user agent
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      setUserAgent(ua);
      
      // Check if user has already rated
      const rated = localStorage.getItem("appStoreRated");
      if (rated === "true") {
        setHasRated(true);
        return;
      }

      // Check if user has seen the prompt before
      const lastPrompt = localStorage.getItem("appRatingLastPrompt");
      const promptCount = parseInt(localStorage.getItem("appRatingPromptCount") || "0");

      // Show prompt after user has been active for a while
      // Show after 3rd visit or after 7 days since last prompt
      const shouldShow = () => {
        if (promptCount >= 3) return false; // Don't show more than 3 times
        if (!lastPrompt) return true; // First time
        
        const daysSinceLastPrompt = (Date.now() - parseInt(lastPrompt)) / (1000 * 60 * 60 * 24);
        return daysSinceLastPrompt >= 7; // Show again after 7 days
      };

      // Track session activity
      const pageViews = parseInt(sessionStorage.getItem("appRatingPageViews") || "0");
      sessionStorage.setItem("appRatingPageViews", (pageViews + 1).toString());

      // Track session start time
      const sessionStart = sessionStorage.getItem("appRatingSessionStart");
      if (!sessionStart) {
        sessionStorage.setItem("appRatingSessionStart", Date.now().toString());
      }

      // Calculate time spent in session (in minutes)
      const timeSpent = sessionStart 
        ? (Date.now() - parseInt(sessionStart)) / (1000 * 60)
        : 0;

      if (shouldShow() && pageViews >= 5 && timeSpent >= 5) {
        // Delay showing the prompt by 3-5 minutes after meeting criteria
        // This ensures it doesn't interrupt the user immediately
        const delay = 180000 + Math.random() * 120000; // 3-5 minutes
        const timer = setTimeout(() => {
          // Double check user is still active
          const currentPageViews = parseInt(sessionStorage.getItem("appRatingPageViews") || "0");
          const currentTimeSpent = sessionStart 
            ? (Date.now() - parseInt(sessionStart)) / (1000 * 60)
            : 0;
          
          // Only show if still meets criteria
          if (currentPageViews >= 5 && currentTimeSpent >= 5) {
            setIsOpen(true);
            localStorage.setItem("appRatingLastPrompt", Date.now().toString());
            localStorage.setItem("appRatingPromptCount", (promptCount + 1).toString());
          }
        }, delay);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  };

  const isAndroid = () => {
    return /android/i.test(userAgent);
  };

  const getStoreUrl = () => {
    if (isIOS()) {
      // App Store URL - Update this with your actual App Store link once published
      // Format: https://apps.apple.com/app/yookatale/id[YOUR_APP_ID]
      return process.env.NEXT_PUBLIC_APP_STORE_URL || "https://apps.apple.com/app/yookatale/id1234567890";
    } else if (isAndroid()) {
      // Play Store URL - Update this with your actual Play Store link once published
      // Format: https://play.google.com/store/apps/details?id=[YOUR_PACKAGE_NAME]
      return process.env.NEXT_PUBLIC_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.yookataleapp.app";
    }
    return null;
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setHoveredRating(0);
    
    // If rating is 4 or 5 stars, show store redirect
    if (value >= 4) {
      setShowStoreRedirect(true);
    } else {
      // For lower ratings, ask for feedback
      handleLowRating();
    }
  };

  const handleLowRating = async () => {
    try {
      if (userInfo?._id) {
        await createAppRating({
          userId: userInfo._id,
          rating: rating,
          platform: isIOS() ? "ios" : isAndroid() ? "android" : "web",
          redirectedToStore: false,
        }).unwrap();
      }
      
      chakraToast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will work to improve.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  const handleStoreRedirect = async () => {
    try {
      if (userInfo?._id) {
        await createAppRating({
          userId: userInfo._id,
          rating: rating,
          platform: isIOS() ? "ios" : isAndroid() ? "android" : "web",
          redirectedToStore: true,
        }).unwrap();
      }

      // Mark as rated
      localStorage.setItem("appStoreRated", "true");
      setHasRated(true);
      
      const storeUrl = getStoreUrl();
      if (storeUrl) {
        window.open(storeUrl, "_blank");
      }
      
      setIsOpen(false);
      
      chakraToast({
        title: "Thank you!",
        description: "Your support means the world to us!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Don't show again for this session
    sessionStorage.setItem("appRatingDismissed", "true");
  };

  const handleMaybeLater = () => {
    setIsOpen(false);
    // Reset prompt count to show again later
    localStorage.setItem("appRatingPromptCount", "0");
  };

  const renderStars = () => {
    return (
      <HStack spacing={2} justifyContent="center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoveredRating || rating);
          return (
            <Box
              key={star}
              as="button"
              cursor="pointer"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              transition="all 0.2s"
              transform={filled ? "scale(1.1)" : "scale(1)"}
            >
              <Icon
                as={Star}
                w={{ base: 8, md: 10 }}
                h={{ base: 8, md: 10 }}
                color={filled ? "#FFD700" : "#E2E8F0"}
                fill={filled ? "#FFD700" : "none"}
                stroke={filled ? "#FFD700" : "#E2E8F0"}
              />
            </Box>
          );
        })}
      </HStack>
    );
  };

  if (hasRated || !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size={{ base: "sm", md: "md" }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius="xl"
        mx={{ base: 4, md: 0 }}
        maxW={{ base: "90vw", md: "500px" }}
      >
        <ModalCloseButton
          onClick={handleClose}
          size="lg"
          color="gray.500"
          _hover={{ color: "gray.700" }}
        />
        <ModalBody p={{ base: 6, md: 8 }}>
          {!showStoreRedirect ? (
            <VStack spacing={6} textAlign="center">
              <Box>
                <Heading
                  as="h2"
                  size={{ base: "lg", md: "xl" }}
                  color={ThemeColors.darkColor}
                  mb={2}
                >
                  Enjoying YooKatale?
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                  Your feedback helps us improve! Would you mind rating us on the{" "}
                  {isIOS() ? "App Store" : isAndroid() ? "Play Store" : "store"}?
                </Text>
              </Box>

              <Box w="100%" py={4}>
                {renderStars()}
                {rating > 0 && (
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    mt={3}
                    fontWeight="medium"
                  >
                    {rating === 5
                      ? "Excellent! ⭐"
                      : rating === 4
                      ? "Great! 👍"
                      : rating === 3
                      ? "Good! 😊"
                      : rating === 2
                      ? "Fair"
                      : "Poor"}
                  </Text>
                )}
              </Box>

              {rating >= 4 && (
                <VStack spacing={3} w="100%">
                  <Button
                    w="100%"
                    bg={ThemeColors.darkColor}
                    color="white"
                    size="lg"
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="semibold"
                    borderRadius="lg"
                    rightIcon={<ExternalLink size={18} />}
                    onClick={handleStoreRedirect}
                    _hover={{
                      bg: ThemeColors.primaryColor,
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.3s"
                  >
                    Rate on {isIOS() ? "App Store" : isAndroid() ? "Play Store" : "Store"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMaybeLater}
                    color="gray.600"
                  >
                    Maybe Later
                  </Button>
                </VStack>
              )}

              {rating > 0 && rating < 4 && (
                <VStack spacing={3} w="100%">
                  <Button
                    w="100%"
                    bg={ThemeColors.darkColor}
                    color="white"
                    size="lg"
                    onClick={handleLowRating}
                    _hover={{ bg: ThemeColors.primaryColor }}
                  >
                    Submit Feedback
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    color="gray.600"
                  >
                    Close
                  </Button>
                </VStack>
              )}

              {rating === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMaybeLater}
                  color="gray.600"
                >
                  Maybe Later
                </Button>
              )}
            </VStack>
          ) : (
            <VStack spacing={6} textAlign="center">
              <Box>
                <Heading
                  as="h2"
                  size={{ base: "lg", md: "xl" }}
                  color={ThemeColors.darkColor}
                  mb={2}
                >
                  Thank You! 🙏
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                  We're thrilled you love YooKatale! Your rating helps others discover us.
                </Text>
              </Box>

              <VStack spacing={3} w="100%">
                <Button
                  w="100%"
                  bg={ThemeColors.darkColor}
                  color="white"
                  size="lg"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="semibold"
                  borderRadius="lg"
                  rightIcon={<ExternalLink size={18} />}
                  onClick={handleStoreRedirect}
                  _hover={{
                    bg: ThemeColors.primaryColor,
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.3s"
                >
                  Rate on {isIOS() ? "App Store" : isAndroid() ? "Play Store" : "Store"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  color="gray.600"
                >
                  Maybe Later
                </Button>
              </VStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AppStoreRatingPrompt;

