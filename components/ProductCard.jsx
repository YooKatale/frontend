"use client";

import { useToast, Badge } from "@chakra-ui/react";
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

const ProductCard = ({ product, userInfo }) => {
  const [addCartApi] = useCartCreateMutation();
  const [SignInStateModal, setSignInStateModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

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
      });

      setSignInStateModal((prev) => !prev);

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
      <div className="lg:p-4 py-2 px-4 bg-white hover:shadow-md w-[200px] rounded-md shrink-0 relative">
        <div className="h-[120px] p-[0.3rem]">
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
              {/* Display the discount information as a badge */}
              <img
                src={product.images[0]}
                className="w-auto object-contain h-full"
                alt={product.images}
              />
            </div>
          </Link>
        </div>

        <div className="p-[0.3rem 0]">
          <div className="py-2">
            <p className="secondary-light-font text-center text-lg">
              {product.name}
            </p>
            <h3 className={`font-bold text-center text-base text-dark`}>
              {`UGX ${FormatCurr(product.price)}`}
            </h3>

            {product.category == "grains and flour" && (
              <p className="secondary-light-font text-center text-base">
                per {product.unit}
              </p>
            )}

            {product?.type == "bulk" && (
              <p className="secondary-light-font text-center text-base">
                {product?.description}
              </p>
            )}
          </div>

          <div className="py-[0.3rem] flex justify-center">
            <Button
              className="text-white bg-dark hover:bg-transparent hover:text-dark text-base gap-2 rounded-md border-[1.7px] border-dark"
              onClick={() => handleAddToCartBtnClick(product._id)}
            >
              {isLoading ? (
                <LoaderIcon size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}{" "}
              Add To Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Sign-in / Sign-up form */}
      <div
        className={`fixed top-[10%] lg:left-[30%] left-[5%] lg:right-[30%] right-[5%] bottom-[10%] z-[990] bg-light py-6 rounded-md shadow-md ${
          SignInStateModal
            ? "visible translate-y-0"
            : "invisible translate-y-[150%]"
        }`}
      >
        <div
          className="absolute top-4 right-4"
          onClick={() => setSignInStateModal((prev) => !prev)}
        >
          <AiOutlineClose size={30} style={{ cursor: "pointer" }} />
        </div>
        <SignIn redirect={null} callback={handleListeningToSignIn} />
      </div>
    </>
  );
};

export default ProductCard;
