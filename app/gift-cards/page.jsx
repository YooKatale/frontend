"use client";

/**
 * Gift Cards Page — View, purchase, and use gift cards.
 */

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Badge,
  Textarea,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import {
  useGetGiftCardsMutation,
  usePurchaseGiftCardMutation,
  useUseGiftCardMutation,
} from "@slices/usersApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTicketAlt, FaPlus, FaCopy, FaCheckCircle } from "react-icons/fa";

const MotionCard = motion(Card);

export default function GiftCardsPage() {
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isPurchaseOpen, onOpen: openPurchase, onClose: closePurchase } = useDisclosure();

  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [getGiftCards] = useGetGiftCardsMutation();
  const [purchaseGiftCard, { isLoading: purchasing }] = usePurchaseGiftCardMutation();
  const [useGiftCard] = useUseGiftCardMutation();

  const loadGiftCards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getGiftCards().unwrap();
      setGiftCards(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setGiftCards([]);
    } finally {
      setLoading(false);
    }
  }, [getGiftCards]);

  useEffect(() => {
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      router.push("/signin");
      return;
    }
    loadGiftCards();
  }, [userInfo, router, loadGiftCards]);

  const handlePurchase = async () => {
    const amt = Number(purchaseAmount);
    if (!amt || amt < 5000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum gift card amount is UGX 5,000",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      const res = await purchaseGiftCard({
        amount: amt,
        recipientEmail: recipientEmail.trim() || undefined,
        notes: notes.trim() || undefined,
      }).unwrap();
      toast({
        title: "Success",
        description: res?.message || "Gift card purchased successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      closePurchase();
      setPurchaseAmount("");
      setRecipientEmail("");
      setNotes("");
      loadGiftCards();
    } catch (e) {
      toast({
        title: "Error",
        description: e?.data?.message || e?.message || "Failed to purchase gift card.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Gift card code copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  if (!userInfo) return null;

  return (
    <Box minH="100vh" bg="gray.50" fontFamily="body" pb={16}>
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
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HStack spacing={3} mb={2} justify="space-between">
              <HStack spacing={3}>
                <Icon as={FaTicketAlt} boxSize={8} />
                <Heading size="xl" letterSpacing="tight" fontWeight="800">Gift Cards</Heading>
              </HStack>
              <Button
                leftIcon={<FaPlus />}
                bg="whiteAlpha.200"
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={openPurchase}
              >
                Purchase Gift Card
              </Button>
            </HStack>
            <Text fontSize="lg" opacity={0.95}>Purchase gift cards for yourself or send them to friends.</Text>
          </motion.div>
        </Container>
      </Box>

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={8}>
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} h="200px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        ) : giftCards.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {giftCards.map((gc) => (
              <MotionCard
                key={gc._id}
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                borderWidth="2px"
                borderColor={gc.status === "active" ? ThemeColors.primaryColor : "gray.200"}
                overflow="hidden"
                _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Badge
                        colorScheme={
                          gc.status === "active" ? "green" : gc.status === "used" ? "gray" : "red"
                        }
                        px={2}
                        py={1}
                      >
                        {gc.status.toUpperCase()}
                      </Badge>
                      {gc.purchasedBy && (
                        <Text fontSize="xs" color="gray.500">Gifted</Text>
                      )}
                    </HStack>
                    <Box w="full" p={3} bg={`${ThemeColors.primaryColor}10`} borderRadius="md">
                      <Text fontSize="xs" color="gray.600" mb={1}>Gift Card Code</Text>
                      <HStack justify="space-between">
                        <Text fontWeight="700" fontSize="lg" fontFamily="mono" letterSpacing="wide">
                          {gc.code}
                        </Text>
                        <IconButton
                          aria-label="Copy code"
                          icon={<FaCopy />}
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCode(gc.code)}
                        />
                      </HStack>
                    </Box>
                    <VStack align="start" spacing={1} w="full">
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Amount:</Text>
                        <Text fontWeight="700" fontSize="lg" color={ThemeColors.primaryColor}>
                          UGX {gc.amount.toLocaleString()}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Balance:</Text>
                        <Text fontWeight="700" fontSize="md">
                          UGX {gc.balance.toLocaleString()}
                        </Text>
                      </HStack>
                      {gc.expiresAt && (
                        <Text fontSize="xs" color="gray.500">
                          Expires: {new Date(gc.expiresAt).toLocaleDateString()}
                        </Text>
                      )}
                      {gc.notes && (
                        <Text fontSize="xs" color="gray.500" fontStyle="italic">
                          {gc.notes}
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12} bg="white" borderRadius="xl" p={8}>
            <Icon as={FaTicketAlt} boxSize={16} color="gray.300" mb={4} />
            <Heading size="md" color="gray.500" mb={2}>No Gift Cards Yet</Heading>
            <Text color="gray.500" mb={6}>Purchase a gift card to get started!</Text>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              bg={ThemeColors.primaryColor}
              _hover={{ bg: ThemeColors.secondaryColor }}
              onClick={openPurchase}
            >
              Purchase Gift Card
            </Button>
          </Box>
        )}
      </Container>

      {/* Purchase Modal */}
      <Modal isOpen={isPurchaseOpen} onClose={closePurchase} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Purchase Gift Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontWeight="600">Amount (UGX)</FormLabel>
                <Input
                  type="number"
                  min={5000}
                  placeholder="Minimum: 5,000"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>Minimum amount is UGX 5,000</Text>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="600">Send to Email (Optional)</FormLabel>
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>Leave empty to purchase for yourself</Text>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="600">Message (Optional)</FormLabel>
                <Textarea
                  placeholder="Add a personal message..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closePurchase}>Cancel</Button>
            <Button
              colorScheme="green"
              bg={ThemeColors.primaryColor}
              _hover={{ bg: ThemeColors.secondaryColor }}
              onClick={handlePurchase}
              isLoading={purchasing}
            >
              Purchase
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
