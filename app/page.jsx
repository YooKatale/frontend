"use client";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { CategoriesJson, ThemeColors } from "@constants/constants";
import React from "react";

import { useProductsCategoriesGetMutation } from "@slices/productsApiSlice";
import { useCommentsGetMutation } from "@slices/usersApiSlice";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useSelector } from "react-redux";

import { Box } from "@chakra-ui/react";
import Hero from "@components/Hero";
import CategoryCard from "@components/cards/CategoryCard";
import ResponsiveBackground from "@components/cards/ResponsiveBackground";
import Subscription from "@components/cards/SubscriptionSection";
import SwipperComponent from "@components/Swiper";

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
  const [isLoading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const [fetchProducts] = useProductsCategoriesGetMutation();
  const [fetchComments] = useCommentsGetMutation();

  const handleFetchCommentsData = async () => {
    const res = await fetchComments().unwrap();

    if (res?.status && res?.status == "Success") {
      setComments(res?.data);
    }
  };

  const handleFetchProductsData = async () => {
    try {
      const res = await fetchProducts().unwrap();
      if (res?.status && res?.status === "Success") {
        setProducts(res.data || []); 
        console.log("Fetched Products:", res.data);  // Log the fetched product data
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };  

  // fetch product categories
  useEffect(() => {
    handleFetchProductsData();
    // handleFetchCommentsData();
  }, []);

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
        <Box /*maxWidth="87.5rem"*/ mx={3}> 
          <Box 
            display="grid" 
            gridTemplateColumns={{
              base: "repeat(2, 1fr)",   // 2 columns on small screens
              sm: "repeat(3, 1fr)",     // 3 columns on medium screens
              md: "repeat(4, 1fr)",     // 4 columns on larger screens
              lg: "repeat(5, 1fr)"      // 5 columns on extra large screens
            }} 
            gap={6}  
            py={6}   
            maxWidth={{ 
              base: "20rem",  // For small screens 
              sm: "40rem",    // For medium screens 
              md: "60rem",    // For larger screens 
              lg: "80rem",    // For extra-large screens 
              //xl: "87.5rem"   // For extra-extra-large screens 
            }}
          >
            {CategoriesJson.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </Box>
        </Box>
      </Box>


      <Box pt="3rem" mx={2}>
        <Flex direction="column" alignItems="center">
          <Box mx="auto" width="100%">
            {Products?.length > 0 ? (
              Products.map(
                (product, index) =>
                  product?.category === "topdeals" && (
                    <DynamicSpecialProducts
                      key={index}
                      Products={product?.products}
                      userInfo={userInfo}
                      category={product?.category}
                      text={"bulk"}
                    />
                  )
              )
            ) : (
              <DynamicSpecialProducts
                Products={[]}
                userInfo={{}}
                category={""}
                text={""}
              />
            )}
          </Box>
        </Flex>
      </Box>
<ResponsiveBackground url="/assets/images/new.jpeg" />
      <Box pt="3rem" mx={2}> 
        <Flex direction="column" alignItems="center">
        <Box width="100%"  > 
            {Products?.length > 0 ? (
              Products.map(
                (product, index) =>
                  product?.category === "popular" && (
                    <DynamicSpecialProducts
                      Products={product?.products}
                      userInfo={userInfo}
                      category={product?.category}
                      text={product?.category}
                      key={index}
                    />
                  )
              )
            ) : (
              <DynamicSpecialProducts Products={[]} userInfo={{}} category={""} text={""} />
            )}
          </Box>
        </Flex>
      </Box>
      {/* Banner */}
      <ResponsiveBackground url="/assets/images/b1.jpeg" />
      
      <Box pt="3rem"  width="100%" > 
        <Flex>
        <Box width="100%"  mx={2} > 
            {Products?.length > 0 ? (
              Products.map(
                (product, index) =>
                  product?.category === "discover" && (
                    <DynamicSpecialProducts
                      Products={product?.products}
                      userInfo={userInfo}
                      category={product?.category}
                      text={product?.category}
                      key={index}
                    />
                  )
              )
            ) : (
              <DynamicSpecialProducts Products={[]} userInfo={{}} category={""} text={""} />
            )}
          </Box>
        </Flex>
      </Box>
{/* Banner */}
<ResponsiveBackground url="/assets/images/b2.jpeg" />

      <Box pt="3rem" width="100%" > 
        <Flex>
        <Box width="100%" mx={2}  > 
            {Products?.length > 0 ? (
              Products.map(
                (product, index) =>
                  product?.category === "promotional" && (
                    <DynamicSpecialProducts
                      Products={product?.products}
                      userInfo={userInfo}
                      category={product?.category}
                      text={product?.category}
                      key={index}
                    />
                  )
              )
            ) : (
              <DynamicSpecialProducts Products={[]} userInfo={{}} category={""} text={""} />
            )}
          </Box>
        </Flex>
      </Box>
{/* Banner */}
<ResponsiveBackground url="/assets/images/banner2.jpeg" />

      
<Box pt={1} width="100%" >
  <Flex>
    <Box mx={2}  width="100%">
      {Products?.length > 0 ? (
        Products.map(
          (product, index) =>
            product?.category === "recommended" && (
              <DynamicSpecialProducts
                Products={product?.products}
                userInfo={userInfo}
                category={product?.category}
                text={product?.category}
                key={index}
              />
            )
        )
      ) : (
        <DynamicSpecialProducts Products={[]} userInfo={{}} category={""} text={""} />
      )}
    </Box>
  </Flex>

  
</Box>
{/* Subscription component should have the same width and margins as the section above */}
<Box width="100%">
    <Subscription />
  </Box>
      
      {Products?.length > 0 ? (
        Products.map(
          (product, index) =>
            product?.category !== "popular" &&
            product?.category !== "topdeals" &&
            product?.products?.length > 0 && (
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
        
                {index === Products?.length - 7 && (
                  <Box key={`banner3-${index}`}>
                    <ResponsiveBackground url="/assets/images/banner2.jpeg"/>
                  </Box>
                )}
              </React.Fragment>
            )
        )
      ) : (
        <Box
          padding={"3rem 0"}
          borderBottom={"1.7px solid " + ThemeColors.lightColor}
        >
          <Flex>
            <Box margin={"auto"} width={{ base: "95%", md: "90%", xl: "90%" }}>
              <DynamicSpecialProducts
                Products={[]}
                userInfo={{}}
                category={""}
                text={""}
              />
            </Box>
          </Flex>
        </Box>
      )}

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