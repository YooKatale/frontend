"use client";

/**
 * Gift Cards / Shopping Vouchers Page
 * Yookatale - Purchase, send, and redeem shopping vouchers.
 */

import {
  Box, Button, Card, CardBody, Container, Flex, FormControl, FormLabel,
  Heading, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, SimpleGrid, Skeleton, Switch, Tab, TabList, TabPanel, TabPanels,
  Tabs, Text, Textarea, useDisclosure, useToast, VStack, Badge, Tooltip,
  Divider, Select,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import {
  useGetGiftCardsMutation,
  usePurchaseGiftCardMutation,
  useUseGiftCardMutation,
  useValidateGiftCardMutation,
  useRedeemGiftCardCodeMutation,
  useInitiateGiftCardPaymentMutation,
  useVerifyGiftCardPaymentMutation,
} from "@slices/usersApiSlice";
import { useAuth } from "@slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGift, FaCopy, FaTicketAlt, FaPaperPlane, FaWallet,
  FaEnvelope, FaUser, FaPhone, FaLock, FaCreditCard, FaMobileAlt,
} from "react-icons/fa";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

/* ---------- Occasions Data ---------- */
const OCCASIONS = [
  { key: "general", emoji: "\uD83C\uDF81", label: "General Gift", tagline: "For any special moment" },
  { key: "mothers_day", emoji: "\uD83D\uDC90", label: "Mother\u2019s Day", tagline: "Show mom you care" },
  { key: "valentines", emoji: "\u2764\uFE0F", label: "Valentine\u2019s Day", tagline: "Share the love" },
  { key: "christmas", emoji: "\uD83C\uDF84", label: "Christmas", tagline: "Season of giving" },
  { key: "birthday", emoji: "\uD83C\uDF82", label: "Birthday", tagline: "Celebrate their day" },
  { key: "wedding", emoji: "\uD83D\uDC92", label: "Wedding", tagline: "For the happy couple" },
  { key: "graduation", emoji: "\uD83C\uDF93", label: "Graduation", tagline: "Celebrate achievement" },
  { key: "thank_you", emoji: "\uD83D\uDE4F", label: "Thank You", tagline: "Show your gratitude" },
  { key: "easter", emoji: "\uD83D\uDC23", label: "Easter", tagline: "Egg-citing gifts" },
  { key: "fathers_day", emoji: "\uD83D\uDC54", label: "Father\u2019s Day", tagline: "For the best dad" },
  { key: "new_year", emoji: "\uD83C\uDF86", label: "New Year", tagline: "New beginnings" },
  { key: "anniversary", emoji: "\uD83D\uDC8D", label: "Anniversary", tagline: "Years of love" },
  { key: "baby_shower", emoji: "\uD83D\uDC76", label: "Baby Shower", tagline: "Welcome the little one" },
  { key: "housewarming", emoji: "\uD83C\uDFE0", label: "Housewarming", tagline: "New home, new start" },
  { key: "women_day", emoji: "\uD83D\uDC69", label: "Women\u2019s Day", tagline: "Celebrate her strength" },
  { key: "independence_day", emoji: "\uD83C\uDDFA\uD83C\uDDEC", label: "Independence Day", tagline: "Celebrate the nation" },
  { key: "eid", emoji: "\uD83C\uDF19", label: "Eid Mubarak", tagline: "Blessed celebrations" },
  { key: "teachers_day", emoji: "\uD83D\uDCDA", label: "Teacher\u2019s Day", tagline: "Honor great teachers" },
  { key: "friendship_day", emoji: "\uD83E\uDD1D", label: "Friendship Day", tagline: "Cherish your friends" },
  { key: "get_well", emoji: "\uD83D\uDC8A", label: "Get Well Soon", tagline: "Wishing speedy recovery" },
  { key: "congratulations", emoji: "\uD83C\uDFC6", label: "Congratulations", tagline: "You deserve it" },
  { key: "just_because", emoji: "\uD83D\uDC9D", label: "Just Because", tagline: "No reason needed" },
];

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

/* ---------- Helpers ---------- */
const fmtUGX = (n) => {
  if (!n && n !== 0) return "UGX 0";
  return "UGX " + Number(n).toLocaleString("en-UG");
};

