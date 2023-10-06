"use client";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import Hero from "@components/Hero";
import { CategoriesJson, Images, ThemeColors } from "@constants/constants";
import Image from "next/image";
import { FaTruckLoading, FaCreditCard, FaHeadset } from "react-icons/fa";

import { useEffect, useState } from "react";
import { useProductsCategoriesGetMutation } from "@slices/productsApiSlice";
import Link from "next/link";
import { useSelector } from "react-redux";
import SpecialProducts from "@components/SpecialProducts";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import dynamic from "next/dynamic";
import { useCommentsGetMutation } from "@slices/usersApiSlice";
import { Salad } from "lucide-react";
import RecommendedProducts from "@components/  RecommendedProducts";

const DynamicButton = dynamic(() => import("@components/Button"), {
  loading: () => <p>Loading...</p>,
});

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
    const res = await fetchProducts().unwrap();
    console.log(res.data);

    if (res?.status && res?.status == "Success") {
      setProducts(res.data);
    }
  };

  // fetch product categories
  useEffect(() => {
    handleFetchProductsData();
    handleFetchCommentsData();
  }, []);

  // comment section slider navigation
  const [currSliderIndex, setCurrSliderIndex] = useState(0);

  const increaseSliderIndex = () => {
    if (currSliderIndex === Comments.length - 1) {
      setCurrSliderIndex((prev) => 0);
    } else {
      setCurrSliderIndex((prev) => prev + 1);
    }
  };

  const decreaseSliderIndex = () => {
    if (currSliderIndex > 0) {
      setCurrSliderIndex((prev) => prev - 1);
    } else {
      setCurrSliderIndex((prev) => Comments.length - 1);
    }
  };

  return (
    <>
      <Hero />

      {/* ------------- section 
      ------------------------------- */}
      {/* <div className="py-12 flex">
        <div className="lg:w-[85%] sm:w-[90%] w-[95%] m-auto">
          <div className="py-4">
            <h3 className="text-2xl font-medium">Categories</h3>
            <div className="py-2">
              <div className="h-[0.13rem] w-[170px] bg-primary"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-4 py-6">
            {CategoriesJson.map((category, index) => (
              <div
                className="lg:p-10 p-4 border-2 border-light rounded-md hover:border-primary"
                key={index}
              >
                <Link href={`/search?q=${category}`}>
                  <div className="flex justify-center flex-center">
                    <img
                      src={`/assets/images/categories/${category}.jpg`}
                      className="lg:h-20 lg:w-20 w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <p className="lg:text-lg text-base text-center">{category}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* ------------- section 
      ------------------------------- */}

      {/* // product?.category == "popular" && */}
      {/* <Box
        padding={"3rem 0"}
        borderBottom={"1.7px solid " + ThemeColors.lightColor}
      >
        <Flex>
          <Box margin={"auto"} width={{ base: "95%", md: "90%", xl: "90%" }}>
            {Products?.length > 0 ? (
              Products.map(
                (product, index) =>
                  product.category === "popular" && (
                    <SpecialProducts
                      key={index}
                      Products={product?.products}
                      userInfo={userInfo}
                      category={product?.category}
                      text={product?.category}
                    />
                  )
              )
            ) : (
              <SpecialProducts
                Products={[]}
                userInfo={{}}
                category={""}
                text={""}
              />
            )}
          </Box>
        </Flex>
      </Box> */}
       <div className="py-12 flex">
        <div className="lg:w-[85%] sm:w-[90%] w-[95%] m-auto">
          <div className="py-4">
            <h3 className="text-2xl font-medium">Popular Products</h3>
            <div className="py-2">
              <div className="h-[0.13rem] w-[170px] bg-primary"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-4 py-6">
            {CategoriesJson.map((category, index) => (
              <div
                className="lg:p-10 p-4 border-2 border-light rounded-md hover:border-primary"
                key={index}
              >
                <Link href={`/search?q=${category}`}>
                  <div className="flex justify-center flex-center">
                    <img
                      src={`/assets/images/categories/${category}.jpg`}
                      className="lg:h-20 lg:w-20 w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <p className="lg:text-lg text-base text-center">{category}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <Box display={`${Products?.length > 0 && "none"}`} hidden>
        <Loader />
      </Box> */}

      {/* ------------- section 
      ------------------------------- */}
      <Box
        padding={"3rem 0"}
        borderBottom={"1.7px solid " + ThemeColors.lightColor}
        display={"none"}
      >
        <Flex>
          <Box margin={"auto"} width={{ base: "100%", md: "75%", xl: "70%" }}>
            <Grid
              gridTemplateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
              gridGap={"1rem"}
            >
              <Box>
                <Flex
                  padding={{ base: "0 0.5rem", md: "0 0.5rem", xl: "0 1rem" }}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <FaCreditCard size={60} color={ThemeColors.darkColor} />
                  <Box padding={"0.5rem 0"}>
                    <Text textAlign={"center"} fontSize={"lg"}>
                      Register for 25% YooCard premium & Gold discount
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box>
                <Flex
                  padding={{ base: "0 0.5rem", md: "0 0.5rem", xl: "0 1rem" }}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <FaHeadset size={60} color={ThemeColors.darkColor} />
                  {/* <Image src={Images.customerServiceIcon} width={60} /> */}
                  <Box padding={"0.5rem 0"}>
                    <Text textAlign={"center"} fontSize={"lg"}>
                      24/7 service support
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box>
                <Flex
                  padding={{ base: "0 0.5rem", md: "0 0.5rem", xl: "0 1rem" }}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <FaTruckLoading size={60} color={ThemeColors.darkColor} />
                  <Box padding={"0.5rem 0"}>
                    <Text textAlign={"center"} fontSize={"lg"}>
                      Delivery offer [21 - 30] <br />
                      (Register for 9 days free delivery)
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box>
                <Flex
                  padding={{ base: "0 0.5rem", md: "0 0.5rem", xl: "0 1rem" }}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {/* <CgShield size={60} color={ThemeColors.darkColor} /> */}
                  <Image src={Images.cardSecureIcon} width={60} />
                  <Box padding={"0.5rem 0"}>
                    <Text textAlign={"center"} fontSize={"lg"}>
                      Safe, instant & secured
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Grid>
          </Box>
        </Flex>
      </Box>

      {/* ------------- section 
      ------------------------------- */}
      <Box padding={"3rem 0"} background={"#000"}>
        <Flex>
          <Box margin={"auto"} width={{ base: "100%", md: "70%", xl: "50%" }}>
            <Box padding={{ base: "2rem", md: "2rem 1rem", xl: "2rem 0" }}>
              <Text
                textAlign={"center"}
                fontSize={{ base: "2xl", md: "2xl", xl: "3xl" }}
                className="secondary-light-font"
                color={ThemeColors.lightColor}
              >
                Forget about going to the Market get Premium access to your Home
                digital mobile food market
              </Text>

              <Flex justifyContent={"center"} padding={"1rem 0"}>
                <Link href={"/subscription"}>
                  <DynamicButton
                    type={"button"}
                    text={"Go Premium"}
                    size={"lg"}
                  />
                </Link>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* ------------- section 
      ------------------------------- */}
      {Products.length > 0 ? (
        Products.map(
          (product, index) =>
            product?.category !== "popular" &&
            product.products?.length > 0 && (
              <Box
                padding={"3rem 0"}
                borderBottom={"1.7px solid " + ThemeColors.lightColor}
                key={index}
              >
                <Flex>
                  <Box
                    margin={"auto"}
                    width={{ base: "95%", md: "90%", xl: "90%" }}
                  >
                    <SpecialProducts
                      Products={product?.products}
                      userInfo={userInfo}
                      category={product?.category}
                      text={product?.category}
                    />
                  </Box>
                </Flex>
              </Box>
            )
        )
      ) : (
        <Box
          padding={"3rem 0"}
          borderBottom={"1.7px solid " + ThemeColors.lightColor}
        >
          <Flex>
            <Box margin={"auto"} width={{ base: "95%", md: "90%", xl: "90%" }}>
              <SpecialProducts
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
        {Comments.length > 0 ? (
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

      {/* ------------- section 
      ----------------------------------- */}
    </>
  );
};

export default Home;
