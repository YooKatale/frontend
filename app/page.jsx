"use client";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { CategoriesJson, ThemeColors } from "@constants/constants";
import React from "react";

import { useProductsGetMutation, useProductsCategoriesGetMutation } from "@slices/productsApiSlice";
import { useCommentsGetMutation } from "@slices/usersApiSlice";
import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineAppstore } from "react-icons/ai";
import { useAuth } from "@slices/authSlice";
import { motion } from "framer-motion";

import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";
import Hero from "@components/Hero";
import CategoryCard from "@components/cards/CategoryCard";
import ResponsiveBackground from "@components/cards/ResponsiveBackground";
import SwipperComponent from "@components/Swiper";
import LoaderSkeleton from "@components/LoaderSkeleton";

const DynamicSpecialProducts = dynamic(
  () => import("@components/SpecialProducts"),
  { loading: () => <Box py={8} px={4}><Skeleton h="200px" borderRadius="xl" /></Box>, ssr: false }
);
const DynamicSubscription = dynamic(
  () => import("@components/cards/SubscriptionSection"),
  { loading: () => <Box h="120px" bg="var(--brand-lt)" />, ssr: false }
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Home = () => {
  const [Products, setProducts] = useState([]);
  const [Comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const { userInfo } = useAuth();

  const [fetchProducts] = useProductsGetMutation();
  const [fetchComments] = useCommentsGetMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();

  const handleFetchCommentsData = async () => {
    const res = await fetchComments().unwrap();

    if (res?.status && res?.status == "Success") {
      setComments(res?.data);
    }
  };

  const handleFetchProductsData = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts().unwrap();
      if (res?.status && res?.status === "Success") {
        setProducts(res.data || []);
        console.log("Fetched Products:", res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCategories = async () => {
    try {
      const res = await fetchCategories().unwrap();
      if (res?.success && res?.categories) {
        setCategories(res.categories);
        console.log("Fetched Categories:", res.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    handleFetchProductsData();
    handleFetchCategories();
  }, []);

  const displayCategories = useMemo(() => {
    return categories.length > 0
      ? categories
      : CategoriesJson.map(cat => ({ name: cat }));
  }, [categories]);

  const topDealsProducts = useMemo(() =>
    Products?.filter(p => p?.category === "topdeals") || [],
    [Products]
  );

  const popularProducts = useMemo(() =>
    Products?.filter(p => p?.category === "popular") || [],
    [Products]
  );

  const discoverProducts = useMemo(() =>
    Products?.filter(p => p?.category === "discover") || [],
    [Products]
  );

  const promotionalProducts = useMemo(() =>
    Products?.filter(p => p?.category === "promotional") || [],
    [Products]
  );

  const recommendedProducts = useMemo(() =>
    Products?.filter(p => p?.category === "recommended") || [],
    [Products]
  );

  const otherProducts = useMemo(() => {
    const filteredProducts = Products?.filter(p =>
      !["popular", "topdeals", "discover", "promotional", "recommended"].includes(p?.category)
    ) || [];

    const grouped = filteredProducts.reduce((acc, product) => {
      const category = product?.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, products]) => ({
      category,
      products
    }));
  }, [Products]);

  // Categories that have at least one product (for redirecting empty ones to /subscription)
  const categoriesWithProductsSet = useMemo(() => {
    const set = new Set();
    otherProducts.forEach((o) => set.add((o.category || "").toLowerCase().trim()));
    if (topDealsProducts?.length) set.add("topdeals");
    if (popularProducts?.length) set.add("popular");
    if (discoverProducts?.length) set.add("discover");
    if (promotionalProducts?.length) set.add("promotional");
    if (recommendedProducts?.length) set.add("recommended");
    return set;
  }, [otherProducts, topDealsProducts, popularProducts, discoverProducts, promotionalProducts, recommendedProducts]);

  const [currSliderIndex, setCurrSliderIndex] = useState(0);

  const increaseSliderIndex = () => {
    if (currSliderIndex === Comments?.length - 1) {
      setCurrSliderIndex((prev) => 0);
    } else {
      setCurrSliderIndex((prev) => prev + 1);
    }
  };

  const decreaseSliderIndex = () => {
    if (currSliderIndex > 0) {
      setCurrSliderIndex((prev) => prev - 1);
    } else {
      setCurrSliderIndex((prev) => Comments?.length - 1);
    }
  };

  return (
    <Box 
      width="100%"
      maxWidth="100%"
      margin="0 auto"
      bg="green.50"
      minH="100vh"
    >
      {/* Hero Section with Animation */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Hero />
      </motion.div>

      {/* Categories Section - pure green background */}
      <Box pt={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }} pb={{ base: "1rem", md: "1.5rem" }} bg="green.50" borderBottom="1px solid" borderColor="var(--border)">
        <Box maxW="1280px" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={3} mb={{ base: 3, md: 4 }}>
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w={{ base: "44px", md: "48px" }}
                h={{ base: "44px", md: "48px" }}
                borderRadius="12px"
                bg="gray.50"
                color="var(--brand)"
              >
                <AiOutlineAppstore size={24} />
              </Box>
              <Box>
                <Heading
                  as="h2"
                  fontFamily="var(--font-syne), Syne, sans-serif"
                  fontSize={{ base: "1.4rem", md: "1.6rem", lg: "1.85rem" }}
                  fontWeight="800"
                  color="var(--dark)"
                  letterSpacing="-0.03em"
                >
                  Shop by Category
                </Heading>
                <Box height="4px" width="60px" mt={2} background="var(--brand)" borderRadius="full" />
              </Box>
            </motion.div>
            <Flex
              as="a"
              href="/products"
              fontSize="13px"
              fontWeight="700"
              color={ThemeColors.primaryColor}
              align="center"
              gap={1}
              _hover={{ textDecoration: "none", gap: 2 }}
              transition="gap 0.2s"
            >
              View all categories
              <AiOutlineArrowRight size={16} style={{ flexShrink: 0 }} />
            </Flex>
          </Flex>

          {isLoading ? (
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(6, 1fr)",
                xl: "repeat(8, 1fr)"
              }}
                gap={{ base: 3, md: 4 }}
                py={4}
              >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Box key={item} borderRadius="xl" overflow="hidden">
                  <Skeleton height={{ base: "100px", md: "120px" }} borderRadius="lg" />
                  <SkeletonText mt="3" noOfLines={2} spacing="2" />
                </Box>
              ))}
            </Box>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Box
                display="grid"
                gridTemplateColumns={{
                  base: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(6, 1fr)",
                  xl: "repeat(8, 1fr)"
                }}
                gap={{ base: 3, md: 4 }}
                py={4}
              >
                {displayCategories.map((category, index) => {
                  const categoryName = typeof category === "string" ? category : category?.name || "";
                  const hasProducts = categoriesWithProductsSet.has((categoryName || "").toLowerCase().trim());
                  return (
                    <motion.div
                      key={category._id || index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -4 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ willChange: "transform" }}
                    >
                      <CategoryCard
                        category={categoryName}
                        hasProducts={hasProducts}
                      />
                    </motion.div>
                  );
                })}
              </Box>
            </motion.div>
          )}
        </Box>
      </Box>

      {/* Product Sections – pure green page bg, orange category headers, white product area */}
      <Box bg="green.50" py={{ base: 2, md: 3 }}>
        <Box maxW="1280px" mx="auto" px={{ base: 3, md: 5 }}>
        {topDealsProducts.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Box>
              <DynamicSpecialProducts
                Products={topDealsProducts}
                userInfo={userInfo}
                category="topdeals"
                text="bulk"
                headerBg="orange.500"
              />
            </Box>
          </motion.div>
        )}
          <ResponsiveBackground url="/assets/images/new.jpeg" />
        </Box>
      </Box>

      <Box bg="green.50" py={{ base: 2, md: 3 }}>
        <Box maxW="1280px" mx="auto" px={{ base: 3, md: 5 }}>
        {popularProducts.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Box>
              <DynamicSpecialProducts
                Products={popularProducts}
                userInfo={userInfo}
                category="popular"
                text="popular"
                headerBg="orange.500"
              />
            </Box>
          </motion.div>
        ) : (
          <Heading as="h2" fontSize={{ base: "sm", md: "md" }} fontWeight="600" mb={3} textAlign="center" color="gray.500">
            No Popular Products yet
          </Heading>
        )}
          <ResponsiveBackground url="/assets/images/b1.jpeg" />
        </Box>
      </Box>

      <Box bg="green.50" py={{ base: 2, md: 3 }}>
        <Box maxW="1280px" mx="auto" px={{ base: 3, md: 5 }}>
        {discoverProducts.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Box>
              <DynamicSpecialProducts
                Products={discoverProducts}
                userInfo={userInfo}
                category="discover"
                text="discover"
                headerBg="orange.500"
              />
            </Box>
          </motion.div>
        ) : (
          <Heading as="h2" fontSize={{ base: "sm", md: "md" }} fontWeight="600" mb={3} textAlign="center" color="gray.500">
            No discovery products yet
          </Heading>
        )}
          <ResponsiveBackground url="/assets/images/b2.jpeg" />
        </Box>
      </Box>

      <Box bg="green.50" py={{ base: 2, md: 3 }}>
        <Box maxW="1280px" mx="auto" px={{ base: 3, md: 5 }}>
        {promotionalProducts.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Box>
              <DynamicSpecialProducts
                Products={promotionalProducts}
                userInfo={userInfo}
                category="promotional"
                text="promotional"
                headerBg="orange.500"
              />
            </Box>
          </motion.div>
        ) : (
          <Heading as="h2" fontSize={{ base: "sm", md: "md" }} fontWeight="600" mb={3} textAlign="center" color="gray.500">
            No promotional products yet
          </Heading>
        )}
          <ResponsiveBackground url="/assets/images/banner2.jpeg" />
        </Box>
      </Box>

      <Box bg="green.50" py={{ base: 2, md: 3 }}>
        <Box maxW="1280px" mx="auto" px={{ base: 3, md: 5 }}>
        {recommendedProducts.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Box>
              <DynamicSpecialProducts
                Products={recommendedProducts}
                userInfo={userInfo}
                category="recommended"
                text="recommended"
                headerBg="orange.500"
              />
            </Box>
          </motion.div>
        ) : (
          <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="600" mb={3} textAlign="center" color="gray.500">
            No recommended products yet
          </Heading>
        )}
        </Box>
      </Box>

      <Box width="100%">
        <DynamicSubscription />
      </Box>

      {otherProducts.length > 0 && (() => {
        return (
        <Box width="100%" bg="green.50" py={{ base: 2, md: 3 }}>
          {otherProducts.map((product, index) => (
            <Box key={product?.category} mb={{ base: 2, md: 3 }}>
              <Box maxW="1280px" mx="auto" px={{ base: 3, md: 5 }}>
              <React.Fragment>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                >
                  <Box>
                    <DynamicSpecialProducts
                      Products={product?.products}
                      userInfo={userInfo}
                      category={product?.category}
                      text={product?.category}
                      headerBg="orange.500"
                    />
                  </Box>
                </motion.div>

                {index === 2 && (
                  <Box key={`banner2-${index}`}>
                    <ResponsiveBackground url="/assets/images/banner3.jpeg" />
                  </Box>
                )}
                {index === otherProducts?.length - 7 && (
                  <Box key={`banner3-${index}`}>
                    <ResponsiveBackground url="/assets/images/banner2.jpeg" />
                  </Box>
                )}
              </React.Fragment>
              </Box>
            </Box>
          ))}
        </Box>
        );
      })()}

      {/* Testimonials Section with Animation */}
      <Box bg="green.50" py={{ base: 3, md: 4 }}>
        <Box maxW="1280px" mx="auto" px={{ base: 4, md: 6 }}>
        {Comments?.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Box
              padding={{ base: "2rem 1rem", md: "3rem 2rem" }}
              borderBottom={"1.7px solid " + ThemeColors.lightColor}
              position="relative"
              bg="white"
              borderRadius="xl"
              my={4}
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)"
            >
              <Box padding={"2rem 0"}>
                <Heading 
                  as={"h2"} 
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} 
                  textAlign={"center"}
                  fontWeight="700"
                  color="gray.800"
                  letterSpacing="-0.02em"
                >
                  What our customers say
                </Heading>
                <Flex>
                  <Box
                    height={"4px"}
                    width={{ base: "6rem", md: "8rem", xl: "10rem" }}
                    margin={"1.5rem auto"}
                    background={ThemeColors.primaryColor}
                    borderRadius="full"
                  />
                </Flex>
              </Box>
              <Box>
                <Box
                  cursor={"pointer"}
                  position={"absolute"}
                  top={"50%"}
                  left={{ base: "5%", md: "10%", xl: "15%" }}
                  p={2}
                  borderRadius="full"
                  bg="white"
                  boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                  _hover={{ bg: "gray.50", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                >
                  <AiOutlineArrowLeft size={35} onClick={decreaseSliderIndex} />
                </Box>
                <Box
                  cursor={"pointer"}
                  position={"absolute"}
                  top={"50%"}
                  right={{ base: "5%", md: "10%", xl: "15%" }}
                  p={2}
                  borderRadius="full"
                  bg="white"
                  boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                  _hover={{ bg: "gray.50", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                >
                  <AiOutlineArrowRight size={35} onClick={increaseSliderIndex} />
                </Box>
              </Box>
              <Flex>
                <Box
                  margin={"auto"}
                  width={{ base: "80%", md: "60%", xl: "40%" }}
                >
                  <Flex justifyContent={"center"}>
                    {Comments.map((comment, index) =>
                      index === currSliderIndex ? (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box>
                            <Heading 
                              as={"h3"} 
                              size={"md"} 
                              textAlign={"center"}
                              mb={4}
                              color="gray.800"
                              fontWeight="600"
                            >
                              {comment.name}
                            </Heading>
                            <Box padding={"0.3rem 0"}>
                              <Text
                                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                                textAlign={"center"}
                                className="secondary-light-font"
                                color="gray.600"
                                lineHeight="1.8"
                                fontStyle="italic"
                              >
                                "{comment.message}"
                              </Text>
                            </Box>
                          </Box>
                        </motion.div>
                      ) : (
                        ""
                      )
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </motion.div>
        ) : (
          ""
        )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
