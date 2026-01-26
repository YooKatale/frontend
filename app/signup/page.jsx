"use client";

import {
  Box,
  Flex,
  FormControl,
  Heading,
  Text,
  FormLabel,
  Input,
  Button,
  Grid,
  Select,
  Checkbox,
  Stack,
  Icon,
  Container,
  Divider,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "@slices/usersApiSlice";
import { setCredentials } from "@slices/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Truck, Award, Gift, Star } from "lucide-react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaGooglePlay, FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { API_ORIGIN } from "@config/config";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [vegan, setVegan] = useState(false);
  const [address, setAddress] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [notifyViaCall, setNotifyViaCall] = useState(false);
  const [notifyViaWhatsApp, setNotifyViaWhatsApp] = useState(false);
  const [notifyViaEmail, setNotifyViaEmail] = useState(true);

  const { push } = useRouter();
  const chakraToast = useToast();
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const features = [
    { icon: Truck, label: "Free Delivery", color: "green.500" },
    { icon: Award, label: "Premium Quality", color: "yellow.500" },
    { icon: Gift, label: "Loyalty Rewards", color: "purple.500" },
    { icon: Star, label: "Customizable Meals", color: "blue.500" },
  ];

  useEffect(() => {
    if (userInfo) return push("/");
    if (typeof window !== "undefined") {
      const urlpath = new URLSearchParams(window.location.search);
      const refCode = urlpath.get("ref");
      if (refCode != null) setReferralCode(refCode);
    }
  }, [userInfo, push]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!e.target.terms.checked) {
        chakraToast({
          title: "Agreement Required",
          description: "Please agree to the terms and conditions.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setLoading(false);
        return;
      }
      const referenceCode =
        referralCode != null && referralCode.toString().trim() !== ""
          ? referralCode
          : undefined;

      const res = await register({
        firstname,
        lastname,
        email,
        phone,
        gender,
        vegan,
        dob,
        address,
        password,
        referenceCode,
        notificationPreferences: {
          calls: notifyViaCall,
          whatsapp: notifyViaWhatsApp,
          email: notifyViaEmail,
        },
      }).unwrap();

      dispatch(setCredentials({ ...res }));

      try {
        await fetch("/api/mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "welcome" }),
        });
      } catch (emailError) {
        console.error("Welcome email error:", emailError);
      }

      chakraToast({
        title: "Welcome to YooKatale!",
        description: "Account created. Redirecting to sign in…",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setTimeout(() => push("/signin"), 1500);
    } catch (err) {
      setLoading(false);
      chakraToast({
        title: "Registration Failed",
        description:
          err.data?.message || err.data || err.error || "Check your details and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    const params = new URLSearchParams({ redirect: "/", mode: "signup" });
    window.location.href = `${API_ORIGIN}/api/auth/google?${params.toString()}`;
  };

  const steps = [
    { number: 1, label: "Account" },
    { number: 2, label: "Profile" },
    { number: 3, label: "Preferences" },
  ];

  const gradient = `linear-gradient(135deg, #0d2d14 0%, ${ThemeColors.primaryColor} 50%, ${ThemeColors.secondaryColor} 100%)`;

  return (
    <Container maxW="container.xl" p={0}>
      <Flex minH="100vh" direction={{ base: "column", lg: "row" }} bg="white">
        {/* Left – Brand */}
        <Box
          flex={{ base: "0 0 auto", lg: "1" }}
          bg={gradient}
          color="white"
          p={{ base: 6, lg: 12 }}
          position="relative"
          overflow="hidden"
        >
          <Flex direction="column" h="full" position="relative" zIndex={1}>
            <Link href="/">
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                bg="white"
                borderRadius="2xl"
                p={4}
                w="fit-content"
                boxShadow="0 10px 40px rgba(0,0,0,0.2)"
                mb={8}
              >
                <Box
                  as="img"
                  src="/assets/icons/logo2.png"
                  alt="YooKatale Logo"
                  w="160px"
                  h="80px"
                  objectFit="contain"
                />
              </MotionBox>
            </Link>

            <Box flex="1" mt={{ base: 4, lg: 12 }}>
              <Heading
                as="h1"
                fontSize={{ base: "2xl", lg: "3xl" }}
                fontWeight="bold"
                lineHeight="1.2"
                mb={4}
              >
                Welcome to YooKatale
              </Heading>
              <Text fontSize="md" opacity={0.9} mb={8}>
                Fresh meals, customizable plans, and rewards. Join thousands who trust us.
              </Text>

              <SimpleGrid columns={2} spacing={4} mb={8}>
                {features.map((f, i) => (
                  <MotionBox
                    key={f.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Flex align="center" gap={3}>
                      <Box
                        p={2}
                        bg="whiteAlpha.200"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                      >
                        <Icon as={f.icon} boxSize={5} color={f.color} />
                      </Box>
                      <Text fontSize="sm" fontWeight="medium">
                        {f.label}
                      </Text>
                    </Flex>
                  </MotionBox>
                ))}
              </SimpleGrid>

              <Box
                bg="whiteAlpha.100"
                p={5}
                borderRadius="2xl"
                backdropFilter="blur(10px)"
              >
                <Text fontSize="sm" fontWeight="semibold" mb={3} opacity={0.9}>
                  Why join?
                </Text>
                <Stack spacing={2}>
                  {[
                    "Earn loyalty points with every order",
                    "Customize meals to your preference",
                    "Free delivery on premium plans",
                    "Secure payments",
                  ].map((item, idx) => (
                    <Flex key={idx} align="center" gap={3}>
                      <CheckCircle size={14} opacity={0.8} />
                      <Text fontSize="sm" opacity={0.9}>
                        {item}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Box>

            <Box mt={8}>
              <Text fontSize="sm" opacity={0.7} mb={4}>
                Already have an account?{" "}
                <ChakraLink
                  as={Link}
                  href="/signin"
                  color="white"
                  fontWeight="semibold"
                  textDecoration="underline"
                  _hover={{ opacity: 0.9 }}
                >
                  Sign In
                </ChakraLink>
              </Text>
              <Flex gap={3} mt={4}>
                <ChakraLink
                  href="/subscription"
                  target="_blank"
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="transform 0.2s"
                >
                  <Image
                    src="/assets/images/apple.svg"
                    width={120}
                    height={36}
                    alt="App Store"
                  />
                </ChakraLink>
                <ChakraLink
                  href="https://play.google.com/store/apps/details?id=com.yookataleapp.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="transform 0.2s"
                >
                  <Image
                    src="/assets/images/google.svg"
                    width={120}
                    height={36}
                    alt="Google Play"
                  />
                </ChakraLink>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Right – Form */}
        <Box
          flex="1"
          p={{ base: 6, lg: 12 }}
          bg="gray.50"
          overflowY="auto"
          maxH={{ base: "auto", lg: "100vh" }}
        >
          <Box maxW="xl" mx="auto">
            <Flex justify="center" mb={8} gap={2}>
              {steps.map((s) => (
                <Flex key={s.number} align="center" gap={2}>
                  <Box
                    w={8}
                    h={8}
                    borderRadius="full"
                    bg={activeStep >= s.number ? ThemeColors.primaryColor : "gray.200"}
                    color={activeStep >= s.number ? "white" : "gray.500"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    transition="all 0.3s"
                  >
                    {s.number}
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={activeStep >= s.number ? "gray.800" : "gray.500"}
                    display={{ base: "none", md: "block" }}
                  >
                    {s.label}
                  </Text>
                  {s.number < steps.length && (
                    <Box w={6} h="1px" bg="gray.300" mx={2} />
                  )}
                </Flex>
              ))}
            </Flex>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                borderRadius="2xl"
                boxShadow="0 10px 40px rgba(0,0,0,0.08)"
                border="1px solid"
                borderColor="gray.100"
                overflow="hidden"
              >
                <CardBody p={{ base: 6, md: 8 }}>
                  <Box mb={6}>
                    <Heading size="lg" color="gray.800" mb={1}>
                      Create account
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Google or email
                    </Text>
                  </Box>

                  <MotionButton
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    size="lg"
                    variant="outline"
                    onClick={handleGoogleSignup}
                    isLoading={isGoogleLoading}
                    loadingText="Connecting..."
                    leftIcon={<Icon as={FcGoogle} boxSize={5} />}
                    w="full"
                    h="52px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    bg="white"
                    _hover={{
                      bg: "gray.50",
                      borderColor: ThemeColors.primaryColor,
                      boxShadow: `0 4px 12px ${ThemeColors.primaryColor}26`,
                    }}
                    fontWeight="semibold"
                    mb={6}
                  >
                    Continue with Google
                  </MotionButton>

                  <Flex align="center" my={6}>
                    <Divider flex="1" />
                    <Text px={4} color="gray.400" fontSize="sm" fontWeight="semibold">
                      OR SIGN UP WITH EMAIL
                    </Text>
                    <Divider flex="1" />
                  </Flex>

                  <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={4}
                        w="full"
                      >
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                            First name
                          </FormLabel>
                          <Input
                            size="lg"
                            borderRadius="lg"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="First name"
                            borderColor="gray.300"
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                            Last name
                          </FormLabel>
                          <Input
                            size="lg"
                            borderRadius="lg"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            placeholder="Last name"
                            borderColor="gray.300"
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={4}
                        w="full"
                      >
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                            Email
                          </FormLabel>
                          <Input
                            size="lg"
                            borderRadius="lg"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            borderColor="gray.300"
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                            Phone
                          </FormLabel>
                          <Input
                            size="lg"
                            borderRadius="lg"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+256 XXX XXX XXX"
                            borderColor="gray.300"
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={4}
                        w="full"
                      >
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                            Gender
                          </FormLabel>
                          <Select
                            size="lg"
                            borderRadius="lg"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            placeholder="Select"
                            borderColor="gray.300"
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                            Date of birth
                          </FormLabel>
                          <Input
                            size="lg"
                            borderRadius="lg"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            borderColor="gray.300"
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                          Delivery address
                        </FormLabel>
                        <Input
                          size="lg"
                          borderRadius="lg"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Address"
                          borderColor="gray.300"
                          _hover={{ borderColor: ThemeColors.primaryColor }}
                          _focus={{
                            borderColor: ThemeColors.primaryColor,
                            boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                          }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                          Password
                        </FormLabel>
                        <Input
                          size="lg"
                          borderRadius="lg"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Strong password"
                          borderColor="gray.300"
                          _hover={{ borderColor: ThemeColors.primaryColor }}
                          _focus={{
                            borderColor: ThemeColors.primaryColor,
                            boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                          }}
                        />
                      </FormControl>

                      {referralCode && (
                        <FormControl w="full">
                          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                            Referral code
                            <Badge ml={2} colorScheme="green">
                              Applied
                            </Badge>
                          </FormLabel>
                          <Input
                            size="lg"
                            borderRadius="lg"
                            value={referralCode}
                            isReadOnly
                            bg="green.50"
                            borderColor="green.200"
                            color="green.700"
                          />
                        </FormControl>
                      )}

                      <Box w="full" pt={4} borderTop="1px solid" borderColor="gray.200">
                        <Text fontSize="md" fontWeight="semibold" color="gray.800" mb={4}>
                          Preferences
                        </Text>
                        <Stack spacing={4}>
                          <Checkbox
                            size="lg"
                            isChecked={vegan}
                            onChange={(e) => setVegan(e.target.checked)}
                            colorScheme="green"
                            spacing={3}
                          >
                            <Box>
                              <Text fontWeight="medium">Vegetarian / Vegan</Text>
                              <Text fontSize="sm" color="gray.600">
                                Customized meal recommendations
                              </Text>
                            </Box>
                          </Checkbox>
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                              Notifications
                            </Text>
                            <Stack spacing={3} pl={1}>
                              <Checkbox
                                isChecked={notifyViaEmail}
                                onChange={(e) => setNotifyViaEmail(e.target.checked)}
                                colorScheme="blue"
                              >
                                <Flex align="center" gap={2}>
                                  <Icon as={FaEnvelope} color="blue.500" />
                                  <Text>Email</Text>
                                </Flex>
                              </Checkbox>
                              <Checkbox
                                isChecked={notifyViaCall}
                                onChange={(e) => setNotifyViaCall(e.target.checked)}
                                colorScheme="green"
                              >
                                <Flex align="center" gap={2}>
                                  <Icon as={FaPhoneAlt} color="green.500" />
                                  <Text>Phone</Text>
                                </Flex>
                              </Checkbox>
                              <Checkbox
                                isChecked={notifyViaWhatsApp}
                                onChange={(e) => setNotifyViaWhatsApp(e.target.checked)}
                                colorScheme="whatsapp"
                              >
                                <Flex align="center" gap={2}>
                                  <Icon as={FaWhatsapp} color="whatsapp.600" />
                                  <Text>WhatsApp</Text>
                                </Flex>
                              </Checkbox>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>

                      <Box w="full">
                        <Checkbox
                          size="lg"
                          name="terms"
                          colorScheme="green"
                          isRequired
                          spacing={3}
                        >
                          <Box>
                            <Text fontWeight="medium">
                              I agree to the{" "}
                              <ChakraLink
                                as={Link}
                                href="/terms"
                                color={ThemeColors.primaryColor}
                                fontWeight="semibold"
                                _hover={{ textDecoration: "underline" }}
                              >
                                Terms
                              </ChakraLink>{" "}
                              and{" "}
                              <ChakraLink
                                as={Link}
                                href="/privacy"
                                color={ThemeColors.primaryColor}
                                fontWeight="semibold"
                                _hover={{ textDecoration: "underline" }}
                              >
                                Privacy Policy
                              </ChakraLink>
                            </Text>
                          </Box>
                        </Checkbox>
                      </Box>

                      <MotionButton
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        size="lg"
                        w="full"
                        h="56px"
                        bg={ThemeColors.primaryColor}
                        color="white"
                        borderRadius="xl"
                        isLoading={isLoading}
                        loadingText="Creating…"
                        _hover={{
                          bg: ThemeColors.darkColor,
                          transform: "translateY(-2px)",
                          boxShadow: `0 10px 25px ${ThemeColors.primaryColor}4D`,
                        }}
                        _active={{ transform: "translateY(0)" }}
                        fontWeight="semibold"
                        fontSize="md"
                      >
                        Create account
                      </MotionButton>
                    </VStack>
                  </form>

                  <Alert status="info" borderRadius="lg" mt={6} variant="subtle" size="sm">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Secure</AlertTitle>
                      <AlertDescription fontSize="xs">
                        Encrypted registration
                      </AlertDescription>
                    </Box>
                  </Alert>
                </CardBody>
              </Card>

              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} mt={8}>
                <ChakraLink
                  as={Link}
                  href="/subscription"
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.200"
                  _hover={{
                    borderColor: ThemeColors.primaryColor,
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  }}
                  transition="all 0.3s"
                >
                  <Text fontWeight="semibold" color="gray.800">Plans</Text>
                  <Text fontSize="sm" color="gray.600">Subscribe</Text>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  href="/partner"
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.200"
                  _hover={{
                    borderColor: ThemeColors.primaryColor,
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  }}
                  transition="all 0.3s"
                >
                  <Text fontWeight="semibold" color="gray.800">Partner</Text>
                  <Text fontSize="sm" color="gray.600">Join us</Text>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  href="/contact"
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.200"
                  _hover={{
                    borderColor: ThemeColors.primaryColor,
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  }}
                  transition="all 0.3s"
                >
                  <Text fontWeight="semibold" color="gray.800">Help</Text>
                  <Text fontSize="sm" color="gray.600">Contact</Text>
                </ChakraLink>
              </SimpleGrid>
            </MotionBox>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default SignUp;
