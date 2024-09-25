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
      chakraToast({
        description:
          err.message?.error || err?.data.message || err.error || "Error",
        status: "error",
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
        position:'top'
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

  
 
  return (
    <>
    

 
        <Box>
          <Link href={`/product/${product._id}`}>
            {product.discountPercentage && (
              <Badge
                colorScheme="red"
                position="absolute"
                size="sm"
                zIndex="1"
                paddingX={"0.5rem"}
                style={{
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {product?.type == "bulk" && product?.type}
                {product.discountPercentage != "0" &&
                  product.discountPercentage}
              </Badge>
            )}

            <div className="flex justify-center items-center h-full relative">
              <img
                src={product.images[0]}
                style={{height:100, width:100}}
                alt={product.images}
              />
            </div>
          </Link>





          <Box py={2} px={2}>
          <Text
            className="secondary-light-font"
            textAlign={{ base: "left", sm: "center" }}
            fontSize={{ base: "md", sm: "lg" }}
            textTransform={'capitalize'}
            whiteSpace= 'nowrap'
      overflow= 'hidden'
      textOverflow= 'ellipsis'
          >
            {product.name}
          </Text>
          <Heading
            fontWeight="600"
            textAlign="center"
            fontSize={{ base: "sm", sm: "md", lg: "lg" }}
            color="dark"
          >
            {`UGX ${FormatCurr(product.price)}`}
          </Heading>
          {product.category === "grains and flour" && (
            <Text
              className="secondary-light-font"
              textAlign="center"
              fontSize={{ base: "sm", sm: "md" }}
            >
              per {product.unit}
            </Text>
          )}
          {product?.type === "bulk" && (
            <Text
              className="secondary-light-font"
              textAlign="center"
              fontSize={{ base: "sm", sm: "md" }}
            >
              {product?.description}
            </Text>
          )}
        </Box>

          <Box className="py-[0.3rem] flex justify-center">
            <Button
              className="text-white text-md bg-dark hover:bg-transparent hover:text-dark text-base gap-2 rounded-lg border-[1.7px] border-dark"
              onClick={() => handleAddToCartBtnClick(product._id)}
              style={{fontSize:14}}
            >
              {isLoading ? (
                <LoaderIcon size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}{" "}
              Add To Cart
            </Button>
          </Box>
        </Box>
      {/* Sign-in / Sign-up form */}

      <Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent className="bg-light" maxW="800px">
    <ModalCloseButton />
    <ModalBody>
      <SignIn redirect={null} callback={handleListeningToSignIn} ismodal={true}/>
    </ModalBody>
  </ModalContent>
</Modal>
    </>
  );
};
 
export default ProductCard;
