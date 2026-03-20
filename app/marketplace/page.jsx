"use client";

import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  Flex,
  HStack,
  Skeleton,
  SimpleGrid,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@slices/authSlice";
import {
  useProductsGetMutation,
  useProductsCategoriesGetMutation,
  useProductsFilterGetMutation,
  useSearchMutation,
} from "@slices/productsApiSlice";
import { DB_URL } from "@config/config";
import ProductCard from "@components/ProductCard";
import MarketplaceFilters from "@components/MarketplaceFilters";
import { motion } from "framer-motion";
import { FormatCurr } from "@utils/utils";
import { ShoppingBag, Store } from "lucide-react";

const PRIMARY = "#185f2d";

const MotionBox = motion(Box);

function ProductSkeleton() {
  return (
    <Box bg="white" borderRadius="xl" overflow="hidden" border="1px solid" borderColor="gray.100">
      <Skeleton h="160px" />
      <Box p={3}>
        <Skeleton h="14px" mb={2} />
        <Skeleton h="14px" w="60%" mb={3} />
        <Skeleton h="32px" borderRadius="lg" />
      </Box>
    </Box>
  );
}

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [sellerListings, setSellerListings] = useState([]);
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

  const { userInfo } = useAuth();

  const [fetchProducts] = useProductsGetMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();
  const [fetchFiltered] = useProductsFilterGetMutation();
  const [searchProducts] = useSearchMutation();

  const fetchSellerListings = async () => {
    try {
      const base = (DB_URL || "").replace(/\/api\/?$/, "") || "";
      const res = await fetch(`${base}/api/listings/public`, { credentials: "include" });
      const json = await res.json();
      if (json?.status === "Success" && Array.isArray(json.data)) setSellerListings(json.data);
    } catch {}
  };

  useEffect(() => {
    handleDataFetch();
    handleCategoriesFetch();
    fetchSellerListings();
  }, []);

  useEffect(() => {
    if (filters.searchQuery || filters.categories.length > 0) {
      handleFilteredFetch();
    } else {
      handleDataFetch();
    }
  }, [filters]);

  const handleDataFetch = async () => {
    setIsLoading(true);
    try {
      const res = await fetchProducts().unwrap();
      if (res?.status === "Success") setProducts(res?.data || []);
    } catch {}
    setIsLoading(false);
  };

  const handleCategoriesFetch = async () => {
    try {
      const res = await fetchCategories().unwrap();
      if (res?.success && res?.categories) setCategories(res.categories);
    } catch {}
  };

  const sortProducts = (list, sortBy) => {
    const s = [...list];
    if (sortBy === "price_low") return s.sort((a, b) => a.price - b.price);
    if (sortBy === "price_high") return s.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") return s.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (sortBy === "popular") return s.sort((a, b) => (b.views || 0) - (a.views || 0));
    if (sortBy === "rating") return s.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return s;
  };

  const handleFilteredFetch = async () => {
    setIsLoading(true);
    try {
      let res;
      if (filters.searchQuery) {
        res = await searchProducts(filters.searchQuery).unwrap();
      } else if (filters.categories.length > 0) {
        res = await fetchFiltered(filters.categories.join(",")).unwrap();
      } else {
        res = await fetchProducts().unwrap();
      }
      if (res?.status === "Success" || res?.data) {
        let list = res?.data || res?.products || [];
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
          list = list.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
        }
        setProducts(sortProducts(list, filters.sortBy));
      }
    } catch {}
    setIsLoading(false);
  };

  const totalCount = products.length + sellerListings.length;

  return (
    <Box bg="#f7f8f6" minH="100vh">
      {/* Hero strip */}
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
        px={{ base: 4, md: 6, lg: 8 }}
        py={{ base: 5, md: 6 }}
      >
        <Box maxW="1400px" mx="auto">
          <Flex justify="space-between" align="flex-end" flexWrap="wrap" gap={3} mb={5}>
            <Box>
              <Heading
                size={{ base: "lg", md: "xl" }}
                fontWeight="800"
                color="gray.800"
                lineHeight="shorter"
              >
                Marketplace
              </Heading>
              <Text color="gray.500" fontSize="sm" mt={1}>
                {isLoading
                  ? "Loading products..."
                  : `${totalCount.toLocaleString()} item${totalCount !== 1 ? "s" : ""} available`}
              </Text>
            </Box>
            {!isLoading && totalCount > 0 && (
              <HStack spacing={4}>
                <HStack spacing={1.5}>
                  <ShoppingBag size={14} color="#9ca3af" />
                  <Text fontSize="xs" color="gray.400" fontWeight="600">{products.length} products</Text>
                </HStack>
                <HStack spacing={1.5}>
                  <Store size={14} color="#9ca3af" />
                  <Text fontSize="xs" color="gray.400" fontWeight="600">{sellerListings.length} seller listings</Text>
                </HStack>
              </HStack>
            )}
          </Flex>

          {/* Filters */}
          <MarketplaceFilters
            categories={categories}
            onFilterChange={setFilters}
            initialFilters={filters}
          />
        </Box>
      </Box>

      {/* Product grid */}
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 5, md: 8 }}>
        {isLoading ? (
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
            {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
          </SimpleGrid>
        ) : totalCount === 0 ? (
          <Box
            textAlign="center"
            py={20}
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="0 2px 8px rgba(0,0,0,0.04)"
          >
            <Box
              w={16} h={16} borderRadius="2xl" bg="gray.50"
              display="flex" alignItems="center" justifyContent="center"
              mx="auto" mb={4}
            >
              <ShoppingBag size={28} color="#CBD5E0" />
            </Box>
            <Text fontSize="lg" fontWeight="700" color="gray.600" mb={1}>
              No products found
            </Text>
            <Text color="gray.400" fontSize="sm" maxW="340px" mx="auto" mb={5}>
              Try adjusting your search or filters, or explore subscription plans for curated meals.
            </Text>
            <Button
              as={Link}
              href="/subscription"
              bg={PRIMARY}
              color="white"
              size="sm"
              borderRadius="xl"
              px={6}
              fontWeight="700"
              _hover={{ bg: "#1f793a" }}
            >
              View Subscription Plans
            </Button>
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={{ base: 3, md: 4 }}
          >
            {products.map((product, index) => (
              <MotionBox
                key={`p-${product._id || product.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.4) }}
              >
                <ProductCard product={product} userInfo={userInfo} variant="v4" />
              </MotionBox>
            ))}

            {sellerListings.map((listing, index) => (
              <MotionBox
                key={`s-${listing._id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min((products.length + index) * 0.04, 0.4) }}
              >
                <Link href={`/listing/${listing._id}`}>
                  <Box
                    bg="white"
                    borderRadius="xl"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="0 2px 8px rgba(0,0,0,0.04)"
                    transition="all 0.18s"
                    _hover={{ borderColor: PRIMARY, boxShadow: "0 6px 20px rgba(24,95,45,0.12)", transform: "translateY(-2px)" }}
                    h="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    <Box position="relative" h="150px" bg="gray.50" overflow="hidden">
                      {listing.images?.[0] ? (
                        <Box
                          as="img"
                          src={listing.images[0]}
                          alt={listing.title}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          transition="transform 0.3s"
                          _groupHover={{ transform: "scale(1.05)" }}
                        />
                      ) : (
                        <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
                          <Store size={28} color="#CBD5E0" />
                        </Box>
                      )}
                      {listing.negotiable && (
                        <Box
                          position="absolute"
                          top={2}
                          left={2}
                          bg={PRIMARY}
                          color="white"
                          fontSize="9px"
                          fontWeight="700"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          letterSpacing="wide"
                          textTransform="uppercase"
                        >
                          Negotiable
                        </Box>
                      )}
                    </Box>
                    <Box p={3} flex={1} display="flex" flexDirection="column">
                      <Text fontWeight="600" fontSize="sm" color="gray.800" noOfLines={2} flex={1} mb={1}>
                        {listing.title}
                      </Text>
                      <Text fontSize="sm" fontWeight="800" color={PRIMARY} mb={1}>
                        {FormatCurr(listing.price)}
                      </Text>
                      <Text fontSize="10px" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                        Seller listing
                      </Text>
                    </Box>
                  </Box>
                </Link>
              </MotionBox>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
