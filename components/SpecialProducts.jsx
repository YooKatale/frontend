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
    <Box mb={8}>
      <Box
        bgGradient={style.bgGradient}
        py={{ base: 3, md: 4 }}
        px={{ base: "1rem", md: "2rem" }}
        borderRadius="xl"
        boxShadow="lg"
        position="relative"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "xl",
          transform: "translateY(-2px)"
        }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: 'linear(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          bgGradient: 'linear(to-r, transparent, rgba(255,255,255,0.5), transparent)',
        }}
      >
        <Flex justify="space-between" align="center" position="relative" zIndex={1}>
          <HStack spacing={{ base: 2, md: 3 }}>
            <Box
              bg="whiteAlpha.300"
              p={2}
              borderRadius="lg"
              backdropFilter="blur(5px)"
            >
              <Icon 
                as={style.icon} 
                color="white" 
                boxSize="24px"
                w={{ base: "20px", md: "24px" }}
                h={{ base: "20px", md: "24px" }}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
              />
            </Box>
            <Box>
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="800"
                color="white"
                textTransform="capitalize"
                mb={0}
                textShadow="0 2px 8px rgba(0,0,0,0.3)"
                letterSpacing="tight"
              >
                {displayText}
              </Text>
              {Products?.length > 0 && (
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="whiteAlpha.900"
                  fontWeight="600"
                  mt={-1}
                >
                  {Products.length} {Products.length === 1 ? 'Product' : 'Products'} Available
                </Text>
              )}
            </Box>
          </HStack>
          <Link
            href={`/search?q=${category}`}
            color="white"
            fontWeight="700"
            fontSize={{ base: "xs", md: "sm" }}
            display="flex"
            alignItems="center"
            _hover={{ 
              textDecoration: 'none',
              transform: 'scale(1.08)',
              bg: 'whiteAlpha.400'
            }}
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
      <Box mt={4} position="relative">
        <SwipperComponent Products={Products} userInfo={userInfo} />
      </Box>
    </Box>
  );
};

export default SpecialProducts;

