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
} from '@chakra-ui/react';
import { Search, MapPin, X, Navigation } from 'lucide-react';

/**
 * Glovo-style Location Search Picker
 * Features:
 * - Search-based location entry (like Glovo)
 * - Google Places Autocomplete
 * - Current location button
 * - Recent locations
 * - Required on app/web access
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

    if (!autocompleteServiceRef.current) return;

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
      {/* Header - Glovo Style */}
      <Box
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        bg="white"
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        <HStack spacing={3} mb={3} align="center">
          {onClose && (
            <IconButton
              icon={<X size={20} />}
              onClick={onClose}
              variant="ghost"
              size="sm"
              aria-label="Close"
              borderRadius="full"
              _hover={{ bg: 'gray.100' }}
            />
          )}
          <Text fontSize="lg" fontWeight="700" flex={1} color="gray.800">
            {required ? 'Where should we deliver?' : 'Select Delivery Location'}
          </Text>
        </HStack>

        {/* Search Input - Glovo Style */}
        <Box position="relative">
          <Input
            ref={searchInputRef}
            placeholder="Search for an address or place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
            borderRadius="xl"
            pl={12}
            pr={10}
            h="52px"
            fontSize="16px"
            borderColor="gray.300"
            bg="gray.50"
            _focus={{
              borderColor: '#185F2D',
              boxShadow: '0 0 0 2px rgba(24, 95, 45, 0.1)',
              bg: 'white',
            }}
            _hover={{
              borderColor: 'gray.400',
            }}
          />
          <Box
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            pointerEvents="none"
          >
            <Search size={22} />
          </Box>
          {searchQuery && (
            <IconButton
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              icon={<X size={16} />}
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                setSelectedLocation(null);
              }}
              variant="ghost"
              size="sm"
              aria-label="Clear"
            />
          )}
        </Box>

        {/* Current Location Button - Glovo Style */}
        <Button
          mt={3}
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
          variant="outline"
          colorScheme="green"
          size="md"
          width="100%"
          borderRadius="xl"
          h="48px"
          fontSize="15px"
          fontWeight="600"
          borderColor="gray.300"
          _hover={{
            bg: 'green.50',
            borderColor: '#185F2D',
          }}
          isDisabled={isGettingCurrentLocation}
        >
          {isGettingCurrentLocation ? 'Getting location...' : 'Use current location'}
        </Button>
      </Box>

      {/* Suggestions / Recent Locations */}
      <Box flex={1} overflowY="auto" bg="gray.50">
        {isLoading && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">Loading location details...</Text>
          </Box>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
            <Text px={4} py={2} fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
              Suggestions
            </Text>
            <List spacing={0}>
              {suggestions.map((prediction) => (
                <ListItem
                  key={prediction.place_id}
                  px={4}
                  py={3}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => getPlaceDetails(prediction.place_id)}
                >
                  <HStack spacing={3}>
                    <MapPin size={20} color="gray" />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="600" fontSize="sm">
                        {prediction.structured_formatting.main_text}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
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
        {suggestions.length === 0 && recentLocations.length > 0 && (
          <Box bg="white">
            <Text px={4} py={2} fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
              Recent Locations
            </Text>
            <List spacing={0}>
              {recentLocations.map((location, index) => (
                <ListItem
                  key={index}
                  px={4}
                  py={3}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
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
                >
                  <HStack spacing={3}>
                    <Avatar size="sm" bg="green.100" icon={<MapPin size={16} color="green" />} />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="600" fontSize="sm" noOfLines={1}>
                        {location.address}
                      </Text>
                      <Badge colorScheme="green" fontSize="xs" mt={1}>
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
        {suggestions.length === 0 && recentLocations.length === 0 && !isLoading && (
          <Box textAlign="center" py={12} px={4}>
            <MapPin size={48} color="gray" style={{ margin: '0 auto 16px' }} />
            <Text fontSize="lg" fontWeight="600" mb={2} color="gray.700">
              {required ? 'Where should we deliver?' : 'Search for a location'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {required
                ? 'Enter your delivery address to continue'
                : 'Type an address or use your current location'}
            </Text>
          </Box>
        )}
      </Box>

      {/* Confirm Button */}
      {selectedLocation && (
        <Box
          p={4}
          borderTop="1px solid"
          borderColor="gray.200"
          bg="white"
          boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
        >
          <VStack spacing={3} align="stretch">
            <Box p={3} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
              <HStack spacing={2} mb={1}>
                <MapPin size={16} color="green" />
                <Text fontSize="xs" fontWeight="bold" color="green.700">
                  Selected Location
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.700" noOfLines={2}>
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
              isDisabled={!selectedLocation}
              _hover={{
                bg: '#154924',
              }}
              _active={{
                bg: '#123d1f',
              }}
              _disabled={{
                bg: 'gray.300',
                cursor: 'not-allowed',
              }}
              boxShadow="0 4px 12px rgba(24, 95, 45, 0.3)"
            >
              Confirm Location
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
