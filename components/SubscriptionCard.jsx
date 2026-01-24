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
  Tooltip,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState } from "react";
import { FormatCurr } from "@utils/utils";
import SubscriptionTerms from "./SubscriptionTerms";
import {
  UserPlus,
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
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { usePlanRatingCreateMutation, useGetPlanRatingsQuery } from "@slices/usersApiSlice";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const SubscriptionCard = ({ card, handleClick, onPlanSelect, isSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [planRating, setPlanRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingEffect, setRatingEffect] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const planType = card?.type?.toLowerCase() || "standard";
  const [createPlanRating] = usePlanRatingCreateMutation();
  const { data: ratingsData, refetch: refetchRatings } = useGetPlanRatingsQuery(
    { planType, context: "test_plan" },
    { skip: !planType }
  );
  const avgRating = ratingsData?.data?.average ?? 0;
  const totalRatings = ratingsData?.data?.total ?? 0;

  const handleSubmitRating = async (e) => {
    e?.stopPropagation();
    if (planRating < 1) return;
    if (!userInfo?._id) {
      toast({ title: "Login required to rate", status: "warning", duration: 3000, isClosable: true });
      router.push("/signin");
      return;
    }
    try {
      await createPlanRating({
        userId: userInfo._id,
        planType,
        context: "test_plan",
        rating: planRating,
        userEmail: userInfo?.email || null,
        userName: userInfo?.name || null,
      }).unwrap();
      setRatingSubmitted(true);
      setRatingEffect(true);
      refetchRatings();
      setTimeout(() => setRatingEffect(false), 600);
      toast({ title: "Thanks for your rating!", status: "success", duration: 2000, isClosable: true });
    } catch (err) {
      toast({
        title: "Could not submit rating",
        description: err?.data?.message || err?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  const themeBg = `${ThemeColors.primaryColor}12`;
  const themeBorder = `${ThemeColors.primaryColor}30`;

  const planIcons = {
    premium: Crown,
    family: Users,
    business: Award,
    standard: CheckCircle,
  };

  const PlanIcon = planIcons[card?.type?.toLowerCase()] || CheckCircle;

  const planBenefits = {
    premium: [
      { icon: Clock, text: "Priority customer support 24/7" },
      { icon: Truck, text: "Express delivery within 15-45 min" },
      { icon: Gift, text: "Exclusive promotional offers" },
      { icon: CreditCard, text: "Micro-credit pay-later option" },
      { icon: Zap, text: "Diet insights & nutrition planning" },
      { icon: Heart, text: "Unlimited food varieties" },
    ],
    family: [
      { icon: Users, text: "2-6 family member accounts" },
      { icon: Truck, text: "Express delivery 24/7" },
      { icon: Flame, text: "Gas credit for cooking fuel" },
      { icon: Gift, text: "Family-exclusive discounts" },
      { icon: CreditCard, text: "Family micro-credit option" },
      { icon: Shield, text: "Personalized diet insights" },
    ],
    business: [
      { icon: Users, text: "10+ employee accounts" },
      { icon: Award, text: "Employee meal & wellness cards" },
      { icon: Truck, text: "Priority delivery for businesses" },
      { icon: Flame, text: "Business gas credit" },
      { icon: CreditCard, text: "Flexible business credit line" },
      { icon: Calendar, text: "Custom delivery scheduling" },
    ],
    standard: [
      { icon: CheckCircle, text: "Standard delivery 1-3 hours" },
      { icon: Shield, text: "Account activation guarantee" },
      { icon: Truck, text: "Basic delivery service" },
      { icon: Gift, text: "Occasional promotions" },
      { icon: Clock, text: "Standard customer support" },
      { icon: Heart, text: "Essential food varieties" },
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
        borderColor={isSelected ? ThemeColors.primaryColor : "transparent"}
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
          bg: isSelected || isFamilyPlan ? ThemeColors.primaryColor : "gray.300",
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
              bg={themeBg}
              color={ThemeColors.primaryColor}
              border="1px solid"
              borderColor={themeBorder}
            >
              <Icon as={PlanIcon} boxSize={6} />
            </Box>
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color={ThemeColors.primaryColor}
              textTransform="capitalize"
            >
              {card?.type} Plan
            </Heading>
          </Flex>

          <Badge
            bg={ThemeColors.primaryColor}
            color="white"
            variant="solid"
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
          bg={themeBg}
          border="1px solid"
          borderColor={themeBorder}
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          mb={6}
          position="relative"
          overflow="hidden"
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
              <Badge bg={ThemeColors.secondaryColor} color="white" fontSize="xs" borderRadius="md">
                Save {FormatCurr(card.previousPrice - card.price)}
              </Badge>
            </Flex>
          )}

          <Flex direction="column" align="center">
            <Text
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="extrabold"
              color={ThemeColors.primaryColor}
              lineHeight="1"
              mb={1}
            >
              UGX {FormatCurr(card?.price || 0)}
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {card?.price === 0 ? "Contact for custom pricing" : "per month"}
            </Text>
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
                bg={ThemeColors.primaryColor}
                color="white"
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
                _hover={{ bg: themeBg }}
              >
                <Icon as={benefit.icon} boxSize={4} color={ThemeColors.primaryColor} />
                <Text fontSize="sm" color="gray.700" flex="1">
                  {benefit.text}
                </Text>
              </Flex>
            </MotionBox>
          ))}
        </VStack>

        <Divider my={4} borderColor="gray.200" />

        <MotionButton
          size="lg"
          bg={ThemeColors.primaryColor}
          color="white"
          _hover={{ bg: ThemeColors.secondaryColor, boxShadow: "lg", transform: "translateY(-2px)" }}
          _active={{ transform: "translateY(0)" }}
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
        >
          Subscribe to {card?.type}
        </MotionButton>

        <Flex justify="center" mb={4}>
          <Button
            variant="link"
            color={ThemeColors.primaryColor}
            fontSize="sm"
            fontWeight="medium"
            leftIcon={<UserPlus size={16} />}
            _hover={{ color: ThemeColors.secondaryColor, textDecoration: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              const inviteSection = document.getElementById("refer");
              inviteSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Invite Friend to Test
          </Button>
        </Flex>

        {/* Rate plan — backend-backed, viewable by others */}
        <MotionBox
          as={Flex}
          justify="center"
          align="center"
          gap={2}
          mb={4}
          py={2}
          px={3}
          borderRadius="md"
          bg={themeBg}
          border="1px solid"
          borderColor={themeBorder}
          onClick={(e) => e.stopPropagation()}
          wrap="wrap"
          animate={ratingEffect ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <HStack spacing={0} align="center">
            {[1, 2, 3, 4, 5].map((s) => (
              <IconButton
                key={s}
                aria-label={`Rate ${s} stars`}
                icon={<Star size={16} />}
                variant="ghost"
                size="xs"
                color={s <= (ratingHover || planRating) ? "yellow.400" : "gray.300"}
                fill={s <= (ratingHover || planRating) ? "currentColor" : "none"}
                onClick={(e) => { e.stopPropagation(); setPlanRating(s); }}
                onMouseEnter={() => setRatingHover(s)}
                onMouseLeave={() => setRatingHover(0)}
                isDisabled={ratingSubmitted}
              />
            ))}
          </HStack>
          <Button
            size="xs"
            bg={ThemeColors.primaryColor}
            color="white"
            _hover={{ bg: ThemeColors.secondaryColor }}
            isDisabled={planRating < 1 || ratingSubmitted}
            onClick={handleSubmitRating}
          >
            {ratingSubmitted ? "Rated" : "Rate"}
          </Button>
          {totalRatings > 0 && (
            <Text fontSize="xs" color="gray.600">
              {avgRating.toFixed(1)} ({totalRatings})
            </Text>
          )}
        </MotionBox>

        <Tooltip label="Free delivery within 3km. 950 UGX per km beyond 3km." hasArrow placement="top">
          <Flex
            justify="center"
            align="center"
            gap={2}
            py={2}
            px={3}
            borderRadius="md"
            bg={themeBg}
            border="1px solid"
            borderColor={themeBorder}
            cursor="help"
          >
            <Icon as={Truck} boxSize={4} color={ThemeColors.primaryColor} />
            <Text fontSize="xs" color="gray.600">
              Free ≤3km · 950 UGX/km extra
            </Text>
          </Flex>
        </Tooltip>

        <Flex justify="center" mt={4}>
          <Button
            variant="ghost"
            size="sm"
            fontSize="xs"
            color="gray.500"
            _hover={{ color: ThemeColors.primaryColor, bg: themeBg }}
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
