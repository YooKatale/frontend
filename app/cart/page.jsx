"use client";

import {
  Box,
  Heading,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  SlideFade,
  Flex,
  Text,
  Badge,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TabOne from "@components/modals/tabs/TabOne";
import TabTwo from "@components/modals/tabs/TabTwo";
import {
  useCartDeleteMutation,
  useCartMutation,
  useCartUpdateMutation,
} from "@slices/productsApiSlice";
import CartCard from "@components/CartCard";
import { FormatCurr } from "@utils/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiTag,
  FiArrowRight,
  FiShoppingCart,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import { TbShoppingCartOff } from "react-icons/tb";

const MotionBox = motion(Box);

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabOneData, setTabOneData] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCartUpdating, setIsCartUpdating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { onOpen, onClose, isOpen } = useDisclosure();
  const { userInfo } = useSelector((state) => state.auth);

  const [fetchCart] = useCartMutation();
  const [deleteCartItem] = useCartDeleteMutation();
  const [updateCartItem] = useCartUpdateMutation();

  const chakraToast = useToast();

  const handleDataFetch = async () => {
    setIsCartUpdating(true);
    try {
      const res = await fetchCart(userInfo?._id).unwrap();

      if (res.status && res.status === "Success") {
        const CartItems = res?.data.CartItems || [];
        const CartProductsItems = res?.data.CartProductsItems || [];
        const TempCart = [];

        if (CartItems?.length > 0 && CartProductsItems?.length > 0) {
          for (const cartItem of CartItems) {
            const cartId = cartItem._id || cartItem.cartId || cartItem.id;
            if (!cartId) continue;

            const quantity = cartItem.quantity && cartItem.quantity > 0 ? cartItem.quantity : 1;
            const productData = CartProductsItems.find(
              (product) => product._id === cartItem.productId
            );

            if (productData) {
              TempCart.push({
                ...cartItem,
                cartId,
                _id: cartItem._id || cartId,
                quantity,
                ...productData,
              });
            }
          }
        }

        setCart([...TempCart]);
        calcCartTotal([...TempCart]);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsCartUpdating(false);
    }
  };

  const calcCartTotal = (param) => {
    let newCartTotal = 0;
    if (param) {
      newCartTotal = param.reduce((a, b) => {
        return a + parseInt(b?.price || 0) * parseInt(b?.quantity || 1);
      }, 0);
    } else {
      newCartTotal = cart.reduce((a, b) => {
        return a + parseInt(b?.price || 0) * parseInt(b?.quantity || 1);
      }, 0);
    }
    setCartTotal(newCartTotal);
  };

  const handleDeleteCartItem = async (id) => {
    try {
      const res = await deleteCartItem(id).unwrap();

      if (res?.status && res?.status === "Success") {
        chakraToast({
          title: "Removed",
          description: "Item removed from cart",
          status: "success",
          duration: 3000,
          position: "bottom-right",
          isClosable: true,
        });
        handleDataFetch();
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message || "Failed to remove item",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const updateQuantity = async (id, operation) => {
    const currentProductIndex = cart.findIndex((item) => item.cartId === id || item._id === id);

    if (currentProductIndex === -1) return;

    const actualCartId = cart[currentProductIndex].cartId || cart[currentProductIndex]._id;
    if (!actualCartId) return;

    const currentQuantity = cart[currentProductIndex].quantity;
    let newQuantity = currentQuantity;

    if (operation === "increase") {
      newQuantity = currentQuantity + 1;
    } else if (operation === "decrease" && currentQuantity > 1) {
      newQuantity = currentQuantity - 1;
    } else {
      return;
    }

    const updatedCart = [...cart];
    updatedCart[currentProductIndex] = {
      ...updatedCart[currentProductIndex],
      quantity: newQuantity,
    };
    setCart(updatedCart);
    calcCartTotal(updatedCart);

    try {
      await updateCartItem({
        cartId: actualCartId,
        quantity: newQuantity,
        userId: userInfo?._id,
      }).unwrap();
    } catch (err) {
      const revertedCart = [...cart];
      setCart(revertedCart);
      calcCartTotal(revertedCart);
      chakraToast({
        title: "Error",
        description: "Failed to update quantity",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      chakraToast({
        title: "Invalid Code",
        description: "Please enter a coupon code",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsApplyingCoupon(true);
    setTimeout(() => {
      if (couponCode.toUpperCase() === "YOO10") {
        const discount = cartTotal * 0.1;
        setDiscountAmount(discount);
        chakraToast({
          title: "Coupon Applied!",
          description: "10% discount has been applied",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        chakraToast({
          title: "Invalid Coupon",
          description: "The coupon code is not valid",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsApplyingCoupon(false);
    }, 1500);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      onOpen();
      setIsCheckingOut(false);
    }, 800);
  };

  const clearCart = async () => {
    if (cart.length === 0) return;

    setIsCartUpdating(true);
    try {
      await Promise.all(
        cart.map((item) => deleteCartItem(item.cartId || item._id).unwrap())
      );

      setCart([]);
      setCartTotal(0);
      setDiscountAmount(0);

      chakraToast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart",
        status: "info",
        duration: 3000,
        position: "bottom-right",
        isClosable: true,
      });
    } catch (error) {
      chakraToast({
        title: "Error",
        description: "Failed to clear cart",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    } finally {
      setIsCartUpdating(false);
    }
  };

  useEffect(() => {
    handleDataFetch();
  }, []);

  const finalTotal = cartTotal - discountAmount;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      minH="calc(100vh - 80px)"
      bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
    >
      <Box
        padding={{
          base: "1rem 1rem 3rem",
          md: "2rem 2rem 4rem",
          xl: "2rem 4rem",
        }}
        maxW="1400px"
        mx="auto"
      >
        {/* Header */}
        <SlideFade in offsetY="20px">
          <Flex
            justify="space-between"
            align="center"
            mb={{ base: 4, md: 8 }}
            flexDir={{ base: "column", md: "row" }}
            gap={4}
          >
            <Flex align="center" gap={3}>
              <MotionBox
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiShoppingBag size={32} color={ThemeColors.primaryColor} />
              </MotionBox>
              <Box>
                <Heading
                  as="h1"
                  size="xl"
                  bgGradient="linear(to-r, blue.600, purple.600)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  Your Shopping Cart
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
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
                    variant="outline"
                    colorScheme="red"
                    leftIcon={<FiRefreshCw />}
                    onClick={clearCart}
                    isLoading={isCartUpdating}
                    size="md"
                  >
                    Clear All
                  </Button>
                </MotionBox>
              )}
            </AnimatePresence>
          </Flex>
        </SlideFade>

        <Flex direction={{ base: "column", lg: "row" }} gap={6} align="flex-start">
          {/* Cart Items Section */}
          <Box
            flex={{ base: "1", lg: "0.7" }}
            w="full"
            bg="white"
            rounded="2xl"
            shadow="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
          >
            <Box
              p={{ base: 4, md: 6 }}
              maxH={{ base: "auto", md: "600px" }}
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "4px" },
                "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
                "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
              }}
            >
              <AnimatePresence mode="wait">
                {cart.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.cartId || item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <CartCard
                          cart={item}
                          ReduceProductQuantity={() =>
                            updateQuantity(item.cartId || item._id, "decrease")
                          }
                          IncreaseProductQuantity={() =>
                            updateQuantity(item.cartId || item._id, "increase")
                          }
                          handleDeleteCartItem={() =>
                            handleDeleteCartItem(item.cartId || item._id)
                          }
                        />
                        {index < cart.length - 1 && <Divider my={4} opacity={0.3} />}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box py={20} textAlign="center">
                      <MotionBox
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        mb={6}
                      >
                        <TbShoppingCartOff size={80} color="#CBD5E0" />
                      </MotionBox>
                      <Heading size="lg" color="gray.400" mb={4}>
                        Your cart is empty
                      </Heading>
                      <Text color="gray.500" mb={8}>
                        Add some delicious products to get started!
                      </Text>
                      <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/">
                          <Button
                            colorScheme="blue"
                            size="lg"
                            leftIcon={<FiShoppingCart />}
                            as="span"
                          >
                            Start Shopping
                          </Button>
                        </Link>
                      </MotionBox>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>

          {/* Order Summary Section */}
          <AnimatePresence>
            {cart.length > 0 && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                flex={{ base: "1", lg: "0.3" }}
                w="full"
                position={{ base: "sticky", lg: "static" }}
                top={{ base: "0", lg: "auto" }}
                zIndex={10}
              >
                <Box
                  bg="white"
                  rounded="2xl"
                  shadow="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  p={{ base: 4, md: 6 }}
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    w="120px"
                    h="120px"
                    bgGradient="linear(45deg, blue.50, purple.50)"
                    roundedBottomLeft="full"
                    opacity={0.3}
                  />

                  <Heading size="lg" mb={6} position="relative">
                    Order Summary
                  </Heading>

                  <Box mb={6}>
                    <Flex align="center" gap={2} mb={2}>
                      <FiTag color={ThemeColors.primaryColor} size={18} />
                      <Text fontWeight="semibold">Have a coupon?</Text>
                    </Flex>
                    <Flex gap={2}>
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        variant="filled"
                        rounded="lg"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={applyCoupon}
                        isLoading={isApplyingCoupon}
                      >
                        Apply
                      </Button>
                    </Flex>
                  </Box>

                  <Box mb={6}>
                    <Flex justify="space-between" mb={2}>
                      <Text color="gray.600">Subtotal</Text>
                      <Text fontWeight="semibold">UGX {FormatCurr(cartTotal)}</Text>
                    </Flex>

                    <Flex justify="space-between" mb={2}>
                      <Flex align="center" gap={1}>
                        <Text color="gray.600">Shipping</Text>
                        <Badge colorScheme="green" size="sm">
                          FREE
                        </Badge>
                      </Flex>
                      <Text fontWeight="semibold">UGX 0</Text>
                    </Flex>

                    {discountAmount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Flex justify="space-between" mb={2}>
                          <Text color="green.600">Discount</Text>
                          <Text fontWeight="semibold" color="green.600">
                            -UGX {FormatCurr(discountAmount)}
                          </Text>
                        </Flex>
                      </motion.div>
                    )}

                    <Divider my={3} />

                    <Flex justify="space-between" mb={4}>
                      <Text fontSize="lg" fontWeight="bold">
                        Total
                      </Text>
                      <Box textAlign="right">
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">
                          UGX {FormatCurr(finalTotal)}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Including VAT
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      w="full"
                      size="lg"
                      colorScheme="blue"
                      bgGradient="linear(to-r, blue.500, purple.500)"
                      _hover={{
                        bgGradient: "linear(to-r, blue.600, purple.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.3s"
                      shadow="md"
                      rightIcon={<FiArrowRight />}
                      onClick={handleCheckout}
                      isLoading={isCheckingOut}
                      loadingText="Processing..."
                    >
                      Proceed to Checkout
                    </Button>
                  </MotionBox>

                  <Box mt={4} textAlign="center">
                    <Link href="/">
                      <Text
                        color="blue.500"
                        _hover={{ color: "blue.600", textDecoration: "underline" }}
                        transition="color 0.2s"
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                      >
                        Continue Shopping
                        <FiChevronRight />
                      </Text>
                    </Link>
                  </Box>
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>
        </Flex>
      </Box>

      {/* Checkout Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent
          rounded="2xl"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
          shadow="2xl"
        >
          <ModalCloseButton
            size="lg"
            color="white"
            bg="blackAlpha.300"
            _hover={{ bg: "blackAlpha.400" }}
            zIndex={10}
          />
          <Box
            bgGradient="linear(to-r, blue.500, purple.600)"
            p={4}
            color="white"
          >
            <Heading size="md" textAlign="center">
              Complete Your Purchase
            </Heading>
          </Box>
          <Box p={{ base: 4, md: 8 }}>
            <AnimatePresence mode="wait">
              {tabIndex === 0 && (
                <motion.div
                  key="tab1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabOne
                    updateTabIndex={setTabIndex}
                    fetchData={setTabOneData}
                  />
                </motion.div>
              )}

              {tabIndex === 1 && (
                <motion.div
                  key="tab2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabTwo
                    Cart={cart}
                    updateTabIndex={setTabIndex}
                    tabOneData={tabOneData}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};

export default Cart;
