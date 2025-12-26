"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Stack,
  Flex,
  Badge,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { Package, Calendar, Leaf } from "lucide-react";
import React, { useState, useEffect } from "react";

/**
 * Food Algae Space Box Component with Professional Modal
 * Saves and updates user's food menu preferences
 */
const FoodAlgaeBoxModal = ({ userId, planType, triggerButton }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [savedMenu, setSavedMenu] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    // Load saved menu from localStorage or API
    const saved = localStorage.getItem(`foodAlgaeBox_${userId}`);
    if (saved) {
      try {
        const menuData = JSON.parse(saved);
        setSavedMenu(menuData);
        setLastUpdated(menuData.lastUpdated);
      } catch (error) {
        console.error("Error parsing saved menu:", error);
      }
    }
  }, [userId]);

  const handleSaveMenu = (menuData) => {
    const dataToSave = {
      ...menuData,
      userId,
      planType,
      lastUpdated: new Date().toISOString(),
    };

    // Save to localStorage (in production, save to backend)
    localStorage.setItem(`foodAlgaeBox_${userId}`, JSON.stringify(dataToSave));
    setSavedMenu(dataToSave);
    setLastUpdated(dataToSave.lastUpdated);
  };

  // Listen for menu updates
  useEffect(() => {
    const handleMenuUpdate = (event) => {
      if (event.detail && event.detail.menuData) {
        handleSaveMenu(event.detail.menuData);
      }
    };

    window.addEventListener("menuUpdated", handleMenuUpdate);
    return () => window.removeEventListener("menuUpdated", handleMenuUpdate);
  }, [userId, planType]);

  return (
    <>
      {triggerButton ? (
        <Box onClick={onOpen} cursor="pointer">
          {triggerButton}
        </Box>
      ) : (
        <Button
          onClick={onOpen}
          colorScheme="green"
          leftIcon={<Package size={18} />}
          size="md"
          variant="outline"
        >
          View Food Algae Box
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" overflow="hidden">
          <ModalHeader
            bg={ThemeColors.darkColor}
            color="white"
            py={4}
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Package size={24} />
            <Text>Food Algae Space Box</Text>
            {lastUpdated && (
              <Badge colorScheme="green" ml="auto">
                Updated {new Date(lastUpdated).toLocaleDateString()}
              </Badge>
            )}
          </ModalHeader>
          <ModalCloseButton color="white" />

          <ModalBody py={6}>
            {!savedMenu ? (
              <Box textAlign="center" py={8}>
                <Box display="inline-block" mb={4}>
                  <Package size={64} color="#CBD5E0" />
                </Box>
                <Text fontSize="lg" color="gray.600" fontWeight="medium" mb={2}>
                  Your Food Algae Box is Empty
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Your meal preferences will be saved here automatically when you customize your meal calendar.
                </Text>
              </Box>
            ) : (
              <Stack spacing={4}>
                {/* Plan Type */}
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor={ThemeColors.primaryColor}
                >
                  <Flex alignItems="center" gap={2} mb={2}>
                    <Calendar size={20} color={ThemeColors.primaryColor} />
                    <Text fontWeight="bold" fontSize="md">
                      Subscription Plan
                    </Text>
                  </Flex>
                  <Text textTransform="capitalize" fontSize="lg" color="gray.700">
                    {savedMenu.planType || planType || "Not specified"}
                  </Text>
                </Box>

                <Divider />

                {/* Vegan Sauce Preferences */}
                {savedMenu.veganSauceOptions && (
                  <Box
                    p={4}
                    bg="green.50"
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="green.500"
                  >
                    <Flex alignItems="center" gap={2} mb={3}>
                      <Leaf size={20} color="#16A34A" />
                      <Text fontWeight="bold" fontSize="md" color="green.800">
                        Vegan Sauce Preferences
                      </Text>
                    </Flex>
                    <Stack spacing={2}>
                      {Object.entries(savedMenu.veganSauceOptions).map(([day, enabled]) =>
                        enabled ? (
                          <Flex
                            key={day}
                            alignItems="center"
                            gap={2}
                            p={2}
                            bg="white"
                            borderRadius="sm"
                          >
                            <Badge colorScheme="green" fontSize="xs">
                              ✓
                            </Badge>
                            <Text fontSize="sm" color="gray.700">
                              {day.charAt(0).toUpperCase() + day.slice(1)}: Vegan sauces enabled
                            </Text>
                          </Flex>
                        ) : null
                      )}
                      {!Object.values(savedMenu.veganSauceOptions).some((v) => v) && (
                        <Text fontSize="sm" color="gray.500" fontStyle="italic">
                          No vegan sauce preferences set
                        </Text>
                      )}
                    </Stack>
                  </Box>
                )}

                <Divider />

                {/* Saved Menu Items */}
                {savedMenu.menu && (
                  <Box
                    p={4}
                    bg="blue.50"
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="blue.500"
                  >
                    <Flex alignItems="center" gap={2} mb={2}>
                      <Package size={20} color="#2563EB" />
                      <Text fontWeight="bold" fontSize="md" color="blue.800">
                        Saved Menu Items
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.600">
                      {Object.keys(savedMenu.menu).length} meal type(s) configured
                    </Text>
                    {Object.keys(savedMenu.menu).length > 0 && (
                      <Stack spacing={1} mt={2}>
                        {Object.keys(savedMenu.menu).map((mealType) => (
                          <Badge key={mealType} colorScheme="blue" fontSize="xs" mr={1}>
                            {mealType}
                          </Badge>
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}

                {/* Last Updated Info */}
                {lastUpdated && (
                  <Box p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="xs" color="gray.500" fontStyle="italic">
                      Last updated: {new Date(lastUpdated).toLocaleString()}
                    </Text>
                  </Box>
                )}
              </Stack>
            )}
          </ModalBody>

          <ModalFooter bg="gray.50" py={4}>
            <Button colorScheme="gray" variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            {savedMenu && (
              <Button
                colorScheme={ThemeColors.primaryColor}
                onClick={() => {
                  // Option to export or share menu
                  const menuJson = JSON.stringify(savedMenu, null, 2);
                  navigator.clipboard.writeText(menuJson);
                  onClose();
                }}
              >
                Copy Menu Data
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FoodAlgaeBoxModal;

