"use client";

import {
  Box,
  Flex,
  Grid,
  Heading,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import { ThemeColors } from "@constants/constants";
import { useCartCheckoutMutation } from "@slices/productsApiSlice";
import { FormatCurr } from "@utils/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const TabTwo = ({ Cart, updateTabIndex, tabOneData }) => {
  const [CartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [createCartCheckout] = useCartCheckoutMutation();
  const router = useRouter();
  const chakraToast = useToast();
  const { userInfo } = useSelector((state) => state.auth);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [receiptId, setReceiptId] = useState("");

  // function to calculate the cart total
  const calcCartTotal = () => {
    const newCartTotal = Cart.reduce((a, b) => {
      return a + parseInt(b?.price) * parseInt(b?.quantity);
    }, 0);

    setCartTotal((prevState) => newCartTotal);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toDateString();
    const time = now.toLocaleTimeString();
    return `${date}, ${time}`;
  }

  function generateReceiptNumber() {
    
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 1000);
    const receiptNum = `R${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${randomNum}`;
    return receiptNum;
  }
  useEffect(() => {
    calcCartTotal();
    setCurrentDateTime(getCurrentDateTime());
    setReceiptId(generateReceiptNumber());
  }, []);

  const handleSubmit = async () => {
    setIsLoading((prevState) => (prevState ? false : true));

    try {
      const res = await createCartCheckout({
        user: userInfo,
        customerName: `${userInfo.firstname} ${userInfo.lastname}`,
        Carts: Cart,
        order: {
          orderTotal: CartTotal + 1000,
          deliveryAddress: tabOneData.deliveryAddress,
          specialRequests: tabOneData.specialRequests,
          payment: { paymentMethod: "", transactionId: "" },
          orderDate: currentDateTime,
          receiptId: receiptId,
        },
      });

      setIsLoading((prevState) => (prevState ? false : true));

      router.push(`/payment/${res.data.data.Order}`);
    } catch (err) {
      setIsLoading((prevState) => (prevState ? false : true));

      chakraToast({
        title: "Error",
        description: err.data?.message
          ? err.data?.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <>
      <div>
        <div className="flex">
         <Image src="/assets/icons/logo.jpg" width={50} height={50} />
         <h2>Yookatale</h2>
        </div>
        <p>
          Authorized By: Seconds Tech Limited<br />
          P.O. Box 74940, Clock Tower, Kampala, Naguru (U)
        </p>
        <div className="py-4">
          <h3 className="text-lg text-center">Checkout summary</h3>
        </div>
         <div>
            Customer Name: {userInfo.firstname} {userInfo.lastname}
         </div>
         <div>
          Date and Time: {currentDateTime}
         </div>

        <div className="py-4 max-h-[300px] overflow-y-auto">
          <h3 className="text-lg">Products</h3>
          {Cart.length > 0
            ? Cart.map((cart, index) => (
                <div
                  className="py-2 mb-[0.3rem] border-b-2 border-b-light"
                  key={index}
                >
                  <div>
                    <p className="text-lg">
                      Product: {cart?.name ? cart.name : "__"}
                    </p>
                  </div>

                  <div className="py-2">
                    <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                      <div>
                        <p className="text-lg">
                          Quantity: {cart?.quantity ? cart.quantity : "__"}
                        </p>
                      </div>

                      <div>
                        <p className="text-lg">
                          Total:{" "}
                          {cart?.price
                            ? `UGX ${FormatCurr(
                                parseInt(cart.price) * parseInt(cart.quantity)
                              )}`
                            : "__"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div className="py-4 border-b-2 border-b-light">
            <div>
              <h3 className="text-base font-bold">Delivery Addresses</h3>
            </div>

            <div>
              <div className="py-4">
                <p className="text-lg">
                  Address 1:{" "}
                  {tabOneData?.deliveryAddress?.address1
                    ? tabOneData?.deliveryAddress?.address1
                    : "__"}
                </p>
              </div>

              <div className="py-4">
                <p className="text-lg">
                  Address 2:{" "}
                  {tabOneData?.deliveryAddress?.address2
                    ? tabOneData?.deliveryAddress?.address2
                    : "__"}
                </p>
              </div>
            </div>
          </div>
          <Box
            padding={"1rem 0"}
            borderBottom={"1.7px solid " + ThemeColors.lightColor}
          >
            <Box>
              <Heading as={"h3"} size={"sm"}>
                Special Requests
              </Heading>
            </Box>
            <Box padding={""}>
              <Box padding={"0.5rem 0"}>
                <Text fontSize={"md"}>
                  Peel Food:{" "}
                  {tabOneData?.specialRequests?.peeledFood ? "Yes" : "No"}
                </Text>
              </Box>
              {tabOneData?.specialRequests?.moreInfo ? (
                tabOneData?.specialRequests?.moreInfo !== "" ? (
                  <Box padding={"0.5rem 0"}>
                    <Text fontSize={"md"}>
                      More Information: {tabOneData?.specialRequests?.moreInfo}
                    </Text>
                  </Box>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </Box>
          </Box>
        </div>
        <Box
          padding={"1rem 0"}
          borderBottom={"1.7px solid " + ThemeColors.lightColor}
        >
          <Heading as={"h3"} size={"sm"} display={"flex"}>
            Delivery Cost:{" "}
            <Text
              fontSize={"lg"}
              className="secondary-light-font"
              margin={"0 0.3rem"}
            >
              UGX 3500
            </Text>
          </Heading>
        </Box>
        <Box
          padding={"1rem 0"}
          borderBottom={"1.7px solid " + ThemeColors.lightColor}
        >
          <Text margin={"1rem 0"} fontSize={"lg"}>
            Cart SubTotal: UGX {FormatCurr(CartTotal)}
          </Text>
          <Heading as={"h3"} size={"md"}>
            Cart Total: UGX {FormatCurr(CartTotal + 3500)}
          </Heading>
        </Box>
        <Box
          padding={"1rem 0"}
        >
          <Text margin={"1rem 0"} fontSize={"lg"} className="text-semibold">
             Receipt Number:: {receiptId}          
          </Text>
        </Box>
        <Box padding={"1rem 0"}>
          <Flex>
            <Box onClick={() => updateTabIndex(0)}>
              <ButtonComponent type={"button"} text={"Back"} />
            </Box>
            <Spacer />
            <Box onClick={handleSubmit}>
              <ButtonComponent
                type={"button"}
                text={"Proceed to checkout"}
                icon={isLoading && <Loader2 size={20} />}
              />
            </Box>
          </Flex>
        </Box>
      </div>
    </>
  );
};

export default TabTwo;
