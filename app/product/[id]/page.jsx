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
      console.log({ error });
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
    setQuantity((prev, curr) => (curr = prev + 1));
  };

  //handle reduce quantity
  const handleDecreaseQuantity = () => {
    if (quantity !== 1) setQuantity((prev, curr) => (curr = prev - 1));
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

      setSignInStateModal((prev) => (prev ? false : true));

      // set loading to be false
      setLoading((prevState) => (prevState ? false : true));

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
      <Box>
        <Box padding={"0 2rem"}>
          <Box paddingBottom={"1rem"}>
            <Heading as={"h2"} size={"sm"} display={"flex"}>
              Home/product/
              <Heading as={"h2"} size={"sm"} color={ThemeColors.darkColor}>
                {ProductData?.category ? ProductData?.category : "category"}
              </Heading>
            </Heading>
          </Box>

          <Box padding={{ base: "1rem 0", md: "1rem 0", xl: "1rem 2rem" }}>
            <Flex
              borderTop={"1.7px solid " + ThemeColors.lightColor}
              direction={{ base: "column", md: "column", xl: "row" }}
            >
              <Box width={{ base: "100%", md: "90%", xl: "45%" }}>
                <Box id="main-product-image" position={"relative"}>
                  <Box
                    position="relative"
                    width="100%"
                    height={{ base: "300px", md: "400px", lg: "500px" }}
                    borderRadius="xl"
                    overflow="hidden"
                    bg="gray.50"
                    boxShadow="md"
                    border="1px solid"
                    borderColor="gray.200"
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
                  <Box padding={"1rem 0"}>
                    <Grid
                      gridTemplateColumns={{
                        base: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)",
                        lg: "repeat(5, 1fr)",
                      }}
                      gap={3}
                    >
                      {ProductData?.images && ProductData?.images.length > 0
                        ? ProductData.images.map((image, index) => (
                            <Box
                              key={index}
                              position="relative"
                              height={{ base: "80px", md: "100px" }}
                              borderRadius="lg"
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
            <div
              className={`fixed top-[10%] lg:left-[30%] left-[5%] lg:right-[30%] right-[5%] bottom-[10%] z-[990] bg-light py-6 rounded-md shadow-md ${
                SignInStateModal
                  ? "visible translate-y-0"
                  : "invisible translate-y-[150%]"
              }`}
            >
              <div
                className="absolute top-4 right-4"
                onClick={() =>
                  setSignInStateModal((prev) => (prev ? false : true))
                }
              >
                <AiOutlineClose size={30} style={{ cursor: "pointer" }} />
              </div>
              <SignIn redirect={null} callback={handleListeningToSignIn} />
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Product;
