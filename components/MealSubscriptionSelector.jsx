"use client";

import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Stack,
  Divider,
  useToast,
  Spinner,
  SimpleGrid,
  IconButton,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useState, useEffect } from "react";
import { ShoppingCart, X, Check, Clock, Utensils, ChefHat, Info } from "lucide-react";
import { calculateMealTotal, formatPrice, getMealPricing } from "@lib/mealPricingConfig";
import { useSubscriptionPostMutation } from "@slices/usersApiSlice";
import { useNewScheduleMutation } from "@slices/productsApiSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

/**
 * Simplified Meal Subscription Selector
 * Easy-to-use interface for non-technical users
 */
const MealSubscriptionSelector = ({ planType = "premium", incomeLevel: propIncomeLevel = "middle" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [incomeLevel, setIncomeLevel] = useState(propIncomeLevel);
  const toast = useToast();
  const router = useRouter();
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const [createSubscription] = useSubscriptionPostMutation();
  const [createSchedule] = useNewScheduleMutation();

  const mealTypes = [
    { id: "breakfast", name: "Breakfast", emoji: "🍳", time: "6:00 AM - 10:00 AM", icon: "🌅" },
    { id: "lunch", name: "Lunch", emoji: "🍽️", time: "12:00 PM - 3:00 PM", icon: "☀️" },
    { id: "supper", name: "Supper", emoji: "🌙", time: "5:00 PM - 10:00 PM", icon: "🌙" },
  ];

  const prepTypes = [
    { 
      id: "ready-to-eat", 
      name: "Ready to Eat", 
      shortName: "Ready",
      color: "green", 
      description: "Fully cooked meals - just heat and eat!",
      icon: Utensils,
      simpleDesc: "Already cooked for you"
    },
    { 
      id: "ready-to-cook", 
      name: "Ready to Cook", 
      shortName: "Cook",
      color: "blue", 
      description: "Fresh ingredients - you cook at home",
      icon: ChefHat,
      simpleDesc: "Ingredients for you to cook"
    },
  ];

  const durations = [
    { id: "weekly", name: "Weekly", period: "7 days", simpleName: "Every Week" },
    { id: "monthly", name: "Monthly", period: "30 days", simpleName: "Every Month" },
  ];

  // Update income level when prop changes
  useEffect(() => {
    setIncomeLevel(propIncomeLevel);
  }, [propIncomeLevel]);

  const toggleMealSelection = (mealType, prepType, duration) => {
    const mealId = `${mealType}-${prepType}-${duration}`;
    const existingIndex = selectedMeals.findIndex((m) => m.id === mealId);

    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedMeals(selectedMeals.filter((_, index) => index !== existingIndex));
    } else {
      // Add new selection
      const pricing = getMealPricing(mealType, prepType, incomeLevel);
      const price = pricing[duration];
      const meal = mealTypes.find((m) => m.id === mealType);
      const prep = prepTypes.find((p) => p.id === prepType);
      const dur = durations.find((d) => d.id === duration);
      
      setSelectedMeals([
        ...selectedMeals,
        {
          id: mealId,
          mealType,
          prepType,
          duration,
          price,
          incomeLevel,
          name: `${meal?.name} - ${prep?.shortName} - ${dur?.simpleName}`,
          fullName: `${meal?.name} (${prep?.name}) - ${dur?.name}`,
        },
      ]);
    }
  };

  const isMealSelected = (mealType, prepType, duration) => {
    const mealId = `${mealType}-${prepType}-${duration}`;
    return selectedMeals.some((m) => m.id === mealId);
  };

  const totalPrice = calculateMealTotal(selectedMeals, incomeLevel);

  const handleCheckout = async () => {
    if (selectedMeals.length === 0) {
      toast({
        title: "No Meals Selected",
        description: "Please select at least one meal to proceed.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to continue with your purchase.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      router.push("/signin");
      return;
    }

    // Directly create subscription and redirect to payment (like test plans)
    setIsLoading(true);

    try {
      // Try using schedule endpoint which accepts custom data structures
      // Format as a schedule/order that the backend can process
      const schedulePayload = {
        user: userInfo._id,
        products: {
          mealSubscription: true,
          planType: planType,
          incomeLevel: incomeLevel,
          meals: selectedMeals.map((meal) => ({
            mealType: meal.mealType,
            prepType: meal.prepType,
            duration: meal.duration,
            price: meal.price,
          })),
        },
        scheduleDays: [], // Empty for meal subscriptions
        scheduleTime: "",
        repeatSchedule: false,
        scheduleFor: "meal_subscription",
        order: {
          payment: { paymentMethod: "", transactionId: "" },
          deliveryAddress: "NAN",
          specialRequests: "Meal Subscription",
          orderTotal: totalPrice,
        },
      };

      console.log("Creating meal subscription with payload:", JSON.stringify(schedulePayload, null, 2));

      const res = await createSchedule(schedulePayload).unwrap();
      
      console.log("Subscription response:", res);

      setIsLoading(false);
      onClose();

      if (res.status === "Success" || res.status === "success") {
        // Store meal subscription in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "mealSubscription",
            JSON.stringify({
              meals: selectedMeals,
              planType: planType,
              totalPrice: totalPrice,
            })
          );
        }

        // Redirect directly to payment page (like test plans)
        // Check multiple possible response formats
        const orderId = res.data?.Order || res.data?.order || res.Order || res.order;
        
        if (orderId) {
          router.push(`/payment/${orderId}`);
        } else {
          console.error("No Order ID in response:", res);
          toast({
            title: "Error",
            description: "Order created but payment page not found. Please contact support with order details.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        throw new Error(res.message || "Failed to create subscription");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Meal subscription error:", error);
      
      // More detailed error message
      const errorMessage = error.data?.message 
        || error.data?.error 
        || error.message 
        || "Failed to process payment. Please try again or contact support.";
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<ShoppingCart size={18} />}
        colorScheme="blue"
        size={{ base: "md", md: "lg" }}
        width={{ base: "100%", md: "auto" }}
        paddingX={{ base: "1.5rem", md: "2rem" }}
        fontWeight="semibold"
      >
        Choose My Meals
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "5xl", lg: "6xl" }}
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(2px)" />
        <ModalContent maxHeight={{ base: "100vh", md: "90vh" }} borderRadius={{ base: "none", md: "xl" }}>
          <ModalHeader
            background={`linear-gradient(135deg, ${ThemeColors.darkColor} 0%, #2d3748 100%)`}
            color="white"
            padding={{ base: "1.5rem", md: "2rem" }}
          >
            <Flex alignItems="center" gap="1rem">
              <Box
                width="50px"
                height="50px"
                borderRadius="full"
                background="rgba(255, 255, 255, 0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <ShoppingCart size={24} color="white" />
              </Box>
              <Box flex="1">
                <Heading fontSize={{ base: "xl", md: "2xl" }}>Choose Your Meals</Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.200" marginTop="0.25rem">
                  Pick what you want - it's that simple!
            </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="white" size="lg" _hover={{ background: "rgba(255, 255, 255, 0.2)" }} />

          <ModalBody padding={{ base: "1.5rem", md: "2rem" }}>
            {/* Total Price Banner - Always Visible */}
            {selectedMeals.length > 0 && (
              <Box
                padding="1.25rem"
                background="green.50"
                borderRadius="lg"
                border="2px solid"
                borderColor="green.300"
                marginBottom="2rem"
              >
                <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" marginBottom="0.25rem">
                      Total Price
                    </Text>
                    <Heading fontSize={{ base: "2xl", md: "3xl" }} color={ThemeColors.darkColor}>
                      {formatPrice(totalPrice)}
                    </Heading>
                  </Box>
                  <Badge colorScheme="green" fontSize="md" paddingX="1rem" paddingY="0.5rem" borderRadius="full">
                    {selectedMeals.length} Meal{selectedMeals.length > 1 ? "s" : ""} Selected
                  </Badge>
                </Flex>
              </Box>
            )}

            <Stack spacing={6}>
              {/* Simple Instructions */}
              <Box
                padding="1rem"
                background="blue.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
              >
                <Flex alignItems="start" gap="0.75rem">
                  <Info size={20} color={ThemeColors.darkColor} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={ThemeColors.darkColor} marginBottom="0.25rem">
                      How it works:
                    </Text>
                    <Text fontSize="xs" color="gray.700">
                      1. Choose your meal time (Breakfast, Lunch, or Supper) • 2. Pick "Ready to Eat" or "Ready to Cook" • 3. Select Weekly or Monthly • 4. Click to add to your order
                    </Text>
                  </Box>
                </Flex>
              </Box>

              {/* Meal Selection - Simplified Cards */}
              {mealTypes.map((meal) => {
                const readyToEatPricing = getMealPricing(meal.id, "ready-to-eat", incomeLevel);
                const readyToCookPricing = getMealPricing(meal.id, "ready-to-cook", incomeLevel);

                return (
                <Box
                  key={meal.id}
                    border="2px solid"
                  borderColor="gray.200"
                    borderRadius="xl"
                    padding={{ base: "1.25rem", md: "1.5rem" }}
                  background="white"
                    boxShadow="sm"
                  >
                    {/* Meal Header */}
                    <Flex alignItems="center" gap="1rem" marginBottom="1.5rem">
                      <Text fontSize={{ base: "3xl", md: "4xl" }}>{meal.emoji}</Text>
                      <Box flex="1">
                        <Heading fontSize={{ base: "lg", md: "xl" }} color={ThemeColors.darkColor}>
                          {meal.name}
                        </Heading>
                        <Flex alignItems="center" gap="0.5rem" marginTop="0.25rem">
                          <Clock size={14} color="gray" />
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                          {meal.time}
                        </Text>
                        </Flex>
                      </Box>
                    </Flex>

                    <Divider marginY="1.5rem" />

                    {/* Two Simple Options: Ready to Eat vs Ready to Cook */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      {prepTypes.map((prep) => {
                        const PrepIcon = prep.icon;
                        const weeklyPrice = prep.id === "ready-to-eat" 
                          ? readyToEatPricing.weekly 
                          : readyToCookPricing.weekly;
                        const monthlyPrice = prep.id === "ready-to-eat" 
                          ? readyToEatPricing.monthly 
                          : readyToCookPricing.monthly;

                        return (
                      <Box
                        key={prep.id}
                        border="2px solid"
                        borderColor="gray.200"
                            borderRadius="lg"
                            padding="1.25rem"
                        background="gray.50"
                        _hover={{ borderColor: ThemeColors.darkColor, background: "blue.50" }}
                        transition="all 0.2s"
                      >
                            {/* Prep Type Header */}
                            <Flex alignItems="center" gap="0.75rem" marginBottom="1rem">
                              <Box
                                padding="0.5rem"
                                borderRadius="md"
                                background={prep.color === "green" ? "green.100" : "blue.100"}
                              >
                                <PrepIcon size={20} color={prep.color === "green" ? "#16a34a" : "#2563eb"} />
                              </Box>
                              <Box flex="1">
                                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color={ThemeColors.darkColor}>
                              {prep.name}
                                </Text>
                                <Text fontSize="2xs" color="gray.600" marginTop="0.125rem">
                                  {prep.simpleDesc}
                            </Text>
                          </Box>
                        </Flex>

                            {/* Duration Options - Simple Buttons */}
                            <VStack spacing={2} align="stretch">
                          {durations.map((duration) => {
                                const price = duration.id === "weekly" ? weeklyPrice : monthlyPrice;
                            const isSelected = isMealSelected(meal.id, prep.id, duration.id);

                            return (
                                  <Button
                                key={duration.id}
                                    onClick={() => toggleMealSelection(meal.id, prep.id, duration.id)}
                                    size={{ base: "sm", md: "md" }}
                                    variant={isSelected ? "solid" : "outline"}
                                    colorScheme={isSelected ? "blue" : "gray"}
                                    width="100%"
                                    justifyContent="space-between"
                                    paddingX="1rem"
                                    paddingY="1rem"
                                    height="auto"
                                    background={isSelected ? "blue.50" : "white"}
                                borderColor={isSelected ? ThemeColors.darkColor : "gray.300"}
                                    borderWidth="2px"
                                _hover={{
                                  borderColor: ThemeColors.darkColor,
                                  background: "blue.50",
                                }}
                              >
                                    <HStack spacing={2}>
                                    {isSelected ? (
                                      <Box
                                        width="20px"
                                        height="20px"
                                        borderRadius="full"
                                        background={ThemeColors.darkColor}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                      >
                                        <Check size={12} color="white" />
                                      </Box>
                                    ) : (
                                      <Box
                                        width="20px"
                                        height="20px"
                                        borderRadius="full"
                                        border="2px solid"
                                        borderColor="gray.400"
                                      />
                                    )}
                                      <VStack align="start" spacing={0}>
                                        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                                          {duration.simpleName}
                                        </Text>
                                        <Text fontSize="2xs" color="gray.500">
                                          {duration.period}
                                    </Text>
                                      </VStack>
                                    </HStack>
                                  <Text
                                      fontSize={{ base: "md", md: "lg" }}
                                    fontWeight="bold"
                                    color={ThemeColors.darkColor}
                                  >
                                    {formatPrice(price)}
                                  </Text>
                                  </Button>
                                );
                              })}
                            </VStack>
                              </Box>
                            );
                          })}
                    </SimpleGrid>
                      </Box>
                );
              })}

              {/* Delivery Info */}
              <Box
                padding="1rem"
                background="blue.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
              >
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" textAlign="center">
                  <Text as="span" fontWeight="bold">Free Delivery:</Text> Within 3km •{" "}
                  <Text as="span" fontWeight="bold">Extra:</Text> 950 UGX per km
                </Text>
              </Box>
            </Stack>

            {/* Fixed Bottom Action Bar */}
            <Box
              position="sticky"
              bottom={0}
                        background="white"
              paddingTop="1.5rem"
              marginTop="2rem"
              borderTop="2px solid"
              borderColor="gray.200"
            >
              <Flex gap={3} justifyContent="flex-end" flexDirection={{ base: "column", md: "row" }}>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size={{ base: "md", md: "lg" }}
                  width={{ base: "100%", md: "auto" }}
                  paddingX="2rem"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout}
                  background={ThemeColors.darkColor}
                  color="white"
                  size={{ base: "md", md: "lg" }}
                  width={{ base: "100%", md: "auto" }}
                  paddingX="2rem"
                  leftIcon={isLoading ? <Spinner size="sm" /> : <ShoppingCart size={18} />}
                  disabled={selectedMeals.length === 0 || isLoading}
                  _hover={{ background: "gray.700" }}
                  fontWeight="semibold"
                >
                  {isLoading ? "Processing..." : `Proceed to Payment (${formatPrice(totalPrice)})`}
                </Button>
              </Flex>
            </Box>

            {/* Delivery Information */}
            <Box
              marginTop="1.5rem"
              padding="1rem"
              background="blue.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="blue.200"
            >
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="gray.700">
                <Text as="span" fontWeight="bold">Free Delivery:</Text> Within 3km distance.{" "}
                <Text as="span" fontWeight="bold">Extra:</Text> 950 UGX per additional kilometer.
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

    </>
  );
};

export default MealSubscriptionSelector;
