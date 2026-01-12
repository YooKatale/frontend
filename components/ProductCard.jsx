"use client";

import { useToast, Badge, Box, Heading, Text, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Link from "next/link";
import { useCartCreateMutation } from "@slices/productsApiSlice";
import { FormatCurr } from "@utils/utils";
import { Button } from "./ui/button";
import { LoaderIcon, ShoppingCart } from "lucide-react";
import Image from "next/image";
import SignIn from "@app/signin/page";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";

import { Card } from 'antd';
import Paragraph from "antd/es/skeleton/Paragraph";
import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import "antd/dist/reset.css";
const { Meta } = Card;
const ProductCard = ({ product, userInfo }) => {
  const [addCartApi] = useCartCreateMutation();
  const [SignInStateModal, setSignInStateModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const chakraToast = useToast();

  // Function to calculate the discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discount;
  };

  // Function to handle adding product to cart
  const handleAddCart = async (ID, user) => {
    try {
      // Set loading to true
      setLoading(true);

      // Calculate the discounted price based on the product's discount percentage
      const discountedPrice = calculateDiscountedPrice(
        product.price,
        product.discountPercentage
      );

      const res = await addCartApi({
        productId: ID,
        userId: user,
        discountedPrice: discountedPrice,
      }).unwrap();

      if (res?.message) {
        chakraToast({
          title: "Success",
          description: res.message,
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      }
    } catch (err) {
      const errorMessage = err.message?.error || err?.data.message || err.error || "Error";
      const isAlreadyInCart = errorMessage.toLowerCase().includes('already') && 
                              (errorMessage.toLowerCase().includes('cart') || 
                               errorMessage.toLowerCase().includes('added'));
      
      chakraToast({
        title: isAlreadyInCart ? "Product Already in Cart" : "Error",
        description: isAlreadyInCart ? "Product already added to cart" : errorMessage,
        status: isAlreadyInCart ? "warning" : "error",
        duration: 5000,
        isClosable: false,
      });
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  // Function to listen to add to cart button click
  const handleAddToCartBtnClick = (ID) => {
    // Check if user has not logged in
    if (!userInfo) {
      chakraToast({
        title: "Sign In is required",
        description: `You need to sign in to add to cart`,
        status: "error",
        duration: 5000,
        isClosable: false,
        position: 'top'
      });

      setSignInStateModal((prev) => !prev);
      onOpen()
      // Set loading to false
      setLoading(false);

      return;
    }

    handleAddCart(ID, userInfo?._id);
  };

  // Function to listen to user successful login
  const handleListeningToSignIn = (param) => {
    setLoading(true);

    if (param.loggedIn) {
      setSignInStateModal((prev) => !prev);
      handleAddCart(product._id, param?.user);
    }
  };



  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Box
        position="relative"
        bg="white"
        borderRadius={{ base: "md", md: "lg" }}
        overflow="hidden"
        boxShadow={isHovered ? "lg" : "sm"}
        transition="all 0.3s ease"
        transform={isHovered ? "translateY(-4px)" : "translateY(0)"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        border="1px solid"
        borderColor={isHovered ? "green.300" : "gray.200"}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Link href={`/product/${product._id}`}>
          <Box position="relative" bg="gray.50" p={{ base: 2, sm: 3, md: 4 }}>
            {product.discountPercentage && product.discountPercentage !== "0" && (
              <Badge
                colorScheme="red"
                position="absolute"
                top={{ base: 1, md: 2 }}
                right={{ base: 1, md: 2 }}
                zIndex="2"
                fontSize={{ base: "2xs", md: "xs" }}
                fontWeight="bold"
                px={{ base: 1, md: 2 }}
                py={{ base: 0.5, md: 1 }}
                borderRadius="md"
                boxShadow="sm"
              >
                -{product.discountPercentage}%
              </Badge>
            )}

            {product?.type === "bulk" && (
              <Badge
                colorScheme="orange"
                position="absolute"
                top={{ base: 1, md: 2 }}
                left={{ base: 1, md: 2 }}
                zIndex="2"
                fontSize={{ base: "2xs", md: "xs" }}
                fontWeight="bold"
                px={{ base: 1, md: 2 }}
                py={{ base: 0.5, md: 1 }}
                borderRadius="md"
                boxShadow="sm"
              >
                BULK
              </Badge>
            )}

            <Box
              position="relative"
              height={{ base: "100px", sm: "120px", md: "140px" }}
              width="100%"
            >
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  bg="gray.100"
                >
                  <Text fontSize={{ base: "2xl", md: "3xl" }} color="gray.400">
                    📦
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </Link>

        <Box py={{ base: 2, md: 3 }} px={{ base: 2, md: 3 }} flex="1" display="flex" flexDirection="column">
          <Text
            fontWeight="600"
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            textTransform="capitalize"
            noOfLines={2}
            mb={{ base: 1, md: 2 }}
            minH={{ base: "32px", md: "40px" }}
            color="gray.700"
            lineHeight="tight"
          >
            {product.name}
          </Text>

          <Box mt="auto">
            <Heading
              fontWeight="700"
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              color="green.600"
              mb={1}
            >
              UGX {FormatCurr(product.price)}
            </Heading>

            {product.category === "grains and flour" && product.unit && (
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="gray.500"
                mb={{ base: 1, md: 2 }}
              >
                per {product.unit}
              </Text>
            )}

            {product?.type === "bulk" && product?.description && (
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="gray.600"
                noOfLines={2}
                mb={{ base: 1, md: 2 }}
              >
                {product?.description}
              </Text>
            )}
          </Box>
        </Box>

        <Box px={{ base: 2, md: 3 }} pb={{ base: 2, md: 3 }}>
          <Button
            className="w-full text-white bg-green-600 hover:bg-green-700 gap-1 rounded-lg border-2 border-green-600 transition-all duration-300"
            onClick={() => handleAddToCartBtnClick(product._id)}
            style={{
              fontSize: 'clamp(10px, 2.5vw, 14px)',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 12px)',
            }}
          >
            {isLoading ? (
              <LoaderIcon size={16} className="animate-spin" />
            ) : (
              <ShoppingCart size={16} />
            )}
            <span className="hidden sm:inline">Add To Cart</span>
            <span className="inline sm:hidden">Add</span>
          </Button>
        </Box>
      </Box>
      {/* Sign-in / Sign-up form */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="bg-light" maxW="800px">
          <ModalCloseButton />
          <ModalBody>
            <SignIn redirect={null} callback={handleListeningToSignIn} ismodal={true} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;
