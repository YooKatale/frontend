"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import { DB_URL } from "@config/config";
import { ThemeColors } from "@constants/constants";

export default function PartnerPortalPage() {
  const { userInfo } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [driver, setDriver] = useState(null);

  const partnerId = userInfo?.partnerId || null;

  useEffect(() => {
    const fetchDriverDashboard = async () => {
      if (!partnerId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${DB_URL}/driver/dashboard/${partnerId}`, {
          credentials: "include",
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.status !== "Success") {
          throw new Error(json?.message || "Failed to load driver dashboard");
        }
        setDriver(json?.data || null);
      } catch (err) {
        setError(err?.message || "Failed to load partner portal");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDashboard();
  }, [partnerId]);

  const displayName = useMemo(() => {
    return (
      [userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") ||
      userInfo?.email ||
      "Partner"
    );
  }, [userInfo]);

  if (!userInfo) {
    return (
      <Box maxW="5xl" mx="auto" py={10} px={4}>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Please sign in to access your partner portal.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box maxW="5xl" mx="auto" py={10} px={4} textAlign="center">
        <Spinner size="xl" color={ThemeColors.primaryColor} />
        <Text mt={4} color="gray.600">Loading partner portal...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="5xl" mx="auto" py={10} px={4}>
      <Heading size="lg" color="gray.800">Partner Portal</Heading>
      <Text color="gray.600" mt={2} mb={6}>Welcome, {displayName}</Text>

      {error ? (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}

      {!partnerId ? (
        <Card borderWidth="1px" borderColor="orange.200" bg="orange.50">
          <CardBody>
            <VStack align="start" spacing={3}>
              <Heading size="sm" color="orange.700">No approved driver account found yet</Heading>
              <Text color="orange.800" fontSize="sm">
                Submit your delivery partner application first, then your approved account data will appear here.
              </Text>
              <Button as={Link} href="/partner" bg={ThemeColors.primaryColor} color="white" _hover={{ bg: ThemeColors.secondaryColor }}>
                Apply as delivery partner
              </Button>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <VStack align="stretch" spacing={4}>
          {driver?.driver?.status === "Verified" && (
            <Card borderWidth="1px" borderColor="green.300" bg="green.50">
              <CardBody>
                <HStack justify="space-between" flexWrap="wrap" gap={3}>
                  <VStack align="start" spacing={1}>
                    <Heading size="sm" color="green.700">Your driver account is verified</Heading>
                    <Text fontSize="sm" color="green.800">Access your full driver dashboard to manage orders and earnings.</Text>
                  </VStack>
                  <Button as={Link} href="/driver/dashboard" bg="green.600" color="white" _hover={{ bg: "green.700" }} size="sm">
                    Open Driver Dashboard
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          )}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Availability</Text>
                <HStack mt={2}>
                  <Badge colorScheme={driver?.isAvailable ? "green" : "yellow"}>
                    {driver?.isAvailable ? "Available" : "Offline"}
                  </Badge>
                  <Badge colorScheme="blue">{driver?.driver?.status || driver?.status || "Pending"}</Badge>
                </HStack>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Commission Earned</Text>
                <Heading size="md" mt={2}>UGX {Number(driver?.driver?.commissionEarned || driver?.commissionEarned || 0).toLocaleString()}</Heading>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">Completed Deliveries</Text>
                <Heading size="md" mt={2}>{Number(driver?.driver?.totalDeliveries || driver?.completedOrders || 0).toLocaleString()}</Heading>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      )}

      <Card mt={6}>
        <CardBody>
          <VStack align="start" spacing={2}>
            <Heading size="sm">Quick links</Heading>
            <HStack spacing={4} flexWrap="wrap">
              <Button as={Link} href="/sell" variant="outline" colorScheme="green" size="sm">Vendor dashboard</Button>
              <Button as={Link} href="/driver/dashboard" variant="outline" colorScheme="teal" size="sm">Driver dashboard</Button>
              <Button as={Link} href="/driver/login" variant="outline" colorScheme="purple" size="sm">Driver login</Button>
              <Button as={Link} href="/partner" variant="outline" colorScheme="orange" size="sm">Partner application</Button>
              <Button as={Link} href="/account" variant="outline" colorScheme="gray" size="sm">Account settings</Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
