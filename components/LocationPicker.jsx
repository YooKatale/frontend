"use client";

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { Loader } from 'lucide-react';

const LocationPicker = ({ onLocationSelected, initialLocation, initialAddress, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 0.3476, lng: 32.5825 } // Default: Kampala, Uganda
  );
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const initMap = () => {
      if (window.google && mapRef.current && !map) {
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: selectedLocation,
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        const newMarker = new window.google.maps.Marker({
          position: selectedLocation,
          map: newMap,
          draggable: true,
          title: 'Delivery Location',
        });

        // Update location when marker is dragged
        newMarker.addListener('dragend', (event) => {
          const newPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          setSelectedLocation(newPos);
          getAddressFromCoordinates(newPos.lat, newPos.lng);
        });

        // Update location when map is clicked
        newMap.addListener('click', (event) => {
          const newPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          setSelectedLocation(newPos);
          newMarker.setPosition(newPos);
          getAddressFromCoordinates(newPos.lat, newPos.lng);
        });

        setMap(newMap);
        setMarker(newMarker);

        // Get address for initial location
        if (!initialAddress) {
          getAddressFromCoordinates(selectedLocation.lat, selectedLocation.lng);
        }
      }
    };

    // Check if Google Maps is already loaded
    if (window.google) {
      initMap();
    } else {
      // Wait for Google Maps to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkGoogle);
    }
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsGettingCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setSelectedLocation(newLocation);

        if (map) {
          map.setCenter(newLocation);
          if (marker) {
            marker.setPosition(newLocation);
          }
        }

        getAddressFromCoordinates(newLocation.lat, newLocation.lng);
        setIsGettingCurrentLocation(false);
      },
      (error) => {
        toast({
          title: 'Error',
          description: `Error getting location: ${error.message}`,
          status: 'error',
          duration: 5000,
        });
        setIsGettingCurrentLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSelectedAddress(data.results[0].formatted_address);
      } else {
        setSelectedAddress('Location selected');
      }
    } catch (error) {
      setSelectedAddress('Location selected');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmLocation = () => {
    const locationData = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      address: selectedAddress,
      address1: selectedAddress,
      address2: '',
    };

    onLocationSelected(locationData);
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="white"
      zIndex={9999}
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
      >
        <Text fontSize="xl" fontWeight="bold">
          Select Delivery Location
        </Text>
        <Box display="flex" gap={2}>
          {isGettingCurrentLocation ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Button
              size="sm"
              leftIcon={<span>📍</span>}
              onClick={getCurrentLocation}
              colorScheme="green"
            >
              Use Current Location
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                window.history.back();
              }
            }}
            variant="outline"
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Map */}
      <Box flex={1} position="relative">
        <Box
          ref={mapRef}
          width="100%"
          height="100%"
          style={{ minHeight: '400px' }}
        />
        {/* Center indicator */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          pointerEvents="none"
          fontSize="3xl"
          color="red"
        >
          📍
        </Box>
      </Box>

      {/* Address display and confirm button */}
      <Box
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
        bg="white"
        boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      >
        {isLoading ? (
          <Box textAlign="center" py={4}>
            <Loader className="animate-spin mx-auto" />
          </Box>
        ) : (
          <Box
            p={3}
            bg="gray.50"
            borderRadius="md"
            mb={4}
          >
            <Text fontSize="xs" color="gray.600" fontWeight="bold" mb={1}>
              Selected Address:
            </Text>
            <Text fontSize="sm" color="black">
              {selectedAddress || 'Tap on map to select location'}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={2}>
              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </Text>
          </Box>
        )}

        <Button
          width="100%"
          colorScheme="green"
          size="lg"
          onClick={confirmLocation}
          isDisabled={!selectedAddress}
        >
          Confirm Location
        </Button>
      </Box>
    </Box>
  );
};

export default LocationPicker;
