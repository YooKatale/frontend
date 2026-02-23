"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Link as ChakraLink,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ThemeColors } from "@constants/constants";

export default function SellDashboardPage() {
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const name =
    [userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") ||
    userInfo?.email ||
    "Seller";

  return (
    <Box maxW="4xl">
      <Heading size="lg" mb={2} color="gray.800">
        Welcome, {name}
      </Heading>
      <Text color="gray.500" mb={6}>
        Manage your stores and listings from here.
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        <Card
          as={Link}
          href="/sell/stores"
          _hover={{
            borderColor: ThemeColors.primaryColor,
            shadow: "md",
            transform: "translateY(-2px)",
          }}
          transition="all 0.2s"
          cursor="pointer"
        >
          <CardBody>
            <VStack align="start" spacing={2}>
              <Heading size="sm" color="gray.800">
                My Stores
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Add and manage your store locations
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card
          as={Link}
          href="/sell/listings"
          _hover={{
            borderColor: ThemeColors.primaryColor,
            shadow: "md",
            transform: "translateY(-2px)",
          }}
          transition="all 0.2s"
          cursor="pointer"
        >
          <CardBody>
            <VStack align="start" spacing={2}>
              <Heading size="sm" color="gray.800">
                My Listings
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Create and manage your adverts
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
