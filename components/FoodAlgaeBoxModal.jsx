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
  Heading,
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  HStack,
  VStack,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import {
  Package,
  Calendar,
  Leaf,
  Download,
  Share2,
  Edit,
  Trash2,
  FileText,
  FileJson,
  FileSpreadsheet,
  TrendingUp,
  Clock,
  Utensils,
  ChefHat,
  CheckCircle,
  Info,
  Copy,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@lib/mealPricingConfig";

/**
 * Professional Food Algae Space Box Component
 * Comprehensive meal preference management with advanced features
 */
const FoodAlgaeBoxModal = ({ userId, planType, triggerButton }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [savedMenu, setSavedMenu] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadSavedMenu();
    }
  }, [isOpen, userId]);

  const loadSavedMenu = () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem(`foodAlgaeBox_${userId}`);
      if (saved) {
        const menuData = JSON.parse(saved);
        setSavedMenu(menuData);
        setLastUpdated(menuData.lastUpdated);
      } else {
        setSavedMenu(null);
      }
    } catch (error) {
      console.error("Error loading saved menu:", error);
      toast({
        title: "Error",
        description: "Failed to load meal preferences",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMenu = (menuData) => {
    const dataToSave = {
      ...menuData,
      userId,
      planType,
      lastUpdated: new Date().toISOString(),
    };
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

  // Calculate statistics
  const calculateStats = () => {
    if (!savedMenu) return null;

    const mealCount = savedMenu.meals?.length || 0;
    const readyToEatCount = savedMenu.meals?.filter((m) => m.prepType === "ready-to-eat").length || 0;
    const readyToCookCount = savedMenu.meals?.filter((m) => m.prepType === "ready-to-cook").length || 0;
    const weeklyCount = savedMenu.meals?.filter((m) => m.duration === "weekly").length || 0;
    const monthlyCount = savedMenu.meals?.filter((m) => m.duration === "monthly").length || 0;
    const totalPrice = savedMenu.meals?.reduce((sum, m) => sum + (m.price || 0), 0) || 0;
    const vegetarianCount = savedMenu.meals?.filter((m) => m.isVegetarian).length || 0;

    return {
      mealCount,
      readyToEatCount,
      readyToCookCount,
      weeklyCount,
      monthlyCount,
      totalPrice,
      vegetarianCount,
    };
  };

  const stats = calculateStats();

  // Export functions
  const exportToJSON = () => {
    if (!savedMenu) return;
    const dataStr = JSON.stringify(savedMenu, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `food-algae-box-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast({
      title: "Exported",
      description: "Menu data exported as JSON",
      status: "success",
      duration: 2000,
    });
  };

  const exportToCSV = () => {
    if (!savedMenu?.meals) return;
    const headers = ["Meal Type", "Prep Type", "Duration", "Price", "Vegetarian", "Sauce"];
    const rows = savedMenu.meals.map((m) => [
      m.mealType || "",
      m.prepType || "",
      m.duration || "",
      m.price || 0,
      m.isVegetarian ? "Yes" : "No",
      m.preferredSauce || "None",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const dataBlob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `food-algae-box-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast({
      title: "Exported",
      description: "Menu data exported as CSV",
      status: "success",
      duration: 2000,
    });
  };

  const handleShare = async () => {
    if (!savedMenu) return;
    try {
      const shareData = {
        title: "My Food Algae Box",
        text: `Check out my meal preferences! ${stats?.mealCount || 0} meals selected.`,
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(JSON.stringify(savedMenu, null, 2));
        toast({
          title: "Copied",
          description: "Menu data copied to clipboard",
          status: "success",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to clear your Food Algae Box? This action cannot be undone.")) {
      localStorage.removeItem(`foodAlgaeBox_${userId}`);
      setSavedMenu(null);
      setLastUpdated(null);
      toast({
        title: "Cleared",
        description: "Food Algae Box has been cleared",
        status: "success",
        duration: 2000,
      });
    }
  };

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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "4xl", lg: "6xl" }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent borderRadius={{ base: "none", md: "xl" }} maxHeight="90vh">
          <ModalHeader
            bg={`linear-gradient(135deg, ${ThemeColors.darkColor} 0%, #2d3748 100%)`}
            color="white"
            py={4}
            display="flex"
            alignItems="center"
            gap={3}
            position="relative"
          >
            <Box
              width="50px"
              height="50px"
              borderRadius="full"
              background="rgba(255, 255, 255, 0.2)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Package size={24} color="white" />
            </Box>
            <Box flex="1">
              <Heading fontSize={{ base: "lg", md: "xl" }}>Food Algae Space Box</Heading>
              <Text fontSize="xs" color="gray.200" marginTop="0.25rem">
                Your personalized meal preferences hub
              </Text>
            </Box>
            {lastUpdated && (
              <Badge colorScheme="green" fontSize="xs" paddingX="0.75rem" paddingY="0.25rem">
                Updated {new Date(lastUpdated).toLocaleDateString()}
              </Badge>
            )}
          </ModalHeader>
          <ModalCloseButton color="white" size="lg" />

          <ModalBody py={6} px={{ base: 4, md: 6 }}>
            {isLoading ? (
              <Flex justifyContent="center" alignItems="center" minHeight="200px">
                <Spinner size="xl" color={ThemeColors.darkColor} />
              </Flex>
            ) : !savedMenu ? (
              <Box textAlign="center" py={12}>
                <Box
                  display="inline-block"
                  mb={6}
                  padding="2rem"
                  borderRadius="full"
                  background="gray.100"
                >
                  <Package size={64} color="#CBD5E0" />
                </Box>
                <Heading fontSize="xl" color="gray.700" mb={3}>
                  Your Food Algae Box is Empty
                </Heading>
                <Text fontSize="md" color="gray.500" mb={6} maxWidth="500px" margin="0 auto">
                  Start customizing your meal calendar to save your preferences here. Your selected meals,
                  vegetarian options, and sauce preferences will be automatically saved.
                </Text>
                <Button
                  colorScheme="blue"
                  leftIcon={<Calendar size={18} />}
                  onClick={onClose}
                >
                  Go to Meal Calendar
                </Button>
              </Box>
            ) : (
              <Tabs index={activeTab} onChange={setActiveTab} colorScheme="blue">
                <TabList
                  overflowX="auto"
                  borderBottom="2px solid"
                  borderColor="gray.200"
                  mb={4}
                >
                  <Tab fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                    Overview
                  </Tab>
                  <Tab fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                    Meals ({stats?.mealCount || 0})
                  </Tab>
                  <Tab fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                    Statistics
                  </Tab>
                  <Tab fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                    Preferences
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel px={0}>
                    <Stack spacing={6}>
                      {/* Quick Stats */}
                      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                        <Box
                          p={4}
                          bg="blue.50"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="blue.200"
                        >
                          <Stat>
                            <StatLabel fontSize="xs" color="gray.600">
                              Total Meals
                            </StatLabel>
                            <StatNumber fontSize="2xl" color={ThemeColors.darkColor}>
                              {stats?.mealCount || 0}
                            </StatNumber>
                          </Stat>
                        </Box>
                        <Box
                          p={4}
                          bg="green.50"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="green.200"
                        >
                          <Stat>
                            <StatLabel fontSize="xs" color="gray.600">
                              Ready to Eat
                            </StatLabel>
                            <StatNumber fontSize="2xl" color="green.700">
                              {stats?.readyToEatCount || 0}
                            </StatNumber>
                          </Stat>
                        </Box>
                        <Box
                          p={4}
                          bg="purple.50"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="purple.200"
                        >
                          <Stat>
                            <StatLabel fontSize="xs" color="gray.600">
                              Ready to Cook
                            </StatLabel>
                            <StatNumber fontSize="2xl" color="purple.700">
                              {stats?.readyToCookCount || 0}
                            </StatNumber>
                          </Stat>
                        </Box>
                        <Box
                          p={4}
                          bg="orange.50"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="orange.200"
                        >
                          <Stat>
                            <StatLabel fontSize="xs" color="gray.600">
                              Total Price
                            </StatLabel>
                            <StatNumber fontSize="xl" color="orange.700">
                              {formatPrice(stats?.totalPrice || 0)}
                            </StatNumber>
                          </Stat>
                        </Box>
                      </SimpleGrid>

                      {/* Plan Info */}
                      <Box
                        p={5}
                        bg="gray.50"
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderColor={ThemeColors.darkColor}
                      >
                        <Flex alignItems="center" gap={3} mb={3}>
                          <Calendar size={24} color={ThemeColors.darkColor} />
                          <Heading fontSize="md" color={ThemeColors.darkColor}>
                            Subscription Plan
                          </Heading>
                        </Flex>
                        <Text textTransform="capitalize" fontSize="lg" fontWeight="semibold" color="gray.700">
                          {savedMenu.planType || planType || "Not specified"}
                        </Text>
                        {lastUpdated && (
                          <Text fontSize="xs" color="gray.500" mt={2}>
                            Last updated: {new Date(lastUpdated).toLocaleString()}
                          </Text>
                        )}
                      </Box>

                      {/* Quick Actions */}
                      <Box
                        p={4}
                        bg="blue.50"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="blue.200"
                      >
                        <Text fontWeight="semibold" mb={3} color="gray.700">
                          Quick Actions
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          <Button size="sm" leftIcon={<Edit size={14} />} colorScheme="blue" variant="outline">
                            Edit Preferences
                          </Button>
                          <Button size="sm" leftIcon={<Download size={14} />} colorScheme="green" variant="outline" onClick={exportToJSON}>
                            Export JSON
                          </Button>
                        </HStack>
                      </Box>
                    </Stack>
                  </TabPanel>

                  {/* Meals Tab */}
                  <TabPanel px={0}>
                    {savedMenu.meals && savedMenu.meals.length > 0 ? (
                      <Stack spacing={4}>
                        {savedMenu.meals.map((meal, index) => (
                          <Box
                            key={index}
                            p={4}
                            bg="white"
                            borderRadius="lg"
                            border="2px solid"
                            borderColor="gray.200"
                            _hover={{ borderColor: ThemeColors.darkColor, boxShadow: "md" }}
                            transition="all 0.3s"
                          >
                            <Flex gap={4} alignItems="flex-start">
                              <Box
                                width="80px"
                                height="80px"
                                borderRadius="lg"
                                overflow="hidden"
                                bg="gray.100"
                                flexShrink={0}
                                position="relative"
                              >
                                <Image
                                  src={meal.image || "/assets/images/img5.png"}
                                  alt={meal.mealName || meal.mealType}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              </Box>
                              <Box flex="1">
                                <Flex justifyContent="space-between" alignItems="flex-start" mb={2}>
                                  <VStack align="flex-start" spacing={1}>
                                    <Text fontWeight="bold" fontSize="md" color={ThemeColors.darkColor}>
                                      {meal.mealName || `${meal.mealType} - ${meal.prepType}`}
                                    </Text>
                                    <HStack spacing={2} flexWrap="wrap">
                                      <Badge colorScheme={meal.prepType === "ready-to-eat" ? "green" : "blue"} fontSize="xs">
                                        {meal.prepType === "ready-to-eat" ? (
                                          <><Utensils size={10} style={{ display: "inline", marginRight: "4px" }} /> Ready to Eat</>
                                        ) : (
                                          <><ChefHat size={10} style={{ display: "inline", marginRight: "4px" }} /> Ready to Cook</>
                                        )}
                                      </Badge>
                                      <Badge colorScheme="purple" fontSize="xs">
                                        {meal.duration === "weekly" ? "Weekly" : "Monthly"}
                                      </Badge>
                                      {meal.isVegetarian && (
                                        <Badge colorScheme="green" fontSize="xs">
                                          <Leaf size={10} style={{ display: "inline", marginRight: "4px" }} /> Vegetarian
                                        </Badge>
                                      )}
                                    </HStack>
                                  </VStack>
                                  <Text fontWeight="bold" fontSize="lg" color={ThemeColors.darkColor}>
                                    {formatPrice(meal.price || 0)}
                                  </Text>
                                </Flex>
                                {meal.preferredSauce && (
                                  <Text fontSize="sm" color="gray.600" mt={2}>
                                    <Text as="span" fontWeight="semibold">Preferred Sauce:</Text> {meal.preferredSauce}
                                  </Text>
                                )}
                              </Box>
                            </Flex>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Box textAlign="center" py={8}>
                        <Text color="gray.500">No meals saved yet</Text>
                      </Box>
                    )}
                  </TabPanel>

                  {/* Statistics Tab */}
                  <TabPanel px={0}>
                    <Stack spacing={6}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box p={5} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                          <Heading fontSize="md" mb={4} color={ThemeColors.darkColor}>
                            Meal Distribution
                          </Heading>
                          <VStack spacing={3} align="stretch">
                            <Box>
                              <Flex justifyContent="space-between" mb={1}>
                                <Text fontSize="sm">Ready to Eat</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {stats?.readyToEatCount || 0}
                                </Text>
                              </Flex>
                              <Progress
                                value={stats?.mealCount ? (stats.readyToEatCount / stats.mealCount) * 100 : 0}
                                colorScheme="green"
                                size="sm"
                                borderRadius="full"
                              />
                            </Box>
                            <Box>
                              <Flex justifyContent="space-between" mb={1}>
                                <Text fontSize="sm">Ready to Cook</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {stats?.readyToCookCount || 0}
                                </Text>
                              </Flex>
                              <Progress
                                value={stats?.mealCount ? (stats.readyToCookCount / stats.mealCount) * 100 : 0}
                                colorScheme="blue"
                                size="sm"
                                borderRadius="full"
                              />
                            </Box>
                          </VStack>
                        </Box>

                        <Box p={5} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                          <Heading fontSize="md" mb={4} color={ThemeColors.darkColor}>
                            Duration Distribution
                          </Heading>
                          <VStack spacing={3} align="stretch">
                            <Box>
                              <Flex justifyContent="space-between" mb={1}>
                                <Text fontSize="sm">Weekly</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {stats?.weeklyCount || 0}
                                </Text>
                              </Flex>
                              <Progress
                                value={stats?.mealCount ? (stats.weeklyCount / stats.mealCount) * 100 : 0}
                                colorScheme="purple"
                                size="sm"
                                borderRadius="full"
                              />
                            </Box>
                            <Box>
                              <Flex justifyContent="space-between" mb={1}>
                                <Text fontSize="sm">Monthly</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {stats?.monthlyCount || 0}
                                </Text>
                              </Flex>
                              <Progress
                                value={stats?.mealCount ? (stats.monthlyCount / stats.mealCount) * 100 : 0}
                                colorScheme="orange"
                                size="sm"
                                borderRadius="full"
                              />
                            </Box>
                          </VStack>
                        </Box>
                      </SimpleGrid>

                      <Box p={5} bg="gradient-to-r from-blue-50 to-green-50" borderRadius="lg" border="1px solid" borderColor="gray.200">
                        <Flex alignItems="center" gap={3} mb={4}>
                          <TrendingUp size={24} color={ThemeColors.darkColor} />
                          <Heading fontSize="md" color={ThemeColors.darkColor}>
                            Summary
                          </Heading>
                        </Flex>
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                          <Stat>
                            <StatLabel fontSize="xs">Total Meals</StatLabel>
                            <StatNumber fontSize="xl">{stats?.mealCount || 0}</StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="xs">Vegetarian</StatLabel>
                            <StatNumber fontSize="xl" color="green.600">
                              {stats?.vegetarianCount || 0}
                            </StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="xs">Total Price</StatLabel>
                            <StatNumber fontSize="xl" color={ThemeColors.darkColor}>
                              {formatPrice(stats?.totalPrice || 0)}
                            </StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="xs">Avg per Meal</StatLabel>
                            <StatNumber fontSize="xl" color="blue.600">
                              {stats?.mealCount
                                ? formatPrice((stats.totalPrice || 0) / stats.mealCount)
                                : formatPrice(0)}
                            </StatNumber>
                          </Stat>
                        </SimpleGrid>
                      </Box>
                    </Stack>
                  </TabPanel>

                  {/* Preferences Tab */}
                  <TabPanel px={0}>
                    <Stack spacing={4}>
                      {savedMenu.isVegetarian !== undefined && (
                        <Box p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                          <Flex alignItems="center" gap={2} mb={2}>
                            <Leaf size={20} color="#16A34A" />
                            <Text fontWeight="bold" color="green.800">
                              Vegetarian Preference
                            </Text>
                          </Flex>
                          <Text color="gray.700">
                            {savedMenu.isVegetarian ? (
                              <Badge colorScheme="green">
                                <CheckCircle size={12} style={{ display: "inline", marginRight: "4px" }} /> Enabled
                              </Badge>
                            ) : (
                              <Badge colorScheme="gray">Disabled</Badge>
                            )}
                          </Text>
                        </Box>
                      )}

                      {savedMenu.selectedSauce && (
                        <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                          <Flex alignItems="center" gap={2} mb={2}>
                            <Utensils size={20} color="#2563EB" />
                            <Text fontWeight="bold" color="blue.800">
                              Preferred Sauce
                            </Text>
                          </Flex>
                          <Text color="gray.700" textTransform="capitalize">
                            {savedMenu.selectedSauce}
                          </Text>
                        </Box>
                      )}

                      {savedMenu.veganSauceOptions && Object.keys(savedMenu.veganSauceOptions).length > 0 && (
                        <Box p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
                          <Flex alignItems="center" gap={2} mb={3}>
                            <Leaf size={20} color="#9333EA" />
                            <Text fontWeight="bold" color="purple.800">
                              Vegan Sauce Preferences by Day
                            </Text>
                          </Flex>
                          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                            {Object.entries(savedMenu.veganSauceOptions).map(([day, enabled]) => (
                              <Flex
                                key={day}
                                alignItems="center"
                                gap={2}
                                p={2}
                                bg="white"
                                borderRadius="md"
                              >
                                <Badge colorScheme={enabled ? "green" : "gray"} fontSize="xs">
                                  {enabled ? "✓" : "✗"}
                                </Badge>
                                <Text fontSize="sm" color="gray.700" textTransform="capitalize">
                                  {day}
                                </Text>
                              </Flex>
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </ModalBody>

          <ModalFooter
            bg="gray.50"
            py={4}
            borderTop="1px solid"
            borderColor="gray.200"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <HStack spacing={2}>
              <Menu>
                <MenuButton as={Button} leftIcon={<Download size={16} />} size="sm" colorScheme="blue" variant="outline">
                  Export
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FileJson size={16} />} onClick={exportToJSON}>
                    Export as JSON
                  </MenuItem>
                  <MenuItem icon={<FileSpreadsheet size={16} />} onClick={exportToCSV}>
                    Export as CSV
                  </MenuItem>
                </MenuList>
              </Menu>
              <Tooltip label="Share menu">
                <IconButton
                  icon={<Share2 size={16} />}
                  aria-label="Share"
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  onClick={handleShare}
                />
              </Tooltip>
              {savedMenu && (
                <Tooltip label="Clear all data">
                  <IconButton
                    icon={<Trash2 size={16} />}
                    aria-label="Delete"
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={handleDelete}
                  />
                </Tooltip>
              )}
            </HStack>
            <Button colorScheme="gray" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FoodAlgaeBoxModal;
