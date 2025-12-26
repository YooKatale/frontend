"use client";

import { Box, Text, Stack, Flex, Badge } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";

/**
 * Food Algae Space Box Component
 * Saves and updates user's food menu preferences
 */
const FoodAlgaeBox = ({ userId, planType }) => {
  const [savedMenu, setSavedMenu] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    // Load saved menu from localStorage or API
    const saved = localStorage.getItem(`foodAlgaeBox_${userId}`);
    if (saved) {
      const menuData = JSON.parse(saved);
      setSavedMenu(menuData);
      setLastUpdated(menuData.lastUpdated);
    }
  }, [userId]);

  const handleSaveMenu = (menuData) => {
    const dataToSave = {
      ...menuData,
      userId,
      planType,
      lastUpdated: new Date().toISOString(),
    };

    // Save to localStorage (in production, save to backend)
    localStorage.setItem(`foodAlgaeBox_${userId}`, JSON.stringify(dataToSave));
    setSavedMenu(dataToSave);
    setLastUpdated(dataToSave.lastUpdated);
  };

  // This function should be called from MealCalendar when menu is saved
  useEffect(() => {
    const handleMenuUpdate = (event) => {
      if (event.detail && event.detail.menuData) {
        handleSaveMenu(event.detail.menuData);
      }
    };

    window.addEventListener("menuUpdated", handleMenuUpdate);
    return () => window.removeEventListener("menuUpdated", handleMenuUpdate);
  }, [userId, planType]);

  if (!savedMenu) {
    return (
      <Box
        width={"100%"}
        borderRadius={"md"}
        background={"gray.50"}
        padding={"2rem"}
        marginTop={"2rem"}
        textAlign={"center"}
      >
        <Text fontSize={"lg"} color={"gray.600"}>
          Your Food Algae Box is empty
        </Text>
        <Text fontSize={"sm"} color={"gray.500"} marginTop={"0.5rem"}>
          Your meal preferences will be saved here automatically
        </Text>
      </Box>
    );
  }

  return (
    <Box
      width={"100%"}
      borderRadius={"md"}
      background={"white"}
      className={"card__design"}
      shadow={"md"}
      padding={"2rem"}
      marginTop={"2rem"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} marginBottom={"1rem"}>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          Food Algae Space Box
        </Text>
        {lastUpdated && (
          <Badge colorScheme="green">
            Updated {new Date(lastUpdated).toLocaleDateString()}
          </Badge>
        )}
      </Flex>

      <Text fontSize={"sm"} color={"gray.600"} marginBottom={"1rem"}>
        Your personalized meal preferences are saved and updated automatically
      </Text>

      <Stack spacing={3}>
        <Box padding={"1rem"} backgroundColor={"gray.50"} borderRadius={"md"}>
          <Text fontWeight={"bold"} marginBottom={"0.5rem"}>
            Plan Type
          </Text>
          <Text textTransform={"capitalize"}>{savedMenu.planType || planType}</Text>
        </Box>

        {savedMenu.veganSauceOptions && (
          <Box padding={"1rem"} backgroundColor={"green.50"} borderRadius={"md"}>
            <Text fontWeight={"bold"} marginBottom={"0.5rem"}>
              Vegan Sauce Preferences
            </Text>
            <Stack spacing={1}>
              {Object.entries(savedMenu.veganSauceOptions).map(([day, enabled]) => (
                enabled && (
                  <Text key={day} fontSize={"sm"}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}: Vegan sauces enabled
                  </Text>
                )
              ))}
            </Stack>
          </Box>
        )}

        {savedMenu.menu && (
          <Box padding={"1rem"} backgroundColor={"blue.50"} borderRadius={"md"}>
            <Text fontWeight={"bold"} marginBottom={"0.5rem"}>
              Saved Menu Items
            </Text>
            <Text fontSize={"sm"} color={"gray.600"}>
              {Object.keys(savedMenu.menu).length} meal types configured
            </Text>
          </Box>
        )}
      </Stack>

      <Text fontSize={"xs"} color={"gray.500"} marginTop={"1rem"} fontStyle={"italic"}>
        This box automatically saves and updates whenever you modify your meal preferences
      </Text>
    </Box>
  );
};

export default FoodAlgaeBox;


