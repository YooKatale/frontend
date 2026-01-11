"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text, Heading, Badge, Progress, VStack, HStack, Icon } from "@chakra-ui/react";
import { 
  ShoppingCart, 
  CheckCircle, 
  Restaurant, 
  LocalShipping, 
  DeliveryDining, 
  DoneAll 
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

// Initialize Firebase (use your existing config)
const firebaseConfig = {
  // Add your Firebase config here
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://yookatale-aa476-default-rtdb.firebaseio.com/",
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

/**
 * Real-time Order Tracking Component (like Jumia Foods/Glovo)
 * Shows live order status updates and delivery progress
 */
export default function OrderTracking({ orderId, initialOrder }) {
  const [order, setOrder] = useState(initialOrder || null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [loading, setLoading] = useState(!initialOrder);

  useEffect(() => {
    if (!orderId || !db) return;

    // Listen to order updates in real-time
    const orderRef = ref(db, `orders/${orderId}`);
    const unsubscribeOrder = onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOrder(data);
        setLoading(false);
      }
    });

    // Listen to delivery location updates
    const deliveryRef = ref(db, `orders/${orderId}/delivery`);
    const unsubscribeDelivery = onValue(deliveryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDeliveryLocation(data);
      }
    });

    return () => {
      off(orderRef);
      off(deliveryRef);
    };
  }, [orderId]);

  const getStatusInfo = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    
    const statusMap = {
      pending: {
        text: "Order Placed",
        icon: ShoppingCart,
        color: "orange",
        progress: 16,
      },
      confirmed: {
        text: "Order Confirmed",
        icon: CheckCircle,
        color: "blue",
        progress: 33,
      },
      preparing: {
        text: "Preparing Your Order",
        icon: Restaurant,
        color: "purple",
        progress: 50,
      },
      awaiting_delivery: {
        text: "Awaiting Delivery",
        icon: LocalShipping,
        color: "yellow",
        progress: 66,
      },
      out_for_delivery: {
        text: "Out for Delivery",
        icon: DeliveryDining,
        color: "green",
        progress: 83,
      },
      delivered: {
        text: "Delivered",
        icon: DoneAll,
        color: "green",
        progress: 100,
      },
      completed: {
        text: "Completed",
        icon: DoneAll,
        color: "green",
        progress: 100,
      },
    };

    return statusMap[statusLower] || statusMap.pending;
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Loading order details...</Text>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box p={8} textAlign="center">
        <Text>Order not found</Text>
      </Box>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const steps = [
    { label: "Order Placed", completed: true },
    { label: "Order Confirmed", completed: order.status !== "pending" },
    { label: "Preparing", completed: ["preparing", "awaiting_delivery", "out_for_delivery", "delivered", "completed"].includes(order.status?.toLowerCase()) },
    { label: "Awaiting Delivery", completed: ["awaiting_delivery", "out_for_delivery", "delivered", "completed"].includes(order.status?.toLowerCase()) },
    { label: "Out for Delivery", completed: ["out_for_delivery", "delivered", "completed"].includes(order.status?.toLowerCase()) },
    { label: "Delivered", completed: ["delivered", "completed"].includes(order.status?.toLowerCase()) },
  ];

  return (
    <Box w="100%" maxW="800px" mx="auto" p={6}>
      {/* Status Header */}
      <Box
        bg={`${statusInfo.color}.500`}
        color="white"
        p={8}
        borderRadius="lg"
        mb={6}
        textAlign="center"
      >
        <Box display="flex" justifyContent="center" mb={4}>
          <StatusIcon size={64} />
        </Box>
        <Heading size="lg" mb={2}>
          {statusInfo.text}
        </Heading>
        <Text fontSize="sm" opacity={0.9}>
          Order #{orderId?.substring(0, 8) || "N/A"}
        </Text>
      </Box>

      {/* Progress Bar */}
      <Box mb={8}>
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold">Order Progress</Text>
          <Text fontSize="sm" color="gray.600">
            {statusInfo.progress}%
          </Text>
        </HStack>
        <Progress
          value={statusInfo.progress}
          colorScheme={statusInfo.color}
          size="lg"
          borderRadius="full"
        />
      </Box>

      {/* Progress Steps */}
      <VStack spacing={4} align="stretch" mb={8}>
        {steps.map((step, index) => (
          <HStack key={index} spacing={4}>
            <Box
              w={10}
              h={10}
              borderRadius="full"
              bg={step.completed ? `${statusInfo.color}.500` : "gray.200"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={step.completed ? "white" : "gray.500"}
              fontWeight="bold"
            >
              {index + 1}
            </Box>
            <Text
              flex={1}
              fontWeight={step.completed ? "bold" : "normal"}
              color={step.completed ? "black" : "gray.500"}
            >
              {step.label}
            </Text>
            {step.completed && (
              <CheckCircle size={20} color="green" />
            )}
          </HStack>
        ))}
      </VStack>

      {/* Order Details */}
      <Box
        borderWidth={1}
        borderColor="gray.200"
        borderRadius="lg"
        p={6}
        mb={6}
      >
        <Heading size="md" mb={4}>
          Order Details
        </Heading>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text color="gray.600">Order ID</Text>
            <Text fontWeight="bold">{orderId?.substring(0, 8) || "N/A"}</Text>
          </HStack>
          {order.createdAt && (
            <HStack justify="space-between">
              <Text color="gray.600">Order Date</Text>
              <Text fontWeight="bold">
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </HStack>
          )}
          {order.deliveryAddress && (
            <HStack justify="space-between">
              <Text color="gray.600">Delivery Address</Text>
              <Text fontWeight="bold" textAlign="right" maxW="60%">
                {order.deliveryAddress.address1 || "N/A"}
              </Text>
            </HStack>
          )}
          {order.total && (
            <HStack justify="space-between">
              <Text color="gray.600">Total Amount</Text>
              <Text fontWeight="bold" color="green.600">
                UGX {order.total.toLocaleString()}
              </Text>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Delivery Location (if available) */}
      {deliveryLocation && deliveryLocation.location && (
        <Box
          borderWidth={1}
          borderColor="gray.200"
          borderRadius="lg"
          p={6}
        >
          <Heading size="md" mb={4}>
            Delivery Location
          </Heading>
          <Text color="gray.600" mb={2}>
            {deliveryLocation.location.address || "Location updated"}
          </Text>
          <Badge colorScheme="green">
            Live Tracking Active
          </Badge>
        </Box>
      )}
    </Box>
  );
}
