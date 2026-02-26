"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import { useProductGetMutation, useProductsGetMutation, useCartCreateMutation } from "@slices/productsApiSlice";
import { useWishlist } from "@slices/wishlistSlice";
import { FormatCurr } from "@utils/utils";
import SignIn from "@app/signin/page";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import styles from "./product.module.css";

const STAR = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const HEART = (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const toast = useToast();
  const { userInfo } = useAuth();
  const { isInWishlist, toggle: toggleWishlist } = useWishlist();

  const [fetchProduct, { data: productRes, isLoading, isError }] = useProductGetMutation();
  const [fetchProducts, { data: allProductsRes }] = useProductsGetMutation();
  const [addCart, { isLoading: isAddingCart }] = useCartCreateMutation();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const [shareOpen, setShareOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const product = useMemo(() => {
    if (!productRes) return null;
    const d = productRes.data ?? productRes;
    if (typeof d === "object" && (d._id || d.id)) return d;
    if (Array.isArray(d) && d[0]) return d[0];
    return null;
  }, [productRes]);

  useEffect(() => {
    if (id) fetchProduct(id).catch(() => {});
  }, [id, fetchProduct]);

  useEffect(() => {
    if (!product && !isLoading) return;
    fetchProducts().catch(() => {});
  }, [product, isLoading, fetchProducts]);

  const images = useMemo(() => {
    if (!product?.images) return [];
    return Array.isArray(product.images) ? product.images : [product.images].filter(Boolean);
  }, [product]);
  const mainImage = images[selectedImageIndex] || images[0] || "";

  const discount = product?.discountPercentage ? Number(product.discountPercentage) : 0;
  const originalPrice = Number(product?.price) || 0;
  const displayPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
  const inWishlist = product?._id ? isInWishlist(product._id) : false;

  const relatedProducts = useMemo(() => {
    const list = allProductsRes?.data ?? allProductsRes ?? [];
    const arr = Array.isArray(list) ? list : [];
    return arr.filter((p) => p._id !== product?._id).slice(0, 8);
  }, [allProductsRes, product?._id]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!userInfo) {
      toast({ title: "Sign in required", description: "Sign in to add items to cart", status: "warning", duration: 5000, isClosable: true });
      setSignInModalOpen(true);
      return;
    }
    if (!product?._id) return;
    try {
      await addCart({
        productId: product._id,
        userId: userInfo._id,
        discountedPrice: displayPrice,
      }).unwrap();
      showToast("Added to cart!");
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Could not add to cart";
      const isAlready = /already|cart/i.test(msg);
      toast({
        title: isAlready ? "Already in cart" : "Error",
        description: isAlready ? "This product is already in your cart." : msg,
        status: isAlready ? "info" : "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [userInfo, product?._id, displayPrice, addCart, toast, showToast]);

  const handleBuyNow = useCallback(async () => {
    if (!userInfo) {
      setSignInModalOpen(true);
      return;
    }
    await handleAddToCart();
    router.push("/cart");
  }, [userInfo, handleAddToCart, router]);

  const handleWishlistToggle = useCallback(() => {
    if (!product?._id) return;
    toggleWishlist(product._id, product);
  }, [product, toggleWishlist]);

  const handleShare = useCallback(() => {
    setShareOpen(true);
  }, []);
  const closeShare = useCallback(() => setShareOpen(false), []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = product ? `${product.name || "Product"} – Fresh from YooKatale. Order now:` : "Check this out on YooKatale:";

  const copyLink = useCallback(() => {
    const text = `${shareText} ${shareUrl}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast("Link copied!"));
    }
    closeShare();
  }, [showToast, closeShare, shareText, shareUrl]);

  const categoryName = product?.category || product?.categoryName || "Product";
  const rating = Number(product?.rating) ?? 0;
  const reviewCount = Number(product?.reviewCount) ?? 0;
  const ordersCount = Number(product?.ordersCount) ?? 0;

  if (isLoading && !product) {
    return (
      <div className={styles.root}>
        <div className={styles.loadingWrap}>
          <div style={{ textAlign: "center", color: "var(--muted)" }}>Loading product…</div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={styles.root}>
        <div className={styles.errorWrap}>
          <p>Product not found.</p>
          <Link href="/products" style={{ color: "var(--green)", fontWeight: 600, marginTop: 8, display: "inline-block" }}>
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* Toast */}
      <div className={`${styles.toast} ${toastMsg ? styles.show : ""}`} role="alert">
        <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {toastMsg || "Added to cart!"}
      </div>

      {/* Top nav */}
      <nav className={styles.topnav}>
        <div className={styles.navLeft}>
          <button type="button" className={styles.navIconBtn} onClick={() => router.back()} aria-label="Back">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className={styles.navBreadcrumb}>
            <Link href="/">Home</Link> / <span>{categoryName}</span>
          </div>
        </div>
        <div className={styles.navRight}>
          <button type="button" className={styles.navIconBtn} onClick={handleShare} aria-label="Share">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </nav>

      <div className={styles.mainContent}>
        {/* Gallery */}
        <section className={styles.gallerySection}>
          <div className={styles.mainImgWrap}>
            {mainImage ? (
              <Image src={mainImage} alt={product.name || "Product"} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit: "cover" }} unoptimized />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
                No image
              </div>
            )}
            {discount > 0 && <div className={styles.promoTag}>-{discount}%</div>}
            <div className={styles.imgOverlayBtns}>
              <button
                type="button"
                className={`${styles.imgOverlayBtn} ${inWishlist ? styles.wishlisted : ""}`}
                onClick={handleWishlistToggle}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {HEART}
              </button>
            </div>
            <div className={styles.freshnessTag}>
              <span className={styles.freshnessDot} />
              Fresh Today
            </div>
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.thumb} ${i === selectedImageIndex ? styles.active : ""}`}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <Image src={src} alt="" width={64} height={64} style={{ objectFit: "cover" }} unoptimized />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Product info */}
        <div className={styles.productInfo}>
          <div className={styles.categoryPill}>{categoryName}</div>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`${styles.starIcon} ${i <= Math.round(rating) ? styles.filled : styles.empty}`}>
                  {STAR}
                </span>
              ))}
            </div>
            <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
            <span className={styles.ratingCount}>({reviewCount} reviews)</span>
            {ordersCount > 0 && (
              <div className={styles.soldCount}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                {ordersCount} sold
              </div>
            )}
          </div>
          <div className={styles.priceSection}>
            <span className={styles.priceMain}>UGX {FormatCurr(displayPrice)}</span>
            {(product.unit || "per unit") && <span className={styles.priceUnit}>{product.unit}</span>}
            {discount > 0 && (
              <>
                <span className={styles.priceOld}>UGX {FormatCurr(originalPrice)}</span>
                <span className={styles.discountBadge}>-{discount}%</span>
              </>
            )}
          </div>
          <div className={styles.infoBadges}>
            <div className={styles.infoBadge}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Delivery in 2–4 hrs
            </div>
            <div className={styles.infoBadge}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Quality Guaranteed
            </div>
            <div className={`${styles.infoBadge} ${styles.orange}`}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.25A13 13 0 0015 21c3.87 0 7-3.13 7-7 0-2.5-1-4.75-5-6z" />
              </svg>
              Farm Fresh
            </div>
          </div>
          {inWishlist && (
            <button type="button" className={styles.removeFromWishlistBtn} onClick={handleWishlistToggle}>
              Remove from wishlist
            </button>
          )}
        </div>

        {/* Purchase */}
        <div className={styles.purchaseSection}>
          <div className={styles.qtyLabel}>Quantity</div>
          <div className={styles.qtyAddRow}>
            <div className={styles.qtyControl}>
              <button type="button" className={styles.qtyBtn} onClick={() => setQty((n) => Math.max(1, n - 1))}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className={styles.qtyValue}>{qty}</span>
              <button type="button" className={styles.qtyBtn} onClick={() => setQty((n) => n + 1)}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
            <button type="button" className={styles.addCartBtn} onClick={handleAddToCart} disabled={isAddingCart}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Add to Cart
            </button>
          </div>
          <button type="button" className={styles.buyNowBtn} onClick={handleBuyNow}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Buy Now
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsSection}>
        <div className={styles.tabsNav}>
          <button type="button" className={`${styles.tabNavItem} ${activeTab === "desc" ? styles.active : ""}`} onClick={() => setActiveTab("desc")}>
            Description
          </button>
          <button type="button" className={`${styles.tabNavItem} ${activeTab === "ratings" ? styles.active : ""}`} onClick={() => setActiveTab("ratings")}>
            Ratings & Reviews
          </button>
          <button type="button" className={`${styles.tabNavItem} ${activeTab === "delivery" ? styles.active : ""}`} onClick={() => setActiveTab("delivery")}>
            Delivery Info
          </button>
        </div>
        <div className={`${styles.tabPane} ${activeTab === "desc" ? styles.active : ""}`}>
          <p className={styles.descText}>{product.description || "Fresh, quality product from YooKatale. Delivered to your door."}</p>
          <div className={styles.tagsRow}>
            <span className={styles.tag}>Farm Fresh</span>
            <span className={styles.tag}>Quality Guaranteed</span>
            <span className={styles.tag}>Local Favourite</span>
          </div>
        </div>
        <div className={`${styles.tabPane} ${activeTab === "ratings" ? styles.active : ""}`}>
          <div className={styles.ratingSummary}>
            <div className={styles.bigRating}>
              <div className={styles.bigRatingNum}>{rating.toFixed(1)}</div>
              <div className={styles.bigRatingStars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`${styles.starIcon} ${i <= Math.round(rating) ? styles.filled : styles.empty}`} style={{ width: 14, height: 14 }}>
                    {STAR}
                  </span>
                ))}
              </div>
              <div className={styles.bigRatingCount}>{reviewCount} review{reviewCount !== 1 ? "s" : ""}</div>
            </div>
            <p className={styles.descText}>Customer reviews help others make informed choices. Ratings are based on verified purchases and reviews.</p>
          </div>
        </div>
        <div className={`${styles.tabPane} ${activeTab === "delivery" ? styles.active : ""}`}>
          <div className={styles.deliveryCard}>
            <div className={styles.deliveryIcon}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <div className={styles.deliveryTitle}>Express Delivery</div>
              <div className={styles.deliveryDesc}>
                We deliver fresh food the same day. Order by 6pm for same-day delivery across Kampala and Entebbe—no next-day wait.
              </div>
            </div>
          </div>
          <div className={styles.deliveryCard}>
            <div className={`${styles.deliveryIcon} ${styles.orange}`}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div>
              <div className={styles.deliveryTitle}>Delivery Fee</div>
              <div className={styles.deliveryDesc}>UGX 3,000 flat delivery fee within Kampala. Free delivery on orders above UGX 100,000.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              {STAR}
              Popular Picks
            </div>
            <Link href="/products" className={styles.seeAll}>
              See all
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
          <div className={styles.relatedScroll}>
            {relatedProducts.map((p) => (
              <Link key={p._id} href={`/product/${p._id}`} className={styles.relatedCard}>
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name || ""} className={styles.relatedImg} width={148} height={148} unoptimized />
                ) : (
                  <div className={styles.relatedImg} style={{ background: "var(--border)" }} />
                )}
                <div className={styles.relatedBody}>
                  <div className={styles.relatedCat}>{p.category || "Product"}</div>
                  <div className={styles.relatedName}>{p.name}</div>
                  <div className={styles.relatedPrice}>UGX {FormatCurr(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Share sheet */}
      <div className={`${styles.shareOverlay} ${shareOpen ? styles.open : ""}`} onClick={closeShare} aria-hidden="true" />
      <div className={`${styles.shareSheet} ${shareOpen ? styles.open : ""}`}>
        <div className={styles.shareHandle} />
        <div className={styles.shareTitle}>Share this product</div>
        <div className={styles.shareOptions}>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareOpt}
            onClick={closeShare}
          >
            <div className={`${styles.shareIcon} ${styles.whatsapp}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
              </svg>
            </div>
            <span className={styles.shareOptLabel}>WhatsApp</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareOpt}
            onClick={closeShare}
          >
            <div className={`${styles.shareIcon} ${styles.facebook}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className={styles.shareOptLabel}>Facebook</span>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareOpt}
            onClick={closeShare}
          >
            <div className={`${styles.shareIcon} ${styles.x}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className={styles.shareOptLabel}>X</span>
          </a>
          <button
            type="button"
            className={styles.shareOpt}
            onClick={() => {
              navigator.clipboard?.writeText(shareText + " " + shareUrl);
              showToast("Link copied—paste in Instagram to share");
              closeShare();
            }}
          >
            <div className={`${styles.shareIcon} ${styles.instagram}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span className={styles.shareOptLabel}>Instagram</span>
          </button>
          <button type="button" className={styles.shareOpt} onClick={copyLink}>
            <div className={`${styles.shareIcon} ${styles.copy}`}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </div>
            <span className={styles.shareOptLabel}>Copy Link</span>
          </button>
        </div>
        <button type="button" className={styles.closeShareBtn} onClick={closeShare}>
          Cancel
        </button>
      </div>

      {/* Sign-in modal */}
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

export default ProductDetailPage;
