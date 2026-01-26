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
  Textarea,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Star, X, Send } from "lucide-react";
import { usePlatformFeedbackCreateMutation } from "@slices/usersApiSlice";

const PlatformFeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userAgent, setUserAgent] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const chakraToast = useToast();
  const [createPlatformFeedback] = usePlatformFeedbackCreateMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      setUserAgent(ua);

      // Check if user has already submitted feedback recently
      const lastFeedback = localStorage.getItem("platformFeedbackLastSubmitted");
      const feedbackCount = parseInt(localStorage.getItem("platformFeedbackCount") || "0");

      // Show prompt after user has been active
      const shouldShow = () => {
        if (feedbackCount >= 2) return false; // Don't show more than 2 times
        if (!lastFeedback) return true; // First time

        const daysSinceLastFeedback = (Date.now() - parseInt(lastFeedback)) / (1000 * 60 * 60 * 24);
        return daysSinceLastFeedback >= 14; // Show again after 14 days
      };

      // Show after user has been on the platform for a while
      // Require more activity: at least 5 page views and 5 minutes of activity
      const pageViews = parseInt(sessionStorage.getItem("pageViews") || "0");
      sessionStorage.setItem("pageViews", (pageViews + 1).toString());

      // Track session start time
      const sessionStart = sessionStorage.getItem("sessionStartTime");
      if (!sessionStart) {
        sessionStorage.setItem("sessionStartTime", Date.now().toString());
      }

      // Calculate time spent in session (in minutes)
      const timeSpent = sessionStart 
        ? (Date.now() - parseInt(sessionStart)) / (1000 * 60)
        : 0;

      // Only show if user has viewed at least 5 pages AND spent at least 5 minutes
      if (shouldShow() && pageViews >= 5 && timeSpent >= 5) {
        // Random delay between 2-5 minutes after meeting criteria
        // This ensures it doesn't interrupt the user immediately
        const delay = 120000 + Math.random() * 180000; // 2-5 minutes
        const timer = setTimeout(() => {
          // Double check user is still active (hasn't left the page)
          const currentPageViews = parseInt(sessionStorage.getItem("pageViews") || "0");
          const currentTimeSpent = sessionStart 
            ? (Date.now() - parseInt(sessionStart)) / (1000 * 60)
            : 0;
          
          // Only show if still meets criteria
          if (currentPageViews >= 5 && currentTimeSpent >= 5) {
            setIsOpen(true);
          }
        }, delay);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRatingClick = (value) => {
    setRating(value);
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      chakraToast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const feedbackData = {
        userId: userInfo?._id || null,
        rating,
        feedback: feedback.trim() || null,
        category: category || "general",
        platform: /iPad|iPhone|iPod/.test(userAgent) ? "ios" : /android/i.test(userAgent) ? "android" : "web",
        userEmail: userInfo?.email || null,
        userName: userInfo?.firstname || userInfo?.email?.split("@")[0] || "Anonymous",
      };

      await createPlatformFeedback(feedbackData).unwrap();

      setHasSubmitted(true);
      localStorage.setItem("platformFeedbackLastSubmitted", Date.now().toString());
      localStorage.setItem("platformFeedbackCount", (parseInt(localStorage.getItem("platformFeedbackCount") || "0") + 1).toString());

      chakraToast({
        title: "Thank You!",
        description: "Your feedback helps us improve YooKatale.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setHasSubmitted(false);
        setRating(0);
        setFeedback("");
        setCategory("general");
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      chakraToast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("platformFeedbackDismissed", "true");
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

  if (!isOpen) return null;

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
          {!hasSubmitted ? (
            <VStack spacing={6} textAlign="center">
              <Box>
                <Heading
                  as="h2"
                  size={{ base: "lg", md: "xl" }}
                  color={ThemeColors.darkColor}
                  mb={2}
                >
                  How's Your Experience?
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                  We'd love to hear about your experience with YooKatale. Your feedback helps us serve you better!
                </Text>
              </Box>

              <Box w="100%" py={4}>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} mb={3}>
                    Rate Your Experience
                  </FormLabel>
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
                </FormControl>
              </Box>

              <Box w="100%">
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} mb={2}>
                    Category (optional)
                  </FormLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    size="md"
                    borderRadius="lg"
                    borderColor="gray.300"
                    _focus={{ borderColor: ThemeColors.darkColor, boxShadow: `0 0 0 1px ${ThemeColors.darkColor}` }}
                    mb={4}
                  >
                    <option value="general">General experience</option>
                    <option value="service">Service</option>
                    <option value="delivery">Delivery</option>
                    <option value="product">Products</option>
                    <option value="app">App</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }} mb={2}>
                    Tell Us More (Optional)
                  </FormLabel>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                    rows={4}
                    resize="vertical"
                    fontSize={{ base: "sm", md: "md" }}
                    borderRadius="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: ThemeColors.darkColor,
                      boxShadow: `0 0 0 1px ${ThemeColors.darkColor}`,
                    }}
                  />
                </FormControl>
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
                  leftIcon={<Send size={18} />}
                  onClick={handleSubmit}
                  isDisabled={rating === 0}
                  _hover={{
                    bg: ThemeColors.primaryColor,
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _disabled={{
                    bg: "gray.300",
                    cursor: "not-allowed",
                  }}
                  transition="all 0.3s"
                >
                  Submit Feedback
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
                  We truly appreciate your feedback. It helps us make YooKatale even better for you!
                </Text>
              </Box>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PlatformFeedbackModal;

