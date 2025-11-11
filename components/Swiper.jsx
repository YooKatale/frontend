"use client"
import React, { useEffect, useState } from "react";
import { Virtual, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./SwiperStyles.css";

import { Box, Grid } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import LoaderSkeleton from "./LoaderSkeleton";

export default function SwipperComponent({ Products, userInfo }) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [productMap, setProductMap] = useState([]);
 
  useEffect(() => {
    setProductMap(Products);
  }, [Products]);

  const sliderBreakPoint = {
    0: {
      slidesPerView: 1.1,
      spaceBetween: 12,
      centeredSlides: true,
    },
    480: {
      slidesPerView: 1.6,
      spaceBetween: 16,
      centeredSlides: false,
    },
    640: {
      slidesPerView: 2.2,
      spaceBetween: 18,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 16,
    },
    1280: {
      slidesPerView: 5,
      spaceBetween: 18,
    },
  };
  return (
    productMap?.length > 0 ? (
      <Swiper
        modules={[Virtual, Navigation, Pagination]}
        onSwiper={setSwiperRef}
        navigation={productMap.length > 3}
        pagination={{ clickable: true }}
        parallax
        grabCursor
        breakpoints={sliderBreakPoint}
        style={{
          backgroundColor: "transparent",
          width: "100%",
        }}
      >
        {productMap.map((product, index) => (
          <SwiperSlide
            key={product?._id || product?.id || product?.slug || index}
            virtualIndex={index}
            style={{
              borderRadius: 4,
              height: "100%",
              backgroundColor: "transparent",
              padding: "12px 6px",
              display: "flex",
            }}
          >
            <Box
              width="100%"
              height="100%"
              borderRadius="md"
              background="white"
              boxShadow="sm"
              overflow="hidden"
            >
              <ProductCard product={product} userInfo={userInfo} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    ) : (
      <Grid
        gridTemplateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
        gap={6}
        alignItems="center"
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <LoaderSkeleton key={item} />
        ))}
      </Grid>
    )
  );
}
