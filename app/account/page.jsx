"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Heading, Text, VStack, Link } from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import { ThemeColors } from "@constants/constants";

export default function AccountPage() {
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userInfo === undefined) return;
    if (!userInfo) {
      router.replace("/signin");
      return;
    }
  }, [userInfo, router]);

  if (userInfo === undefined) {
    return (
      <Container maxW="container.sm" py={8}>
        <Box h="120px" bg="gray.100" borderRadius="lg" />
      </Container>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <Container maxW="container.sm" py={8}>
      <VStack align="stretch" spacing={6}>
        <Heading size="lg" color="gray.800">
          My Account
        </Heading>
        <Text color="gray.600">
          Welcome, {userInfo?.name || userInfo?.firstname || userInfo?.email}.
        </Text>
        <VStack align="stretch" spacing={2} as="nav">
          <Link href="/invoices" color={ThemeColors.primaryColor} fontWeight="600">
            My Orders
          </Link>
          <Link href="/cashout" color={ThemeColors.primaryColor} fontWeight="600">
            Cashout
          </Link>
        </VStack>
      </VStack>
    </Container>
  );
}
