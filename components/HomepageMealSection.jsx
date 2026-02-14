"use client";

import { Box, Flex, Text, Badge, Heading, Button, SimpleGrid } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMealSlotsPublicGetMutation } from "@slices/usersApiSlice";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' fill='%23e2e8f0'%3E%3Crect width='200' height='150' fill='%23f7fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14'%3EMeal%3C/text%3E%3C/svg%3E";

const MEAL_LABELS = {
  breakfast: { title: "Breakfast", subtitle: "Ready to eat & Ready to cook", time: "6:00 AM – 10:00 AM" },
  lunch: { title: "Lunch", subtitle: "Ready to eat & Ready to cook", time: "12:00 PM – 3:00 PM" },
  supper: { title: "Supper", subtitle: "Ready to eat & Ready to cook", time: "5:00 PM – 10:00 PM" },
};

export default function HomepageMealSection({ mealType, slots: slotsProp, loading: loadingProp }) {
  const [trigger, { data: res, isLoading }] = useMealSlotsPublicGetMutation();
  const [internalSlots, setInternalSlots] = useState([]);

  const isControlled = slotsProp !== undefined;
  const slots = isControlled ? (slotsProp || []) : internalSlots;
  const loading = isControlled ? (loadingProp ?? false) : isLoading;

  useEffect(() => {
    if (!isControlled) {
      trigger({ mealType });
    }
  }, [isControlled, mealType, trigger]);

  useEffect(() => {
    if (isControlled) return;
    if (res?.status === "Success" && Array.isArray(res?.data)) {
      setInternalSlots(res.data);
    } else if (res && res.status !== "Success") {
      setInternalSlots([]);
    }
  }, [isControlled, res]);

  const labels = MEAL_LABELS[mealType] || MEAL_LABELS.breakfast;
  const readyToEat = slots.filter((s) => s.prepType === "ready-to-eat");
  const readyToCook = slots.filter((s) => s.prepType === "ready-to-cook");
  const displaySlots = [...readyToEat, ...readyToCook].slice(0, 6);

  if (loading) {
    return (
      <Box py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
        <Box height="4px" width="80px" bg={ThemeColors.primaryColor} borderRadius="full" mb={4} />
        <Heading size="md" color="gray.700" mb={2}>{labels.title}</Heading>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} gap={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i} bg="gray.100" borderRadius="lg" height="140px" />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (displaySlots.length === 0) {
    return (
      <Box py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }} bg="gray.50" borderRadius="xl">
        <Heading size="md" color="gray.700" mb={2}>{labels.title}</Heading>
        <Text color="gray.600" mb={3}>Explore meal plans for {labels.title.toLowerCase()}.</Text>
        <Button as={Link} href="/subscription" colorScheme="green" size="sm">
          View meal plans
        </Button>
      </Box>
    );
  }

  return (
    <Box py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
      <Box height="4px" width="80px" bg={ThemeColors.primaryColor} borderRadius="full" mb={2} />
      <Heading size="lg" color="gray.800" fontWeight="700" mb={0}>
        {labels.title}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>{labels.subtitle} · {labels.time}</Text>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} spacing={3}>
        {displaySlots.map((slot, idx) => (
          <Box
            key={slot._id || `${slot.day}-${slot.prepType}-${idx}`}
            as={Link}
            href="/subscription"
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            _hover={{ borderColor: ThemeColors.primaryColor, boxShadow: "md" }}
            transition="all 0.2s"
          >
            <Box position="relative" width="100%" paddingTop="75%">
              <Image
                src={slot.imageUrl || PLACEHOLDER_IMAGE}
                alt={slot.mealName || "Meal"}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 16vw"
              />
            </Box>
            <Box p={2}>
              <Text fontSize="xs" fontWeight="600" noOfLines={2} color="gray.800">
                {slot.mealName || "Meal"}
              </Text>
              <Badge
                colorScheme={slot.prepType === "ready-to-eat" ? "green" : "blue"}
                fontSize="2xs"
                mt={1}
              >
                {slot.prepType === "ready-to-eat" ? "Ready to eat" : "Ready to cook"}
              </Badge>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
      <Flex justify="flex-end" mt={3}>
        <Button as={Link} href="/subscription" size="sm" colorScheme="green" variant="outline">
          See all {labels.title} plans
        </Button>
      </Flex>
    </Box>
  );
}
