"use client";

import {
  Box,
  Grid,
  Text,
  GridItem,
  Card,
  CardHeader,
  useToast,
} from "@chakra-ui/react";
import { SmallCloseIcon, CheckIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import MobileView from "@components/advertising/mobile-view";
import {
  useAdvertisementPackageGetMutation,
  useAdvertisementPostMutation,
} from "@slices/usersApiSlice";
import { useRouter } from "next/navigation";

const Advertising = () => {
  const chakraToast = useToast();
  const router = useRouter();
  const [advertisementPackages, setAdvertisementPackages] = useState([]);
  const [activeCard, setActiveCard] = useState("basic");
  const [activeButton, setActiveButton] = useState("weekly");
  const [payment, setPayment] = useState(0);
  const [fetchPackages] = useAdvertisementPackageGetMutation();
  const [createAdvertisement] = useAdvertisementPostMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [advertId, setAdvertId] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  // check if user logged in
  if (!userInfo || userInfo == {} || userInfo == "") {
    router.push("/signin");
  }

  const handleCardClick = (cardId) => {
    setActiveCard(cardId);
  };

  const fetchAdvertisementPackages = async (req, res) => {
    try {
      const res = await fetchPackages().unwrap();
      if (res?.success === true) {
        setAdvertisementPackages(res?.packages);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchAdvertisementPackages();
  }, []);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handlePayment = async () => {
    setIsLoading((prev) => (prev ? false : true));
    try {
      if (advertId !== null) {
        const res = await createAdvertisement({
          user: userInfo._id,
          packageId: advertId,
        }).unwrap();

        setIsLoading((prev) => (prev ? false : true));
        console.log("res", res);
        if (res.status == "Sucess") router.push(`/payment/${res.data.Order}`);
      }
      return;
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
      <MobileView
        handlePayment={handlePayment}
        advertisementPackages={advertisementPackages}
        userInfo={userInfo}
        setAdvertId={setAdvertId}
        payment={payment}
        setPayment={setPayment}
      />
      <Box className="hidden md:block">
        <h1 className="ml-10 mt-10">Choose the plan that works for you</h1>
        <Box
          padding={{ base: "3rem 2rem", md: "3rem", xl: "3rem" }}
          className="flex md:items-center md:justify-center sm:overflow-x md:overflow-x-hidden"
        >
          <Grid className="flex  md:grid-cols-3" gap={4}>
            <GridItem rowSpan={2} colSpan={1} className="mt-[68px]">
              <div className="w-full text-sm font-medium text-gray-900  rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <Text
                  aria-current="true"
                  className="block w-full py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                >
                  <h1 className="font-bold">Weekly</h1>
                  <div className="">
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      Adverts
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      access to pro sales
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      yookatale insights
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      emails & social media link
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      personal manager
                    </Text>
                  </div>
                </Text>
                <Text className="block w-full py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                  <h1 className="font-bold">Monthly</h1>
                  <div className="">
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      Adverts
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      access to pro sales
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      yookatale insights
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      emails & social media link
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      personal manager
                    </Text>
                  </div>
                </Text>

                <Text className="block w-full py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                  <h1 className="font-bold">3 Monthly</h1>
                  <div className="">
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      Adverts
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      access to pro sales
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      yookatale insights
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      emails & social media link
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      personal manager
                    </Text>
                  </div>
                </Text>
                <Text className="block w-full py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                  <h1 className="font-bold">6 Months</h1>
                  <div className="">
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      Adverts
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      access to pro sales
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      yookatale insights
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      emails & social media link
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      personal manager
                    </Text>
                  </div>
                </Text>
                <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                  <h1 className="font-bold">1 year</h1>
                  <div className="">
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      Adverts
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      access to pro sales
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      yookatale insights
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      emails & social media link
                    </Text>
                    <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                      personal manager
                    </Text>
                  </div>
                </Text>
              </div>
            </GridItem>
            <GridItem
              rowSpan={2}
              colSpan={1}
              className="cursor-pointer hidden md:block"
              onClick={() => handleCardClick("basic")}
            >
              <Card
                className={`${
                  activeCard === "basic" ? "border-2 border-[#ffd900]" : ""
                }`}
              >
                <CardHeader className="bg-light">Basic</CardHeader>
                <div className="w-full text-sm font-medium text-gray-900  rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    32,000 ugx
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        1 Advert
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>

                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    92,000 ugx
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        2 Adverts
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>
                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    300,000 ugx
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        3 Adverts
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>

                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    530,000 ugx
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        6 Adverts
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>
                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    <div className="flex justify-between">1,600,000 ugx</div>
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        9 Adverts
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                    </div>
                  </Text>
                </div>
              </Card>
            </GridItem>
            <GridItem
              rowSpan={2}
              colSpan={1}
              className="cursor-pointer hidden md:block"
              onClick={() => handleCardClick("vip")}
            >
              <Card
                className={`${
                  activeCard === "vip" ? "border-2 border-[#ffd900]" : ""
                }`}
              >
                <CardHeader className="bg-secondary">VIP</CardHeader>
                <div className="w-full text-sm font-medium text-gray-900  rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    0 ugx
                    <div className="">
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>

                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    600,000 ugx
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        2 Adverts
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>
                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    1,600,000 ugx
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        3 Adverts
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>

                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-b border-dashed border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    3,200,000 ugx
                    <div className="">
                      <Text className="block w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        6 Adverts
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                      <Text className="block w-full ml-10 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <CheckIcon />
                      </Text>
                    </div>
                  </Text>
                  <Text
                    aria-current="true"
                    className="block w-full px-4 py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600"
                  >
                    0 ugx
                    <div className="">
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                      <Text className="block ml-10 w-full py-3 bg-blue-700 border-gray-200 rounded-t-lg  dark:bg-gray-800 dark:border-gray-600">
                        <SmallCloseIcon />
                      </Text>
                    </div>
                  </Text>
                </div>
              </Card>
            </GridItem>
          </Grid>
        </Box>
        {activeCard === "basic" ? (
          <>
            <Box className="w-full sticky flex h-60 backdrop-blur-md bg-light rounded-md">
              {advertisementPackages
                .filter((pack) => pack.type === "Basic")
                .map((pack) => (
                  <div
                    className="flex items-center justify-center ml-10"
                    key={pack._id}
                  >
                    <button
                      onClick={() => {
                        handleButtonClick(pack.period);
                        setPayment(pack.price);
                        setAdvertId(pack._id);
                      }}
                      className={`py-2.5 px-10 font-bold me-2 mb-2 text-xl text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 ${
                        activeButton === pack.period ? "border-[#ffd900]" : ""
                      }`}
                    >
                      {pack.period}
                    </button>
                  </div>
                ))}
              {advertisementPackages.filter((pack) => pack.type === "Basic")
                .length > 0 && (
                <div className="flex items-center ml-[600px] justify-center">
                  {payment !== null && (
                    <button
                      onClick={handlePayment}
                      className="py-2.5 px-10 font-bold me-2 mb-2 text-xl text-gray-900 focus:outline-none bg-green border border-gray-200 dark:border-gray-600"
                    >
                      {payment} ugx
                    </button>
                  )}
                </div>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box className="w-full sticky flex h-60 backdrop-blur-md bg-light rounded-md">
              {advertisementPackages
                .filter((pack) => pack.type === "Vip")
                .map((pack) => (
                  <div
                    className="flex items-center justify-center ml-10"
                    key={pack._id}
                  >
                    <button
                      onClick={() => {
                        handleButtonClick(pack.period);
                        setPayment(pack.price);
                        setAdvertId(pack._id);
                      }}
                      className={`py-2.5 px-10 font-bold me-2 mb-2 text-xl text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 ${
                        activeButton === pack.period ? "border-[#ffd900]" : ""
                      }`}
                    >
                      {pack.period}
                    </button>
                  </div>
                ))}
              {advertisementPackages.filter((pack) => pack.type === "Vip")
                .length > 0 && (
                <div className="flex items-center ml-[600px] justify-center">
                  {payment !== null && (
                    <button
                      onClick={handlePayment}
                      className="py-2.5 px-10 font-bold me-2 mb-2 text-xl text-gray-900 focus:outline-none bg-green border border-gray-200 dark:border-gray-600"
                    >
                      {payment} ugx
                    </button>
                  )}
                </div>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Advertising;
