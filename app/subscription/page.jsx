"use client";

/**
 * Subscription page — plan selection, meal calendar.
 * Layout: app/subscription/page.jsx
 * Plans UI: components/SubscriptionCard.jsx
 * Meal calendar UI: components/UnifiedMealSubscriptionCard.jsx
 * Meal data: lib/mealMenuConfig.js (getMealForDay)
 * Meal pricing: lib/mealPricingConfig.js (getMealPricing, formatPrice)
 * Plans from API: slices/usersApiSlice.js → subscriptionPackageGet → DB_URL/subscription/package/get
 */

import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  useToast,
  Container,
  Card,
  CardBody,
  Button,
  Icon,
  Spinner,
  ScaleFade,
  SlideFade,
  VStack,
  HStack,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import SubscriptionCard from "@components/SubscriptionCard";
import UnifiedMealSubscriptionCard from "@components/UnifiedMealSubscriptionCard";
import { ThemeColors } from "@constants/constants";
import {
  useSubscriptionPackageGetMutation,
  useSubscriptionPostMutation,
} from "@slices/usersApiSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaPercent,
  FaCalendarAlt,
  FaHeart,
  FaSeedling,
  FaAppleAlt,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaUsers,
  FaChartLine,
  FaLeaf,
} from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const themeBg = `${ThemeColors.primaryColor}12`;
const themeBorder = `${ThemeColors.primaryColor}25`;

