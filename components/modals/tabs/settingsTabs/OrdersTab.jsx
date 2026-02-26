"use client";

import {
  Box,
  Flex,
  Grid,
  Heading,
  useToast,
  Text,
  Button,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useOrdersMutation } from "@slices/productsApiSlice";
import { useEffect, useState } from "react";
import { useAuth } from "@slices/authSlice";
import OrderCard from "@components/OrderCard";

const OrdersTab = () => {
  const [fetchOrders, { isLoading }] = useOrdersMutation();
  const [orderTabs, setOrderTabs] = useState("active");
  const [Orders, setOrders] = useState({ CompletedOrders: [], AllOrders: [] });
  const chakraToast = useToast();
  const { userInfo } = useAuth();

  const fetchData = async () => {
    if (!userInfo?._id) return;
    try {
      const res = await fetchOrders(userInfo._id).unwrap();
      if (res?.status === "Success") {
        const data = res?.data || { CompletedOrders: [], AllOrders: [] };
        setOrders(data);
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err?.data?.message ? err?.data?.message : err?.data || err?.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [userInfo?._id]);

  return (
    <>
      <Box>
        <Box padding="0.5rem 1rem" borderBottom={"1.7px solid " + ThemeColors.lightColor}>
          <Flex justifyContent="start">
            <Box marginRight="0.5rem" onClick={() => setOrderTabs("active")}>
              <Button
                type="button"
                color={orderTabs === "active" ? ThemeColors.lightColor : "#000"}
                background={orderTabs === "active" ? ThemeColors.darkColor : "none"}
                border={"1.7px solid " + ThemeColors.darkColor}
                borderRadius="0.3rem"
                padding="1rem"
                className="secondary-light-font"
                fontSize="md"
                _hover={{
                  background: orderTabs === "active" ? "none" : ThemeColors.darkColor,
                  color: orderTabs === "active" ? "#000" : ThemeColors.lightColor,
                }}
              >
                Active Orders
              </Button>
            </Box>
            <Box marginRight="0.5rem" onClick={() => setOrderTabs("completed")}>
              <Button
                type="button"
                color={orderTabs === "completed" ? ThemeColors.lightColor : "#000"}
                background={orderTabs === "completed" ? ThemeColors.darkColor : "none"}
                border={"1.7px solid " + ThemeColors.darkColor}
                borderRadius="0.3rem"
                padding="1rem"
                className="secondary-light-font"
                fontSize="md"
                _hover={{
                  background: orderTabs === "completed" ? "none" : ThemeColors.darkColor,
                  color: orderTabs === "completed" ? "#000" : ThemeColors.lightColor,
                }}
              >
                Completed Orders
              </Button>
            </Box>
          </Flex>
        </Box>
        {orderTabs === "active" ? (
          <Box padding="0.5rem 1rem">
            <Box padding="0.5rem 0 1rem 0">
              <Heading as="h2" size="md">
                Active Orders
              </Heading>
            </Box>
            {Orders?.AllOrders?.length > 0 ? (
              <Grid
                gridTemplateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gridGap="1rem"
              >
                {Orders.AllOrders.filter((order) => (order?.status || "").toLowerCase() !== "completed").map((order, index) => (
                  <OrderCard key={order?._id || index} order={order} />
                ))}
              </Grid>
            ) : (
              <Box padding="3rem 0">
                <Text fontSize="2xl" textAlign="center">
                  You don't have active orders
                </Text>
              </Box>
            )}
          </Box>
        ) : (
          <Box padding="2rem 3rem">
            <Box padding="0.5rem 0 1rem 0">
              <Heading as="h2" size="md">
                Completed Orders
              </Heading>
            </Box>
            {Orders?.CompletedOrders?.length > 0 ? (
              <Grid
                gridTemplateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gridGap="1rem"
              >
                {Orders.CompletedOrders.map((order, index) => (
                  <OrderCard key={order?._id || index} order={order} />
                ))}
              </Grid>
            ) : (
              <Box padding="3rem 0">
                <Text fontSize="2xl" textAlign="center">
                  You don't have completed orders
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default OrdersTab;
