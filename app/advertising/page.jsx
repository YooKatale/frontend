"use client";

import {
  Box,
  Grid,
  Heading,
  Text,
  GridItem,
  Card,
  CardHeader,
  SimpleGrid,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import {
  SmallCloseIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";

import React, { useState } from "react";

const Advertising = () => {
  const [activeCard, setActiveCard] = useState("card1");
  const handleCardClick = (cardId) => {
    setActiveCard(cardId);
  };

  return (
    <>
      <Box>
        <h1 className="ml-10 mt-10">Choose the plan that works for you</h1>
        <Box
          padding={{ base: "3rem 2rem", md: "3rem", xl: "3rem" }}
          className="flex items-center justify-center sm:overflow-x md:overflow-x-hidden"
        >
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
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
              className="cursor-pointer"
              onClick={() => handleCardClick("card1")}
            >
              <Card
                className={`${
                  activeCard === "card1" ? "border-2 border-[#ffd900]" : ""
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
              className="cursor-pointer"
              onClick={() => handleCardClick("card2")}
            >
              <Card
                className={`${
                  activeCard === "card2" ? "border-2 border-[#ffd900]" : ""
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
      </Box>
    </>
  );
};

export default Advertising;
