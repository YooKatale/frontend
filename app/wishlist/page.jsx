"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import { useWishlist } from "@slices/wishlistSlice";
import { useCartCreateMutation } from "@slices/productsApiSlice";
import { FormatCurr } from "@utils/utils";
import SignIn from "@app/signin/page";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import styles from "./wishlist.module.css";

const HEART_FILLED = (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const CART_ICON = (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

export default function WishlistPage() {
  const router = useRouter();
  const toast = useToast();
  const { userInfo } = useAuth();
  const { items, remove } = useWishlist();
  const [addCart, { isLoading: isAddingCart }] = useCartCreateMutation();
  const [addingId, setAddingId] = useState(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const handleRemove = useCallback(
    (e, productId) => {
      e.preventDefault();
      e.stopPropagation();
      remove(productId);
    },
    [remove]
  );

  const handleAddToCart = useCallback(
    async (e, item) => {
      e.preventDefault();
      e.stopPropagation();
      const product = item.product;
      const productId = item.productId;
      if (!productId) return;
      if (!userInfo) {
        toast({ title: "Sign in required", description: "Sign in to add items to cart", status: "warning", duration: 5000, isClosable: true });
        setSignInModalOpen(true);
        return;
      }
      const price = Number(product?.price) || 0;
      const discount = Number(product?.discountPercentage) || 0;
      const discountedPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
      setAddingId(productId);
      try {
        await addCart({ productId, userId: userInfo._id, discountedPrice }).unwrap();
        toast({ title: "Added to cart", status: "success", duration: 3000, isClosable: true });
      } catch (err) {
        const msg = err?.data?.message || err?.message || "Could not add to cart";
        toast({ title: /already|cart/i.test(msg) ? "Already in cart" : "Error", description: msg, status: "info", duration: 5000, isClosable: true });
      } finally {
        setAddingId(null);
      }
    },
    [userInfo, addCart, toast]
  );

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()} aria-label="Back">
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div>
          <h1 className={styles.title}>Wishlist</h1>
          <p className={styles.sub}>{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon} aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green-mid)" }}>
            {HEART_FILLED}
          </div>
          <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
          <p className={styles.emptySub}>Save items you like by tapping the heart on any product.</p>
          <Link href="/products" className={styles.browseBtn}>
            Browse products
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => {
            const product = item.product;
            const productId = item.productId;
            const name = product?.name || "Product";
            const category = product?.category || product?.categoryName || "";
            const price = Number(product?.price) || 0;
            const discount = Number(product?.discountPercentage) || 0;
            const displayPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
            const img = product?.images?.[0] || product?.image || "";
            const isLoading = addingId === productId && isAddingCart;

            return (
              <div key={productId} className={styles.card}>
                <Link href={`/product/${productId}`} className={styles.imgWrap} style={{ position: "relative", display: "block" }}>
                  {img ? (
                    <Image src={img} alt={name} fill sizes="(max-width:600px) 50vw, (max-width:900px) 33vw, 25vw" style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 12 }}>
                      No image
                    </div>
                  )}
                  <button type="button" className={styles.removeBtn} onClick={(e) => handleRemove(e, productId)} aria-label="Remove from wishlist">
                    {HEART_FILLED}
                  </button>
                </Link>
                <div className={styles.body}>
                  <button type="button" className={styles.removeTextBtn} onClick={(e) => handleRemove(e, productId)}>
                    Remove from wishlist
                  </button>
                  {category && <span className={styles.cat}>{category}</span>}
                  <Link href={`/product/${productId}`} className={styles.name}>
                    {name}
                  </Link>
                  <span className={styles.price}>UGX {FormatCurr(displayPrice)}</span>
                  <button
                    type="button"
                    className={styles.addCartBtn}
                    onClick={(e) => handleAddToCart(e, item)}
                    disabled={isLoading}
                  >
                    {isLoading ? <span className={styles.spinner} /> : CART_ICON}
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={signInModalOpen} onClose={() => setSignInModalOpen(false)}>
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalCloseButton />
          <ModalBody>
            <SignIn redirect={null} callback={(param) => param?.loggedIn && setSignInModalOpen(false)} ismodal={true} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
