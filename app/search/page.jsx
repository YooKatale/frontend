"use client";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useSearchMutation } from "@slices/productsApiSlice";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard from "@components/ProductCard";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import LoaderSkeleton from "@components/LoaderSkeleton";

const Search = () => {
  // use the useSearchParam hooks from next/navigation to get url params
  const searchParam = useSearchParams();

  const { userInfo } = useSelector((state) => state.auth);

  const param = searchParam.get("q");

  const [Products, setProducts] = useState(null);

  const [fetchProducts] = useSearchMutation();

  // function handle fetching data
  const handleDataFetch = async () => {
    try {
      const res = await fetchProducts(param).unwrap();
      console.log(res);

      if (res?.status && res?.status == "Success") {
        setProducts(res?.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fetch product categories
  useEffect(() => {
    handleDataFetch();
  }, [param]);

  return (
    <>
      <div>
        <div className="lg:py-8 lg:px-20 sm:px-12 px-8">
          <h3 className="text-lg flex">
            Showing results for:
            <h3 className="text-lg text-primary mx-2">{param}</h3>
          </h3>
        </div>
        <div className="flex">
          <div className="m-auto lg:w-[85%] w-full">
            {Products ? (
              Products.length > 0 ? (
                <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-4">
                  {Products.map((product, index) => (
                    <ProductCard
                      key={index}
                      userInfo={userInfo}
                      width={false}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <div
                    className={"lg:py-12 py-8 lg:px-0 px-8"}
                    padding={{ base: "2rem", md: "2rem", xl: "3rem 0" }}
                  >
                    <p className="text-3xl">No products currently</p>
                  </div>
                </div>
              )
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item}>
                    <LoaderSkeleton />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="py-12"></div>
      </div>
    </>
  );
};

export default Search;
