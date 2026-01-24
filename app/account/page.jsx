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
  Progress,
  SimpleGrid,
  Heading,
  Button,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import {
  RiShoppingBag3Line,
  RiWallet3Line,
  RiUserSettingsLine,
  RiNotification3Line,
  RiHeartLine,
  RiMapPinLine,
  RiShieldKeyholeLine,
  RiHistoryLine,
  RiStarLine,
  RiShareLine,
  RiQrCodeLine,
  RiGiftLine,
  RiTruckLine,
  RiBox3Line,
  RiStore2Line,
  RiLeafLine,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import GeneralTab from "@components/modals/tabs/settingsTabs/GeneralTab";
import OrdersTab from "@components/modals/tabs/settingsTabs/OrdersTab";
import SettingsTab from "@components/modals/tabs/settingsTabs/SettingsTab";
import SubscriptionsTab from "@components/modals/tabs/settingsTabs/SubscriptionsTab";

const Account = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 12,
    spent: 2450000,
    loyaltyPoints: 1250,
    subscription: "Premium",
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

  const quickActions = [
    { icon: RiNotification3Line, label: "Notifications", color: "blue.500" },
    { icon: RiHeartLine, label: "Wishlist", color: "red.500", badge: 5 },
    { icon: RiMapPinLine, label: "Addresses", color: "teal.500" },
    { icon: RiShieldKeyholeLine, label: "Security", color: "yellow.500" },
    { icon: RiHistoryLine, label: "History", color: "purple.500" },
    { icon: RiStarLine, label: "Reviews", color: "orange.500", badge: 12 },
    { icon: RiShareLine, label: "Referrals", color: "cyan.500" },
    { icon: RiQrCodeLine, label: "QR Code", color: "gray.600" },
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
                      name={`${userInfo?.firstname} ${userInfo?.lastname}`}
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
                        <Text fontSize="2xl" fontWeight="800">UGX {stats.spent.toLocaleString()}</Text>
                        <Text fontSize="xs" opacity={0.8}>Total Spent</Text>
                      </VStack>
                      <VStack align={{ base: "center", md: "flex-start" }} spacing={0}>
                        <Text fontSize="2xl" fontWeight="800">{stats.loyaltyPoints}</Text>
                        <Text fontSize="xs" opacity={0.8}>Loyalty Points</Text>
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
                <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" mb={4}>
                  <CardBody p={4}>
                    <Text fontSize="sm" fontWeight="600" mb={3} color="gray.700">
                      Quick Actions
                    </Text>
                    <SimpleGrid columns={4} spacing={2}>
                      {quickActions.map((action) => {
                        const ActionIcon = action.icon;
                        return (
                          <motion.div key={action.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <VStack
                              spacing={1}
                              p={2}
                              borderRadius="lg"
                              bg="gray.50"
                              cursor="pointer"
                              _hover={{ bg: "gray.100" }}
                              transition="background 0.2s"
                              position="relative"
                            >
                              <ActionIcon size={20} color={action.color} />
                              <Text fontSize="10px" fontWeight="500" textAlign="center">
                                {action.label}
                              </Text>
                              {action.badge && (
                                <Badge
                                  position="absolute"
                                  top="-2px"
                                  right="-2px"
                                  colorScheme="red"
                                  fontSize="8px"
                                  borderRadius="full"
                                  px={1}
                                  py={0}
                                >
                                  {action.badge}
                                </Badge>
                              )}
                            </VStack>
                          </motion.div>
                        );
                      })}
                    </SimpleGrid>
                  </CardBody>
                </Card>

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

                <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" mt={4}>
                  <CardBody p={4}>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="600" color="gray.700">
                          Loyalty Progress
                        </Text>
                        <Badge colorScheme="green" variant="subtle">
                          {stats.loyaltyPoints}/2000
                        </Badge>
                      </HStack>
                      <Progress
                        value={(stats.loyaltyPoints / 2000) * 100}
                        size="sm"
                        borderRadius="full"
                        colorScheme="green"
                        bg="gray.100"
                      />
                      <Text fontSize="xs" color="gray.500">
                        {2000 - stats.loyaltyPoints} points to Gold Tier
                      </Text>
                      <Button size="sm" colorScheme="green" variant="ghost" leftIcon={<RiGiftLine />} borderRadius="full">
                        Redeem Rewards
                      </Button>
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
                        {[
                          { icon: RiTruckLine, text: "Order #YK-2024-0012 delivered", time: "2 hours ago", color: "green.500" },
                          { icon: RiBox3Line, text: "Package shipped", time: "Yesterday", color: "blue.500" },
                          { icon: RiStore2Line, text: "New farm joined YooKatale", time: "2 days ago", color: "purple.500" },
                          { icon: RiLeafLine, text: "Earned 50 eco-points", time: "3 days ago", color: "teal.500" },
                        ].map((activity, index) => {
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
                        })}
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
