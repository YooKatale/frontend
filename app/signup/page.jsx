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
  Badge,
  Card,
  CardBody,
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
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "@slices/usersApiSlice";
import { setCredentials, useAuth } from "@slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaApple } from "react-icons/fa";
import { API_ORIGIN } from "@config/config";
import Image from "next/image";

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
  const [notifyViaCall, setNotifyViaCall] = useState(false);
  const [notifyViaWhatsApp, setNotifyViaWhatsApp] = useState(false);
  const [notifyViaEmail, setNotifyViaEmail] = useState(true);

  const { push } = useRouter();
  const searchParams = useSearchParams();
  const chakraToast = useToast();
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const { userInfo } = useAuth();
  const redirectSell = searchParams.get("redirect") === "sell";

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
        description: redirectSell ? "Account created. Taking you to seller dashboard…" : "Account created. Redirecting to sign in…",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      if (redirectSell) {
        setTimeout(() => push("/sell"), 500);
      } else {
        setTimeout(() => push("/signin"), 1500);
      }
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

  return (
    <Container maxW="container.xl" p={0}>
      <Flex minH="100vh" bg="gray.50" alignItems="center" justifyContent="center" p={{ base: 6, lg: 12 }}>
        <Box
          w="full"
          maxW="xl"
        >

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
                  {/* Logo at the top center */}
                  <Flex justify="center" mb={8}>
                    <Link href="/">
                      <Box
                        as="img"
                        src="/assets/icons/logo2.png"
                        alt="YooKatale Logo"
                        w="140px"
                        h="70px"
                        objectFit="contain"
                        cursor="pointer"
                        _hover={{ opacity: 0.9 }}
                        transition="opacity 0.2s"
                      />
                    </Link>
                  </Flex>

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

                  {/* Already have account link */}
                  <Box textAlign="center" mt={4}>
                    <Text fontSize="sm" color="gray.600">
                      Already have an account?{" "}
                      <ChakraLink
                        as={Link}
                        href="/signin"
                        color={ThemeColors.primaryColor}
                        fontWeight="semibold"
                        _hover={{ textDecoration: "underline" }}
                      >
                        Sign In
                      </ChakraLink>
                    </Text>
                  </Box>
                </CardBody>
              </Card>

              {/* App Store & Play Store - footer style, mobile responsive */}
              <Flex
                direction={{ base: "column", sm: "row" }}
                align="center"
                justify="center"
                gap={{ base: 3, sm: 4 }}
                mt={8}
                flexWrap="wrap"
              >
                <Button
                  as="a"
                  href="https://play.google.com/store/apps/details?id=com.yookataleapp.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  px={{ base: 4, sm: 5 }}
                  py={2}
                  h="auto"
                  minH={{ base: "44px", sm: "48px" }}
                  borderRadius="xl"
                  bg="gray.800"
                  color="white"
                  border="1px solid"
                  borderColor="gray.600"
                  _hover={{ bg: "gray.700", transform: "translateY(-2px)", boxShadow: "lg", borderColor: "gray.500" }}
                  transition="all 0.3s"
                  gap={2}
                  w={{ base: "full", sm: "auto" }}
                  maxW={{ base: "280px", sm: "none" }}
                >
                  <Box position="relative" w={{ base: "24px", sm: "28px" }} h={{ base: "24px", sm: "28px" }} flexShrink={0}>
                    <Image src="/assets/images/google.svg" alt="" width={28} height={28} style={{ objectFit: "contain" }} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize={{ base: "9px", sm: "10px" }} color="white" opacity={0.9}>Get it on</Text>
                    <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="700" color="white">Google Play</Text>
                  </VStack>
                </Button>
                <Button
                  as="a"
                  href="https://apps.apple.com/app/yookatale"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  px={{ base: 4, sm: 5 }}
                  py={2}
                  h="auto"
                  minH={{ base: "44px", sm: "48px" }}
                  borderRadius="xl"
                  bg="gray.800"
                  color="white"
                  border="1px solid"
                  borderColor="gray.600"
                  _hover={{ bg: "gray.700", transform: "translateY(-2px)", boxShadow: "lg", borderColor: "gray.500" }}
                  transition="all 0.3s"
                  gap={2}
                  w={{ base: "full", sm: "auto" }}
                  maxW={{ base: "280px", sm: "none" }}
                >
                  <Box position="relative" w={{ base: "22px", sm: "24px" }} h={{ base: "22px", sm: "24px" }} flexShrink={0}>
                    <Image src="/assets/images/apple.svg" alt="" width={24} height={24} style={{ objectFit: "contain" }} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize={{ base: "9px", sm: "10px" }} color="white" opacity={0.9}>Download on the</Text>
                    <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="700" color="white">App Store</Text>
                  </VStack>
                </Button>
              </Flex>
            </MotionBox>
          </Box>
        </Flex>
    </Container>
  );
};

export default SignUp;
