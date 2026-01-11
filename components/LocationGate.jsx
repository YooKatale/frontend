"use client";

import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import LocationSearchPicker from './LocationSearchPicker';

/**
 * Location Gate Component
 * Requires location selection before accessing the app/web
 * Shows modal overlay while homepage renders in background
 */
export default function LocationGate({ children }) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if location is already saved
    const savedLocation = localStorage.getItem('yookatale_delivery_location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
        setIsLoading(false);
        setShowLocationPicker(false);
      } catch (e) {
        setIsLoading(false);
        setShowLocationPicker(true);
      }
    } else {
      setIsLoading(false);
      setShowLocationPicker(true);
    }
  }, []);

  const handleLocationSelected = (locationData) => {
    // Save location to localStorage (even if it's a browsing placeholder)
    localStorage.setItem('yookatale_delivery_location', JSON.stringify(locationData));
    setLocation(locationData);
    setShowLocationPicker(false);
  };

  // Always render children (homepage) in background, overlay modal when needed
  return (
    <>
      {/* Render homepage content in background */}
      <Box
        width="100%"
        minH="100vh"
        pointerEvents={showLocationPicker && !location ? 'none' : 'auto'}
        style={{
          filter: showLocationPicker && !location ? 'blur(2px)' : 'none',
          transition: 'filter 0.3s ease',
        }}
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="gray.50"
          >
            <Box textAlign="center">
              <Box
                display="inline-block"
                w="50px"
                h="50px"
                border="4px solid #e0e0e0"
                borderTop="4px solid #185F2D"
                borderRadius="50%"
                className="animate-spin"
                mb={4}
              />
              <Box color="gray.600" fontSize="14px">Loading...</Box>
            </Box>
          </Box>
        ) : (
          children
        )}
      </Box>

      {/* Show location picker modal as overlay when needed - rendered outside to avoid pointer-events issues */}
      {(showLocationPicker || !location) && !isLoading && (
        <LocationSearchPicker
          onLocationSelected={handleLocationSelected}
          required={!location}
          onClose={() => {
            // Only allow closing if location is already set (not required)
            if (location) {
              setShowLocationPicker(false);
            }
          }}
        />
      )}
    </>
  );
}
