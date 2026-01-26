"use client";

/**
 * Cashout & Rewards — Cash earned, invites, loyalty, rewards, gift cards,
 * invite feature, games, payment methods (mobile money & card) saved to backend.
 * UI: Jumia/Glovo-style, ThemeColors, animations.
 */

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import ReferralModal from "@components/ReferralModal";
import {
  useGetCashoutStatsMutation,
  useGetPayoutMethodsMutation,
  useAddPayoutMethodMutation,
  useDeletePayoutMethodMutation,
  useSetDefaultPayoutMethodMutation,
} from "@slices/usersApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  FaTrash,
  FaCheck,
  FaLock,
} from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const themeBg = `${ThemeColors.primaryColor}12`;

const statCards = [
  { key: "cash", label: "Cash Earned", sub: "Available to withdraw", icon: FaCoins, gradient: "linear(to-br, green.400, green.700)" },
  { key: "invites", label: "Total Invites", sub: "Friends referred", icon: FaUsers, gradient: "linear(to-br, blue.400, blue.700)" },
  { key: "loyalty", label: "Loyalty Points", sub: "Points to redeem", icon: FaStar, gradient: "linear(to-br, yellow.400, orange.500)" },
];

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function CashoutPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();

  const [stats, setStats] = useState({ cash: 0, invites: 0, loyalty: 0 });
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMethods, setLoadingMethods] = useState(true);

  const [mmProvider, setMmProvider] = useState("");
  const [mmPhone, setMmPhone] = useState("");
  const [mmError, setMmError] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardError, setCardError] = useState("");

  const [getCashoutStats] = useGetCashoutStatsMutation();
  const [getPayoutMethods] = useGetPayoutMethodsMutation();
  const [addPayoutMethod, { isLoading: adding }] = useAddPayoutMethodMutation();
  const [deletePayoutMethod, { isLoading: deleting }] = useDeletePayoutMethodMutation();
  const [setDefaultPayoutMethod, { isLoading: settingDefault }] = useSetDefaultPayoutMethodMutation();

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await getCashoutStats().unwrap();
      if (res?.status === "Success" && res?.data) setStats(res.data);
    } catch (e) {
      setStats({ cash: 0, invites: 0, loyalty: 0 });
    } finally {
      setLoadingStats(false);
    }
  }, [getCashoutStats]);

  const loadMethods = useCallback(async () => {
    try {
      setLoadingMethods(true);
      const res = await getPayoutMethods().unwrap();
      setPayoutMethods(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setPayoutMethods([]);
    } finally {
      setLoadingMethods(false);
    }
  }, [getPayoutMethods]);

  useEffect(() => {
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      router.push("/signin");
      return;
    }
    loadStats();
    loadMethods();
  }, [userInfo, router, loadStats, loadMethods]);

  const handleSaveMobileMoney = async () => {
    setMmError("");
    const provider = mmProvider?.toUpperCase();
    const phone = (mmPhone || "").trim();
    if (!provider || !["MTN", "AIRTEL"].includes(provider)) {
      setMmError("Select MTN or Airtel");
      return;
    }
    if (!phone || phone.length < 9) {
      setMmError("Enter a valid phone (e.g. 0712345678 or 256712345678)");
      return;
    }
    try {
      await addPayoutMethod({ type: "mobile_money", provider, phone }).unwrap();
      toast({ title: "Saved", description: "Mobile money added for payouts.", status: "success", duration: 4000, isClosable: true });
      setMmProvider("");
      setMmPhone("");
      loadMethods();
    } catch (e) {
      const errMsg = e?.data?.message || e?.message || "Failed to save. Use 0XXXXXXXX or 256XXXXXXXX.";
      setMmError(errMsg);
      toast({ title: "Error", description: errMsg, status: "error", duration: 5000, isClosable: true });
    }
  };

  const handleSaveCard = async () => {
    setCardError("");
    const last4 = (cardLast4 || "").replace(/\D/g, "").slice(-4);
    if (last4.length !== 4) {
      setCardError("Enter the last 4 digits of your card");
      return;
    }
    let expiryMonth = "";
    let expiryYear = "";
    const parts = (cardExpiry || "").split("/");
    if (parts.length >= 2) {
      expiryMonth = parts[0].trim().padStart(2, "0").slice(0, 2);
      expiryYear = parts[1].trim().slice(-2);
    }
    try {
      await addPayoutMethod({
        type: "card",
        last4,
        brand: cardBrand || undefined,
        nameOnCard: cardName || undefined,
        expiryMonth: expiryMonth || undefined,
        expiryYear: expiryYear || undefined,
      }).unwrap();
      toast({ title: "Saved", description: "Card details saved for payouts.", status: "success", duration: 4000, isClosable: true });
      setCardLast4("");
      setCardBrand("");
      setCardName("");
      setCardExpiry("");
      loadMethods();
    } catch (e) {
      const errMsg = e?.data?.message || e?.message || "Failed to save card.";
      setCardError(errMsg);
      toast({ title: "Error", description: errMsg, status: "error", duration: 5000, isClosable: true });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePayoutMethod(id).unwrap();
      toast({ title: "Removed", description: "Payout method removed.", status: "success", duration: 3000, isClosable: true });
      loadMethods();
    } catch (e) {
      toast({ title: "Error", description: e?.data?.message || "Could not remove.", status: "error", duration: 4000, isClosable: true });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultPayoutMethod(id).unwrap();
      toast({ title: "Updated", description: "Default payout method set.", status: "success", duration: 3000, isClosable: true });
      loadMethods();
    } catch (e) {
      toast({ title: "Error", description: e?.data?.message || "Could not update.", status: "error", duration: 4000, isClosable: true });
    }
  };

  if (!userInfo) return null;

  return (
    <Box minH="100vh" bg="gray.50" fontFamily="body" pb={16}>
      <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />

      {/* Hero */}
      <Box
        bgGradient={`linear(135deg, ${ThemeColors.primaryColor} 0%, ${ThemeColors.secondaryColor} 100%)`}
        color="white"
        py={{ base: 8, md: 10 }}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" inset={0} bgImage="radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)" pointerEvents="none" />
        <Container maxW="container.xl" position="relative">
          <MotionBox initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HStack spacing={3} mb={2}>
              <Icon as={FaWallet} boxSize={8} />
              <Heading size="xl" letterSpacing="tight" fontWeight="800">Cashout & Rewards</Heading>
            </HStack>
            <Text fontSize="lg" opacity={0.95}>Manage earnings, invites, loyalty points, and where to receive payouts.</Text>
          </MotionBox>
        </Container>
      </Box>

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={8}>
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Stats */}
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5} mb={10}>
            {statCards.map((s) => (
              <MotionCard key={s.key} variants={item} bg="white" borderRadius="xl" overflow="hidden" boxShadow="md" borderWidth="1px" borderColor="gray.100" _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }} transition="all 0.3s">
                <CardBody>
                  <Flex align="flex-start" justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.500" fontWeight="600">{s.label}</Text>
                      {loadingStats ? (
                        <Skeleton h="28px" w="80px" />
                      ) : (
                        <Heading size="lg" bgGradient={s.gradient} bgClip="text" fontWeight="800">
                          {s.key === "cash" && `UGX ${(stats.cash || 0).toLocaleString()}`}
                          {s.key === "invites" && String(stats.invites || 0)}
                          {s.key === "loyalty" && String(stats.loyalty || 0)}
                        </Heading>
                      )}
                      <Text fontSize="xs" color="gray.500">{s.sub}</Text>
                    </VStack>
                    <Box p={3} borderRadius="xl" bgGradient={s.gradient} color="white">
                      <Icon as={s.icon} boxSize={6} />
                    </Box>
                  </Flex>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            <MotionCard variants={item} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={FaGift} color={ThemeColors.primaryColor} boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Rewards</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>Redeem loyalty points for discounts, free delivery, or exclusive offers.</Text>
                <Link href="/rewards">
                  <Button size="sm" colorScheme="green" bg={ThemeColors.primaryColor} _hover={{ bg: ThemeColors.secondaryColor }} leftIcon={<FaGift />} w="full">View Rewards</Button>
                </Link>
              </CardBody>
            </MotionCard>
            <MotionCard variants={item} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={FaTicketAlt} color={ThemeColors.primaryColor} boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Gift Cards</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>Use or purchase gift cards for yourself or to send to friends.</Text>
                <Link href="/gift-cards">
                  <Button size="sm" variant="outline" colorScheme="green" borderColor={ThemeColors.primaryColor} leftIcon={<FaTicketAlt />} w="full">My Gift Cards</Button>
                </Link>
              </CardBody>
            </MotionCard>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            <MotionCard variants={item} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={FaShareAlt} color={ThemeColors.primaryColor} boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Invite a Friend</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>Earn up to UGX 50,000 for every friend who signs up with your link.</Text>
                <Button size="sm" colorScheme="green" bg={ThemeColors.primaryColor} _hover={{ bg: ThemeColors.secondaryColor }} leftIcon={<FaShareAlt />} onClick={openReferral}>Get Referral Link</Button>
              </CardBody>
            </MotionCard>
            <MotionCard variants={item} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg="gray.100" borderRadius="lg"><Icon as={FaGamepad} color="gray.500" boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Games</Heading>
                  <Badge ml={2} colorScheme="orange" borderRadius="full" fontSize="xs">Coming soon</Badge>
                </HStack>
                <Text color="gray.600" fontSize="sm">Play games to earn extra points and rewards.</Text>
              </CardBody>
            </MotionCard>
          </SimpleGrid>

          {/* Payment / Payout methods — Jumia/Glovo style */}
          <MotionCard variants={item} bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
            <CardBody>
              <HStack mb={2}>
                <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={RiSecurePaymentLine} color={ThemeColors.primaryColor} boxSize={5} /></Box>
                <Heading size="md" color="gray.800">Where to receive payouts</Heading>
              </HStack>
              <HStack spacing={4} mb={6} color="gray.500" fontSize="sm">
                <HStack><Icon as={FaLock} /><Text>MTN & Airtel supported. Card for records.</Text></HStack>
              </HStack>

              {/* Saved methods */}
              {loadingMethods ? (
                <Skeleton h="80px" borderRadius="md" mb={6} />
              ) : payoutMethods.length > 0 ? (
                <Box mb={6}>
                  <Text fontWeight="600" mb={3} color="gray.700">Saved payout methods</Text>
                  <VStack align="stretch" spacing={3}>
                    {payoutMethods.map((m) => (
                      <Flex
                        key={m._id}
                        p={4}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={m.isDefault ? ThemeColors.primaryColor : "gray.200"}
                        bg={m.isDefault ? `${ThemeColors.primaryColor}08` : "gray.50"}
                        align="center"
                        justify="space-between"
                        flexWrap="wrap"
                        gap={2}
                      >
                        <HStack>
                          {m.type === "mobile_money" ? (
                            <Icon as={FaMobileAlt} color={ThemeColors.primaryColor} />
                          ) : (
                            <Icon as={FaCreditCard} color={ThemeColors.primaryColor} />
                          )}
                          <Box>
                            {m.type === "mobile_money" && <Text fontWeight="600">{m.provider} • ***{String(m.phone || "").slice(-4)}</Text>}
                            {m.type === "card" && <Text fontWeight="600">•••• {m.last4} {m.brand ? ` • ${m.brand}` : ""}</Text>}
                            {m.isDefault && <Badge size="sm" colorScheme="green" mt={1}>Default</Badge>}
                          </Box>
                        </HStack>
                        <HStack>
                          {!m.isDefault && (
                            <Button size="sm" variant="ghost" leftIcon={<FaCheck />} onClick={() => handleSetDefault(m._id)} isLoading={settingDefault}>Set default</Button>
                          )}
                          <IconButton aria-label="Remove" icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(m._id)} isLoading={deleting} />
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              ) : null}

              <Tabs variant="soft-rounded" colorScheme="green">
                <TabList flexWrap="wrap" gap={2} borderBottomWidth="1px" borderColor="gray.200" pb={4} mb={4}>
                  <Tab fontWeight="600" _selected={{ color: "white", bg: ThemeColors.primaryColor }}>
                    <HStack><FaMobileAlt /><Text>Mobile Money</Text></HStack>
                  </Tab>
                  <Tab fontWeight="600" _selected={{ color: "white", bg: ThemeColors.primaryColor }}>
                    <HStack><FaCreditCard /><Text>Card (last 4)</Text></HStack>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <VStack align="stretch" spacing={4} maxW="400px">
                      <FormControl isInvalid={!!mmError}>
                        <FormLabel fontWeight="600">Provider</FormLabel>
                        <Select
                          placeholder="Select provider"
                          value={mmProvider}
                          onChange={(e) => { setMmProvider(e.target.value); setMmError(""); }}
                          borderColor="gray.300"
                          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                        >
                          <option value="MTN">MTN Mobile Money</option>
                          <option value="AIRTEL">Airtel Money</option>
                        </Select>
                        <FormHelperText>Uganda: MTN (076,077,078,031,039) or Airtel (070,075,074,020)</FormHelperText>
                        <FormErrorMessage>{mmError}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!mmError}>
                        <FormLabel fontWeight="600">Phone</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" color="gray.400">+256</InputLeftElement>
                          <Input
                            pl="3.5rem"
                            placeholder="712345678 or 0712345678"
                            value={mmPhone}
                            onChange={(e) => { setMmPhone(e.target.value); setMmError(""); }}
                            borderColor="gray.300"
                            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                          />
                        </InputGroup>
                        <FormErrorMessage>{mmError}</FormErrorMessage>
                      </FormControl>
                      <Button
                        leftIcon={<FaMobileAlt />}
                        colorScheme="green"
                        bg={ThemeColors.primaryColor}
                        _hover={{ bg: ThemeColors.secondaryColor }}
                        onClick={handleSaveMobileMoney}
                        isLoading={adding}
                      >
                        Save Mobile Money
                      </Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel px={0}>
                    <VStack align="stretch" spacing={4} maxW="400px">
                      <FormControl isInvalid={!!cardError}>
                        <FormLabel fontWeight="600">Last 4 digits</FormLabel>
                        <Input
                          placeholder="1234"
                          maxLength={4}
                          value={cardLast4}
                          onChange={(e) => { setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4)); setCardError(""); }}
                          borderColor="gray.300"
                          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                        />
                        <FormHelperText>For display and admin payouts. Full card is never stored.</FormHelperText>
                        <FormErrorMessage>{cardError}</FormErrorMessage>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="600">Brand</FormLabel>
                        <Select
                          placeholder="Visa / Mastercard"
                          value={cardBrand}
                          onChange={(e) => setCardBrand(e.target.value)}
                          borderColor="gray.300"
                          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                        >
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="600">Name on card</FormLabel>
                        <Input
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          borderColor="gray.300"
                          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="600">Expiry (MM/YY)</FormLabel>
                        <Input
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          borderColor="gray.300"
                          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                        />
                      </FormControl>
                      <Button
                        leftIcon={<FaCreditCard />}
                        colorScheme="green"
                        bg={ThemeColors.primaryColor}
                        _hover={{ bg: ThemeColors.secondaryColor }}
                        onClick={handleSaveCard}
                        isLoading={adding}
                      >
                        Save card (last 4)
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
