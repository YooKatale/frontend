"use client";

import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Container,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiEye,
  FiBook,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiGlobe,
  FiShield,
  FiStar,
  FiAward,
  FiZap,
  FiCompass,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

const MotionBox = motion(Box);

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const coreValues = [
    { icon: FiUsers, text: "Focus on the customer.", color: "green.500" },
    { icon: FiHeart, text: "Respect everyone.", color: "pink.500" },
    { icon: FiZap, text: "Simplify everything.", color: "yellow.500" },
    { icon: FiStar, text: "Be authentic & curious.", color: "green.600" },
    { icon: FiTrendingUp, text: "Respect opportunities.", color: "green.500" },
    { icon: FiShield, text: "Never give up.", color: "red.500" },
  ];

  const stats = [
    { label: "Food Categories", value: "50+" },
    { label: "Communities Served", value: "100+" },
    { label: "Countries", value: "3+" },
    { label: "Happy Customers", value: "10K+" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      as="section"
      id="about"
      position="relative"
      overflow="hidden"
      bg="white"
      ref={sectionRef}
    >
      {/* Background Elements - YooKatale themed */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="green.50"
        opacity="0.4"
        filter="blur(40px)"
        transform="translate(30%, -30%)"
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="green.50"
        opacity="0.3"
        filter="blur(50px)"
        transform="translate(-30%, 30%)"
      />

      <Container maxW="container.xl" position="relative" zIndex="1" py={{ base: "5rem", md: "6rem", xl: "8rem" }}>
        <VStack spacing={{ base: 12, md: 16 }} align="stretch">
          {/* Header Section */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            textAlign="center"
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
                Our Story
              </Text>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="shorter"
                mb="4"
                bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                bgClip="text"
              >
                Transforming Food Access Across Africa
              </Heading>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Box
                height="4px"
                width="100px"
                margin="1rem auto"
                background={`linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                borderRadius="full"
              />
            </MotionBox>
          </MotionBox>

          {/* Main Content */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 8, lg: 12 }}
            align="stretch"
          >
            {/* Left Column - About Text */}
            <MotionBox
              flex={1}
              variants={fadeInUp}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
            >
              <VStack
                spacing={6}
                p={{ base: 6, md: 8 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.100"
                height="full"
                align="start"
              >
                <Icon as={FiGlobe} boxSize="48px" color={ThemeColors.primaryColor} />
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="tall"
                  color="gray.700"
                  textAlign="justify"
                >
                  <Text as="span" fontWeight="bold" color={ThemeColors.primaryColor}>
                    YooKatale
                  </Text>{" "}
                  is a revolutionary mobile food marketplace connecting farmers, vendors, and consumers across
                  Uganda and beyond. We're building Africa's largest digital food network that promotes diverse
                  food products while maintaining affordability and exceptional quality.
                </Text>
              </VStack>
            </MotionBox>

            {/* Right Column - Mission & Vision */}
            <MotionBox
              flex={1}
              variants={fadeInUp}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} height="full">
                {/* Mission Card */}
                <MotionBox
                  variants={scaleIn}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <VStack
                    spacing={4}
                    p={6}
                    bgGradient="linear(to-br, green.50, green.100)"
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor="green.200"
                    height="full"
                    textAlign="center"
                    align="center"
                  >
                    <Flex
                      w="60px"
                      h="60px"
                      align="center"
                      justify="center"
                      borderRadius="full"
                      bg="white"
                      boxShadow="md"
                    >
                      <Icon as={FiTarget} boxSize="28px" color={ThemeColors.primaryColor} />
                    </Flex>
                    <Heading as="h3" size="lg" color={ThemeColors.primaryColor}>
                      Our Mission
                    </Heading>
                    <Text
                      fontSize="lg"
                      color={ThemeColors.darkColor}
                      fontWeight="medium"
                      lineHeight="tall"
                    >
                      To make healthy, affordable food accessible to every community.
                    </Text>
                  </VStack>
                </MotionBox>

                {/* Vision Card */}
                <MotionBox
                  variants={scaleIn}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  transition={{ delay: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <VStack
                    spacing={4}
                    p={6}
                    bgGradient="linear(to-br, green.100, green.50)"
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor="green.200"
                    height="full"
                    textAlign="center"
                    align="center"
                  >
                    <Flex
                      w="60px"
                      h="60px"
                      align="center"
                      justify="center"
                      borderRadius="full"
                      bg="white"
                      boxShadow="md"
                    >
                      <Icon as={FiEye} boxSize="28px" color={ThemeColors.secondaryColor} />
                    </Flex>
                    <Heading as="h3" size="lg" color={ThemeColors.primaryColor}>
                      Our Vision
                    </Heading>
                    <Text
                      fontSize="lg"
                      color={ThemeColors.darkColor}
                      fontWeight="medium"
                      lineHeight="tall"
                    >
                      To build the most connected food ecosystem in Africa.
                    </Text>
                  </VStack>
                </MotionBox>
              </Grid>
            </MotionBox>
          </Flex>

          {/* Stats Section */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
              gap={{ base: 4, md: 8 }}
              mt={{ base: 8, md: 12 }}
            >
              {stats.map((stat, index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                >
                  <VStack
                    spacing={3}
                    p={{ base: 4, md: 6 }}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="lg"
                    border="1px solid"
                    borderColor="gray.100"
                    textAlign="center"
                  >
                    <Text
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="bold"
                      color={ThemeColors.primaryColor}
                    >
                      {stat.value}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {stat.label}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </Grid>
          </MotionBox>

          {/* Manifesto Section */}
          <MotionBox
            variants={fadeInUp}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ delay: 0.6 }}
          >
            <VStack
              spacing={6}
              p={{ base: 6, md: 8 }}
              bgGradient="linear(to-br, green.50, green.100)"
              borderRadius="2xl"
              border="2px solid"
              borderColor="green.100"
              textAlign="center"
            >
              <Flex
                w="70px"
                h="70px"
                align="center"
                justify="center"
                borderRadius="full"
                bg="white"
                mx="auto"
                boxShadow="lg"
              >
                <Icon as={FiBook} boxSize="32px" color={ThemeColors.primaryColor} />
              </Flex>
              <Heading as="h3" size="lg" color={ThemeColors.primaryColor}>
                Our Manifesto
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.700"
                lineHeight="tall"
                maxW="800px"
                mx="auto"
                fontStyle="italic"
              >
                "At YooKatale, we believe in building communities through food. We're not just a marketplace—we're
                a movement that lifts others with love, trust, and shared prosperity. We're creating happy, healthy
                communities by connecting people to the food they love and the farmers who grow it."
              </Text>
            </VStack>
          </MotionBox>

          {/* Core Values */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <VStack spacing={8}>
              <MotionBox variants={itemVariants}>
                <VStack spacing={3} textAlign="center">
                  <Icon as={FiAward} boxSize="48px" color={ThemeColors.primaryColor} />
                  <Heading as="h3" size="xl" color="gray.800">
                    Our Core Values
                  </Heading>
                  <Box
                    height="3px"
                    width="80px"
                    background={`linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                    borderRadius="full"
                  />
                </VStack>
              </MotionBox>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                gap={{ base: 4, md: 6 }}
                width="full"
              >
                {coreValues.map((value, index) => (
                  <MotionBox
                    key={index}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -5 }}
                  >
                    <HStack
                      spacing={4}
                      p={{ base: 4, md: 5 }}
                      bg="white"
                      borderRadius="xl"
                      boxShadow="lg"
                      border="1px solid"
                      borderColor="gray.100"
                      align="start"
                      transition="all 0.3s"
                      _hover={{
                        boxShadow: "xl",
                        borderColor: value.color,
                      }}
                    >
                      <Flex
                        w="40px"
                        h="40px"
                        align="center"
                        justify="center"
                        borderRadius="lg"
                        bg={`${value.color.split(".")[0]}.100`}
                        flexShrink={0}
                      >
                        <Icon as={value.icon} color={value.color} />
                      </Flex>
                      <Text fontWeight="medium" color="gray.700">
                        {value.text}
                      </Text>
                    </HStack>
                  </MotionBox>
                ))}
              </Grid>
            </VStack>
          </MotionBox>

          {/* Culture & Hybrid Structure */}
          <Grid
            templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
            gap={{ base: 8, lg: 12 }}
            mt={{ base: 8, md: 12 }}
          >
            {/* Culture */}
            <MotionBox
              variants={fadeInUp}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -5 }}
            >
              <VStack
                spacing={6}
                p={{ base: 6, md: 8 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.100"
                height="full"
                align="start"
              >
                <HStack spacing={4}>
                  <Flex
                    w="50px"
                    h="50px"
                    align="center"
                    justify="center"
                    borderRadius="lg"
                    bg="green.50"
                  >
                    <Icon as={FiZap} boxSize="24px" color={ThemeColors.primaryColor} />
                  </Flex>
                  <Heading as="h3" size="lg" color="gray.800">
                    Our Culture
                  </Heading>
                </HStack>
                <Text fontSize="lg" color="gray.600" lineHeight="tall">
                  We're pioneers in hybrid technology solutions. By blending physical infrastructure with
                  cutting-edge digital platforms, we're solving real-world food accessibility problems while
                  building a sustainable future for African agriculture.
                </Text>
              </VStack>
            </MotionBox>

            {/* Hybrid Structure */}
            <MotionBox
              variants={fadeInUp}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <VStack
                spacing={6}
                p={{ base: 6, md: 8 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.100"
                height="full"
                align="start"
              >
                <HStack spacing={4}>
                  <Flex
                    w="50px"
                    h="50px"
                    align="center"
                    justify="center"
                    borderRadius="lg"
                    bg="green.50"
                  >
                    <Icon as={FiCompass} boxSize="24px" color={ThemeColors.secondaryColor} />
                  </Flex>
                  <Heading as="h3" size="lg" color="gray.800">
                    Our Structure
                  </Heading>
                </HStack>
                <Text fontSize="lg" color="gray.600" lineHeight="tall">
                  We operate with a unique customer-first hierarchy: Customers guide our innovations,
                  empowered employees drive our growth, and sustainable value for stakeholders ensures
                  long-term impact. This triple-focus approach creates a balanced ecosystem where
                  everyone thrives together.
                </Text>
              </VStack>
            </MotionBox>
          </Grid>

          {/* Call to Action */}
          <MotionBox
            variants={fadeInUp}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ delay: 0.9 }}
            textAlign="center"
            pt={{ base: 8, md: 12 }}
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="medium"
              color="gray.700"
              maxW="600px"
              mx="auto"
            >
              Join us in revolutionizing how Africa eats, grows, and shares food.
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default About;
