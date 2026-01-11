"use client";

import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Avatar,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Star, MapPin, Phone, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Vendor Card Component (Like Ujiji Store Pages)
 * Displays vendor information with ratings and stats
 */
export default function VendorCard({ vendor, showDetails = true }) {
  const rating = vendor.rating || vendor.averageRating || 0;
  const reviewCount = vendor.reviewCount || vendor.totalReviews || 0;
  const productCount = vendor.productCount || vendor.products?.length || 0;

  return (
    <Box
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      bg="white"
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{
        boxShadow: "md",
        transform: "translateY(-2px)",
      }}
    >
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        {/* Vendor Avatar/Logo */}
        <Box>
          <Avatar
            size="xl"
            src={vendor.logo || vendor.image}
            name={vendor.name || vendor.storeName}
            bg="green.100"
          />
        </Box>

        {/* Vendor Info */}
        <VStack align="start" flex={1} spacing={2}>
          <HStack justify="space-between" w="100%">
            <Heading size="md" noOfLines={1}>
              {vendor.name || vendor.storeName || "Vendor"}
            </Heading>
            {vendor.verified && (
              <Badge colorScheme="green" borderRadius="full">
                Verified
              </Badge>
            )}
          </HStack>

          {vendor.description && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {vendor.description}
            </Text>
          )}

          {/* Stats */}
          <HStack spacing={4} flexWrap="wrap">
            <HStack spacing={1}>
              <Star size={16} fill="gold" color="gold" />
              <Text fontSize="sm" fontWeight="bold">
                {rating.toFixed(1)}
              </Text>
              <Text fontSize="sm" color="gray.600">
                ({reviewCount} reviews)
              </Text>
            </HStack>

            <HStack spacing={1}>
              <Store size={16} color="gray" />
              <Text fontSize="sm" color="gray.600">
                {productCount} products
              </Text>
            </HStack>

            {vendor.location && (
              <HStack spacing={1}>
                <MapPin size={16} color="gray" />
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {vendor.location}
                </Text>
              </HStack>
            )}
          </HStack>

          {/* Actions */}
          {showDetails && (
            <HStack spacing={2} mt={2}>
              <Link href={`/vendor/${vendor._id || vendor.id}`}>
                <Button size="sm" colorScheme="green" variant="outline">
                  View Store
                </Button>
              </Link>
              {vendor.phone && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Phone size={16} />}
                  as="a"
                  href={`tel:${vendor.phone}`}
                >
                  Call
                </Button>
              )}
            </HStack>
          )}
        </VStack>
      </Flex>
    </Box>
  );
}
