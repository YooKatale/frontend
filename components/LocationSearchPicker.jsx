"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  useToast,
  IconButton,
  List,
  ListItem,
  Avatar,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Search, MapPin, X, Navigation } from 'lucide-react';

/**
 * Glovo-style Location Search Picker - Full Page Modal
 * Features:
 * - Full-page modal covering the whole screen (like Glovo)
 * - Search-based location entry (like Glovo)
 * - Google Places Autocomplete
 * - Current location button
 * - Recent locations
 * - Beautiful, professional UI matching Glovo design
 * - YooKatale theme colors (#185F2D)
 */
export default function LocationSearchPicker({
  onLocationSelected,
  initialAddress,
  onClose,
  required = true,
}) {
  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const searchInputRef = useRef(null);
  const toast = useToast();

  // Load Google Maps script if not already loaded
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      // Google Maps already loaded
      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      }
      if (!placesServiceRef.current) {
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );
      }
    } else {
      // Load Google Maps script
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
      if (!apiKey) {
        console.warn('Google Maps API key is not set');
        return;
      }

      // Check if script already exists
      if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        // Script exists, wait for it to load
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkGoogle);
            if (!autocompleteServiceRef.current) {
              autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
            }
            if (!placesServiceRef.current) {
              placesServiceRef.current = new window.google.maps.places.PlacesService(
                document.createElement('div')
              );
            }
          }
        }, 100);

        return () => clearInterval(checkGoogle);
      }

      // Create and load script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          if (!autocompleteServiceRef.current) {
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          }
          if (!placesServiceRef.current) {
            placesServiceRef.current = new window.google.maps.places.PlacesService(
              document.createElement('div')
            );
          }
        }
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup if needed
      };
    }

    // Load recent locations from localStorage
    const saved = localStorage.getItem('yookatale_recent_locations');
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent locations:', e);
      }
    }
  }, []);

  // Search for places as user types (like Glovo)
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    // Wait for Google Maps to be ready
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    if (!autocompleteServiceRef.current) {
      try {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      } catch (e) {
        console.error('Error creating AutocompleteService:', e);
        return;
      }
    }

    const request = {
      input: searchQuery,
      types: ['address'],
      componentRestrictions: { country: 'ug' }, // Uganda
    };

    autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  }, [searchQuery]);

  // Get place details from place_id
  const getPlaceDetails = (placeId) => {
    if (!placesServiceRef.current) return;

    setIsLoading(true);
    const request = {
      placeId,
      fields: ['geometry', 'formatted_address', 'name', 'address_components'],
    };

    placesServiceRef.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || place.name,
          address1: place.formatted_address || place.name,
          address2: '',
        };

        setSelectedLocation(location);
        setSearchQuery(location.address);
        setSuggestions([]);

        // Save to recent locations
        const updated = [location, ...recentLocations.filter(l => l.address !== location.address)].slice(0, 5);
        setRecentLocations(updated);
        localStorage.setItem('yookatale_recent_locations', JSON.stringify(updated));

        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to get location details',
          status: 'error',
          duration: 3000,
        });
      }
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsGettingCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
          if (!apiKey) {
            throw new Error('Google Maps API key not set');
          }

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: data.results[0].formatted_address,
              address1: data.results[0].formatted_address,
              address2: '',
            };

            setSelectedLocation(location);
            setSearchQuery(location.address);

            // Save to recent locations
            const updated = [location, ...recentLocations.filter(l => l.address !== location.address)].slice(0, 5);
            setRecentLocations(updated);
            localStorage.setItem('yookatale_recent_locations', JSON.stringify(updated));
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to get address from location',
            status: 'error',
            duration: 3000,
          });
        } finally {
          setIsGettingCurrentLocation(false);
        }
      },
      (error) => {
        toast({
          title: 'Error',
          description: 'Failed to get your location',
          status: 'error',
          duration: 3000,
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

  const confirmLocation = () => {
    if (!selectedLocation) {
      toast({
        title: 'Please select a location',
        description: 'Search and select a delivery location',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    onLocationSelected(selectedLocation);
    if (onClose) onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={required ? undefined : (onClose || (() => {}))}
      size="full"
      closeOnOverlayClick={!required}
      closeOnEsc={!required}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent
        m={0}
        maxW="100vw"
        maxH="100vh"
        h="100vh"
        borderRadius={0}
        bg="white"
      >
        <ModalCloseButton
          size="lg"
          borderRadius="full"
          bg="white"
          color="gray.600"
          _hover={{ bg: 'gray.100' }}
          top={4}
          right={4}
          zIndex={10000}
          display={required ? 'none' : 'block'}
        />

        <ModalBody p={0} overflow="hidden">
          <Box
            display="flex"
            flexDirection="column"
            h="100vh"
            bg="white"
          >
            {/* Header - Glovo Style with YooKatale Colors */}
            <Box
              p={6}
              borderBottom="1px solid"
              borderColor="gray.200"
              bg="white"
              boxShadow="0 2px 8px rgba(0,0,0,0.08)"
            >
              <VStack spacing={4} align="stretch">
                {/* Title */}
                <Text
                  fontSize="28px"
                  fontWeight="700"
                  color="gray.800"
                  textAlign="center"
                  letterSpacing="-0.5px"
                >
                  {required ? 'Where shall we deliver to?' : 'Select Delivery Location'}
                </Text>

                {/* Search Input - Glovo Style */}
                <Box position="relative">
                  <Input
                    ref={searchInputRef}
                    placeholder="Search address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    pl={14}
                    pr={12}
                    h="56px"
                    fontSize="16px"
                    borderColor="gray.300"
                    bg="gray.50"
                    _focus={{
                      borderColor: '#185F2D',
                      boxShadow: '0 0 0 3px rgba(24, 95, 45, 0.1)',
                      bg: 'white',
                    }}
                    _hover={{
                      borderColor: 'gray.400',
                      bg: 'white',
                    }}
                    autoFocus
                  />
                  <Box
                    position="absolute"
                    left={5}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    pointerEvents="none"
                  >
                    <Search size={24} />
                  </Box>
                  {searchQuery && (
                    <IconButton
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      icon={<X size={18} />}
                      onClick={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        setSelectedLocation(null);
                      }}
                      variant="ghost"
                      size="sm"
                      aria-label="Clear"
                      borderRadius="full"
                      _hover={{ bg: 'gray.100' }}
                    />
                  )}
                </Box>

                {/* Current Location Button - Glovo Style */}
                <Button
                  leftIcon={isGettingCurrentLocation ? (
                    <Box
                      className="animate-spin"
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #e0e0e0',
                        borderTop: '2px solid #185F2D',
                        borderRadius: '50%'
                      }}
                    />
                  ) : (
                    <Navigation size={20} />
                  )}
                  onClick={getCurrentLocation}
                  variant="solid"
                  bg="#185F2D"
                  color="white"
                  size="lg"
                  width="100%"
                  borderRadius="xl"
                  h="52px"
                  fontSize="16px"
                  fontWeight="600"
                  _hover={{
                    bg: '#154924',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(24, 95, 45, 0.3)',
                  }}
                  _active={{
                    bg: '#123d1f',
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                  isDisabled={isGettingCurrentLocation}
                >
                  {isGettingCurrentLocation ? 'Getting location...' : 'Use current location'}
                </Button>
              </VStack>
            </Box>

            {/* Suggestions / Recent Locations */}
            <Box flex={1} overflowY="auto" bg="gray.50">
              {isLoading && (
                <Box textAlign="center" py={12}>
                  <Box
                    display="inline-block"
                    w="40px"
                    h="40px"
                    border="4px solid #e0e0e0"
                    borderTop="4px solid #185F2D"
                    borderRadius="50%"
                    className="animate-spin"
                    mb={4}
                  />
                  <Text color="gray.600" fontSize="14px">Loading location details...</Text>
                </Box>
              )}

              {/* Suggestions */}
              {!isLoading && suggestions.length > 0 && (
                <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
                  <Text
                    px={6}
                    py={3}
                    fontSize="11px"
                    fontWeight="700"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                  >
                    Suggestions
                  </Text>
                  <List spacing={0}>
                    {suggestions.map((prediction, index) => (
                      <ListItem
                        key={prediction.place_id}
                        px={6}
                        py={4}
                        borderBottom={index < suggestions.length - 1 ? "1px solid" : "none"}
                        borderColor="gray.100"
                        cursor="pointer"
                        _hover={{ bg: '#185F2D08' }}
                        onClick={() => getPlaceDetails(prediction.place_id)}
                        transition="all 0.2s"
                      >
                        <HStack spacing={4} align="start">
                          <Box
                            mt={1}
                            p={2}
                            bg="#185F2D"
                            borderRadius="lg"
                            color="white"
                          >
                            <MapPin size={18} />
                          </Box>
                          <VStack align="start" spacing={1} flex={1}>
                            <Text fontWeight="600" fontSize="15px" color="gray.800">
                              {prediction.structured_formatting.main_text}
                            </Text>
                            <Text fontSize="13px" color="gray.500">
                              {prediction.structured_formatting.secondary_text}
                            </Text>
                          </VStack>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Recent Locations */}
              {!isLoading && suggestions.length === 0 && recentLocations.length > 0 && (
                <Box bg="white">
                  <Text
                    px={6}
                    py={3}
                    fontSize="11px"
                    fontWeight="700"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                  >
                    Recent Locations
                  </Text>
                  <List spacing={0}>
                    {recentLocations.map((location, index) => (
                      <ListItem
                        key={index}
                        px={6}
                        py={4}
                        borderBottom={index < recentLocations.length - 1 ? "1px solid" : "none"}
                        borderColor="gray.100"
                        cursor="pointer"
                        _hover={{ bg: '#185F2D08' }}
                        onClick={() => {
                          const locData = {
                            lat: location.lat,
                            lng: location.lng,
                            address: location.address,
                            address1: location.address,
                            address2: '',
                          };
                          setSelectedLocation(locData);
                          setSearchQuery(location.address);
                          onLocationSelected(locData);
                          if (onClose) onClose();
                        }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={4} align="center">
                          <Avatar
                            size="md"
                            bg="#185F2D"
                            icon={<MapPin size={20} color="white" />}
                          />
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontWeight="600" fontSize="15px" color="gray.800" noOfLines={1}>
                              {location.address}
                            </Text>
                            <Badge
                              colorScheme="green"
                              fontSize="10px"
                              mt={1}
                              px={2}
                              py={0.5}
                              borderRadius="md"
                            >
                              Tap to use
                            </Badge>
                          </VStack>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Empty State */}
              {!isLoading && suggestions.length === 0 && recentLocations.length === 0 && (
                <Box textAlign="center" py={16} px={6}>
                  <Box
                    display="inline-flex"
                    p={6}
                    bg="#185F2D" + '10'
                    borderRadius="full"
                    mb={6}
                  >
                    <MapPin size={56} color="#185F2D" />
                  </Box>
                  <Text fontSize="20px" fontWeight="700" mb={2} color="gray.800">
                    {required ? 'Where shall we deliver to?' : 'Search for a location'}
                  </Text>
                  <Text fontSize="15px" color="gray.500" maxW="400px" mx="auto">
                    {required
                      ? 'Enter your delivery address to continue shopping'
                      : 'Type an address or use your current location'}
                  </Text>
                </Box>
              )}
            </Box>

            {/* Confirm Button - Fixed at Bottom */}
            {selectedLocation && (
              <Box
                p={6}
                borderTop="1px solid"
                borderColor="gray.200"
                bg="white"
                boxShadow="0 -4px 12px rgba(0,0,0,0.08)"
              >
                <VStack spacing={4} align="stretch">
                  <Box
                    p={4}
                    bg="#185F2D10"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="#185F2D"
                  >
                    <HStack spacing={3} mb={2}>
                      <Box
                        p={1.5}
                        bg="#185F2D"
                        borderRadius="md"
                        color="white"
                      >
                        <MapPin size={16} />
                      </Box>
                      <Text fontSize="11px" fontWeight="700" color="#185F2D" textTransform="uppercase">
                        Selected Location
                      </Text>
                    </HStack>
                    <Text fontSize="14px" color="gray.700" noOfLines={2} fontWeight="500">
                      {selectedLocation.address}
                    </Text>
                  </Box>
                  <Button
                    width="100%"
                    bg="#185F2D"
                    color="white"
                    size="lg"
                    height="56px"
                    fontSize="18px"
                    fontWeight="700"
                    borderRadius="xl"
                    onClick={confirmLocation}
                    _hover={{
                      bg: '#154924',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(24, 95, 45, 0.4)',
                    }}
                    _active={{
                      bg: '#123d1f',
                      transform: 'translateY(0)',
                    }}
                    transition="all 0.2s"
                    boxShadow="0 4px 12px rgba(24, 95, 45, 0.3)"
                  >
                    Confirm Location
                  </Button>
                </VStack>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
