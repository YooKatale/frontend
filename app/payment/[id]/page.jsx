"use client";

import { useToast, Box, Flex, Text, SimpleGrid, keyframes } from "@chakra-ui/react";
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
import { Loader2, Check, Shield, CreditCard, Truck, Smartphone, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { DB_URL } from "@config/config";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Payment = ({ params }) => {
  const [Order, setOrder] = useState({});
  const [paymentDisplay, setPaymentDisplay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [CouponFormIsLoading, setCouponFormIsLoading] = useState(false);
  const [CouponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const [fetchOrder] = useOrderMutation();
  const [updateOrder] = useOrderUpdateMutation();
  const [validateCoupon] = useValidateCouponMutation();

  const chakraToast = useToast();
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const router = useRouter();

  const handleDataFetch = useCallback(async () => {
    // Only validate orderId - remove token requirement
    const orderId = params?.id;
    if (!orderId) {
      setIsOrderLoading(false);
      setOrderError("Order ID is missing from URL");
      return;
    }

    setIsOrderLoading(true);
    setOrderError(null);
    
    try {
      const res = await fetchOrder(orderId).unwrap();

      // Handle different response structures - be very flexible
      let orderData = null;
      
      if (res?.data) {
        orderData = res.data;
      } else if (res?._id || res?.id) {
        orderData = res;
      } else if (res?.order) {
        orderData = res.order;
      }

      // Validate we have order data with an ID
      if (!orderData || (!orderData._id && !orderData.id)) {
        throw new Error("Invalid order data received");
      }

      // Check if order already has a status (completed/paid) - redirect if so
      if (orderData.status && orderData.status !== "" && orderData.status !== "pending" && orderData.status !== "Pending") {
        router.push("/");
        return;
      }

      // Success - set order data
      setOrder(orderData);
      setShowPaymentOptions(true);
      setIsOrderLoading(false);
      
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Unable to load order details. Please try again.";
      setOrderError(errorMessage);
      setIsOrderLoading(false);
    }
  }, [params?.id, router, fetchOrder]);

  const fetchSubscriptionStatus = useCallback(async () => {
    // Only fetch if user is logged in - fail silently if not
    if (!userInfo?.token) {
      setIsSubscribed(false);
      return;
    }
    
    try {
      const response = await axios.get(
        `${DB_URL}/subscription`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (response.data?.isSubscribed) {
        setIsSubscribed(true);
      }
    } catch (error) {
      // Silently fail - subscription status is optional
      setIsSubscribed(false);
    }
  }, [userInfo?.token]);

  // Fetch order immediately when component mounts - no token requirement
  useEffect(() => {
    const orderId = params?.id;
    
    if (orderId) {
      // Fetch order immediately - don't wait for user token
      handleDataFetch();
      // Try to fetch subscription status if user is logged in (optional)
      if (userInfo?.token) {
        fetchSubscriptionStatus();
      }
    } else {
      setIsOrderLoading(false);
      setOrderError("Order ID is missing from URL");
    }
  }, [params?.id, handleDataFetch, fetchSubscriptionStatus, userInfo?.token]);

  const handlePayment = async () => {
    if (!paymentMethod || isLoading) return;
    
    setIsLoading(true);
  
    if (paymentMethod === "cash_on_delivery") {
      try {
        const res = await updateOrder({
          data: {
            payment: { paymentMethod: paymentMethod },
            order: params.id,
            schema: "schedule",
            user: userInfo || {},
          },
        }).unwrap();
    
        if (res?.status === "Success" || res?.status === "success") {
          chakraToast({
            description: "✅ Order placed successfully for Cash on Delivery!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setTimeout(() => router.push("/"), 1500);
        }
      } catch (err) {
        chakraToast({
          title: "Error",
          description: err.data?.message || err.data || err.error || "Payment failed. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (paymentMethod === "payLater") {
      try {
        const res = await updateOrder({
          data: {
            payment: {paymentMethod: paymentMethod},
            order: params.id,
            schema: "schedule",
            user: userInfo || {}
          }
        }).unwrap();
  
        if (res?.status === "success" || res?.status === "Success") {
          chakraToast({
            description: "✅ Order placed successfully for Pay Later!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setTimeout(() => router.push("/"), 1500);
        }   
      } catch (err) {
        chakraToast({
          title: "Error",
          description: err.data?.message || err.data || err.error || "Payment failed. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle other payment methods (card, mobile money)
      setPaymentDisplay(true);
      setIsLoading(false);
    }    
  };  
  
  const handleCallback = async (param) => {
    setPaymentDisplay(false);

    if (param.status == "error") {
      return chakraToast({
        description: param.message || "Payment failed. Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    try {
      const res = await updateOrder({
        data: {
          payment: { ...param.payment, paymentMethod },
          order: params.id,
          schema: "schedule",
          user: userInfo || {},
        },
      }).unwrap();

      if (res?.status == "Success" || res?.status == "success") {
        chakraToast({
          description: "🎉 Payment successful! Order confirmed.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => router.push("/"), 1500);
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message || err.data || err.error || "Payment confirmation failed. Please contact support.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleCouponFormSubmit = async (e) => {
    e.preventDefault();
    // Coupon is optional - only submit if code is provided
    if (!CouponCode.trim()) return;

    try {
      setCouponFormIsLoading(true);

      const res = await validateCoupon({
        couponCode: CouponCode,
        orderId: Order?._id,
      }).unwrap();

      if (res.status == "Success") {
        setCouponApplied(true);
        chakraToast({
          description: "🎉 Coupon applied successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        
        // Reset coupon applied after 3 seconds
        setTimeout(() => setCouponApplied(false), 3000);
        
        // Refetch order data
        handleDataFetch();
      }
      
      setCouponCode("");
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message || err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setCouponFormIsLoading(false);
    }
  };

  const paymentOptions = [
    {
      value: "mobileMoney",
      label: "Mobile Money",
      description: "Pay with MTN or Airtel Money",
      icon: <Smartphone className="w-6 h-6" />,
      logos: (
        <Flex gap={3} align="center">
          <Box as="img" src={PaymentLogos.mtn} alt="MTN" w="32px" h="32px" objectFit="contain" />
          <Box as="img" src={PaymentLogos.airtel} alt="Airtel" w="32px" h="32px" objectFit="contain" />
        </Flex>
      ),
      colorScheme: "purple",
    },
    {
      value: "card",
      label: "Debit/Credit Card",
      description: "Visa • Mastercard • Verve",
      icon: <CreditCard className="w-6 h-6" />,
      logos: null,
      colorScheme: "blue",
    },
    {
      value: "cash_on_delivery",
      label: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: <Truck className="w-6 h-6" />,
      logos: null,
      colorScheme: "green",
    },
    ...(isSubscribed ? [{
      value: "payLater",
      label: "Pay Later",
      description: "Exclusive for subscribers",
      icon: <Zap className="w-6 h-6" />,
      logos: null,
      colorScheme: "orange",
    }] : []),
  ];

  return (
    <Box minH="100vh" bgGradient="linear(to-b, gray.50, white)" pt={4} pb={12} px={4}>
      {/* Security Badge */}
      <Box maxW="lg" mx="auto" mb={6}>
        <Flex align="center" justify="center" gap={2} p={3} bg="white" borderRadius="lg" shadow="sm">
          <Shield className="w-5 h-5" style={{ color: ThemeColors.secondaryColor }} />
          <Text fontSize="sm" color="gray.600">
            Secure payment • Encrypted connection • No extra fees
          </Text>
        </Flex>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "32rem", margin: "0 auto" }}
      >
        <Box bg="white" borderRadius="2xl" shadow="xl" overflow="hidden" border="1px solid" borderColor="gray.100">
          {/* Header */}
          <Box bgGradient={`linear(to-r, ${ThemeColors.primaryColor}15, ${ThemeColors.secondaryColor}10)`} p={6} borderBottom="1px solid" borderColor="gray.100">
            <Flex direction="column" align="center" gap={2}>
              <Box w="48px" h="48px" borderRadius="full" bg={`${ThemeColors.primaryColor}15`} display="flex" alignItems="center" justifyContent="center">
                <CreditCard className="w-6 h-6" style={{ color: ThemeColors.primaryColor }} />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">Complete Payment</Text>
              <Text color="gray.500" textAlign="center">
                Order #{Order?._id?.slice(-8) || "..."}
              </Text>
            </Flex>
          </Box>

          {/* Order Summary */}
          {Order?._id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Box p={6} borderBottom="1px solid" borderColor="gray.100">
                <Box>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="lg" fontWeight="600" color="gray.700">
                      Total Amount
                    </Text>
                    <Box textAlign="right">
                      <Text fontSize="3xl" fontWeight="bold" color={ThemeColors.primaryColor}>
                        UGX {FormatCurr(Order?.total)}
                      </Text>
                      {Order?.discount > 0 && (
                        <Text fontSize="sm" color="green.600" mt={1}>
                          🎉 You saved UGX {FormatCurr(Order?.discount)}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {/* Coupon Section - Optional */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ paddingTop: "1rem", borderTop: "1px solid #e5e7eb", ...(couponApplied && { backgroundColor: "#f0fdf4", borderRadius: "0.5rem", padding: "1rem" }) }}
                  >
                    <Flex align="center" justify="space-between" mb={3}>
                      <Text fontWeight="600" color="gray.700">Have a coupon code? <Text as="span" fontSize="xs" color="gray.500" fontWeight="normal">(Optional)</Text></Text>
                      {couponApplied && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: ThemeColors.secondaryColor }}
                        >
                          <Check className="w-4 h-4" />
                          <Text fontSize="sm">Applied!</Text>
                        </motion.div>
                      )}
                    </Flex>
                    <form onSubmit={handleCouponFormSubmit}>
                      <Flex gap={2}>
                        <Input
                          type="text"
                          placeholder="Enter coupon code (optional)"
                          value={CouponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          style={{ flex: 1 }}
                          disabled={CouponFormIsLoading}
                        />
                        <ButtonComponent
                          text={CouponFormIsLoading ? "" : "Apply"}
                          size="md"
                          type="submit"
                          variant="outline"
                          icon={CouponFormIsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          disabled={CouponFormIsLoading || !CouponCode.trim()}
                        />
                      </Flex>
                    </form>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Payment Methods */}
          <Box p={6}>
            {isOrderLoading ? (
              <Box py={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box position="relative">
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: ThemeColors.primaryColor }} />
                </Box>
                <Text mt={4} color="gray.600">Loading your order details...</Text>
              </Box>
            ) : orderError ? (
              <Box py={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center">
                <Text fontSize="xl" fontWeight="semibold" color="red.600" mb={2}>
                  Unable to Load Order
                </Text>
                <Text color="gray.600" mb={4}>
                  {orderError}
                </Text>
                <ButtonComponent
                  text="Try Again"
                  size="md"
                  onClick={handleDataFetch}
                />
              </Box>
            ) : Order?._id ? (
              <>
                <Box mb={6}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                    Select Payment Method
                  </Text>
                  
                  <AnimatePresence>
                    {showPaymentOptions && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
                      >
                        {paymentOptions.map((option, index) => (
                          <motion.div
                            key={option.value}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Box
                              as="button"
                              type="button"
                              onClick={() => setPaymentMethod(option.value)}
                              w="100%"
                              p={4}
                              borderRadius="xl"
                              borderWidth="2px"
                              borderColor={paymentMethod === option.value ? ThemeColors.primaryColor : "gray.200"}
                              bg={paymentMethod === option.value ? `${ThemeColors.primaryColor}08` : "white"}
                              transition="all 0.2s"
                              _hover={{ 
                                borderColor: ThemeColors.primaryColor, 
                                bg: `${ThemeColors.primaryColor}08`,
                                transform: "translateY(-2px)"
                              }}
                            >
                              <Flex align="center" justify="space-between">
                                <Flex align="center" gap={3}>
                                  <Box p={2} borderRadius="lg" bg={paymentMethod === option.value ? ThemeColors.primaryColor : "gray.100"} color={paymentMethod === option.value ? "white" : "gray.600"}>
                                    {option.icon}
                                  </Box>
                                  <Box textAlign="left">
                                    <Text fontWeight="600" color="gray.800">
                                      {option.label}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                      {option.description}
                                    </Text>
                                  </Box>
                                </Flex>
                                <Flex align="center" gap={2}>
                                  {option.logos}
                                  {paymentMethod === option.value && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: ThemeColors.primaryColor, display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                      <Check className="w-3 h-3" style={{ color: "white" }} />
                                    </motion.div>
                                  )}
                                </Flex>
                              </Flex>
                            </Box>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>

                {/* Payment Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}
                >
                  <Box
                    as="button"
                    onClick={handlePayment}
                    disabled={!paymentMethod || isLoading}
                    w="100%"
                    py={4}
                    px={6}
                    borderRadius="xl"
                    fontWeight="semibold"
                    fontSize="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={3}
                    bgGradient={!paymentMethod || isLoading 
                      ? "linear(to-r, gray.200, gray.300)" 
                      : `linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                    color={!paymentMethod || isLoading ? "gray.400" : "white"}
                    shadow={!paymentMethod || isLoading ? "none" : "lg"}
                    cursor={!paymentMethod || isLoading ? "not-allowed" : "pointer"}
                    transition="all 0.3s"
                    _hover={!paymentMethod || isLoading ? {} : {
                      shadow: "xl",
                      transform: "scale(1.02)"
                    }}
                    _active={!paymentMethod || isLoading ? {} : {
                      transform: "scale(0.98)"
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === "cash_on_delivery" && <Truck className="w-5 h-5" />}
                        {paymentMethod === "payLater" && <Zap className="w-5 h-5" />}
                        {!["cash_on_delivery", "payLater"].includes(paymentMethod) && <CreditCard className="w-5 h-5" />}
                        {paymentMethod === "cash_on_delivery" ? "Place Order" : 
                         paymentMethod === "payLater" ? "Confirm Pay Later" : 
                         `Pay UGX ${FormatCurr(Order?.total)}`}
                      </>
                    )}
                  </Box>
                  
                  {paymentMethod && (
                    <Text fontSize="sm" color="gray.500" textAlign="center" mt={3}>
                      {paymentMethod === "cash_on_delivery" 
                        ? "You'll pay when your order arrives"
                        : paymentMethod === "payLater"
                        ? "Payment will be charged to your subscription"
                        : "You'll be redirected to a secure payment page"}
                    </Text>
                  )}
                </motion.div>
              </>
            ) : (
              <Box py={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box position="relative">
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: ThemeColors.primaryColor }} />
                </Box>
                <Text mt={4} color="gray.600">Loading your order details...</Text>
              </Box>
            )}
          </Box>

          {/* Security Footer */}
          <Box bg="gray.50" p={4} borderTop="1px solid" borderColor="gray.100">
            <Flex align="center" justify="center" gap={4}>
              <Text fontSize="xs" color="gray.500">
                🔒 256-bit SSL Encryption
              </Text>
              <Text fontSize="xs" color="gray.500">
                💳 Safe & Secure
              </Text>
              <Text fontSize="xs" color="gray.500">
                ⚡ Instant Confirmation
              </Text>
            </Flex>
          </Box>
        </Box>
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentDisplay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: "100%", maxWidth: "28rem" }}
            >
              <FlutterwavePayment
                data={{
                  total: Order?.total,
                  paymentMethod: paymentMethod,
                  title: "Delivery Schedule",
                  message: "You are making payment for the delivery schedule service",
                }}
                callback={handleCallback}
                closeComponent={() => setPaymentDisplay(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Payment;
