import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import Link from "next/link";
import React from "react";
import { FaGooglePlay, FaAppStore } from "react-icons/fa"; // Import the Google Play and App Store icons

const Footer2 = () => {
  return (
    <>
      <Box borderTop={"1.7px solid " + ThemeColors.lightColor}>
        <Flex
          direction={{ base: "column", md: "column", xl: "row" }}
          justifyContent={{ base: "center", md: "center", xl: "none" }}
        >
          <Box padding={{ base: "0.5rem 0", md: "0.5rem 0", xl: "1rem 2rem" }}>
            <Text
              fontSize="md"
              display={"flex"}
              justifyContent={{ base: "center", md: "center", xl: "none" }}
            >
              &copy; {new Date().getFullYear()}
              <Text
                color={ThemeColors.primaryColor}
                margin={"0 0.3rem"}
                fontSize="lg"
                textTransform={"uppercase"}
              >
                yookatale
              </Text>{" "}
              <span style={{ margin: "0.1rem 0 0 0" }}>
                All rights reserved
              </span>
            </Text>
          </Box>
          <Spacer display={{ base: "none", md: "none", xl: "block" }} />
          <Box padding={{ base: "0", md: "0", xl: "1rem 0" }}>
            <Flex justifyContent={{ base: "center", md: "center", xl: "none" }}>
              <Link href={"/faqs"}>
                <Box padding={{ base: "1rem", md: "1rem", xl: "0 1rem" }}>
                  <Text fontSize={"md"}>Faqs</Text>
                </Box>
              </Link>
              <Link href={"/privacy"}>
                <Box padding={{ base: "1rem", md: "1rem", xl: "0 1rem" }}>
                  <Text fontSize={"md"}>Privacy Policy</Text>
                </Box>
              </Link>
              <Link href={"/usage"}>
                <Box padding={{ base: "1rem", md: "1rem", xl: "0 1rem" }}>
                  <Text fontSize={"md"}>Usage Policy</Text>
                </Box>
              </Link>
              {/* Add Google Play and App Store icons with links */}
              <Box padding={{ base: "1rem", md: "1rem", xl: "0 1rem" }}>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.yookataleapp.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGooglePlay size={32} color="green" />
                </Link>
              </Box>
              <Box padding={{ base: "1rem", md: "1rem", xl: "0 1rem" }}>
                <Link
                  href="https://apps.apple.com/app/yookatale/id1234567890"
                  isExternal
                >
                  <FaAppStore size={32} color="blue" />
                </Link>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Footer2;

