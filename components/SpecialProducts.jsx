"use client";

import {
  Badge,
  border,
  Box,
  Flex,
  Grid,
  GridItem,
  Link,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import LoaderSkeleton from "./LoaderSkeleton";
import ProductCard from "./ProductCard";
import { Card } from "antd";
import React, { useRef } from "react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SwiperStyles.css";
import SwipperComponent from "./Swiper";

const SpecialProducts = ({ Products, userInfo, category, text }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Box>
      <Box
        bg="orange.200"
        py={2}
        px={{ base: "1rem", md: "2rem" }}
        borderRadius="md"
        boxShadow="sm"
      >
        <Flex justify="space-between" align="center">
          <Text
            fontSize="lg"
            fontWeight="500"
            color="black"
            textTransform="capitalize" 
            mb={0}
            py={2}
          >
            {text.toLowerCase() === "roughages" ? "Supplements" : text} Products
          </Text>
          <Link
            href={`/search?q=${category}`}
            color="black"
            fontWeight="600"
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: 'none' }} // Disable underline on hover
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            See All
            <Box
              as="span"
              transition="transform 0.3s ease"
              transform={hovered ? "translateX(5px)" : "translateX(0)"}
              ml="5px" // Small margin between text and arrow
            >
              <AiOutlineRight size={20} />
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

