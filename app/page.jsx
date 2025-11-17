"use client";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { CategoriesJson, ThemeColors } from "@constants/constants";
import React from "react";

import { useProductsGetMutation, useProductsCategoriesGetMutation } from "@slices/productsApiSlice";
import { useCommentsGetMutation } from "@slices/usersApiSlice";
import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useSelector } from "react-redux";

import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";
import Hero from "@components/Hero";
import CategoryCard from "@components/cards/CategoryCard";
import ResponsiveBackground from "@components/cards/ResponsiveBackground";
import Subscription from "@components/cards/SubscriptionSection";
import SwipperComponent from "@components/Swiper";
import LoaderSkeleton from "@components/LoaderSkeleton";

const DynamicButton = dynamic(() => import("@components/Button"), {
  loading: () => <p>Loading...</p>,
});
const DynamicSpecialProducts = dynamic(
  () => import("@components/SpecialProducts"),
  {
    loading: () => <p>Loading...</p>,
  }
);



const Home = () => {
  const [Products, setProducts] = useState([]);
  const [Comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

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
      // Fallback to hardcoded categories if API fails
      setCategories([]);
    }
  };

  // fetch product categories and products
  useEffect(() => {
    handleFetchProductsData();
    handleFetchCategories();
    // handleFetchCommentsData();
  }, []);

  // Memoize category display data
  const displayCategories = useMemo(() => {
    return categories.length > 0
      ? categories
      : CategoriesJson.map(cat => ({ name: cat }));
  }, [categories]);

  // Memoize product sections
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
    // Filter products that are not in the special categories
    const filteredProducts = Products?.filter(p =>
      !["popular", "topdeals", "discover", "promotional", "recommended"].includes(p?.category)
    ) || [];
    
    // Group products by category
    const grouped = filteredProducts.reduce((acc, product) => {
      const category = product?.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
    
    // Convert to array format for rendering
    return Object.entries(grouped).map(([category, products]) => ({
      category,
      products
    }));
  }, [Products]);

  // comment section slider navigation
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
    <Box width="100%"
      maxWidth={{
        base: "22rem",  // For small screens 
        sm: "40rem",    // For medium screens 
        md: "60rem",    // For larger screens 
        lg: "80rem",    // For extra-large screens 
        //xl: "87.5rem"   // For extra-extra-large screens 
      }}
      margin="0 auto">  {/* Main container */}
      <Hero />

      {/* ------------- Categories Section ------------------------------- */}
      <Box pt="3rem" mx="auto">
        <Box mx={3}>
          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="600"
            mb={4}
            textAlign="center"
          >
            Shop by Category
          </Heading>

          {isLoading ? (
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(6, 1fr)"
              }}
              gap={{ base: 3, md: 4, lg: 5 }}
              py={6}
              maxWidth={{
                base: "20rem",
                sm: "40rem",
                md: "60rem",
                lg: "80rem",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                <Box key={item} borderRadius="xl" overflow="hidden">
                  <Skeleton height={{ base: "120px", md: "140px" }} borderRadius="lg" />
                  <SkeletonText mt="3" noOfLines={2} spacing="2" />
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(6, 1fr)"
              }}
              gap={{ base: 3, md: 4, lg: 5 }}
              py={6}
              maxWidth={{
                base: "20rem",
                sm: "40rem",
                md: "60rem",
                lg: "80rem",
              }}
            >
              {displayCategories.map((category, index) => (
                <CategoryCard
                  key={category._id || index}
                  category={typeof category === 'string' ? category : category.name}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>


      {topDealsProducts.length > 0 && (
        <Box pt="3rem" mx={2}>
          <Flex direction="column" alignItems="center">
            <Box mx="auto" width="100%">
              <DynamicSpecialProducts
                Products={topDealsProducts}
                userInfo={userInfo}
                category="topdeals"
                text="bulk"
              />
            </Box>
          </Flex>
        </Box>
      )}
      <ResponsiveBackground url="/assets/images/new.jpeg" />

      {popularProducts.length > 0 ? (
        <Box pt="3rem" mx={2}>
          <Flex direction="column" alignItems="center">
            <Box width="100%">
              <DynamicSpecialProducts
                Products={popularProducts}
                userInfo={userInfo}
                category="popular"
                text="popular"
              />
            </Box>
          </Flex>
        </Box>
      ):<Heading
      as="h2"
      fontSize={{ base: "sm", md: "md" }}
      fontWeight="600"
      mb={4}
      textAlign="center"
    >
      No Popular Products yet
    </Heading>}
      {/* Banner */}
      <ResponsiveBackground url="/assets/images/b1.jpeg" />

      {discoverProducts.length > 0 ? (
        <Box pt="3rem" width="100%">
          <Flex>
            <Box width="100%" mx={2}>
              <DynamicSpecialProducts
                Products={discoverProducts}
                userInfo={userInfo}
                category="discover"
                text="discover"
              />
            </Box>
          </Flex>
        </Box>
      ):<Heading
      as="h2"
      fontSize={{ base: "sm", md: "md" }}
      fontWeight="600"
      mb={4}
      textAlign="center"
    >
      No discovery products yet
    </Heading>}
      {/* Banner */}
      <ResponsiveBackground url="/assets/images/b2.jpeg" />

      {promotionalProducts.length > 0 ? (
        <Box pt="3rem" width="100%">
          <Flex>
            <Box width="100%" mx={2}>
              <DynamicSpecialProducts
                Products={promotionalProducts}
                userInfo={userInfo}
                category="promotional"
                text="promotional"
              />
            </Box>
          </Flex>
        </Box>
      ):<Heading
      as="h2"
      fontSize={{ base: "sm", md: "md" }}
      fontWeight="600"
      mb={4}
      textAlign="center"
    >
      No promotional products yet
    </Heading>}
      {/* Banner */}
      <ResponsiveBackground url="/assets/images/banner2.jpeg" />


      {recommendedProducts.length > 0 ? (
        <Box pt={1} width="100%">
          <Flex>
            <Box mx={2} width="100%">
              <DynamicSpecialProducts
                Products={recommendedProducts}
                userInfo={userInfo}
                category="recommended"
                text="recommended"
              />
            </Box>
          </Flex>
        </Box>
      ):<Heading
      as="h2"
      fontSize={{ base: "md", md: "lg" }}
      fontWeight="600"
      mb={4}
      textAlign="center"
    >
      No recommended products yet
    </Heading>}
      {/* Subscription component should have the same width and margins as the section above */}
      <Box width="100%">
        <Subscription />
      </Box>

      {otherProducts.length > 0 && otherProducts.map((product, index) => (
        <React.Fragment key={product?.category}>
          <Box pt={2} mx={2}>
            <Flex>
              <Box width="100%" mx="auto">
                <DynamicSpecialProducts
                  Products={product?.products}
                  userInfo={userInfo}
                  category={product?.category}
                  text={product?.category}
                />
              </Box>
            </Flex>
          </Box>

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
      ))}

      {/* ------------- section 
      ------------------------------- */}
      <Box>
        {Comments?.length > 0 ? (
          <Box
            padding={"2rem 0 3rem 0"}
            borderBottom={"1.7px solid " + ThemeColors.lightColor}
            position={"relative"}
          >
            <Box padding={"2rem 0"}>
              <Heading as={"h2"} fontSize={"3xl"} textAlign={"center"}>
                What our customers say
              </Heading>
              <Flex>
                <Box
                  height={"0.2rem"}
                  width={{ base: "6rem", md: "8rem", xl: "10rem" }}
                  margin={"1rem auto"}
                  background={ThemeColors.primaryColor}
                ></Box>
              </Flex>
            </Box>
            <Box>
              <Box
                cursor={"pointer"}
                position={"absolute"}
                top={"50%"}
                left={{ base: "5%", md: "10%", xl: "15%" }}
              >
                <AiOutlineArrowLeft size={35} onClick={decreaseSliderIndex} />
              </Box>
              <Box
                cursor={"pointer"}
                position={"absolute"}
                top={"50%"}
                right={{ base: "5%", md: "10%", xl: "15%" }}
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
                      <Box key={index}>
                        <Heading as={"h3"} size={"md"} textAlign={"center"}>
                          {comment.name}
                        </Heading>
                        <Box padding={"0.3rem 0"}>
                          <Text
                            fontSize={"2xl"}
                            textAlign={"center"}
                            className="secondary-light-font"
                          >
                            {comment.message}
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      ""
                    )
                  )}
                </Flex>
              </Box>
            </Flex>
          </Box>
        ) : (
          ""
        )}
      </Box>

    </Box>
  );
};

export default Home;
