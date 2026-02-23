"use client";

import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import LocationSearchPicker from "./LocationSearchPicker";

/**
 * Hero Section - Glovo-inspired with YooKatale colors
 * Features location display and quick access to location picker
 */
const Hero = () => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    // Load saved location
    const saved = localStorage.getItem('yookatale_delivery_location');
    if (saved) {
      try {
        setDeliveryLocation(JSON.parse(saved));
      } catch (e) {
        // Ignore errors
      }
    }
  }, []);

  const handleLocationSelected = (location) => {
    localStorage.setItem('yookatale_delivery_location', JSON.stringify(location));
    setDeliveryLocation(location);
    setShowLocationPicker(false);
  };

  return (
    <>
      <Box
        as="section"
        width="100%"
        maxWidth="87.5rem"
        margin="0 auto"
        position="relative"
        height={{
          base: "18.75rem",
          sm: "25rem",
          lg: "32rem"
        }}
        borderRadius={{ base: 0, lg: "0 0 24px 24px" }}
        overflow="hidden"
      >
        <Image
          src="/assets/images/banner.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1400px) 100vw, 1400px"
          style={{ objectFit: "cover" }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)"
          pointerEvents="none"
        />

        {/* Location Badge - Glovo Style */}
        <Box
          position="absolute"
          top={{ base: 4, md: 6 }}
          left={{ base: 4, md: 8 }}
          zIndex={10}
        >
          <Box
            as="button"
            onClick={() => setShowLocationPicker(true)}
            display="flex"
            alignItems="center"
            gap={2}
            px={4}
            py={2.5}
            bg="white"
            borderRadius="full"
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            }}
            transition="all 0.2s"
            cursor="pointer"
          >
            <MapPin size={18} color="#185F2D" />
            <Text
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight="600"
              color="gray.800"
              noOfLines={1}
              maxW={{ base: "150px", md: "250px" }}
            >
              {deliveryLocation?.address || 'Select location'}
            </Text>
            <Text fontSize="20px" color="gray.400">›</Text>
          </Box>
        </Box>

        {/* Hero Content - Empty for cleaner look */}
      </Box>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationSearchPicker
          onLocationSelected={handleLocationSelected}
          onClose={() => setShowLocationPicker(false)}
          initialAddress={deliveryLocation?.address}
          required={false}
        />
      )}
    </>
  );
};

export default Hero;
