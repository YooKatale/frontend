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
import { useAuth } from "@slices/authSlice";
import { ThemeColors } from "@constants/constants";
import { useGetMyStoresQuery } from "@slices/storesApiSlice";
import { useGetMyListingsQuery } from "@slices/listingsApiSlice";

export default function SellDashboardPage() {
  const { userInfo } = useAuth();
  const name =
    [userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") ||
    userInfo?.email ||
    "Seller";
  const { data: storesData } = useGetMyStoresQuery();
  const { data: listingsData } = useGetMyListingsQuery();
  const storesCount = Array.isArray(storesData?.data || storesData) ? (storesData?.data || storesData).length : 0;
  const listingsCount = Array.isArray(listingsData?.data || listingsData) ? (listingsData?.data || listingsData).length : 0;

  return (
    <Box maxW="4xl">
      <Heading size="lg" mb={2} color="gray.800">
        Welcome, {name}
      </Heading>
      <Text color="gray.500" mb={3}>
        Manage your stores and listings from here.
      </Text>
      <Text color="gray.600" mb={6} fontSize="sm">
        {storesCount} store(s) and {listingsCount} listing(s) linked to your seller account.
      </Text>
      <Card mb={4} borderWidth="1px" borderColor="orange.200" bg="orange.50">
        <CardBody>
          <VStack align="start" spacing={2}>
            <Heading size="sm" color="orange.700">Need vendor approval first?</Heading>
            <Text fontSize="sm" color="orange.800">
              Submit your vendor details on the partner page, then return here to run your full seller dashboard.
            </Text>
            <ChakraLink as={Link} href="/partner" color={ThemeColors.primaryColor} fontWeight="600">
              Complete vendor onboarding
            </ChakraLink>
          </VStack>
        </CardBody>
      </Card>
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
