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
import React, { useState, useEffect } from "react";
import { Save, Calendar, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

  const toast = useToast();

  // Default menu for middle-income earners (ready-to-cook and ready-to-eat)
  // Images can be edited by admin/customer care/procurement
  const weeklyMenu = {
    monday: {
      breakfast: [
        { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces", image: "/assets/images/meals/chapati-beans.jpg" },
        { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl", image: "/assets/images/meals/porridge.jpg" },
        { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-stew.jpg" },
      ],
      lunch: [
        { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/matooke.jpg" },
        { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-chicken.jpg" },
        { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/posho-beans.jpg" },
      ],
      supper: [
        { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-fish.jpg" },
        { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/sweet-potatoes.jpg" },
        { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/cassava-stew.jpg" },
      ],
    },
    tuesday: {
      breakfast: [
        { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces", image: "/assets/images/meals/chapati-beans.jpg" },
        { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl", image: "/assets/images/meals/porridge.jpg" },
        { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-stew.jpg" },
      ],
      lunch: [
        { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/matooke.jpg" },
        { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-chicken.jpg" },
        { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/posho-beans.jpg" },
      ],
      supper: [
        { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-fish.jpg" },
        { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/sweet-potatoes.jpg" },
        { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/cassava-stew.jpg" },
      ],
    },
    wednesday: {
      breakfast: [
        { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces", image: "/assets/images/meals/chapati-beans.jpg" },
        { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl", image: "/assets/images/meals/porridge.jpg" },
        { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-stew.jpg" },
      ],
      lunch: [
        { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/matooke.jpg" },
        { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-chicken.jpg" },
        { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/posho-beans.jpg" },
      ],
      supper: [
        { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-fish.jpg" },
        { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/sweet-potatoes.jpg" },
        { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/cassava-stew.jpg" },
      ],
    },
    thursday: {
      breakfast: [
        { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces", image: "/assets/images/meals/chapati-beans.jpg" },
        { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl", image: "/assets/images/meals/porridge.jpg" },
        { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-stew.jpg" },
      ],
      lunch: [
        { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/matooke.jpg" },
        { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-chicken.jpg" },
        { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/posho-beans.jpg" },
      ],
      supper: [
        { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-fish.jpg" },
        { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/sweet-potatoes.jpg" },
        { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/cassava-stew.jpg" },
      ],
    },
    friday: {
      breakfast: [
        { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces", image: "/assets/images/meals/chapati-beans.jpg" },
        { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl", image: "/assets/images/meals/porridge.jpg" },
        { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-stew.jpg" },
      ],
      lunch: [
        { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/matooke.jpg" },
        { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-chicken.jpg" },
        { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/posho-beans.jpg" },
      ],
      supper: [
        { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-fish.jpg" },
        { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/sweet-potatoes.jpg" },
        { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/cassava-stew.jpg" },
      ],
    },
    saturday: {
      breakfast: [
        { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces", image: "/assets/images/meals/chapati-beans.jpg" },
        { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl", image: "/assets/images/meals/porridge.jpg" },
        { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-stew.jpg" },
      ],
      lunch: [
        { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/matooke.jpg" },
        { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-chicken.jpg" },
        { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/posho-beans.jpg" },
      ],
      supper: [
        { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-fish.jpg" },
        { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/sweet-potatoes.jpg" },
        { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/cassava-stew.jpg" },
      ],
    },
    sunday: {
      breakfast: [
        { meal: "Chapati with Beans", type: "ready-to-eat", quantity: "2 pieces", image: "/assets/images/meals/chapati-beans.jpg" },
        { meal: "Porridge & Mandazi", type: "ready-to-eat", quantity: "1 bowl", image: "/assets/images/meals/porridge.jpg" },
        { meal: "Rice & Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-stew.jpg" },
      ],
      lunch: [
        { meal: "Matooke & Groundnut Sauce", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/matooke.jpg" },
        { meal: "Rice & Chicken", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-chicken.jpg" },
        { meal: "Posho & Beans", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/posho-beans.jpg" },
      ],
      supper: [
        { meal: "Rice & Fish", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/rice-fish.jpg" },
        { meal: "Sweet Potatoes & Vegetables", type: "ready-to-eat", quantity: "1 plate", image: "/assets/images/meals/sweet-potatoes.jpg" },
        { meal: "Cassava & Meat Stew", type: "ready-to-cook", quantity: "1 plate", image: "/assets/images/meals/cassava-stew.jpg" },
      ],
    },
  };

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
    
    // Trigger Food Algae Box update
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
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight={"bold"}
                      color={ThemeColors.darkColor}
                      marginBottom={"0.75rem"}
                    >
                      Breakfast (6:00 AM - 10:00 AM)
                    </Text>
                    <Stack spacing={2}>
                      {dayMenu.breakfast.map((item, idx) => (
                        <Box
                          key={idx}
                          padding={"0.75rem"}
                          background={"gray.50"}
                          borderRadius={"md"}
                          border={"1px solid"}
                          borderColor={"gray.100"}
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
                                src={item.image || "/assets/images/img5.png"}
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
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Lunch Section */}
                  <Box marginBottom={"1.5rem"}>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight={"bold"}
                      color={ThemeColors.darkColor}
                      marginBottom={"0.75rem"}
                    >
                      Lunch (12:00 PM - 3:00 PM)
                    </Text>
                    <Stack spacing={2}>
                      {dayMenu.lunch.map((item, idx) => (
                        <Box
                          key={idx}
                          padding={"0.75rem"}
                          background={"gray.50"}
                          borderRadius={"md"}
                          border={"1px solid"}
                          borderColor={"gray.100"}
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
                                src={item.image || "/assets/images/img5.png"}
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
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Supper Section */}
                  <Box marginBottom={"1rem"}>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight={"bold"}
                      color={ThemeColors.darkColor}
                      marginBottom={"0.75rem"}
                    >
                      Supper (5:00 PM - 10:00 PM)
                    </Text>
                    <Stack spacing={2}>
                      {dayMenu.supper.map((item, idx) => (
                        <Box
                          key={idx}
                          padding={"0.75rem"}
                          background={"gray.50"}
                          borderRadius={"md"}
                          border={"1px solid"}
                          borderColor={"gray.100"}
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
                                src={item.image || "/assets/images/img5.png"}
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
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
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
