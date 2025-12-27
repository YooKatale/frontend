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
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  useToast,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Eye, ArrowRight, Calendar, ShoppingCart, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { getMealForDay } from "@lib/mealMenuConfig";
import { getMealPricing, formatPrice } from "@lib/mealPricingConfig";
import MealSubscriptionSelector from "./MealSubscriptionSelector";
import { useNewScheduleMutation } from "@slices/productsApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { DB_URL } from "@config/config";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * Unified Meal Subscription Card
 * Combines meal calendar and pricing in one professional, clean card
 */
const UnifiedMealSubscriptionCard = ({ planType = "premium" }) => {
  const incomeLevel = "middle"; // Always use middle income
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [paidMealSubscriptions, setPaidMealSubscriptions] = useState([]); // Store paid subscriptions from backend
  const [subscribingMeals, setSubscribingMeals] = useState({}); // Track which specific meal+duration is being subscribed
  const [selectedMealsForSubscription, setSelectedMealsForSubscription] = useState([]); // Selected meals before subscribing
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [selectedSauce, setSelectedSauce] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCustomizeOpen, onOpen: onCustomizeOpen, onClose: onCustomizeClose } = useDisclosure();
  const toast = useToast();
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const [createSchedule] = useNewScheduleMutation();

  const planName = planType.charAt(0).toUpperCase() + planType.slice(1);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch paid meal subscriptions from backend
  useEffect(() => {
    const fetchPaidSubscriptions = async () => {
      if (!userInfo?._id) return;
      
      try {
        const response = await axios.get(
          `${DB_URL}/products/orders/${userInfo._id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (response.status === 200 && response.data?.data?.AllOrders) {
          // Filter for paid meal subscription orders
          const mealSubscriptions = response.data.data.AllOrders.filter((order) => {
            // Check if order is paid and is a meal subscription
            const isPaid = order.payment?.paymentMethod && 
                          order.payment?.paymentMethod !== "" &&
                          order.status !== "pending";
            const isMealSubscription = order.products?.mealSubscription === true ||
                                      order.scheduleFor === "meal_subscription";
            
            return isPaid && isMealSubscription;
          });

          // Extract meal details from paid subscriptions
          const subscriptions = mealSubscriptions.flatMap((order) => {
            if (order.products?.meals && Array.isArray(order.products.meals)) {
              return order.products.meals.map((meal) => ({
                mealType: meal.mealType,
                prepType: meal.prepType,
                duration: meal.duration,
                planType: order.products.planType || planType,
                incomeLevel: order.products.incomeLevel || incomeLevel,
                orderId: order._id,
                paidAt: order.payment?.paidAt || order.createdAt,
              }));
            }
            return [];
          });

          setPaidMealSubscriptions(subscriptions);
        }
      } catch (error) {
        console.error("Error fetching paid subscriptions:", error);
      }
    };

    fetchPaidSubscriptions();
  }, [userInfo, planType, incomeLevel]);

  // Build weekly menu based on income level
  const weeklyMenu = useMemo(() => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const mealTypes = ["breakfast", "lunch", "supper"];
    const menu = {};

    days.forEach((day) => {
      menu[day] = {};
      mealTypes.forEach((mealType) => {
        const readyToEat = getMealForDay(day, mealType, incomeLevel, "ready-to-eat");
        const readyToCook = getMealForDay(day, mealType, incomeLevel, "ready-to-cook");
        
        menu[day][mealType] = [];
        
        if (readyToEat) {
          const pricing = getMealPricing(mealType, "ready-to-eat", incomeLevel);
          menu[day][mealType].push({
            ...readyToEat,
            type: "ready-to-eat",
            pricing,
          });
        }
        
        if (readyToCook) {
          const pricing = getMealPricing(mealType, "ready-to-cook", incomeLevel);
          menu[day][mealType].push({
            ...readyToCook,
            type: "ready-to-cook",
            pricing,
          });
        }
      });
    });
    
    return menu;
  }, [incomeLevel]);

  const handleMealClick = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    onOpen();
  };

  const selectedMeals = selectedDay && selectedMealType ? weeklyMenu[selectedDay]?.[selectedMealType] || [] : [];

  // Check if a specific meal is subscribed (paid)
  const isMealSubscribed = (mealType, prepType, duration) => {
    return paidMealSubscriptions.some(
      (sub) =>
        sub.mealType === mealType &&
        sub.prepType === prepType &&
        sub.duration === duration &&
        sub.planType === planType &&
        sub.incomeLevel === incomeLevel
    );
  };

  // Toggle meal selection for subscription
  const toggleMealSelection = (meal, duration) => {
    const mealKey = `${selectedMealType}-${meal.type}-${duration}`;
    setSelectedMealsForSubscription((prev) => {
      const exists = prev.find(
        (m) =>
          m.mealType === selectedMealType &&
          m.prepType === meal.type &&
          m.duration === duration
      );
      
      if (exists) {
        // Remove if already selected
        return prev.filter(
          (m) =>
            !(m.mealType === selectedMealType && m.prepType === meal.type && m.duration === duration)
        );
      } else {
        // Add if not selected
        const pricing = getMealPricing(selectedMealType, meal.type, incomeLevel);
        return [
          ...prev,
          {
            mealType: selectedMealType,
            prepType: meal.type,
            duration: duration,
            price: duration === "weekly" ? pricing.weekly : pricing.monthly,
            mealName: meal.meal,
            description: meal.description,
            image: meal.image,
            quantity: meal.quantity,
            day: selectedDay,
          },
        ];
      }
    });
  };

  // Check if meal is selected for subscription
  const isMealSelected = (meal, duration) => {
    return selectedMealsForSubscription.some(
      (m) =>
        m.mealType === selectedMealType &&
        m.prepType === meal.type &&
        m.duration === duration
    );
  };

  // Handle subscription for selected meals
  const handleSubscribeSelectedMeals = async () => {
    if (!userInfo?._id) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to meals",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      router.push("/signin");
      return;
    }

    if (selectedMealsForSubscription.length === 0) {
      toast({
        title: "No Meals Selected",
        description: "Please select at least one meal to subscribe",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const mealKey = "bulk-subscription";
    setSubscribingMeals((prev) => ({ ...prev, [mealKey]: true }));

    try {
      const totalPrice = selectedMealsForSubscription.reduce((sum, meal) => sum + meal.price, 0);
      
      // Build special requests with vegetarian and sauce preferences
      let specialRequests = `Meal subscription for ${selectedMealsForSubscription.length} meal(s).`;
      if (isVegetarian) {
        specialRequests += " Vegetarian option requested.";
      }
      if (selectedSauce) {
        specialRequests += ` Preferred sauce: ${selectedSauce}.`;
      }

      // Create order for selected meals
      const schedulePayload = {
        user: userInfo._id,
        products: {
          mealSubscription: true,
          planType: planType,
          incomeLevel: incomeLevel,
          meals: selectedMealsForSubscription.map((m) => ({
            mealType: m.mealType,
            prepType: m.prepType,
            duration: m.duration,
            price: m.price,
            isVegetarian: isVegetarian,
            preferredSauce: selectedSauce || null,
          })),
        },
        scheduleDays: [],
        scheduleTime: "",
        repeatSchedule: false,
        scheduleFor: "meal_subscription",
        order: {
          payment: { paymentMethod: "", transactionId: "" },
          deliveryAddress: "NAN",
          specialRequests: specialRequests,
          orderTotal: totalPrice,
        },
      };

      const res = await createSchedule(schedulePayload).unwrap();

      if (res.status === "Success" || res.status === "success") {
        const orderId = res.data?.Order || res.data?.order || res.Order || res.order;
        
        if (orderId) {
          // Save to Food Algae Box
          if (typeof window !== "undefined" && userInfo?._id) {
            const foodAlgaeBoxData = {
              userId: userInfo._id,
              planType: planType,
              meals: selectedMealsForSubscription,
              isVegetarian: isVegetarian,
              selectedSauce: selectedSauce,
              lastUpdated: new Date().toISOString(),
            };
            localStorage.setItem(`foodAlgaeBox_${userInfo._id}`, JSON.stringify(foodAlgaeBoxData));
            
            // Dispatch event for Food Algae Box to update
            window.dispatchEvent(
              new CustomEvent("menuUpdated", {
                detail: { menuData: foodAlgaeBoxData },
              })
            );
          }

          toast({
            title: "Subscription Created",
            description: `Created subscription for ${selectedMealsForSubscription.length} meal(s). Redirecting to payment...`,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          
          // Clear selections
          setSelectedMealsForSubscription([]);
          setIsVegetarian(false);
          setSelectedSauce("");
          onClose();
          router.push(`/payment/${orderId}`);
        } else {
          throw new Error("No order ID in response");
        }
      } else {
        throw new Error(res.message || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Error subscribing to meals:", error);
      toast({
        title: "Error",
        description: error.data?.message || error.message || "Failed to subscribe. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubscribingMeals((prev) => ({ ...prev, [mealKey]: false }));
    }
  };

  return (
    <>
      <Box
        width="100%"
        borderRadius="xl"
        background="white"
        className="card__design"
        shadow="lg"
        padding={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
        border="1px solid"
        borderColor="gray.200"
        position="relative"
        overflow="hidden"
      >
        {/* Plan Header Badge */}
        <Box
          position="absolute"
          top={0}
          right={0}
          background={ThemeColors.darkColor}
          color="white"
          paddingX={{ base: "1.5rem", md: "2rem" }}
          paddingY={{ base: "0.5rem", md: "0.75rem" }}
          borderBottomLeftRadius="lg"
          zIndex={1}
        >
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {planName} Plan
          </Text>
        </Box>

        {/* Controls Section */}
        <Box marginBottom={{ base: "1.5rem", md: "2rem" }} paddingTop={{ base: "1rem", md: "1.5rem" }}>
          <Flex
            justifyContent="space-between"
            alignItems="flex-start"
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: "1rem", md: "2rem" }}
          >
            {/* Quick Action Button */}
            <Box>
              <MealSubscriptionSelector planType={planType} incomeLevel="middle" />
            </Box>
          </Flex>
        </Box>

        <Divider marginBottom={{ base: "1.5rem", md: "2rem" }} />

        {/* Weekly Calendar Slider */}
        <Box position="relative" marginBottom={{ base: "1.5rem", md: "2rem" }}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {daysOfWeek.map((day) => {
              const dayKey = day.toLowerCase();
              const dayMenu = weeklyMenu[dayKey];
              
              return (
                <SwiperSlide key={day}>
                  <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    padding={{ base: "1rem", md: "1.5rem" }}
                    background="white"
                    height="100%"
                    boxShadow="sm"
                    _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                  >
                    <Heading
                      as="h3"
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                      color={ThemeColors.darkColor}
                      marginBottom="1rem"
                      textAlign="center"
                    >
                      {day}
                    </Heading>

                    {/* Meal Types - Compact View */}
                    <Stack spacing={3}>
                      {["breakfast", "lunch", "supper"].map((mealType) => {
                        const meals = dayMenu[mealType] || [];
                        const mealTypeLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);
                        const timeRanges = {
                          breakfast: "6:00 AM - 10:00 AM",
                          lunch: "12:00 PM - 3:00 PM",
                          supper: "5:00 PM - 10:00 PM",
                        };

                        return (
                          <Box
                            key={mealType}
                            onClick={() => handleMealClick(dayKey, mealType)}
                            padding={{ base: "1rem", md: "1.25rem" }}
                            background="white"
                            borderRadius="lg"
                            border="2px solid"
                            borderColor="gray.200"
                            position="relative"
                            _hover={{
                              background: "blue.50",
                              borderColor: ThemeColors.darkColor,
                              transform: "translateY(-2px)",
                              boxShadow: "md",
                            }}
                            transition="all 0.3s ease"
                            cursor="pointer"
                          >
                            {/* Click Indicator */}
                            <Flex
                              position="absolute"
                              top="0.5rem"
                              right="0.5rem"
                              alignItems="center"
                              gap="0.25rem"
                              paddingX="0.5rem"
                              paddingY="0.25rem"
                              background={ThemeColors.darkColor}
                              color="white"
                              borderRadius="full"
                              fontSize="2xs"
                              fontWeight="medium"
                            >
                              <Eye size={12} />
                              <Text>View</Text>
                            </Flex>

                            <Flex justifyContent="space-between" alignItems="center" marginBottom="0.75rem">
                              <Box>
                                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color={ThemeColors.darkColor}>
                                  {mealTypeLabel}
                                </Text>
                                <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" marginTop="0.125rem">
                                  {timeRanges[mealType]}
                                </Text>
                              </Box>
                            </Flex>
                            
                            {/* Show first meal as preview */}
                            {meals.length > 0 && (
                              <Box>
                                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" marginBottom="0.5rem" color="gray.700">
                                  {meals[0].meal}
                                </Text>
                                <Flex gap={2} alignItems="center" flexWrap="wrap" marginBottom="0.5rem">
                                  <Badge 
                                    colorScheme={meals[0].type === "ready-to-eat" ? "green" : "blue"} 
                                    fontSize={{ base: "2xs", md: "xs" }}
                                    paddingX="0.5rem"
                                    paddingY="0.125rem"
                                  >
                                    {meals[0].type}
                                  </Badge>
                                  {meals[0].pricing && (
                                    <>
                                      <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight="semibold" color={ThemeColors.darkColor}>
                                        {formatPrice(meals[0].pricing.weekly)}/wk
                                      </Text>
                                      <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight="semibold" color={ThemeColors.darkColor}>
                                        {formatPrice(meals[0].pricing.monthly)}/mo
                                      </Text>
                                    </>
                                  )}
                                </Flex>
                                
                                {/* View More Options Button */}
                                {meals.length > 1 && (
                                  <Box
                                    marginTop="0.75rem"
                                    padding="0.5rem"
                                    background="blue.50"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="blue.200"
                                  >
                                    <Flex alignItems="center" justifyContent="space-between">
                                      <Flex alignItems="center" gap="0.5rem">
                                        <Box
                                          width="24px"
                                          height="24px"
                                          borderRadius="full"
                                          background={ThemeColors.darkColor}
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          color="white"
                                        >
                                          <Text fontSize="2xs" fontWeight="bold">
                                            +{meals.length - 1}
                                          </Text>
                                        </Box>
                                        <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight="medium" color={ThemeColors.darkColor}>
                                          {meals.length - 1} more option{meals.length > 2 ? "s" : ""} available
                                        </Text>
                                      </Flex>
                                      <ArrowRight size={14} color={ThemeColors.darkColor} />
                                    </Flex>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Buttons */}
          <IconButton
            aria-label="Previous day"
            icon={<ChevronLeft size={20} />}
            position="absolute"
            left={{ base: "-10px", md: "-15px" }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={10}
            background="white"
            boxShadow="md"
            borderRadius="full"
            className="swiper-button-prev-custom"
            size={{ base: "sm", md: "md" }}
          />
          <IconButton
            aria-label="Next day"
            icon={<ChevronRight size={20} />}
            position="absolute"
            right={{ base: "-10px", md: "-15px" }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={10}
            background="white"
            boxShadow="md"
            borderRadius="full"
            className="swiper-button-next-custom"
            size={{ base: "sm", md: "md" }}
          />
        </Box>

        {/* Delivery Disclaimer */}
        <Box
          padding="1rem"
          background="blue.50"
          borderRadius="md"
          border="1px solid"
          borderColor="blue.200"
        >
          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
            <Text as="span" fontWeight="bold">Free Delivery:</Text> Within 3km distance.{" "}
            <Text as="span" fontWeight="bold">Extra:</Text> 950 UGX per additional kilometer.
          </Text>
        </Box>
      </Box>

      {/* Meal Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl", lg: "2xl" }} scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(2px)" />
        <ModalContent maxHeight={{ base: "100vh", md: "90vh" }} borderRadius={{ base: "none", md: "xl" }}>
          <ModalHeader
            background={`linear-gradient(135deg, ${ThemeColors.darkColor} 0%, #2d3748 100%)`}
            color="white"
            padding={{ base: "1.5rem", md: "2rem" }}
            borderTopRadius={{ base: "0", md: "xl" }}
          >
            <Flex alignItems="center" gap="0.75rem" marginBottom="0.5rem">
              <Box
                width="40px"
                height="40px"
                borderRadius="full"
                background="rgba(255, 255, 255, 0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Calendar size={20} color="white" />
              </Box>
              <Box flex="1">
                <Heading fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="bold">
                  {selectedDay && daysOfWeek[["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(selectedDay)]}
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.200" marginTop="0.25rem">
                  {selectedMealType && (selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1))} Options
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            size="lg"
            _hover={{ background: "rgba(255, 255, 255, 0.2)" }}
          />
          <ModalBody padding={{ base: "1.5rem", md: "2rem" }}>
            {/* Instructions */}
            <Box
              padding="1rem"
              background="blue.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="blue.200"
              marginBottom="1.5rem"
            >
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="gray.700" marginBottom="0.5rem">
                📋 How it works:
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                1. Select the meals you want (Ready to Eat or Ready to Cook) • 2. Choose Weekly or Monthly • 3. Customize for vegetarian & sauce preferences • 4. Click "Subscribe Selected Meals"
              </Text>
            </Box>

            {/* Vegetarian & Sauce Customization */}
            <Box
              padding="1rem"
              background="green.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="green.200"
              marginBottom="1.5rem"
            >
              <Flex flexDirection={{ base: "column", md: "row" }} gap={4} alignItems={{ base: "flex-start", md: "center" }}>
                <Box flex="1">
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="gray.700" marginBottom="0.5rem">
                    Vegetarian Option
                  </Text>
                  <Button
                    size="sm"
                    colorScheme={isVegetarian ? "green" : "gray"}
                    variant={isVegetarian ? "solid" : "outline"}
                    onClick={() => setIsVegetarian(!isVegetarian)}
                    width={{ base: "100%", md: "auto" }}
                  >
                    {isVegetarian ? "✓ Vegetarian" : "Not Vegetarian"}
                  </Button>
                </Box>
                <Box flex="1">
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="gray.700" marginBottom="0.5rem">
                    Preferred Sauce (Optional)
                  </Text>
                  <Select
                    size="sm"
                    value={selectedSauce}
                    onChange={(e) => setSelectedSauce(e.target.value)}
                    placeholder="Choose sauce..."
                    background="white"
                    width={{ base: "100%", md: "auto" }}
                  >
                    <option value="groundnut">Groundnut Sauce</option>
                    <option value="bean">Bean Sauce</option>
                    <option value="pea">Pea Sauce</option>
                    <option value="lentil">Lentil Sauce</option>
                    <option value="fish">Fish Sauce</option>
                    <option value="tomato">Tomato Sauce</option>
                    <option value="none">No Preference</option>
                  </Select>
                </Box>
              </Flex>
            </Box>

            <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" marginBottom="1.5rem" textAlign="center" fontWeight="semibold">
              Select Your Meals (You can choose multiple)
            </Text>
            <Stack spacing={4}>
              {selectedMeals.map((meal, idx) => {
                // Check if meal is subscribed for weekly or monthly
                const isSubscribedWeekly = isMealSubscribed(selectedMealType, meal.type, "weekly");
                const isSubscribedMonthly = isMealSubscribed(selectedMealType, meal.type, "monthly");
                const isSubscribed = isSubscribedWeekly || isSubscribedMonthly;

                return (
                  <Box
                    key={idx}
                    padding={{ base: "1.25rem", md: "1.5rem" }}
                    background={isSubscribed ? "green.50" : "white"}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={isSubscribed ? "green.400" : "gray.200"}
                    boxShadow={isSubscribed ? "lg" : "sm"}
                    _hover={{ 
                      borderColor: ThemeColors.darkColor,
                      boxShadow: "xl",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                  >
                    {isSubscribed && (
                      <Badge
                        position="absolute"
                        top="-10px"
                        right="1rem"
                        colorScheme="green"
                        fontSize="xs"
                        paddingX="0.75rem"
                        paddingY="0.25rem"
                        borderRadius="full"
                        boxShadow="md"
                      >
                        <Check size={12} style={{ display: "inline", marginRight: "4px" }} />
                        Paid & Active
                      </Badge>
                    )}
                    
                    <Flex gap={{ base: "1rem", md: "1.5rem" }} alignItems="flex-start">
                      <Box
                        width={{ base: "100px", md: "120px" }}
                        height={{ base: "100px", md: "120px" }}
                        borderRadius="xl"
                        overflow="hidden"
                        flexShrink={0}
                        background="gray.200"
                        position="relative"
                        boxShadow="md"
                      >
                        <Image
                          src={meal.image || "/assets/images/img5.png"}
                          alt={meal.meal}
                          fill
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          sizes="(max-width: 768px) 100px, 120px"
                        />
                      </Box>
                      <Box flex="1">
                        <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="0.75rem">
                          <Heading fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={ThemeColors.darkColor}>
                            {meal.meal}
                          </Heading>
                        </Flex>
                        
                        {meal.description && (
                          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" marginBottom="1rem" lineHeight="1.6">
                            {meal.description}
                          </Text>
                        )}

                        <Flex gap={2} alignItems="center" flexWrap="wrap" marginBottom="1rem">
                          <Badge 
                            colorScheme={meal.type === "ready-to-eat" ? "green" : "blue"} 
                            fontSize={{ base: "xs", md: "sm" }}
                            paddingX="0.75rem"
                            paddingY="0.25rem"
                          >
                            {meal.type}
                          </Badge>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                            Quantity: {meal.quantity}
                          </Text>
                        </Flex>

                        {/* Pricing - Enhanced with Selection Checkboxes */}
                        {meal.pricing && (
                          <Box
                            padding="1rem"
                            background="gray.50"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="gray.300"
                          >
                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="gray.700" marginBottom="0.75rem">
                              Select Subscription Duration
                            </Text>
                            <Flex flexDirection={{ base: "column", md: "row" }} gap={4}>
                              {/* Weekly Option */}
                              <Box 
                                flex="1" 
                                padding="1rem" 
                                background={isSubscribedWeekly ? "green.100" : isMealSelected(meal, "weekly") ? "blue.100" : "white"} 
                                borderRadius="md"
                                border="2px solid"
                                borderColor={
                                  isSubscribedWeekly ? "green.400" : 
                                  isMealSelected(meal, "weekly") ? "blue.400" : 
                                  "gray.200"
                                }
                                cursor={isSubscribedWeekly ? "not-allowed" : "pointer"}
                                onClick={() => !isSubscribedWeekly && toggleMealSelection(meal, "weekly")}
                                transition="all 0.2s ease"
                                _hover={!isSubscribedWeekly ? { transform: "scale(1.02)", boxShadow: "md" } : {}}
                              >
                                <Flex alignItems="center" justifyContent="space-between" marginBottom="0.5rem">
                                  <Text fontSize="2xs" color="gray.500" fontWeight="medium">
                                    Weekly
                                  </Text>
                                  {isMealSelected(meal, "weekly") && !isSubscribedWeekly && (
                                    <Check size={16} color={ThemeColors.darkColor} />
                                  )}
                                  {isSubscribedWeekly && (
                                    <Badge colorScheme="green" fontSize="2xs" paddingX="0.5rem" paddingY="0.125rem" borderRadius="full">
                                      Active
                                    </Badge>
                                  )}
                                </Flex>
                                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color={ThemeColors.darkColor}>
                                  {formatPrice(meal.pricing.weekly)}
                                </Text>
                                {!isSubscribedWeekly && (
                                  <Text fontSize="2xs" color="gray.500" marginTop="0.25rem">
                                    {isMealSelected(meal, "weekly") ? "✓ Selected" : "Click to select"}
                                  </Text>
                                )}
                              </Box>
                              
                              {/* Monthly Option */}
                              <Box 
                                flex="1" 
                                padding="1rem" 
                                background={isSubscribedMonthly ? "green.100" : isMealSelected(meal, "monthly") ? "blue.100" : "white"} 
                                borderRadius="md"
                                border="2px solid"
                                borderColor={
                                  isSubscribedMonthly ? "green.400" : 
                                  isMealSelected(meal, "monthly") ? "blue.400" : 
                                  "gray.200"
                                }
                                cursor={isSubscribedMonthly ? "not-allowed" : "pointer"}
                                onClick={() => !isSubscribedMonthly && toggleMealSelection(meal, "monthly")}
                                transition="all 0.2s ease"
                                _hover={!isSubscribedMonthly ? { transform: "scale(1.02)", boxShadow: "md" } : {}}
                              >
                                <Flex alignItems="center" justifyContent="space-between" marginBottom="0.5rem">
                                  <Text fontSize="2xs" color="gray.500" fontWeight="medium">
                                    Monthly
                                  </Text>
                                  {isMealSelected(meal, "monthly") && !isSubscribedMonthly && (
                                    <Check size={16} color={ThemeColors.darkColor} />
                                  )}
                                  {isSubscribedMonthly && (
                                    <Badge colorScheme="green" fontSize="2xs" paddingX="0.5rem" paddingY="0.125rem" borderRadius="full">
                                      Active
                                    </Badge>
                                  )}
                                </Flex>
                                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={ThemeColors.darkColor}>
                                  {formatPrice(meal.pricing.monthly)}
                                </Text>
                                {!isSubscribedMonthly && (
                                  <Text fontSize="2xs" color="gray.500" marginTop="0.25rem">
                                    {isMealSelected(meal, "monthly") ? "✓ Selected" : "Click to select"}
                                  </Text>
                                )}
                              </Box>
                            </Flex>
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Stack>

            {/* Selected Meals Summary */}
            {selectedMealsForSubscription.length > 0 && (
              <Box
                marginTop="2rem"
                padding="1.5rem"
                background="blue.50"
                borderRadius="lg"
                border="2px solid"
                borderColor="blue.300"
              >
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color={ThemeColors.darkColor} marginBottom="1rem">
                  📋 Selected Meals ({selectedMealsForSubscription.length})
                </Text>
                <Stack spacing={2} marginBottom="1rem">
                  {selectedMealsForSubscription.map((selectedMeal, idx) => (
                    <Flex key={idx} justifyContent="space-between" alignItems="center" padding="0.5rem" background="white" borderRadius="md">
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700">
                        {selectedMeal.mealName} ({selectedMeal.prepType}) - {selectedMeal.duration}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color={ThemeColors.darkColor}>
                        {formatPrice(selectedMeal.price)}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
                <Divider marginY="1rem" />
                <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
                  <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color={ThemeColors.darkColor}>
                    Total:
                  </Text>
                  <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={ThemeColors.darkColor}>
                    {formatPrice(selectedMealsForSubscription.reduce((sum, m) => sum + m.price, 0))}
                  </Text>
                </Flex>
              </Box>
            )}
          </ModalBody>
          <ModalFooter
            padding={{ base: "1rem 1.5rem", md: "1.5rem 2rem" }}
            borderTop="1px solid"
            borderColor="gray.200"
            background="gray.50"
          >
            <Flex width="100%" justifyContent="space-between" alignItems="center" flexDirection={{ base: "column", md: "row" }} gap={4}>
              <Button
                variant="ghost"
                onClick={onClose}
                size={{ base: "sm", md: "md" }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                size={{ base: "md", md: "lg" }}
                leftIcon={<ShoppingCart size={18} />}
                onClick={handleSubscribeSelectedMeals}
                isLoading={subscribingMeals["bulk-subscription"]}
                loadingText="Creating Subscription..."
                isDisabled={selectedMealsForSubscription.length === 0}
                width={{ base: "100%", md: "auto" }}
                paddingX={{ base: "2rem", md: "3rem" }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="semibold"
              >
                Subscribe Selected Meals ({selectedMealsForSubscription.length})
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UnifiedMealSubscriptionCard;

