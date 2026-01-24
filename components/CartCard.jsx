import { Loader, Minus, Plus, Trash, ShoppingBag, AlertCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Box, Text, Badge, Flex, useToast, IconButton, Tooltip, Button } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FormatCurr } from "@utils/utils";
import { ThemeColors } from "@constants/constants";

const MotionBox = motion(Box);

const CartCard = ({
  cart,
  ReduceProductQuantity,
  IncreaseProductQuantity,
  handleDeleteCartItem,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const toast = useToast();

  const imgSrc =
    typeof cart?.images === "string"
      ? cart.images
      : Array.isArray(cart?.images) && cart.images.length
      ? cart.images[0]
      : null;
  const showImage = imgSrc && !imgError;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteCartItem(cart?.cartId);
      toast({
        title: "Removed",
        description: "Item removed from cart",
        status: "success",
        duration: 2000,
        position: "bottom-right",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateSubtotal = () => {
    const price = cart?.price || 0;
    const quantity = cart?.quantity || 1;
    return price * quantity;
  };

  const isBulk = cart?.type === "bulk";

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="py-6 px-4 lg:px-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 mb-4"
    >
      <div className="flex justify-between lg:flex-row flex-col gap-6">
        {/* Product Info & Image */}
        <div className="lg:w-[60%] w-full">
          <div className="flex gap-4 items-start">
            {/* Image Container */}
            <MotionBox
              whileHover={{ scale: 1.05 }}
              className="relative flex-shrink-0"
              width={{ base: "80px", md: "100px" }}
              height={{ base: "80px", md: "100px" }}
              bg={`linear-gradient(135deg, ${ThemeColors.primaryColor} 0%, ${ThemeColors.secondaryColor} 100%)`}
              borderRadius="lg"
              overflow="hidden"
              position="relative"
              border="2px solid"
              borderColor="white"
              shadow="md"
            >
              <AnimatePresence mode="wait">
                {showImage ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={imgSrc}
                      alt={cart?.name || "Product"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 100px"
                      onError={() => setImgError(true)}
                      priority={false}
                    />
                    {/* Image Overlay */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/20"
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <ShoppingBag
                      size={32}
                      className="text-white opacity-80"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bulk Badge */}
              {isBulk && (
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  bg={ThemeColors.primaryColor}
                  color="white"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  shadow="sm"
                >
                  BULK
                </Badge>
              )}
            </MotionBox>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <Flex direction="column" gap={2}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="bold"
                  color="gray.800"
                  className="truncate"
                  lineHeight="short"
                >
                  {cart?.name}
                </Text>

                <Flex align="center" gap={2} wrap="wrap">
                  <Badge
                    bg={`${ThemeColors.primaryColor}20`}
                    color={ThemeColors.primaryColor}
                    variant="subtle"
                    borderRadius="md"
                    px={2}
                    py={0.5}
                  >
                    {cart?.category}
                  </Badge>

                  {cart?.inStock !== false && (
                    <Badge
                      bg={ThemeColors.secondaryColor}
                      color="white"
                      variant="solid"
                      borderRadius="md"
                      px={2}
                      py={0.5}
                      fontSize="xs"
                    >
                      In Stock
                    </Badge>
                  )}
                </Flex>

                {/* Price Display */}
                <Flex align="center" gap={2} mt={1}>
                  <Text fontSize="xl" fontWeight="bold" color={ThemeColors.primaryColor}>
                    UGX {FormatCurr(cart?.price || 0)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    per unit
                  </Text>
                </Flex>

                {/* Subtotal */}
                <Flex align="center" gap={2} mt={2}>
                  <Text fontSize="sm" color="gray.600">
                    Subtotal:
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" color={ThemeColors.primaryColor}>
                    UGX {FormatCurr(calculateSubtotal())}
                  </Text>
                </Flex>
              </Flex>
            </div>
          </div>
        </div>

        {/* Quantity Controls & Actions */}
        <div className="lg:w-[40%] w-full">
          <Flex direction="column" align="flex-end" gap={4} height="full">
            {/* Quantity Controls */}
            <Flex align="center" gap={4}>
              <Flex
                align="center"
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
                shadow="sm"
              >
                <MotionBox whileTap={{ scale: 0.9 }}>
                  <IconButton
                    aria-label="Decrease quantity"
                    icon={<Minus size={18} />}
                    onClick={() => ReduceProductQuantity(cart.cartId)}
                    isDisabled={cart?.quantity <= 1}
                    variant="ghost"
                    size="sm"
                    colorScheme="gray"
                    borderRadius="none"
                    _hover={{ bg: "gray.100" }}
                    width="40px"
                    height="40px"
                  />
                </MotionBox>

                <Box
                  width="60px"
                  textAlign="center"
                  py={2}
                  bg="white"
                  borderX="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    {cart?.quantity}
                  </Text>
                </Box>

                <MotionBox whileTap={{ scale: 0.9 }}>
                  <IconButton
                    aria-label="Increase quantity"
                    icon={<Plus size={18} />}
                    onClick={() => IncreaseProductQuantity(cart.cartId)}
                    variant="ghost"
                    size="sm"
                    colorScheme="gray"
                    borderRadius="none"
                    _hover={{ bg: "gray.100" }}
                    width="40px"
                    height="40px"
                  />
                </MotionBox>
              </Flex>

              {/* Price Display (Mobile Alternative) */}
              <Box display={{ base: "block", lg: "none" }}>
                <Text fontSize="lg" fontWeight="bold" color={ThemeColors.primaryColor}>
                  UGX {FormatCurr(calculateSubtotal())}
                </Text>
              </Box>
            </Flex>

            {/* Action Buttons */}
            <Flex gap={3} mt="auto">
              <Tooltip label="Remove item" placement="top" hasArrow>
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={
                      isDeleting ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Trash size={16} />
                      )
                    }
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    loadingText="Removing..."
                    _hover={{
                      bg: "red.50",
                      color: "red.600",
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                    shadow="sm"
                  >
                    {isDeleting ? "Removing..." : "Remove"}
                  </Button>
                </MotionBox>
              </Tooltip>

              <Tooltip label="Save for later" placement="top" hasArrow>
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor={ThemeColors.primaryColor}
                    color={ThemeColors.primaryColor}
                    _hover={{
                      bg: `${ThemeColors.primaryColor}15`,
                      borderColor: ThemeColors.secondaryColor,
                      color: ThemeColors.secondaryColor,
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                  >
                    Save
                  </Button>
                </MotionBox>
              </Tooltip>
            </Flex>

            {/* Stock Warning */}
            {cart?.stock && cart?.quantity > cart?.stock && (
              <Flex
                align="center"
                gap={2}
                mt={2}
                p={2}
                bg={`${ThemeColors.primaryColor}15`}
                borderRadius="md"
                border="1px solid"
                borderColor={`${ThemeColors.primaryColor}40`}
              >
                <AlertCircle size={16} style={{ color: ThemeColors.primaryColor }} />
                <Text fontSize="xs" color={ThemeColors.secondaryColor}>
                  Only {cart?.stock} items left in stock
                </Text>
              </Flex>
            )}
          </Flex>
        </div>
      </div>

      {/* Progress Bar Animation (Optional) */}
      {isDeleting && (
        <MotionBox
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
          className="h-1 rounded-full mt-4"
          bg={`linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
        />
      )}
    </MotionBox>
  );
};

export default CartCard;
