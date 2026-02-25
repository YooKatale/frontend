"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

const ITEMS = [
  {
    title: "Fast Delivery",
    desc: "Same-day delivery available across Kampala",
    icon: "🚚",
  },
  {
    title: "100% Secure Payments",
    desc: "MTN Money, Airtel Money, Cards — all encrypted",
    icon: "🛡️",
  },
  {
    title: "Easy Returns",
    desc: "30-day hassle-free returns on eligible orders",
    icon: "↩️",
  },
  {
    title: "24/7 Support",
    desc: "Always here to help via WhatsApp or call",
    icon: "📞",
  },
];

export default function TrustStrip() {
  return (
    <Box bg="var(--dark)" color="white" py={8} borderTop="3px solid var(--brand)">
      <Box maxW="1280px" mx="auto" px={5}>
        <Flex
          direction={{ base: "column", sm: "row" }}
          wrap="wrap"
          justify="space-between"
          gap={{ base: 6, md: 8 }}
          gridTemplateColumns={{ md: "repeat(4, 1fr)" }}
        >
          {ITEMS.map((item) => (
            <Flex key={item.title} align="center" gap={4} flex="1" minW={{ base: "100%", sm: "200px" }}>
              <Box
                w="48px"
                h="48px"
                borderRadius="12px"
                bg="rgba(24, 95, 45, 0.35)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="24px"
                flexShrink={0}
              >
                {item.icon}
              </Box>
              <Box>
                <Text fontFamily="var(--font-syne), Syne, sans-serif" fontSize="14px" fontWeight="700" mb={1}>
                  {item.title}
                </Text>
                <Text fontSize="12px" color="rgba(255,255,255,0.6)">
                  {item.desc}
                </Text>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
