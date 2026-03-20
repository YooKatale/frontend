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
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import { useAuth } from "@slices/authSlice";
import { Star, ExternalLink } from "lucide-react";
import { useAppRatingCreateMutation } from "@slices/usersApiSlice";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const AppStoreRatingPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showStoreRedirect, setShowStoreRedirect] = useState(false);
  const [userAgent, setUserAgent] = useState("");

  const { userInfo } = useAuth();
  const _toast = useToast();
  const chakraToast = typeof _toast === "function" ? _toast : (typeof _toast?.toast === "function" ? _toast.toast : () => {});
  const [createAppRating] = useAppRatingCreateMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      setUserAgent(ua);

      const rated = localStorage.getItem("appStoreRated");
      if (rated === "true") { setHasRated(true); return; }

      const lastPrompt = localStorage.getItem("appRatingLastPrompt");
      const promptCount = parseInt(localStorage.getItem("appRatingPromptCount") || "0");

      const shouldShow = () => {
        if (promptCount >= 3) return false;
        if (!lastPrompt) return true;
        const days = (Date.now() - parseInt(lastPrompt)) / (1000 * 60 * 60 * 24);
        return days >= 7;
      };

      const pageViews = parseInt(sessionStorage.getItem("appRatingPageViews") || "0");
      sessionStorage.setItem("appRatingPageViews", (pageViews + 1).toString());

      const sessionStart = sessionStorage.getItem("appRatingSessionStart");
      if (!sessionStart) sessionStorage.setItem("appRatingSessionStart", Date.now().toString());

      const timeSpent = sessionStart ? (Date.now() - parseInt(sessionStart)) / (1000 * 60) : 0;

      if (shouldShow() && pageViews >= 5 && timeSpent >= 5) {
        const delay = 180000 + Math.random() * 120000;
        const timer = setTimeout(() => {
          const curViews = parseInt(sessionStorage.getItem("appRatingPageViews") || "0");
          const curTime = sessionStart ? (Date.now() - parseInt(sessionStart)) / (1000 * 60) : 0;
          if (curViews >= 5 && curTime >= 5) {
            setIsOpen(true);
            localStorage.setItem("appRatingLastPrompt", Date.now().toString());
            localStorage.setItem("appRatingPromptCount", (promptCount + 1).toString());
          }
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const isIOS = () => /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isAndroid = () => /android/i.test(userAgent);

  const getStoreUrl = () => {
    if (isIOS()) return process.env.NEXT_PUBLIC_APP_STORE_URL || "https://apps.apple.com/app/yookatale/id1234567890";
    if (isAndroid()) return process.env.NEXT_PUBLIC_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.yookataleapp.app";
    return null;
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setHoveredRating(0);
    if (value >= 4) setShowStoreRedirect(true);
    else handleLowRating(value);
  };

  const handleLowRating = async (val) => {
    try {
      if (userInfo?._id) {
        await createAppRating({ userId: userInfo._id, rating: val ?? rating, platform: isIOS() ? "ios" : isAndroid() ? "android" : "web", redirectedToStore: false }).unwrap();
      }
      chakraToast({ title: "Thank you for your feedback", status: "info", duration: 3000, isClosable: true });
      setIsOpen(false);
    } catch {}
  };

  const handleStoreRedirect = async () => {
    try {
      if (userInfo?._id) {
        await createAppRating({ userId: userInfo._id, rating, platform: isIOS() ? "ios" : isAndroid() ? "android" : "web", redirectedToStore: true }).unwrap();
      }
      localStorage.setItem("appStoreRated", "true");
      setHasRated(true);
      const storeUrl = getStoreUrl();
      if (storeUrl) window.open(storeUrl, "_blank");
      setIsOpen(false);
      chakraToast({ title: "Thank you for the support!", status: "success", duration: 3000, isClosable: true });
    } catch {}
  };

  const handleClose = () => { setIsOpen(false); sessionStorage.setItem("appRatingDismissed", "true"); };
  const handleMaybeLater = () => { setIsOpen(false); localStorage.setItem("appRatingPromptCount", "0"); };

  if (hasRated || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xs" closeOnOverlayClick={false}>
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(6px)" />
      <ModalContent
        borderRadius="2xl"
        mx={4}
        maxW="360px"
        boxShadow="0 20px 60px rgba(0,0,0,0.15)"
        overflow="hidden"
      >
        <ModalCloseButton
          size="sm"
          top={3}
          right={3}
          color="gray.400"
          _hover={{ color: "gray.700", bg: "gray.100" }}
          borderRadius="full"
          zIndex={10}
        />

        {!showStoreRedirect ? (
          <ModalBody p={6} pt={8}>
            <VStack spacing={5} textAlign="center">
              {/* Icon */}
              <Box
                w={12} h={12}
                borderRadius="xl"
                bg={`${ThemeColors.primaryColor}12`}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Star size={22} color={ThemeColors.primaryColor} fill={ThemeColors.primaryColor} />
              </Box>

              {/* Title */}
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="700" color="gray.800" lineHeight="1.3">
                  Enjoying YooKatale?
                </Text>
                <Text fontSize="sm" color="gray.500" lineHeight="1.5">
                  A quick rating helps us reach more people
                </Text>
              </VStack>

              {/* Stars */}
              <Box w="100%">
                <HStack spacing={2} justifyContent="center" mb={2}>
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
                  <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
                    {RATING_LABELS[rating]}
                  </Text>
                )}
              </Box>

              {/* CTAs */}
              {rating >= 4 && (
                <VStack spacing={2} w="100%">
                  <Button
                    w="100%" size="md"
                    bg={ThemeColors.primaryColor} color="white"
                    fontWeight="700" borderRadius="xl"
                    rightIcon={<ExternalLink size={15} />}
                    onClick={handleStoreRedirect}
                    _hover={{ bg: ThemeColors.secondaryColor }}
                  >
                    Rate on {isIOS() ? "App Store" : "Play Store"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleMaybeLater} color="gray.400" fontWeight="500" fontSize="xs">
                    Maybe later
                  </Button>
                </VStack>
              )}
              {rating > 0 && rating < 4 && (
                <VStack spacing={2} w="100%">
                  <Button
                    w="100%" size="md"
                    bg="gray.800" color="white"
                    fontWeight="700" borderRadius="xl"
                    onClick={() => handleLowRating(rating)}
                    _hover={{ bg: "gray.700" }}
                  >
                    Submit Feedback
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClose} color="gray.400" fontWeight="500" fontSize="xs">
                    Dismiss
                  </Button>
                </VStack>
              )}
              {rating === 0 && (
                <Button variant="ghost" size="sm" onClick={handleMaybeLater} color="gray.400" fontWeight="500" fontSize="xs">
                  Maybe later
                </Button>
              )}
            </VStack>
          </ModalBody>
        ) : (
          <ModalBody p={6} pt={8}>
            <VStack spacing={5} textAlign="center">
              <Box
                w={12} h={12}
                borderRadius="xl"
                bg={`${ThemeColors.primaryColor}12`}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Star size={22} color={ThemeColors.primaryColor} fill={ThemeColors.primaryColor} />
              </Box>
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="700" color="gray.800">Thank You</Text>
                <Text fontSize="sm" color="gray.500">Your support means a lot to us.</Text>
              </VStack>
              <VStack spacing={2} w="100%">
                <Button
                  w="100%" size="md"
                  bg={ThemeColors.primaryColor} color="white"
                  fontWeight="700" borderRadius="xl"
                  rightIcon={<ExternalLink size={15} />}
                  onClick={handleStoreRedirect}
                  _hover={{ bg: ThemeColors.secondaryColor }}
                >
                  Rate on {isIOS() ? "App Store" : "Play Store"}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClose} color="gray.400" fontWeight="500" fontSize="xs">
                  Maybe later
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AppStoreRatingPrompt;
