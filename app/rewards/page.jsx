"use client";

/**
 * Rewards Page — Redeem loyalty points for discounts, free delivery, vouchers, etc.
 */

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
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
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import {
  useGetRewardsMutation,
  useGetMyRewardsMutation,
  useRedeemRewardMutation,
  useGetCashoutStatsMutation,
} from "@slices/usersApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGift, FaStar } from "react-icons/fa";

const MotionCard = motion(Card);

export default function RewardsPage() {
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isRedeemOpen, onOpen: openRedeem, onClose: closeRedeem } = useDisclosure();

  const [rewards, setRewards] = useState([]);
  const [myRewards, setMyRewards] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);

  const [getRewards] = useGetRewardsMutation();
  const [getMyRewards] = useGetMyRewardsMutation();
  const [redeemReward, { isLoading: redeeming }] = useRedeemRewardMutation();
  const [getCashoutStats] = useGetCashoutStatsMutation();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [rewardsRes, myRewardsRes, statsRes] = await Promise.all([
        getRewards().unwrap().catch(() => ({ status: "Success", data: [] })),
        getMyRewards().unwrap().catch(() => ({ status: "Success", data: [] })),
        getCashoutStats().unwrap().catch(() => ({ status: "Success", data: { loyalty: 0 } })),
      ]);
      setRewards(Array.isArray(rewardsRes?.data) ? rewardsRes.data : []);
      setMyRewards(Array.isArray(myRewardsRes?.data) ? myRewardsRes.data : []);
      setLoyaltyPoints(Number(statsRes?.data?.loyalty || 0));
    } catch (e) {
      setRewards([]);
      setMyRewards([]);
    } finally {
      setLoading(false);
    }
  }, [getRewards, getMyRewards, getCashoutStats]);

  useEffect(() => {
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      router.push("/signin");
      return;
    }
    loadData();
  }, [userInfo, router, loadData]);

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    openRedeem();
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;
    if (loyaltyPoints < selectedReward.pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: `You need ${selectedReward.pointsRequired} points. You have ${loyaltyPoints}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const res = await redeemReward({ rewardId: selectedReward._id }).unwrap();
      toast({
        title: "Reward Redeemed!",
        description: res?.message || `You've redeemed ${selectedReward.title}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      closeRedeem();
      setSelectedReward(null);
      loadData();
    } catch (e) {
      toast({
        title: "Error",
        description: e?.data?.message || e?.message || "Failed to redeem reward.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
            <HStack spacing={3} mb={2}>
              <Icon as={FaGift} boxSize={8} />
              <Heading size="xl" letterSpacing="tight" fontWeight="800">Rewards</Heading>
            </HStack>
            <Text fontSize="lg" opacity={0.95}>Redeem your loyalty points for exclusive rewards and discounts.</Text>
            <HStack mt={4} spacing={4}>
              <Badge px={4} py={2} fontSize="md" bg="whiteAlpha.200" color="white" borderRadius="full">
                <Icon as={FaStar} mr={2} />
                {loyaltyPoints.toLocaleString()} Points Available
              </Badge>
            </HStack>
          </motion.div>
        </Container>
      </Box>

      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={8}>
        {/* My Redeemed Rewards */}
        {myRewards.length > 0 && (
          <Box mb={10}>
            <Heading size="md" mb={4} color="gray.800">My Redeemed Rewards</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {myRewards.map((ur) => (
                <MotionCard
                  key={ur._id}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor={ur.status === "active" ? "green.200" : "gray.200"}
                  overflow="hidden"
                >
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="600" fontSize="sm">{ur.reward?.title || "Reward"}</Text>
                        {ur.status === "active" ? (
                          <Badge colorScheme="green">Active</Badge>
                        ) : ur.status === "used" ? (
                          <Badge colorScheme="gray">Used</Badge>
                        ) : (
                          <Badge colorScheme="red">Expired</Badge>
                        )}
                      </HStack>
                      {ur.code && (
                        <Box w="full" p={2} bg="gray.50" borderRadius="md">
                          <Text fontSize="xs" color="gray.600">Code:</Text>
                          <Text fontWeight="700" fontSize="md" fontFamily="mono">{ur.code}</Text>
                        </Box>
                      )}
                      <Text fontSize="xs" color="gray.500">Redeemed {new Date(ur.createdAt).toLocaleDateString()}</Text>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Available Rewards */}
        <Box>
          <Heading size="md" mb={4} color="gray.800">Available Rewards</Heading>
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} h="200px" borderRadius="xl" />
              ))}
            </SimpleGrid>
          ) : rewards.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
              {rewards.map((r) => (
                <MotionCard
                  key={r._id}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor="gray.100"
                  overflow="hidden"
                  _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" w="full">
                        <Badge colorScheme="green" px={2} py={1}>{r.type.replace("_", " ").toUpperCase()}</Badge>
                        <HStack>
                          <Icon as={FaStar} color="yellow.400" />
                          <Text fontWeight="700">{r.pointsRequired}</Text>
                        </HStack>
                      </HStack>
                      <Heading size="sm" color="gray.800">{r.title}</Heading>
                      <Text fontSize="sm" color="gray.600">{r.description}</Text>
                      {r.value > 0 && (
                        <Text fontSize="sm" fontWeight="600" color={ThemeColors.primaryColor}>
                          {r.type === "discount" ? `${r.value}% OFF` : r.type === "cashback" ? `UGX ${r.value.toLocaleString()} Cashback` : `Value: ${r.value}`}
                        </Text>
                      )}
                      <Button
                        w="full"
                        size="sm"
                        colorScheme="green"
                        bg={ThemeColors.primaryColor}
                        _hover={{ bg: ThemeColors.secondaryColor }}
                        leftIcon={<FaGift />}
                        onClick={() => handleRedeem(r)}
                        isDisabled={loyaltyPoints < r.pointsRequired}
                      >
                        {loyaltyPoints >= r.pointsRequired ? "Redeem" : "Insufficient Points"}
                      </Button>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">No rewards available at the moment.</Text>
            </Box>
          )}
        </Box>
      </Container>

      {/* Redeem Confirmation Modal */}
      <Modal isOpen={isRedeemOpen} onClose={closeRedeem} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Redemption</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedReward && (
              <VStack align="start" spacing={4}>
                <Text fontWeight="600">{selectedReward.title}</Text>
                <Text fontSize="sm" color="gray.600">{selectedReward.description}</Text>
                <HStack>
                  <Text fontSize="sm">Cost:</Text>
                  <HStack>
                    <Icon as={FaStar} color="yellow.400" />
                    <Text fontWeight="700">{selectedReward.pointsRequired} points</Text>
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.500">Your balance: {loyaltyPoints} points</Text>
                {loyaltyPoints < selectedReward.pointsRequired && (
                  <Text fontSize="sm" color="red.500">Insufficient points!</Text>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeRedeem}>Cancel</Button>
            <Button
              colorScheme="green"
              bg={ThemeColors.primaryColor}
              _hover={{ bg: ThemeColors.secondaryColor }}
              onClick={confirmRedeem}
              isLoading={redeeming}
              isDisabled={loyaltyPoints < selectedReward?.pointsRequired}
            >
              Redeem
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
