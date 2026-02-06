"use client";

import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";
import { useGetSellerOrdersQuery } from "@slices/sellerApiSlice";
import { ThemeColors } from "@constants/constants";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useGetSellerOrdersQuery();

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color={ThemeColors.primaryColor} />
        <Text mt={4} color="gray.500">
          Loading orders…
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error?.data?.message || "Failed to load orders"}
      </Alert>
    );
  }

  const ordersList = orders?.data || orders || [];

  return (
    <Box>
      <Heading size="lg" mb={6} color="gray.800">
        Orders
      </Heading>
      {ordersList.length === 0 ? (
        <Card>
          <CardBody>
            <Text color="gray.500">
              No orders yet. Orders for your listings will appear here.
            </Text>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={3} align="stretch">
          {ordersList.map((order) => (
            <Card key={order._id} _hover={{ shadow: "md" }} transition="all 0.2s">
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium" color="gray.800" mb={1}>
                      {order.customerName || "Customer"}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      UGX {(order.total || 0).toLocaleString()} · {order.status || "—"}
                    </Text>
                    {order.orderDate && (
                      <Text fontSize="xs" color="gray.400">
                        {new Date(order.orderDate).toLocaleString()}
                      </Text>
                    )}
                  </Box>
                  <Text fontSize="sm" color="gray.500">
                    {order.status || "—"}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
}
