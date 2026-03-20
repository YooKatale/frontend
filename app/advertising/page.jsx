"use client";

import {
  Box, Container, Flex, Text, Heading, Button, HStack, VStack,
  Badge, SimpleGrid, Spinner, Center, Icon, Tabs, TabList, Tab,
  TabPanels, TabPanel, useToast,
} from "@chakra-ui/react";
import { Check, X, Zap, Star, BarChart2, Mail, Users, CreditCard } from "lucide-react";
import { useAuth } from "@slices/authSlice";
import React, { useEffect, useState } from "react";
import {
  useAdvertisementPackageGetMutation,
  useAdvertisementPostMutation,
} from "@slices/usersApiSlice";
import { useRouter } from "next/navigation";

const PRIMARY = "#185f2d";
const SECONDARY = "#1f793a";

const BASIC_HIGHLIGHTS = [
  { icon: Zap, label: "Banner ad placement in the app" },
  { icon: BarChart2, label: "Basic performance report" },
  { icon: Users, label: "Reach local buyers in your area" },
];

const VIP_HIGHLIGHTS = [
  { icon: Zap, label: "Premium banner + featured listing" },
  { icon: BarChart2, label: "Full analytics & sales insights" },
  { icon: Mail, label: "Email & social media promotion" },
  { icon: Users, label: "Dedicated account manager" },
  { icon: Star, label: "Priority placement in search results" },
];

