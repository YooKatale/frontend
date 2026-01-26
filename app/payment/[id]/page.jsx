"use client";

import { useToast, Box, Flex, Text, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import FlutterwavePayment from "@components/FlutterwavePayment";
import { Input } from "@components/ui/input";
import { PaymentLogos, ThemeColors } from "@constants/constants";
import {
  useOrderMutation,
  useOrderUpdateMutation,
  useValidateCouponMutation,
} from "@slices/productsApiSlice";
import { FormatCurr } from "@utils/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DB_URL } from "@config/config";
import axios from "axios";

const Payment = ({ params }) => {
  const [Order, setOrder] = useState({});
  const [paymentDisplay, setPaymentDisplay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [CouponFormIsLoading, setCouponFormIsLoading] = useState(false);

  const [CouponCode, setCouponCode] = useState("");

  const [fetchOrder] = useOrderMutation();
  const [updateOrder] = useOrderUpdateMutation();
  const [validateCoupon] = useValidateCouponMutation();

  const chakraToast = useToast();
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  // check if user logged in
  if (!userInfo || userInfo == {} || userInfo == "") {
    router.push("/signin");
  }

  const handleDataFetch = async () => {
    try {
      const res = await fetchOrder(params.id).unwrap();

      if (res.data?.status && res.data.status != "") {
        router.push("/");
        return;
      }

      if (res.status == "Success" || res.status == "success") {
        setOrder({ ...res.data });
      } else {
        throw new Error(res.message || "Failed to fetch order");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      chakraToast({
        title: "Error",
        description: error.data?.message || error.message || "Unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get(
        `${DB_URL}/subscription`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (response.data.isSubscribed) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Error fetching subscrption status:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
    handleDataFetch();
  }, [userInfo]);

  // function to display payment component
  const handlePayment = async () => {
    setIsLoading((prev) => (prev ? false : true));
  
    if (paymentMethod === "cash_on_delivery") {
      try {
        const res = await updateOrder({
          data: {
            payment: { paymentMethod: paymentMethod },
            order: params.id,
            schema: "schedule",
            user: userInfo,
          },
        }).unwrap();
    
        setIsLoading((prev) => (prev ? false : true));
    
        if (res?.status === "Success") {
          chakraToast({
            description: "Order successfully placed for Cash on Delivery.",
            status: "success",
            duration: 5000,
            isClosable: false,
          });
    
          router.push("/");
        }
      } catch (err) {
        console.error("Error:", err);
        setIsLoading((prev) => (prev ? false : true));
    
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
    } else if (paymentMethod === "payLater") {
      try {
        const res = await updateOrder({
          data: {
            payment: {paymentMethod: paymentMethod},
            order: params.id,
            schema: "schedule",
            user: userInfo
          }
        }).unwrap();
  
        setIsLoading((prev) => (prev ? false : true));
  
        if (res?.status === "success") {
          chakraToast({
            description: "Order successfully  placed for pay later",
            status: "success",
            duration: 5000,
            isClosable: false
          });
          router.push("/");
        }   
      } catch (err) {
        console.error("Error", err);
        setIsLoading((prev) => (prev ? false : true));

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
    }  else {
      // Handle other payment methods here
      setPaymentDisplay((prev) => true);
    }    
  };  
  
  const handleCallback = async (param) => {
    setPaymentDisplay((prev) => false);

    if (param.status == "error")
      return chakraToast({
        description:
          param.message || "Payment failed. Please refresh page and try again",
        status: "error",
        duration: 5000,
        isClosable: false,
      });

    try {
      const res = await updateOrder({
        data: {
          payment: { ...param.payment, paymentMethod },
          order: params.id,
          schema: "schedule",
          user: userInfo,
        },
      }).unwrap();

      setIsLoading((prev) => (prev ? false : true));

      if (res?.status == "Success") {
        chakraToast({
          description:
            "Payment successful, you're order has been placed. You will receive an email confirmation shortly",
          status: "success",
          duration: 5000,
          isClosable: false,
        });

        router.push("/");
      }
    } catch (err) {
      setIsLoading((prev) => (prev ? false : true));

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

  const handleCouponFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setCouponFormIsLoading((prev) => (prev ? false : true));

      const res = await validateCoupon({
        couponCode: CouponCode,
        orderId: Order?._id,
      }).unwrap();

      if (res.status == "Success")
        chakraToast({
          description: "Coupon Applied",
          status: "success",
          duration: 5000,
          isClosable: false,
        });

      setCouponCode("");

      // refetch order data
      handleDataFetch();
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
    } finally {
      setCouponFormIsLoading((prev) => (prev ? false : true));
    }
  };

  return (
    <div className="pt-[3rem] pb-[5rem]">
      <div className="flex">
        <div className="m-auto lg:w-3/5 sm:w-3/5 w-4/5 bg-white shadow-md px-6 py-10 min-h-[300px]">
          {Order?._id ? (
            <>
              <div className="py-2">
                <h3 className="text-center text-primary text-3xl">Checkout</h3>
              </div>

              <div className="py-2">
                <h3 className="text-2xl text-center">
                  Amount to be paid{" "}
                  <span className="text-primary font-bold">
                    UGX {FormatCurr(Order?.total)}
                  </span>
                </h3>
              </div>

              <div className="py-6 hidden">
                <div className="py-1">
                  <h3 className="text-center text-[1.3rem]">
                    Select payment option
                  </h3>
                </div>

                <div className="py-2">
                  <div className="flex justify-center items-center gap-4">
                    <PaymentCard
                      text={"Mobile Money"}
                      type={""}
                      paymentMethod={"mobileMoney"}
                    />
                    <PaymentCard
                      text={"Credit/Debit Card"}
                      type={""}
                      paymentMethod={"card"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="py-4 m-auto lg:w-2/5 sm:w-3/5 w-4/5">
                  <div className="py-1">
                    <h3 className="text-center text-lg">Apply Coupon</h3>
                  </div>

                  <div className="py-2">
                    <form onSubmit={handleCouponFormSubmit}>
                      <Input
                        type="text"
                        name="coupon"
                        placeholder="Enter coupon code"
                        onChange={(e) => setCouponCode(e.target.value)}
                        value={CouponCode}
                      />

                      <div className="py-2 flex justify-center">
                        <ButtonComponent
                          text={"Apply coupon"}
                          size={"lg"}
                          type={"submit"}
                          icon={CouponFormIsLoading && <Loader2 size={20} />}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <div className="py-1">
                  <h3 className="text-center text-[1.3rem]">
                    Select payment option
                  </h3>
                </div>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} maxW="500px" mx="auto" mt={4}>
                  {[
                    {
                      value: "mobileMoney",
                      label: "Mobile Money",
                      logos: (
                        <Flex gap={2} align="center" justify="center">
                          <Box as="img" src={PaymentLogos.mtn} alt="MTN" w="36px" h="36px" objectFit="contain" />
                          <Box as="img" src={PaymentLogos.airtel} alt="Airtel" w="36px" h="36px" objectFit="contain" />
                        </Flex>
                      ),
                    },
                    { value: "card", label: "Debit/Credit Card", logos: <Text fontSize="sm" color="gray.600">Visa • Mastercard</Text> },
                    { value: "cash_on_delivery", label: "Cash on Delivery", logos: <Text fontSize="sm" color="gray.600">Pay when you receive</Text> },
                    ...(isSubscribed ? [{ value: "payLater", label: "Pay Later", logos: <Text fontSize="sm" color="gray.600">For subscribers</Text> }] : []),
                  ].map((opt) => (
                    <Box
                      key={opt.value}
                      as="button"
                      type="button"
                      onClick={() => setPaymentMethod(opt.value)}
                      p={4}
                      borderRadius="lg"
                      borderWidth="2px"
                      borderColor={paymentMethod === opt.value ? ThemeColors.primaryColor : "gray.200"}
                      bg={paymentMethod === opt.value ? `${ThemeColors.primaryColor}08` : "white"}
                      textAlign="center"
                      _hover={{ borderColor: ThemeColors.primaryColor, bg: `${ThemeColors.primaryColor}08` }}
                      transition="all 0.2s"
                    >
                      <Box mb={1}>{opt.logos}</Box>
                      <Text fontWeight="600" color="gray.800">{opt.label}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </div>

              <div className="py-2 flex justify-center items-center">
                <div
                  onClick={() => paymentMethod && !isLoading && handlePayment()}
                  className={!paymentMethod || isLoading ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                >
                  <ButtonComponent
                    text={"Make Payment"}
                    size={"lg"}
                    type={"button"}
                    icon={isLoading && <Loader2 size={20} />}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center relative h-[250px]">
              <Loader2 size={30} className="text-primary absolute top-[45%]" />
            </div>
          )}
        </div>
      </div>

      {/* // displaying payment component */}
      {paymentDisplay && (
        <FlutterwavePayment
          data={{
            total: Order?.total,
            paymentMethod: paymentMethod,
            title: "Delivery Schedule",
            message: "You are making payment for the delivery schedule service",
          }}
          callback={handleCallback}
          closeComponent={setPaymentDisplay}
        />
      )}
    </div>
  );
};

export default Payment;
