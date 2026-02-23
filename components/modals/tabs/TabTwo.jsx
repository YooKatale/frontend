"use client";

/**
 * Receipt / review step — shown in the checkout modal after TabOne (delivery).
 * Contains “Proceed to Payment”. Modal itself lives in app/cart/page.jsx.
 */

import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  useToast,
  Button,
  Grid,
  Spacer,
  Badge,
  IconButton,
  Progress,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useCartCheckoutMutation } from "@slices/productsApiSlice";
import { FormatCurr } from "@utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiClock,
  FiChevronRight,
  FiChevronLeft,
  FiShare2,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionGrid = motion(Grid);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const DELIVERY_COST = 3500;
const themeBg = `${ThemeColors.primaryColor}08`;
const themeBorder = `${ThemeColors.primaryColor}25`;

const TabTwo = ({ Cart, updateTabIndex, tabOneData }) => {
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  const [createCartCheckout] = useCartCheckoutMutation();
  const router = useRouter();
  const chakraToast = useToast();
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [receiptId, setReceiptId] = useState("");
  const [orderId, setOrderId] = useState("");

  const calcCartTotal = () => {
    const total = Cart.reduce((a, b) => {
      return a + parseInt(b?.price || 0) * parseInt(b?.quantity || 1);
    }, 0);
    setCartTotal(total);
  };

  useEffect(() => {
    calcCartTotal();
    const now = new Date();
    setCurrentDateTime(
      now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setReceiptId(
      `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    );
    setOrderId(
      `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    );
    const deliveryTime = new Date(now.getTime() + 45 * 60000);
    setEstimatedDelivery(
      deliveryTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    const timer = setInterval(() => {
      setProgress((old) => (old >= 100 ? 100 : Math.min(old + 10, 100)));
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    let processTimer;

    try {
      processTimer = setInterval(() => {
        setProgress((old) => (old >= 100 ? 100 : Math.min(old + 20, 100)));
      }, 200);

      const res = await createCartCheckout({
        user: userInfo,
        customerName: `${userInfo.firstname} ${userInfo.lastname}`,
        Carts: Cart,
        order: {
          orderTotal: cartTotal + DELIVERY_COST,
          deliveryAddress: tabOneData?.deliveryAddress || {},
          specialRequests: tabOneData?.specialRequests || {},
          payment: { paymentMethod: "", transactionId: "" },
          orderDate: currentDateTime,
          receiptId,
          orderId,
        },
      });

      if (processTimer) clearInterval(processTimer);
      setProgress(100);

      setTimeout(() => {
        router.push(`/payment/${res.data.data.Order}`);
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      if (processTimer) clearInterval(processTimer);
      setIsProcessing(false);
      setIsLoading(false);
      chakraToast({
        title: "Error",
        description: err.data?.message ?? err.data ?? err.error,
        status: "error",
        duration: 5000,
        position: "top-right",
      });
    }
  };

  const orderTotal = cartTotal + DELIVERY_COST;
  const deliveryType = tabOneData?.deliveryAddress?.deliveryType || "standard";

  const getDeliveryBadge = (type) => {
    const badges = {
      standard: { label: "Standard" },
      express: { label: "Express" },
      scheduled: { label: "Scheduled" },
    };
    return badges[type] || badges.standard;
  };

  const handleShare = () => {
    const orderDetails = {
      orderId,
      total: FormatCurr(orderTotal),
      items: Cart.length,
    };
    navigator.clipboard.writeText(JSON.stringify(orderDetails));
    chakraToast({
      title: "Copied!",
      description: "Order details copied to clipboard",
      status: "success",
      duration: 2000,
      position: "bottom-right",
    });
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      maxW="100%"
      overflow="hidden"
    >
      {/* Order Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            backdropFilter="blur(4px)"
            zIndex={9999}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap={6}
          >
            <MotionBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              bg="white"
              p={8}
              borderRadius="2xl"
              shadow="2xl"
              maxW="360px"
              w="90%"
              textAlign="center"
            >
              <Flex justify="center" mb={4}>
                <Box
                  w="16"
                  h="16"
                  borderRadius="full"
                  bg={themeBg}
                  border="2px solid"
                  borderColor={ThemeColors.primaryColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiPackage size={28} color={ThemeColors.primaryColor} />
                </Box>
              </Flex>
              <Heading size="md" color="gray.800" mb={2}>
                Processing your order
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Please wait while we confirm your order…
              </Text>
              <Progress
                value={progress}
                size="sm"
                borderRadius="full"
                bg="gray.100"
                colorScheme="green"
                sx={{ "& > div": { bg: ThemeColors.primaryColor } }}
              />
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Brand & order meta */}
      <MotionFlex
        align="center"
        gap={3}
        mb={5}
        variants={itemVariants}
        p={4}
        rounded="2xl"
        bg={themeBg}
        border="1px solid"
        borderColor={themeBorder}
      >
        <Box
          rounded="xl"
          overflow="hidden"
          flexShrink={0}
          border="2px solid"
          borderColor={`${ThemeColors.primaryColor}30`}
        >
          <Image
            src="/assets/icons/logo.jpg"
            alt="YooKatale"
            width={48}
            height={48}
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Box flex={1} minW={0}>
          <Flex align="center" gap={2} flexWrap="wrap">
            <Heading size="sm" color={ThemeColors.primaryColor} fontWeight="700">
              YooKatale
            </Heading>
            <Badge
              bg={ThemeColors.primaryColor}
              color="white"
              fontSize="xs"
              px={2}
              py={0.5}
              borderRadius="md"
            >
              {getDeliveryBadge(deliveryType).label}
            </Badge>
          </Flex>
          <Text fontSize="xs" color="gray.500" mt={0.5}>
            Authorized by Seconds Tech Limited · P.O. Box 74940, Kampala (U)
          </Text>
        </Box>
        <IconButton
          aria-label="Share order"
          icon={<FiShare2 size={18} />}
          variant="ghost"
          color={ThemeColors.primaryColor}
          onClick={handleShare}
          _hover={{ bg: themeBg }}
          size="sm"
        />
      </MotionFlex>

      <MotionBox variants={itemVariants}>
        <Divider borderColor={themeBorder} mb={5} />
      </MotionBox>

      <MotionBox variants={itemVariants} mb={6}>
        <Heading size="md" textAlign="center" color={ThemeColors.primaryColor} fontWeight="700">
          Checkout summary
        </Heading>
      </MotionBox>

      <MotionGrid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={4}
        mb={6}
        variants={itemVariants}
      >
        <Box
          p={4}
          rounded="2xl"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.100"
          transition="all 0.2s"
          _hover={{ borderColor: themeBorder, shadow: "sm" }}
        >
          <Text fontSize="xs" color="gray.500" mb={1} fontWeight="600">
            Customer
          </Text>
          <Text fontWeight="600" color="gray.800">
            {userInfo?.firstname} {userInfo?.lastname}
          </Text>
        </Box>
        <Box
          p={4}
          rounded="2xl"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.100"
          transition="all 0.2s"
          _hover={{ borderColor: themeBorder, shadow: "sm" }}
        >
          <Text fontSize="xs" color="gray.500" mb={1} fontWeight="600">
            Date & time
          </Text>
          <Text fontWeight="600" color="gray.800" fontSize="sm">
            {currentDateTime}
          </Text>
        </Box>
      </MotionGrid>

      {/* Products */}
      <MotionBox variants={itemVariants} mb={6}>
        <Heading as="h3" size="sm" color="gray.700" mb={3}>
          Products
        </Heading>
        <Box
          maxH="220px"
          overflowY="auto"
          rounded="2xl"
          border="1px solid"
          borderColor="gray.100"
          bg="white"
          p={2}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { bg: "gray.50", borderRadius: "3px" },
            "&::-webkit-scrollbar-thumb": {
              bg: `${ThemeColors.primaryColor}40`,
              borderRadius: "3px",
            },
          }}
        >
          {Cart.length > 0 ? (
            Cart.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  py={3}
                  px={3}
                  rounded="xl"
                  bg={index % 2 === 0 ? "gray.50" : "white"}
                  mb={index < Cart.length - 1 ? 2 : 0}
                  borderBottom={index < Cart.length - 1 ? "1px solid" : "none"}
                  borderColor="gray.100"
                >
                  <Box flex={1} minW={0}>
                    <Text fontWeight="600" color="gray.800" noOfLines={1}>
                      {item?.name ?? "—"}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Qty: {item?.quantity ?? "—"} · UGX{" "}
                      {FormatCurr(
                        parseInt(item?.price || 0) * parseInt(item?.quantity || 1)
                      )}
                    </Text>
                  </Box>
                </Flex>
              </motion.div>
            ))
          ) : (
            <Text py={6} textAlign="center" color="gray.500">
              No items
            </Text>
          )}
        </Box>
      </MotionBox>

      {/* Delivery & special requests */}
      <MotionGrid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={4}
        mb={6}
        variants={itemVariants}
      >
        <Box
          p={4}
          rounded="2xl"
          border="1px solid"
          borderColor={themeBorder}
          bg={themeBg}
          transition="all 0.2s"
          _hover={{ borderColor: `${ThemeColors.primaryColor}40`, shadow: "sm" }}
        >
          <Text fontSize="xs" color={ThemeColors.primaryColor} fontWeight="600" mb={2}>
            Delivery address
          </Text>
          <Text fontSize="sm" color="gray.700">
            {tabOneData?.deliveryAddress?.address1 || "—"}
          </Text>
          {tabOneData?.deliveryAddress?.address2 && (
            <Text fontSize="sm" color="gray.600" mt={1}>
              {tabOneData.deliveryAddress.address2}
            </Text>
          )}
          {estimatedDelivery && (
            <Flex align="center" gap={2} mt={2}>
              <FiClock size={14} color={ThemeColors.primaryColor} />
              <Text fontSize="xs" color={ThemeColors.primaryColor}>
                Est. by {estimatedDelivery}
              </Text>
            </Flex>
          )}
        </Box>
        <Box
          p={4}
          rounded="2xl"
          border="1px solid"
          borderColor={themeBorder}
          bg={themeBg}
          transition="all 0.2s"
          _hover={{ borderColor: `${ThemeColors.primaryColor}40`, shadow: "sm" }}
        >
          <Text fontSize="xs" color={ThemeColors.primaryColor} fontWeight="600" mb={2}>
            Special requests
          </Text>
          <Text fontSize="sm" color="gray.700">
            Peel food:{" "}
            {tabOneData?.specialRequests?.peeledFood ? "Yes" : "No"}
          </Text>
          {tabOneData?.specialRequests?.ecoPackaging && (
            <Text fontSize="sm" color="gray.600" mt={1}>
              Eco packaging
            </Text>
          )}
          {tabOneData?.specialRequests?.moreInfo && (
            <Text fontSize="sm" color="gray.600" mt={1} noOfLines={2}>
              {tabOneData.specialRequests.moreInfo}
            </Text>
          )}
        </Box>
      </MotionGrid>

      {/* Totals */}
      <MotionBox
        variants={itemVariants}
        mb={6}
        p={5}
        rounded="2xl"
        border="1px solid"
        borderColor="gray.200"
        bg="gray.50"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          w: "4px",
          bg: ThemeColors.primaryColor,
          roundedLeft: "2xl",
        }}
      >
        <Flex justify="space-between" mb={2}>
          <Text color="gray.600">Delivery</Text>
          <Text fontWeight="600">UGX {FormatCurr(DELIVERY_COST)}</Text>
        </Flex>
        <Flex justify="space-between" mb={2}>
          <Text color="gray.600">Subtotal</Text>
          <Text fontWeight="600">UGX {FormatCurr(cartTotal)}</Text>
        </Flex>
        <Divider my={3} borderColor="gray.200" />
        <Flex justify="space-between" align="center">
          <Text fontWeight="700" color="gray.800">
            Total
          </Text>
          <Text fontSize="xl" fontWeight="700" color={ThemeColors.primaryColor}>
            UGX {FormatCurr(orderTotal)}
          </Text>
        </Flex>
        <Text fontSize="xs" color="gray.500" mt={2}>
          Receipt: {receiptId}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Order: {orderId}
        </Text>
      </MotionBox>

      {/* Actions */}
      <MotionFlex gap={4} flexWrap="wrap" variants={itemVariants}>
        <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="md"
            borderColor={ThemeColors.primaryColor}
            color={ThemeColors.primaryColor}
            leftIcon={<FiChevronLeft size={16} />}
            onClick={() => updateTabIndex(0)}
            _hover={{
              bg: `${ThemeColors.primaryColor}12`,
              borderColor: ThemeColors.secondaryColor,
              color: ThemeColors.secondaryColor,
            }}
            borderRadius="xl"
          >
            Back
          </Button>
        </MotionBox>
        <Spacer />
        <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            bg={ThemeColors.primaryColor}
            color="white"
            size="md"
            rightIcon={<FiChevronRight size={16} />}
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Processing..."
            _hover={{
              bg: ThemeColors.secondaryColor,
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
            borderRadius="xl"
          >
            Proceed to Payment
          </Button>
        </MotionBox>
      </MotionFlex>
    </MotionBox>
  );
};

export default TabTwo;
