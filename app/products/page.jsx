"use client";

import {
  Box,
  Checkbox,
  Flex,
  FormLabel,
  Grid,
  Heading,
  Text,
  useToast,
  Button,
  HStack,
  VStack,
  Divider,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { CategoriesJson, ThemeColors } from "@constants/constants";
import { FaArrowDown, FaArrowUp, FaFilter, FaTimes } from "react-icons/fa";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useProductsFilterGetMutation,
  useProductsGetMutation,
  useProductsCategoriesGetMutation,
} from "@slices/productsApiSlice";

import ProductCard from "@components/ProductCard";
import LoaderSkeleton from "@components/LoaderSkeleton";

const Products = () => {
  const [ProductsTitle, setProductsTitle] = useState("All Products");
  const [Products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const [fetchProducts] = useProductsGetMutation();
  const [fetchProductsFilter] = useProductsFilterGetMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();

  const chakraToast = useToast();

  const handleDataFetch = async () => {
    try {
      setIsLoading(true);
      const res = await fetchProducts().unwrap();

      if (res?.status && res?.status == "Success") {
        setProducts(res?.data);
        setProductsTitle("All Products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      chakraToast({
        title: "Error",
        description: "Failed to load products",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoriesFetch = async () => {
    try {
      const res = await fetchCategories().unwrap();
      if (res?.success && res?.categories) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // fetch product categories
  useEffect(() => {
    handleDataFetch();
    handleCategoriesFetch();
  }, []);

  // filter functions
  const handleFilterFetch = async (param) => {
    try {
      setIsLoading(true);
      const res = await fetchProductsFilter(param).unwrap();

      if (res?.status && res?.status == "Success") {
        setProducts(res?.data?.Products ? res?.data?.Products : res?.data);
        setProductsTitle(
          res?.data?.title ? res?.data?.title : "Filter results"
        );
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err?.message?.error || err?.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    const checkboxes = [...document.querySelectorAll("input.chakra-checkbox__input")];
    checkboxes.forEach(checkbox => checkbox.checked = false);
    handleDataFetch();
  };

  const handleFilterApply = () => {
    // productsFilter.push(filter);
    const CheckedBoxesValues = [];

    const Checkboxes = [
      ...document.querySelectorAll("input.chakra-checkbox__input"),
    ];

    for (const checkbox of Checkboxes) {
      if (checkbox.checked) {
        CheckedBoxesValues.push(checkbox.value);
      }
    }

    handleFilterFetch(JSON.stringify(CheckedBoxesValues));
  };

  return (
    <>
      <Box bg="gray.50" minH="100vh">
        <Box 
          maxWidth="1400px" 
          margin="0 auto" 
          padding={{ base: "1rem", md: "2rem" }}
        >
          {/* Page Header */}
          <Box mb={6} bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <Heading 
              as="h1" 
              size="xl" 
              mb={2}
              bgGradient="linear(to-r, green.400, green.600)"
              bgClip="text"
            >
              All Categories
            </Heading>
            <Text color="gray.600" fontSize="md">
              Browse our wide selection of products across all categories
            </Text>
          </Box>

          {/* Mobile Filter Toggle */}
          <Box display={{ base: "block", xl: "none" }} mb={4}>
            <Button
              leftIcon={<FaFilter />}
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              colorScheme="green"
              width="100%"
              size="lg"
            >
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>

          <Flex direction={{ base: "column", md: "column", xl: "row" }} gap={6}>
            {/* Filters Sidebar */}
            <Box
              width={{ base: "100%", md: "100%", xl: "280px" }}
              display={{ base: showMobileFilters ? "block" : "none", xl: "block" }}
            >
              <Box
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                p={5}
                position="sticky"
                top="20px"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <HStack>
                    <Icon as={FaFilter} color="green.500" />
                    <Heading as="h2" size="md" fontWeight="700">
                      Filters
                    </Heading>
                  </HStack>
                  {selectedFilters.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={clearFilters}
                      leftIcon={<FaTimes />}
                    >
                      Clear
                    </Button>
                  )}
                </Flex>
                
                <Divider mb={4} />

                {/* Price Filter */}
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontSize="md" fontWeight="600" mb={3}>
                      Sort by Price
                    </Text>
                    <VStack align="stretch" spacing={2}>
                      <Box
                        p={3}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        _hover={{ bg: "gray.50", borderColor: "green.300" }}
                        transition="all 0.2s"
                      >
                        <Checkbox
                          name="filterByLowPrice"
                          id="filterByLowPrice"
                          value="lowest"
                          onChange={(e) => handleFilterApply(e.target.value)}
                          colorScheme="green"
                          size="lg"
                        >
                          <HStack spacing={2}>
                            <Icon as={FaArrowDown} color="green.500" />
                            <Text fontSize="sm" fontWeight="500">
                              Price: Low to High
                            </Text>
                          </HStack>
                        </Checkbox>
                      </Box>
                      
                      <Box
                        p={3}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        _hover={{ bg: "gray.50", borderColor: "green.300" }}
                        transition="all 0.2s"
                      >
                        <Checkbox
                          name="filterByHighPrice"
                          id="filterByHighPrice"
                          value="highest"
                          onChange={(e) => handleFilterApply(e.target.value)}
                          colorScheme="green"
                          size="lg"
                        >
                          <HStack spacing={2}>
                            <Icon as={FaArrowUp} color="red.500" />
                            <Text fontSize="sm" fontWeight="500">
                              Price: High to Low
                            </Text>
                          </HStack>
                        </Checkbox>
                      </Box>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Category Filter */}
                  <Box>
                    <Text fontSize="md" fontWeight="600" mb={3}>
                      Categories
                    </Text>
                    <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto">
                      {categories.length > 0 ? (
                        categories.map((category, index) => (
                          <Box
                            key={index}
                            p={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.50" }}
                            transition="all 0.2s"
                          >
                            <Checkbox
                              name="category"
                              id={`category-${category._id}`}
                              value={category.name.toLowerCase().replace(/\s+/g, '-')}
                              onChange={(e) => handleFilterApply(e.target.value)}
                              colorScheme="green"
                            >
                              <Text fontSize="sm" fontWeight="500" textTransform="capitalize">
                                {category.name}
                              </Text>
                            </Checkbox>
                          </Box>
                        ))
                      ) : (
                        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                          Loading categories...
                        </Text>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </Box>
            {/* Products Grid */}
            <Box flex="1">
              <Box bg="white" borderRadius="lg" boxShadow="sm" p={5}>
                <Flex justify="space-between" align="center" mb={5}>
                  <VStack align="start" spacing={1}>
                    <Heading as="h2" size="lg" fontWeight="700">
                      {ProductsTitle}
                    </Heading>
                    {Products?.length > 0 && (
                      <Text fontSize="sm" color="gray.600">
                        {Products.length} product{Products.length !== 1 ? 's' : ''} found
                      </Text>
                    )}
                  </VStack>
                </Flex>

                {isLoading ? (
                  <Grid
                    gridTemplateColumns={{
                      base: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    }}
                    gap={4}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <LoaderSkeleton key={item} />
                    ))}
                  </Grid>
                ) : Products?.length > 0 ? (
                  <Grid
                    gridTemplateColumns={{
                      base: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    }}
                    gap={4}
                  >
                    {Products.map((product, index) => (
                      <ProductCard
                        product={product}
                        key={index}
                        userInfo={userInfo}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box textAlign="center" py={20}>
                    <Text fontSize="3xl" mb={2}>🛒</Text>
                    <Heading as="h3" size="md" color="gray.600" mb={2}>
                      No products found
                    </Heading>
                    <Text color="gray.500" mb={4}>
                      Try adjusting your filters or browse our subscription plans for curated meals.
                    </Text>
                    <Flex justify="center" gap={3} wrap="wrap">
                      {selectedFilters.length > 0 && (
                        <Button colorScheme="green" onClick={clearFilters}>
                          Clear All Filters
                        </Button>
                      )}
                      <Button as={Link} href="/subscription" colorScheme="green" variant="outline">
                        View Subscription Plans
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Products;
