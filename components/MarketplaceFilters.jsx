"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Button,
  Input,
  Select,
  Badge,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { Search, X, Filter } from "lucide-react";
import { useState } from "react";

/**
 * Advanced Marketplace Filters Component (Like Ujiji)
 * Provides comprehensive filtering options for products
 */
export default function MarketplaceFilters({
  categories = [],
  onFilterChange,
  initialFilters = {},
}) {
  const [filters, setFilters] = useState({
    searchQuery: initialFilters.searchQuery || "",
    categories: initialFilters.categories || [],
    priceRange: initialFilters.priceRange || [0, 1000000],
    sortBy: initialFilters.sortBy || "relevance",
    vendors: initialFilters.vendors || [],
    ratings: initialFilters.ratings || [],
    ...initialFilters,
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const defaultFilters = {
      searchQuery: "",
      categories: [],
      priceRange: [0, 1000000],
      sortBy: "relevance",
      vendors: [],
      ratings: [],
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  const activeFilterCount = [
    filters.categories.length,
    filters.vendors.length,
    filters.ratings.length,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000,
  ].filter(Boolean).length;

  return (
    <Box w="100%" mb={6}>
      {/* Search and Filter Toggle */}
      <Flex gap={4} mb={4} direction={{ base: "column", md: "row" }}>
        <Box flex={1} position="relative">
          <Input
            placeholder="Search products, vendors, categories..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            pl={10}
            size="lg"
            borderRadius="lg"
          />
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.500"
          >
            <Search size={20} />
          </Box>
        </Box>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<Filter size={20} />}
          variant={showFilters ? "solid" : "outline"}
          colorScheme="green"
          size="lg"
        >
          Filters
          {activeFilterCount > 0 && (
            <Badge ml={2} colorScheme="green" borderRadius="full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </Flex>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Box
          borderWidth={1}
          borderColor="gray.200"
          borderRadius="lg"
          p={6}
          bg="white"
          boxShadow="sm"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Filter Products</Heading>
            <HStack>
              {activeFilterCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearFilters}
                  leftIcon={<X size={16} />}
                >
                  Clear All
                </Button>
              )}
              <IconButton
                icon={<X size={20} />}
                onClick={() => setShowFilters(false)}
                variant="ghost"
                size="sm"
              />
            </HStack>
          </Flex>

          <VStack spacing={6} align="stretch">
            {/* Sort By */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Sort By
              </Text>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                borderRadius="md"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </Select>
            </Box>

            {/* Categories */}
            {categories.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Categories
                </Text>
                <CheckboxGroup
                  value={filters.categories}
                  onChange={(value) => handleFilterChange("categories", value)}
                >
                  <VStack align="start" spacing={2}>
                    {categories.map((category) => (
                      <Checkbox
                        key={category._id || category.id || category}
                        value={category._id || category.id || category}
                      >
                        {category.name || category}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </Box>
            )}

            {/* Price Range */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Price Range: UGX {filters.priceRange[0].toLocaleString()} - UGX{" "}
                {filters.priceRange[1].toLocaleString()}
              </Text>
              <RangeSlider
                value={filters.priceRange}
                onChange={(value) => handleFilterChange("priceRange", value)}
                min={0}
                max={1000000}
                step={1000}
                colorScheme="green"
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
              <HStack justify="space-between" mt={2}>
                <Input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      parseInt(e.target.value) || 0,
                      filters.priceRange[1],
                    ])
                  }
                  size="sm"
                  w="100px"
                />
                <Input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      filters.priceRange[0],
                      parseInt(e.target.value) || 1000000,
                    ])
                  }
                  size="sm"
                  w="100px"
                />
              </HStack>
            </Box>

            {/* Ratings */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Minimum Rating
              </Text>
              <CheckboxGroup
                value={filters.ratings}
                onChange={(value) => handleFilterChange("ratings", value)}
              >
                <HStack spacing={4}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Checkbox key={rating} value={rating.toString()}>
                      {rating}+ ⭐
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </Box>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
