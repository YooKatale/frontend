"use client";

import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { useGetMyStoresQuery } from "@slices/storesApiSlice";
import { ThemeColors } from "@constants/constants";

export default function StoresPage() {
  const { data: stores, isLoading, error } = useGetMyStoresQuery();

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color={ThemeColors.primaryColor} />
        <Text mt={4} color="gray.500">
          Loading stores…
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error?.data?.message || "Failed to load stores"}
      </Alert>
    );
  }

  const storesList = stores?.data || stores || [];

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.800">
          My Stores
        </Heading>
        <Button
          as={Link}
          href="/sell/stores/new"
          bg={ThemeColors.primaryColor}
          color="white"
          _hover={{ bg: ThemeColors.secondaryColor }}
        >
          Add store
        </Button>
      </Flex>
      {storesList.length === 0 ? (
        <Card>
          <CardBody>
            <Text color="gray.500">
              No stores yet. Add your first store to start listing.
            </Text>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={3} align="stretch">
          {storesList.map((store) => {
            const statusColor =
              store.status === "approved"
                ? "green"
                : store.status === "rejected"
                ? "red"
                : "yellow";
            return (
              <Card key={store._id} _hover={{ shadow: "md" }} transition="all 0.2s">
                <CardBody>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Heading size="sm" color="gray.800" mb={1}>
                        {store.name}
                      </Heading>
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        {store.locationId?.name || store.addressLine || "—"}
                      </Text>
                      <Badge colorScheme={statusColor}>{store.status}</Badge>
                    </Box>
                    <Button
                      as={Link}
                      href={`/sell/stores/${store._id}`}
                      variant="outline"
                      size="sm"
                      colorScheme="green"
                    >
                      Edit
                    </Button>
                  </Flex>
                </CardBody>
              </Card>
            );
          })}
        </VStack>
      )}
    </Box>
  );
}