const Subscription = () => {
  const [subscriptionPackages, setSubscriptionPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const chakraToast = useToast();
  const router = useRouter();

  const [fetchPackages] = useSubscriptionPackageGetMutation();
  const [createSubscription] = useSubscriptionPostMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!userInfo || Object.keys(userInfo).length === 0) {
      router.push("/signin");
    }
  }, [userInfo, router]);

  const handleSubscriptionCardFetch = async () => {
    try {
      const res = await fetchPackages().unwrap();
      if (res?.status === "Success") {
        if (!userInfo?._id) {
          chakraToast({
            title: "Login Required",
            description: "Please login to continue",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
        setSubscriptionPackages(res?.data || []);
        if (res?.data?.[0]) {
          setSelectedPlan(res.data[0].type);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription packages:", error);
      chakraToast({
        title: "Error",
        description: "Failed to load subscription packages",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    handleSubscriptionCardFetch();
  }, []);

  const handleSubmit = async (ID) => {
    if (!userInfo?._id) {
      router.push("/signin");
      return;
    }
    setIsLoading(true);
    try {
      const res = await createSubscription({
        user: userInfo._id,
        packageId: ID,
      }).unwrap();
      if (res.status === "Success") {
        router.push(`/payment/${res.data.Order}`);
      }
    } catch (err) {
      chakraToast({
        title: "Subscription Error",
        description: err.data?.message || "Failed to create subscription",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
  };

  const planIcons = {
    veg: FaLeaf,
    "non-veg": FaAppleAlt,
    egg: FaAppleAlt,
    mixed: FaSeedling,
    standard: FaAppleAlt,
    premium: FaHeart,
    basic: FaSeedling,
    family: FaUsers,
    business: FaChartLine,
  };

  return (
    <Box minHeight="100vh" bg="white">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
        {/* Discount banner — theme colors */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          mb={{ base: 8, md: 12 }}
        >
          <Card
            bg={themeBg}
            borderWidth="1px"
            borderColor={themeBorder}
            borderRadius="xl"
            overflow="hidden"
          >
            <CardBody>
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                gap={4}
              >
                <HStack spacing={4}>
                  <Box
                    p={3}
                    bg={ThemeColors.primaryColor}
                    borderRadius="full"
                    color="white"
                  >
                    <Icon as={FaPercent} boxSize={6} />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" color={ThemeColors.primaryColor}>
                      Limited Time Offer
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Subscribe today and save big!
                    </Text>
                  </Box>
                </HStack>
                <Box textAlign={{ base: "center", md: "right" }}>
                  <Heading size="xl" color={ThemeColors.primaryColor}>
                    25% OFF
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    On all subscription plans
                  </Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Subscription plans */}
        <Box mb={{ base: 12, md: 16 }}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={3} color={ThemeColors.primaryColor}>
                Choose Your Perfect Plan
              </Heading>
              <Text color="gray.600" maxW="2xl" mx="auto">
                Select from our carefully crafted meal plans designed to fit your
                lifestyle and dietary preferences.
              </Text>
            </Box>

            {subscriptionPackages.length > 0 ? (
              <ScaleFade in={subscriptionPackages.length > 0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {subscriptionPackages.map((card, index) => (
                    <MotionBox
                      key={card._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <SubscriptionCard
                        card={card}
                        handleClick={handleSubmit}
                        onPlanSelect={handlePlanSelect}
                        isSelected={selectedPlan === card.type}
                      />
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </ScaleFade>
            ) : (
              <Flex justify="center" align="center" minH="200px">
                <Spinner size="xl" color={ThemeColors.primaryColor} />
              </Flex>
            )}
          </VStack>
        </Box>

        {/* Meal calendar + Food Algae */}
        {subscriptionPackages.length > 0 && selectedPlan && (
          <SlideFade in={!!selectedPlan} offsetY="20px">
            <Box mb={{ base: 12, md: 16 }}>
              <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                  <HStack justify="center" spacing={3} mb={3}>
                    <Icon
                      as={FaCalendarAlt}
                      boxSize={8}
                      color={ThemeColors.primaryColor}
                    />
                    <Heading size="xl" color={ThemeColors.primaryColor}>
                      Meal Planning & Calendar
                    </Heading>
                  </HStack>
                  <Text color="gray.600" maxW="2xl" mx="auto">
                    View your selected plan&apos;s weekly meal calendar and
                    pricing.
                  </Text>
                </Box>

                <Flex wrap="wrap" gap={3} justify="center" mb={6}>
                  {subscriptionPackages.map((plan) => {
                    const PlanIcon =
                      planIcons[plan.type?.toLowerCase()] || FaAppleAlt;
                    return (
                      <Button
                        key={plan.type}
                        variant={selectedPlan === plan.type ? "solid" : "outline"}
                        bg={
                          selectedPlan === plan.type
                            ? ThemeColors.primaryColor
                            : undefined
                        }
                        colorScheme={
                          selectedPlan === plan.type ? undefined : "gray"
                        }
                        color={selectedPlan === plan.type ? "white" : undefined}
                        borderColor={
                          selectedPlan === plan.type
                            ? ThemeColors.primaryColor
                            : "gray.300"
                        }
                        leftIcon={<Icon as={PlanIcon} />}
                        onClick={() => handlePlanSelect(plan.type)}
                        size={isMobile ? "sm" : "md"}
                        borderRadius="full"
                        _hover={{
                          bg:
                            selectedPlan === plan.type
                              ? ThemeColors.secondaryColor
                              : themeBg,
                          borderColor: ThemeColors.primaryColor,
                        }}
                      >
                        {plan.type?.charAt(0).toUpperCase()}
                        {plan.type?.slice(1)}
                      </Button>
                    );
                  })}
                </Flex>

                <Box>
                  <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UnifiedMealSubscriptionCard
                      planType={selectedPlan}
                      key={selectedPlan}
                    />
                  </MotionBox>
                </Box>
              </VStack>
            </Box>
          </SlideFade>
        )}

        {/* Benefits */}
        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          mb={{ base: 12, md: 16 }}
        >
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={3} color={ThemeColors.primaryColor}>
                Why Choose Our Meal Plans?
              </Heading>
              <Text color="gray.600" maxW="2xl" mx="auto">
                Experience the difference with our premium meal subscription
                service.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {[
                {
                  icon: FaLeaf,
                  title: "Fresh & Organic",
                  description:
                    "Locally sourced, organic ingredients for maximum nutrition",
                },
                {
                  icon: FaClock,
                  title: "Time Saving",
                  description:
                    "No meal planning, grocery shopping, or cooking hassle",
                },
                {
                  icon: FaUsers,
                  title: "Expert Nutritionists",
                  description:
                    "Plans designed by certified nutrition professionals",
                },
                {
                  icon: FaChartLine,
                  title: "Flexible Plans",
                  description:
                    "Easily modify, pause, or cancel your subscription",
                },
              ].map((benefit, index) => (
                <MotionCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  variant="outline"
                  borderColor="gray.200"
                  borderRadius="xl"
                  _hover={{ borderColor: themeBorder }}
                >
                  <CardBody>
                    <VStack spacing={4} align="center" textAlign="center">
                      <Box
                        p={3}
                        bg={themeBg}
                        borderRadius="full"
                        color={ThemeColors.primaryColor}
                        border="1px solid"
                        borderColor={themeBorder}
                      >
                        <Icon as={benefit.icon} boxSize={6} />
                      </Box>
                      <Heading size="sm" color="gray.700">
                        {benefit.title}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {benefit.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </MotionBox>

        {/* CTA */}
        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          textAlign="center"
          py={8}
        >
          <Card
            bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
            color="white"
            borderRadius="xl"
            overflow="hidden"
          >
            <CardBody py={10}>
              <VStack spacing={6}>
                <Heading size="xl">
                  Ready to Transform Your Eating Habits?
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  Join thousands of satisfied customers enjoying healthy,
                  delicious meals.
                </Text>
                <Button
                  size="lg"
                  bg="white"
                  color={ThemeColors.primaryColor}
                  leftIcon={<Icon as={FaHeart} />}
                  _hover={{
                    bg: "whiteAlpha.900",
                    transform: "scale(1.05)",
                  }}
                  transition="all 0.2s"
                  onClick={() => {
                    const first = subscriptionPackages[0];
                    if (first) handleSubmit(first._id);
                  }}
                  isLoading={isLoading}
                  loadingText="Processing..."
                >
                  Start Your Journey
                </Button>
                <Text fontSize="sm" opacity={0.8}>
                  No commitment required. Cancel anytime.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Subscription;
