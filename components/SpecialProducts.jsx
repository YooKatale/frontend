"use client";

import {
  Box,
  Flex,
  Link,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { FaFire, FaStar, FaGift, FaThumbsUp, FaCompass, FaTag } from "react-icons/fa";
import LoaderSkeleton from "./LoaderSkeleton";
import ProductCard from "./ProductCard";
import React from "react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SwiperStyles.css";
import SwipperComponent from "./Swiper";

// Unique professional icon per category; Syne for section titles
const categoryStyles = {
  topdeals: { icon: FaFire, label: "Hot Deals", iconColor: "orange.500" },
  popular: { icon: FaStar, label: "Popular", iconColor: "yellow.500" },
  discover: { icon: FaCompass, label: "Discover", iconColor: "blue.500" },
  promotional: { icon: FaGift, label: "Promotional", iconColor: "purple.500" },
  recommended: { icon: FaThumbsUp, label: "Recommended", iconColor: "green.500" },
  default: { icon: FaTag, label: null, iconColor: "gray.600" },
};

const SpecialProducts = ({ Products, userInfo, category, text, headerBg }) => {
  const [hovered, setHovered] = useState(false);
  const style = categoryStyles[category?.toLowerCase()] || { ...categoryStyles.default, label: text };
  const displayText = text?.toLowerCase() === "roughages" ? "Supplements" :
                     text?.toLowerCase() === "bulk" ? style.label : (style.label || text);

  const isJumiaStyle = !!headerBg;

  return (
    <Box mb={{ base: 4, md: 5 }} mx={{ base: 0, md: 2 }}>
      {/* Jumia-style: colored header bar + white product area */}
      {isJumiaStyle ? (
        <>
          <Flex
            justify="space-between"
            align="center"
            py={{ base: 3, md: 4 }}
            px={{ base: 5, md: 6 }}
            bg={headerBg}
            borderRadius="none"
          >
            <HStack spacing={2}>
              <Icon as={style.icon} color="white" boxSize={{ base: "18px", md: "20px" }} />
              <Text
                as="h2"
                fontFamily="var(--font-syne), Syne, sans-serif"
                fontSize={{ base: "1rem", md: "1.125rem" }}
                fontWeight="800"
                color="white"
                textTransform="capitalize"
                mb={0}
                letterSpacing="-0.02em"
              >
                {displayText}
              </Text>
            </HStack>
            <Link
              href={`/search?q=${encodeURIComponent(category)}`}
              display="flex"
              alignItems="center"
              gap={1}
              color="white"
              fontWeight="700"
              fontSize={{ base: "0.8125rem", md: "0.875rem" }}
              _hover={{ textDecoration: "none", opacity: 0.9 }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              See all
              <Box as="span" display="inline-flex" transform={hovered ? "translateX(2px)" : "none"} transition="transform 0.2s">
                <AiOutlineRight size={14} />
              </Box>
            </Link>
          </Flex>
          <Box bg="white" py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }} position="relative">
            <SwipperComponent Products={Products} userInfo={userInfo} />
          </Box>
        </>
      ) : (
        <>
          <Flex justify="space-between" align="center" py={{ base: 2, md: 3 }} px={0}>
            <HStack spacing={3}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w={{ base: "40px", md: "44px" }}
                h={{ base: "40px", md: "44px" }}
                borderRadius="12px"
                bg="gray.50"
                color={style.iconColor}
              >
                <Icon as={style.icon} boxSize={{ base: "20px", md: "22px" }} />
              </Box>
              <Text
                as="h2"
                fontFamily="var(--font-syne), Syne, sans-serif"
                fontSize={{ base: "1.35rem", md: "1.5rem", lg: "1.625rem" }}
                fontWeight="800"
                color="var(--dark)"
                textTransform="capitalize"
                mb={0}
                letterSpacing="-0.03em"
                lineHeight="1.2"
              >
                {displayText}
              </Text>
            </HStack>
            <Link
              href={`/search?q=${encodeURIComponent(category)}`}
              display="flex"
              alignItems="center"
              gap={1}
              color="orange.500"
              fontWeight="700"
              fontSize={{ base: "0.9375rem", md: "1rem" }}
              fontFamily="var(--font-syne), Syne, sans-serif"
              transition="all 0.2s"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              _hover={{ textDecoration: "none", color: "orange.600" }}
            >
              See all
              <Box as="span" display="inline-flex" transform={hovered ? "translateX(2px)" : "none"} transition="transform 0.2s">
                <AiOutlineRight size={16} />
              </Box>
            </Link>
          </Flex>
          <Box mt={3} position="relative">
            <SwipperComponent Products={Products} userInfo={userInfo} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default SpecialProducts;

