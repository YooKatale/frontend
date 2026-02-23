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
  Link,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useMessagePostMutation } from "@slices/usersApiSlice";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

// YooKatale contact details
const YOOKATALE_CONTACT = {
  phone: "+256 786 118137",
  phoneRaw: "+256786118137",
  whatsapp: "256786118137",
  email: "support@yookatale.app",
  address: "P.O. Box 74940, Clock-Tower Plot 6, Kampala · Entebbe, Uganda",
  addressMapUrl: "https://www.google.com/maps/search/Clock+Tower+Plot+6+Kampala+Uganda",
  businessHours: "Mon–Sat 8am–8pm EAT",
  responseTime: "Within 24 hours · Usually 2–4 hours",
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);

  const [sendMessage, { isLoading: isSending }] = useMessagePostMutation();
  const chakraToast = useToast();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 },
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

  const contactCards = [
    {
      icon: HiOutlineLocationMarker,
      title: "Visit Us",
      details: YOOKATALE_CONTACT.address,
      href: YOOKATALE_CONTACT.addressMapUrl,
      label: "Get directions",
    },
    {
      icon: HiOutlinePhone,
      title: "Call Us",
      details: YOOKATALE_CONTACT.phone,
      sub: YOOKATALE_CONTACT.businessHours,
      href: `tel:${YOOKATALE_CONTACT.phoneRaw}`,
      label: "Call now",
    },
    {
      icon: HiOutlineClock,
      title: "Response Time",
      details: YOOKATALE_CONTACT.responseTime,
      sub: "We reply quickly",
    },
  ];

  return (
    <Box
      as="section"
      id="contact"
      position="relative"
      overflow="hidden"
      bg="gray.50"
      minH="100vh"
      py={{ base: 8, md: 12, xl: 16 }}
    >
      {/* Subtle background */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w={{ base: "200px", md: "360px" }}
        h={{ base: "200px", md: "360px" }}
        borderRadius="full"
        bg={ThemeColors.primaryColor}
        opacity={0.04}
        filter="blur(80px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-5%"
        left="-5%"
        w={{ base: "180px", md: "280px" }}
        h={{ base: "180px", md: "280px" }}
        borderRadius="full"
        bg={ThemeColors.secondaryColor}
        opacity={0.05}
        filter="blur(60px)"
        zIndex={0}
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Hero */}
          <VStack spacing={4} textAlign="center" maxW="720px" mx="auto" mb={{ base: 10, md: 14 }}>
            <MotionBox variants={itemVariants}>
              <Text
                fontSize="xs"
                fontWeight="700"
                color={ThemeColors.primaryColor}
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Get in touch
              </Text>
            </MotionBox>
            <MotionBox variants={itemVariants}>
              <Heading
                as="h1"
                fontSize={{ base: "2.5rem", md: "3.5rem", lg: "4rem" }}
                fontWeight="800"
                lineHeight="1.1"
                letterSpacing="tight"
                color="gray.900"
              >
                Contact{" "}
                <Box as="span" color={ThemeColors.primaryColor}>
                  YooKatale
                </Box>
              </Heading>
            </MotionBox>
            <MotionBox variants={itemVariants}>
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" lineHeight="tall">
                Questions, orders, or partnerships? Send a message or call us. We’re here to help.
              </Text>
            </MotionBox>

            {/* Quick contact strip */}
            <MotionBox variants={itemVariants} w="full" pt={2}>
              <Flex
                flexWrap="wrap"
                justify="center"
                gap={3}
                p={4}
                borderRadius="xl"
                bg="white"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <Button
                  as={Link}
                  href={`tel:${YOOKATALE_CONTACT.phoneRaw}`}
                  size="sm"
                  colorScheme="green"
                  leftIcon={<HiOutlinePhone />}
                  _hover={{ textDecoration: "none" }}
                >
                  {YOOKATALE_CONTACT.phone}
                </Button>
                <Button
                  as={Link}
                  href={`https://wa.me/${YOOKATALE_CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  leftIcon={<FaWhatsapp />}
                  _hover={{ textDecoration: "none" }}
                >
                  WhatsApp
                </Button>
                <Button
                  as={Link}
                  href={`mailto:${YOOKATALE_CONTACT.email}`}
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  leftIcon={<FiMail />}
                  _hover={{ textDecoration: "none" }}
                >
                  {YOOKATALE_CONTACT.email}
                </Button>
              </Flex>
            </MotionBox>
          </VStack>

          {/* Contact cards */}
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 4, md: 6 }}
            mb={{ base: 10, md: 14 }}
          >
            {contactCards.map((card, index) => (
              <MotionBox key={card.title} variants={itemVariants}>
                <ScaleFade in initialDelay={index * 0.08}>
                  <Box
                    as={card.href ? Link : Box}
                    href={card.href}
                    target={card.href?.startsWith("http") ? "_blank" : undefined}
                    rel={card.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    _hover={card.href ? { textDecoration: "none" } : undefined}
                    p={6}
                    h="full"
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                    transition="all 0.2s ease"
                    _hover={{
                      borderColor: ThemeColors.primaryColor,
                      boxShadow: "md",
                      transform: "translateY(-2px)",
                    }}
                  >
                    <Flex
                      w="12"
                      h="12"
                      align="center"
                      justify="center"
                      borderRadius="xl"
                      bg={`${ThemeColors.primaryColor}12`}
                      color={ThemeColors.primaryColor}
                      mb={4}
                    >
                      <Icon as={card.icon} boxSize="6" />
                    </Flex>
                    <Text fontWeight="700" fontSize="lg" color="gray.900" mb={2}>
                      {card.title}
                    </Text>
                    <Text color="gray.600" fontSize="sm" lineHeight="tall" whiteSpace="pre-line">
                      {card.details}
                    </Text>
                    {card.sub && (
                      <Text color="gray.500" fontSize="xs" mt={2}>
                        {card.sub}
                      </Text>
                    )}
                    {card.label && (
                      <Text
                        mt={3}
                        fontSize="sm"
                        fontWeight="600"
                        color={ThemeColors.primaryColor}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {card.label} →
                      </Text>
                    )}
                  </Box>
                </ScaleFade>
              </MotionBox>
            ))}
          </SimpleGrid>

          <Divider borderColor="gray.200" mb={{ base: 8, md: 12 }} />

          {/* Form + success */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 8, lg: 12 }}
            align="stretch"
          >
            <MotionBox flex="1" variants={itemVariants}>
              <SlideFade in offsetY="12px">
                <Box
                  p={{ base: 6, md: 8 }}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  ref={formRef}
                >
                  <Heading size="md" mb={6} color="gray.800">
                    Send a message
                  </Heading>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={5} align="stretch">
                      <ScaleFade in={!isSubmitted} unmountOnExit>
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
                          <FormControl isInvalid={!!formErrors.name}>
                            <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                              Full name
                            </FormLabel>
                            <Input
                              type="text"
                              placeholder="e.g. Nakato Okello"
                              name="name"
                              value={name}
                              size="lg"
                              variant="outline"
                              border="2px solid"
                              borderColor="gray.200"
                              _placeholder={{ color: "gray.400" }}
                              _hover={{ borderColor: "gray.300" }}
                              _focus={{
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
                            <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                              Email address
                            </FormLabel>
                            <Input
                              type="email"
                              placeholder="e.g. nakato.okello@gmail.com"
                              name="email"
                              value={email}
                              size="lg"
                              variant="outline"
                              border="2px solid"
                              borderColor="gray.200"
                              _placeholder={{ color: "gray.400" }}
                              _hover={{ borderColor: "gray.300" }}
                              _focus={{
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

                        <FormControl isInvalid={!!formErrors.message} mt={2}>
                          <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                            Your message
                          </FormLabel>
                          <Textarea
                            name="message"
                            value={message}
                            placeholder="Tell us what you need—orders, partnerships, or general questions..."
                            size="lg"
                            minH="160px"
                            variant="outline"
                            border="2px solid"
                            borderColor="gray.200"
                            _placeholder={{ color: "gray.400" }}
                            _hover={{ borderColor: "gray.300" }}
                            _focus={{
                              borderColor: ThemeColors.primaryColor,
                              boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
                            }}
                            resize="vertical"
                            onChange={(e) => {
                              setMessage(e.target.value);
                              if (formErrors.message) setFormErrors((p) => ({ ...p, message: "" }));
                            }}
                          />
                          <Flex justify="space-between" align="center" mt={2}>
                            <FormErrorMessage>{formErrors.message}</FormErrorMessage>
                            <Text fontSize="xs" color={message.length >= 10 ? "green.600" : "gray.400"}>
                              {message.length}/500
                            </Text>
                          </Flex>
                        </FormControl>
                      </ScaleFade>

                      <MotionButton
                        type="submit"
                        size="lg"
                        w="full"
                        bg={ThemeColors.primaryColor}
                        color="white"
                        _hover={{
                          bg: ThemeColors.darkColor,
                          transform: "translateY(-1px)",
                          boxShadow: "lg",
                        }}
                        _active={{ transform: "translateY(0)" }}
                        isLoading={isSending}
                        loadingText="Sending..."
                        leftIcon={<FiSend />}
                        isDisabled={isSending}
                        h="52px"
                        borderRadius="xl"
                        fontWeight="700"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Send message
                      </MotionButton>
                    </VStack>
                  </form>
                </Box>
              </SlideFade>
            </MotionBox>

            {/* Success state */}
            <MotionBox flex="1" variants={itemVariants}>
              <Fade in={isSubmitted}>
                <VStack
                  spacing={5}
                  p={{ base: 6, md: 8 }}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  h="full"
                  justify="center"
                  textAlign="center"
                >
                  <Flex
                    w="16"
                    h="16"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="green.50"
                    color="green.500"
                  >
                    <Icon as={FiCheckCircle} boxSize="8" />
                  </Flex>
                  <Heading size="md" color="gray.900">
                    Message sent!
                  </Heading>
                  <Text color="gray.600">
                    We’ve received your message and will get back to you within 24 hours.
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Check your email for confirmation.
                  </Text>
                </VStack>
              </Fade>
            </MotionBox>
          </Flex>

          <Text textAlign="center" color="gray.500" fontSize="sm" mt={8}>
            We usually reply within 2–4 hours during business hours. For urgent requests, call or WhatsApp us.
          </Text>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Contact;
