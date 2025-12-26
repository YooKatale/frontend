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
} from "@chakra-ui/react";
import SubscriptionCard from "@components/SubscriptionCard";
import MealCalendar from "@components/MealCalendar";
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
        chakraToast({
          description: "Please login to continue",
          status: "success",
          duration: 5000,
          isClosable: false,
        });

        setSubscriptionPackages(res?.data);
      }
    } catch (error) {}
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
      <Box>
        <Box padding={{ base: "2rem 0 3rem 0", md: "3rem 0 5rem 0" }}>
          <Box>
            <Box
              margin={"auto"}
              width={{ base: "95%", md: "90%", lg: "85%", xl: "80%", "2xl": "75%" }}
              maxWidth={"1400px"}
            >
              {/* Header Section */}
              <Box
                padding={{
                  base: "1rem 0",
                  md: "1rem 0",
                  lg: "2rem 0",
                }}
                textAlign={"center"}
              >
                <Text
                  textAlign={"center"}
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                  className="secondary-light-font"
                  marginBottom={"1rem"}
                >
                  Subscribe to our payment plan
                </Text>

                <Text
                  textAlign={"center"}
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
                  fontWeight={"semibold"}
                  marginBottom={{ base: "2rem", md: "2.5rem", lg: "3rem" }}
                >
                  Get{" "}
                  <Text
                    as={"span"}
                    fontWeight={"bold"}
                    color={ThemeColors.darkColor}
                    fontSize={{ base: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
                  >
                    25%
                  </Text>{" "}
                  subscription discount
                </Text>

                {/* Image Section - Right below header */}
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  paddingY={{ base: "1rem", md: "1.5rem", lg: "2rem" }}
                  marginBottom={{ base: "2rem", md: "2.5rem", lg: "3rem" }}
                >
                  <Image
                    src={Images.img5}
                    height={300}
                    width={300}
                    alt="subscription icon"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>

              {/* Subscription Cards Grid */}
              <Grid
                gridTemplateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
                marginBottom={{ base: "2rem", md: "3rem" }}
                alignItems={"stretch"}
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

        {/* Meal Calendar Section */}
        {subscriptionPackages.length > 0 && (
          <Box padding={"3rem 0"}>
            <Box width={{ base: "90%", md: "100%", xl: "70%" }} margin={"auto"}>
              {subscriptionPackages.map((card, index) => (
                <MealCalendar key={index} planType={card.type} />
              ))}
            </Box>
          </Box>
        )}

        {/* Food Algae Box Section */}
        {userInfo && subscriptionPackages.length > 0 && (
          <Box padding={"2rem 0 3rem 0"}>
            <Box width={{ base: "90%", md: "100%", xl: "70%" }} margin={"auto"}>
              <Flex justifyContent="center" gap={4} flexWrap="wrap">
                {subscriptionPackages.map((card, index) => (
                  <FoodAlgaeBoxModal
                    key={index}
                    userId={userInfo._id}
                    planType={card.type}
                  />
                ))}
              </Flex>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Subscription;
