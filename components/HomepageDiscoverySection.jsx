"use client";

import { Box, Flex, Heading, Text, HStack, Button, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { ThemeColors } from "@constants/constants";
import { COUNTRY_MENUS, getSubscriptionUrl } from "@lib/countryMenusConfig";

const BUDGET_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "middle", label: "Middle" },
  { value: "high", label: "High" },
];

export default function HomepageDiscoverySection({ budget, onBudgetChange }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      pt={{ base: 6, md: 8 }}
      pb={{ base: 8, md: 10 }}
      px={{ base: 4, md: 6 }}
      mx="auto"
      maxW="1400px"
      bg="white"
    >
      {/* Browse by country - clickable flags */}
      <Box mb={6}>
        <Heading
          as="h3"
          size="sm"
          fontWeight="700"
          color="gray.700"
          mb={3}
          fontSize={{ base: "0.95rem", md: "1rem" }}
        >
          Browse by country
        </Heading>
        <Box
          overflowX="auto"
          overflowY="hidden"
          py={2}
          mx={-2}
          sx={{
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-thumb": { bg: "gray.300", borderRadius: "full" },
          }}
        >
          <Flex gap={2} minW="min-content" pr={4} align="center">
            {COUNTRY_MENUS.map((country) => (
              <Link
                key={country.code}
                href={getSubscriptionUrl(country.code)}
                passHref
                legacyBehavior
              >
                <Box
                  as="a"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minW={{ base: "52px", sm: "56px" }}
                  w={{ base: "52px", sm: "56px" }}
                  h={{ base: "52px", sm: "56px" }}
                  borderRadius="xl"
                  bg={country.isDefault ? "green.50" : "gray.50"}
                  borderWidth="2px"
                  borderColor={country.isDefault ? ThemeColors.primaryColor : "gray.200"}
                  fontSize={{ base: "1.5rem", sm: "1.75rem" }}
                  transition="all 0.2s"
                  _hover={{
                    bg: "green.50",
                    borderColor: ThemeColors.primaryColor,
                    transform: "scale(1.05)",
                  }}
                  _active={{ transform: "scale(0.98)" }}
                  title={country.label}
                  aria-label={`${country.label} menu - go to subscription`}
                >
                  {country.flagEmoji}
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Budget filter */}
      <Box mb={6}>
        <Heading
          as="h3"
          size="sm"
          fontWeight="700"
          color="gray.700"
          mb={3}
          fontSize={{ base: "0.95rem", md: "1rem" }}
        >
          Budget
        </Heading>
        <HStack spacing={2} flexWrap="wrap" gap={2}>
          {BUDGET_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size={isMobile ? "sm" : "md"}
              variant={budget === opt.value ? "solid" : "outline"}
              colorScheme="green"
              bg={budget === opt.value ? ThemeColors.primaryColor : undefined}
              borderColor={budget === opt.value ? ThemeColors.primaryColor : "gray.300"}
              borderRadius="full"
              fontWeight="600"
              fontSize="0.875rem"
              minH="44px"
              px={5}
              _hover={{
                bg: budget === opt.value ? ThemeColors.secondaryColor : "green.50",
                borderColor: ThemeColors.primaryColor,
              }}
              onClick={() => onBudgetChange(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Cuisine menus row - names only, link to subscription */}
      <Box>
        <Heading
          as="h3"
          size="sm"
          fontWeight="700"
          color="gray.700"
          mb={3}
          fontSize={{ base: "0.95rem", md: "1rem" }}
        >
          Cuisine menus
        </Heading>
        <Box
          overflowX="auto"
          overflowY="hidden"
          py={2}
          mx={-2}
          sx={{
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-thumb": { bg: "gray.300", borderRadius: "full" },
          }}
        >
          <Flex gap={2} flexWrap="nowrap" minW="min-content" pr={4} align="center">
            {COUNTRY_MENUS.map((country) => (
              <Link
                key={country.code}
                href={getSubscriptionUrl(country.code)}
                passHref
                legacyBehavior
              >
                <Box
                  as="a"
                  px={4}
                  py={2.5}
                  borderRadius="xl"
                  bg="gray.50"
                  borderWidth="2px"
                  borderColor="gray.200"
                  whiteSpace="nowrap"
                  fontSize="0.875rem"
                  fontWeight="600"
                  color="gray.700"
                  transition="all 0.2s"
                  _hover={{
                    bg: "green.50",
                    borderColor: ThemeColors.primaryColor,
                    color: ThemeColors.darkColor,
                  }}
                  _active={{ transform: "scale(0.98)" }}
                >
                  {country.menuName}
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
