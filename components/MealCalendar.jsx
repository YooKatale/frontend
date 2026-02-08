"use client";

import { 
  Box, 
  Flex, 
  Text, 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Button,
  useToast,
  Badge,
  Heading,
  Divider,
  IconButton,
  Stack
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect, useMemo } from "react";
import { Save, Calendar, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { getMealForDay } from "@lib/mealMenuConfig";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' fill='%23e2e8f0'%3E%3Crect width='200' height='150' fill='%23f7fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14' font-family='sans-serif'%3ENo image%3C/text%3E%3C/svg%3E";

/**
 * Professional Meal Calendar Component with Slider
 * Displays 7-day meal calendar in a professional table format
 * with customizable vegetarian sauce options
 */
const MealCalendar = ({ planType = "premium" }) => {
  const [vegetarianSauceOptions, setVegetarianSauceOptions] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMealSubscription, setSelectedMealSubscription] = useState(null);

  const toast = useToast();

  // Load meal subscription from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealSubscription");
      if (stored) {
        try {
          const subscription = JSON.parse(stored);
          if (subscription.planType === planType) {
            setSelectedMealSubscription(subscription);
          }
        } catch (e) {
          console.error("Error parsing meal subscription:", e);
        }
      }
    }

    // Listen for meal subscription updates
    const handleStorageChange = () => {
      const stored = localStorage.getItem("mealSubscription");
      if (stored) {
        try {
          const subscription = JSON.parse(stored);
          if (subscription.planType === planType) {
            setSelectedMealSubscription(subscription);
          }
        } catch (e) {
          console.error("Error parsing meal subscription:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [planType]);

  // Build weekly menu from configuration - showing both ready-to-eat and ready-to-cook options
  // Default to middle income earners (can be made configurable later)
  const weeklyMenu = useMemo(() => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const mealTypes = ["breakfast", "lunch", "supper"];
    const menu = {};
    const incomeLevel = "middle"; // Default to middle income, can be made configurable

    days.forEach((day) => {
      menu[day] = {};
      mealTypes.forEach((mealType) => {
        // Get both ready-to-eat and ready-to-cook versions
        const readyToEat = getMealForDay(day, mealType, incomeLevel, "ready-to-eat");
        const readyToCook = getMealForDay(day, mealType, incomeLevel, "ready-to-cook");
        
        menu[day][mealType] = [];
        
        if (readyToEat) {
          menu[day][mealType].push({
            meal: readyToEat.meal,
            type: "ready-to-eat",
            quantity: readyToEat.quantity,
            description: readyToEat.description,
            image: readyToEat.image || PLACEHOLDER_IMAGE,
          });
        }
        
        if (readyToCook) {
          menu[day][mealType].push({
            meal: readyToCook.meal,
            type: "ready-to-cook",
            quantity: readyToCook.quantity,
            description: readyToCook.description,
            image: readyToCook.image || PLACEHOLDER_IMAGE,
          });
        }
      });
    });
    
    return menu;
  }, [planType]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleVegetarianSauceChange = (day) => {
    setVegetarianSauceOptions((prev) => ({
      ...prev,
      [day.toLowerCase()]: !prev[day.toLowerCase()],
    }));
  };

  const handleSaveMenu = () => {
    const menuData = {
      planType,
      vegetarianSauceOptions,
      menu: weeklyMenu,
    };
    
    // Trigger Food Algy update
    const event = new CustomEvent("menuUpdated", {
      detail: { menuData },
    });
    window.dispatchEvent(event);
    
    toast({
      title: "Menu Preferences Saved",
      description: "Your meal preferences have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // TODO: Send to backend API
  };

  return (
    <Box
      width={"100%"}
      borderRadius={"lg"}
      background={"white"}
      className={"card__design"}
      shadow={"md"}
      padding={{ base: "1rem", md: "2rem" }}
      marginTop={"2rem"}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"1.5rem"}
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: "1rem", md: "0" }}
      >
        <Flex alignItems={"center"} gap={"0.5rem"}>
          <Calendar size={24} color={ThemeColors.darkColor} />
          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight={"bold"}
            color={ThemeColors.darkColor}
          >
            Weekly Meal Calendar - {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
          </Heading>
        </Flex>
        <Badge colorScheme="blue" paddingX={"0.75rem"} paddingY={"0.25rem"} fontSize={"sm"}>
          Customizable
        </Badge>
      </Flex>

      <Divider marginBottom={"1.5rem"} />

      {/* Professional Slider for Meal Calendar */}
      <Box position={"relative"} marginBottom={"1.5rem"}>
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
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {daysOfWeek.map((day, dayIndex) => {
            const dayKey = day.toLowerCase();
            const dayMenu = weeklyMenu[dayKey];
            
            return (
              <SwiperSlide key={day}>
                <Box
                  border={"1px solid"}
                  borderColor={"gray.200"}
                  borderRadius={"lg"}
                  padding={{ base: "1rem", md: "1.5rem" }}
                  background={"white"}
                  height={"100%"}
                  boxShadow={"sm"}
                  _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                  transition={"all 0.3s ease"}
                >
                  <Heading
                    as="h3"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight={"bold"}
                    color={ThemeColors.darkColor}
                    marginBottom={"1rem"}
                    textAlign={"center"}
                  >
                    {day}
                  </Heading>

                  {/* Breakfast Section */}
        <Box marginBottom={"1.5rem"}>
                    <Flex justifyContent="space-between" alignItems="center" marginBottom={"0.75rem"}>
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight={"bold"}
                        color={ThemeColors.darkColor}
                      >
                        Breakfast (6:00 AM - 10:00 AM)
                      </Text>
                      {selectedMealSubscription?.meals?.some(
                        (m) => m.mealType === "breakfast"
                      ) && (
                        <Badge colorScheme="green" fontSize="xs">
                          Subscribed
                        </Badge>
                      )}
                    </Flex>
          <Stack spacing={2}>
                      {dayMenu.breakfast.map((item, idx) => {
                        const isSubscribed = selectedMealSubscription?.meals?.some(
                          (m) => m.mealType === "breakfast" && m.prepType === item.type
                        );
                        return (
                        <Box
                key={idx}
                          padding={"0.75rem"}
                          background={isSubscribed ? "green.50" : "gray.50"}
                          borderRadius={"md"}
                          border={"2px solid"}
                          borderColor={isSubscribed ? "green.300" : "gray.100"}
                          position="relative"
                        >
                          <Flex gap={"0.75rem"} alignItems={"flex-start"}>
                            <Box
                              width={{ base: "60px", md: "80px" }}
                              height={{ base: "60px", md: "80px" }}
                borderRadius={"md"}
                              overflow={"hidden"}
                              flexShrink={0}
                              background={"gray.200"}
                              position={"relative"}
                            >
                              <Image
                                src={item.image || PLACEHOLDER_IMAGE}
                                alt={item.meal}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 60px, 80px"
                              />
                            </Box>
                            <Box flex={"1"}>
                              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight={"medium"} marginBottom={"0.25rem"}>
                                {item.meal}
                              </Text>
                              {item.description && (
                                <Text fontSize={{ base: "2xs", md: "xs" }} color={"gray.500"} marginBottom={"0.5rem"}>
                                  {item.description}
                                </Text>
                              )}
                              <Flex gap={"0.5rem"} alignItems={"center"} flexWrap={"wrap"}>
                                <Badge
                                  colorScheme={item.type === "ready-to-eat" ? "green" : "blue"}
                                  fontSize={"xs"}
                                >
                                  {item.type}
                                </Badge>
                                <Text fontSize={"xs"} color={"gray.600"}>
                                  {item.quantity}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                        );
                      })}
          </Stack>
        </Box>

                  {/* Lunch Section */}
        <Box marginBottom={"1.5rem"}>
                    <Flex justifyContent="space-between" alignItems="center" marginBottom={"0.75rem"}>
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight={"bold"}
                        color={ThemeColors.darkColor}
                      >
                        Lunch (12:00 PM - 3:00 PM)
                      </Text>
                      {selectedMealSubscription?.meals?.some(
                        (m) => m.mealType === "lunch"
                      ) && (
                        <Badge colorScheme="green" fontSize="xs">
                          Subscribed
                        </Badge>
                      )}
                    </Flex>
          <Stack spacing={2}>
                      {dayMenu.lunch.map((item, idx) => {
                        const isSubscribed = selectedMealSubscription?.meals?.some(
                          (m) => m.mealType === "lunch" && m.prepType === item.type
                        );
                        return (
                        <Box
                key={idx}
                          padding={"0.75rem"}
                          background={isSubscribed ? "green.50" : "gray.50"}
                          borderRadius={"md"}
                          border={"2px solid"}
                          borderColor={isSubscribed ? "green.300" : "gray.100"}
                          position="relative"
                        >
                          <Flex gap={"0.75rem"} alignItems={"flex-start"}>
                            <Box
                              width={{ base: "60px", md: "80px" }}
                              height={{ base: "60px", md: "80px" }}
                borderRadius={"md"}
                              overflow={"hidden"}
                              flexShrink={0}
                              background={"gray.200"}
                              position={"relative"}
                            >
                              <Image
                                src={item.image || PLACEHOLDER_IMAGE}
                                alt={item.meal}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 60px, 80px"
                              />
                            </Box>
                            <Box flex={"1"}>
                              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight={"medium"} marginBottom={"0.25rem"}>
                                {item.meal}
                              </Text>
                              <Flex gap={"0.5rem"} alignItems={"center"} flexWrap={"wrap"}>
                                <Badge
                                  colorScheme={item.type === "ready-to-eat" ? "green" : "blue"}
                                  fontSize={"xs"}
                                >
                                  {item.type}
                                </Badge>
                                <Text fontSize={"xs"} color={"gray.600"}>
                                  {item.quantity}
                                </Text>
                                {isSubscribed && (
                                  <Badge colorScheme="green" fontSize="xs" marginLeft="auto">
                                    ✓ Active
                                  </Badge>
                                )}
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                        );
                      })}
          </Stack>
        </Box>

                  {/* Supper Section */}
                  <Box marginBottom={"1rem"}>
                    <Flex justifyContent="space-between" alignItems="center" marginBottom={"0.75rem"}>
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight={"bold"}
                        color={ThemeColors.darkColor}
                      >
                        Supper (5:00 PM - 10:00 PM)
                      </Text>
                      {selectedMealSubscription?.meals?.some(
                        (m) => m.mealType === "supper"
                      ) && (
                        <Badge colorScheme="green" fontSize="xs">
                          Subscribed
                        </Badge>
                      )}
                    </Flex>
          <Stack spacing={2}>
                      {dayMenu.supper.map((item, idx) => {
                        const isSubscribed = selectedMealSubscription?.meals?.some(
                          (m) => m.mealType === "supper" && m.prepType === item.type
                        );
                        return (
                        <Box
                key={idx}
                          padding={"0.75rem"}
                          background={isSubscribed ? "green.50" : "gray.50"}
                          borderRadius={"md"}
                          border={"2px solid"}
                          borderColor={isSubscribed ? "green.300" : "gray.100"}
                          position="relative"
                        >
                          <Flex gap={"0.75rem"} alignItems={"flex-start"}>
                            <Box
                              width={{ base: "60px", md: "80px" }}
                              height={{ base: "60px", md: "80px" }}
                borderRadius={"md"}
                              overflow={"hidden"}
                              flexShrink={0}
                              background={"gray.200"}
                              position={"relative"}
                            >
                              <Image
                                src={item.image || PLACEHOLDER_IMAGE}
                                alt={item.meal}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 60px, 80px"
                              />
                            </Box>
                            <Box flex={"1"}>
                              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight={"medium"} marginBottom={"0.25rem"}>
                                {item.meal}
                              </Text>
                              {item.description && (
                                <Text fontSize={{ base: "2xs", md: "xs" }} color={"gray.500"} marginBottom={"0.5rem"}>
                                  {item.description}
                                </Text>
                              )}
                              <Flex gap={"0.5rem"} alignItems={"center"} flexWrap={"wrap"}>
                                <Badge
                                  colorScheme={item.type === "ready-to-eat" ? "green" : "blue"}
                                  fontSize={"xs"}
                                >
                                  {item.type}
                                </Badge>
                                <Text fontSize={"xs"} color={"gray.600"}>
                                  {item.quantity}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                        );
                      })}
          </Stack>
        </Box>

                  {/* Vegetarian Sauce Option */}
        <Box
                    padding={"0.75rem"}
                    background={"green.50"}
          borderRadius={"md"}
                    border={"1px solid"}
                    borderColor={"green.200"}
        >
          <Checkbox
                      isChecked={vegetarianSauceOptions[dayKey]}
                      onChange={() => handleVegetarianSauceChange(day)}
            colorScheme="green"
                      size={{ base: "sm", md: "md" }}
          >
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight={"medium"}>
                        Vegetarian Sauce Option
            </Text>
          </Checkbox>
                  </Box>
        </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <IconButton
          aria-label="Previous day"
          icon={<ChevronLeft size={20} />}
          position={"absolute"}
          left={{ base: "-10px", md: "-15px" }}
          top={"50%"}
          transform={"translateY(-50%)"}
          zIndex={10}
          background={"white"}
          boxShadow={"md"}
          borderRadius={"full"}
          className="swiper-button-prev-custom"
          size={{ base: "sm", md: "md" }}
        />
        <IconButton
          aria-label="Next day"
          icon={<ChevronRight size={20} />}
          position={"absolute"}
          right={{ base: "-10px", md: "-15px" }}
          top={"50%"}
          transform={"translateY(-50%)"}
          zIndex={10}
          background={"white"}
          boxShadow={"md"}
          borderRadius={"full"}
          className="swiper-button-next-custom"
          size={{ base: "sm", md: "md" }}
        />
      </Box>

      {/* Delivery Disclaimer */}
      <Box
        padding={"1rem"}
        background={"blue.50"}
        borderRadius={"md"}
        border={"1px solid"}
        borderColor={"blue.200"}
        marginTop={"1.5rem"}
      >
        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight={"medium"}>
          <Text as="span" fontWeight={"bold"}>
            Free Delivery:
          </Text>{" "}
          Within 3km distance.{" "}
          <Text as="span" fontWeight={"bold"}>
            Extra:
          </Text>{" "}
          950 UGX per additional kilometer.
        </Text>
      </Box>

      {/* Save Button */}
      <Flex justifyContent={"center"} marginTop={"1.5rem"}>
        <Button
          leftIcon={<Save size={18} />}
          colorScheme="blue"
          onClick={handleSaveMenu}
          size={{ base: "md", md: "lg" }}
          paddingX={"2rem"}
        >
          Save Menu Preferences
        </Button>
      </Flex>
    </Box>
  );
};

export default MealCalendar;
