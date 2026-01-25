"use client";

/**
 * Cashout & Rewards — Cash earned, invites, loyalty, rewards, gift cards,
 * invite feature, games, payment (mobile money & credit card).
 * Uses ThemeColors, animations, and YooKatale branding.
 */

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import ReferralModal from "@components/ReferralModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaWallet,
  FaUsers,
  FaStar,
  FaGift,
  FaShareAlt,
  FaGamepad,
  FaMobileAlt,
  FaCreditCard,
  FaCoins,
  FaTicketAlt,
} from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const themeBg = `${ThemeColors.primaryColor}12`;
const themeBorder = `${ThemeColors.primaryColor}25`;

const statCards = [
  {
    key: "cash",
    label: "Cash Earned",
    value: "UGX 0",
    sub: "Available to withdraw",
    icon: FaCoins,
    color: "green",
    gradient: "linear(to-br, green.400, green.700)",
  },
  {
    key: "invites",
    label: "Total Invites",
    value: "0",
    sub: "Friends referred",
    icon: FaUsers,
    color: "blue",
    gradient: "linear(to-br, blue.400, blue.700)",
  },
  {
    key: "loyalty",
    label: "Loyalty Points",
    value: "0",
    sub: "Points to redeem",
    icon: FaStar,
    color: "yellow",
    gradient: "linear(to-br, yellow.400, orange.500)",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function CashoutPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();
  const [stats, setStats] = useState({ cash: 0, invites: 0, loyalty: 0 });

  useEffect(() => {
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      router.push("/signin");
    }
  }, [userInfo, router]);

  // Placeholder: wire to backend for cash earned, invites, loyalty
  useEffect(() => {
    if (userInfo?._id) {
      // TODO: fetch from /api/cashout or users/referrals, etc.
      setStats({ cash: 0, invites: 0, loyalty: 0 });
    }
  }, [userInfo?._id]);

  if (!userInfo) return null;

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      fontFamily="body"
      pb={16}
    >
      <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />

      {/* Hero */}
      <Box
        bgGradient={`linear(135deg, ${ThemeColors.primaryColor} 0%, ${ThemeColors.secondaryColor} 100%)`}
        color="white"
        py={{ base: 8, md: 10 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage="radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)"
          pointerEvents="none"
        />
        <Container maxW="container.xl" position="relative">
          <MotionBox
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HStack spacing={3} mb={2}>
              <Icon as={FaWallet} boxSize={8} />
              <Heading size="xl" letterSpacing="tight" fontWeight="800">
                Cashout & Rewards
              </Heading>
            </HStack>
            <Text fontSize="lg" opacity={0.95}>
              Manage your earnings, invites, loyalty points, and payment methods.
            </Text>
          </MotionBox>
        </Container>
      </Box>

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={8}>
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Stats row */}
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5} mb={10}>
            {statCards.map((s, i) => (
              <MotionCard
                key={s.key}
                variants={item}
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.100"
                _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <Flex align="flex-start" justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.500" fontWeight="600">
                        {s.label}
                      </Text>
                      <Heading
                        size="lg"
                        bgGradient={s.gradient}
                        bgClip="text"
                        fontWeight="800"
                      >
                        {s.key === "cash" && `UGX ${(stats.cash || 0).toLocaleString()}`}
                        {s.key === "invites" && String(stats.invites || 0)}
                        {s.key === "loyalty" && String(stats.loyalty || 0)}
                      </Heading>
                      <Text fontSize="xs" color="gray.500">
                        {s.sub}
                      </Text>
                    </VStack>
                    <Box
                      p={3}
                      borderRadius="xl"
                      bgGradient={s.gradient}
                      color="white"
                    >
                      <Icon as={s.icon} boxSize={6} />
                    </Box>
                  </Flex>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            {/* Rewards */}
            <MotionCard
              variants={item}
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.100"
              overflow="hidden"
            >
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg">
                    <Icon as={FaGift} color={ThemeColors.primaryColor} boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">
                    Rewards
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>
                  Redeem loyalty points for discounts, free delivery, or exclusive offers.
                </Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  bg={ThemeColors.primaryColor}
                  _hover={{ bg: ThemeColors.secondaryColor }}
                  leftIcon={<FaGift />}
                >
                  View Rewards
                </Button>
              </CardBody>
            </MotionCard>

            {/* Gift Cards */}
            <MotionCard
              variants={item}
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.100"
              overflow="hidden"
            >
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg">
                    <Icon as={FaTicketAlt} color={ThemeColors.primaryColor} boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">
                    Gift Cards
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>
                  Use or purchase gift cards for yourself or to send to friends.
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="green"
                  borderColor={ThemeColors.primaryColor}
                  leftIcon={<FaTicketAlt />}
                >
                  My Gift Cards
                </Button>
              </CardBody>
            </MotionCard>
          </SimpleGrid>

          {/* Invite & Games row */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            <MotionCard
              variants={item}
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.100"
              overflow="hidden"
            >
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg">
                    <Icon as={FaShareAlt} color={ThemeColors.primaryColor} boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">
                    Invite a Friend
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>
                  Earn up to UGX 50,000 for every friend who signs up with your link.
                </Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  bg={ThemeColors.primaryColor}
                  _hover={{ bg: ThemeColors.secondaryColor }}
                  leftIcon={<FaShareAlt />}
                  onClick={openReferral}
                >
                  Get Referral Link
                </Button>
              </CardBody>
            </MotionCard>

            <MotionCard
              variants={item}
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.100"
              overflow="hidden"
            >
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg="gray.100" borderRadius="lg">
                    <Icon as={FaGamepad} color="gray.500" boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">
                    Games
                  </Heading>
                  <Box
                    ml={2}
                    px={2}
                    py={0.5}
                    bg="orange.100"
                    color="orange.700"
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="600"
                  >
                    Coming soon
                  </Box>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Play games to earn extra points and rewards.
                </Text>
              </CardBody>
            </MotionCard>
          </SimpleGrid>

          {/* Payment Information */}
          <MotionCard
            variants={item}
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            borderWidth="1px"
            borderColor="gray.100"
            overflow="hidden"
          >
            <CardBody>
              <HStack mb={6}>
                <Box p={2} bg={themeBg} borderRadius="lg">
                  <Icon as={RiSecurePaymentLine} color={ThemeColors.primaryColor} boxSize={5} />
                </Box>
                <Heading size="md" color="gray.800">
                  Payment Information
                </Heading>
              </HStack>

              <Tabs variant="soft-rounded" colorScheme="green">
                <TabList
                  flexWrap="wrap"
                  gap={2}
                  borderBottomWidth="1px"
                  borderColor="gray.200"
                  pb={4}
                  mb={4}
                >
                  <Tab
                    fontWeight="600"
                    _selected={{ color: "white", bg: ThemeColors.primaryColor }}
                  >
                    <HStack>
                      <FaMobileAlt />
                      <Text>Mobile Money</Text>
                    </HStack>
                  </Tab>
                  <Tab
                    fontWeight="600"
                    _selected={{ color: "white", bg: ThemeColors.primaryColor }}
                  >
                    <HStack>
                      <FaCreditCard />
                      <Text>Credit / Debit Card</Text>
                    </HStack>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <VStack align="stretch" spacing={4} maxW="400px">
                      <FormControl>
                        <FormLabel fontWeight="600">Provider</FormLabel>
                        <Select
                          placeholder="Select provider"
                          borderColor="gray.300"
                          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                        >
                          <option value="mtn">MTN Mobile Money</option>
                          <option value="airtel">Airtel Money</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="600">Phone Number</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" color="gray.400">
                            +256
                          </InputLeftElement>
                          <Input
                            pl="3rem"
                            placeholder="7XXXXXXXX"
                            borderColor="gray.300"
                            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                          />
                        </InputGroup>
                      </FormControl>
                      <Button
                        colorScheme="green"
                        bg={ThemeColors.primaryColor}
                        _hover={{ bg: ThemeColors.secondaryColor }}
                        leftIcon={<FaMobileAlt />}
                      >
                        Save Mobile Money
                      </Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel px={0}>
                    <VStack align="stretch" spacing={4} maxW="400px">
                      <FormControl>
                        <FormLabel fontWeight="600">Card Number</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaCreditCard color="gray.400" />
                          </InputLeftElement>
                          <Input
                            pl="3rem"
                            placeholder="4242 4242 4242 4242"
                            borderColor="gray.300"
                            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                          />
                        </InputGroup>
                      </FormControl>
                      <HStack spacing={4}>
                        <FormControl flex={1}>
                          <FormLabel fontWeight="600">Expiry</FormLabel>
                          <Input
                            placeholder="MM/YY"
                            borderColor="gray.300"
                            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                          />
                        </FormControl>
                        <FormControl flex={1}>
                          <FormLabel fontWeight="600">CVV</FormLabel>
                          <Input
                            placeholder="123"
                            type="password"
                            borderColor="gray.300"
                            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                          />
                        </FormControl>
                      </HStack>
                      <FormControl>
                        <FormLabel fontWeight="600">Name on Card</FormLabel>
                        <Input
                          placeholder="John Doe"
                          borderColor="gray.300"
                          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                        />
                      </FormControl>
                      <Button
                        colorScheme="green"
                        bg={ThemeColors.primaryColor}
                        _hover={{ bg: ThemeColors.secondaryColor }}
                        leftIcon={<FaCreditCard />}
                      >
                        Save Card
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </MotionCard>
        </motion.div>
      </Container>
    </Box>
  );
}
