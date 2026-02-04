"use client";

import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useProductsGetMutation,
  useProductsCategoriesGetMutation,
  useProductsFilterGetMutation,
  useSearchMutation,
} from "@slices/productsApiSlice";
import ProductCard from "@components/ProductCard";
import MarketplaceFilters from "@components/MarketplaceFilters";
import VendorCard from "@components/VendorCard";
import LoaderSkeleton from "@components/LoaderSkeleton";
import { motion } from "framer-motion";

/**
 * Enhanced Marketplace Page (Like Ujiji)
 * Features:
 * - Advanced search and filtering
 * - Category browsing
 * - Vendor/store listings
 * - Product grid with sorting
 */
export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchQuery: "",
    categories: [],
    priceRange: [0, 1000000],
    sortBy: "relevance",
    vendors: [],
    ratings: [],
  });

  const { userInfo } = useSelector((state) => state.auth);
  const chakraToast = useToast();

  const [fetchProducts] = useProductsGetMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();
  const [fetchFiltered] = useProductsFilterGetMutation();
  const [searchProducts] = useSearchMutation();

  // Fetch initial data
  useEffect(() => {
    handleDataFetch();
    handleCategoriesFetch();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (filters.searchQuery || filters.categories.length > 0) {
      handleFilteredFetch();
    } else {
      handleDataFetch();
    }
  }, [filters]);

  const handleDataFetch = async () => {
    try {
      setIsLoading(true);
      const res = await fetchProducts().unwrap();
      if (res?.status === "Success") {
        setProducts(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      chakraToast({
        title: "Error",
        description: "Failed to load products",
        status: "error",
        duration: 5000,
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
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilteredFetch = async () => {
    try {
      setIsLoading(true);
      let res;

      if (filters.searchQuery) {
        res = await searchProducts(filters.searchQuery).unwrap();
      } else if (filters.categories.length > 0) {
        res = await fetchFiltered(filters.categories.join(",")).unwrap();
      } else {
        res = await fetchProducts().unwrap();
      }

      if (res?.status === "Success" || res?.data) {
        let filteredProducts = res?.data || res?.products || [];

        // Apply price filter
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.price >= filters.priceRange[0] &&
              product.price <= filters.priceRange[1]
          );
        }

        // Apply sorting
        filteredProducts = sortProducts(filteredProducts, filters.sortBy);

        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortProducts = (productsList, sortBy) => {
    const sorted = [...productsList];
    switch (sortBy) {
      case "price_low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price_high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case "popular":
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "rating":
        return sorted.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
      default:
        return sorted;
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
        {/* Header */}
        <VStack align="start" mb={8} spacing={2}>
          <Heading size="2xl" color="green.700">
            Marketplace
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Discover amazing products from verified vendors
          </Text>
        </VStack>

        {/* Filters */}
        <MarketplaceFilters
          categories={categories}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />

        {/* Results Count */}
        <Flex justify="space-between" align="center" mb={6}>
          <Text color="gray.600" fontSize="sm">
            {isLoading
              ? "Loading..."
              : `Found ${products.length} product${products.length !== 1 ? "s" : ""}`}
          </Text>
        </Flex>

        {/* Products Grid */}
        {isLoading ? (
          <LoaderSkeleton />
        ) : products.length > 0 ? (
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} userInfo={userInfo} />
              </motion.div>
            ))}
          </Grid>
        ) : (
          <Box
            textAlign="center"
            py={20}
            bg="white"
            borderRadius="lg"
            borderWidth={1}
            borderColor="gray.200"
          >
            <Text fontSize="xl" color="gray.500" mb={2}>
              No products found
            </Text>
            <Text color="gray.400" mb={4}>
              Try adjusting your filters or explore our subscription plans for curated meals.
            </Text>
            <Button as={Link} href="/subscription" colorScheme="green" variant="outline" size="md">
              View Subscription Plans
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
