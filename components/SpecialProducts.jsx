"use client";

import { Badge, Box, Flex, Grid, GridItem, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import LoaderSkeleton from "./LoaderSkeleton";
import ProductCard from "./ProductCard";

const SpecialProducts = ({ Products, userInfo, category, text }) => {
  const [hovered, setHovered] = useState(false); // To track hover state

  return (
    <Box sx={{ py: "2rem" }}>
      {/* Light Orange Heading Section */}
      <Box bg="orange.200" py="1rem" px="2rem" borderRadius="md" mb="1.5rem">
        <Flex justify="space-between" align="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="black"
            textTransform="capitalize"  // Ensure text is always capitalized
          >
            {text.toLowerCase() === "roughages" ? "Supplements" : text} Products
          </Text>
          <Link
            href={`/search?q=${category}`}
            color="black"
            fontWeight="bold"
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
              <AiOutlineRight />
            </Box>
          </Link>
        </Flex>
      </Box>

      {/* Product Grid */}
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        {Products?.length > 0
          ? Products.map((product, index) => (
              <GridItem key={index}>
                <Box
                  border="1px solid #eaeaea"
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                >
                  {/* Discount Badge */}
                  {product.discount && (
                    <Badge
                      position="absolute"
                      top="10px"
                      right="10px"
                      colorScheme="red"
                      fontSize="1rem"
                    >
                      -{product.discount}%
                    </Badge>
                  )}

                  {/* Product Card */}
                  <ProductCard product={product} userInfo={userInfo} />

                  {/* Product Details */}
                  <Box p="1rem" textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">
                      UGX {product.price}
                    </Text>
                    {product.oldPrice && (
                      <Text as="s" color="gray.500" fontSize="md">
                        UGX {product.oldPrice}
                      </Text>
                    )}
                  </Box>
                </Box>
              </GridItem>
            ))
          : [1, 2, 3, 4, 5].map((item) => <LoaderSkeleton key={item} />)}
      </Grid>
    </Box>
  );
};

export default SpecialProducts;
