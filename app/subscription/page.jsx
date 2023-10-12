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

import { Images, ThemeColors } from "@constants/constants";
import {
  useSubscriptionPackageGetMutation,
  useSubscriptionPostMutation,
} from "@slices/usersApiSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useRouter } from "next/router";

const Subscription = () => {
  const [subscriptionPackages, setSubscriptionPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  

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

  const handlePayLater = () => {
    if (isSubscribed) {
      router.push("/payment");
    }
  };

  return (
    <>
      {
        isSubscribed ? (
          <button>Paylater</button>
        ) : (
          <Box>
        <Box padding={"3rem 0 5rem 0"}>
          <Box>
            <Flex>
              <Box
                margin={"auto"}
                width={{ base: "90%", md: "100%", xl: "70%" }}
              >
                <Flex
                  flexDirection={{
                    base: "column-reverse",
                    md: "column-reverse",
                    xl: "row",
                  }}
                >
                  <Box
                    width={{ base: "100%", md: "80%", xl: "40%" }}
                    padding={"2rem 0"}
                  >
                    {subscriptionPackages.length > 0 &&
                      subscriptionPackages.map((card, index) => (
                        <SubscriptionCard
                          card={card}
                          key={index}
                          handleClick={handleSubmit}
                        />
                      ))}
                  </Box>

                  <Box width={{ base: "100%", md: "80%", xl: "60%" }}>
                    <Box
                      padding={{
                        base: "1rem 0 2rem 0",
                        md: "1rem 0",
                        xl: "3rem",
                      }}
                    >
                      <Text
                        textAlign={"center"}
                        fontSize={"2xl"}
                        className="secondary-light-font"
                      >
                        Subscribe to our payment plan
                      </Text>

                      <Text
                        textAlign={"center"}
                        fontSize={{ base: "2xl", md: "3xl", xl: "4xl" }}
                      >
                        Get{" "}
                        <span
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: ThemeColors.darkColor,
                            textTransform: "capitalize",
                            fontSize: "2xl",
                          }}
                        >
                          {" "}
                          25%
                        </span>{" "}
                        subscription discount
                      </Text>
                    </Box>
                    <div className="py-8 lg:block hidden">
                      <div className="flex justify-center items-center relative">
                        <Image
                          src={Images.img5}
                          height={300}
                          width={300}
                          alt="icon"
                        />
                      </div>
                    </div>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
        )
      }
    </>
  );
};

export default Subscription;
