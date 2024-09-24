"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Virtual, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './SwiperStyles.css';
import { Card } from 'antd';

import { Box, Badge, Grid, GridItem } from '@chakra-ui/react';
import ProductCard from './ProductCard';
import LoaderSkeleton from './LoaderSkeleton';

export default function SwipperComponent({Products, userInfo}) {
  const [swiperRef, setSwiperRef] = useState(null);
  const appendNumber = useRef(500);
  const prependNumber = useRef(1);
  // Create array with 500 slides
  const [slides, setSlides] = useState(
    Array.from({ length: 500 }).map((_, index) => `Slide ${index + 1}`)
  );
  const [productMap, setProductMap]=useState([])
  useEffect(() => {
   
    setProductMap(Products)
  }, [Products])
  
  const sliderBreakPoint={
    320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      // when window width is >= 500px
      500: {
        slidesPerView: 2,
        spaceBetween: 2,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 4,
        spaceBetween: 2,
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 5,
        spaceBetween: 2,
      },
  }
  return (
    productMap?.length>0 ?
   <Card style={{backgroundColor:'transparent', marginLeft:-20, marginRight:-20, height:"100%"}}>
      <Swiper
        modules={[Virtual, Navigation, Pagination]}
        onSwiper={setSwiperRef}
       // slidesPerView={5}
        spaceBetween={0}
        navigation={true}
        breakpoints={sliderBreakPoint}
      > 
        {productMap?.length>0 ?productMap.map((product, index) => (
           <SwiperSlide key={product} virtualIndex={index} style={{borderRadius:4,height:'100%', backgroundColor:'transparent',padding:12}}>
                <Card.Grid hoverable style={{width:'100%', height:'100%',backgroundColor:'white',borderRadius:8 }}>
                
                <ProductCard product={product} userInfo={userInfo} />
                </Card.Grid>
                </SwiperSlide>
        
        )):null}
         
      </Swiper>
      </Card>
 :
 
          <Grid gridTemplateColumns={{
              base: "repeat(1, 1fr)",   // 2 columns on small screens
              sm: "repeat(2, 1fr)",     // 3 columns on medium screens
              md: "repeat(5, 1fr)",     // 4 columns on larger screens
              lg: "repeat(5, 1fr)"      // 5 columns on extra-large screens
          }} gap={6} style={{ alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((item) => <LoaderSkeleton key={item} />)}
          </Grid>
  );
}
