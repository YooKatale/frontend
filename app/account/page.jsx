"use client";
import { Box, Button, Flex, Grid, Spacer, Stack, Text, Container, VStack, HStack, Avatar, Divider } from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import GeneralTab from "@components/modals/tabs/settingsTabs/GeneralTab";
import OrdersTab from "@components/modals/tabs/settingsTabs/OrdersTab";
import SettingsTab from "@components/modals/tabs/settingsTabs/SettingsTab";
import SubscriptionsTab from "@components/modals/tabs/settingsTabs/SubscriptionsTab";
import { ThemeColors } from "@constants/constants";
import { useState } from "react";
import {
  FaCreditCard,
  FaRegUser,
  FaShieldAlt,
  FaTruckLoading,
  FaTruckMoving,
  FaUser,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Account = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("general");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const tabItems = [
    { id: "general", label: "General", icon: FaRegUser },
    { id: "orders", label: "Orders", icon: FaTruckLoading },
    { id: "subscriptions", label: "Subscriptions", icon: FaCreditCard },
    { id: "settings", label: "Settings", icon: FaShieldAlt },
  ];

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      py={{ base: 4, md: 8 }}
      px={{ base: 4, md: 6, lg: 8 }}
    >
      <Container maxW="7xl" centerContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: "100%" }}
        >
          {/* Profile Header Card */}
          <motion.div variants={itemVariants}>
            <Box
              bg="white"
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
              p={{ base: 4, md: 6 }}
              mb={6}
              w="100%"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "center", md: "center" }}
                gap={4}
              >
                <Avatar
                  size={{ base: "xl", md: "2xl" }}
                  name={`${userInfo?.firstname} ${userInfo?.lastname}`}
                  bg={ThemeColors.primaryColor}
                  color="white"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                />
                <VStack align={{ base: "center", md: "flex-start" }} spacing={1} flex={1}>
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    color="gray.800"
                    textAlign={{ base: "center", md: "left" }}
                  >
                    {`${userInfo?.firstname} ${userInfo?.lastname}`}
                  </Text>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color="gray.600"
                    fontWeight="500"
                    textAlign={{ base: "center", md: "left" }}
                  >
                    {userInfo?.email}
                  </Text>
                </VStack>
              </Flex>
            </Box>
          </motion.div>

          {/* Main Content */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={6}
            w="100%"
            align="flex-start"
          >
            {/* Sidebar Navigation */}
            <motion.div variants={itemVariants} style={{ width: "100%", maxWidth: "280px" }}>
              <Box
                bg="white"
                borderRadius="2xl"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                p={4}
                w="100%"
                position={{ base: "relative", lg: "sticky" }}
                top={{ base: 0, lg: 6 }}
              >
                <VStack align="stretch" spacing={2}>
                  {tabItems.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <motion.div
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Box
                          as="button"
                          w="100%"
                          p={4}
                          borderRadius="xl"
                          bg={isActive ? ThemeColors.primaryColor : "transparent"}
                          color={isActive ? "white" : "gray.700"}
                          onClick={() => setActiveTab(tab.id)}
                          transition="all 0.2s"
                          _hover={{
                            bg: isActive ? ThemeColors.primaryColor : "gray.100",
                            transform: "translateX(4px)",
                          }}
                          cursor="pointer"
                          textAlign="left"
                        >
                          <HStack spacing={3}>
                            <Icon size={20} />
                            <Text
                              fontSize="md"
                              fontWeight={isActive ? "600" : "500"}
                            >
                              {tab.label}
                            </Text>
                          </HStack>
                        </Box>
                      </motion.div>
                    );
                  })}
                </VStack>
              </Box>
            </motion.div>

            {/* Content Area */}
            <motion.div
              variants={itemVariants}
              style={{ flex: 1, width: "100%" }}
            >
              <Box
                bg="white"
                borderRadius="2xl"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                p={{ base: 4, md: 6, lg: 8 }}
                w="100%"
                minH="500px"
              >
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "general" ? (
                    <GeneralTab />
                  ) : activeTab === "orders" ? (
                    <OrdersTab />
                  ) : activeTab === "subscriptions" ? (
                    <SubscriptionsTab />
                  ) : activeTab === "settings" ? (
                    <SettingsTab />
                  ) : (
                    <GeneralTab />
                  )}
                </motion.div>
              </Box>
            </motion.div>
          </Flex>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Account;
