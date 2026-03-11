"use client";

import { Box, Flex, Grid, Heading, useToast, Text, Button, Badge, VStack, HStack, Divider, Textarea } from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import {
  useOrdersMeQuery,
  useCancelOrderMutation,
  useDeleteOrderFromHistoryMutation,
} from "@slices/productsApiSlice";
import { useMemo, useState } from "react";
import { useAuth } from "@slices/authSlice";
import OrderTracking from "@components/OrderTracking";

const activeStatuses = ["pending", "confirmed", "preparing", "ready", "assigned", "picked_up", "in_transit"];
const cancellableStatuses = ["pending", "confirmed", "preparing", "ready", "assigned"];

const statusColor = (s = "") => {
  const key = String(s).toLowerCase();
  if (["delivered"].includes(key)) return "green";
  if (["cancelled", "refunded"].includes(key)) return "red";
  if (["in_transit", "picked_up"].includes(key)) return "teal";
  if (["ready", "assigned"].includes(key)) return "cyan";
  if (["preparing"].includes(key)) return "purple";
  if (["confirmed"].includes(key)) return "blue";
  return "yellow";
};

const OrdersTab = () => {
  const { userInfo } = useAuth();
  const [orderTabs, setOrderTabs] = useState("active");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const { data: orders = [], isLoading, refetch } = useOrdersMeQuery(undefined, { skip: !userInfo?._id });
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [deleteOrderFromHistory, { isLoading: deleting }] = useDeleteOrderFromHistoryMutation();
  const toast = useToast();

  const { active, completed } = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    return {
      active: list.filter((o) => activeStatuses.includes(String(o?.status || "").toLowerCase())),
      completed: list.filter((o) => !activeStatuses.includes(String(o?.status || "").toLowerCase())),
    };
  }, [orders]);

  const visible = orderTabs === "active" ? active : completed;

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder({ orderId, reason: cancelReason || "Cancelled by customer" }).unwrap();
      toast({ title: "Order cancelled", status: "success", duration: 2500 });
      setCancelReason("");
      refetch();
    } catch (err) {
      toast({ title: "Unable to cancel", description: err?.data?.message || "Try again", status: "error", duration: 3500 });
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrderFromHistory({ orderId }).unwrap();
      toast({ title: "Order removed", status: "success", duration: 2500 });
      if (expandedOrderId === orderId) setExpandedOrderId(null);
      refetch();
    } catch (err) {
      toast({ title: "Unable to remove", description: err?.data?.message || "Try again", status: "error", duration: 3500 });
    }
  };

  return (
    <Box>
      <Box padding="0.5rem 1rem" borderBottom={`1.7px solid ${ThemeColors.lightColor}`}>
        <Flex justifyContent="start" gap={2} flexWrap="wrap">
          <Button type="button" size="sm" color={orderTabs === "active" ? ThemeColors.lightColor : "#000"} background={orderTabs === "active" ? ThemeColors.darkColor : "none"} border={`1.7px solid ${ThemeColors.darkColor}`} borderRadius="0.4rem" onClick={() => setOrderTabs("active")}>Active Orders</Button>
          <Button type="button" size="sm" color={orderTabs === "completed" ? ThemeColors.lightColor : "#000"} background={orderTabs === "completed" ? ThemeColors.darkColor : "none"} border={`1.7px solid ${ThemeColors.darkColor}`} borderRadius="0.4rem" onClick={() => setOrderTabs("completed")}>Completed / History</Button>
        </Flex>
      </Box>

      <Box padding="1rem">
        <Heading as="h2" size="md" mb={4}>{orderTabs === "active" ? "Active Orders" : "Order History"}</Heading>

        {isLoading ? (
          <Text fontSize="sm" color="gray.500">Loading your orders...</Text>
        ) : visible.length === 0 ? (
          <Text fontSize="lg" textAlign="center" py={8}>No {orderTabs} orders yet</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {visible.map((order, idx) => {
              const orderId = order?._id;
              const isExpanded = expandedOrderId === orderId;
              const status = String(order?.status || "pending").toLowerCase();
              return (
                <Box key={orderId || idx} borderRadius="0.7rem" border={`1.5px solid ${ThemeColors.lightColor}`} p={4}>
                  <Grid templateColumns={{ base: "1fr", md: "1.8fr 1fr" }} gap={3}>
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="700">Order #{(orderId || "").slice(-8)}</Text>
                        <Badge colorScheme={statusColor(status)}>{status.replace("_", " ")}</Badge>
                      </HStack>
                      <Text fontSize="sm">Items: {order?.productItems || `${order?.products?.length || 0} item(s)`}</Text>
                      <Text fontSize="sm">Total: UGX {(Number(order?.total || 0)).toLocaleString()}</Text>
                      <Text fontSize="sm" color="gray.600">Address: {order?.deliveryAddress?.address1 || "N/A"}</Text>
                    </Box>
                    <VStack align="stretch" spacing={2}>
                      <Button size="sm" variant="outline" onClick={() => setExpandedOrderId(isExpanded ? null : orderId)}>
                        {isExpanded ? "Hide Tracking" : "Track Order"}
                      </Button>

                      {cancellableStatuses.includes(status) && (
                        <>
                          <Textarea size="xs" rows={2} placeholder="Reason (optional)" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
                          <Button size="sm" colorScheme="orange" onClick={() => handleCancel(orderId)} isLoading={cancelling}>Cancel Order</Button>
                        </>
                      )}

                      {status === "cancelled" && (
                        <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(orderId)} isLoading={deleting}>Delete From History</Button>
                      )}
                    </VStack>
                  </Grid>

                  {isExpanded && (
                    <Box mt={4}>
                      <Divider mb={3} />
                      <OrderTracking orderId={orderId} initialOrder={order} />
                    </Box>
                  )}
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default OrdersTab;
