"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  Link,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineRight } from "react-icons/ai";
import { FaUtensils } from "react-icons/fa";
import Image from "next/image";
import { Virtual, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SwiperStyles.css";
import { API_ORIGIN } from "@config/config";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' fill='%23e2e8f0'%3E%3Crect width='200' height='150' fill='%23f7fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14'%3EMeal%3C/text%3E%3C/svg%3E";

const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  supper: "Supper",
};

const sliderBreakpoints = {
  0: { slidesPerView: 2, spaceBetween: 8 },
  480: { slidesPerView: 2, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 12 },
  768: { slidesPerView: 3, spaceBetween: 14 },
  1024: { slidesPerView: 4, spaceBetween: 16 },
  1280: { slidesPerView: 5, spaceBetween: 18 },
};

export default function MealCalendarSection({ mealType }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  const type = (mealType || "breakfast").toLowerCase();
  const title = MEAL_LABELS[type] || mealType;

  useEffect(() => {
    const base = (API_ORIGIN || "").replace(/\/api\/?$/, "") || "https://yookatale-server.onrender.com";
    const url = `${base}/api/meal-calendar/slots/public?mealType=${type}`;
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const raw = (data?.status === "Success" && Array.isArray(data?.data)) ? data.data : [];
        const filtered = raw.filter(
          (s) => s.prepType === "ready-to-eat" || s.prepType === "ready-to-cook"
        );
        setSlots(filtered);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [type]);

  if (loading) {
    return (
      <Box mb={8} mx={{ base: 2, md: 4, lg: 6 }}>
        <Box
          bgGradient="linear(to-r, green.400, teal.400)"
          py={{ base: 4, md: 5 }}
          px={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
          borderRadius="2xl"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
        >
          <Text as="h2" fontSize={{ base: "1.125rem", md: "1.35rem" }} fontWeight="700" color="white">
            {title}
          </Text>
        </Box>
        <Box mt={4} height="200px" bg="gray.100" borderRadius="lg" />
      </Box>
    );
  }

  if (slots.length === 0) {
    return (
      <Box mb={8} mx={{ base: 2, md: 4, lg: 6 }}>
        <Box
          bgGradient="linear(to-r, green.400, teal.400)"
          py={{ base: 4, md: 5 }}
          px={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
          borderRadius="2xl"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          position="relative"
          overflow="hidden"
        >
          <Flex justify="space-between" align="center" position="relative" zIndex={1}>
            <HStack spacing={{ base: 2, md: 3 }}>
              <Box bg="whiteAlpha.300" p={2} borderRadius="lg" backdropFilter="blur(5px)">
                <Icon as={FaUtensils} color="white" boxSize="24px" />
              </Box>
              <Box>
                <Text as="h2" fontSize={{ base: "1.125rem", md: "1.35rem", lg: "1.5rem" }} fontWeight="700" color="white" textTransform="capitalize" mb={0}>
                  {title}
                </Text>
                <Text as="p" fontSize={{ base: "0.7rem", md: "0.8rem" }} color="whiteAlpha.900" fontWeight="500" mt={1}>
                  No meals yet
                </Text>
              </Box>
            </HStack>
            <Link
              href="/subscription"
              color="white"
              fontWeight="700"
              fontSize={{ base: "xs", md: "sm" }}
              display="flex"
              alignItems="center"
              _hover={{ textDecoration: "none", transform: "scale(1.08)", bg: "whiteAlpha.400" }}
              transition="all 0.3s ease"
              bg="whiteAlpha.300"
              px={{ base: 3, md: 4 }}
              py={{ base: 1.5, md: 2 }}
              borderRadius="full"
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="whiteAlpha.400"
              boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            >
              View meal plans
              <Box as="span" ml="5px"><AiOutlineRight size={16} /></Box>
            </Link>
          </Flex>
        </Box>
      </Box>
    );
  }

  return (
    <Box mb={8} mx={{ base: 2, md: 4, lg: 6 }}>
      <Box
        bgGradient="linear(to-r, green.400, teal.400)"
        py={{ base: 4, md: 5 }}
        px={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
        borderRadius="2xl"
        boxShadow="0 4px 12px rgba(0,0,0,0.15)"
        position="relative"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{ boxShadow: "0 8px 24px rgba(0,0,0,0.2)", transform: "translateY(-4px)" }}
        _before={{
          content: '""',
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          bgGradient: "linear(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "2px",
          bgGradient: "linear(to-r, transparent, rgba(255,255,255,0.5), transparent)",
        }}
      >
        <Flex justify="space-between" align="center" position="relative" zIndex={1}>
          <HStack spacing={{ base: 2, md: 3 }}>
            <Box bg="whiteAlpha.300" p={2} borderRadius="lg" backdropFilter="blur(5px)">
              <Icon as={FaUtensils} color="white" boxSize="24px" w={{ base: "20px", md: "24px" }} h={{ base: "20px", md: "24px" }} />
            </Box>
            <Box>
              <Text as="h2" fontSize={{ base: "1.125rem", md: "1.35rem", lg: "1.5rem" }} fontWeight="700" color="white" textTransform="capitalize" mb={0} textShadow="0 2px 8px rgba(0,0,0,0.3)">
                {title}
              </Text>
              <Text as="p" fontSize={{ base: "0.7rem", md: "0.8rem" }} color="whiteAlpha.900" fontWeight="500" mt={1}>
                {slots.length} {slots.length === 1 ? "meal" : "meals"} available
              </Text>
            </Box>
          </HStack>
          <Link
            href="/subscription"
            color="white"
            fontWeight="700"
            fontSize={{ base: "xs", md: "sm" }}
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: "none", transform: "scale(1.08)", bg: "whiteAlpha.400" }}
            transition="all 0.3s ease"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            bg="whiteAlpha.300"
            px={{ base: 3, md: 4 }}
            py={{ base: 1.5, md: 2 }}
            borderRadius="full"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.400"
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          >
            See All
            <Box as="span" transition="transform 0.3s ease" transform={hovered ? "translateX(5px)" : "translateX(0)"} ml="5px">
              <AiOutlineRight size={16} />
            </Box>
          </Link>
        </Flex>
      </Box>
      <Box mt={4} position="relative">
        <Swiper
          modules={[Virtual, Navigation, Pagination]}
          navigation={slots.length > 3}
          pagination={{ clickable: true }}
          parallax
          grabCursor
          breakpoints={sliderBreakpoints}
          style={{ backgroundColor: "transparent", width: "100%" }}
        >
          {slots.map((slot, index) => (
            <SwiperSlide
              key={slot._id || `${slot.day}-${slot.prepType}-${index}`}
              virtualIndex={index}
              style={{ borderRadius: 8, height: "100%", backgroundColor: "transparent", padding: "6px 2px", display: "flex" }}
            >
              <Link
                href="/subscription"
                _hover={{ textDecoration: "none" }}
                display="block"
                w="100%"
                h="100%"
              >
                <Box
                  width="100%"
                  height="100%"
                  borderRadius="lg"
                  bg="white"
                  boxShadow="md"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
                >
                  <Box position="relative" width="100%" paddingTop="75%">
                    <Image
                      src={slot.imageUrl || PLACEHOLDER_IMAGE}
                      alt={slot.mealName || "Meal"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 20vw"
                      unoptimized={!(slot.imageUrl || "").startsWith("http")}
                    />
                  </Box>
                  <Box p={2}>
                    <Text fontSize="xs" fontWeight="600" noOfLines={2} color="gray.800">
                      {slot.mealName || "Meal"}
                    </Text>
                    <Badge colorScheme={slot.prepType === "ready-to-eat" ? "green" : "blue"} fontSize="2xs" mt={1}>
                      {slot.prepType === "ready-to-eat" ? "Ready to eat" : "Ready to cook"}
                    </Badge>
                  </Box>
                </Box>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
