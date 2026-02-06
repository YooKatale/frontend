"use client";

import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useGetSellerPerformanceQuery } from "@slices/sellerApiSlice";
import { ThemeColors } from "@constants/constants";

export default function PerformancePage() {
  const { data: performance, isLoading, error } = useGetSellerPerformanceQuery();

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color={ThemeColors.primaryColor} />
        <Text mt={4} color="gray.500">
          Loading performance data…
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error?.data?.message || "Failed to load performance data"}
      </Alert>
    );
  }

  const data = performance?.data || performance || {};

  const cards = [
    { label: "Total views", value: data.viewCount ?? 0 },
    { label: "Orders", value: data.orderCount ?? 0 },
    { label: "Revenue (UGX)", value: (data.revenue ?? 0).toLocaleString() },
    { label: "Average rating", value: (data.averageRating ?? 0).toFixed(1) },
    { label: "Reviews", value: data.ratingCount ?? 0 },
  ];

  return (
    <Box>
      <Heading size="lg" mb={6} color="gray.800">
        Performance
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
        {cards.map((card) => (
          <Card key={card.label}>
            <CardBody>
              <Text fontSize="sm" color="gray.500" mb={1}>
                {card.label}
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                {card.value}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
