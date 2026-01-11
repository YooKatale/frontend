"use client";

import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Select,
  Spacer,
  Text,
  Textarea,
  Input,
  useToast,
} from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LocationPicker from "@components/LocationPicker";
// import React from 'react'

const TabOne = ({ updateTabIndex, fetchData }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const [deliveryAddress, setDeliveryAddress] = useState({
    address1: "",
    address2: "",
    latitude: null,
    longitude: null,
  });
  
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [specialRequests, setSpecialRequests] = useState({
    peeledFood: false,
    moreInfo: "",
  });

  const [personalInfo, setPersonalInfo] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    gender: "",
  });

  const chakraToast = useToast();

  const handleDeliveryDataChange = (e) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  const handleLocationSelected = (locationData) => {
    setDeliveryAddress({
      ...deliveryAddress,
      address1: locationData.address || locationData.address1 || deliveryAddress.address1,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });
    setShowLocationPicker(false);
  };

  // Load Google Maps script
  useEffect(() => {
    if (showLocationPicker && !window.google) {
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
      if (!apiKey) {
        console.warn('Google Maps API key is not set. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
        return;
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        // Script loaded
      };
      
      return () => {
        // Cleanup if needed
      };
    }
  }, [showLocationPicker]);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleSpecialRequestDataChange = (e) => {
    e.target.name == "peeledFood"
      ? setSpecialRequests({
          ...specialRequests,
          [e.target.name]: e.target.checked,
        })
      : setSpecialRequests({
          ...specialRequests,
          [e.target.name]: e.target.value,
        });
  };

  const handleTabOneData = () => {
    if (deliveryAddress.address1 == "" && deliveryAddress.address2 == "")
      return chakraToast({
        title: "Error",
        description: "Please enter a delivery address",
        status: "error",
        duration: 5000,
        isClosable: false,
      });

    fetchData({ deliveryAddress, specialRequests });
    updateTabIndex(1);
  };

  return (
    <>
      <Box>
        <Box>
          {!userInfo ? (
            <>
              <Box>
                <Heading as={"h3"} size={"md"}>
                  Personal Details
                </Heading>
              </Box>
              <Box padding={"1rem 0"}>
                <Grid
                  gridTemplateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    xl: "repeat(3, 1fr)",
                  }}
                  gridGap={"1rem"}
                >
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="firstname">Firstname</FormLabel>
                      <Input
                        type="text"
                        id="firstname"
                        placeholder="firstname is required"
                        name="firstname"
                        value={personalInfo.firstname}
                        onChange={handlePersonalInfoChange}
                      />
                    </FormControl>
                  </Box>
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="lastname">Lastname</FormLabel>
                      <Input
                        type="text"
                        id="lastname"
                        placeholder="lastname is required"
                        name="lastname"
                        value={personalInfo.lastname}
                        onChange={handlePersonalInfoChange}
                      />
                    </FormControl>
                  </Box>
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <Input
                        type="text"
                        placeholder="Include country code [+256.....]"
                        name="phone"
                        id="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                      />
                    </FormControl>
                  </Box>
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="gender">Gender</FormLabel>
                      <Select
                        placeholder="Select gender"
                        name="gender"
                        id="gender"
                        value={personalInfo.gender}
                        onChange={handlePersonalInfoChange}
                      >
                        <option value="">Rather not say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        type="text"
                        id={`email${Math.random(0,10000)}`}
                        placeholder="email is required"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              </Box>
            </>
          ) : (
            ""
          )}
        </Box>

        <Box>
          <Heading as={"h3"} size={"md"}>
            Delivery Details
          </Heading>
        </Box>

        <Box padding={"1rem 0"}>
          <Box mb={4}>
            <ButtonComponent
              type="button"
              text="📍 Select Location on Map"
              onClick={() => setShowLocationPicker(true)}
              style={{ backgroundColor: '#185F2D', color: 'white', width: '100%' }}
            />
          </Box>
          {deliveryAddress.latitude && deliveryAddress.longitude && (
            <Box
              p={3}
              mb={4}
              bg="green.50"
              borderRadius="md"
              border="1px solid"
              borderColor="green.200"
            >
              <Text fontSize="xs" color="green.600" fontWeight="bold" mb={1}>
                ✓ Location Selected
              </Text>
              <Text fontSize="xs" color="green.700">
                Coordinates: {deliveryAddress.latitude.toFixed(6)}, {deliveryAddress.longitude.toFixed(6)}
              </Text>
            </Box>
          )}
          <Grid
            gridTemplateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(1, 1fr)",
              xl: "repeat(2, 1fr)",
            }}
            gridGap={"1rem"}
          >
            <FormControl>
              <FormLabel htmlFor="address1">Address 1</FormLabel>
              <Textarea
                name="address1"
                id="address1"
                placeholder="Delivery address or select on map"
                value={deliveryAddress.address1}
                onChange={handleDeliveryDataChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address2">Address 2</FormLabel>
              <Textarea
                name="address2"
                id="address2"
                placeholder="Delivery address (optional)"
                value={deliveryAddress.address2}
                onChange={handleDeliveryDataChange}
              />
            </FormControl>
          </Grid>
        </Box>
        
        {showLocationPicker && (
          <LocationPicker
            onLocationSelected={handleLocationSelected}
            onClose={() => setShowLocationPicker(false)}
            initialAddress={deliveryAddress.address1}
            initialLocation={
              deliveryAddress.latitude && deliveryAddress.longitude
                ? { lat: deliveryAddress.latitude, lng: deliveryAddress.longitude }
                : null
            }
          />
        )}
        <Box padding={"0.5rem 0"}>
          <Box>
            <Heading as={"h3"} size={"md"}>
              Choose where applicable
            </Heading>
          </Box>
          <Box padding={"1rem 0"}>
            <Grid
              gridTemplateColumns={{
                base: "repeat(3, 1fr)",
                md: "repeat(3, 1fr)",
                xl: "repeat(5, 1fr)",
              }}
              gridGap={"1rem"}
            >
              <Box padding={"0.5rem 0"}>
                <input
                  type="checkbox"
                  name="peeledFood"
                  value={specialRequests.peeledFood}
                  onChange={handleSpecialRequestDataChange}
                />{" "}
                Peel Food
              </Box>
            </Grid>
            <Box padding={"0.5rem 0"}>
              <FormControl>
                <FormLabel htmlFor="moreInfo">Any other information</FormLabel>
                <Textarea
                  name="moreInfo"
                  id="moreInfo"
                  placeholder=""
                  value={specialRequests.moreInfo}
                  onChange={handleSpecialRequestDataChange}
                />
              </FormControl>
            </Box>
          </Box>
        </Box>
        <Box padding={"0.5rem 0"}>
          <Flex>
            <Box></Box>
            <Spacer />
            <Box
              onClick={() => {
                handleTabOneData();
              }}
            >
              <ButtonComponent type={"button"} text={"Continue to Checkout"} />
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default TabOne;
