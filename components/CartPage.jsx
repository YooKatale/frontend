// components/CartPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Stack,
  Icon,
  SlideFade,
  ScaleFade,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiShield,
  FiRefreshCcw,
} from "react-icons/fi";
import CartCard from "./CartCard";
import { FormatCurr } from "@utils/utils";
import { ThemeColors } from "@constants/constants";

const MotionBox = motion(Box);

function CartPage() {
  const { cart } = useSelector((state) => (state?.cart) ?? { cart: [] });
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let calculatedSubtotal = 0;
    cart.forEach((item) => {
      calculatedSubtotal += (item.price || 0) * (item.quantity || 1);
    });

    setSubtotal(calculatedSubtotal);

    const calculatedShipping = calculatedSubtotal > 50000 ? 0 : 2000;
    setShippingFee(calculatedShipping);

    const calculatedTax = calculatedSubtotal * 0.18;
    setTax(calculatedTax);

    setTotalPrice(calculatedSubtotal + calculatedShipping + calculatedTax);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCheckingOut(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push("/checkout");
    setIsCheckingOut(false);
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleClearCart = () => {
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <SlideFade in offsetY={20}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Flex align="center" gap={4}>
            <MotionBox
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiShoppingCart size={36} color={ThemeColors.primaryColor} />
            </MotionBox>
            <Box>
              <Heading size="xl" color="gray.800">
                Your Shopping Cart
              </Heading>
              <Text color="gray.600">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </Text>
            </Box>
          </Flex>

          <AnimatePresence>
            {cart.length > 0 && (
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  leftIcon={<FiRefreshCcw />}
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleClearCart}
                  _hover={{ bg: "red.50", color: "red.600" }}
                >
                  Clear Cart
                </Button>
              </MotionBox>
            )}
          </AnimatePresence>
        </Flex>

        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Cart Items Section */}
          <Box flex="1">
            <AnimatePresence mode="wait">
              {cart.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.cartId || item._id || item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <CartCard
                        cart={item}
                        ReduceProductQuantity={() => {}}
                        IncreaseProductQuantity={() => {}}
                        handleDeleteCartItem={() => {}}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <ScaleFade in>
                  <Box
                    textAlign="center"
                    py={20}
                    bg="white"
                    borderRadius="2xl"
                    shadow="md"
                  >
                    <FiShoppingCart
                      size={64}
                      color="#CBD5E0"
                      className="mx-auto mb-6"
                    />
                    <Heading size="lg" color="gray.400" mb={4}>
                      Your cart is empty
                    </Heading>
                    <Text color="gray.500" mb={8}>
                      Add some delicious products to get started!
                    </Text>
                    <Button
                      bg={ThemeColors.primaryColor}
                      color="white"
                      size="lg"
                      rightIcon={<FiArrowRight />}
                      onClick={handleContinueShopping}
                      _hover={{
                        bg: ThemeColors.secondaryColor,
                        transform: "translateY(-1px)",
                        shadow: "md",
                      }}
                      transition="all 0.2s"
                    >
                      Continue Shopping
                    </Button>
                  </Box>
                </ScaleFade>
              )}
            </AnimatePresence>
          </Box>

          {/* Order Summary */}
          <AnimatePresence>
            {cart.length > 0 && (
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                width={{ base: "100%", lg: "400px" }}
              >
                <Box
                  bg="white"
                  borderRadius="2xl"
                  shadow="xl"
                  p={6}
                  position="sticky"
                  top={24}
                >
                  <Heading size="lg" mb={6} color="gray.800">
                    Order Summary
                  </Heading>

                  {/* Benefits */}
                  <Stack spacing={3} mb={6}>
                    <Flex align="center" gap={3}>
                      <Icon as={FiTruck} color={ThemeColors.primaryColor} />
                      <Text fontSize="sm" color="gray.600">
                        Free shipping on orders over UGX 50,000
                      </Text>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <Icon as={FiPackage} color={ThemeColors.primaryColor} />
                      <Text fontSize="sm" color="gray.600">
                        Fresh products delivered daily
                      </Text>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <Icon as={FiShield} color={ThemeColors.primaryColor} />
                      <Text fontSize="sm" color="gray.600">
                        Secure checkout & 100% satisfaction
                      </Text>
                    </Flex>
                  </Stack>

                  <Divider my={4} />

                  {/* Price Breakdown */}
                  <Stack spacing={3} mb={6}>
                    <Flex justify="space-between">
                      <Text color="gray.600">Subtotal</Text>
                      <Text fontWeight="semibold">UGX {FormatCurr(subtotal)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Shipping</Text>
                      <Text
                        fontWeight="semibold"
                        color={
                          shippingFee === 0
                            ? ThemeColors.primaryColor
                            : "gray.700"
                        }
                      >
                        {shippingFee === 0
                          ? "FREE"
                          : `UGX ${FormatCurr(shippingFee)}`}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Tax (18%)</Text>
                      <Text fontWeight="semibold">
                        UGX {FormatCurr(tax)}
                      </Text>
                    </Flex>
                  </Stack>

                  <Divider my={4} />

                  {/* Total */}
                  <Flex justify="space-between" mb={6}>
                    <Text fontSize="lg" fontWeight="bold">
                      Total
                    </Text>
                    <Box textAlign="right">
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color={ThemeColors.primaryColor}
                      >
                        UGX {FormatCurr(totalPrice)}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Including VAT & shipping
                      </Text>
                    </Box>
                  </Flex>

                  {/* Checkout Button */}
                  <MotionBox
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      bgGradient={`linear(to-br, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                      color="white"
                      size="lg"
                      width="full"
                      rightIcon={<FiArrowRight />}
                      onClick={handleCheckout}
                      isLoading={isCheckingOut}
                      loadingText="Processing..."
                      _hover={{
                        bgGradient: `linear(to-br, ${ThemeColors.secondaryColor}, ${ThemeColors.primaryColor})`,
                        shadow: "lg",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.3s"
                      shadow="md"
                    >
                      Proceed to Checkout
                    </Button>
                  </MotionBox>

                  {/* Security Notice */}
                  <Alert status="info" variant="subtle" mt={4} borderRadius="md">
                    <AlertIcon color={ThemeColors.primaryColor} />
                    <AlertDescription fontSize="xs">
                      Your payment information is secure and encrypted
                    </AlertDescription>
                  </Alert>

                  {/* Continue Shopping */}
                  <Button
                    variant="ghost"
                    width="full"
                    mt={4}
                    onClick={handleContinueShopping}
                    color={ThemeColors.primaryColor}
                    _hover={{
                      bg: `${ThemeColors.primaryColor}15`,
                      color: ThemeColors.secondaryColor,
                    }}
                  >
                    Continue Shopping
                  </Button>
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>
        </Flex>
      </SlideFade>
    </Box>
  );
}

export default CartPage;
