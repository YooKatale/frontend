"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Text, Heading, Badge, Progress, VStack, HStack, Link } from "@chakra-ui/react";
import { ShoppingCart, CheckCircle, ChefHat, Truck, Navigation, PackageCheck } from "lucide-react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@lib/firebase";
import { DB_URL } from "@config/config";

export default function OrderTracking({ orderId, initialOrder }) {
  const [order, setOrder] = useState(initialOrder || null);
  const [backendTracking, setBackendTracking] = useState(null);
  const [loading, setLoading] = useState(!initialOrder);

  useEffect(() => {
    if (!orderId || !db) return;
    const orderRef = ref(db, `orders/${orderId}`);
    const unsub = onValue(orderRef, (snap) => {
      const data = snap.val();
      if (data) {
        setOrder((prev) => ({ ...prev, ...data }));
        setLoading(false);
      }
    });
    return () => off(orderRef);
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    let alive = true;
    const fetchTracking = async () => {
      try {
        const res = await fetch(`${DB_URL}/delivery/order/${orderId}`, { credentials: "include" });
        const json = await res.json();
        if (alive && json?.status === "Success") {
          setBackendTracking(json.data);
          setOrder((prev) => ({ ...prev, status: json.data?.orderStatus || prev?.status }));
          setLoading(false);
        }
      } catch {}
    };

    fetchTracking();
    const t = setInterval(fetchTracking, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [orderId]);

  const statusInfo = useMemo(() => {
    const key = String(order?.status || "pending").toLowerCase();
    const map = {
      pending: { label: "Order Placed", progress: 12, color: "orange", icon: ShoppingCart },
      confirmed: { label: "Confirmed", progress: 24, color: "blue", icon: CheckCircle },
      preparing: { label: "Preparing", progress: 42, color: "purple", icon: ChefHat },
      ready: { label: "Ready for Pickup", progress: 58, color: "cyan", icon: PackageCheck },
      assigned: { label: "Driver Assigned", progress: 70, color: "teal", icon: Truck },
      picked_up: { label: "Picked Up", progress: 82, color: "teal", icon: Truck },
      in_transit: { label: "On the Way", progress: 92, color: "green", icon: Navigation },
      delivered: { label: "Delivered", progress: 100, color: "green", icon: CheckCircle },
      cancelled: { label: "Cancelled", progress: 100, color: "red", icon: CheckCircle },
    };
    return map[key] || map.pending;
  }, [order?.status]);

  if (loading) {
    return <Box p={6}><Text fontSize="sm" color="gray.500">Loading tracking...</Text></Box>;
  }

  const IconComp = statusInfo.icon;
  const location = backendTracking?.deliveryLocation?.location;
  const hasCoords = location?.lat != null && location?.lng != null;

  return (
    <Box borderWidth="1px" borderColor="gray.200" borderRadius="lg" p={4}>
      <HStack justify="space-between" mb={3}>
        <HStack><IconComp size={18} /><Heading size="sm">{statusInfo.label}</Heading></HStack>
        <Badge colorScheme={statusInfo.color}>{String(order?.status || "pending").replace("_", " ")}</Badge>
      </HStack>

      <Progress value={statusInfo.progress} colorScheme={statusInfo.color} borderRadius="full" mb={4} />

      {hasCoords ? (
        <VStack align="stretch" spacing={2}>
          <Text fontSize="xs" color="gray.500">Driver location updated{location?.updatedAt ? `: ${new Date(location.updatedAt).toLocaleTimeString()}` : ""}</Text>
          <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <iframe
              title={`tracking-${orderId}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.02}%2C${location.lat - 0.02}%2C${location.lng + 0.02}%2C${location.lat + 0.02}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
            />
          </Box>
          <HStack spacing={4}>
            <Link href={backendTracking?.navigation?.googleMaps || `https://www.google.com/maps?q=${location.lat},${location.lng}`} isExternal color="blue.600" fontSize="xs">Open Google Maps</Link>
            <Link href={backendTracking?.navigation?.openStreetMap || `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=16/${location.lat}/${location.lng}`} isExternal color="blue.600" fontSize="xs">OpenStreetMap</Link>
          </HStack>
        </VStack>
      ) : (
        <Text fontSize="xs" color="gray.500">Live location will appear once the driver starts delivery updates.</Text>
      )}
    </Box>
  );
}
