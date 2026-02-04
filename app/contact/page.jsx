"use client";

import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
  Button,
  Icon,
  ScaleFade,
  Fade,
  SlideFade,
  Container,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useMessagePostMutation } from "@slices/usersApiSlice";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock } from "react-icons/hi";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);

  const [sendMessage, { isLoading: isSending }] = useMessagePostMutation();
  const chakraToast = useToast();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const validate = () => {
    const err = {};
    if (!name || !name.trim()) err.name = "Please enter your name";
    if (!email || !email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Please enter a valid email";
    if (!message || !message.trim()) err.message = "Please enter your message";
    if (message.trim().length < 10) err.message = "Message must be at least 10 characters";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await sendMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      }).unwrap();

      if (res.status === "Success") {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
        setFormErrors({});

        chakraToast({
          title: "Message Sent!",
          description: res?.data?.message ?? "We'll get back to you within 24 hours.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
          icon: <FiCheckCircle />,
        });

        // Reset success state after animation
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (err) {
      chakraToast({
        title: "Sending Failed",
        description: err?.data?.message ?? "Please try again or contact us directly.",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Contact info data
  const contactInfo = [
    {
      icon: HiOutlineLocationMarker,
      title: "Visit Us",
      details: "123 Business Street, Suite 100\nNew York, NY 10001",
    },
    {
      icon: HiOutlinePhone,
      title: "Call Us",
      details: "+1 (555) 123-4567\nMon-Fri: 9AM-6PM EST",
    },
    {
      icon: HiOutlineClock,
      title: "Response Time",
      details: "Within 24 hours\nTypically 2-4 hours",
    },
  ];

  return (
    <Box
      as="section"
      id="contact"
      position="relative"
      overflow="hidden"
      bgGradient="linear(to-b, white, gray.50)"
      minH="100vh"
      py={{ base: "5rem", md: "6rem", xl: "7rem" }}
    >
      {/* Background decorative elements - YooKatale themed */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="green.50"
        opacity="0.6"
        filter="blur(60px)"
        zIndex="0"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-10%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="green.50"
        opacity="0.4"
        filter="blur(50px)"
        zIndex="0"
      />

      <Container maxW="container.xl" position="relative" zIndex="1">
        <VStack spacing={{ base: 8, md: 12 }}>
          {/* Header Section */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            textAlign="center"
            maxW="800px"
          >
            <MotionBox variants={itemVariants}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={ThemeColors.primaryColor}
                letterSpacing="wide"
                textTransform="uppercase"
                mb="3"
              >
                Get In Touch
              </Text>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Heading
                as="h2"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="shorter"
                mb="4"
                bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                bgClip="text"
              >
                Let's Start a Conversation
              </Heading>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.600"
                maxW="600px"
                mx="auto"
                lineHeight="tall"
              >
                Have questions or ready to collaborate? Send us a message and our team will respond promptly.
              </Text>
            </MotionBox>
          </MotionBox>

          {/* Contact Cards */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={{ base: 6, md: 8 }}
            width="full"
            mb={{ base: 8, md: 12 }}
          >
            {contactInfo.map((info, index) => (
              <MotionBox
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ScaleFade in={true} delay={index * 0.1}>
                  <VStack
                    spacing="4"
                    p="6"
                    bg="white"
                    borderRadius="xl"
                    boxShadow="lg"
                    border="1px solid"
                    borderColor="gray.100"
                    textAlign="center"
                    height="full"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "xl",
                      borderColor: ThemeColors.primaryColor,
                    }}
                  >
                    <Flex
                      w="60px"
                      h="60px"
                      align="center"
                      justify="center"
                      borderRadius="full"
                      bgGradient="linear(to-br, green.50, green.100)"
                      color={ThemeColors.primaryColor}
                    >
                      <Icon as={info.icon} boxSize="28px" />
                    </Flex>
                    <Text fontWeight="semibold" fontSize="lg">
                      {info.title}
                    </Text>
                    <Text color="gray.600" whiteSpace="pre-line" fontSize="sm">
                      {info.details}
                    </Text>
                  </VStack>
                </ScaleFade>
              </MotionBox>
            ))}
          </Grid>

          {/* Form Section */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 8, lg: 12 }}
            width="full"
            align="stretch"
          >
            <MotionBox
              flex="1"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SlideFade in={true} offsetY="20px">
                <Box
                  p={{ base: 6, md: 8 }}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  height="full"
                  ref={formRef}
                >
                  <form onSubmit={handleSubmit}>
                    <VStack spacing="6" align="stretch">
                      <ScaleFade in={!isSubmitted} unmountOnExit>
                        <Grid
                          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                          gap="6"
                        >
                          <FormControl isInvalid={!!formErrors.name}>
                            <FormLabel htmlFor="name" fontWeight="medium" color="gray.700">
                              <HStack spacing="2">
                                <Icon as={FiUser} color="gray.500" />
                                <Text>Full Name</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              type="text"
                              placeholder="John Doe"
                              name="name"
                              value={name}
                              size="lg"
                              variant="filled"
                              bg="gray.50"
                              border="2px solid"
                              borderColor="transparent"
                              _hover={{ bg: "gray.100" }}
                              _focus={{
                                bg: "white",
                                borderColor: ThemeColors.primaryColor,
                                boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
                              }}
                              onChange={(e) => {
                                setName(e.target.value);
                                if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
                              }}
                            />
                            <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!formErrors.email}>
                            <FormLabel htmlFor="email" fontWeight="medium" color="gray.700">
                              <HStack spacing="2">
                                <Icon as={FiMail} color="gray.500" />
                                <Text>Email Address</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              name="email"
                              value={email}
                              size="lg"
                              variant="filled"
                              bg="gray.50"
                              border="2px solid"
                              borderColor="transparent"
                              _hover={{ bg: "gray.100" }}
                              _focus={{
                                bg: "white",
                                borderColor: ThemeColors.primaryColor,
                                boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
                              }}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (formErrors.email) setFormErrors((p) => ({ ...p, email: "" }));
                              }}
                            />
                            <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                          </FormControl>
                        </Grid>

                        <FormControl isInvalid={!!formErrors.message} mt="6">
                          <FormLabel htmlFor="message" fontWeight="medium" color="gray.700">
                            <HStack spacing="2">
                              <Icon as={FiMessageSquare} color="gray.500" />
                              <Text>Your Message</Text>
                            </HStack>
                          </FormLabel>
                          <Textarea
                            name="message"
                            value={message}
                            placeholder="Tell us about your project or question..."
                            size="lg"
                            minH="180px"
                            variant="filled"
                            bg="gray.50"
                            border="2px solid"
                            borderColor="transparent"
                            resize="vertical"
                            _hover={{ bg: "gray.100" }}
                            _focus={{
                              bg: "white",
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
                            }}
                            onChange={(e) => {
                              setMessage(e.target.value);
                              if (formErrors.message) setFormErrors((p) => ({ ...p, message: "" }));
                            }}
                          />
                          <Flex justify="space-between" align="center" mt="2">
                            <FormErrorMessage>{formErrors.message}</FormErrorMessage>
                            <Text
                              fontSize="sm"
                              color={message.length >= 10 ? "green.500" : "gray.400"}
                            >
                              {message.length}/500
                            </Text>
                          </Flex>
                        </FormControl>
                      </ScaleFade>

                      <MotionButton
                        type="submit"
                        size="lg"
                        bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                        color="white"
                        _hover={{
                          bgGradient: `linear(to-r, ${ThemeColors.darkColor}, ${ThemeColors.primaryColor})`,
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        _active={{
                          transform: "translateY(0)",
                        }}
                        isLoading={isSending}
                        loadingText="Sending..."
                        leftIcon={<FiSend />}
                        isDisabled={isSending}
                        height="56px"
                        borderRadius="xl"
                        fontWeight="semibold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Send Message
                      </MotionButton>
                    </VStack>
                  </form>
                </Box>
              </SlideFade>
            </MotionBox>

            {/* Success Message */}
            <MotionBox
              flex="1"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Fade in={isSubmitted}>
                <VStack
                  spacing="6"
                  p={{ base: 6, md: 8 }}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  height="full"
                  justify="center"
                  textAlign="center"
                >
                  <MotionBox
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Flex
                      w="80px"
                      h="80px"
                      align="center"
                      justify="center"
                      borderRadius="full"
                      bg="green.50"
                      mx="auto"
                      mb="6"
                    >
                      <Icon as={FiCheckCircle} boxSize="40px" color="green.500" />
                    </Flex>
                  </MotionBox>
                  <Heading size="lg" color={ThemeColors.primaryColor}>
                    Message Sent Successfully!
                  </Heading>
                  <Text color="gray.600" fontSize="lg">
                    Thank you for reaching out. We've received your message and will respond within 24 hours.
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Check your email for a confirmation message.
                  </Text>
                </VStack>
              </Fade>
            </MotionBox>
          </Flex>

          {/* Additional Info */}
          <MotionBox
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            textAlign="center"
            mt="8"
          >
            <Text color="gray.500" fontSize="sm">
              We typically respond within 2-4 hours during business hours. For urgent matters,
              please call us directly.
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default Contact;
