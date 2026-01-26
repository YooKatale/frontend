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
  useBreakpointValue,
  Icon,
  HStack,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Alert,
  AlertIcon,
  Spinner,
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
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { API_ORIGIN } from "@config/config";

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
          title: "Welcome Back!",
          description: `Signed in with Google as ${res?.lastname || res?.firstname || res?.email || "User"}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when google_callback is set
  }, [googleCallback]);

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
        title: "Welcome Back!",
        description: `Successfully logged in as ${res?.lastname || res?.firstname || "User"}`,
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
        title: "Login Failed",
        description: err.data?.message || err.data || err.error || "Invalid credentials",
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const teal = "#319795";
  const tealLight = "rgba(49, 151, 149, 0.1)";

  if (googleCallback) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <Flex direction="column" align="center" gap={4}>
          <Text color="gray.600">Completing sign in...</Text>
          <Spinner size="lg" color={ThemeColors.primaryColor} />
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={{ base: 4, md: 8 }}
      px={{ base: 4, md: 0 }}
    >
      <Box
        position="absolute"
        top="10%"
        left="5%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="linear-gradient(135deg, #4FD1C5 0%, #319795 100%)"
        opacity="0.1"
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="5%"
        w="250px"
        h="250px"
        borderRadius="full"
        bg="linear-gradient(135deg, #ED8936 0%, #DD6B20 100%)"
        opacity="0.1"
        filter="blur(40px)"
      />

      <Container maxW="lg" centerContent>
        <Flex
          direction={{ base: "column", lg: "row" }}
          w="100%"
          gap={8}
          align="center"
          justify="center"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: 1 }}
          >
            <VStack spacing={8} align="flex-start" maxW="md">
              <Box
                as={Link}
                href="/"
                position="relative"
                width="180px"
                height="180px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="white"
                borderRadius="2xl"
                boxShadow="0 20px 60px rgba(0, 0, 0, 0.08)"
                p={6}
                _hover={{ transform: "translateY(-5px)", boxShadow: "0 25px 80px rgba(0, 0, 0, 0.12)" }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <motion.div animate={floatAnimation}>
                  <Image
                    src="/assets/images/logo1.png"
                    alt="YooKatale Logo"
                    width={160}
                    height={160}
                    style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
                    priority
                  />
                </motion.div>
                <Box position="absolute" top={-2} right={-2} color={ThemeColors.primaryColor} opacity={0.8}>
                  <Sparkles size={24} />
                </Box>
              </Box>

              <VStack spacing={4} align="flex-start">
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="800"
                  bgGradient="linear(to-r, #319795, #3182CE)"
                  bgClip="text"
                  lineHeight="1.2"
                >
                  Welcome to YooKatale
                  <br />
                  <Text as="span" fontSize="lg" fontWeight="600" color="gray.600">
                    Your Gateway to Fresh Produce
                  </Text>
                </Heading>
                <VStack spacing={3} align="flex-start">
                  <HStack spacing={3}>
                    <Box p={2} borderRadius="lg" bg="green.50" color="green.600">
                      <Shield size={20} />
                    </Box>
                    <Text fontSize="sm" color="gray.600">Secure & Encrypted Login</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Box p={2} borderRadius="lg" bg="blue.50" color="blue.600">
                      <Globe size={20} />
                    </Box>
                    <Text fontSize="sm" color="gray.600">Access Your Account Anywhere</Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ flex: 1, width: "100%" }}
          >
            <Box
              bg="white"
              borderRadius="2xl"
              boxShadow="0 25px 80px rgba(0, 0, 0, 0.08)"
              p={{ base: 6, md: 8 }}
              w="100%"
              position="relative"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ boxShadow: "0 30px 100px rgba(0, 0, 0, 0.12)" }}
              transition="all 0.3s ease"
            >
              <Box
                position="absolute"
                top={0}
                right={0}
                w="80px"
                h="80px"
                borderTopRightRadius="2xl"
                borderBottomLeftRadius="full"
                bgGradient="linear(to-br, #4FD1C5, #319795)"
                opacity="0.1"
              />

              <VStack spacing={6} align="stretch">
                <Box textAlign="left">
                  <Heading as="h2" fontSize={{ base: "2xl", md: "2.5xl" }} fontWeight="700" color="gray.800" mb={3}>
                    Sign In to Continue
                  </Heading>
                  <Text fontSize="sm" color="gray.500" fontWeight="500">
                    Enter your credentials to access your account
                  </Text>
                  <Box
                    height="4px"
                    width="80px"
                    marginTop="0.5rem"
                    bgGradient="linear(to-r, #4FD1C5, #319795)"
                    borderRadius="full"
                  />
                </Box>

                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    isLoading={isGoogleLoading}
                    loadingText="Connecting..."
                    leftIcon={<Icon as={FcGoogle} boxSize={6} />}
                    w="100%"
                    height="50px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    bg="white"
                    _hover={{
                      bg: "gray.50",
                      borderColor: "gray.300",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s"
                    fontWeight="600"
                    fontSize="md"
                  >
                    Continue with Google
                  </Button>
                </motion.div>

                <Flex align="center" my={2}>
                  <Box flex="1" height="1px" bg="gray.200" />
                  <Text px={4} color="gray.400" fontSize="sm" fontWeight="600">
                    OR SIGN IN WITH EMAIL
                  </Text>
                  <Box flex="1" height="1px" bg="gray.200" />
                </Flex>

                <form onSubmit={submitHandler}>
                  <VStack spacing={5} align="stretch">
                    <motion.div
                      variants={itemVariants}
                      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <FormControl isRequired>
                        <FormLabel htmlFor="email" fontSize="sm" fontWeight="600" color="gray.700" mb={2} display="flex" alignItems="center" gap={2}>
                          <Mail size={16} />
                          Email Address
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none" pl={3}>
                            <Mail size={20} style={{ color: "#A0AEC0" }} />
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
                            borderColor="gray.200"
                            pl={12}
                            _hover={{ borderColor: teal }}
                            _focus={{ borderColor: teal, boxShadow: `0 0 0 3px ${tealLight}` }}
                            transition="all 0.2s"
                            fontSize="md"
                          />
                        </InputGroup>
                      </FormControl>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <FormControl isRequired>
                        <FormLabel htmlFor="password" fontSize="sm" fontWeight="600" color="gray.700" mb={2} display="flex" alignItems="center" gap={2}>
                          <Lock size={16} />
                          Password
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none" pl={3}>
                            <Lock size={20} style={{ color: "#A0AEC0" }} />
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
                            borderColor="gray.200"
                            pl={12}
                            pr="4.5rem"
                            _hover={{ borderColor: teal }}
                            _focus={{ borderColor: teal, boxShadow: `0 0 0 3px ${tealLight}` }}
                            transition="all 0.2s"
                            fontSize="md"
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              h="1.75rem"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              color="gray.500"
                              _hover={{ color: teal }}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    </motion.div>

                    <Flex justify="flex-end">
                      <Link href="/forgotpassword">
                        <Button
                          variant="link"
                          color={teal}
                          fontSize="sm"
                          fontWeight="600"
                          _hover={{ textDecoration: "none", color: "#2C7A7B" }}
                          rightIcon={<ArrowRight size={16} />}
                        >
                          Forgot Password?
                        </Button>
                      </Link>
                    </Flex>

                    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Signing In..."
                        bgGradient="linear(to-r, #319795, #3182CE)"
                        color="white"
                        _hover={{
                          bgGradient: "linear(to-r, #2C7A7B, #2B6CB0)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 25px rgba(49, 151, 149, 0.3)",
                        }}
                        _active={{ transform: "translateY(0)" }}
                        height="52px"
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="700"
                        w="100%"
                        transition="all 0.2s"
                        rightIcon={!isLoading && <ArrowRight size={20} />}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </motion.div>
                  </VStack>
                </form>

                <Box textAlign="center" pt={2}>
                  <Text fontSize="sm" color="gray.600">
                    New to YooKatale?{" "}
                    <Link
                      href="/signup"
                      style={{ color: teal, fontWeight: "700", textDecoration: "none" }}
                      _hover={{ textDecoration: "underline" }}
                    >
                      Create Account
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Box>

            {!ismodal && (
              <motion.div variants={itemVariants} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Alert
                  status="info"
                  variant="subtle"
                  borderRadius="lg"
                  mt={6}
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.100"
                >
                  <AlertIcon />
                  <Text fontSize="xs" color="blue.700">
                    Your security is our priority. All data is encrypted and protected.
                  </Text>
                </Alert>
              </motion.div>
            )}
          </motion.div>
        </Flex>

        {!ismodal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ width: "100%", marginTop: "2rem" }}
          >
            <Box textAlign="center">
              <Link href="/subscription">
                <Button
                  variant="outline"
                  size="md"
                  borderColor={teal}
                  color={teal}
                  borderRadius="xl"
                  _hover={{
                    bg: teal,
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(49, 151, 149, 0.2)",
                  }}
                  transition="all 0.2s"
                  fontWeight="600"
                  px={8}
                  py={6}
                  fontSize="sm"
                >
                  View Subscription Packages
                </Button>
              </Link>
            </Box>
          </motion.div>
        )}
      </Container>

      {!isMobile && (
        <Box position="absolute" inset={0} zIndex={-1}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                backgroundColor: teal,
                borderRadius: "50%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3,
              }}
              animate={{
                y: [0, Math.random() * 20 - 10, 0],
                x: [0, Math.random() * 10 - 5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SignIn;
