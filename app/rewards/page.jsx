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
  useGetReferralsMutation,
  useGetReferralRewardsMutation,
} from "@slices/usersApiSlice";
import { useAuth } from "@slices/authSlice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGift, FaStar, FaUsers, FaMoneyBillWave } from "react-icons/fa";

const MotionCard = motion(Card);

export default function RewardsPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isRedeemOpen, onOpen: openRedeem, onClose: closeRedeem } = useDisclosure();

  const [rewards, setRewards] = useState([]);
  const [myRewards, setMyRewards] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);

  const [referralData, setReferralData] = useState(null);
  const [referralRewards, setReferralRewards] = useState(null);

  const [getRewards] = useGetRewardsMutation();
  const [getMyRewards] = useGetMyRewardsMutation();
  const [redeemReward, { isLoading: redeeming }] = useRedeemRewardMutation();
  const [getCashoutStats] = useGetCashoutStatsMutation();
  const [getReferrals] = useGetReferralsMutation();
  const [getReferralRewards] = useGetReferralRewardsMutation();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [rewardsRes, myRewardsRes, statsRes, referralsRes, referralRewardsRes] = await Promise.all([
        getRewards().unwrap().catch(() => ({ status: "Success", data: [] })),
        getMyRewards().unwrap().catch(() => ({ status: "Success", data: [] })),
        getCashoutStats().unwrap().catch(() => ({ status: "Success", data: { loyalty: 0 } })),
        getReferrals().unwrap().catch(() => ({ status: "Success", data: null })),
        getReferralRewards().unwrap().catch(() => ({ status: "Success", data: null })),
      ]);
      setRewards(Array.isArray(rewardsRes?.data) ? rewardsRes.data : []);
      setMyRewards(Array.isArray(myRewardsRes?.data) ? myRewardsRes.data : []);
      setLoyaltyPoints(Number(statsRes?.data?.loyalty || 0));
      if (referralsRes?.data) setReferralData(referralsRes.data);
      if (referralRewardsRes?.data) setReferralRewards(referralRewardsRes.data);
    } catch (e) {
      setRewards([]);
      setMyRewards([]);
    } finally {
      setLoading(false);
    }
  }, [getRewards, getMyRewards, getCashoutStats, getReferrals, getReferralRewards]);

  useEffect(() => {
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      router.push("/signin");
      return;
    }
    loadData();
  }, [userInfo, router, loadData]); // eslint-disable-line react-hooks/exhaustive-deps

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
        {/* Referral Earnings Summary */}
        {referralData && (
          <Box mb={10}>
            <Heading size="md" mb={4} color="gray.800">Referral Earnings</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
              <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="green.100" overflow="hidden">
                <CardBody>
                  <HStack spacing={3}>
                    <Flex w={10} h={10} borderRadius="lg" bg="green.50" align="center" justify="center">
                      <Icon as={FaMoneyBillWave} color="green.500" boxSize={5} />
                    </Flex>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="600">Total Earned</Text>
                      <Text fontSize="xl" fontWeight="800" color="green.600">UGX {Number(referralData.totalEarnings || 0).toLocaleString()}</Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
              <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="blue.100" overflow="hidden">
                <CardBody>
                  <HStack spacing={3}>
                    <Flex w={10} h={10} borderRadius="lg" bg="blue.50" align="center" justify="center">
                      <Icon as={FaUsers} color="blue.500" boxSize={5} />
                    </Flex>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="600">People Referred</Text>
                      <Text fontSize="xl" fontWeight="800" color="blue.600">{referralData.totalReferred || 0}</Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
              <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="purple.100" overflow="hidden">
                <CardBody>
                  <HStack spacing={3}>
                    <Flex w={10} h={10} borderRadius="lg" bg="purple.50" align="center" justify="center">
                      <Icon as={FaStar} color="purple.500" boxSize={5} />
                    </Flex>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="600">Per Referral</Text>
                      <Text fontSize="xl" fontWeight="800" color="purple.600">UGX {Number(referralData.rewardPerReferral || 50000).toLocaleString()}</Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {referralData.referredUsers?.length > 0 && (
              <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
                <CardBody>
                  <Text fontWeight="700" fontSize="sm" color="gray.700" mb={3}>People you referred</Text>
                  <VStack spacing={3} align="stretch">
                    {referralData.referredUsers.map((person, i) => {
                      const name = [person.firstname, person.lastname].filter(Boolean).join(" ") || "YooKatale User";
                      const joinDate = person.joinedAt ? new Date(person.joinedAt).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" }) : "";
                      return (
                        <Flex key={person._id || i} align="center" justify="space-between" p={3} borderRadius="lg" bg="gray.50" _hover={{ bg: "green.50" }} transition="all 0.2s">
                          <HStack spacing={3}>
                            <Flex w={10} h={10} borderRadius="lg" bg="green.500" align="center" justify="center">
                              <Text color="white" fontWeight="800" fontSize="sm">
                                {(person.firstname?.[0] || "Y").toUpperCase()}{(person.lastname?.[0] || "U").toUpperCase()}
                              </Text>
                            </Flex>
                            <Box>
                              <Text fontWeight="700" fontSize="sm" color="gray.800">{name}</Text>
                              {person.email && <Text fontSize="xs" color="gray.500">{person.email}</Text>}
                            </Box>
                          </HStack>
                          <VStack spacing={0} align="end">
                            <Badge colorScheme="green" fontSize="xs">Joined</Badge>
                            {joinDate && <Text fontSize="xs" color="gray.400" mt={1}>{joinDate}</Text>}
                          </VStack>
                        </Flex>
                      );
                    })}
                  </VStack>
                </CardBody>
              </Card>
            )}
          </Box>
        )}

        {/* First-Purchase Referral Rewards */}
        {referralRewards?.rewards?.length > 0 && (
          <Box mb={10}>
            <Heading size="md" mb={4} color="gray.800">First-Purchase Bonuses</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
              <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="green.100" overflow="hidden">
                <CardBody>
                  <HStack spacing={3}>
                    <Flex w={10} h={10} borderRadius="lg" bg="green.50" align="center" justify="center">
                      <Icon as={FaMoneyBillWave} color="green.500" boxSize={5} />
                    </Flex>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="600">Cash Bonuses</Text>
                      <Text fontSize="xl" fontWeight="800" color="green.600">UGX {Number(referralRewards.totalCash || 0).toLocaleString()}</Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
              <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="yellow.100" overflow="hidden">
                <CardBody>
                  <HStack spacing={3}>
                    <Flex w={10} h={10} borderRadius="lg" bg="yellow.50" align="center" justify="center">
                      <Icon as={FaGift} color="yellow.600" boxSize={5} />
                    </Flex>
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="600">Gift Cards Earned</Text>
                      <Text fontSize="xl" fontWeight="800" color="yellow.600">UGX {Number(referralRewards.totalGiftCards || 0).toLocaleString()}</Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Card bg="white" borderRadius="xl" boxShadow="md" borderWidth="1px" borderColor="gray.100" overflow="hidden">
              <CardBody>
                <Text fontWeight="700" fontSize="sm" color="gray.700" mb={3}>Rewards from friends' first purchases</Text>
                <VStack spacing={3} align="stretch">
                  {referralRewards.rewards.map((reward, i) => {
                    const person = reward.referredUser || {};
                    const name = [person.firstname, person.lastname].filter(Boolean).join(" ") || "YooKatale User";
                    const date = reward.createdAt ? new Date(reward.createdAt).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" }) : "";
                    return (
                      <Flex key={reward._id || i} direction="column" p={3} borderRadius="lg" bg="gray.50" _hover={{ bg: "yellow.50" }} transition="all 0.2s" gap={2}>
                        <Flex align="center" justify="space-between">
                          <HStack spacing={3}>
                            <Flex w={10} h={10} borderRadius="lg" bg="orange.400" align="center" justify="center">
                              <Text color="white" fontWeight="800" fontSize="sm">
                                {(person.firstname?.[0] || "Y").toUpperCase()}{(person.lastname?.[0] || "U").toUpperCase()}
                              </Text>
                            </Flex>
                            <Box>
                              <Text fontWeight="700" fontSize="sm" color="gray.800">{name} made a purchase!</Text>
                              {date && <Text fontSize="xs" color="gray.400">{date}</Text>}
                            </Box>
                          </HStack>
                        </Flex>
                        <Flex gap={2} flexWrap="wrap" ml={13}>
                          {reward.cashAmount > 0 && (
                            <Badge colorScheme="green" fontSize="xs" px={2} py={1} borderRadius="md">
                              +UGX {Number(reward.cashAmount).toLocaleString()} cash
                            </Badge>
                          )}
                          {reward.giftCard && (
                            <Badge colorScheme="yellow" fontSize="xs" px={2} py={1} borderRadius="md">
                              Gift Card: {reward.giftCard.code} (UGX {Number(reward.giftCard.amount).toLocaleString()})
                            </Badge>
                          )}
                        </Flex>
                      </Flex>
                    );
                  })}
                </VStack>
              </CardBody>
            </Card>
          </Box>
        )}

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
