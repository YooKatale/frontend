"use client";

import {
  Badge,
  Box,
  Flex,
  Grid,
  Link,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { FaFire, FaStar, FaTags, FaGift } from "react-icons/fa";
import LoaderSkeleton from "./LoaderSkeleton";
import ProductCard from "./ProductCard";
import React from "react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SwiperStyles.css";
import SwipperComponent from "./Swiper";

const SpecialProducts = ({ Products, userInfo, category, text }) => {
  const [hovered, setHovered] = useState(false);
  
  // Map categories to icons and colors
  const categoryStyles = {
    topdeals: { icon: FaFire, color: 'red.500', bgGradient: 'linear(to-r, red.400, orange.400)', label: 'Hot Deals' },
    popular: { icon: FaStar, color: 'yellow.500', bgGradient: 'linear(to-r, orange.400, yellow.400)', label: 'Popular' },
    discover: { icon: FaTags, color: 'blue.500', bgGradient: 'linear(to-r, blue.400, cyan.400)', label: 'Discover' },
    promotional: { icon: FaGift, color: 'purple.500', bgGradient: 'linear(to-r, purple.400, pink.400)', label: 'Promotional' },
    recommended: { icon: FaStar, color: 'green.500', bgGradient: 'linear(to-r, green.400, teal.400)', label: 'Recommended' },
    default: { icon: FaTags, color: 'gray.500', bgGradient: 'linear(to-r, gray.400, gray.500)', label: text }
  };

  const style = categoryStyles[category?.toLowerCase()] || categoryStyles.default;
  const displayText = text.toLowerCase() === "roughages" ? "Supplements" : 
                     text.toLowerCase() === "bulk" ? style.label :
                     text;

  return (
    <Box mb={6}>
      <Box
        bgGradient={style.bgGradient}
        py={3}
        px={{ base: "1rem", md: "2rem" }}
        borderRadius="lg"
        boxShadow="md"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: 'linear(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      >
        <Flex justify="space-between" align="center" position="relative" zIndex={1}>
          <HStack spacing={2}>
            <Icon as={style.icon} color="white" boxSize={{ base: 4, md: 5 }} />
            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              fontWeight="700"
              color="white"
              textTransform="capitalize"
              mb={0}
              textShadow="0 2px 4px rgba(0,0,0,0.2)"
            >
              {displayText} Products
            </Text>
            {Products?.length > 0 && (
              <Badge
                colorScheme="whiteAlpha"
                fontSize={{ base: "xs", md: "sm" }}
                px={2}
                py={1}
                borderRadius="full"
                bg="whiteAlpha.300"
                color="white"
              >
                {Products.length}
              </Badge>
            )}
          </HStack>
          <Link
            href={`/search?q=${category}`}
            color="white"
            fontWeight="700"
            fontSize={{ base: "sm", md: "md" }}
            display="flex"
            alignItems="center"
            _hover={{ 
              textDecoration: 'none',
              transform: 'scale(1.05)',
            }}
            transition="all 0.2s"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            bg="whiteAlpha.200"
            px={3}
            py={1.5}
            borderRadius="full"
            backdropFilter="blur(10px)"
          >
            See All
            <Box
              as="span"
              transition="transform 0.3s ease"
              transform={hovered ? "translateX(5px)" : "translateX(0)"}
              ml="5px"
            >
              <AiOutlineRight size={16} />
            </Box>
          </Link>
        </Flex>
      </Box>
      <Box mt={4}>
        <SwipperComponent Products={Products} userInfo={userInfo} />
      </Box>
    </Box>
  );
};

export default SpecialProducts;

