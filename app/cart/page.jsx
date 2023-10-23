"use client";

import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import { Images, ThemeColors } from "@constants/constants";
// import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { redirect, useRouter } from "next/navigation";
import TabOne from "@components/modals/tabs/TabOne";
import TabTwo from "@components/modals/tabs/TabTwo";
import Header from "@components/Header";

import {
  useCartDeleteMutation,
  useCartMutation,
} from "@slices/productsApiSlice";
import CartCard from "@components/CartCard";
import { FormatCurr } from "@utils/utils";
import Link from "next/link";

const Cart = () => {
  const [Cart, setCart] = useState([]);
  const [CartTotal, setCartTotal] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabOneData, setTabOneData] = useState({});

  const { onOpen, onClose, isOpen } = useDisclosure();

  const { userInfo } = useSelector((state) => state.auth);

  const [fetchCart] = useCartMutation();
  const [deleteCartItem] = useCartDeleteMutation();

  const chakraToast = useToast();
  const router = useRouter();

  const handleDataFetch = async () => {
    const res = await fetchCart(userInfo?._id).unwrap();

    try {
      if (res.status && res.status == "Success") {
        
        let CartItems = res?.data.CartItems ? res?.data.CartItems : [];
        let CartProductsItems = res?.data.CartProductsItems
          ? res?.data.CartProductsItems
          : [];

        const TempCart = [];

        // loop through the arrays and combine the data
        if (CartItems?.length > 0 && CartProductsItems?.length > 0) {
          for (let cart of CartItems) {
            TempCart.push({
              ...cart,
              cartId: cart._id,
              ...CartProductsItems.filter(
                (product) => product._id === cart.productId
              )[0],
            });
          }
        }

        setCart([...TempCart]);

        calcCartTotal([...TempCart]);
      } else {
        CartProductsItems = [];
      }

      // setCart(CartProductsItems);
    } catch (error) {
      console.log(error);
    }
  };

  // function to calculate the cart total
  const calcCartTotal = (param) => {
    let newCartTotal = [];
    if (param) {
      newCartTotal = param.reduce((a, b) => {
        return a + parseInt(b?.price) * parseInt(b?.quantity);
      }, 0);
    } else {
      newCartTotal = Cart.reduce((a, b) => {
        return a + parseInt(b?.price) * parseInt(b?.quantity);
      }, 0);
    }

    setCartTotal((prevState) => newCartTotal);
  };

  // function to delete cart item
  const handleDeleteCartItem = async (id) => {
    try {
      const res = await deleteCartItem(id).unwrap();

      if (res?.status && res?.status == "Success") {
        chakraToast({
          title: "Success",
          description: `Successfully deleted item`,
          status: "success",
          duration: 4000,
          isClosable: false,
        });

        handleDataFetch();
        calcCartTotal();
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message
          ? err.data?.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const IncreaseProductQuantity = (id) => {
    const currentProductIndex = Cart.findIndex((cart) => cart.cartId === id);
  
    const updatedProduct = {
      ...Cart[currentProductIndex],
      quantity: Cart[currentProductIndex].quantity + 1,
    };
  
    const updatedCart = [...Cart];
    updatedCart[currentProductIndex] = updatedProduct;
  
    setCart(updatedCart);
  
    calcCartTotal(updatedCart);
  };
  
  const ReduceProductQuantity = (id) => {
    const currentProductIndex = Cart.findIndex((cart) => cart.cartId === id);
  
    if (Cart[currentProductIndex].quantity > 1) {
      const updatedProduct = {
        ...Cart[currentProductIndex],
        quantity: Cart[currentProductIndex].quantity - 1,
      };
  
      const updatedCart = [...Cart];
      updatedCart[currentProductIndex] = updatedProduct;
  
      setCart(updatedCart);
  
      calcCartTotal(updatedCart);
    }
  };
  
  useEffect(() => {
    handleDataFetch();
    calcCartTotal();
  }, []);

  return (
    <>
      <Box>
        <Box
          padding={{
            base: "1rem 2rem 5rem 2rem",
            md: "1rem 2rem 5rem 2rem",
            xl: "1rem 2rem",
          }}
        >
          <div className="lg:py-0 lg:px-8 px-0 py-0">
            <h2 className="text-2xl font-semibold">Your Cart</h2>
          </div>
          <div className="lg:py-4 lg:px-12 pt-4 pb-12 px-0 overflow-x-0">
            <div className="flex lg:flex-row flex-col">
              <div className="lg:w-[70%] w-full lg:pb-12 pb-4 pt-4">
                <div className="max-h-[550px] overflow-y-auto lg:overflow-y-hidden">
                  {Cart.length > 0 ? (
                    Cart.map((cart, index) => (
                      <CartCard
                        key={index}
                        cart={cart}
                        ReduceProductQuantity={ReduceProductQuantity}
                        IncreaseProductQuantity={IncreaseProductQuantity}
                        handleDeleteCartItem={handleDeleteCartItem}
                      />
                    ))
                  ) : (
                    <div className="py-16 flex justify-center items-center">
                      <div className="flex">
                        <h3 className="text-center text-4xl text-[#cacaca]">
                          Your cart is empty
                        </h3>

                        <div className="px-4">
                          <Link href={"/"}>
                            <ButtonComponent
                              text={"Add products"}
                              type={"button"}
                              size={"lg"}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:w-[30%] w-full">
                {Cart.length > 0 ? (
                  <div className="lg:py-4 lg:px-4 py-0 px-2">
                    <div className="">
                      <div className="hidden mb-4">
                        <div className="p-4 border-[1.9px] border-light rounded-md">
                          <div className="py-1">
                            <h2 className="text-lg font-bold">
                              Discount Coupon
                            </h2>
                          </div>

                          <div className="py-1">
                            <form>
                              <FormControl>
                                <Input
                                  name="coupon"
                                  type="text"
                                  id="coupon"
                                  placeholder="Coupon"
                                />
                                <div className="py-2">
                                  <ButtonComponent
                                    text={"Apply Coupon"}
                                    type={"submit"}
                                  />
                                </div>
                              </FormControl>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div className="border-[1.9px] border-light rounded-md p-4">
                        <div>
                          <div className="py-2 border-b-[1.9px] border-b-light">
                            <div className="flex">
                              <h2 className="text-lg">Cart Items:</h2>
                              <p className="text-lg mx-2">
                                {Cart ? Cart?.length : 0}
                              </p>
                            </div>
                          </div>

                          <div className="py-2 border-b-[1.9px] border-b-light">
                            <div className="flex">
                              <h2 className="text-lg">Cart SubTotal:</h2>
                              <p className="text-lg mx-2">
                                UGX {FormatCurr(CartTotal)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <div className="w-[5rem]" onClick={onOpen}>
                            <ButtonComponent
                              text={"Checkout"}
                              type={"submit"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </Box>
      </Box>

      {/* // modal form */}
      <Box>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={"4xl"}
          padding={"1rem 0"}
        >
          {/* <ModalOverlay /> */}
          <ModalContent padding={"2rem 3rem"}>
            <ModalCloseButton size={"lg"} color={ThemeColors.darkColor} />
            <Box padding={"1rem 0"}>
              {tabIndex === 0 && (
                <TabOne
                  updateTabIndex={setTabIndex}
                  fetchData={setTabOneData}
                />
              )}

              {tabIndex === 1 && (
                <TabTwo
                  Cart={Cart}
                  updateTabIndex={setTabIndex}
                  tabOneData={tabOneData}
                />
              )}
            </Box>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default Cart;
