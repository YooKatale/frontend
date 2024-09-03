"use client";

import { Box, Flex, Grid, Heading, Text, Divider } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";

const About = () => {
  return (
    <>
      <Box>
        <Box padding={{ base: "3rem 2rem", md: "3rem", xl: "3rem" }}>
          <Box>
            <Heading as={"h3"} size="md" textAlign={"center"}>
              About Us
            </Heading>
            <Text
              className="secondary-light-font"
              fontSize={"4xl"}
              textAlign={"center"}
            >
              Little About Us
            </Text>
            <Flex>
              <Box
                height={"0.2rem"}
                width={"8rem"}
                margin={"0.5rem auto"}
                background={ThemeColors.primaryColor}
              ></Box>
            </Flex>
          </Box>

          <Box padding={"2rem 0"}>
            <Flex justifyContent="center">
              <Box width={{ base: "100%", md: "100%", xl: "80%" }}>
                <Flex direction={{ base: "column", md: "column", xl: "row" }}>
                  <Box width={{ base: "100%", md: "100%", xl: "60%" }}>
                    <Text fontSize={"lg"} textAlign={"center"}>
                      YooKatale is a mobile food market that sells and
                       buys food, promotes and advertises various food
                        products across Uganda to other countries with
                         a variety of foods from different cultures,
                          in affordable quantities & quality.
                    </Text>
                  </Box>
                  <Box
                    width={{ base: "100%", md: "100%", xl: "40%" }}
                    padding={{ base: "1rem 0", md: "0", xl: "0 1rem" }}
                  >
                    <Box
                      border={"1.7px solid " + ThemeColors.lightColor}
                      borderRadius={"md"}
                      padding={"1rem"}
                    >
                      <Heading as={"h3"} size="md">
                        Mission
                      </Heading>
                      <Text
                        className="secondary-light-font"
                        size={"2xl"}
                        margin={"0.3rem 0"}
                      >
                        To make food accessible everywhere.
                      </Text>
                      <Divider my={4} />
                      <Heading as={"h3"} size="md">
                        Vision
                      </Heading>
                      <Text
                        className="secondary-light-font"
                        size={"2xl"}
                        margin={"0.3rem 0"}
                      >
                        To connect people & communities to healthy food anywhere.
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Flex>

            <Box className={"py-4"}>
              <Box textAlign="center">
                <Heading as={"h3"} size="lg" marginBottom={4}>
                  Manifesto
                </Heading>
                <Text>
                  To enable People, Yookatale is about giving
                   and lifting others with love and trust as
                    the fabric and structure of building happy
                     & healthy communities everywhere.
                </Text>
              </Box>

              <Box my={8}>
                <Heading as="h3" size="lg" textAlign={"center"} marginBottom={4}>
                  Core Values
                </Heading>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "repeat(3, 1fr)" }} gap={6}>
                  {[
                    "Focus on the customer.",
                    "Respect everyone.",
                    "Simplify everything.",
                    "Be authentic & curious.",
                    "Respect opportunities.",
                    "Never give up."
                  ].map((value, index) => (
                    <Box
                      key={index}
                      padding={4}
                      border="2px solid"
                      borderColor={ThemeColors.lightColor}
                      borderRadius="md"
                    >
                      <Text textAlign="center">{value}</Text>
                    </Box>
                  ))}
                </Grid>
              </Box>

              <Box my={8}>
                <Heading as="h3" size="lg" textAlign={"center"} marginBottom={4}>
                  Culture
                </Heading>
                <Text textAlign={"center"} fontSize={"lg"}>
                  We are a hybrid company that integrates
                   both physical and digital technology
                    solutions to uplift & solve everyday
                     problems in society.
                </Text>
              </Box>

              <Box my={8}>
                <Heading as="h3" size="lg" textAlign={"center"} marginBottom={4}>
                  Hybrid Organizational Structure
                </Heading>
                <Text textAlign={"center"} fontSize={"lg"}>
                  Yookatale's culture can be described as
                   having a hierarchical structure, where
                    the focus is on being customer-centric
                     first, placing employees second, and
                      considering stakeholders as the 
                      final priority. This approach 
                      emphasizes the importance of 
                      prioritizing customer needs and
                       satisfaction, followed by ensuring
                        the well-being and engagement of 
                        employees, and finally, considering
                         the interests of stakeholders in
                          the decision-making process.
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default About;
