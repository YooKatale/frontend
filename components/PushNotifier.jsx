// components/PushNotifier.jsx
"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import { usePushNotifications } from "@/lib/usePushNotifications";

export default function PushNotifier() {
  const { subscription, error } = usePushNotifications();
  const toast = useToast();
  const toastIdRef = useRef(null);

  // Request permission once
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Show toast only when status changes
  useEffect(() => {
    // Close any existing toast
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }

    let id;

    if (error) {
      id = toast({
        id: "push-error",
        title: "Push Error",
        description: error || "Push notifications not supported",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (!subscription) {
      id = toast({
        id: "push-subscribing",
        title: "Subscribing...",
        description: "Setting up push notifications",
        status: "info",
        duration: null, // persistent until success
        isClosable: false,
      });
    } else {
      id = toast({
        id: "push-success",
        title: "Push Enabled!",
        description: "You’ll receive updates",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }

    toastIdRef.current = id;
  }, [subscription, error, toast]);

  // Return null – we don’t render anything
  return null;
}
