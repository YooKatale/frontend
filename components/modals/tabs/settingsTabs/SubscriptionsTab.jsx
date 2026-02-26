"use client";

import { Box, Text, Link } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";

const SubscriptionsTab = () => {
  return (
    <Box padding={{ base: "1rem", md: "2rem" }}>
      <Text fontSize="lg" fontWeight="600" color="gray.800" mb={2}>
        Your subscriptions
      </Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
        View and manage your meal plans and subscriptions.
      </Text>
      <Link
        href="/subscription"
        color={ThemeColors.primaryColor}
        fontWeight="600"
        _hover={{ textDecoration: "underline" }}
      >
        Go to subscription plans →
      </Link>
    </Box>
  );
};

export default SubscriptionsTab;
