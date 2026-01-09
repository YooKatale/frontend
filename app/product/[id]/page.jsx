"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { DisplayImages, Images, ThemeColors } from "@constants/constants";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {
  useCartCreateMutation,
  useProductGetMutation,
  useProductsCategoryGetMutation,
} from "@slices/productsApiSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ButtonComponent from "@components/Button";
import { ShoppingCart } from "lucide-react";
import { FormatCurr } from "@utils/utils";
import SpecialProducts from "@components/SpecialProducts";
import SignIn from "@app/signin/page";
import RatingAndComment from "@components/RatingAndComment";

const Product = ({ params }) => {
  // get user information stored in the localstorage
  const { userInfo } = useSelector((state) => state.auth);

  // create state to hold fetched Product information
  const [ProductData, setProductData] = useState({});
  const [SignInStateModal, setSignInStateModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [SimilarProducts, setSimilarProducts] = useState([]);
  const [editablePrice, setEditedPrice] = useState(ProductData.price);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const chakraToast = useToast();

  const { push } = useRouter();

  // use the useSearchParam hooks from next/navigation to get url params
  // const searchParam = useSearchParams();

  // const param = searchParam.get("id");

  // initialize mutation function to fetch product data from database
  const [fetchProduct] = useProductGetMutation();
  const [fetchProductsCategory] = useProductsCategoryGetMutation();
  const [addCartApi] = useCartCreateMutation();

  // function to fetch similar products
  async function handleSimilarProductFetch(category) {
    try {
      const res = await fetchProductsCategory(category).unwrap();

      if (res.status == "Success") {
        setSimilarProducts(res?.data);
      }
    } catch (error) {
      if (error?.message == "Not authorized. No token found")
        chakraToast({
          title: "Sign In required",
          description: `You need to sign in to continue`,
          status: "error",
          duration: 5000,
          isClosable: false,
        });
    }
  }

  // function handle fetching data
  const handleDataFetch = async () => {
    try {
      const res = await fetchProduct(params.id).unwrap();

      if (res.status && res.status == "Success") {
        setProductData({ ...res.data });
        handleSimilarProductFetch(res.data.category);
      }
    } catch (error) {
      // Error handled by toast
    }
  };

  // Function to start editing the price
  const handleEditPrice = () => {
    setIsEditingPrice(true);
  };

  const handleSavePrice = () => {
    setIsEditingPrice(false);
  };

  // fetch product categories
  useEffect(() => {
    handleDataFetch();
  }, []);

  // function to handle adding product to cart
  const handleAddCart = async (ID) => {
    // check if user has not logged in
    if (!userInfo) {
      chakraToast({
        title: "Sign In is required",
        description: `You need to sign in to add to cart`,
        status: "error",
        duration: 5000,
        isClosable: false,
      });

      push("/signin");

      return;
    }

    try {
      const res = await addCartApi({
        productId: ID,
        userId: userInfo?._id,
        quantity,
      });

      if (res.data?.message) {
        chakraToast({
          title: "Success",
          description: res.data?.message,
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      }

      if (res.error) {
        chakraToast({
          title: "Error",
          description: res.error.data?.message,
          status: "error",
          duration: 5000,
          isClosable: false,
        });
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.message.error || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  //handle increase quantity
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  //handle reduce quantity
  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // function to listen to add to cart button click
  const handleAddToCartBtnClick = (ID) => {
    // check if user has not logged in
    if (!userInfo) {
      chakraToast({
        title: "Sign In is required",
        description: `You need to sign in to add to cart`,
        status: "error",
        duration: 5000,
        isClosable: false,
      });

      setSignInStateModal(true);

      return;
    }

    handleAddCart(ID, userInfo?._id);
  };

  // function to listen to user successfull login
  const handleListeningToSignIn = (param) => {
    if (param.loggedIn) {
      setSignInStateModal((prev) => (prev ? false : true));
      handleAddCart(ProductData._id, param?.user);
    }
  };

  return (
    <>
      <Box width="100%" minHeight="100vh" bg="white">
        <Box 
          padding={{ base: "0 1rem", sm: "0 1.5rem", md: "0 2rem" }}
          width="100%"
          maxWidth="1400px"
          margin="0 auto"
        >
          <Box paddingBottom={{ base: "0.75rem", md: "1rem" }}>
            <Heading 
              as={"h2"} 
              size={{ base: "xs", sm: "sm" }} 
              display={"flex"}
              flexWrap="wrap"
              gap="0.25rem"
              fontSize={{ base: "xs", sm: "sm" }}
            >
              Home/product/
              <Heading as={"h2"} size={{ base: "xs", sm: "sm" }} color={ThemeColors.darkColor}>
                {ProductData?.category ? ProductData?.category : "category"}
              </Heading>
            </Heading>
          </Box>

          <Box padding={{ base: "0.75rem 0", sm: "1rem 0", md: "1rem 0", xl: "1rem 2rem" }}>
            <Flex
              borderTop={"1.7px solid " + ThemeColors.lightColor}
              direction={{ base: "column", lg: "row" }}
              gap={{ base: "1rem", lg: "2rem" }}
              paddingTop={{ base: "1rem", md: "1.5rem" }}
            >
              <Box width={{ base: "100%", lg: "45%" }} flexShrink={0}>
                <Box id="main-product-image" position={"relative"} width="100%">
                  <Box
                    position="relative"
                    width="100%"
                    height={{ base: "250px", sm: "300px", md: "400px", lg: "500px" }}
                    borderRadius={{ base: "lg", md: "xl" }}
                    overflow="hidden"
                    bg="gray.50"
                    boxShadow={{ base: "sm", md: "md" }}
                    border="1px solid"
                    borderColor="gray.200"
                    marginBottom={{ base: "0.75rem", md: "1rem" }}
                  >
                    {ProductData?.images && ProductData?.images[0] ? (
                      <Image
                        src={ProductData.images[0]}
                        alt={ProductData?.name || "product image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                        style={{
                          objectFit: "cover",
                          padding: "1rem",
                        }}
                        priority
                      />
                    ) : (
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        bg="gray.100"
                      >
                        <Text fontSize="4xl" color="gray.400">
                          📦
                        </Text>
                      </Flex>
                    )}
                  </Box>
                  <Box padding={{ base: "0.5rem 0", md: "1rem 0" }}>
                    <Grid
                      gridTemplateColumns={{
                        base: "repeat(3, 1fr)",
                        sm: "repeat(4, 1fr)",
                        md: "repeat(4, 1fr)",
                        lg: "repeat(5, 1fr)",
                      }}
                      gap={{ base: 2, md: 3 }}
                    >
                      {ProductData?.images && ProductData?.images.length > 0
                        ? ProductData.images.map((image, index) => (
                            <Box
                              key={index}
                              position="relative"
                              height={{ base: "60px", sm: "70px", md: "80px", lg: "100px" }}
                              borderRadius={{ base: "md", md: "lg" }}
                              overflow="hidden"
                              bg="gray.50"
                              border="2px solid"
                              borderColor={index === 0 ? "green.400" : "gray.200"}
                              cursor="pointer"
                              transition="all 0.3s ease"
                              _hover={{
                                borderColor: "green.400",
                                transform: "scale(1.05)",
                                boxShadow: "md",
                              }}
                            >
                              <Image
                                src={image}
                                alt={`${ProductData?.name || "product"} - image ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                                style={{
                                  objectFit: "contain",
                                  padding: "0.5rem",
                                }}
                              />
                            </Box>
                          ))
                        : null}
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box
                width={{ base: "100%", md: "90%", xl: "55%" }}
                padding={{ base: "2rem 0", md: "2rem 0", xl: "2rem" }}
              >
                <Box padding={"1rem 0"}>
                  {ProductData?.type == "bulk" && (
                    <Heading
                      as={"h2"}
                      size={"md"}
                      color={ThemeColors.secondaryColor}
                    >
                      {ProductData?.type ? ProductData?.type : "__"}
                    </Heading>
                  )}

                  <Heading as={"h2"} size={"2xl"}>
                    {ProductData?.name ? ProductData?.name : "__"}
                  </Heading>

                  <Text
                    margin={"1rem 0 0.5rem 0"}
                    color={ThemeColors.secondaryColor}
                    fontSize={"2xl"}
                  >
                    UGX{" "}
                    {isEditingPrice ? (
                      <input
                        type="number"
                        name="price"
                        value={editablePrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        className="border"
                      />
                    ) : (
                      FormatCurr(ProductData?.price ? ProductData?.price : 0)
                    )}
                    {ProductData?.type !== "bulk" && (
                      <span className="mx-2 text-lg font-bold text-[#000]">
                        Per {ProductData?.unit}
                      </span>
                    )}
                    {/* {
                      isEditingPrice ? (
                        <>
                        <button onClick={handleSavePrice}>Save</button>
                        <button onClick={() => setIsEditingPrice(false)}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={handleEditPrice}>Edit</button>
                      )
                    } */}
                  </Text>

                  <Text
                    margin={"0.5rem 0"}
                    className="secondary-bold-font"
                    color={ThemeColors.darkColor}
                    fontSize={"lg"}
                  >
                    {ProductData?.category ? ProductData?.category : "__"}
                  </Text>
                </Box>
                <Box padding={"1rem 0"}>
                  <Text>
                    {ProductData?.description ? ProductData?.description : "__"}
                  </Text>
                </Box>
                <Box padding={"0.5rem 0"}>
                  <Flex>
                    <Box paddingRight="1rem">
                      <Flex
                        borderRadius={"0.3rem"}
                        border={"1.7px solid " + ThemeColors.darkColor}
                        padding={"0.3rem"}
                      >
                        <Button
                          background={"none"}
                          padding={"0.3rem"}
                          margin={"0 0.3rem"}
                          onClick={handleIncreaseQuantity}
                        >
                          <AiOutlinePlus size={25} />
                        </Button>
                        <Box
                          padding={"0.3rem"}
                          borderRadius={"0.3rem"}
                          border={"1.7px solid " + ThemeColors.darkColor}
                          width={"3rem"}
                        >
                          <Text fontSize={"md"}>{quantity}</Text>
                        </Box>
                        <Button
                          background={"none"}
                          padding={"0.3rem"}
                          margin={"0 0.3rem"}
                          onClick={handleDecreaseQuantity}
                        >
                          <AiOutlineMinus size={25} />
                        </Button>
                      </Flex>
                    </Box>

                    <div className="py-[0.3rem] px-4">
                      <div
                        onClick={() =>
                          handleAddToCartBtnClick(
                            ProductData?._id ? ProductData?._id : ""
                          )
                        }
                      >
                        <ButtonComponent
                          text={"Add To Cart"}
                          type={"button"}
                          size={"regular"}
                          icon={<ShoppingCart size={20} />}
                        />
                      </div>
                    </div>
                  </Flex>
                </Box>
              </Box>
            </Flex>

            {/* Ratings and Comments Section */}
            {ProductData?._id && (
              <RatingAndComment productId={ProductData._id} userInfo={userInfo} />
            )}

            <div className="py-8">
              <div className="">
                {SimilarProducts.length > 0 && (
                  <SpecialProducts
                    Products={SimilarProducts}
                    userInfo={userInfo}
                    text="Similar"
                    category={ProductData?.category}
                  />
                )}
              </div>
            </div>

            {/* // signin / signup form */}
            <Box
              position="fixed"
              top={{ base: "5%", md: "10%" }}
              left={{ base: "5%", md: "10%", lg: "30%" }}
              right={{ base: "5%", md: "10%", lg: "30%" }}
              bottom={{ base: "5%", md: "10%" }}
              zIndex={990}
              bg="white"
              padding={{ base: "1rem", md: "1.5rem" }}
              borderRadius={{ base: "md", md: "lg" }}
              boxShadow="2xl"
              transform={SignInStateModal ? "translateY(0)" : "translateY(150%)"}
              visibility={SignInStateModal ? "visible" : "hidden"}
              transition="all 0.3s ease"
              maxHeight={{ base: "90vh", md: "80vh" }}
              overflowY="auto"
            >
              <Box
                position="absolute"
                top={{ base: "0.5rem", md: "1rem" }}
                right={{ base: "0.5rem", md: "1rem" }}
                onClick={() =>
                  setSignInStateModal((prev) => (prev ? false : true))
                }
                cursor="pointer"
                padding="0.5rem"
                _hover={{ bg: "gray.100", borderRadius: "md" }}
              >
                <AiOutlineClose size={{ base: 24, md: 30 }} />
              </Box>
              <SignIn redirect={null} callback={handleListeningToSignIn} />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Product;
