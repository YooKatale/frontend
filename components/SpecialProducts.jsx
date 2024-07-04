"use client";

import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import ProductCard from "./ProductCard";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";
import LoaderSkeleton from "./LoaderSkeleton";

const SpecialProducts = ({ Products, userInfo, category, text }) => {
  // handle scrolling to right
  const handleRightScroll = () => {
    const SliderDiv = document.getElementById(
      `${category}__container__scrollbar`
    );

    if (SliderDiv.scrollBy) {
      SliderDiv.scrollBy(300, 0);
    }
  };

  // handle scrolling to right
  const handleLeftScroll = () => {
    const SliderDiv = document.getElementById(
      `${category}__container__scrollbar`
    );

    if (SliderDiv.scrollBy) {
      SliderDiv.scrollBy(-300, 0);
    }
  };
  return (
    <>
      <Box>
        <div className="py-4">
          <div className="flex justify-between">
            <div>
              <h3 className="lg:text-2xl text-lg text-center capitalize">
                <span className="capitalize">
                  {text.toLowerCase() === "roughages" ? "supplements" : text}
                </span>{" "}
                Products
              </h3>
              <div className="flex">
                <div className="h-[0.15rem] lg:w-[10rem] w-[6rem] my-2 bg-primary"></div>
              </div>
            </div>
            <div>
              <Link href={`/search?q=${category}`}>
                <h2 className="lg:text-lg text-base text-center hover:text-dark">
                  View More
                </h2>
              </Link>
            </div>
          </div>
        </div>

        <Box padding={"1rem"} position={"relative"}>
          <Flex
            overflowX={"auto"}
            direction={"row"}
            id={`${category}__container__scrollbar`}
            className="container__hide__scrollbar gap-4"
          >
            {Products.length > 0
              ? Products.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    userInfo={userInfo}
                  />
                ))
              : [1, 2, 3, 4].map((item) => <LoaderSkeleton key={item} />)}
          </Flex>

          {Products.length > 4 && (
            <Box display={{ base: "none", md: "none", xl: "block" }}>
              <Box
                onClick={handleLeftScroll}
                position="absolute"
                top="50%"
                left="-3%"
                cursor="pointer"
              >
                <AiOutlineArrowLeft size={30} />
              </Box>
              <Box
                onClick={handleRightScroll}
                position="absolute"
                top="50%"
                right="-3%"
                cursor="pointer"
              >
                <AiOutlineArrowRight size={30} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SpecialProducts;
