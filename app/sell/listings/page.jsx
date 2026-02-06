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
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { useGetMyListingsQuery } from "@slices/listingsApiSlice";
import { ThemeColors } from "@constants/constants";

export default function ListingsPage() {
  const { data: listings, isLoading, error } = useGetMyListingsQuery();

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color={ThemeColors.primaryColor} />
        <Text mt={4} color="gray.500">
          Loading listings…
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error?.data?.message || "Failed to load listings"}
      </Alert>
    );
  }

  const listingsList = listings?.data || listings || [];

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.800">
          My Listings
        </Heading>
        <Button
          as={Link}
          href="/sell/listings/new"
          bg={ThemeColors.primaryColor}
          color="white"
          _hover={{ bg: ThemeColors.secondaryColor }}
        >
          Add listing
        </Button>
      </Flex>
      {listingsList.length === 0 ? (
        <Card>
          <CardBody>
            <Text color="gray.500">No listings yet. Add your first listing.</Text>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={3} align="stretch">
          {listingsList.map((listing) => {
            const statusColor =
              listing.status === "approved"
                ? "green"
                : listing.status === "rejected"
                ? "red"
                : "yellow";
            return (
              <Card key={listing._id} _hover={{ shadow: "md" }} transition="all 0.2s">
                <CardBody>
                  <Flex gap={4} align="center">
                    {listing.images?.[0] && (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        w={16}
                        h={16}
                        objectFit="cover"
                        borderRadius="lg"
                        flexShrink={0}
                      />
                    )}
                    <Box flex="1" minW={0}>
                      <Heading size="sm" color="gray.800" mb={1} noOfLines={1}>
                        {listing.title}
                      </Heading>
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        {listing.categoryId?.name || "—"} · UGX{" "}
                        {Number(listing.price || 0).toLocaleString()}
                        {listing.negotiable ? " (negotiable)" : ""}
                      </Text>
                      <Badge colorScheme={statusColor}>{listing.status}</Badge>
                    </Box>
                    <Button
                      as={Link}
                      href={`/sell/listings/${listing._id}`}
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
