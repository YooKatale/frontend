"use client";

import {
  Box,
  Flex,
  Text,
  Container,
  VStack,
  HStack,
  Avatar,
  Badge,
  IconButton,
  Skeleton,
  useColorModeValue,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import {
  RiShoppingBag3Line,
  RiWallet3Line,
  RiUserSettingsLine,
  RiShareLine,
  RiTruckLine,
  RiBox3Line,
} from "react-icons/ri";
import { useAuth } from "@slices/authSlice";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useOrdersMutation } from "@slices/productsApiSlice";
import GeneralTab from "@components/modals/tabs/settingsTabs/GeneralTab";
import OrdersTab from "@components/modals/tabs/settingsTabs/OrdersTab";
import SettingsTab from "@components/modals/tabs/settingsTabs/SettingsTab";
import SubscriptionsTab from "@components/modals/tabs/settingsTabs/SubscriptionsTab";

const Account = () => {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    spent: 0,
    subscription: "Free",
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [fetchOrders] = useOrdersMutation();

  useEffect(() => {
    if (userInfo === undefined) return;
    if (!userInfo) {
      router.replace("/signin");
      return;
    }
  }, [userInfo, router]);

  function timeAgo(date) {
    if (!date) return "Recently";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Recently";
    const now = new Date();
    const s = Math.floor((now - d) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)} minutes ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
    if (s < 172800) return "Yesterday";
    if (s < 604800) return `${Math.floor(s / 86400)} days ago`;
    if (s < 2592000) return `${Math.floor(s / 604800)} weeks ago`;
    return d.toLocaleDateString();
  }

  function orderShortId(id) {
    if (!id || typeof id !== "string") return "YK-—";
    const s = id.replace(/^.*?([a-f0-9]{8,})$/, "$1").slice(-8);
    return `YK-${s.toUpperCase()}`;
  }

  useEffect(() => {
    let cancelled = false;

    async function loadAccountData() {
      if (!userInfo?._id) {
        if (!cancelled) {
          setStats((s) => ({ ...s, subscription: "Free" }));
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await fetchOrders(userInfo._id).unwrap();
        if (cancelled) return;

        if (res?.status === "Success" && res?.data) {
          const { CompletedOrders = [], AllOrders = [] } = res.data;
          const ordersCount = Array.isArray(AllOrders) ? AllOrders.length : 0;
          const totalSpent = Array.isArray(CompletedOrders)
            ? CompletedOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0)
            : 0;

          setStats((s) => ({
            ...s,
            orders: ordersCount,
            spent: totalSpent,
            subscription: userInfo?.subscription || userInfo?.plan || "Free",
          }));

          const activity = [];
          const completed = Array.isArray(CompletedOrders) ? CompletedOrders : [];
          const active = Array.isArray(AllOrders) ? AllOrders.filter((o) => (o?.status || "").toLowerCase() !== "completed") : [];
          completed.forEach((o) => {
            activity.push({
              icon: RiTruckLine,
              text: `Order #${orderShortId(o?._id)} delivered`,
              time: timeAgo(o?.createdAt),
              color: "green.500",
              sortAt: o?.createdAt ? new Date(o.createdAt).getTime() : 0,
            });
          });
          active.forEach((o) => {
            activity.push({
              icon: RiBox3Line,
              text: "Package shipped",
              time: timeAgo(o?.createdAt),
              color: "blue.500",
              sortAt: o?.createdAt ? new Date(o.createdAt).getTime() : 0,
            });
          });
          activity.sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0));
          setRecentActivity(activity.slice(0, 6));
        }
      } catch {
        if (!cancelled) setStats((s) => ({ ...s, subscription: userInfo?.subscription || userInfo?.plan || "Free" }));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAccountData();
    return () => { cancelled = true; };
  }, [userInfo?._id, userInfo?.subscription, userInfo?.plan, fetchOrders]);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryColor = ThemeColors.primaryColor;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20 },
  };

  const tabItems = [
    { id: "general", label: "Profile", icon: FiUser, iconSize: 20, color: "blue.500" },
    { id: "orders", label: "Orders", icon: RiShoppingBag3Line, iconSize: 20, color: "green.500", badge: stats.orders },
    { id: "subscriptions", label: "Subscriptions", icon: RiWallet3Line, iconSize: 20, color: "purple.500" },
    { id: "settings", label: "Settings", icon: RiUserSettingsLine, iconSize: 20, color: "orange.500" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab />;
      case "orders":
        return <OrdersTab />;
      case "subscriptions":
        return <SubscriptionsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <GeneralTab />;
    }
  };

  const activeTabItem = tabItems.find((t) => t.id === activeTab);

  if (userInfo === undefined) {
    return (
      <Container maxW="container.sm" py={8}>
        <Box h="120px" bg="gray.100" borderRadius="lg" />
      </Container>
    );
  }

  if (!userInfo) {
    return null;
  }

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} py={8} px={4}>
        <Container maxW="7xl">
          <Skeleton height="200px" borderRadius="2xl" mb={6} />
          <Flex gap={6}>
            <Skeleton width="280px" height="400px" borderRadius="2xl" display={{ base: "none", lg: "block" }} />
            <Skeleton flex={1} height="400px" borderRadius="2xl" />
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} py={{ base: 4, md: 8 }}>
      <Container maxW="7xl" px={{ base: 2, sm: 4, md: 6 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%" }}>
          <motion.div variants={itemVariants}>
            <Card
              bg={`linear-gradient(135deg, ${primaryColor} 0%, #2F855A 100%)`}
              borderRadius="2xl"
              boxShadow="0 20px 60px rgba(56, 161, 105, 0.2)"
              overflow="hidden"
              mb={6}
              position="relative"
              color="white"
            >
              <Box
                position="absolute"
                top="-50%"
                right="-50%"
                w="200%"
                h="200%"
                bg="radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)"
                bgSize="40px 40px"
                opacity={0.3}
              />
              <CardBody p={{ base: 4, md: 6 }}>
                <Flex direction={{ base: "column", md: "row" }} gap={6} align="center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Avatar
                      size={{ base: "xl", md: "2xl" }}
                      name={`${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`.trim() || userInfo?.email}
                      src={userInfo?.avatar}
                      bg="whiteAlpha.300"
                      border="4px solid"
                      borderColor="whiteAlpha.400"
                      color="white"
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="bold"
                      cursor="pointer"
                    />
                  </motion.div>

                  <VStack align={{ base: "center", md: "flex-start" }} spacing={2} flex={1} color="white">
                    <Flex align="center" gap={3} wrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                      <Heading size={{ base: "lg", md: "xl" }} fontWeight="800">
                        {`${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`.trim() || "Account"}
                      </Heading>
                      <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1} borderRadius="full" fontSize="xs">
                        {stats.subscription} Member
                      </Badge>
                    </Flex>
                    <Text fontSize={{ base: "sm", md: "md" }} opacity={0.9}>
                      {userInfo?.email}
                    </Text>
                    <HStack spacing={6} mt={2} wrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                      <VStack align={{ base: "center", md: "flex-start" }} spacing={0}>
                        <Text fontSize="2xl" fontWeight="800">{stats.orders}</Text>
                        <Text fontSize="xs" opacity={0.8}>Orders</Text>
                      </VStack>
                      <VStack align={{ base: "center", md: "flex-start" }} spacing={0}>
                        <Text fontSize="2xl" fontWeight="800">UGX {Number(stats.spent).toLocaleString()}</Text>
                        <Text fontSize="xs" opacity={0.8}>Total Spent</Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      aria-label="Share profile"
                      icon={<RiShareLine size={20} />}
                      size="lg"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: "whiteAlpha.200" }}
                      borderRadius="xl"
                    />
                  </motion.div>
                </Flex>
              </CardBody>
            </Card>
          </motion.div>

          <Flex direction={{ base: "column", lg: "row" }} gap={6}>
            <Box width={{ base: "100%", lg: "280px" }} position={{ lg: "sticky" }} top={{ lg: 6 }} alignSelf="flex-start">
              <motion.div variants={itemVariants}>
                <Card bg={cardBg} borderRadius="2xl" boxShadow="sm">
                  <CardBody p={0}>
                    <VStack spacing={0} align="stretch">
                      {tabItems.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <motion.div key={tab.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                            <Box
                              as="button"
                              w="100%"
                              p={4}
                              onClick={() => setActiveTab(tab.id)}
                              bg={isActive ? "green.50" : "transparent"}
                              color={isActive ? primaryColor : "gray.700"}
                              borderLeft="4px solid"
                              borderLeftColor={isActive ? primaryColor : "transparent"}
                              _hover={{ bg: "green.50" }}
                              transition="all 0.2s"
                              position="relative"
                            >
                              <HStack spacing={3}>
                                <Box
                                  p={2}
                                  borderRadius="md"
                                  bg={isActive ? primaryColor : "gray.100"}
                                  color={isActive ? "white" : "gray.600"}
                                >
                                  <Icon size={tab.iconSize} />
                                </Box>
                                <Text fontSize="sm" fontWeight={isActive ? "600" : "500"} flex={1} textAlign="left">
                                  {tab.label}
                                </Text>
                                {tab.badge != null && (
                                  <Badge colorScheme="green" variant="solid" borderRadius="full" px={2} py={0} fontSize="xs">
                                    {tab.badge}
                                  </Badge>
                                )}
                              </HStack>
                            </Box>
                          </motion.div>
                        );
                      })}
                    </VStack>
                  </CardBody>
                </Card>
              </motion.div>
            </Box>

            <Box flex={1}>
              <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" minH="600px" overflow="hidden">
                  <CardBody p={0}>
                    <Box
                      p={6}
                      borderBottom="1px solid"
                      borderColor={borderColor}
                      bg="linear-gradient(90deg, rgba(24, 95, 45, 0.05) 0%, transparent 100%)"
                    >
                      <HStack spacing={3} align="center">
                        {activeTabItem && (
                          <>
                            <Box p={2} borderRadius="lg" bg={primaryColor} color="white">
                              <activeTabItem.icon size={20} />
                            </Box>
                            <VStack align="flex-start" spacing={0}>
                              <Text fontSize="lg" fontWeight="700" color="gray.800">
                                {activeTabItem.label}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                Manage your {activeTabItem.label.toLowerCase()} settings
                              </Text>
                            </VStack>
                          </>
                        )}
                      </HStack>
                    </Box>

                    <Box p={{ base: 4, md: 6 }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          {renderTabContent()}
                        </motion.div>
                      </AnimatePresence>
                    </Box>
                  </CardBody>
                </Card>
              </motion.div>

              {activeTab === "general" && (
                <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                  <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" mt={4}>
                    <CardBody>
                      <Text fontSize="md" fontWeight="600" mb={4} color="gray.800">
                        Recent Activity
                      </Text>
                      <VStack spacing={3} align="stretch">
                        {recentActivity.length === 0 ? (
                          <Text fontSize="sm" color="gray.500">No recent activity</Text>
                        ) : (
                          recentActivity.map((activity, index) => {
                            const ActivityIcon = activity.icon;
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <HStack spacing={3} p={3} borderRadius="lg" _hover={{ bg: "gray.50" }}>
                                  <Box p={2} borderRadius="md" bg="gray.100" color={activity.color}>
                                    <ActivityIcon size={16} />
                                  </Box>
                                  <VStack align="flex-start" spacing={0} flex={1}>
                                    <Text fontSize="sm" fontWeight="500">{activity.text}</Text>
                                    <Text fontSize="xs" color="gray.500">{activity.time}</Text>
                                  </VStack>
                                </HStack>
                              </motion.div>
                            );
                          })
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </motion.div>
              )}
            </Box>
          </Flex>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Account;
