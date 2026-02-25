"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function SubscriptionSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiBase.replace(/\/api\/?$/, "")}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), type: "newsletter" }),
      });
      if (res.ok) {
        toast({ title: "Subscribed!", description: "You'll get our best deals first.", status: "success", duration: 4000, isClosable: true, position: "top" });
        setEmail("");
      } else {
        toast({ title: "Something went wrong", description: "Please try again later.", status: "error", duration: 4000, isClosable: true, position: "top" });
      }
    } catch (err) {
      toast({ title: "Subscription failed", description: "Please try again.", status: "error", duration: 4000, isClosable: true, position: "top" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="var(--brand-lt)" py={{ base: 10, md: 14 }} px={{ base: 4, md: 6 }}>
      <Flex
        maxW="1280px"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 6, md: 12 }}
      >
        <Box flex={1}>
          <Heading size="lg" fontFamily="var(--font-syne), Syne, sans-serif" fontWeight="800" mb={2}>
            Get exclusive deals first
          </Heading>
          <Text color="var(--mid)" fontSize="md">
            Join thousands of shoppers. No spam — unsubscribe anytime.
          </Text>
        </Box>
        <Box flex={1} as="form" onSubmit={handleSubmit}>
          <Flex
            borderRadius="var(--radius-sm)"
            overflow="hidden"
            borderWidth="2px"
            borderColor="var(--brand)"
            bg="white"
            boxShadow="var(--shadow-sm)"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="unstyled"
              px={4}
              py={3}
              fontSize="sm"
              _placeholder={{ color: "gray.400" }}
            />
            <Button
              type="submit"
              bg="var(--brand)"
              color="white"
              fontWeight="700"
              px={6}
              isLoading={loading}
              _hover={{ bg: "var(--brand-dk)" }}
            >
              Subscribe
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
