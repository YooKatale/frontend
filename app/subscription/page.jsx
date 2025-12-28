// import React from 'react'
"use client";

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  Divider,
  Badge,
} from "@chakra-ui/react";
import SubscriptionCard from "@components/SubscriptionCard";
import UnifiedMealSubscriptionCard from "@components/UnifiedMealSubscriptionCard";
import FoodAlgaeBoxModal from "@components/FoodAlgaeBoxModal";

import { Images, ThemeColors } from "@constants/constants";
import {
  useSubscriptionPackageGetMutation,
  useSubscriptionPostMutation,
} from "@slices/usersApiSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Calendar } from "lucide-react";

const Subscription = () => {
  const [subscriptionPackages, setSubscriptionPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const chakraToast = useToast();
  const router = useRouter();

  const [fetchPackages] = useSubscriptionPackageGetMutation();
  const [createSubscription] = useSubscriptionPostMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // check if user logged in
  if (!userInfo || userInfo == {} || userInfo == "") {
    router.push("/signin");
  }

  const handleSubscriptionCardFetch = async (req, res) => {
    try {
      const res = await fetchPackages().unwrap();

      if (res?.status == "Success") {
        // Only show login message if user is NOT logged in
        if (!userInfo || !userInfo._id) {
          chakraToast({
            title: "Login Required",
            description: "Please login to continue",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }

        setSubscriptionPackages(res?.data);
      }
    } catch (error) {
      console.error("Error fetching subscription packages:", error);
    }
  };

  useEffect(() => {
    handleSubscriptionCardFetch();
  }, []);

  const handleSubmit = async (ID) => {
    setIsLoading((prev) => (prev ? false : true));

    try {
      const res = await createSubscription({
        user: userInfo._id,
        packageId: ID,
      }).unwrap();

      setIsLoading((prev) => (prev ? false : true));

      if (res.status == "Success") router.push(`/payment/${res.data.Order}`);
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message
          ? err.data?.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <>
      <Box minHeight="100vh" bg="white">
        <Box 
          padding={{ base: "1.5rem 0 2rem 0", sm: "2rem 0 3rem 0", md: "3rem 0 4rem 0", lg: "3rem 0 5rem 0" }}
          width="100%"
        >
          <Box width="100%">
            <Box
              margin={"auto"}
              width={{ base: "100%", sm: "95%", md: "90%", lg: "85%", xl: "80%", "2xl": "75%" }}
              maxWidth={"1400px"}
              paddingX={{ base: "1rem", sm: "1.5rem", md: "2rem" }}
            >
              {/* Header Section */}
              <Box
                padding={{
                  base: "0.5rem 0 1rem 0",
                  sm: "1rem 0",
                  md: "1.5rem 0",
                  lg: "2rem 0",
                }}
                textAlign={"center"}
              >
                <Text
                  textAlign={"center"}
                  fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
                  className="secondary-light-font"
                  marginBottom={{ base: "0.75rem", md: "1rem" }}
                  lineHeight={{ base: "1.4", md: "1.5" }}
                >
                  Subscribe to our payment plan
                </Text>

                <Text
                  textAlign={"center"}
                  fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
                  fontWeight={"semibold"}
                  marginBottom={{ base: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" }}
                  lineHeight={{ base: "1.3", md: "1.4" }}
                  paddingX={{ base: "0.5rem", md: "0" }}
                >
                  Get{" "}
                  <Text
                    as={"span"}
                    fontWeight={"bold"}
                    color={ThemeColors.darkColor}
                    fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
                  >
                    25%
                  </Text>{" "}
                  subscription discount
                </Text>

                {/* Image Section - Compact and Responsive */}
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  paddingY={{ base: "0.5rem", md: "0.75rem" }}
                  marginBottom={{ base: "1rem", md: "1.5rem" }}
                  maxHeight={{ base: "120px", md: "150px", lg: "180px" }}
                  overflow="hidden"
                >
                  <Box
                    position="relative"
                    width={{ base: "200px", md: "250px", lg: "280px" }}
                    height={{ base: "120px", md: "150px", lg: "180px" }}
                    flexShrink={0}
                  >
                    <Image
                      src={Images.img5}
                      alt="subscription icon"
                      fill
                      sizes="(max-width: 768px) 200px, (max-width: 1200px) 250px, 280px"
                      style={{
                        objectFit: "contain",
                        objectPosition: "center",
                      }}
                      priority
                    />
                  </Box>
                </Box>
              </Box>

              {/* Subscription Cards Grid */}
              <Grid
                gridTemplateColumns={{
                  base: "1fr",
                  sm: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={{ base: "1.25rem", sm: "1.5rem", md: "2rem", lg: "2.5rem" }}
                marginBottom={{ base: "1.5rem", sm: "2rem", md: "3rem" }}
                alignItems={"stretch"}
                width="100%"
              >
                {subscriptionPackages.length > 0 &&
                  subscriptionPackages.map((card, index) => (
                    <SubscriptionCard
                      card={card}
                      key={index}
                      handleClick={handleSubmit}
                    />
                  ))}
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Unified Meal Subscription & Calendar Section - Organized by Plan Type */}
        {subscriptionPackages.length > 0 && (
          <Box 
            padding={{ base: "2rem 0", sm: "2.5rem 0", md: "3rem 0", lg: "4rem 0", xl: "5rem 0" }} 
            background="gray.50"
            width="100%"
          >
            <Box
              margin={"auto"}
              width={{ base: "100%", sm: "95%", md: "90%", lg: "85%", xl: "80%", "2xl": "75%" }}
              maxWidth={"1400px"}
              paddingX={{ base: "1rem", sm: "1.5rem", md: "2rem" }}
            >
              {/* Section Header */}
              <Box marginBottom={{ base: "1.5rem", sm: "2rem", md: "3rem" }} textAlign="center">
                <Flex 
                  alignItems="center" 
                  justifyContent="center" 
                  gap={{ base: "0.25rem", md: "0.5rem" }} 
                  marginBottom={{ base: "0.25rem", md: "0.5rem" }}
                  flexWrap="wrap"
                >
                  <Calendar size={{ base: 16, md: 18 }} color={ThemeColors.darkColor} />
                  <Heading
                    as="h2"
                    fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
                    fontWeight="bold"
                    color={ThemeColors.darkColor}
                    lineHeight={{ base: "1.3", md: "1.4" }}
                  >
                    Meal Subscription & Weekly Calendar
                  </Heading>
                </Flex>
                <Text 
                  fontSize={{ base: "xs", sm: "sm", md: "md" }} 
                  color="gray.600"
                  paddingX={{ base: "0.5rem", md: "0" }}
                  lineHeight={{ base: "1.5", md: "1.6" }}
                >
                  Choose your meals, view pricing, and see the weekly meal calendar for each plan
                </Text>
              </Box>


              <Stack spacing={{ base: "2rem", sm: "2.5rem", md: "3rem", lg: "4rem", xl: "5rem" }}>
                {subscriptionPackages.map((card, index) => {
                  const planType = card.type;
                  
                  return (
                    <Box key={index} width="100%">
                      {/* Unified Meal Subscription & Calendar Card */}
                      <UnifiedMealSubscriptionCard planType={planType} />

                      {/* Food Algae Box Section */}
                      {userInfo && (
                        <Box
                          marginTop={{ base: "1.5rem", sm: "2rem", md: "2.5rem" }}
                          padding={{ base: "1rem", sm: "1.25rem", md: "1.5rem", lg: "2rem" }}
                          background="blue.50"
                          borderRadius={{ base: "md", md: "lg" }}
                          border="1px solid"
                          borderColor="blue.200"
                          width="100%"
                        >
                          <Flex
                            justifyContent="space-between"
                            alignItems={{ base: "flex-start", md: "center" }}
                            flexDirection={{ base: "column", md: "row" }}
                            gap={{ base: "1rem", sm: "1.25rem", md: "2rem" }}
                          >
                            <Box flex="1" width={{ base: "100%", md: "auto" }}>
                              <Heading
                                as="h3"
                                fontSize={{ base: "md", sm: "lg", md: "xl" }}
                                fontWeight="bold"
                                color={ThemeColors.darkColor}
                                marginBottom={{ base: "0.25rem", md: "0.5rem" }}
                                lineHeight={{ base: "1.3", md: "1.4" }}
                              >
                                Add Food Algae Box
                              </Heading>
                              <Text 
                                fontSize={{ base: "xs", sm: "sm", md: "sm" }} 
                                color="gray.600"
                                lineHeight={{ base: "1.5", md: "1.6" }}
                              >
                                Enhance your meal plan with nutritious food algae supplements
                              </Text>
                            </Box>
                            <Box width={{ base: "100%", md: "auto" }}>
                              <FoodAlgaeBoxModal
                                userId={userInfo._id}
                                planType={planType}
                              />
                            </Box>
                          </Flex>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        )}

      </Box>
    </>
  );
};

export default Subscription;
