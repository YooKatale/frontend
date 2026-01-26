"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Container,
  Icon,
  HStack,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Spinner,
  Divider,
  Card,
  CardBody,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useLazyAuthMeQuery } from "@slices/usersApiSlice";
import { setCredentials } from "@slices/authSlice";
import { useToast } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { API_ORIGIN } from "@config/config";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const SignIn = ({ redirect, callback, ismodal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const chakraToast = useToast();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [fetchAuthMe] = useLazyAuthMeQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const googleCallback = searchParams.get("google_callback");
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!googleCallback) return;
    (async () => {
      try {
        const res = await fetchAuthMe().unwrap();
        dispatch(setCredentials({ ...res }));
        chakraToast({
          title: "Welcome back!",
          description: `Signed in as ${res?.lastname || res?.firstname || res?.email || "User"}`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (callback) callback({ loggedIn: true, user: res?._id });
        else push(redirectTo || redirect || "/");
      } catch (e) {
        chakraToast({
          title: "Session sync failed",
          description: e?.data?.message || "Please sign in again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        push("/signin");
      }
    })();
  }, [googleCallback]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    try {
      setLoading(true);
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      chakraToast({
        title: "Welcome back!",
        description: `Signed in as ${res?.lastname || res?.firstname || "User"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      if (callback) return callback({ loggedIn: true, user: res?._id });
      if (redirect) return push(redirect);
      push("/");
    } catch (err) {
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      chakraToast({
        title: "Login failed",
        description: err.data?.message || err.data || err.error || "Invalid credentials.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const dest = redirectTo || redirect || "/";
    const params = new URLSearchParams({ redirect: dest, mode: "signin" });
    window.location.href = `${API_ORIGIN}/api/auth/google?${params.toString()}`;
  };

  const gradient = `linear-gradient(135deg, #0d2d14 0%, ${ThemeColors.primaryColor} 50%, ${ThemeColors.secondaryColor} 100%)`;

  if (googleCallback) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <Flex direction="column" align="center" gap={4}>
          <Text color="gray.600">Signing you in…</Text>
          <Spinner size="lg" color={ThemeColors.primaryColor} />
        </Flex>
      </Box>
    );
  }

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
                Sign in to YooKatale
              </Heading>
              <Text fontSize="md" opacity={0.9}>
                Access your account and manage orders, subscriptions, and rewards.
              </Text>
            </Box>

            <Box mt="auto" pt={8}>
              <Text fontSize="sm" opacity={0.7} mb={4}>
                New to YooKatale?{" "}
                <ChakraLink
                  as={Link}
                  href="/signup"
                  color="white"
                  fontWeight="semibold"
                  textDecoration="underline"
                  _hover={{ opacity: 0.9 }}
                >
                  Create account
                </ChakraLink>
              </Text>
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
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box maxW="md" w="full">
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
                      Sign in
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Continue with Google or email
                    </Text>
                  </Box>

                  <MotionButton
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    size="lg"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    isLoading={isGoogleLoading}
                    loadingText="Connecting…"
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
                      OR SIGN IN WITH EMAIL
                    </Text>
                    <Divider flex="1" />
                  </Flex>

                  <form onSubmit={submitHandler}>
                    <VStack spacing={5} align="stretch">
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Email
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none" pl={3}>
                            <Mail size={18} style={{ color: "#A0AEC0" }} />
                          </InputLeftElement>
                          <Input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            size="lg"
                            borderRadius="xl"
                            borderColor="gray.300"
                            pl={12}
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                          Password
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none" pl={3}>
                            <Lock size={18} style={{ color: "#A0AEC0" }} />
                          </InputLeftElement>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            name="password"
                            value={password}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            size="lg"
                            borderRadius="xl"
                            borderColor="gray.300"
                            pl={12}
                            pr="4.5rem"
                            _hover={{ borderColor: ThemeColors.primaryColor }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                            }}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              h="1.75rem"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              color="gray.500"
                              _hover={{ color: ThemeColors.primaryColor }}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Flex justify="flex-end">
                        <ChakraLink as={Link} href="/forgotpassword">
                          <Button
                            variant="link"
                            color={ThemeColors.primaryColor}
                            fontSize="sm"
                            fontWeight="600"
                            _hover={{ textDecoration: "underline" }}
                            rightIcon={<ArrowRight size={14} />}
                          >
                            Forgot password?
                          </Button>
                        </ChakraLink>
                      </Flex>

                      <MotionButton
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        size="lg"
                        w="full"
                        h="52px"
                        bg={ThemeColors.primaryColor}
                        color="white"
                        borderRadius="xl"
                        isLoading={isLoading}
                        loadingText="Signing in…"
                        _hover={{
                          bg: ThemeColors.darkColor,
                          transform: "translateY(-2px)",
                          boxShadow: `0 10px 25px ${ThemeColors.primaryColor}4D`,
                        }}
                        _active={{ transform: "translateY(0)" }}
                        fontWeight="semibold"
                        fontSize="md"
                        rightIcon={!isLoading && <ArrowRight size={18} />}
                      >
                        Sign in
                      </MotionButton>
                    </VStack>
                  </form>

                  <Box textAlign="center" pt={4}>
                    <Text fontSize="sm" color="gray.600">
                      New here?{" "}
                      <ChakraLink
                        as={Link}
                        href="/signup"
                        color={ThemeColors.primaryColor}
                        fontWeight="semibold"
                        _hover={{ textDecoration: "underline" }}
                      >
                        Create account
                      </ChakraLink>
                    </Text>
                  </Box>
                </CardBody>
              </Card>
            </MotionBox>

            {!ismodal && (
              <Box textAlign="center" mt={6}>
                <ChakraLink as={Link} href="/subscription">
                  <Button
                    variant="outline"
                    size="sm"
                    borderColor={ThemeColors.primaryColor}
                    color={ThemeColors.primaryColor}
                    borderRadius="xl"
                    _hover={{
                      bg: ThemeColors.primaryColor,
                      color: "white",
                    }}
                  >
                    View plans
                  </Button>
                </ChakraLink>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default SignIn;
