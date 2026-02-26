"use client";

import { useToast, Box, Text, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Link from "next/link";
import { useCartCreateMutation } from "@slices/productsApiSlice";
import { useWishlist } from "@slices/wishlistSlice";
import { FormatCurr } from "@utils/utils";
import { LoaderIcon, ShoppingCart, Heart } from "lucide-react";
import { FiPackage } from "react-icons/fi";
import Image from "next/image";
import SignIn from "@app/signin/page";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product, userInfo }) => {
  const [addCartApi] = useCartCreateMutation();
  const [SignInStateModal, setSignInStateModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chakraToast = useToast();
  const { isInWishlist, toggle: toggleWishlist } = useWishlist();
  const inWishlist = product?._id ? isInWishlist(product._id) : false;

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



  const discount = product.discountPercentage && product.discountPercentage !== "0" ? Number(product.discountPercentage) : 0;
  const originalPrice = product.price;
  const displayPrice = discount ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
  const hasWasPrice = discount > 0;

  return (
    <>
      <Box
        className={styles.card}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      >
        <Box position="relative" className={styles.imgWrap} as="div">
          <Link href={`/product/${product._id}`} display="block" position="absolute" inset={0} zIndex={0} sx={{ "&:focus": { outline: "none" } }}>
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name ?? "Product"}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height="100%" bg="gray.100" color="gray.400">
                <FiPackage size={48} strokeWidth={1.5} />
              </Box>
            )}
          </Link>
          {(discount > 0 || product?.type === "bulk") && (
            <div className={styles.badges}>
              {discount > 0 && <span className={`${styles.badge} ${styles.badgeRed}`}>-{discount}%</span>}
              {product?.type === "bulk" && <span className={`${styles.badge} ${styles.badgeGold}`}>BULK</span>}
            </div>
          )}
          <button
            type="button"
            className={styles.wishlistBtn}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product?._id) toggleWishlist(product._id, product);
            }}
          >
            <Heart size={16} color={inWishlist ? "var(--red, #ef4444)" : "var(--brand)"} strokeWidth={2} fill={inWishlist ? "var(--red, #ef4444)" : "none"} />
          </button>
          <button
            type="button"
            className={styles.quickAdd}
            onClick={(e) => { e.preventDefault(); handleAddToCartBtnClick(product._id); }}
          >
            {isLoading ? <LoaderIcon size={14} className="animate-spin" /> : <ShoppingCart size={14} strokeWidth={2.5} />}
            Add to Cart
          </button>
        </Box>
        <Box className={styles.body}>
          {product.category && (
            <Text className={styles.brand} as="span">{String(product.category).toUpperCase()}</Text>
          )}
          <Text as="h3" className={styles.name}>{product.name}</Text>
          {(product.rating != null || (product.reviewCount ?? 0) > 0) && (
            <div className={styles.rating}>
              <span className={styles.stars}>{"★".repeat(Math.min(5, Math.round(Number(product.rating) || 0)))}{"☆".repeat(5 - Math.min(5, Math.round(Number(product.rating) || 0)))}</span>
              <span className={styles.ratingCount}>({product.reviewCount ?? 0})</span>
            </div>
          )}
          <div className={styles.priceRow}>
            <span className={styles.priceNow}>UGX {FormatCurr(displayPrice)}</span>
            {hasWasPrice && <span className={styles.priceWas}>UGX {FormatCurr(originalPrice)}</span>}
            {hasWasPrice && <span className={styles.priceSave}>Save {discount}%</span>}
          </div>
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
