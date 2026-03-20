"use client";

import {
  Box,
  Flex,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Badge,
  IconButton,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

const PRIMARY = "#185f2d";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low", label: "Price: Low → High" },
  { value: "price_high", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
];

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
  });

  const { isOpen: showAdvanced, onToggle: toggleAdvanced } = useDisclosure();
  const searchTimer = useRef(null);

  const update = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange?.(next);
  };

  const handleSearchChange = (val) => {
    setFilters((prev) => ({ ...prev, searchQuery: val }));
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      onFilterChange?.({ ...filters, searchQuery: val });
    }, 350);
  };

  const toggleCategory = (cat) => {
    const id = cat._id || cat.id || cat;
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    update("categories", next);
  };

  const clearFilters = () => {
    const def = {
      searchQuery: "",
      categories: [],
      priceRange: [0, 1000000],
      sortBy: "relevance",
      vendors: [],
      ratings: [],
    };
    setFilters(def);
    onFilterChange?.(def);
  };

  const activeCount =
    filters.categories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ? 1 : 0) +
    (filters.sortBy !== "relevance" ? 1 : 0);

  const hasActiveFilters = activeCount > 0 || filters.searchQuery;

  return (
    <Box w="100%" mb={6}>
      {/* ── Row 1: Search bar ── */}
      <InputGroup size="lg" mb={3}>
        <InputLeftElement pointerEvents="none" h="48px" pl={4}>
          <Search size={18} color="#9ca3af" />
        </InputLeftElement>
        <Input
          h="48px"
          pl="3rem"
          pr={4}
          bg="white"
          borderRadius="xl"
          border="1.5px solid"
          borderColor="gray.200"
          fontSize="sm"
          placeholder="Search products, vendors, categories..."
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          _focus={{ borderColor: PRIMARY, boxShadow: `0 0 0 1px ${PRIMARY}` }}
          _placeholder={{ color: "gray.400" }}
        />
        {filters.searchQuery && (
          <Box
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
          >
            <IconButton
              size="xs"
              icon={<X size={13} />}
              variant="ghost"
              borderRadius="full"
              color="gray.400"
              _hover={{ color: "gray.700", bg: "gray.100" }}
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
            />
          </Box>
        )}
      </InputGroup>

      {/* ── Row 2: Sort + Categories + More Filters ── */}
      <Flex gap={2} align="center" flexWrap="nowrap" overflowX="auto"
        sx={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
        pb={1}
      >
        {/* Sort */}
        <Box flexShrink={0}>
          <Select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value)}
            size="sm"
            h="36px"
            bg="white"
            borderRadius="full"
            border="1.5px solid"
            borderColor={filters.sortBy !== "relevance" ? PRIMARY : "gray.200"}
            color={filters.sortBy !== "relevance" ? PRIMARY : "gray.600"}
            fontWeight="600"
            fontSize="0.8125rem"
            minW="140px"
            maxW="180px"
            cursor="pointer"
            _focus={{ boxShadow: "none", borderColor: PRIMARY }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Box>

        {/* Category pills */}
        {categories.slice(0, 8).map((cat) => {
          const id = cat._id || cat.id || cat;
          const label = cat.name || cat;
          const active = filters.categories.includes(id);
          return (
            <Button
              key={id}
              size="sm"
              h="36px"
              px={4}
              borderRadius="full"
              border="1.5px solid"
              borderColor={active ? PRIMARY : "gray.200"}
              bg={active ? PRIMARY : "white"}
              color={active ? "white" : "gray.600"}
              fontWeight="600"
              fontSize="0.8125rem"
              flexShrink={0}
              onClick={() => toggleCategory(cat)}
              _hover={{ borderColor: PRIMARY, color: active ? "white" : PRIMARY }}
              transition="all 0.15s"
            >
              {label}
            </Button>
          );
        })}

        {/* More filters toggle */}
        <Button
          size="sm"
          h="36px"
          px={4}
          borderRadius="full"
          border="1.5px solid"
          borderColor={showAdvanced || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ? PRIMARY : "gray.200"}
          bg={showAdvanced ? `${PRIMARY}10` : "white"}
          color={showAdvanced ? PRIMARY : "gray.600"}
          fontWeight="600"
          fontSize="0.8125rem"
          flexShrink={0}
          leftIcon={<SlidersHorizontal size={13} />}
          rightIcon={<ChevronDown size={12} style={{ transform: showAdvanced ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
          onClick={toggleAdvanced}
          _hover={{ borderColor: PRIMARY, color: PRIMARY }}
          transition="all 0.15s"
        >
          Filters
          {activeCount > 0 && (
            <Badge
              ml={1.5}
              bg={PRIMARY}
              color="white"
              borderRadius="full"
              fontSize="9px"
              minW="16px"
              h="16px"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              px={1}
            >
              {activeCount}
            </Badge>
          )}
        </Button>

        {/* Clear all */}
        {hasActiveFilters && (
          <Button
            size="sm"
            h="36px"
            px={3}
            borderRadius="full"
            variant="ghost"
            color="gray.400"
            fontSize="0.8125rem"
            fontWeight="600"
            flexShrink={0}
            leftIcon={<X size={12} />}
            onClick={clearFilters}
            _hover={{ color: "red.500", bg: "red.50" }}
          >
            Clear
          </Button>
        )}
      </Flex>

      {/* ── Row 3: Active filter chips ── */}
      {filters.categories.length > 0 && (
        <Flex gap={2} mt={2} flexWrap="wrap">
          {filters.categories.map((id) => {
            const cat = categories.find(
              (c) => (c._id || c.id || c) === id
            );
            const label = cat ? (cat.name || cat) : id;
            return (
              <HStack
                key={id}
                spacing={1}
                px={3}
                h="28px"
                borderRadius="full"
                bg={`${PRIMARY}12`}
                border="1px solid"
                borderColor={`${PRIMARY}30`}
              >
                <Text fontSize="xs" fontWeight="600" color={PRIMARY}>{label}</Text>
                <IconButton
                  size="xs"
                  w="16px"
                  minW="16px"
                  h="16px"
                  icon={<X size={10} />}
                  variant="ghost"
                  color={PRIMARY}
                  borderRadius="full"
                  p={0}
                  _hover={{ bg: `${PRIMARY}20` }}
                  onClick={() => toggleCategory(id)}
                  aria-label={`Remove ${label}`}
                />
              </HStack>
            );
          })}
        </Flex>
      )}

      {/* ── Advanced panel: Price range ── */}
      <Collapse in={showAdvanced} animateOpacity>
        <Box
          mt={3}
          p={5}
          bg="white"
          borderRadius="xl"
          border="1.5px solid"
          borderColor="gray.100"
          boxShadow="0 4px 20px rgba(0,0,0,0.06)"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="sm" fontWeight="700" color="gray.700">Price Range</Text>
            <Text fontSize="xs" fontWeight="600" color={PRIMARY}>
              UGX {filters.priceRange[0].toLocaleString()} — UGX {filters.priceRange[1].toLocaleString()}
            </Text>
          </Flex>
          <RangeSlider
            value={filters.priceRange}
            onChange={(value) => update("priceRange", value)}
            min={0}
            max={1000000}
            step={5000}
          >
            <RangeSliderTrack h="4px" bg="gray.100" borderRadius="full">
              <RangeSliderFilledTrack bg={PRIMARY} />
            </RangeSliderTrack>
            <RangeSliderThumb
              index={0}
              boxSize={5}
              border="2.5px solid"
              borderColor={PRIMARY}
              bg="white"
              boxShadow="0 2px 6px rgba(0,0,0,0.15)"
            />
            <RangeSliderThumb
              index={1}
              boxSize={5}
              border="2.5px solid"
              borderColor={PRIMARY}
              bg="white"
              boxShadow="0 2px 6px rgba(0,0,0,0.15)"
            />
          </RangeSlider>
          <Flex justify="space-between" mt={2}>
            <Text fontSize="xs" color="gray.400">UGX 0</Text>
            <Text fontSize="xs" color="gray.400">UGX 1,000,000</Text>
          </Flex>
        </Box>
      </Collapse>
    </Box>
  );
}
