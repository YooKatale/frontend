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
import { useDispatch } from "react-redux";
import { useLoginMutation, useLazyAuthMeQuery } from "@slices/usersApiSlice";
import { setCredentials, useAuth } from "@slices/authSlice";
import { useToast } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { API_ORIGIN, DB_URL } from "@config/config";
import Image from "next/image";

function getTokenAndUserFromUrl() {
  if (typeof window === "undefined") return { token: null, userParam: null };
  const search = window.location.search || "";
  const hash = window.location.hash || "";
  const combined = search + (hash ? (hash.startsWith("#") ? "&" + hash.slice(1) : hash) : "");
  const params = new URLSearchParams(combined);
  const token = params.get("token") ?? params.get("access_token") ?? params.get("accessToken") ?? params.get("jwt") ?? (hash.match(/[#&]access_token=([^&]+)/) || [])[1];
  const userParam = params.get("user");
  return { token, userParam };
}

async function fetchAuthMeWithCookieRetries(baseUrl, retries = 3, delays = [0, 700, 1500]) {
  const url = baseUrl ? `${baseUrl}/api/auth/me` : "";
  if (!url) return null;
  for (let i = 0; i < retries; i++) {
    if (delays[i] > 0) await new Promise((r) => setTimeout(r, delays[i]));
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const user = data?.data ?? data?.user ?? data;
        const token = data?.token ?? data?.data?.token ?? user?.token;
        return user && (user._id || user.id) ? { ...user, token: token ?? user?.token } : null;
      }
    } catch (_) {}
  }
  return null;
}

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
  const { userInfo } = useAuth();

  const googleCallback = searchParams.get("google_callback");
  const tokenFromQuery = getTokenAndUserFromUrl().token;
  const redirectTo = searchParams.get("redirect") || searchParams.get("returnUrl") || "/";
  const redirectSell = searchParams.get("redirect") === "sell";

  // Run when: (1) google_callback=1 (cookie flow), or (2) token in URL (backend token-in-URL redirect)
  useEffect(() => {
    if (!googleCallback && !tokenFromQuery) return;
    (async () => {
      const { token: tokenFromUrl, userParam } = getTokenAndUserFromUrl();
      if (tokenFromUrl || userParam) {
        try {
          let data = {};
          if (userParam) {
            try { data = JSON.parse(decodeURIComponent(userParam)); } catch (_) {}
          }
          if (tokenFromUrl) data = { ...data, token: tokenFromUrl };
          if (!data?.token && !data?.accessToken) data.token = tokenFromUrl;
          dispatch(setCredentials(data));
          const t = data?.token ?? data?.accessToken;
          if (t) {
            try {
              const base = (DB_URL || "").replace(/\/api\/?$/, "");
              const res = await fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` }, credentials: "include" });
              const json = await res.json().catch(() => ({}));
              const fullUser = json?.data ?? json?.user ?? json;
              if (fullUser && (fullUser._id || fullUser.id)) dispatch(setCredentials({ ...data, ...fullUser, token: t }));
            } catch (_) {}
          }
          chakraToast({
            title: "Welcome back!",
            description: `Signed in successfully`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          if (callback) callback({ loggedIn: true, user: data?._id });
          else push(redirectTo || redirect || "/");
          return;
        } catch (_) {}
      }
      const base = (DB_URL || "").replace(/\/api\/?$/, "");
      let res = await fetchAuthMeWithCookieRetries(base);
      if (!res) {
        try { res = await fetchAuthMe().unwrap(); } catch (_) {}
      }
      if (res) {
        const token = res?.token ?? res?.accessToken;
        dispatch(setCredentials({ ...res, token }));
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
      } else {
        chakraToast({
          title: "Session sync failed",
          description: "Frontend and backend are on different domains (Vercel vs Render), so session cookies can't be shared. Sign in with email below, or configure the backend to redirect with the token in the URL (see BACKEND_GOOGLE_TOKEN_REDIRECT.md).",
          status: "warning",
          duration: 8000,
          isClosable: true,
          position: "top-right",
        });
      }
    })();
  }, [googleCallback, tokenFromQuery]); // eslint-disable-line react-hooks/exhaustive-deps

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
      if (redirectSell) {
        push("/sell");
        return;
      }
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
    const params = new URLSearchParams({ redirect: dest, mode: "signin", return_token: "1" });
    window.location.href = `${API_ORIGIN}/api/auth/google?${params.toString()}`;
  };

  if (googleCallback || tokenFromQuery) {
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
      <Flex minH="100vh" bg="gray.50" alignItems="center" justifyContent="center" p={{ base: 6, lg: 12 }}>
        <Box
          w="full"
          maxW="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            w="full"
          >
            <Card
              borderRadius="2xl"
              boxShadow="0 10px 40px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <CardBody p={{ base: 6, md: 8 }}>
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

export default SignIn;