const occasionMeta = (key) =>
  OCCASIONS.find((o) => o.key === key) || { emoji: "\uD83C\uDF81", label: key || "Gift", tagline: "" };

const statusColor = (s) => {
  const map = { active: "green", used: "gray", expired: "red", redeemed: "blue", partially_used: "orange" };
  return map[s] || "gray";
};

/* ---------- Animation variants ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
/* ===== Voucher Card Component ===== */
function VoucherCard({ gc, type, onCopy }) {
  const occ = occasionMeta(gc.occasion);
  const isExpired = gc.status === "expired";
  const isUsed = gc.status === "used" || gc.status === "redeemed";

  return (
    <MotionCard
      variants={itemVariants}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      bg="white"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.25s"
      opacity={isExpired || isUsed ? 0.7 : 1}
    >
      {/* Card Header Strip */}
      <Box
        h="6px"
        bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, #43a047)`}
      />
      <CardBody p={5}>
        <VStack align="stretch" spacing={3}>
          {/* Occasion + Status */}
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Text fontSize="2xl">{occ.emoji}</Text>
              <Text fontWeight="700" fontSize="sm" color="gray.700">
                {occ.label}
              </Text>
            </HStack>
            <Badge
              colorScheme={statusColor(gc.status)}
              borderRadius="full"
              px={3}
              py={0.5}
              fontSize="xs"
              textTransform="capitalize"
            >
              {gc.status || "active"}
            </Badge>
          </Flex>

          <Divider />

          {/* Code */}
          <Flex align="center" justify="space-between" bg="gray.50" borderRadius="lg" px={3} py={2}>
            <Text fontFamily="mono" fontWeight="600" fontSize="sm" color="gray.700" letterSpacing="wider">
              {gc.code || "N/A"}
            </Text>
            {gc.code && (
              <Tooltip label="Copy code" hasArrow>
                <IconButton
                  icon={<FaCopy />}
                  size="xs"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => onCopy(gc.code)}
                  aria-label="Copy code"
                />
              </Tooltip>
            )}
          </Flex>

          {/* Amount / Balance */}
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500">Amount</Text>
              <Text fontWeight="800" fontSize="lg" color={ThemeColors.primaryColor}>
                {fmtUGX(gc.amount)}
              </Text>
            </VStack>
            {gc.balance !== undefined && gc.balance !== gc.amount && (
              <VStack align="end" spacing={0}>
                <Text fontSize="xs" color="gray.500">Balance</Text>
                <Text fontWeight="700" fontSize="md" color="orange.500">
                  {fmtUGX(gc.balance)}
                </Text>
              </VStack>
            )}
          </HStack>

          {/* Recipient / Sender info */}
          {type === "sent" && gc.recipientName && (
            <HStack spacing={2} bg="blue.50" borderRadius="lg" px={3} py={2}>
              <Icon as={FaPaperPlane} color="blue.400" boxSize={3} />
              <Text fontSize="xs" color="blue.700">
                To: <b>{gc.recipientName}</b>
                {gc.recipientEmail && ` (${gc.recipientEmail})`}
              </Text>
            </HStack>
          )}
          {type === "owned" && gc.senderName && (
            <HStack spacing={2} bg="green.50" borderRadius="lg" px={3} py={2}>
              <Icon as={FaGift} color="green.500" boxSize={3} />
              <Text fontSize="xs" color="green.700">From: <b>{gc.senderName}</b></Text>
            </HStack>
          )}

          {/* Personal message */}
          {gc.personalMessage && (
            <Box bg="yellow.50" borderRadius="lg" px={3} py={2} borderLeft="3px solid" borderLeftColor="yellow.400">
              <Text fontSize="xs" color="gray.600" fontStyle="italic" noOfLines={2}>
                &ldquo;{gc.personalMessage}&rdquo;
              </Text>
            </Box>
          )}

          {/* Expiry */}
          {gc.expiresAt && (
            <Text fontSize="xs" color="gray.400" textAlign="right">
              Expires: {new Date(gc.expiresAt).toLocaleDateString()}
            </Text>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  );
}

/* ===== Empty State Component ===== */
function EmptyState({ icon, title, subtitle, onAction, actionLabel }) {
  return (
    <VStack py={16} spacing={4} color="gray.400">
      <Icon as={icon} boxSize={12} />
      <Heading size="md" color="gray.600">{title}</Heading>
      <Text fontSize="sm" color="gray.500" textAlign="center" maxW="400px">{subtitle}</Text>
      {onAction && (
        <Button
          mt={2}
          bg={ThemeColors.primaryColor}
          color="white"
          _hover={{ bg: "#2e7d32" }}
          onClick={onAction}
          leftIcon={<FaGift />}
        >
          {actionLabel}
        </Button>
      )}
    </VStack>
  );
}
/* ========== MAIN PAGE ========== */
export default function GiftCardsPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const toast = useToast();

  /* --- Modals --- */
  const { isOpen: isPurchaseOpen, onOpen: openPurchase, onClose: closePurchaseModal } = useDisclosure();
  const { isOpen: isRedeemOpen, onOpen: openRedeem, onClose: closeRedeemModal } = useDisclosure();

  /* --- Data --- */
  const [ownedCards, setOwnedCards] = useState([]);
  const [sentCards, setSentCards] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --- Purchase form --- */
  const [selectedOccasion, setSelectedOccasion] = useState("general");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [forSomeoneElse, setForSomeoneElse] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");

  /* --- Redeem form --- */
  const [redeemCode, setRedeemCode] = useState("");

  /* --- RTK hooks --- */
  const [getGiftCards] = useGetGiftCardsMutation();
  const [purchaseGiftCard, { isLoading: purchasing }] = usePurchaseGiftCardMutation();
  const [redeemGiftCardCode, { isLoading: redeeming }] = useRedeemGiftCardCodeMutation();
  const [initiateGiftCardPayment] = useInitiateGiftCardPaymentMutation();
  const [verifyGiftCardPayment] = useVerifyGiftCardPaymentMutation();

  /* --- Refs for scrolling --- */
  const occasionsRef = useRef(null);
  const vouchersRef = useRef(null);

  /* ---- Computed amount ---- */
  const finalAmount = useMemo(() => {
    if (purchaseAmount) return Number(purchaseAmount);
    if (customAmount) return Number(customAmount);
    return 0;
  }, [purchaseAmount, customAmount]);

  /* ---- Load gift cards ---- */
  const loadGiftCards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getGiftCards().unwrap();
      const data = res?.data || res;
      setOwnedCards(Array.isArray(data?.owned) ? data.owned : Array.isArray(data) ? data : []);
      setSentCards(Array.isArray(data?.sent) ? data.sent : []);
    } catch {
      setOwnedCards([]);
      setSentCards([]);
    } finally {
      setLoading(false);
    }
  }, [getGiftCards]);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      router.push("/signin");
      return;
    }
    loadGiftCards();
  }, [userInfo, router, loadGiftCards]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");
    if (payment === "verify" && txRef) {
      (async () => {
        try {
          const vRes = await verifyGiftCardPayment({ tx_ref: txRef, transaction_id: transactionId }).unwrap();
          toast({ title: "Payment Verified!", description: vRes?.message || "Your voucher is now active.", status: "success", duration: 5000, isClosable: true });
          loadGiftCards();
        } catch (ve) {
          toast({ title: "Verification Issue", description: ve?.data?.message || "Could not verify payment. Contact support if you were charged.", status: "warning", duration: 6000, isClosable: true });
        }
        router.replace("/gift-cards", { scroll: false });
      })();
    }
  }, [searchParams]);

  /* ---- Reset purchase form ---- */
  const resetPurchaseForm = () => {
    setPurchaseAmount("");
    setCustomAmount("");
    setForSomeoneElse(false);
    setRecipientName("");
    setRecipientEmail("");
    setRecipientPhone("");
    setPersonalMessage("");
    setPaymentMethod("mobile_money");
  };

  const closePurchase = () => {
    closePurchaseModal();
    resetPurchaseForm();
  };

  /* ---- Open purchase with occasion ---- */
  const openPurchaseWithOccasion = (occasionKey) => {
    setSelectedOccasion(occasionKey);
    resetPurchaseForm();
    openPurchase();
  };

  /* ---- Handle purchase ---- */
  const handlePurchase = async () => {
    if (!finalAmount || finalAmount < 5000) {
      toast({ title: "Invalid Amount", description: "Minimum voucher amount is UGX 5,000", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (forSomeoneElse && !recipientEmail.trim()) {
      toast({ title: "Recipient Email Required", description: "Please enter the recipient's email address.", status: "error", duration: 4000, isClosable: true });
      return;
    }
    try {
      const body = {
        amount: finalAmount,
        occasion: selectedOccasion,
        paymentMethod,
        personalMessage: personalMessage.trim() || undefined,
      };
      if (forSomeoneElse) {
        body.recipientName = recipientName.trim() || undefined;
        body.recipientEmail = recipientEmail.trim();
        body.recipientPhone = recipientPhone.trim() || undefined;
      }
      const res = await initiateGiftCardPayment(body).unwrap();
      const payload = res?.data?.flutterwavePayload;
      if (payload) {
        if (typeof window !== "undefined" && window.FlutterwaveCheckout) {
          window.FlutterwaveCheckout({
            ...payload,
            public_key: payload.public_key || process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
            callback: async (response) => {
              try {
                const vRes = await verifyGiftCardPayment({ tx_ref: payload.tx_ref, transaction_id: response.transaction_id }).unwrap();
                toast({ title: "Payment Successful!", description: vRes?.message || "Your voucher is now active.", status: "success", duration: 5000, isClosable: true });
                closePurchase();
                loadGiftCards();
              } catch (ve) {
                toast({ title: "Verification Issue", description: ve?.data?.message || "Payment received but verification pending. Check My Vouchers.", status: "warning", duration: 6000, isClosable: true });
                closePurchase();
                loadGiftCards();
              }
            },
            onclose: () => {
              toast({ title: "Payment Cancelled", description: "You can retry the purchase anytime.", status: "info", duration: 3000, isClosable: true });
            },
          });
        } else {
          const redirectUrl = payload.redirect_url || res?.data?.paymentLink;
          if (redirectUrl) {
            window.location.href = `https://checkout.flutterwave.com/v3/hosted/pay?tx_ref=${payload.tx_ref}&amount=${payload.amount}&currency=${payload.currency}&redirect_url=${encodeURIComponent(redirectUrl)}&customer[email]=${encodeURIComponent(payload.customer?.email || "")}&customizations[title]=${encodeURIComponent(payload.customizations?.title || "Yookatale")}`;
          } else {
            const fallbackRes = await purchaseGiftCard({ ...body, notes: personalMessage.trim() || undefined }).unwrap();
            toast({ title: "Voucher Purchased!", description: fallbackRes?.message || "Your shopping voucher is ready.", status: "success", duration: 5000, isClosable: true });
            closePurchase();
            loadGiftCards();
          }
        }
      } else {
        toast({ title: "Voucher Purchased!", description: res?.message || "Your shopping voucher is ready.", status: "success", duration: 5000, isClosable: true });
        closePurchase();
        loadGiftCards();
      }
    } catch (e) {
      toast({ title: "Purchase Failed", description: e?.data?.message || e?.message || "Something went wrong.", status: "error", duration: 5000, isClosable: true });
    }
  };

  /* ---- Handle redeem ---- */
  const handleRedeem = async () => {
    if (!redeemCode.trim()) {
      toast({ title: "Enter a Code", description: "Please enter your voucher code.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    try {
      const res = await redeemGiftCardCode({ code: redeemCode.trim() }).unwrap();
      toast({ title: "Voucher Redeemed!", description: res?.message || "Voucher added to your account.", status: "success", duration: 5000, isClosable: true });
      setRedeemCode("");
      closeRedeemModal();
      loadGiftCards();
    } catch (e) {
      toast({ title: "Redeem Failed", description: e?.data?.message || e?.message || "Invalid or expired code.", status: "error", duration: 5000, isClosable: true });
    }
  };

  /* ---- Copy code ---- */
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Voucher code copied to clipboard.", status: "success", duration: 2000, isClosable: true });
  };

  if (!userInfo) return null;
  /* ========================================= */
  /*                 RENDER                    */
  /* ========================================= */
  return (
    <Box minH="100vh" bg="gray.50" fontFamily="body" pb={20}>
      {/* ===== HERO ===== */}
      <Box
        bgGradient={"linear(135deg, " + ThemeColors.primaryColor + " 0%, #2e7d32 40%, #43a047 100%)"}
        color="white"
        py={{ base: 14, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circles */}
        <Box position="absolute" top="-60px" right="-60px" w="200px" h="200px" borderRadius="full" bg="whiteAlpha.100" />
        <Box position="absolute" bottom="-40px" left="-40px" w="160px" h="160px" borderRadius="full" bg="whiteAlpha.50" />
        <Box position="absolute" top="30%" left="60%" w="100px" h="100px" borderRadius="full" bg="whiteAlpha.50" />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <VStack spacing={5} textAlign="center">
              <Box fontSize={{ base: "5xl", md: "6xl" }}>
                <Icon as={FaGift} />
              </Box>
              <Heading
                size={{ base: "xl", md: "2xl" }}
                fontWeight="900"
                letterSpacing="tight"
                lineHeight="shorter"
              >
                Yookatale Shopping Vouchers
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} opacity={0.92} maxW="600px">
                Perfect gifts for every occasion. Send love with a Yookatale voucher!
              </Text>
              <HStack spacing={4} pt={2} flexWrap="wrap" justify="center">
                <Button
                  size="lg"
                  bg="white"
                  color={ThemeColors.primaryColor}
                  fontWeight="700"
                  _hover={{ bg: "whiteAlpha.900", transform: "translateY(-2px)" }}
                  _active={{ transform: "translateY(0)" }}
                  boxShadow="lg"
                  leftIcon={<FaGift />}
                  onClick={() => openPurchaseWithOccasion("general")}
                  transition="all 0.2s"
                >
                  Buy a Voucher
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  fontWeight="700"
                  _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                  _active={{ transform: "translateY(0)" }}
                  leftIcon={<FaLock />}
                  onClick={openRedeem}
                  transition="all 0.2s"
                >
                  Redeem a Code
                </Button>
              </HStack>
            </VStack>
          </motion.div>
        </Container>
      </Box>

      {/* ===== OCCASIONS GRID ===== */}
      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={{ base: 10, md: 14 }} ref={occasionsRef}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <VStack spacing={2} mb={8} textAlign="center">
            <Heading size="lg" color="gray.800" fontWeight="800">
              Choose an Occasion
            </Heading>
            <Text color="gray.500" fontSize="md">
              Pick the perfect occasion and send a thoughtful voucher
            </Text>
          </VStack>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 7 }} spacing={{ base: 3, md: 4 }}>
            {OCCASIONS.map((occ) => (
              <motion.div key={occ.key} variants={itemVariants}>
                <Card
                  as="button"
                  onClick={() => openPurchaseWithOccasion(occ.key)}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="sm"
                  border="2px solid"
                  borderColor="transparent"
                  _hover={{
                    boxShadow: "lg",
                    borderColor: ThemeColors.primaryColor,
                    transform: "translateY(-4px)",
                  }}
                  transition="all 0.25s"
                  cursor="pointer"
                  h="full"
                  textAlign="center"
                >
                  <CardBody py={5} px={3}>
                    <VStack spacing={2}>
                      <Text fontSize={{ base: "3xl", md: "4xl" }}>{occ.emoji}</Text>
                      <Text fontWeight="700" fontSize="sm" color="gray.800" noOfLines={1}>
                        {occ.label}
                      </Text>
                      <Text fontSize="xs" color="gray.500" noOfLines={2} lineHeight="short">
                        {occ.tagline}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </SimpleGrid>
        </motion.div>
      </Container>
      {/* ===== MY VOUCHERS ===== */}
      <Container maxW="container.xl" px={{ base: 4, md: 6 }} pb={10} ref={vouchersRef}>
        <Heading size="lg" color="gray.800" fontWeight="800" mb={6}>
          My Vouchers
        </Heading>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} h="220px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        ) : (
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList mb={6} flexWrap="wrap" gap={2}>
              <Tab fontWeight="600" _selected={{ bg: ThemeColors.primaryColor, color: "white" }}>
                <HStack spacing={2}>
                  <Icon as={FaWallet} />
                  <Text>My Vouchers ({ownedCards.length})</Text>
                </HStack>
              </Tab>
              <Tab fontWeight="600" _selected={{ bg: ThemeColors.primaryColor, color: "white" }}>
                <HStack spacing={2}>
                  <Icon as={FaPaperPlane} />
                  <Text>Sent Vouchers ({sentCards.length})</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Owned Tab */}
              <TabPanel p={0}>
                {ownedCards.length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {ownedCards.map((gc) => (
                        <VoucherCard key={gc._id || gc.code} gc={gc} type="owned" onCopy={copyCode} />
                      ))}
                    </SimpleGrid>
                  </motion.div>
                ) : (
                  <EmptyState
                    icon={FaWallet}
                    title="No Vouchers Yet"
                    subtitle="Purchase a voucher or redeem a code to get started!"
                    onAction={() => openPurchaseWithOccasion("general")}
                    actionLabel="Buy a Voucher"
                  />
                )}
              </TabPanel>

              {/* Sent Tab */}
              <TabPanel p={0}>
                {sentCards.length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {sentCards.map((gc) => (
                        <VoucherCard key={gc._id || gc.code} gc={gc} type="sent" onCopy={copyCode} />
                      ))}
                    </SimpleGrid>
                  </motion.div>
                ) : (
                  <EmptyState
                    icon={FaPaperPlane}
                    title="No Sent Vouchers"
                    subtitle="Send a voucher to someone special!"
                    onAction={() => { setForSomeoneElse(true); openPurchaseWithOccasion("general"); }}
                    actionLabel="Send a Voucher"
                  />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Container>
      {/* ===== PURCHASE MODAL ===== */}
      <Modal isOpen={isPurchaseOpen} onClose={closePurchase} size="lg" scrollBehavior="inside" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" mx={4}>
          <ModalHeader pb={2}>
            <HStack spacing={3}>
              <Text fontSize="2xl">{occasionMeta(selectedOccasion).emoji}</Text>
              <Box>
                <Heading size="md">Purchase Voucher</Heading>
                <Text fontSize="sm" color="gray.500" fontWeight="normal">
                  {occasionMeta(selectedOccasion).label}
                </Text>
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <VStack spacing={5} align="stretch">
              {/* Occasion Selector */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Occasion</FormLabel>
                <Select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  borderRadius="lg"
                  focusBorderColor={ThemeColors.primaryColor}
                >
                  {OCCASIONS.map((occ) => (
                    <option key={occ.key} value={occ.key}>
                      {occ.emoji} {occ.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Preset Amounts */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Select Amount (UGX)</FormLabel>
                <SimpleGrid columns={3} spacing={2}>
                  {PRESET_AMOUNTS.map((amt) => (
                    <Button
                      key={amt}
                      variant={purchaseAmount === String(amt) ? "solid" : "outline"}
                      bg={purchaseAmount === String(amt) ? ThemeColors.primaryColor : "transparent"}
                      color={purchaseAmount === String(amt) ? "white" : "gray.700"}
                      borderColor={purchaseAmount === String(amt) ? ThemeColors.primaryColor : "gray.200"}
                      _hover={{
                        bg: purchaseAmount === String(amt) ? "#2e7d32" : "gray.50",
                      }}
                      borderRadius="lg"
                      fontWeight="700"
                      fontSize="sm"
                      onClick={() => {
                        setPurchaseAmount(String(amt));
                        setCustomAmount("");
                      }}
                    >
                      {(amt / 1000).toFixed(0)}k
                    </Button>
                  ))}
                </SimpleGrid>
              </FormControl>

              {/* Custom Amount */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Or Enter Custom Amount</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.400" fontSize="sm">
                    UGX
                  </InputLeftElement>
                  <Input
                    type="number"
                    placeholder="e.g. 75000"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setPurchaseAmount("");
                    }}
                    borderRadius="lg"
                    focusBorderColor={ThemeColors.primaryColor}
                    pl={12}
                  />
                </InputGroup>
              </FormControl>

              <Divider />

              {/* For Someone Else Toggle */}
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb={0} fontSize="sm" fontWeight="600" color="gray.600">
                  For Someone Else?
                </FormLabel>
                <Switch
                  colorScheme="green"
                  isChecked={forSomeoneElse}
                  onChange={(e) => setForSomeoneElse(e.target.checked)}
                />
              </FormControl>

              {/* Recipient Fields */}
              <AnimatePresence>
                {forSomeoneElse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <VStack spacing={3} align="stretch">
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Recipient Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none"><Icon as={FaUser} color="gray.400" /></InputLeftElement>
                          <Input
                            placeholder="Recipient's name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            borderRadius="lg"
                            focusBorderColor={ThemeColors.primaryColor}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Recipient Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none"><Icon as={FaEnvelope} color="gray.400" /></InputLeftElement>
                          <Input
                            type="email"
                            placeholder="recipient@email.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            borderRadius="lg"
                            focusBorderColor={ThemeColors.primaryColor}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Recipient Phone (optional)</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none"><Icon as={FaPhone} color="gray.400" /></InputLeftElement>
                          <Input
                            type="tel"
                            placeholder="+256..."
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            borderRadius="lg"
                            focusBorderColor={ThemeColors.primaryColor}
                          />
                        </InputGroup>
                      </FormControl>
                    </VStack>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Payment Method */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Payment Method</FormLabel>
                <HStack spacing={3}>
                  <Button
                    flex={1}
                    variant={paymentMethod === "mobile_money" ? "solid" : "outline"}
                    bg={paymentMethod === "mobile_money" ? ThemeColors.primaryColor : "transparent"}
                    color={paymentMethod === "mobile_money" ? "white" : "gray.700"}
                    borderColor={paymentMethod === "mobile_money" ? ThemeColors.primaryColor : "gray.200"}
                    _hover={{ bg: paymentMethod === "mobile_money" ? "#2e7d32" : "gray.50" }}
                    borderRadius="lg"
                    leftIcon={<Icon as={FaMobileAlt} />}
                    onClick={() => setPaymentMethod("mobile_money")}
                    fontWeight="600"
                    fontSize="sm"
                  >
                    Mobile Money
                  </Button>
                  <Button
                    flex={1}
                    variant={paymentMethod === "card" ? "solid" : "outline"}
                    bg={paymentMethod === "card" ? ThemeColors.primaryColor : "transparent"}
                    color={paymentMethod === "card" ? "white" : "gray.700"}
                    borderColor={paymentMethod === "card" ? ThemeColors.primaryColor : "gray.200"}
                    _hover={{ bg: paymentMethod === "card" ? "#2e7d32" : "gray.50" }}
                    borderRadius="lg"
                    leftIcon={<Icon as={FaCreditCard} />}
                    onClick={() => setPaymentMethod("card")}
                    fontWeight="600"
                    fontSize="sm"
                  >
                    Card
                  </Button>
                </HStack>
              </FormControl>

              {/* Personal Message */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.600">Personal Message</FormLabel>
                <Textarea
                  placeholder="Add a personal touch..."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  borderRadius="lg"
                  focusBorderColor={ThemeColors.primaryColor}
                  rows={3}
                  resize="none"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter pt={0} pb={6} px={6}>
            <Button
              w="full"
              size="lg"
              bg={ThemeColors.primaryColor}
              color="white"
              fontWeight="700"
              fontSize="md"
              borderRadius="xl"
              _hover={{ bg: "#2e7d32", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              boxShadow="md"
              leftIcon={<FaGift />}
              onClick={handlePurchase}
              isLoading={purchasing}
              loadingText="Processing..."
              isDisabled={!finalAmount}
              transition="all 0.2s"
            >
              Purchase Voucher {finalAmount > 0 ? `- ${fmtUGX(finalAmount)}` : ""}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* ===== REDEEM CODE MODAL ===== */}
      <Modal isOpen={isRedeemOpen} onClose={closeRedeemModal} size="md" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" mx={4}>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FaTicketAlt} color={ThemeColors.primaryColor} boxSize={6} />
              <Heading size="md">Redeem a Voucher Code</Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={2}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.500">
                Enter the voucher code you received to add it to your account.
              </Text>
              <FormControl>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter voucher code"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    fontFamily="mono"
                    fontWeight="600"
                    letterSpacing="wider"
                    borderRadius="xl"
                    focusBorderColor={ThemeColors.primaryColor}
                    textTransform="uppercase"
                  />
                </InputGroup>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter pb={6}>
            <Button
              w="full"
              size="lg"
              bg={ThemeColors.primaryColor}
              color="white"
              fontWeight="700"
              borderRadius="xl"
              _hover={{ bg: "#2e7d32", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              boxShadow="md"
              leftIcon={<FaTicketAlt />}
              onClick={handleRedeem}
              isLoading={redeeming}
              loadingText="Redeeming..."
              isDisabled={!redeemCode.trim()}
              transition="all 0.2s"
            >
              Redeem Voucher
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}