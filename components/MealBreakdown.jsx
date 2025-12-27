"use client";

import {
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  Badge,
  Stack,
  Divider,
  Button,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { getMealPricing, formatPrice } from "@lib/mealPricingConfig";
import MealSubscriptionSelector from "./MealSubscriptionSelector";
import { ShoppingCart } from "lucide-react";

/**
 * Meal Breakdown Component
 * Shows pricing breakdown for each meal type (breakfast, lunch, supper)
 * with ready-to-eat and ready-to-cook options
 */
const MealBreakdown = ({ planType = "premium" }) => {
  const mealTypes = [
    { id: "breakfast", name: "Breakfast", emoji: "🍳", time: "6:00 AM - 10:00 AM" },
    { id: "lunch", name: "Lunch", emoji: "🍽️", time: "12:00 PM - 3:00 PM" },
    { id: "supper", name: "Supper", emoji: "🌙", time: "5:00 PM - 10:00 PM" },
  ];

  const prepTypes = [
    { id: "ready-to-eat", name: "Ready to Eat", color: "green" },
    { id: "ready-to-cook", name: "Ready to Cook", color: "blue" },
  ];

  return (
    <Box
      width="100%"
      borderRadius="lg"
      background="white"
      className="card__design"
      shadow="md"
      padding={{ base: "1.5rem", md: "2rem" }}
      marginTop="2rem"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        marginBottom="2rem"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: "1rem", md: "0" }}
      >
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color={ThemeColors.darkColor}
            marginBottom="0.5rem"
          >
            Meal Subscription Pricing
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
            Choose your meals by type, preparation style, and duration
          </Text>
        </Box>
        <MealSubscriptionSelector planType={planType} />
      </Flex>

      <Divider marginBottom="2rem" />

      {/* Meal Breakdown Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={{ base: "1.5rem", md: "2rem" }}
        marginBottom="2rem"
      >
        {mealTypes.map((meal) => {
          // Default to middle income level (can be made configurable later)
          const incomeLevel = "middle";
          const readyToEatPricing = getMealPricing(meal.id, "ready-to-eat", incomeLevel);
          const readyToCookPricing = getMealPricing(meal.id, "ready-to-cook", incomeLevel);

          return (
            <Box
              key={meal.id}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              padding={{ base: "1rem", md: "1.5rem" }}
              background="white"
              _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.3s ease"
            >
              {/* Meal Header */}
              <Flex alignItems="center" gap="0.75rem" marginBottom="1rem">
                <Text fontSize={{ base: "2xl", md: "3xl" }}>{meal.emoji}</Text>
                <Box>
                  <Heading fontSize={{ base: "lg", md: "xl" }}>{meal.name}</Heading>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    {meal.time}
                  </Text>
                </Box>
              </Flex>

              <Divider marginY="1rem" />

              {/* Ready to Eat Pricing */}
              <Box marginBottom="1rem">
                <Badge colorScheme="green" marginBottom="0.5rem" fontSize="xs">
                  Ready to Eat
                </Badge>
                <Stack spacing={1}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize={{ base: "xs", md: "sm" }}>Weekly:</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color={ThemeColors.darkColor}>
                      {formatPrice(readyToEatPricing.weekly)}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize={{ base: "xs", md: "sm" }}>Monthly:</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color={ThemeColors.darkColor}>
                      {formatPrice(readyToEatPricing.monthly)}
                    </Text>
                  </Flex>
                </Stack>
              </Box>

              {/* Ready to Cook Pricing */}
              <Box>
                <Badge colorScheme="blue" marginBottom="0.5rem" fontSize="xs">
                  Ready to Cook
                </Badge>
                <Stack spacing={1}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize={{ base: "xs", md: "sm" }}>Weekly:</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color={ThemeColors.darkColor}>
                      {formatPrice(readyToCookPricing.weekly)}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize={{ base: "xs", md: "sm" }}>Monthly:</Text>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color={ThemeColors.darkColor}>
                      {formatPrice(readyToCookPricing.monthly)}
                    </Text>
                  </Flex>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Grid>

      {/* Delivery Disclaimer */}
      <Box
        padding="1rem"
        background="blue.50"
        borderRadius="md"
        border="1px solid"
        borderColor="blue.200"
        marginTop="1.5rem"
      >
        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
          <Text as="span" fontWeight="bold">
            Free Delivery:
          </Text>{" "}
          Within 3km distance.{" "}
          <Text as="span" fontWeight="bold">
            Extra:
          </Text>{" "}
          950 UGX per additional kilometer.
        </Text>
      </Box>

      {/* Call to Action */}
      <Flex justifyContent="center" marginTop="2rem">
        <MealSubscriptionSelector planType={planType} />
      </Flex>
    </Box>
  );
};

export default MealBreakdown;

