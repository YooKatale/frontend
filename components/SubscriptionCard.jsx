import { Box, Flex, Grid, Text, Heading, Stack, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Spinner } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState } from "react";
import ButtonComponent from "./Button";
import { FormatCurr } from "@utils/utils";
import SubscriptionTerms from "./SubscriptionTerms";
import { UserPlus } from "lucide-react";

const SubscriptionCard = ({ card, handleClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const isFamilyPlan = card?.type?.toLowerCase() === "family";
  const isPremiumPlan = card?.type?.toLowerCase() === "premium";
  const isBusinessPlan = card?.type?.toLowerCase() === "business";

  return (
    <>
      <Box
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        background={"white"}
        className={"card__design"}
        shadow={isFamilyPlan ? "xl" : "md"}
        padding={{ base: "1.5rem 0", md: "2rem 0" }}
        display={"flex"}
        flexDirection={"column"}
        transition={"all 0.3s ease"}
        border={isFamilyPlan ? "2px solid" : "1px solid"}
        borderColor={isFamilyPlan ? ThemeColors.darkColor : "gray.200"}
        position={"relative"}
        _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
      >
        {/* Popular Badge for Family Plan */}
        {isFamilyPlan && (
          <Box
            position={"absolute"}
            top={"-12px"}
            right={{ base: "50%", md: "20px" }}
            transform={{ base: "translateX(50%)", md: "none" }}
            background={ThemeColors.darkColor}
            color={"white"}
            paddingX={"1rem"}
            paddingY={"0.25rem"}
            borderRadius={"full"}
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight={"bold"}
            zIndex={1}
          >
            MOST POPULAR
          </Box>
        )}
        
        <Box position={"relative"} height={"100%"} display={"flex"} flexDirection={"column"}>
          <Box 
            padding={{ base: "1rem", md: "1rem 1.5rem" }} 
            flex={"1"} 
            display={"flex"} 
            flexDirection={"column"}
            minHeight={"0"}
          >
            <Box padding={"0.5rem 0 1rem 0"} flexShrink={0}>
              <Heading
                as={"h2"}
                size={"md"}
                display={"flex"}
                textAlign={"center"}
                justifyContent={"center"}
                className="secondary-light-font"
                flexWrap={"wrap"}
                gap={"0.25rem"}
              >
                YooKatale
                <Heading
                  as={"h2"}
                  textTransform={"capitalize"}
                  size={"md"}
                  textAlign={"center"}
                  color={ThemeColors.darkColor}
                  className="secondary-light-font"
                >
                  {card.type}
                </Heading>
              </Heading>
            </Box>

            <Box padding={"0.5rem 0 1rem 0"}>
              {card?.price !== 0 ? (
                <Flex justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
                  {/* Show crossed out price if previousPrice exists */}
                  {card?.previousPrice && (
                  <Text
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight={"normal"}
                    textDecoration={"line-through"}
                    textAlign={"center"}
                      color={"gray.500"}
                      marginBottom={"0.25rem"}
                  >
                      UGX {FormatCurr(card?.previousPrice)}
                  </Text>
                  )}
                  <Text
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    textAlign={"center"}
                    fontWeight={"bold"}
                    color={ThemeColors.darkColor}
                    letterSpacing={"-0.5px"}
                  >
                    UGX {FormatCurr(card?.price)}
                  </Text>
                  {card?.previousPrice && (
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color={"green.600"}
                      fontWeight={"semibold"}
                      marginTop={"0.25rem"}
                    >
                      Save {FormatCurr(card?.previousPrice - card?.price)}
                    </Text>
                  )}
                </Flex>
              ) : (
                <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
                  Contact for price
                </Text>
              )}
            </Box>

            {/* User Type Label */}
            {(isPremiumPlan || isFamilyPlan || isBusinessPlan) && (
              <Box padding={"0.5rem 0"}>
                <Text 
                  textAlign={"center"} 
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight={"semibold"}
                  color={ThemeColors.darkColor}
                >
                  {isPremiumPlan ? "Single User" : isFamilyPlan ? "2-6 Users" : isBusinessPlan ? "10+ Users" : ""}
                </Text>
              </Box>
            )}

            <Box 
              padding={{ base: "0.5rem 0", md: "0.5rem 0 0.5rem 1rem" }}
              flex={"1"}
              display={"flex"}
              flexDirection={"column"}
              minHeight={"0"}
            >
              <Text 
                textAlign={"left"} 
                fontSize={{ base: "sm", md: "md" }}
                fontWeight={"bold"}
                marginBottom={{ base: "0.75rem", md: "1rem" }}
                color={ThemeColors.darkColor}
                letterSpacing={"0.5px"}
                flexShrink={0}
              >
                Benefits:
              </Text>
              <Stack 
                spacing={{ base: 2.5, md: 3 }}
                flex={"1"}
                minHeight={"0"}
              >
                {/* Standard Benefits - All Plans */}
                <Box
                  paddingY={"0.5rem"}
                  borderBottom={"1px solid"}
                  borderColor={"gray.100"}
                  marginBottom={"0.5rem"}
                >
                  <Text 
                    textAlign={"left"} 
                    fontSize={{ base: "xs", md: "sm" }}
                    lineHeight={"1.8"}
                    color={"gray.800"}
                    fontWeight={"medium"}
                  >
                    ✓ Account activation 1-3 hours
                  </Text>
                </Box>
                <Box
                  paddingY={"0.5rem"}
                  borderBottom={"1px solid"}
                  borderColor={"gray.100"}
                  marginBottom={"0.5rem"}
                >
                  <Text 
                    textAlign={"left"} 
                    fontSize={{ base: "xs", md: "sm" }}
                    lineHeight={"1.8"}
                    color={"gray.800"}
                    fontWeight={"medium"}
                  >
                    ✓ 1 {card?.type?.toLowerCase() === "premium" ? "premium" : card?.type?.toLowerCase() === "family" ? "family" : card?.type?.toLowerCase() === "business" ? "business" : card?.type?.toLowerCase()} food test
                  </Text>
                </Box>
                <Box
                  paddingY={"0.5rem"}
                  borderBottom={"1px solid"}
                  borderColor={"gray.200"}
                  marginBottom={"1rem"}
                  paddingBottom={"1rem"}
                >
                  <Text 
                    textAlign={"left"} 
                    fontSize={{ base: "xs", md: "sm" }}
                    lineHeight={"1.8"}
                    color={"gray.800"}
                    fontWeight={"medium"}
                  >
                    ✓ Package Delivery in 15-45 minutes
                  </Text>
                </Box>

                {/* Plan-Specific Benefits */}
                {isPremiumPlan ? (
                  <>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Same-day delivery of fresh produce and groceries.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Diet Insights: Personalized nutrition advice and meal planning tips.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Promotional Offers & Discounts: Exclusive access to deals on groceries and food products.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Credit Line: Option for micro-credit to purchase groceries with a pay-later model.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Unlimited Food Varieties in different quantities: Access to a wide range of products, including organic and specialty items.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Priority customer support.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Loyalty Points: Customers can redeem cash for loyalty points, creating an incentive for repeat purchases.
                      </Text>
                    </Box>
                  </>
                ) : isFamilyPlan ? (
                  <>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Diet Insights: Personalized nutrition advice and meal planning tips.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Promotional Offers & Discounts: Exclusive deals for the entire family.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Credit Line: A flexible micro-credit option that caters to family grocery needs, allowing a pay-later model.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Unlimited Food Varieties in different quantities: Access to a wide selection of groceries, catering to diverse family dietary needs.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Loyalty Points: Redeem cash for loyalty points, offering cost savings over time.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Gas Credit: Access to gas refills, ensuring customers never run out of cooking fuel.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                        fontWeight={"semibold"}
                      >
                        ● Express Delivery 24/7: Priority delivery service with around-the-clock availability, perfect for busy families with tight schedules.
                      </Text>
                    </Box>
                  </>
                ) : isBusinessPlan ? (
                  <>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Employee Meal Cards: Ensure your team is well-nourished with employee meal cards.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Gym and Wellness Cards: Promote wellness with gym memberships and wellness benefits for employees.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Diet Insights: Personalized nutrition advice and meal planning tips.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Promotional Offers & Discounts: Exclusive access to deals for your business.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Credit Line: A flexible micro-credit option that allows businesses to purchase groceries with a pay-later model.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Unlimited Food Varieties in different quantities: Access to a wide selection of groceries tailored to meet business needs.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Loyalty Points: Redeem cash for loyalty points, providing long-term savings.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                      >
                        ● Gas Credit: Access to gas refills for business operations, ensuring an uninterrupted fuel supply.
                      </Text>
                    </Box>
                    <Box paddingY={"0.5rem"}>
                      <Text 
                        textAlign={"left"} 
                        fontSize={{ base: "xs", md: "sm" }}
                        lineHeight={"1.8"}
                        color={"gray.700"}
                        fontWeight={"semibold"}
                      >
                        ● Express Delivery 24/7: Fast and priority delivery for businesses at any time.
                  </Text>
                </Box>
                  </>
                ) : null}

                {/* Rate & Comment - Non-clickable */}
                <Box
                  paddingY={"0.75rem"}
                  marginTop={"0.5rem"}
                  borderTop={"1px solid"}
                  borderColor={"gray.200"}
                >
                  <Text 
                    textAlign={"left"} 
                    fontSize={{ base: "xs", md: "sm" }}
                    lineHeight={"1.8"}
                    color={"gray.700"}
                    fontWeight={"medium"}
                  >
                    ✓ Rate & Comment
                  </Text>
                </Box>
              </Stack>
            </Box>

            <Box
              paddingTop={{ base: "1.5rem", md: "2rem" }}
              paddingX={{ base: "1rem", md: "1.5rem" }}
              marginTop={"auto"}
              flexShrink={0}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box
                width={"100%"}
                maxWidth={{ base: "100%", md: "90%" }}
                display={"flex"}
                justifyContent={"center"}
                onClick={() => {
                  setIsLoading((prev) => (prev ? false : true));
                  handleClick(card?._id);

                  setTimeout(() => {
                    setIsLoading((prev) => (prev ? false : true));
                  }, 1500);
                }}
              >
                <Box
                  as="button"
                  width={"100%"}
                  maxWidth={{ base: "100%", md: "280px" }}
                  paddingY={{ base: "0.75rem", md: "0.875rem" }}
                  paddingX={"1.5rem"}
                  background={ThemeColors.darkColor}
                  color={"white"}
                  borderRadius={"md"}
                  fontWeight={"semibold"}
                  fontSize={{ base: "sm", md: "base" }}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={"0.5rem"}
                  transition={"all 0.2s ease"}
                  _hover={{
                    background: "transparent",
                    color: ThemeColors.darkColor,
                    border: "2px solid",
                    borderColor: ThemeColors.darkColor,
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  disabled={isLoading}
                  opacity={isLoading ? 0.7 : 1}
                  cursor={isLoading ? "not-allowed" : "pointer"}
                >
                  {isLoading && (
                    <Spinner 
                      size="sm" 
                      color="currentColor" 
                      thickness="2px"
                      speed="0.65s"
                    />
                  )}
                  <Text as="span" fontWeight={"inherit"}>
                    {isLoading ? "Processing..." : `Get ${card?.type}`}
                  </Text>
                </Box>
              </Box>
            </Box>

            {/* Invite Friend Link Section */}
            <Box
              paddingTop={{ base: "1rem", md: "1.25rem" }}
              paddingX={{ base: "1rem", md: "1.5rem" }}
              flexShrink={0}
              textAlign={"center"}
            >
              <Text
                fontSize={{ base: "sm", md: "base" }}
                color={ThemeColors.darkColor}
                fontWeight={"semibold"}
                cursor={"pointer"}
                textDecoration={"underline"}
                display={"inline-flex"}
                alignItems={"center"}
                gap={"0.5rem"}
                transition={"all 0.2s ease"}
                _hover={{
                  opacity: 0.8,
                }}
                onClick={() => {
                  const inviteSection = document.getElementById("refer");
                  if (inviteSection) {
                    inviteSection.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                <UserPlus size={16} />
                Invite a friend to test
              </Text>
            </Box>

            <Box 
              paddingY={"1rem"} 
              borderTop={"1px solid"} 
              borderColor={"gray.200"} 
              flexShrink={0}
              paddingX={{ base: "1rem", md: "1.5rem" }}
              marginTop={"auto"}
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                textAlign={"center"}
                cursor={"pointer"}
                textDecoration={"underline"}
                color={"gray.600"}
                onClick={onOpen}
                _hover={{ color: ThemeColors.darkColor }}
                marginBottom={"0.75rem"}
              >
                Terms and conditions apply
              </Text>
              
              {/* Delivery Terms Summary */}
              <Box
                padding={"0.75rem"}
                background={"blue.50"}
                borderRadius={"md"}
                border={"1px solid"}
                borderColor={"blue.200"}
              >
                <Box>
                  <Text as="span" fontWeight={"bold"}>Free Delivery:</Text>{" "}
                  <Text as="span">Within 3km distance. </Text>
                  <Text as="span" fontWeight={"bold"}>Extra:</Text>{" "}
                  <Text as="span">950 UGX per additional kilometer.</Text>
                </Box>
              </Box>
            </Box>

            {/* Subscription Terms Modal */}
            <Modal 
              isOpen={isOpen} 
              onClose={onClose} 
              size={{ base: "full", md: "xl", lg: "2xl" }}
              scrollBehavior="inside"
            >
              <ModalOverlay />
              <ModalContent maxHeight={{ base: "100vh", md: "90vh" }}>
                <ModalBody padding={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }} position="relative">
                  <SubscriptionTerms handleModalClose={onClose} />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SubscriptionCard;
