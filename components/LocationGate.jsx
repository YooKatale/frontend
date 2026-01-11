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
    const checkLocation = () => {
      try {
        const savedLocation = localStorage.getItem('yookatale_delivery_location');
        if (savedLocation) {
          const parsed = JSON.parse(savedLocation);
          // Validate location - must have address and not be browsing placeholder
          if (parsed && parsed.address && parsed.address !== 'Browsing - Location not set') {
            console.log('Valid location found:', parsed);
            setLocation(parsed);
            setShowLocationPicker(false);
          } else {
            console.log('Invalid or browsing location, showing picker');
            setLocation(null);
            setShowLocationPicker(true);
          }
        } else {
          console.log('No location saved, showing picker');
          setLocation(null);
          setShowLocationPicker(true);
        }
      } catch (e) {
        console.error('Error parsing location:', e);
        setLocation(null);
        setShowLocationPicker(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkLocation();

    // Listen for storage changes (when location is saved from another tab/component)
    const handleStorageChange = (e) => {
      if (e.key === 'yookatale_delivery_location') {
        checkLocation();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLocationSelected = (locationData) => {
    console.log('LocationGate: handleLocationSelected called with:', locationData);
    try {
      // Validate location data
      if (!locationData || !locationData.address) {
        console.error('Invalid location data:', locationData);
        return;
      }

      // Save location to localStorage
      const locationJson = JSON.stringify(locationData);
      localStorage.setItem('yookatale_delivery_location', locationJson);
      console.log('LocationGate: Location saved to localStorage');

      // Update state
      setLocation(locationData);
      setShowLocationPicker(false);
      console.log('LocationGate: Location state updated, modal closed');
    } catch (error) {
      console.error('LocationGate: Error saving location:', error);
    }
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
