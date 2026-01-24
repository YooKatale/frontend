"use client";

import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";

export default function SubscriptionError({ error, reset }) {
  return (
    <Box
      minH="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      p={6}
    >
      <VStack spacing={6} textAlign="center" maxW="md">
        <Heading size="lg" color={ThemeColors.primaryColor}>
          Something went wrong
        </Heading>
        <Text color="gray.600" fontSize="sm">
          The subscription page couldn&apos;t load. Please try again.
        </Text>
        <Button
          bg={ThemeColors.primaryColor}
          color="white"
          _hover={{ bg: ThemeColors.secondaryColor }}
          size="lg"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </VStack>
    </Box>
  );
}