function PeriodCard({ pack, isSelected, onClick }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="100%"
      textAlign="left"
      p={4}
      borderRadius="xl"
      border="2px solid"
      borderColor={isSelected ? PRIMARY : "gray.200"}
      bg={isSelected ? `${PRIMARY}08` : "white"}
      transition="all 0.15s"
      _hover={{ borderColor: PRIMARY, bg: `${PRIMARY}05` }}
      cursor="pointer"
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" fontWeight="700" color="gray.700" textTransform="capitalize">{pack.period}</Text>
          <Text fontSize="xs" color="gray.400" mt={0.5}>per period</Text>
        </Box>
        <Box textAlign="right">
          <Text fontSize="lg" fontWeight="800" color={isSelected ? PRIMARY : "gray.800"}>
            UGX {Number(pack.price).toLocaleString()}
          </Text>
          {isSelected && (
            <Badge bg={PRIMARY} color="white" borderRadius="full" fontSize="9px" px={2}>Selected</Badge>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

function FeatureItem({ icon: IconComp, label }) {
  return (
    <HStack spacing={3} align="center">
      <Flex w="32px" h="32px" borderRadius="lg" bg={`${PRIMARY}12`} align="center" justify="center" flexShrink={0}>
        <IconComp size={15} color={PRIMARY} />
      </Flex>
      <Text fontSize="sm" color="gray.600">{label}</Text>
    </HStack>
  );
}

const Advertising = () => {
  const chakraToast = useToast();
  const router = useRouter();
  const [advertisementPackages, setAdvertisementPackages] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeCard, setActiveCard] = useState("basic");
  const [selectedPack, setSelectedPack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  const [fetchPackages] = useAdvertisementPackageGetMutation();
  const [createAdvertisement] = useAdvertisementPostMutation();
  const { userInfo } = useAuth();

  if (!userInfo || userInfo === {} || userInfo === "") {
    router.push("/signin");
  }

  const fetchAdvertisementPackages = async () => {
    setFetchingPackages(true);
    try {
      const res = await fetchPackages().unwrap();
      if (res?.success === true) setAdvertisementPackages(res?.packages || []);
    } catch {}
    setFetchingPackages(false);
  };

  useEffect(() => {
    fetchAdvertisementPackages();
  }, []);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
    setActiveCard(index === 0 ? "basic" : "vip");
    setSelectedPack(null);
  };

  const handlePayment = async () => {
    if (!selectedPack) return;
    setIsLoading(true);
    try {
      const res = await createAdvertisement({
        user: userInfo._id,
        packageId: selectedPack._id,
      }).unwrap();
      if (res.status === "Sucess") router.push(`/payment/${res.data.Order}`);
    } catch (err) {
      chakraToast({
        title: "Payment Error",
        description: err.data?.message || err.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPackages = advertisementPackages.filter(
    (p) => p.type?.toLowerCase() === (activeCard === "basic" ? "basic" : "vip")
  );

  const highlights = activeCard === "basic" ? BASIC_HIGHLIGHTS : VIP_HIGHLIGHTS;

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="860px">
        {/* Hero */}
        <VStack spacing={3} textAlign="center" mb={10}>
          <Badge bg={PRIMARY} color="white" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="700" letterSpacing="wider">
            ADVERTISE
          </Badge>
          <Heading
            size={{ base: "lg", md: "xl" }}
            fontWeight="800"
            color="gray.800"
            lineHeight="shorter"
          >
            Reach more customers on YooKatale
          </Heading>
          <Text color="gray.500" maxW="480px" fontSize="sm" lineHeight="tall">
            Put your products in front of thousands of active shoppers in Uganda. Pick a plan that fits your budget.
          </Text>
        </VStack>

        {/* Plan tabs */}
        <Tabs index={activeTabIndex} onChange={handleTabChange}>
          <TabList
            justifyContent="center"
            border="none"
            mb={8}
            bg="white"
            borderRadius="xl"
            p={1}
            maxW="300px"
            mx="auto"
            boxShadow="0 2px 8px rgba(0,0,0,0.06)"
          >
            <Tab
              flex={1}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="700"
              _selected={{ bg: PRIMARY, color: "white" }}
              _hover={{ color: PRIMARY }}
              color="gray.500"
              py={2.5}
            >
              Basic
            </Tab>
            <Tab
              flex={1}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="700"
              _selected={{ bg: PRIMARY, color: "white" }}
              _hover={{ color: PRIMARY }}
              color="gray.500"
              py={2.5}
            >
              VIP
            </Tab>
          </TabList>

          <TabPanels>
            {[0, 1].map((tabIdx) => (
              <TabPanel key={tabIdx} p={0}>
                <Flex gap={6} direction={{ base: "column", md: "row" }} align="flex-start">
                  {/* Left: Features */}
                  <Box
                    flex="1"
                    bg="white"
                    borderRadius="2xl"
                    p={6}
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="0 2px 8px rgba(0,0,0,0.05)"
                  >
                    <Flex align="center" gap={3} mb={5}>
                      <Box p={2.5} borderRadius="lg" bg={`${PRIMARY}12`}>
                        {tabIdx === 0 ? <Zap size={18} color={PRIMARY} /> : <Star size={18} color={PRIMARY} />}
                      </Box>
                      <Box>
                        <Text fontSize="md" fontWeight="800" color="gray.800">{tabIdx === 0 ? "Basic Plan" : "VIP Plan"}</Text>
                        <Text fontSize="xs" color="gray.400">{tabIdx === 0 ? "Great for getting started" : "Maximum visibility & support"}</Text>
                      </Box>
                    </Flex>
                    <VStack spacing={3} align="stretch">
                      {highlights.map((h, i) => (
                        <FeatureItem key={i} icon={h.icon} label={h.label} />
                      ))}
                    </VStack>
                  </Box>

                  {/* Right: Period selector + pay */}
                  <Box
                    flex="1.2"
                    bg="white"
                    borderRadius="2xl"
                    p={6}
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="0 2px 8px rgba(0,0,0,0.05)"
                  >
                    <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color="gray.400" mb={3}>
                      Choose a period
                    </Text>

                    {fetchingPackages ? (
                      <Center py={8}><Spinner color={PRIMARY} /></Center>
                    ) : filteredPackages.length === 0 ? (
                      <Center py={8}>
                        <Text color="gray.400" fontSize="sm">No packages available</Text>
                      </Center>
                    ) : (
                      <VStack spacing={2} align="stretch" mb={5}>
                        {filteredPackages.map((pack) => (
                          <PeriodCard
                            key={pack._id}
                            pack={pack}
                            isSelected={selectedPack?._id === pack._id}
                            onClick={() => setSelectedPack(pack)}
                          />
                        ))}
                      </VStack>
                    )}

                    {selectedPack && (
                      <Box
                        p={4}
                        borderRadius="xl"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.100"
                        mb={4}
                      >
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" color="gray.500">Total due</Text>
                          <Text fontSize="xl" fontWeight="800" color={PRIMARY}>
                            UGX {Number(selectedPack.price).toLocaleString()}
                          </Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.400" mt={1}>
                          {selectedPack.period} · {tabIdx === 0 ? "Basic" : "VIP"} plan
                        </Text>
                      </Box>
                    )}

                    <Button
                      w="100%"
                      h="50px"
                      bg={selectedPack ? PRIMARY : "gray.200"}
                      color={selectedPack ? "white" : "gray.400"}
                      fontWeight="700"
                      fontSize="sm"
                      borderRadius="xl"
                      leftIcon={<CreditCard size={16} />}
                      onClick={handlePayment}
                      isLoading={isLoading}
                      isDisabled={!selectedPack}
                      _hover={{ bg: selectedPack ? SECONDARY : "gray.200" }}
                      cursor={selectedPack ? "pointer" : "not-allowed"}
                    >
                      {selectedPack ? `Pay UGX ${Number(selectedPack.price).toLocaleString()}` : "Select a period to continue"}
                    </Button>
                  </Box>
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Footer note */}
        <Text textAlign="center" fontSize="xs" color="gray.400" mt={8}>
          Payments are processed securely. Contact us at <Text as="span" color={PRIMARY} fontWeight="600">support@yookatale.app</Text> for any questions.
        </Text>
      </Container>
    </Box>
  );
};

export default Advertising;
