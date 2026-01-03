"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@slices/usersApiSlice";
import { setCredentials } from "@slices/authSlice";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import ButtonComponent from "@components/Button";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const SignIn = ({ redirect, callback, ismodal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const chakraToast = useToast();
  const { refresh, push } = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      chakraToast({
        title: "Logged In",
        description: `Successfully logged in as ${res?.lastname || res?.firstname || 'User'}`,
        status: "success",
        duration: 5000,
        isClosable: false,
      });

      setLoading(false);

      if (callback) return callback({ loggedIn: true, user: res?._id });
      if (redirect) return push(redirect);
      push("/");
    } catch (err) {
      setLoading(false);
      chakraToast({
        title: "Error has occured",
        description: err.data?.message
          ? err.data?.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, white)"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 0 }}
    >
      <Container maxW="md" centerContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: "100%" }}
        >
          {/* Logo Section */}
          <motion.div variants={itemVariants}>
            <Flex justify="center" mb={8}>
              <Box
                as={Link}
                href="/"
                _hover={{ transform: "scale(1.05)" }}
                transition="all 0.2s"
              >
                <Image
                  src="/assets/images/logo1.png"
                  alt="Yookatale Logo"
                  width={120}
                  height={120}
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Flex>
          </motion.div>

          {/* Card Container */}
          <motion.div variants={itemVariants}>
            <Box
              bg="white"
              borderRadius="2xl"
              boxShadow="0 10px 40px rgba(0, 0, 0, 0.1)"
              p={{ base: 6, md: 8 }}
              w="100%"
            >
              <VStack spacing={6} align="stretch">
                {/* Header */}
                <Box textAlign="center">
                  <Heading
                    as="h1"
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="700"
                    color="gray.800"
                    mb={2}
                    letterSpacing="-0.02em"
                  >
                    Welcome Back
                  </Heading>
                  <Text
                    fontSize="md"
                    color="gray.600"
                    fontWeight="500"
                  >
                    Sign in to continue to Yookatale
                  </Text>
                  <Box
                    height="3px"
                    width="60px"
                    margin="1rem auto 0"
                    background={ThemeColors.primaryColor}
                    borderRadius="full"
                  />
                </Box>

                {/* Form */}
                <form onSubmit={submitHandler}>
                  <VStack spacing={5} align="stretch">
                    <motion.div variants={itemVariants}>
                      <FormControl isRequired>
                        <FormLabel
                          htmlFor="email"
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                          mb={2}
                        >
                          Email Address
                        </FormLabel>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          value={email}
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          size="lg"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: ThemeColors.primaryColor }}
                          _focus={{
                            borderColor: ThemeColors.primaryColor,
                            boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                          }}
                          transition="all 0.2s"
                        />
                      </FormControl>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormControl isRequired>
                        <FormLabel
                          htmlFor="password"
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                          mb={2}
                        >
                          Password
                        </FormLabel>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          name="password"
                          value={password}
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          size="lg"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: ThemeColors.primaryColor }}
                          _focus={{
                            borderColor: ThemeColors.primaryColor,
                            boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}`,
                          }}
                          transition="all 0.2s"
                        />
                      </FormControl>
                    </motion.div>

                    {/* Forgot Password */}
                    <Flex justify="flex-end">
                      <Link
                        href="/forgotpassword"
                        style={{
                          color: ThemeColors.primaryColor,
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                        _hover={{ textDecoration: "underline" }}
                      >
                        Forgot Password?
                      </Link>
                    </Flex>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants}>
                      <ButtonComponent
                        size="lg"
                        type="submit"
                        text="Sign In"
                        icon={isLoading && <Loader size={20} />}
                        style={{
                          width: "100%",
                          height: "48px",
                          fontSize: "16px",
                          fontWeight: "600",
                          borderRadius: "lg",
                        }}
                      />
                    </motion.div>
                  </VStack>
                </form>

                {/* Divider */}
                <Flex align="center" my={4}>
                  <Box flex="1" height="1px" bg="gray.200" />
                  <Text px={4} color="gray.500" fontSize="sm">
                    OR
                  </Text>
                  <Box flex="1" height="1px" bg="gray.200" />
                </Flex>

                {/* Sign Up Link */}
                <Box textAlign="center">
                  <Text fontSize="sm" color="gray.600">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      style={{
                        color: ThemeColors.primaryColor,
                        fontWeight: "600",
                        textDecoration: "none",
                      }}
                      _hover={{ textDecoration: "underline" }}
                    >
                      Sign Up
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Box>
          </motion.div>

          {/* Subscription Link */}
          {!ismodal && (
            <motion.div variants={itemVariants}>
              <Box textAlign="center" mt={6}>
                <Link href="/subscription">
                  <Button
                    variant="outline"
                    size="md"
                    borderColor={ThemeColors.primaryColor}
                    color={ThemeColors.primaryColor}
                    borderRadius="lg"
                    _hover={{
                      bg: ThemeColors.primaryColor,
                      color: "white",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                    transition="all 0.2s"
                    fontWeight="600"
                  >
                    View Subscription Packages
                  </Button>
                </Link>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignIn;
