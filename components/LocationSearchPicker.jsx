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
 * Location Search Picker - Centered Modal Design
 * Features:
 * - Centered modal dialog with backdrop
 * - Search-based location entry with Google Places
 * - Current location button
 * - Recent locations
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
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const searchInputRef = useRef(null);
  const initializationAttemptsRef = useRef(0);
  const toast = useToast();

  // Initialize services helper
  const initializeServices = () => {
    try {
      if (window.google?.maps?.places?.AutocompleteService && window.google?.maps?.places?.PlacesService) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );
        console.log('Google Maps Places API services initialized successfully');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error initializing Google Maps services:', e);
      return false;
    }
  };

  // Wait for Places API to be available
  const waitForPlacesAPI = () => {
    return new Promise((resolve) => {
      if (initializeServices()) {
        resolve(true);
        return;
      }

      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max
      const checkInterval = setInterval(() => {
        attempts++;
        initializationAttemptsRef.current = attempts;
        
        if (initializeServices()) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('Timeout: Places API not available after', attempts, 'attempts');
          resolve(false);
        }
      }, 100);

      // Also try on next tick
      setTimeout(() => {
        if (initializeServices()) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 0);
    });
  };

  // Load Google Maps script with async loading
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
      console.error('Google Maps API key is not set');
      setMapsError(true);
      toast({
        title: 'Configuration Error',
        description: 'Google Maps API key is missing. Please contact support.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log('Google Maps already loaded');
      waitForPlacesAPI().then((success) => {
        if (success) {
          setMapsLoaded(true);
          setMapsError(false);
        } else {
          setMapsError(true);
        }
      });
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      console.log('Google Maps script exists, waiting for Places API...');
      // Script exists, wait for it to load
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          waitForPlacesAPI().then((success) => {
            if (success) {
              setMapsLoaded(true);
              setMapsError(false);
            } else {
              setMapsError(true);
            }
          });
        }
      }, 100);

      // Also load recent locations
      try {
        const saved = localStorage.getItem('yookatale_recent_locations');
        if (saved) {
          setRecentLocations(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Error loading recent locations:', e);
      }

      return () => clearInterval(checkGoogle);
    }

    // Create and load script with async attribute
    console.log('Loading Google Maps script...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onload = async () => {
      console.log('Google Maps script loaded, waiting for Places API...');
      // Wait a bit for Places API to be available
      const success = await waitForPlacesAPI();
      if (success) {
        console.log('Google Maps Places API ready');
        setMapsLoaded(true);
        setMapsError(false);
      } else {
        console.error('Google Maps loaded but Places API not available');
        setMapsError(true);
        toast({
          title: 'Error',
          description: 'Location search is temporarily unavailable. You can still use "Use current location" or enter address manually.',
          status: 'warning',
          duration: 5000,
        });
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      setMapsError(true);
      toast({
        title: 'Error',
        description: 'Failed to load Google Maps. Please refresh the page.',
        status: 'error',
        duration: 5000,
      });
    };
    
    document.head.appendChild(script);

    // Load recent locations from localStorage
    try {
      const saved = localStorage.getItem('yookatale_recent_locations');
      if (saved) {
        setRecentLocations(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recent locations:', e);
    }
  }, []);

  // Search for places as user types
  useEffect(() => {
    if (!mapsLoaded || !autocompleteServiceRef.current || mapsError) {
      if (searchQuery && searchQuery.length >= 2 && !mapsLoaded && !mapsError) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
      return;
    }

    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (!autocompleteServiceRef.current) {
        setIsLoading(false);
        return;
      }

      const request = {
        input: searchQuery,
        types: ['address'],
        componentRestrictions: { country: 'ug' },
      };

      try {
        autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setSuggestions([]);
          } else {
            console.warn('Autocomplete error:', status);
            setSuggestions([]);
          }
        });
      } catch (error) {
        console.error('Error fetching place predictions:', error);
        setIsLoading(false);
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [searchQuery, mapsLoaded, mapsError]);

  // Get place details from place_id
  const getPlaceDetails = (placeId) => {
    if (!placesServiceRef.current) {
      toast({
        title: 'Error',
        description: 'Location services not ready. Please try again.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    const request = {
      placeId,
      fields: ['geometry', 'formatted_address', 'name', 'address_components'],
    };

    try {
      placesServiceRef.current.getDetails(request, (place, status) => {
        setIsLoading(false);
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
        } else {
          toast({
            title: 'Error',
            description: 'Failed to get location details. Please try again.',
            status: 'error',
            duration: 3000,
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Error getting place details:', error);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getCurrentLocation = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser',
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
          
          if (!response.ok) {
            throw new Error('Geocoding request failed');
          }

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

            toast({
              title: 'Success',
              description: 'Location detected successfully',
              status: 'success',
              duration: 2000,
            });
          } else {
            throw new Error('No results found');
          }
        } catch (error) {
          console.error('Error getting address:', error);
          toast({
            title: 'Error',
            description: 'Failed to get address from location. Please try searching manually.',
            status: 'error',
            duration: 4000,
          });
        } finally {
          setIsGettingCurrentLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get your location. ';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += 'Please allow location access in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage += 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage += 'Location request timed out.';
        } else {
          errorMessage += 'Please try searching manually.';
        }
        toast({
          title: 'Location Error',
          description: errorMessage,
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

  const confirmLocation = () => {
    if (!selectedLocation) {
      toast({
        title: 'Please select a location',
        description: 'Search and select a delivery location first',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    onLocationSelected(selectedLocation);
    if (onClose) onClose();
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    if (!required && onClose) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={required ? undefined : handleClose}
      size="md"
      closeOnOverlayClick={!required}
      closeOnEsc={!required}
      isCentered
      motionPreset="scale"
      blockScrollOnMount={false}
      trapFocus={true}
    >
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" onClick={required ? undefined : handleClose} />
      <ModalContent
        maxW="480px"
        w="90%"
        maxH="85vh"
        borderRadius="2xl"
        bg="white"
        boxShadow="0 20px 60px rgba(0,0,0,0.3)"
        overflow="hidden"
        zIndex={9999}
        position="relative"
      >
        <ModalCloseButton
          size="md"
          borderRadius="full"
          bg="white"
          color="gray.600"
          _hover={{ bg: 'gray.100', color: 'gray.800' }}
          top={3}
          right={3}
          zIndex={10001}
          onClick={handleClose}
          aria-label="Close location picker"
          display={required ? 'none' : 'block'}
        />

        <ModalBody p={0} overflow="hidden" onClick={(e) => e.stopPropagation()}>
          <Box display="flex" flexDirection="column" maxH="90vh">
            {/* Header */}
            <Box
              p={5}
              borderBottom="1px solid"
              borderColor="gray.200"
              bg="white"
              position="relative"
              zIndex={1}
            >
              <VStack spacing={3} align="stretch">
                {/* Title */}
                <Text
                  fontSize="20px"
                  fontWeight="700"
                  color="gray.800"
                  textAlign="center"
                  letterSpacing="-0.5px"
                  px={2}
                >
                  {required ? 'Where shall we deliver to?' : 'Select Delivery Location'}
                </Text>

                {/* Search Input */}
                <Box position="relative" zIndex={1}>
                  <Input
                    id="location-search-input"
                    name="location-search"
                    ref={searchInputRef}
                    placeholder="Search address"
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && suggestions.length > 0) {
                        e.preventDefault();
                        getPlaceDetails(suggestions[0].place_id);
                      }
                    }}
                    size="md"
                    borderRadius="xl"
                    pl={12}
                    pr={10}
                    h="48px"
                    fontSize="15px"
                    borderColor={mapsError ? 'red.300' : 'gray.300'}
                    bg="gray.50"
                    autoComplete="address-line1"
                    _focus={{
                      borderColor: mapsError ? 'red.400' : '#185F2D',
                      boxShadow: mapsError ? '0 0 0 3px rgba(229, 62, 62, 0.1)' : '0 0 0 3px rgba(24, 95, 45, 0.1)',
                      bg: 'white',
                    }}
                    _hover={{
                      borderColor: mapsError ? 'red.400' : 'gray.400',
                      bg: 'white',
                    }}
                    autoFocus
                    disabled={false}
                    cursor="text"
                  />
                  <Box
                    position="absolute"
                    left={5}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                    pointerEvents="none"
                    zIndex={2}
                  >
                    <Search size={20} />
                  </Box>
                  {searchQuery && (
                    <IconButton
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      icon={<X size={18} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                        setSuggestions([]);
                        setSelectedLocation(null);
                        searchInputRef.current?.focus();
                      }}
                      variant="ghost"
                      size="sm"
                      aria-label="Clear search"
                      borderRadius="full"
                      _hover={{ bg: 'gray.100' }}
                      zIndex={2}
                    />
                  )}
                  {!mapsLoaded && !mapsError && (
                    <Box
                      position="absolute"
                      right={12}
                      top="50%"
                      transform="translateY(-50%)"
                      fontSize="11px"
                      color="gray.400"
                      pointerEvents="none"
                      zIndex={2}
                    >
                      Loading...
                    </Box>
                  )}
                  {mapsError && (
                    <Box
                      position="absolute"
                      right={12}
                      top="50%"
                      transform="translateY(-50%)"
                      fontSize="11px"
                      color="orange.500"
                      pointerEvents="none"
                      zIndex={2}
                    >
                      Use current location
                    </Box>
                  )}
                </Box>

                {/* Current Location Button */}
                <Button
                  id="use-current-location-button"
                  name="use-current-location"
                  type="button"
                  leftIcon={isGettingCurrentLocation ? (
                    <Box
                      className="animate-spin"
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid #e0e0e0',
                        borderTop: '2px solid #185F2D',
                        borderRadius: '50%'
                      }}
                    />
                  ) : (
                    <Navigation size={18} />
                  )}
                  onClick={getCurrentLocation}
                  variant="solid"
                  bg="#185F2D"
                  color="white"
                  size="md"
                  width="100%"
                  borderRadius="xl"
                  h="48px"
                  fontSize="15px"
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
                  cursor={isGettingCurrentLocation ? 'not-allowed' : 'pointer'}
                  zIndex={1}
                  position="relative"
                >
                  {isGettingCurrentLocation ? 'Getting location...' : 'Use current location'}
                </Button>
              </VStack>
            </Box>

            {/* Suggestions / Recent Locations */}
            <Box flex={1} overflowY="auto" bg="gray.50" maxH="350px" position="relative" zIndex={1}>
              {isLoading && suggestions.length === 0 && (
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
                  <Text color="gray.600" fontSize="14px">Searching locations...</Text>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          getPlaceDetails(prediction.place_id);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
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
                    bg="#185F2D10"
                    borderRadius="full"
                    mb={6}
                  >
                    <MapPin size={56} color="#185F2D" />
                  </Box>
                  <Text fontSize="20px" fontWeight="700" mb={2} color="gray.800">
                    {required ? 'Where shall we deliver to?' : 'Search for a location'}
                  </Text>
                  <Text fontSize="15px" color="gray.500" maxW="400px" mx="auto">
                    {mapsError 
                      ? 'Location search is unavailable. Please use "Use current location" button or select from recent locations.'
                      : required
                        ? 'Enter your delivery address to continue shopping'
                        : 'Type an address or use your current location'}
                  </Text>
                </Box>
              )}
            </Box>

            {/* Confirm Button - Fixed at Bottom */}
            {selectedLocation && (
              <Box
                p={4}
                borderTop="1px solid"
                borderColor="gray.200"
                bg="white"
                boxShadow="0 -4px 12px rgba(0,0,0,0.08)"
                position="relative"
                zIndex={1}
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
                    id="confirm-location-button"
                    name="confirm-location"
                    type="button"
                    width="100%"
                    bg="#185F2D"
                    color="white"
                    size="md"
                    height="48px"
                    fontSize="16px"
                    fontWeight="700"
                    borderRadius="xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmLocation();
                    }}
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
                    cursor="pointer"
                    zIndex={1}
                    position="relative"
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
