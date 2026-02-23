"use client";

import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useSearchMutation } from "@slices/productsApiSlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard from "@components/ProductCard";
import { useAuth } from "@slices/authSlice";
import { Loader2 } from "lucide-react";
import LoaderSkeleton from "@components/LoaderSkeleton";

const Search = () => {
  // use the useSearchParam hooks from next/navigation to get url params
  const searchParam = useSearchParams();

  const { userInfo } = useAuth();

  const param = searchParam.get("q");

  const [Products, setProducts] = useState(null);

  const [fetchProducts] = useSearchMutation();

  // function handle fetching data
  const handleDataFetch = async () => {
    try {
      const res = await fetchProducts(param).unwrap();
      console.log("Search Results:", res);

      if (res?.status && res?.status == "Success") {
        // Remove duplicates by using a Map with product _id as key
        const uniqueProducts = Array.from(
          new Map(res?.Products?.map(product => [product._id, product])).values()
        );
        setProducts(uniqueProducts);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    }
  };

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
                <Box className={"lg:py-12 py-8 lg:px-0 px-8"} padding={{ base: "2rem", md: "2rem", xl: "3rem 0" }} textAlign="center">
                  <Text fontSize="xl" mb={2}>No products currently</Text>
                  <Text color="gray.600" mb={4}>Explore our meal subscription plans for curated meals delivered to you.</Text>
                  <Link href="/subscription">
                    <Button colorScheme="green" size="md">View Subscription Plans</Button>
                  </Link>
                </Box>
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
