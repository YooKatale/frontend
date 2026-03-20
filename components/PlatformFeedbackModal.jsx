"use client";

import {
  Box,
  Button,
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
  Select,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import { useAuth } from "@slices/authSlice";
import { Star, Send } from "lucide-react";
import { usePlatformFeedbackCreateMutation } from "@slices/usersApiSlice";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const PlatformFeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userAgent, setUserAgent] = useState("");

  const { userInfo } = useAuth();
  const chakraToast = useToast();
  const [createPlatformFeedback] = usePlatformFeedbackCreateMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      setUserAgent(ua);

      const lastFeedback = localStorage.getItem("platformFeedbackLastSubmitted");
      const feedbackCount = parseInt(localStorage.getItem("platformFeedbackCount") || "0");

      const shouldShow = () => {
        if (feedbackCount >= 2) return false;
        if (!lastFeedback) return true;
        const days = (Date.now() - parseInt(lastFeedback)) / (1000 * 60 * 60 * 24);
        return days >= 14;
      };

      const pageViews = parseInt(sessionStorage.getItem("pageViews") || "0");
      sessionStorage.setItem("pageViews", (pageViews + 1).toString());

      const sessionStart = sessionStorage.getItem("sessionStartTime");
      if (!sessionStart) sessionStorage.setItem("sessionStartTime", Date.now().toString());

      const timeSpent = sessionStart ? (Date.now() - parseInt(sessionStart)) / (1000 * 60) : 0;

      if (shouldShow() && pageViews >= 5 && timeSpent >= 5) {
        const delay = 120000 + Math.random() * 180000;
        const timer = setTimeout(() => {
          const curViews = parseInt(sessionStorage.getItem("pageViews") || "0");
          const curTime = sessionStart ? (Date.now() - parseInt(sessionStart)) / (1000 * 60) : 0;
          if (curViews >= 5 && curTime >= 5) setIsOpen(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) {
      chakraToast({ title: "Please select a rating", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    try {
      await createPlatformFeedback({
        userId: userInfo?._id || null,
        rating,
        feedback: feedback.trim() || null,
        category: category || "general",
        platform: /iPad|iPhone|iPod/.test(userAgent) ? "ios" : /android/i.test(userAgent) ? "android" : "web",
        userEmail: userInfo?.email || null,
        userName: userInfo?.firstname || userInfo?.email?.split("@")[0] || "Anonymous",
      }).unwrap();

      setHasSubmitted(true);
      localStorage.setItem("platformFeedbackLastSubmitted", Date.now().toString());
      localStorage.setItem("platformFeedbackCount", (parseInt(localStorage.getItem("platformFeedbackCount") || "0") + 1).toString());

      chakraToast({ title: "Feedback received", description: "Thank you for helping us improve.", status: "success", duration: 3000, isClosable: true });

      setTimeout(() => {
        setIsOpen(false);
        setHasSubmitted(false);
        setRating(0);
        setFeedback("");
        setCategory("general");
      }, 1800);
    } catch {
      chakraToast({ title: "Could not submit feedback", status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleClose = () => { setIsOpen(false); sessionStorage.setItem("platformFeedbackDismissed", "true"); };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xs" closeOnOverlayClick={false}>
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(6px)" />
      <ModalContent
        borderRadius="2xl"
        mx={4}
        maxW="380px"
        boxShadow="0 20px 60px rgba(0,0,0,0.15)"
        overflow="hidden"
      >
        <ModalCloseButton
          size="sm" top={3} right={3}
          color="gray.400"
          _hover={{ color: "gray.700", bg: "gray.100" }}
          borderRadius="full"
          zIndex={10}
        />

        {!hasSubmitted ? (
          <ModalBody p={6} pt={7}>
            <VStack spacing={5} align="stretch">
              {/* Header */}
              <VStack spacing={1} textAlign="center">
                <Box
                  w={11} h={11} borderRadius="xl" mx="auto" mb={1}
                  bg={`${ThemeColors.primaryColor}12`}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Star size={20} color={ThemeColors.primaryColor} fill={ThemeColors.primaryColor} />
                </Box>
                <Text fontSize="md" fontWeight="700" color="gray.800">How was your experience?</Text>
                <Text fontSize="xs" color="gray.500">Your feedback helps us serve you better</Text>
              </VStack>

              {/* Stars */}
              <Box textAlign="center">
                <HStack spacing={2} justifyContent="center" mb={1.5}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hoveredRating || rating);
                    return (
                      <Box
                        key={star}
                        as="button"
                        cursor="pointer"
                        onClick={() => { setRating(star); setHoveredRating(0); }}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        transition="transform 0.15s"
                        transform={filled ? "scale(1.15)" : "scale(1)"}
                        p={1}
                      >
                        <Icon
                          as={Star}
                          w={7} h={7}
                          color={filled ? "#F6A623" : "#E2E8F0"}
                          fill={filled ? "#F6A623" : "none"}
                          stroke={filled ? "#F6A623" : "#CBD5E0"}
                        />
                      </Box>
                    );
                  })}
                </HStack>
                {rating > 0 && (
                  <Text fontSize="xs" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.06em">
                    {RATING_LABELS[rating]}
                  </Text>
                )}
              </Box>

              {/* Category */}
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                size="sm"
                borderRadius="lg"
                borderColor="gray.200"
                bg="gray.50"
                fontSize="sm"
                _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: "none" }}
              >
                <option value="general">General experience</option>
                <option value="service">Service</option>
                <option value="delivery">Delivery</option>
                <option value="product">Products</option>
                <option value="app">App</option>
                <option value="other">Other</option>
              </Select>

              {/* Comment */}
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts or suggestions (optional)..."
                rows={3}
                resize="none"
                fontSize="sm"
                borderRadius="lg"
                borderColor="gray.200"
                bg="gray.50"
                _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: "none" }}
              />

              {/* Actions */}
              <VStack spacing={2}>
                <Button
                  w="100%" size="md"
                  bg={ThemeColors.primaryColor} color="white"
                  fontWeight="700" borderRadius="xl"
                  leftIcon={<Send size={14} />}
                  onClick={handleSubmit}
                  isDisabled={rating === 0}
                  _hover={{ bg: ThemeColors.secondaryColor }}
                  _disabled={{ bg: "gray.200", cursor: "not-allowed" }}
                >
                  Submit Feedback
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClose} color="gray.400" fontWeight="500" fontSize="xs">
                  Maybe later
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        ) : (
          <ModalBody p={6} py={10}>
            <VStack spacing={3} textAlign="center">
              <Box
                w={12} h={12} borderRadius="xl" mx="auto"
                bg={`${ThemeColors.primaryColor}12`}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Star size={22} color={ThemeColors.primaryColor} fill={ThemeColors.primaryColor} />
              </Box>
              <Text fontSize="lg" fontWeight="700" color="gray.800">Thank You</Text>
              <Text fontSize="sm" color="gray.500">We appreciate your feedback and will use it to improve.</Text>
            </VStack>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PlatformFeedbackModal;
