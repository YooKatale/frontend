"use client";

import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Stack,
  Divider,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Check, Calendar, Clock, X, Share2, Star } from "lucide-react";
import { getMealForDay } from "@lib/mealMenuConfig";
import { getMealPricing, formatPrice } from "@lib/mealPricingConfig";
import { getMealImageUrl } from "@lib/mealImageMap";
import { useNewScheduleMutation } from "@slices/productsApiSlice";
import { usePlanRatingCreateMutation, useGetPlanRatingsQuery, useMealCalendarOverridesGetMutation } from "@slices/usersApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const themeBg = `${ThemeColors.primaryColor}12`;
const themeBorder = `${ThemeColors.primaryColor}30`;

/**
 * Unified Meal Subscription Card
 * Simplified, clean layout for meal planning — theme colors
 */
const MotionBox = motion(Box);

const UnifiedMealSubscriptionCard = ({ planType = "premium" }) => {
  const incomeLevel = "middle";
  const [selectedDay, setSelectedDay] = useState("monday");
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [planRating, setPlanRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingEffect, setRatingEffect] = useState(false);
  const [failedImages, setFailedImages] = useState(() => new Set());
  const [mealOverrides, setMealOverrides] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const [createSchedule] = useNewScheduleMutation();
  const [createPlanRating] = usePlanRatingCreateMutation();
  const [fetchOverrides] = useMealCalendarOverridesGetMutation();

  useEffect(() => {
    fetchOverrides()
      .unwrap()
      .then((res) => {
        if (res?.status === "Success" && Array.isArray(res?.data)) setMealOverrides(res.data);
      })
      .catch(() => {});
  }, [fetchOverrides]);
  const { data: ratingsData, refetch: refetchRatings } = useGetPlanRatingsQuery(
    { planType, context: "meal_plan" },
    { skip: !planType }
  );
  const avgRating = ratingsData?.data?.average ?? 0;
  const totalRatings = ratingsData?.data?.total ?? 0;

  const planName = planType.charAt(0).toUpperCase() + planType.slice(1);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = [
    { id: "breakfast", name: "Breakfast", time: "6:00 - 10:00 AM" },
    { id: "lunch", name: "Lunch", time: "12:00 - 3:00 PM" },
    { id: "supper", name: "Supper", time: "5:00 - 10:00 PM" },
  ];

  const mealPrepTypes = [
    { id: "ready-to-eat", name: "Ready to Eat", color: "green" },
    { id: "ready-to-cook", name: "Ready to Cook", color: "blue" },
  ];

  const getMeal = (day, mealType, prepType) => {
    const meal = getMealForDay(day, mealType, incomeLevel, prepType);
    if (meal) {
      const pricing = getMealPricing(mealType, prepType, incomeLevel);
      return {
        ...meal,
        type: prepType,
        pricing,
      };
    }
    return null;
  };

  const getMealImage = (meal, day, mealTypeId, prepTypeId) => {
    const override = mealOverrides.find(
      (o) =>
        o.incomeLevel === incomeLevel &&
        o.prepType === prepTypeId &&
        o.day === day &&
        o.mealType === mealTypeId
    );
    if (override?.imageUrl) return override.imageUrl;
    return getMealImageUrl(meal);
  };

  const handleMealSelect = (meal) => {
    setSelectedMeals((prev) => {
      const exists = prev.find(
        (m) =>
          m.day === meal.day &&
          m.mealType === meal.mealType &&
          m.prepType === meal.prepType
      );
      if (exists) {
        return prev.filter(
          (m) =>
            !(m.day === meal.day &&
              m.mealType === meal.mealType &&
              m.prepType === meal.prepType)
        );
      }
      return [...prev, meal];
    });
  };

  const isMealSelected = (meal) => {
    return selectedMeals.some(
      (m) =>
        m.day === meal.day &&
        m.mealType === meal.mealType &&
        m.prepType === meal.prepType
    );
  };

  const calculateTotal = () => {
    return selectedMeals.reduce(
      (sum, meal) => sum + (meal.pricing?.monthly || 0),
      0
    );
  };

  const handleSharePlan = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${planName} Meal Plan – Yookatale`;
    const text = `Check out the ${planName} meal plan on Yookatale.`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url, text });
        toast({ title: "Shared!", status: "success", duration: 2000, isClosable: true });
      } else {
        await navigator.clipboard?.writeText(url);
        toast({ title: "Link copied!", status: "success", duration: 2000, isClosable: true });
      }
    } catch (e) {
      if (e?.name !== "AbortError") {
        try {
          await navigator.clipboard?.writeText(url);
          toast({ title: "Link copied!", status: "success", duration: 2000, isClosable: true });
        } catch {
          toast({ title: "Could not share", description: e?.message, status: "error", duration: 3000, isClosable: true });
        }
      }
    }
  };

  const handleSubmitRating = async () => {
    if (planRating < 1) return;
    if (!userInfo?._id) {
      toast({ title: "Login required to rate", status: "warning", duration: 3000, isClosable: true });
      router.push("/signin");
      return;
    }
    try {
      await createPlanRating({
        userId: userInfo._id,
        planType,
        context: "meal_plan",
        rating: planRating,
        userEmail: userInfo?.email || null,
        userName: userInfo?.name || null,
      }).unwrap();
      setRatingSubmitted(true);
      setRatingEffect(true);
      refetchRatings();
      setTimeout(() => setRatingEffect(false), 600);
      toast({ title: "Thanks for your rating!", status: "success", duration: 2000, isClosable: true });
    } catch (e) {
      toast({
        title: "Could not submit rating",
        description: e?.data?.message || e?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubscribe = async () => {
    if (!userInfo?._id) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe",
        status: "warning",
        duration: 3000,
      });
      router.push("/signin");
      return;
    }

    if (selectedMeals.length === 0) {
      toast({
        title: "No Meals Selected",
        description: "Please select at least one meal",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const schedulePayload = {
        user: userInfo._id,
        products: {
          mealSubscription: true,
          planType,
          incomeLevel,
          meals: selectedMeals.map((meal) => ({
            mealType: meal.mealType,
            prepType: meal.prepType,
            duration: "monthly",
            price: meal.pricing?.monthly || 0,
            mealName: meal.meal,
          })),
        },
        scheduleDays: [],
        scheduleTime: "",
        repeatSchedule: false,
        scheduleFor: "meal_subscription",
        order: {
          payment: { paymentMethod: "", transactionId: "" },
          deliveryAddress: "NAN",
          specialRequests: isVegetarian ? "Vegetarian option requested." : "",
          orderTotal: calculateTotal(),
        },
      };

      const res = await createSchedule(schedulePayload).unwrap();

      if (res.status === "Success" || res.status === "success") {
        const orderId = res.data?.Order || res.data?.order;
        toast({
          title: "Success!",
          description: "Subscription created. Redirecting to payment...",
          status: "success",
          duration: 2000,
        });
        onClose();
        router.push(`/payment/${orderId}`);
      } else {
        throw new Error(res.message || "Subscription failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.data?.message || error?.message || "Failed to create subscription",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <Box
        bg="white"
        borderRadius="xl"
        shadow="lg"
        p={6}
        border="1px solid"
        borderColor="gray.200"
      >
        {/* Header */}
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="lg" color={ThemeColors.darkColor}>
              Weekly Meal Plan
            </Heading>
            <Text color="gray.600" mt={1}>
              {planName} Plan • Free delivery within 3km
            </Text>
          </Box>
          <Button
            bg={ThemeColors.primaryColor}
            color="white"
            _hover={{ bg: ThemeColors.secondaryColor }}
            leftIcon={<ShoppingCart size={18} />}
            onClick={onOpen}
            size="lg"
          >
            View Cart ({selectedMeals.length})
          </Button>
        </Flex>

        {/* Share & Rate */}
        <Flex wrap="wrap" align="center" gap={4} mb={6} py={3} px={4} bg={themeBg} borderRadius="lg" borderWidth="1px" borderColor={themeBorder}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Share2 size={16} />}
            onClick={handleSharePlan}
            borderColor="gray.300"
            _hover={{ borderColor: ThemeColors.primaryColor, color: ThemeColors.primaryColor }}
          >
            Share to social & email
          </Button>
          <MotionBox animate={ratingEffect ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 0.5 }}>
            <HStack spacing={1} align="center" as="span" display="inline-flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <IconButton
                  key={s}
                  aria-label={`Rate ${s} stars`}
                  icon={<Star size={18} />}
                  variant="ghost"
                  size="sm"
                  color={s <= (ratingHover || planRating) ? "yellow.400" : "gray.300"}
                  fill={s <= (ratingHover || planRating) ? "currentColor" : "none"}
                  onClick={() => setPlanRating(s)}
                  onMouseEnter={() => setRatingHover(s)}
                  onMouseLeave={() => setRatingHover(0)}
                  isDisabled={ratingSubmitted}
                />
              ))}
            </HStack>
          </MotionBox>
          <Button
              size="sm"
              bg={ThemeColors.primaryColor}
              color="white"
              _hover={{ bg: ThemeColors.secondaryColor }}
              isDisabled={planRating < 1 || ratingSubmitted}
              onClick={handleSubmitRating}
            >
              {ratingSubmitted ? "Rated" : "Rate"}
            </Button>
          {totalRatings > 0 && (
            <Text fontSize="sm" color="gray.600">
              {avgRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
            </Text>
          )}
        </Flex>

        <Divider mb={6} borderColor="gray.200" />

        {/* Day Selector */}
        <Box mb={8}>
          <Text fontWeight="semibold" mb={3} color="gray.700">
            Select Day:
          </Text>
          <Flex gap={2} overflowX="auto" pb={2}>
            {daysOfWeek.map((day) => {
              const dayKey = day.toLowerCase();
              const isSelected = selectedDay === dayKey;
              return (
                <Button
                  key={day}
                  variant={isSelected ? "solid" : "outline"}
                  bg={isSelected ? ThemeColors.primaryColor : undefined}
                  color={isSelected ? "white" : undefined}
                  borderColor={isSelected ? ThemeColors.primaryColor : "gray.300"}
                  _hover={{
                    bg: isSelected ? ThemeColors.secondaryColor : themeBg,
                    borderColor: ThemeColors.primaryColor,
                  }}
                  onClick={() => setSelectedDay(dayKey)}
                  minW="100px"
                >
                  {day.slice(0, 3)}
                </Button>
              );
            })}
          </Flex>
        </Box>

        {/* Meal Types Tabs — Ready to Eat / Ready to Cook */}
        <Tabs variant="enclosed" mb={8}>
          <TabList
            borderColor="gray.200"
            sx={{
              "button[aria-selected=true]": {
                color: ThemeColors.primaryColor,
                borderColor: `${ThemeColors.primaryColor}`,
                borderBottomColor: "white",
                bg: "white",
              },
            }}
          >
            {mealPrepTypes.map((prepType) => (
              <Tab
                key={prepType.id}
                _selected={{
                  color: ThemeColors.primaryColor,
                  borderColor: ThemeColors.primaryColor,
                }}
                _hover={{ color: ThemeColors.primaryColor }}
              >
                {prepType.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {mealPrepTypes.map((prepType) => (
              <TabPanel key={prepType.id} px={0}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  {mealTypes.map((mealType) => {
                    const meal = getMeal(
                      selectedDay,
                      mealType.id,
                      prepType.id
                    );
                    if (!meal) return null;

                    const mealKey = {
                      day: selectedDay,
                      mealType: mealType.id,
                      prepType: prepType.id,
                      ...meal,
                    };
                    const isSelected = isMealSelected(mealKey);

                    return (
                      <Box
                        key={`${mealType.id}-${prepType.id}`}
                        border="2px solid"
                        borderColor={
                          isSelected ? ThemeColors.primaryColor : "gray.200"
                        }
                        borderRadius="lg"
                        p={4}
                        bg={isSelected ? themeBg : "white"}
                        cursor="pointer"
                        onClick={() => handleMealSelect(mealKey)}
                        transition="all 0.2s"
                        _hover={{
                          borderColor: ThemeColors.primaryColor,
                          transform: "translateY(-2px)",
                        }}
                      >
                        <Flex justify="space-between" align="start" mb={3}>
                          <Box>
                            <Text
                              fontWeight="bold"
                              color={ThemeColors.darkColor}
                            >
                              {mealType.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              <Clock
                                size={12}
                                style={{
                                  display: "inline",
                                  marginRight: "4px",
                                  verticalAlign: "middle",
                                }}
                              />
                              {mealType.time}
                            </Text>
                          </Box>
                          <Badge
                            colorScheme={prepType.color}
                            fontSize="xs"
                            bg={
                              prepType.color === "green"
                                ? "green.100"
                                : "blue.100"
                            }
                            color={
                              prepType.color === "green"
                                ? "green.700"
                                : "blue.700"
                            }
                          >
                            {prepType.name}
                          </Badge>
                        </Flex>

                        <Box
                          h="120px"
                          w="100%"
                          borderRadius="md"
                          overflow="hidden"
                          mb={3}
                          position="relative"
                          bg="gray.100"
                        >
                          <Box
                            as="img"
                            src={
                              failedImages.has(
                                `${meal.meal}-${mealType.id}-${prepType.id}`
                              )
                                ? "/assets/images/img5.png"
                                : getMealImage(meal, selectedDay, mealType.id, prepType.id)
                            }
                            alt={meal.meal || "Meal"}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            onError={() =>
                              setFailedImages((s) =>
                                new Set(s).add(
                                  `${meal.meal}-${mealType.id}-${prepType.id}`
                                )
                              )
                            }
                          />
                        </Box>

                        <Text fontWeight="semibold" mb={2} color="gray.800">
                          {meal.meal}
                        </Text>
                        <Text fontSize="sm" color="gray.600" mb={3}>
                          {meal.quantity}
                        </Text>

                        <Flex justify="space-between" align="center">
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={ThemeColors.darkColor}
                          >
                            {formatPrice(meal.pricing?.monthly)}
                            <Text
                              as="span"
                              fontSize="sm"
                              color="gray.600"
                              ml={1}
                            >
                              /month
                            </Text>
                          </Text>
                          {isSelected && (
                            <Check
                              size={20}
                              color={ThemeColors.darkColor}
                              style={{ flexShrink: 0 }}
                            />
                          )}
                        </Flex>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Vegetarian Option */}
        <Box
          p={4}
          bg={themeBg}
          borderRadius="lg"
          border="1px solid"
          borderColor={themeBorder}
          mb={6}
        >
          <Checkbox
            isChecked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
            colorScheme="green"
            size="lg"
          >
            <Text ml={2} fontWeight="semibold" color="gray.700">
              Vegetarian meals only
            </Text>
          </Checkbox>
        </Box>

        {/* Delivery Info */}
        <Box
          p={3}
          bg={themeBg}
          borderRadius="md"
          border="1px solid"
          borderColor={themeBorder}
        >
          <Text
            fontSize="sm"
            color="gray.700"
            textAlign="center"
          >
            🚚 Free delivery within 3km • 950 UGX per extra km
          </Text>
        </Box>
      </Box>

      {/* Cart Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader
            borderBottom="1px solid"
            borderColor="gray.200"
            bg={themeBg}
            borderTopRadius="xl"
          >
            <Flex justify="space-between" align="center">
              <Heading size="md" color={ThemeColors.darkColor}>
                Your Meal Plan
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {selectedMeals.length} meals selected
              </Text>
            </Flex>
          </ModalHeader>
          <ModalBody py={6}>
            {selectedMeals.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Calendar size={48} color="#CBD5E0" />
                <Text mt={4} color="gray.600">
                  No meals selected yet
                </Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Choose meals from the weekly plan
                </Text>
              </Box>
            ) : (
              <Stack spacing={4}>
                {selectedMeals.map((meal, index) => (
                  <Flex
                    key={index}
                    justify="space-between"
                    align="center"
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Box>
                      <Text fontWeight="semibold">{meal.meal}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {meal.mealType} • {meal.prepType}
                      </Text>
                    </Box>
                    <Flex align="center" gap={3}>
                      <Text
                        fontWeight="bold"
                        color={ThemeColors.darkColor}
                      >
                        {formatPrice(meal.pricing?.monthly)}
                      </Text>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        aria-label="Remove meal"
                        onClick={() => handleMealSelect(meal)}
                      >
                        <X size={16} />
                      </Button>
                    </Flex>
                  </Flex>
                ))}

                <Box mt={6} pt={4} borderTop="1px solid" borderColor="gray.200">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">
                      Total (Monthly)
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color={ThemeColors.darkColor}
                    >
                      {formatPrice(calculateTotal())}
                    </Text>
                  </Flex>
                </Box>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter
            borderTop="1px solid"
            borderColor="gray.200"
            bg="gray.50"
            borderBottomRadius="xl"
          >
            <Flex justify="space-between" w="100%">
              <Button variant="outline" onClick={onClose}>
                Continue Selecting
              </Button>
              <Button
                bg={ThemeColors.primaryColor}
                color="white"
                _hover={{ bg: ThemeColors.secondaryColor }}
                leftIcon={<ShoppingCart size={18} />}
                onClick={handleSubscribe}
                isDisabled={selectedMeals.length === 0}
                size="lg"
              >
                Subscribe Now
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UnifiedMealSubscriptionCard;
