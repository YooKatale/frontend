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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useWithdrawFundsMutation,
  useGetWithdrawalsMutation,
} from "@slices/usersApiSlice";
import { useAuth } from "@slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  FaArrowDown,
} from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { SiVisa, SiMastercard } from "react-icons/si";
import PaymentProviderLogo from "@components/PaymentProviderLogo";
import { PaymentLogos } from "@constants/constants";

export default function CashoutPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: openWithdraw, onClose: closeWithdraw } = useDisclosure();
  const { isOpen: isHistoryOpen, onOpen: openHistory, onClose: closeHistory } = useDisclosure();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
  const [withdrawFunds, { isLoading: withdrawing }] = useWithdrawFundsMutation();
  const [getWithdrawals] = useGetWithdrawalsMutation();

  // Safe theme color access with fallbacks - simple constants to avoid initialization issues
  const primaryColor = ThemeColors?.primaryColor || "#185f2d";
  const secondaryColor = ThemeColors?.secondaryColor || "#2d8659";
  const themeBg = `${primaryColor}12`;
  
  // Stat cards array
  const statCards = [
    { key: "cash", label: "Cash Earned", sub: "Available to withdraw", icon: FaCoins, gradient: "linear(to-br, green.400, green.700)" },
    { key: "invites", label: "Total Invites", sub: "Friends referred", icon: FaUsers, gradient: "linear(to-br, blue.400, blue.700)" },
    { key: "loyalty", label: "Loyalty Points", sub: "Points to redeem", icon: FaStar, gradient: "linear(to-br, yellow.400, orange.500)" },
  ];
  

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

  const loadWithdrawals = useCallback(async () => {
    try {
      setLoadingWithdrawals(true);
      const res = await getWithdrawals().unwrap();
      setWithdrawals(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setWithdrawals([]);
    } finally {
      setLoadingWithdrawals(false);
    }
  }, [getWithdrawals]);

  useEffect(() => {
    setIsCheckingAuth(true);
    // Check if userInfo is available
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      setIsCheckingAuth(false);
      router.push("/signin");
      return;
    }
    setIsCheckingAuth(false);
    // Load data - errors are handled in individual load functions
    loadStats().catch(console.error);
    loadMethods().catch(console.error);
    loadWithdrawals().catch(console.error);
  }, [userInfo, router, loadStats, loadMethods, loadWithdrawals]);

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

  const handleWithdraw = () => {
    const defaultMethod = payoutMethods.find((m) => m.isDefault && m.type === "mobile_money");
    if (!defaultMethod && payoutMethods.length > 0) {
      const firstMobile = payoutMethods.find((m) => m.type === "mobile_money");
      if (firstMobile) {
        setSelectedPayoutMethod(firstMobile);
      } else {
        toast({ title: "No Mobile Money", description: "Add a mobile money payout method first.", status: "warning", duration: 4000, isClosable: true });
        return;
      }
    } else if (!defaultMethod) {
      toast({ title: "No Payout Method", description: "Add a mobile money payout method to withdraw.", status: "warning", duration: 4000, isClosable: true });
      return;
    } else {
      setSelectedPayoutMethod(defaultMethod);
    }
    setWithdrawAmount("");
    openWithdraw();
  };

  const confirmWithdraw = async () => {
    if (!selectedPayoutMethod) {
      toast({ title: "Error", description: "Select a payout method.", status: "error", duration: 4000, isClosable: true });
      return;
    }
    const amt = Number(withdrawAmount);
    if (!Number.isFinite(amt) || amt < 1000) {
      toast({ title: "Invalid Amount", description: "Minimum withdrawal is UGX 1,000.", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (amt > (stats.cash || 0)) {
      toast({ title: "Insufficient Balance", description: `Available: UGX ${(stats.cash || 0).toLocaleString()}`, status: "error", duration: 4000, isClosable: true });
      return;
    }
    try {
      const res = await withdrawFunds({ amount: amt, payoutMethodId: selectedPayoutMethod._id }).unwrap();
      toast({ title: "Withdrawal Initiated", description: res?.message || `UGX ${amt.toLocaleString()} withdrawal processing...`, status: "success", duration: 5000, isClosable: true });
      closeWithdraw();
      setWithdrawAmount("");
      setSelectedPayoutMethod(null);
      loadStats();
      loadWithdrawals();
    } catch (e) {
      toast({ title: "Error", description: e?.data?.message || e?.message || "Withdrawal failed.", status: "error", duration: 5000, isClosable: true });
    }
  };

  const getPaymentIcon = (method) => {
    if (!method || !method.type) return FaCreditCard;
    if (method.type === "mobile_money") {
      // MTN and Airtel icons don't exist in react-icons, using FaMobileAlt with custom styling
      return FaMobileAlt;
    }
    if (method.type === "card") {
      if (method.brand === "Visa") return SiVisa;
      if (method.brand === "Mastercard") return SiMastercard;
      return FaCreditCard;
    }
    return FaCreditCard;
  };


  // Show loading state while checking authentication
  if (isCheckingAuth || !userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Skeleton h="40px" w="200px" />
          <Skeleton h="20px" w="150px" />
        </VStack>
      </Box>
    );
  }

  return (
      <Box minH="100vh" bg="gray.50" fontFamily="body" pb={16}>
        <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />

      {/* Hero */}
      <Box
        bgGradient={`linear(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`}
        color="white"
        py={{ base: 8, md: 10 }}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" inset={0} bgImage="radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)" pointerEvents="none" />
        <Container maxW="container.xl" position="relative">
          <Box>
            <HStack spacing={3} mb={2}>
              <Icon as={FaWallet} boxSize={8} />
              <Heading size="xl" letterSpacing="tight" fontWeight="800">Cashout & Rewards</Heading>
            </HStack>
            <Text fontSize="lg" opacity={0.95}>Manage earnings, invites, loyalty points, and where to receive payouts.</Text>
          </Box>
        </Container>
      </Box>

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={8}>
        <Box>
          {/* Stats */}
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5} mb={10}>
            {statCards.map((s) => (
              <Card key={s.key} bg="white" borderRadius="xl" overflow="hidden" boxShadow="md" borderWidth="1px" borderColor="gray.100" _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }} transition="all 0.3s">
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
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="gray.500">{s.sub}</Text>
                        {s.key === "cash" && (stats.cash || 0) > 0 && (
                          <Button
                            size="xs"
                            leftIcon={<FaArrowDown />}
                            colorScheme="green"
                            bg={primaryColor}
                            _hover={{ bg: secondaryColor }}
                            onClick={handleWithdraw}
                            variant="solid"
                          >
                            Withdraw
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                    <Box p={3} borderRadius="xl" bgGradient={s.gradient} color="white">
                      <Icon as={s.icon} boxSize={6} />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={FaGift} color={primaryColor} boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Rewards</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>Redeem loyalty points for discounts, free delivery, or exclusive offers.</Text>
                <Link href="/rewards">
                  <Button size="sm" colorScheme="green" bg={primaryColor} _hover={{ bg: secondaryColor }} leftIcon={<FaGift />} w="full">View Rewards</Button>
                </Link>
              </CardBody>
            </Card>
            <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={FaTicketAlt} color={primaryColor} boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Gift Cards</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>Use or purchase gift cards for yourself or to send to friends.</Text>
                <Link href="/gift-cards">
                  <Button size="sm" variant="outline" colorScheme="green" borderColor={primaryColor} leftIcon={<FaTicketAlt />} w="full">My Gift Cards</Button>
                </Link>
              </CardBody>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={FaShareAlt} color={primaryColor} boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Invite a Friend</Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm" mb={4}>Earn up to UGX 50,000 for every friend who signs up with your link.</Text>
                <Button size="sm" colorScheme="green" bg={primaryColor} _hover={{ bg: secondaryColor }} leftIcon={<FaShareAlt />} onClick={openReferral}>Get Referral Link</Button>
              </CardBody>
            </Card>
            <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <HStack mb={4}>
                  <Box p={2} bg="gray.100" borderRadius="lg"><Icon as={FaGamepad} color="gray.500" boxSize={5} /></Box>
                  <Heading size="md" color="gray.800">Games</Heading>
                  <Badge ml={2} colorScheme="orange" borderRadius="full" fontSize="xs">Coming soon</Badge>
                </HStack>
                <Text color="gray.600" fontSize="sm">Play games to earn extra points and rewards.</Text>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Payment / Payout methods — Jumia/Glovo style */}
          <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
            <CardBody>
              <HStack mb={2}>
                <Box p={2} bg={themeBg} borderRadius="lg"><Icon as={RiSecurePaymentLine} color={primaryColor} boxSize={5} /></Box>
                <Heading size="md" color="gray.800">Where to receive payouts</Heading>
              </HStack>
              <HStack spacing={4} mb={6} color="gray.500" fontSize="sm" flexWrap="wrap">
                <HStack><Icon as={FaLock} /><Text>MTN & Airtel supported. Card for records.</Text></HStack>
                <HStack spacing={2}>
                  <Box as="img" src={PaymentLogos.mtn} alt="MTN Mobile Money" w="28px" h="28px" objectFit="contain" />
                  <Box as="img" src={PaymentLogos.airtel} alt="Airtel Money" w="28px" h="28px" objectFit="contain" />
                </HStack>
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
                        borderColor={m.isDefault ? primaryColor : "gray.200"}
                        bg={m.isDefault ? `${primaryColor}08` : "gray.50"}
                        align="center"
                        justify="space-between"
                        flexWrap="wrap"
                        gap={2}
                      >
                        <HStack spacing={3}>
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg={`${primaryColor}10`}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {m.type === "mobile_money" && m.provider && ["MTN", "AIRTEL"].includes(m.provider) ? (
                              <PaymentProviderLogo provider={m.provider} size={28} />
                            ) : m.type === "mobile_money" ? (
                              <Icon as={FaMobileAlt} boxSize={6} color={primaryColor} />
                            ) : m.type === "card" ? (
                              <Icon as={getPaymentIcon(m)} boxSize={6} color={primaryColor} />
                            ) : (
                              <Icon as={FaMobileAlt} boxSize={6} color={primaryColor} />
                            )}
                          </Box>
                          <Box>
                            {m.type === "mobile_money" && (
                              <HStack>
                                <Text fontWeight="600">{m.provider}</Text>
                                <Text color="gray.500">•</Text>
                                <Text fontWeight="500" fontSize="sm">***{String(m.phone || "").slice(-4)}</Text>
                              </HStack>
                            )}
                            {m.type === "card" && (
                              <HStack>
                                <Text fontWeight="600">•••• {m.last4}</Text>
                                {m.brand && (
                                  <>
                                    <Text color="gray.500">•</Text>
                                    <Text fontWeight="500" fontSize="sm">{m.brand}</Text>
                                  </>
                                )}
                              </HStack>
                            )}
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
                  <Tab fontWeight="600" _selected={{ color: "white", bg: primaryColor }}>
                    <HStack><Icon as={FaMobileAlt} /><Text>Mobile Money</Text></HStack>
                  </Tab>
                  <Tab fontWeight="600" _selected={{ color: "white", bg: primaryColor }}>
                    <HStack><Icon as={FaCreditCard} /><Text>Card (last 4)</Text></HStack>
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
                          _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                        >
                          <option value="MTN">MTN Mobile Money</option>
                          <option value="AIRTEL">Airtel Money</option>
                        </Select>
                        {mmProvider && (
                          <HStack mt={2} spacing={2} p={2} bg="gray.50" borderRadius="md">
                            {["MTN", "AIRTEL"].includes(mmProvider) ? (
                              <PaymentProviderLogo provider={mmProvider} size={28} />
                            ) : (
                              <Icon as={FaMobileAlt} boxSize={6} color={primaryColor} />
                            )}
                            <Text fontSize="sm" fontWeight="500" color="gray.700">{mmProvider === "MTN" ? "MTN Mobile Money" : "Airtel Money"} selected</Text>
                          </HStack>
                        )}
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
                            _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                          />
                        </InputGroup>
                        <FormErrorMessage>{mmError}</FormErrorMessage>
                      </FormControl>
                      <Button
                        leftIcon={<FaMobileAlt />}
                        colorScheme="green"
                        bg={primaryColor}
                        _hover={{ bg: secondaryColor }}
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
                          _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                        />
                        <FormHelperText>For display and admin payouts. Full card is never stored.</FormHelperText>
                        <FormErrorMessage>{cardError}</FormErrorMessage>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="600">Brand</FormLabel>
                        <Select
                          placeholder="Select card brand"
                          value={cardBrand}
                          onChange={(e) => setCardBrand(e.target.value)}
                          borderColor="gray.300"
                          _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
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
                          _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="600">Expiry (MM/YY)</FormLabel>
                        <Input
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          borderColor="gray.300"
                          _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                        />
                      </FormControl>
                      <Button
                        leftIcon={<FaCreditCard />}
                        colorScheme="green"
                        bg={primaryColor}
                        _hover={{ bg: secondaryColor }}
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
          </Card>

          {/* Withdrawal History */}
          <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden" mt={6}>
            <CardBody>
              <HStack mb={4} justify="space-between">
                <HStack>
                  <Box p={2} bg={themeBg} borderRadius="lg">
                    <Icon as={FaArrowDown} color={primaryColor} boxSize={5} />
                  </Box>
                  <Heading size="md" color="gray.800">Withdrawal History</Heading>
                </HStack>
                <Button size="sm" variant="ghost" onClick={() => { loadWithdrawals(); openHistory(); }}>
                  View All
                </Button>
              </HStack>
              {loadingWithdrawals ? (
                <Skeleton h="60px" borderRadius="md" />
              ) : withdrawals.length > 0 ? (
                <VStack align="stretch" spacing={2}>
                  {withdrawals.slice(0, 3).map((w) => (
                    <Flex key={w._id} p={3} borderRadius="md" bg="gray.50" justify="space-between" align="center">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="600" fontSize="sm">UGX {w.amount.toLocaleString()}</Text>
                        <Text fontSize="xs" color="gray.500">{new Date(w.createdAt).toLocaleDateString()}</Text>
                      </VStack>
                      <Badge
                        colorScheme={
                          w.status === "completed" ? "green" : w.status === "failed" ? "red" : w.status === "processing" ? "blue" : "gray"
                        }
                      >
                        {w.status}
                      </Badge>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>No withdrawals yet</Text>
              )}
            </CardBody>
          </Card>
        </Box>
      </Container>

      {/* Withdrawal Modal */}
      <Modal isOpen={isWithdrawOpen} onClose={closeWithdraw} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw Funds</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="full">
                <Text fontSize="sm" color="gray.600" mb={2}>Available Balance</Text>
                <Heading size="lg" color={primaryColor}>UGX {(stats.cash || 0).toLocaleString()}</Heading>
              </Box>
              {selectedPayoutMethod && (
                <Box w="full" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="xs" color="gray.600" mb={1}>Withdrawing to:</Text>
                  <HStack>
                    {selectedPayoutMethod.type === "mobile_money" && selectedPayoutMethod.provider && ["MTN", "AIRTEL"].includes(selectedPayoutMethod.provider) ? (
                      <PaymentProviderLogo provider={selectedPayoutMethod.provider} size={22} />
                    ) : selectedPayoutMethod.type === "mobile_money" ? (
                      <Icon as={FaMobileAlt} boxSize={5} color={primaryColor} />
                    ) : selectedPayoutMethod.type === "card" ? (
                      <Icon as={getPaymentIcon(selectedPayoutMethod)} boxSize={5} color={primaryColor} />
                    ) : (
                      <Icon as={FaMobileAlt} boxSize={5} color={primaryColor} />
                    )}
                    <Text fontWeight="600">
                      {selectedPayoutMethod.type === "mobile_money" 
                        ? `${selectedPayoutMethod.provider} • ***${String(selectedPayoutMethod.phone || "").slice(-4)}`
                        : `•••• ${selectedPayoutMethod.last4} ${selectedPayoutMethod.brand || ""}`}
                    </Text>
                  </HStack>
                </Box>
              )}
              <FormControl>
                <FormLabel fontWeight="600">Amount (UGX)</FormLabel>
                <Input
                  type="number"
                  min={1000}
                  placeholder="Minimum: 1,000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <FormHelperText>Minimum withdrawal: UGX 1,000</FormHelperText>
              </FormControl>
              {!selectedPayoutMethod && (
                <Text fontSize="sm" color="red.500">Please add a mobile money payout method first.</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeWithdraw}>Cancel</Button>
            <Button
              colorScheme="green"
              bg={primaryColor}
              _hover={{ bg: secondaryColor }}
              onClick={confirmWithdraw}
              isLoading={withdrawing}
              isDisabled={!selectedPayoutMethod || !withdrawAmount || Number(withdrawAmount) < 1000}
              leftIcon={<FaArrowDown />}
            >
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Withdrawal History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={closeHistory} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdrawal History</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loadingWithdrawals ? (
              <Skeleton h="200px" />
            ) : withdrawals.length > 0 ? (
              <VStack align="stretch" spacing={3}>
                {withdrawals.map((w) => (
                  <Flex
                    key={w._id}
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.200"
                    justify="space-between"
                    align="center"
                  >
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Text fontWeight="700" fontSize="lg">UGX {w.amount.toLocaleString()}</Text>
                        <Badge
                          colorScheme={
                            w.status === "completed" ? "green" : w.status === "failed" ? "red" : w.status === "processing" ? "blue" : "gray"
                          }
                        >
                          {w.status}
                        </Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {w.payoutMethod?.type === "mobile_money" 
                          ? `${w.payoutMethod?.provider} • ***${String(w.payoutMethod?.phone || "").slice(-4)}`
                          : `Card • •••• ${w.payoutMethod?.last4}`}
                      </Text>
                      <Text fontSize="xs" color="gray.400">{new Date(w.createdAt).toLocaleString()}</Text>
                      {w.failureReason && (
                        <Text fontSize="xs" color="red.500">Error: {w.failureReason}</Text>
                      )}
                    </VStack>
                  </Flex>
                ))}
              </VStack>
            ) : (
              <Text textAlign="center" color="gray.500" py={8}>No withdrawal history</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeHistory}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
    );
}
