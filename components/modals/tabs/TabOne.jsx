"use client";

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Select,
  Text,
  Textarea,
  Input,
  Button,
  useToast,
  Icon,
  Checkbox,
  Switch,
  Badge,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LocationSearchPicker from "@components/LocationSearchPicker";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMapPin,
  FiPackage,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiNavigation,
  FiEdit2,
  FiCalendar,
  FiClock,
  FiMail,
  FiPhone,
  FiMap,
} from "react-icons/fi";
import { FaLeaf, FaRecycle, FaCarSide } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionGrid = motion(Grid);
const MotionFormControl = motion(FormControl);

const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const themeBg = `${ThemeColors.primaryColor}08`;
const themeBorder = `${ThemeColors.primaryColor}25`;

const TabOne = ({ updateTabIndex, fetchData }) => {
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const [isGuest, setIsGuest] = useState(!userInfo);
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);

  const {
    isOpen: showLocationPicker,
    onOpen: openLocationPicker,
    onClose: closeLocationPicker,
  } = useDisclosure();

  const [deliveryAddress, setDeliveryAddress] = useState({
    address1: "",
    address2: "",
    latitude: null,
    longitude: null,
    deliveryType: "standard",
    deliveryDate: "",
    deliveryTime: "",
  });

  const [specialRequests, setSpecialRequests] = useState({
    peeledFood: false,
    ecoPackaging: false,
    fragileItems: false,
    moreInfo: "",
  });

  const [personalInfo, setPersonalInfo] = useState({
    firstname: userInfo?.firstname || "",
    lastname: userInfo?.lastname || "",
    phone: userInfo?.phone || "",
    email: userInfo?.email || "",
    gender: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const chakraToast = useToast();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
      if (apiKey) {
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    validateForm();
  }, [deliveryAddress, personalInfo, isGuest]);

  const validateForm = () => {
    const errors = {};
    if (!isGuest) {
      if (!deliveryAddress.address1.trim()) errors.address1 = "Delivery address is required";
      if (!personalInfo.phone.trim()) errors.phone = "Phone number is required";
    } else {
      if (!personalInfo.firstname.trim()) errors.firstname = "First name is required";
      if (!personalInfo.lastname.trim()) errors.lastname = "Last name is required";
      if (!personalInfo.email.trim()) errors.email = "Email is required";
      if (!personalInfo.phone.trim()) errors.phone = "Phone number is required";
      if (!deliveryAddress.address1.trim()) errors.address1 = "Delivery address is required";
    }
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleDeliveryDataChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelected = (locationData) => {
    setDeliveryAddress({
      ...deliveryAddress,
      address1: locationData.address || deliveryAddress.address1,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });
    closeLocationPicker();
    chakraToast({
      title: "Location Saved",
      description: "Delivery location has been set",
      status: "success",
      duration: 3000,
      position: "bottom-right",
    });
  };

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleSpecialRequestChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSpecialRequests((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTabOneData = async () => {
    if (!isFormValid) {
      chakraToast({
        title: "Form Incomplete",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 4000,
        position: "top",
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fetchData({
      deliveryAddress,
      specialRequests,
      personalInfo: isGuest ? personalInfo : userInfo,
    });
    updateTabIndex(1);
    setIsLoading(false);
  };

  const deliveryOptions = [
    { value: "standard", label: "Standard Delivery", time: "1-2 days", price: "UGX 3,500", icon: FiPackage },
    { value: "express", label: "Express Delivery", time: "Same day", price: "UGX 7,500", icon: FaCarSide },
    { value: "scheduled", label: "Scheduled Delivery", time: "Choose date/time", price: "UGX 4,500", icon: FiCalendar },
  ];

  const handleStepClick = (step) => setActiveStep(step);

  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} maxW="100%">
      {/* Progress Steps */}
      <MotionFlex
        justify="space-between"
        align="center"
        mb={8}
        position="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[1, 2, 3].map((step) => (
          <MotionBox key={step} variants={formItemVariants} flex={1} position="relative">
            <Flex direction="column" align="center">
              <Box
                width="48px"
                height="48px"
                borderRadius="full"
                bg={activeStep >= step ? ThemeColors.primaryColor : "gray.100"}
                color={activeStep >= step ? "white" : "gray.400"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="lg"
                cursor="pointer"
                onClick={() => handleStepClick(step)}
                border="3px solid"
                borderColor={activeStep >= step ? ThemeColors.primaryColor : "gray.200"}
                transition="all 0.3s"
                _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
              >
                {step}
              </Box>
              <Text
                mt={2}
                fontSize="sm"
                fontWeight="semibold"
                color={activeStep >= step ? ThemeColors.primaryColor : "gray.500"}
                textAlign="center"
              >
                {step === 1 && "Your Details"}
                {step === 2 && "Delivery"}
                {step === 3 && "Review"}
              </Text>
            </Flex>
            {step < 3 && (
              <Box
                position="absolute"
                top="24px"
                left="calc(50% + 24px)"
                width="calc(100% - 48px)"
                height="2px"
                bg={activeStep > step ? ThemeColors.primaryColor : "gray.200"}
              />
            )}
          </MotionBox>
        ))}
      </MotionFlex>

      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        bg="white"
        borderRadius="2xl"
        shadow="xl"
        p={{ base: 4, md: 8 }}
        border="1px solid"
        borderColor="gray.100"
      >
        {/* Personal Information */}
        <Collapse in={activeStep === 1} animateOpacity>
          <MotionBox variants={formItemVariants} mb={8}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                p={3}
                borderRadius="xl"
                bg={themeBg}
                border="1px solid"
                borderColor={themeBorder}
              >
                <Icon as={FiUser} boxSize={6} color={ThemeColors.primaryColor} />
              </Box>
              <Box>
                <Heading as="h3" size="md" color="gray.800">
                  Personal Information
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {isGuest ? "Enter your details" : "Welcome back, " + userInfo?.firstname}
                </Text>
              </Box>
            </Flex>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              <MotionFormControl variants={formItemVariants}>
                <FormLabel display="flex" alignItems="center" gap={2} htmlFor="firstname" color="gray.700" fontWeight="medium">
                  <FiUser size={14} />
                  First Name
                  {formErrors.firstname && (
                    <Badge colorScheme="red" fontSize="xs">Required</Badge>
                  )}
                </FormLabel>
                <Input
                  type="text"
                  id="firstname"
                  placeholder="John"
                  name="firstname"
                  value={personalInfo.firstname}
                  onChange={handlePersonalInfoChange}
                  isInvalid={!!formErrors.firstname}
                  variant="filled"
                  borderRadius="lg"
                  _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                />
              </MotionFormControl>

              <MotionFormControl variants={formItemVariants}>
                <FormLabel display="flex" alignItems="center" gap={2} htmlFor="lastname" color="gray.700" fontWeight="medium">
                  <FiUser size={14} />
                  Last Name
                  {formErrors.lastname && (
                    <Badge colorScheme="red" fontSize="xs">Required</Badge>
                  )}
                </FormLabel>
                <Input
                  type="text"
                  id="lastname"
                  placeholder="Doe"
                  name="lastname"
                  value={personalInfo.lastname}
                  onChange={handlePersonalInfoChange}
                  isInvalid={!!formErrors.lastname}
                  variant="filled"
                  borderRadius="lg"
                  _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                />
              </MotionFormControl>

              <MotionFormControl variants={formItemVariants}>
                <FormLabel display="flex" alignItems="center" gap={2} htmlFor="phone" color="gray.700" fontWeight="medium">
                  <FiPhone size={14} />
                  Phone Number
                  {formErrors.phone && (
                    <Badge colorScheme="red" fontSize="xs">Required</Badge>
                  )}
                </FormLabel>
                <Input
                  type="tel"
                  placeholder="+256 XXX XXX XXX"
                  name="phone"
                  id="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  isInvalid={!!formErrors.phone}
                  variant="filled"
                  borderRadius="lg"
                  _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                />
              </MotionFormControl>

              <MotionFormControl variants={formItemVariants}>
                <FormLabel display="flex" alignItems="center" gap={2} htmlFor="email" color="gray.700" fontWeight="medium">
                  <FiMail size={14} />
                  Email Address
                  {formErrors.email && (
                    <Badge colorScheme="red" fontSize="xs">Required</Badge>
                  )}
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  isInvalid={!!formErrors.email}
                  variant="filled"
                  borderRadius="lg"
                  _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
                />
              </MotionFormControl>
            </Grid>
          </MotionBox>
        </Collapse>

        {/* Delivery Information */}
        <Collapse in={activeStep === 2} animateOpacity>
          <MotionBox variants={formItemVariants} mb={8}>
            <Flex align="center" gap={3} mb={6}>
              <Box p={3} borderRadius="xl" bg={themeBg} border="1px solid" borderColor={themeBorder}>
                <Icon as={FiMapPin} boxSize={6} color={ThemeColors.primaryColor} />
              </Box>
              <Box>
                <Heading as="h3" size="md" color="gray.800">
                  Delivery Information
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Where should we deliver your order?
                </Text>
              </Box>
            </Flex>

            <MotionBox variants={formItemVariants} mb={6}>
              <FormLabel color="gray.700" fontWeight="medium" mb={3}>
                Delivery Type
              </FormLabel>
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={3}>
                {deliveryOptions.map((option) => (
                  <MotionBox key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Box
                      p={4}
                      borderRadius="xl"
                      border="2px solid"
                      borderColor={
                        deliveryAddress.deliveryType === option.value
                          ? ThemeColors.primaryColor
                          : "gray.200"
                      }
                      bg={
                        deliveryAddress.deliveryType === option.value
                          ? themeBg
                          : "white"
                      }
                      cursor="pointer"
                      onClick={() =>
                        setDeliveryAddress({ ...deliveryAddress, deliveryType: option.value })
                      }
                      transition="all 0.2s"
                      _hover={{ borderColor: ThemeColors.primaryColor, shadow: "md" }}
                    >
                      <Flex align="center" gap={3} mb={2}>
                        <Icon as={option.icon} color={ThemeColors.primaryColor} />
                        <Text fontWeight="semibold" color="gray.800">
                          {option.label}
                        </Text>
                      </Flex>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {option.time}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color={ThemeColors.primaryColor}>
                        {option.price}
                      </Text>
                    </Box>
                  </MotionBox>
                ))}
              </Grid>
            </MotionBox>

            <MotionBox variants={formItemVariants} mb={6}>
              <FormLabel
                display="flex"
                alignItems="center"
                gap={2}
                color="gray.700"
                fontWeight="medium"
                mb={3}
              >
                <FiMap size={14} />
                Delivery Address
                {formErrors.address1 && (
                  <Badge colorScheme="red" fontSize="xs">Required</Badge>
                )}
              </FormLabel>

              <MotionFlex direction={{ base: "column", md: "row" }} gap={3} mb={3}>
                <Button
                  type="button"
                  leftIcon={<FiNavigation size={16} />}
                  onClick={openLocationPicker}
                  variant="outline"
                  borderColor={ThemeColors.primaryColor}
                  color={ThemeColors.primaryColor}
                  width={{ base: "full", md: "auto" }}
                  _hover={{
                    bg: themeBg,
                    borderColor: ThemeColors.secondaryColor,
                    color: ThemeColors.secondaryColor,
                  }}
                  borderRadius="xl"
                >
                  📍 Select Location on Map
                </Button>
                <Button
                  type="button"
                  leftIcon={<FiEdit2 size={16} />}
                  onClick={() => setSavedLocation(null)}
                  variant="ghost"
                  colorScheme="gray"
                  width={{ base: "full", md: "auto" }}
                  borderRadius="xl"
                >
                  ✏️ Enter Manually
                </Button>
              </MotionFlex>

              {deliveryAddress.latitude && deliveryAddress.longitude && (
                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  p={4}
                  mb={4}
                  bg={themeBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={themeBorder}
                >
                  <Flex align="center" gap={3}>
                    <Box p={2} borderRadius="md" bg={`${ThemeColors.primaryColor}20`}>
                      <Icon as={FiCheck} color={ThemeColors.primaryColor} />
                    </Box>
                    <Box flex={1}>
                      <Text fontSize="sm" color="gray.800" fontWeight="medium">
                        Location Selected
                      </Text>
                      <Text fontSize="xs" color="gray.600" noOfLines={2}>
                        {deliveryAddress.address1}
                      </Text>
                    </Box>
                  </Flex>
                </MotionBox>
              )}

              <Textarea
                name="address1"
                placeholder="Search and select location on map, or enter manually"
                value={deliveryAddress.address1}
                onChange={handleDeliveryDataChange}
                isInvalid={!!formErrors.address1}
                variant="filled"
                borderRadius="lg"
                minH="100px"
                _focus={{
                  borderColor: ThemeColors.primaryColor,
                  boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                }}
              />
            </MotionBox>

            <MotionFormControl variants={formItemVariants} mb={6}>
              <FormLabel color="gray.700" fontWeight="medium">
                Additional Details (Optional)
              </FormLabel>
              <Textarea
                name="address2"
                placeholder="Apartment number, floor, landmarks, or special instructions"
                value={deliveryAddress.address2}
                onChange={handleDeliveryDataChange}
                variant="filled"
                borderRadius="lg"
                minH="80px"
                _focus={{
                  borderColor: ThemeColors.primaryColor,
                  boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                }}
              />
            </MotionFormControl>

            {deliveryAddress.deliveryType === "scheduled" && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                overflow="hidden"
                variants={formItemVariants}
                mb={6}
              >
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel display="flex" alignItems="center" gap={2} color="gray.700" fontWeight="medium">
                      <FiCalendar size={14} />
                      Delivery Date
                    </FormLabel>
                    <Input
                      type="date"
                      name="deliveryDate"
                      value={deliveryAddress.deliveryDate}
                      onChange={handleDeliveryDataChange}
                      variant="filled"
                      borderRadius="lg"
                      min={new Date().toISOString().split("T")[0]}
                      _focus={{
                        borderColor: ThemeColors.primaryColor,
                        boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel display="flex" alignItems="center" gap={2} color="gray.700" fontWeight="medium">
                      <FiClock size={14} />
                      Preferred Time
                    </FormLabel>
                    <Select
                      name="deliveryTime"
                      value={deliveryAddress.deliveryTime}
                      onChange={handleDeliveryDataChange}
                      variant="filled"
                      borderRadius="lg"
                      placeholder="Select time slot"
                      _focus={{
                        borderColor: ThemeColors.primaryColor,
                        boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                      }}
                    >
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 7 PM)</option>
                    </Select>
                  </FormControl>
                </Grid>
              </MotionBox>
            )}
          </MotionBox>
        </Collapse>

        {/* Special Requests */}
        <Collapse in={activeStep === 3} animateOpacity>
          <MotionBox variants={formItemVariants} mb={8}>
            <Flex align="center" gap={3} mb={6}>
              <Box p={3} borderRadius="xl" bg={themeBg} border="1px solid" borderColor={themeBorder}>
                <Icon as={FiPackage} boxSize={6} color={ThemeColors.primaryColor} />
              </Box>
              <Box>
                <Heading as="h3" size="md" color="gray.800">
                  Special Requests
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Customize your delivery
                </Text>
              </Box>
            </Flex>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mb={6}>
              <MotionBox variants={formItemVariants}>
                <Flex
                  p={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={specialRequests.peeledFood ? themeBorder : "gray.200"}
                  align="center"
                  gap={3}
                  cursor="pointer"
                  onClick={() =>
                    setSpecialRequests({ ...specialRequests, peeledFood: !specialRequests.peeledFood })
                  }
                  bg={specialRequests.peeledFood ? themeBg : "white"}
                  transition="all 0.2s"
                  _hover={{ shadow: "md" }}
                >
                  <Switch
                    isChecked={specialRequests.peeledFood}
                    onChange={(e) =>
                      setSpecialRequests({ ...specialRequests, peeledFood: e.target.checked })
                    }
                    colorScheme="green"
                    size="lg"
                  />
                  <Box flex={1}>
                    <Text fontWeight="medium" color="gray.800">
                      Peel Food
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Request peeled fruits and vegetables
                    </Text>
                  </Box>
                  <Icon as={FaLeaf} color={ThemeColors.primaryColor} />
                </Flex>
              </MotionBox>

              <MotionBox variants={formItemVariants}>
                <Flex
                  p={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={specialRequests.ecoPackaging ? themeBorder : "gray.200"}
                  align="center"
                  gap={3}
                  cursor="pointer"
                  onClick={() =>
                    setSpecialRequests({ ...specialRequests, ecoPackaging: !specialRequests.ecoPackaging })
                  }
                  bg={specialRequests.ecoPackaging ? themeBg : "white"}
                  transition="all 0.2s"
                  _hover={{ shadow: "md" }}
                >
                  <Switch
                    isChecked={specialRequests.ecoPackaging}
                    onChange={(e) =>
                      setSpecialRequests({ ...specialRequests, ecoPackaging: e.target.checked })
                    }
                    colorScheme="green"
                    size="lg"
                  />
                  <Box flex={1}>
                    <Text fontWeight="medium" color="gray.800">
                      Eco Packaging
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Use biodegradable packaging
                    </Text>
                  </Box>
                  <Icon as={FaRecycle} color={ThemeColors.primaryColor} />
                </Flex>
              </MotionBox>
            </Grid>

            <MotionFormControl variants={formItemVariants}>
              <FormLabel color="gray.700" fontWeight="medium">
                Additional Instructions
              </FormLabel>
              <Textarea
                name="moreInfo"
                placeholder="Any specific instructions for delivery? (e.g., leave at gate, call before delivery, etc.)"
                value={specialRequests.moreInfo}
                onChange={handleSpecialRequestChange}
                variant="filled"
                borderRadius="lg"
                minH="120px"
                _focus={{
                  borderColor: ThemeColors.primaryColor,
                  boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                }}
              />
            </MotionFormControl>
          </MotionBox>
        </Collapse>

        {/* Navigation Buttons */}
        <MotionFlex
          variants={formItemVariants}
          justify="space-between"
          align="center"
          pt={6}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              leftIcon={<FiChevronLeft />}
              variant="outline"
              borderColor={ThemeColors.primaryColor}
              color={ThemeColors.primaryColor}
              onClick={() => activeStep > 1 && setActiveStep(activeStep - 1)}
              isDisabled={activeStep === 1}
              borderRadius="xl"
              _hover={{
                bg: themeBg,
                borderColor: ThemeColors.secondaryColor,
                color: ThemeColors.secondaryColor,
              }}
            >
              Back
            </Button>
          </MotionBox>

          {activeStep < 3 ? (
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                rightIcon={<FiChevronRight />}
                bg={ThemeColors.primaryColor}
                color="white"
                onClick={() => setActiveStep(activeStep + 1)}
                borderRadius="xl"
                _hover={{
                  bg: ThemeColors.secondaryColor,
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
              >
                Continue
              </Button>
            </MotionBox>
          ) : (
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                rightIcon={<FiCheck />}
                bg={ThemeColors.primaryColor}
                color="white"
                onClick={handleTabOneData}
                isLoading={isLoading}
                loadingText="Processing..."
                isDisabled={!isFormValid}
                borderRadius="xl"
                _hover={{
                  bg: ThemeColors.secondaryColor,
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
                size="lg"
                px={8}
              >
                Review & Continue
              </Button>
            </MotionBox>
          )}
        </MotionFlex>
      </MotionBox>

      {showLocationPicker && (
        <LocationSearchPicker
          onLocationSelected={handleLocationSelected}
          onClose={closeLocationPicker}
          initialAddress={deliveryAddress.address1}
          required={true}
        />
      )}
    </MotionBox>
  );
};

export default TabOne;
