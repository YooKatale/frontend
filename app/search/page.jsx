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
    <div className="page page-max">
      <div className="section-wrap">
        <div className="sec-head">
          <div className="sec-head-left">
            <span className="sec-head-label">Showing results for: {param || "Search"}</span>
          </div>
        </div>
        {Products ? (
          Products.length > 0 ? (
            <div className="prod-grid">
              {Products.map((product, index) => (
                <ProductCard
                  key={product._id || index}
                  userInfo={userInfo}
                  product={product}
                  variant="v4"
                />
              ))}
            </div>
          ) : (
            <Box className="section-wrap" padding={{ base: "2rem", md: "2rem", xl: "3rem 0" }} textAlign="center">
              <Text fontSize="xl" mb={2} color="var(--dark)">No products currently</Text>
              <Text color="var(--mid)" mb={4}>Explore our meal subscription plans for curated meals delivered to you.</Text>
              <Link href="/subscription">
                <Button colorScheme="green" size="md">View Subscription Plans</Button>
              </Link>
            </Box>
          )
        ) : (
          <div className="prod-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item}>
                <LoaderSkeleton />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pg-spacer" />
    </div>
  );
};

export default Search;
