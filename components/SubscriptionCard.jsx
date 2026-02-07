import {
  Box,
  Flex,
  Text,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  HStack,
  Icon,
  Button,
  VStack,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState } from "react";
import { FormatCurr } from "@utils/utils";
import SubscriptionTerms from "./SubscriptionTerms";
import {
  UserPlus,
  Star,
  CheckCircle,
  Clock,
  Truck,
  Shield,
  Gift,
  CreditCard,
  Users,
  Flame,
  Zap,
  Crown,
  Award,
  ChevronRight,
  Info,
  Calendar,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const SubscriptionCard = ({ card, handleClick, onPlanSelect, isSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFamilyPlan = card?.type?.toLowerCase() === "family";
  const isPremiumPlan = card?.type?.toLowerCase() === "premium";
  const isBusinessPlan = card?.type?.toLowerCase() === "business";
  const isStandardPlan = card?.type?.toLowerCase() === "standard";

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const shadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.08)",
    "rgba(0, 0, 0, 0.3)"
  );
  const hoverShadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.15)",
    "rgba(0, 0, 0, 0.5)"
  );

  const getPlanColor = () => {
    if (isPremiumPlan) return "purple";
    if (isFamilyPlan) return "orange";
    if (isBusinessPlan) return "blue";
    if (isStandardPlan) return "green";
    return "green";
  };

  const planColor = getPlanColor();
  const rating = card?.rating ?? 4.5;

  const planIcons = {
    premium: Crown,
    family: Users,
    business: Award,
    standard: CheckCircle,
  };

  const PlanIcon = planIcons[card?.type?.toLowerCase()] || CheckCircle;

  const planBenefits = {
    premium: [
      { icon: Clock, text: "Priority customer support 24/7", color: "purple.500" },
      { icon: Truck, text: "Express delivery within 15-45 min", color: "purple.500" },
      { icon: Gift, text: "Exclusive promotional offers", color: "purple.500" },
      { icon: CreditCard, text: "Micro-credit pay-later option", color: "purple.500" },
      { icon: Zap, text: "Diet insights & nutrition planning", color: "purple.500" },
      { icon: Heart, text: "Unlimited food varieties", color: "purple.500" },
    ],
    family: [
      { icon: Users, text: "2-6 family member accounts", color: "orange.500" },
      { icon: Truck, text: "Express delivery 24/7", color: "orange.500" },
      { icon: Flame, text: "Gas credit for cooking fuel", color: "orange.500" },
      { icon: Gift, text: "Family-exclusive discounts", color: "orange.500" },
      { icon: CreditCard, text: "Family micro-credit option", color: "orange.500" },
      { icon: Shield, text: "Personalized diet insights", color: "orange.500" },
    ],
    business: [
      { icon: Users, text: "10+ employee accounts", color: "blue.500" },
      { icon: Award, text: "Employee meal & wellness cards", color: "blue.500" },
      { icon: Truck, text: "Priority delivery for businesses", color: "blue.500" },
      { icon: Flame, text: "Business gas credit", color: "blue.500" },
      { icon: CreditCard, text: "Flexible business credit line", color: "blue.500" },
      { icon: Calendar, text: "Custom delivery scheduling", color: "blue.500" },
    ],
    standard: [
      { icon: CheckCircle, text: "Standard delivery 1-3 hours", color: "green.500" },
      { icon: Shield, text: "Account activation guarantee", color: "green.500" },
      { icon: Truck, text: "Basic delivery service", color: "green.500" },
      { icon: Gift, text: "Occasional promotions", color: "green.500" },
      { icon: Clock, text: "Standard customer support", color: "green.500" },
      { icon: Heart, text: "Essential food varieties", color: "green.500" },
    ],
  };

  const benefits =
    planBenefits[card?.type?.toLowerCase()] || planBenefits.standard;

  const handleSubscriptionClick = (e) => {
    e.stopPropagation();
    setIsLoading(true);
    handleClick(card?._id);
    setTimeout(() => setIsLoading(false), 1500);
  };

  if (!card || typeof card !== "object") return null;

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{
          y: -8,
          boxShadow: `0 20px 40px ${hoverShadowColor}`,
          transition: { duration: 0.2 },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        width="100%"
        height="100%"
        borderRadius="2xl"
        background={cardBg}
        boxShadow={`0 10px 30px ${shadowColor}`}
        padding={{ base: "1.5rem", md: "2rem" }}
        display="flex"
        flexDirection="column"
        border="2px solid"
        borderColor={isSelected ? `${planColor}.500` : "transparent"}
        position="relative"
        overflow="hidden"
        cursor={onPlanSelect ? "pointer" : "default"}
        onClick={() => onPlanSelect?.(card?.type)}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          bg: isSelected || isFamilyPlan ? `${planColor}.500` : "gray.300",
          opacity: isSelected || isFamilyPlan ? 1 : 0.7,
        }}
      >
        {isFamilyPlan && (
          <MotionBox
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            position="absolute"
            top="16px"
            right="-32px"
            transform="rotate(45deg)"
            bg="linear-gradient(135deg, #F59E0B, #D97706)"
            color="white"
            paddingX="2rem"
            paddingY="0.375rem"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.5px"
            zIndex={10}
            boxShadow="0 4px 12px rgba(245, 158, 11, 0.4)"
          >
            MOST POPULAR
          </MotionBox>
        )}

        <Flex direction="column" align="center" mb={6}>
          <Flex align="center" gap={3} mb={3}>
            <Box
              p={2}
              borderRadius="lg"
              bg={`${planColor}.50`}
              color={`${planColor}.600`}
            >
              <Icon as={PlanIcon} boxSize={6} />
            </Box>
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color={`${planColor}.700`}
              textTransform="capitalize"
            >
              {card?.type} Plan
            </Heading>
          </Flex>

          <Badge
            colorScheme={planColor}
            variant="subtle"
            fontSize="xs"
            fontWeight="semibold"
            px={3}
            py={1}
            borderRadius="full"
            mb={4}
          >
            {isPremiumPlan
              ? "Single User"
              : isFamilyPlan
              ? "2-6 Family Members"
              : isBusinessPlan
              ? "10+ Employees"
              : "Individual User"}
          </Badge>
        </Flex>

        <Box
          bgGradient={`linear(to-r, ${planColor}.50, ${planColor}.100)`}
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          mb={6}
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)",
            backgroundSize: "20px 20px",
            opacity: 0.3,
          }}
        >
          {card?.previousPrice && (
            <Flex justify="center" align="center" mb={2}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.500"
                textDecoration="line-through"
                mr={2}
              >
                UGX {FormatCurr(card.previousPrice)}
              </Text>
              <Badge colorScheme="green" fontSize="xs" borderRadius="md">
                Save {FormatCurr((card.previousPrice ?? 0) - (card.price ?? 0))}
              </Badge>
            </Flex>
          )}

          <Flex direction="column" align="center">
            <Text
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="extrabold"
              color={`${planColor}.700`}
              lineHeight="1"
              mb={1}
            >
              UGX {FormatCurr(card?.price || 0)}
            </Text>
            {card?.price === 0 && (
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Contact for custom pricing
              </Text>
            )}
          </Flex>

          <Box position="absolute" top="-8px" right="-8px">
            <MotionBox
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, 5, -5, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Badge
                colorScheme="green"
                fontSize="xs"
                fontWeight="bold"
                px={3}
                py={1}
                borderRadius="full"
                boxShadow="md"
              >
                25% OFF
              </Badge>
            </MotionBox>
          </Box>
        </Box>

        <VStack spacing={3} align="stretch" flex="1" mb={6}>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="gray.600"
            letterSpacing="wide"
            textTransform="uppercase"
            mb={2}
          >
            Plan Features
          </Text>
          {benefits.map((benefit, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Flex
                align="center"
                gap={3}
                p={2}
                borderRadius="lg"
                _hover={{ bg: `${planColor}.50` }}
              >
                <Icon as={benefit.icon} boxSize={4} color={benefit.color} />
                <Text fontSize="sm" color="gray.700" flex="1">
                  {benefit.text}
                </Text>
              </Flex>
            </MotionBox>
          ))}
        </VStack>

        <Divider my={4} borderColor="gray.200" />

        <Flex justify="space-between" align="center" mb={6}>
          <Flex align="center" gap={2}>
            <HStack spacing={0.5}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= Math.round(rating);
                return (
                  <Icon
                    key={star}
                    as={Star}
                    boxSize={4}
                    color={isFilled ? "yellow.400" : "gray.300"}
                    fill={isFilled ? "currentColor" : "none"}
                  />
                );
              })}
            </HStack>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              {Number(rating).toFixed(1)}
            </Text>
          </Flex>
          <Text fontSize="xs" color="gray.500">
            {card?.ratingCount ?? 128} reviews
          </Text>
        </Flex>

        <MotionButton
          size="lg"
          colorScheme={planColor}
          borderRadius="xl"
          height="52px"
          fontWeight="bold"
          fontSize="md"
          isLoading={isLoading}
          loadingText="Processing..."
          rightIcon={<ChevronRight size={20} />}
          onClick={handleSubscriptionClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          boxShadow="md"
          mb={4}
          _hover={{
            boxShadow: "lg",
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)" }}
        >
          Subscribe to {card?.type}
        </MotionButton>

        <Flex justify="center" mb={4}>
          <Button
            variant="link"
            color={`${planColor}.600`}
            fontSize="sm"
            fontWeight="medium"
            leftIcon={<UserPlus size={16} />}
            _hover={{ color: `${planColor}.700`, textDecoration: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              const inviteSection = document.getElementById("refer");
              inviteSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Invite Friend to Test
          </Button>
        </Flex>

        <Box
          p={3}
          bg="blue.50"
          borderRadius="lg"
          border="1px solid"
          borderColor="blue.200"
          position="relative"
        >
          <Flex align="center" gap={2} mb={1}>
            <Icon as={Truck} boxSize={4} color="blue.500" />
            <Text fontSize="xs" fontWeight="bold" color="blue.700">
              Delivery Terms:
            </Text>
          </Flex>
          <Flex wrap="wrap" gap={1} fontSize="xs" color="blue.600">
            <Text as="span" fontWeight="medium">
              Free:
            </Text>
            <Text as="span">Within 3km</Text>
            <Text as="span" mx={1}>
              •
            </Text>
            <Text as="span" fontWeight="medium">
              Extra:
            </Text>
            <Text as="span">950 UGX/km beyond 3km</Text>
          </Flex>
        </Box>

        <Flex justify="center" mt={4}>
          <Button
            variant="ghost"
            size="sm"
            fontSize="xs"
            color="gray.500"
            _hover={{ color: `${planColor}.600`, bg: `${planColor}.50` }}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            rightIcon={<Info size={14} />}
          >
            View Terms & Conditions
          </Button>
        </Flex>
      </MotionBox>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "xl", lg: "2xl" }}
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="2xl"
          overflow="hidden"
          maxHeight={{ base: "100vh", md: "90vh" }}
        >
          <ModalBody p={0}>
            <SubscriptionTerms handleModalClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubscriptionCard;
