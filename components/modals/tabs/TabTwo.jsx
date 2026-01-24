"use client";

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
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useCartCheckoutMutation } from "@slices/productsApiSlice";
import { FormatCurr } from "@utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const DELIVERY_COST = 3500;

const TabTwo = ({ Cart, updateTabIndex, tabOneData }) => {
  const [CartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [createCartCheckout] = useCartCheckoutMutation();
  const router = useRouter();
  const chakraToast = useToast();
  const { userInfo } = useSelector((state) => state.auth);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [receiptId, setReceiptId] = useState("");

  const calcCartTotal = () => {
    const total = Cart.reduce((a, b) => {
      return a + parseInt(b?.price || 0) * parseInt(b?.quantity || 1);
    }, 0);
    setCartTotal(total);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.toDateString()}, ${now.toLocaleTimeString()}`;
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 1000);
    return `R${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${randomNum}`;
  };

  useEffect(() => {
    calcCartTotal();
    setCurrentDateTime(getCurrentDateTime());
    setReceiptId(generateReceiptNumber());
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
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
      router.push(`/payment/${res.data.data.Order}`);
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message ?? err.data ?? err.error,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const orderTotal = CartTotal + DELIVERY_COST;

  return (
    <Box>
      {/* Brand & auth */}
      <Flex align="center" gap={3} mb={4}>
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
        <Box>
          <Heading size="sm" color={ThemeColors.primaryColor} fontWeight="700">
            YooKatale
          </Heading>
          <Text fontSize="xs" color="gray.500">
            Authorized by Seconds Tech Limited · P.O. Box 74940, Kampala (U)
          </Text>
        </Box>
      </Flex>

      <Divider borderColor={`${ThemeColors.primaryColor}20`} mb={5} />

      <Heading
        size="md"
        textAlign="center"
        color={ThemeColors.primaryColor}
        mb={6}
        fontWeight="700"
      >
        Checkout summary
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={6}>
        <Box
          p={4}
          rounded="xl"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.100"
        >
          <Text fontSize="xs" color="gray.500" mb={1}>
            Customer
          </Text>
          <Text fontWeight="600" color="gray.800">
            {userInfo?.firstname} {userInfo?.lastname}
          </Text>
        </Box>
        <Box
          p={4}
          rounded="xl"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.100"
        >
          <Text fontSize="xs" color="gray.500" mb={1}>
            Date & time
          </Text>
          <Text fontWeight="600" color="gray.800" fontSize="sm">
            {currentDateTime}
          </Text>
        </Box>
      </Grid>

      {/* Products */}
      <Heading as="h3" size="sm" color="gray.700" mb={3}>
        Products
      </Heading>
      <Box
        maxH="220px"
        overflowY="auto"
        mb={6}
        rounded="xl"
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
            <Flex
              key={index}
              justify="space-between"
              align="center"
              py={3}
              px={3}
              rounded="lg"
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
                  Qty: {item?.quantity ?? "—"} · UGX {FormatCurr(parseInt(item?.price || 0) * parseInt(item?.quantity || 1))}
                </Text>
              </Box>
            </Flex>
          ))
        ) : (
          <Text py={4} textAlign="center" color="gray.500">
            No items
          </Text>
        )}
      </Box>

      {/* Delivery & special requests */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={6}>
        <Box
          p={4}
          rounded="xl"
          border="1px solid"
          borderColor={`${ThemeColors.primaryColor}25`}
          bg={`${ThemeColors.primaryColor}08`}
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
        </Box>
        <Box
          p={4}
          rounded="xl"
          border="1px solid"
          borderColor={`${ThemeColors.primaryColor}25`}
          bg={`${ThemeColors.primaryColor}08`}
        >
          <Text fontSize="xs" color={ThemeColors.primaryColor} fontWeight="600" mb={2}>
            Special requests
          </Text>
          <Text fontSize="sm" color="gray.700">
            Peel food: {tabOneData?.specialRequests?.peeledFood ? "Yes" : "No"}
          </Text>
          {tabOneData?.specialRequests?.moreInfo && (
            <Text fontSize="sm" color="gray.600" mt={1} noOfLines={2}>
              {tabOneData.specialRequests.moreInfo}
            </Text>
          )}
        </Box>
      </Grid>

      {/* Totals */}
      <Box
        p={5}
        rounded="xl"
        border="1px solid"
        borderColor="gray.200"
        bg="gray.50"
        mb={6}
      >
        <Flex justify="space-between" mb={2}>
          <Text color="gray.600">Delivery</Text>
          <Text fontWeight="600">UGX {FormatCurr(DELIVERY_COST)}</Text>
        </Flex>
        <Flex justify="space-between" mb={2}>
          <Text color="gray.600">Subtotal</Text>
          <Text fontWeight="600">UGX {FormatCurr(CartTotal)}</Text>
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
      </Box>

      {/* Actions */}
      <Flex gap={4} flexWrap="wrap">
        <Button
          variant="outline"
          size="md"
          borderColor={ThemeColors.primaryColor}
          color={ThemeColors.primaryColor}
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
        <Spacer />
        <Button
          bg={ThemeColors.primaryColor}
          color="white"
          size="md"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Processing..."
          _hover={{
            bg: ThemeColors.secondaryColor,
            transform: "translateY(-1px)",
            shadow: "md",
          }}
          transition="all 0.2s"
          borderRadius="xl"
        >
          Proceed to Payment
        </Button>
      </Flex>
    </Box>
  );
};

export default TabTwo;
