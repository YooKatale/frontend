"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
  useToast,
  VStack,
  HStack,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { useCreateReferralCodeMutation } from "@slices/usersApiSlice";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";
import { motion } from "framer-motion";
import {
  Gift,
  Share2,
  Copy,
  Check,
  Mail,
  Users,
  DollarSign,
  Sparkles,
  Link as LinkIcon,
  Send,
} from "lucide-react";
import { ThemeColors } from "@constants/constants";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const shareUrl = "https://www.yookatale.app";
const defaultMessage =
  "Hey, I am using YooKatale. Forget about cooking or going to the market. Enjoy a variety of customizable meals for breakfast, lunch & supper at discounted prices with access to credit, never miss a meal by using our premium, family & business subscription plans with friends and family!:: https://www.yookatale.app\n\nSign up for free today & invite friends & loved ones www.yookatale.app/signup\n\nEarn 20,000UGX to 50,000UGX & other Gifts for every member you invite.\n\nwww.yookatale.app/subscription";

async function generateReferralCode(userId) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const enc = new TextEncoder().encode(userId);
    const hash = await crypto.subtle.digest("SHA-256", enc);
    const hex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hex.substring(0, 8);
  }
  let h = 0;
  const s = String(userId);
  for (let i = 0; i < s.length; i++)
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).slice(0, 8);
}

export default function ReferralModal({ isOpen, onClose }) {
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const _toast = useToast();
  const chakraToast = typeof _toast === "function" ? _toast : (typeof _toast?.toast === "function" ? _toast.toast : () => {});
  const [referralCode, setReferralCode] = useState("");
  const [referralUrl, setReferralUrl] = useState("");
  const [invitee, setInvitee] = useState("");
  const [isReferralLoading, setIsReferralLoading] = useState(false);
  const [createReferralCode] = useCreateReferralCodeMutation();
  const { hasCopied, onCopy } = useClipboard(referralUrl);

  useEffect(() => {
    if (!userInfo?._id) return;
    let mounted = true;
    generateReferralCode(userInfo._id).then((code) => {
      if (!mounted) return;
      setReferralCode(code);
      setReferralUrl(`https://yookatale.app/signup?ref=${code}`);
    });
    return () => { mounted = false; };
  }, [userInfo?._id]);

  const handleOnCopy = useCallback(async () => {
    onCopy();
    if (!userInfo?._id || !referralCode) return;
    try {
      const res = await createReferralCode({
        referralCode,
        userId: userInfo._id,
      }).unwrap();
      if (res?.status === "Success") {
        chakraToast({
          title: "Success! 🎉",
          description: "Your referral link has been copied and saved",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err?.data?.message || "Could not save referral link",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [onCopy, userInfo?._id, referralCode, createReferralCode, chakraToast]);

  const handleMailInvitation = useCallback(async () => {
    if (!invitee?.trim()) {
      chakraToast({
        title: "Email Required",
        description: "Please enter an email address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setIsReferralLoading(true);
    try {
      const res = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: invitee.trim(),
          type: "invitation",
          referralCode,
        }),
      });
      if (res.ok) {
        setInvitee("");
        chakraToast({
          title: "Invitation Sent! ✉️",
          description: "Your friend will receive an invitation email shortly",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else throw new Error("Failed to send invitation");
    } catch (e) {
      chakraToast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsReferralLoading(false);
    }
  }, [invitee, referralCode, chakraToast]);

  const handleClose = useCallback(() => {
    setIsReferralLoading(false);
    setInvitee("");
    onClose();
  }, [onClose]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      closeOnOverlayClick={true} 
      size="xl"
      isCentered
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent 
        borderRadius="2xl"
        overflow="hidden"
        maxW="600px"
        boxShadow="2xl"
      >
        {/* Header with Gradient */}
        <Box
          bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
          p={6}
          color="white"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-50%"
            right="-10%"
            w="200px"
            h="200px"
            borderRadius="full"
            bg="whiteAlpha.200"
            blur="xl"
          />
          <Box
            position="absolute"
            bottom="-30%"
            left="-10%"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="whiteAlpha.100"
            blur="xl"
          />
          <ModalCloseButton 
            color="white" 
            _hover={{ bg: "whiteAlpha.200" }}
            size="lg"
            borderRadius="full"
          />
          <VStack spacing={3} align="center" position="relative" zIndex={1}>
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Box
                p={4}
                borderRadius="2xl"
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
              >
                <Gift size={40} color="white" />
              </Box>
            </MotionBox>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Invite Friends & Earn Rewards
            </Text>
            <HStack spacing={4} fontSize="sm" opacity={0.95}>
              <HStack spacing={1}>
                <DollarSign size={16} />
                <Text>20K - 50K UGX</Text>
              </HStack>
              <Text>•</Text>
              <HStack spacing={1}>
                <Sparkles size={16} />
                <Text>Loyalty Points</Text>
              </HStack>
              <Text>•</Text>
              <HStack spacing={1}>
                <Gift size={16} />
                <Text>Gifts</Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>

        <ModalBody p={6}>
          {userInfo?._id !== undefined ? (
            <VStack spacing={6} align="stretch">
              {/* Info Section */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                p={4}
                borderRadius="xl"
                bg={`${ThemeColors.primaryColor}08`}
                border="1px solid"
                borderColor={`${ThemeColors.primaryColor}20`}
              >
                <HStack spacing={3} mb={3}>
                  <Users size={20} style={{ color: ThemeColors.primaryColor }} />
                  <Text fontWeight="semibold" color="gray.700">
                    How It Works
                  </Text>
                </HStack>
                <List spacing={2} fontSize="sm" color="gray.600">
                  <ListItem display="flex" alignItems="start" gap={2}>
                    <Box mt={1}>
                      <Check size={16} style={{ color: ThemeColors.primaryColor }} />
                    </Box>
                    <Text>Share your referral link with friends and associates</Text>
                  </ListItem>
                  <ListItem display="flex" alignItems="start" gap={2}>
                    <Box mt={1}>
                      <Check size={16} style={{ color: ThemeColors.primaryColor }} />
                    </Box>
                    <Text>They sign up using your referral link</Text>
                  </ListItem>
                  <ListItem display="flex" alignItems="start" gap={2}>
                    <Box mt={1}>
                      <Check size={16} style={{ color: ThemeColors.primaryColor }} />
                    </Box>
                    <Text>Earn rewards when they make their first order</Text>
                  </ListItem>
                </List>
              </MotionBox>

              {/* Email Invite Section */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormControl>
                  <FormLabel 
                    fontWeight="semibold" 
                    color="gray.700"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                  >
                    <Mail size={18} style={{ color: ThemeColors.primaryColor }} />
                    Invite by Email
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      placeholder="Enter friend's email address"
                      type="email"
                      disabled={isReferralLoading}
                      value={invitee}
                      onChange={(e) => setInvitee(e.target.value)}
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: `${ThemeColors.primaryColor}40` }}
                      _focus={{
                        borderColor: ThemeColors.primaryColor,
                        boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
                      }}
                      h="50px"
                      fontSize="md"
                    />
                    <InputRightElement width="auto" pr={2} h="50px">
                      <MotionButton
                        h="38px"
                        px={6}
                        borderRadius="xl"
                        bg={ThemeColors.primaryColor}
                        color="white"
                        fontWeight="semibold"
                        _hover={{ 
                          bg: ThemeColors.secondaryColor,
                          transform: "scale(1.05)",
                        }}
                        onClick={handleMailInvitation}
                        isLoading={isReferralLoading}
                        loadingText="Sending..."
                        isDisabled={!referralCode || !invitee.trim()}
                        leftIcon={!isReferralLoading && <Send size={16} />}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isReferralLoading ? "Sending..." : "Send Invite"}
                      </MotionButton>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </MotionBox>

              <Divider />

              {/* Referral Link Section */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormControl>
                  <FormLabel 
                    fontWeight="semibold" 
                    color="gray.700"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                  >
                    <LinkIcon size={18} style={{ color: ThemeColors.primaryColor }} />
                    Your Referral Link
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      value={referralUrl}
                      isReadOnly
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="gray.200"
                      bg="gray.50"
                      fontFamily="mono"
                      fontSize="sm"
                      h="50px"
                      pr="120px"
                    />
                    <InputRightElement width="auto" pr={2} h="50px">
                      <MotionButton
                        h="38px"
                        px={6}
                        borderRadius="xl"
                        bg={hasCopied ? ThemeColors.secondaryColor : "gray.800"}
                        color="white"
                        fontWeight="semibold"
                        _hover={{ 
                          bg: hasCopied ? ThemeColors.secondaryColor : "gray.700",
                          transform: "scale(1.05)",
                        }}
                        onClick={handleOnCopy}
                        leftIcon={hasCopied ? <Check size={16} /> : <Copy size={16} />}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {hasCopied ? "Copied!" : "Copy"}
                      </MotionButton>
                    </InputRightElement>
                  </InputGroup>
                  {referralCode && (
                    <HStack mt={2} spacing={2}>
                      <Badge
                        px={3}
                        py={1}
                        borderRadius="full"
                        bg={`${ThemeColors.primaryColor}15`}
                        color={ThemeColors.primaryColor}
                        fontSize="xs"
                        fontWeight="semibold"
                      >
                        Code: {referralCode}
                      </Badge>
                    </HStack>
                  )}
                </FormControl>
              </MotionBox>

              <Divider />

              {/* Social Share Section */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Text 
                  fontWeight="semibold" 
                  color="gray.700"
                  mb={4}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Share2 size={18} style={{ color: ThemeColors.primaryColor }} />
                  Share on Social Media
                </Text>
                <HStack spacing={3} justify="center" flexWrap="wrap">
                  <MotionBox
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FacebookShareButton
                      url={shareUrl}
                      quote={defaultMessage}
                      hashtag="#yookatale"
                    >
                      <FacebookIcon size={48} round />
                    </FacebookShareButton>
                  </MotionBox>
                  <MotionBox
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <WhatsappShareButton
                      url={shareUrl}
                      title={defaultMessage}
                      separator=":: "
                    >
                      <WhatsappIcon size={48} round />
                    </WhatsappShareButton>
                  </MotionBox>
                  <MotionBox
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TwitterShareButton
                      url={shareUrl}
                      title={defaultMessage}
                    >
                      <TwitterIcon size={48} round />
                    </TwitterShareButton>
                  </MotionBox>
                  <MotionBox
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LinkedinShareButton url={shareUrl}>
                      <LinkedinIcon size={48} round />
                    </LinkedinShareButton>
                  </MotionBox>
                  <MotionBox
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TelegramShareButton
                      url={shareUrl}
                      title={defaultMessage}
                    >
                      <TelegramIcon size={48} round />
                    </TelegramShareButton>
                  </MotionBox>
                </HStack>
              </MotionBox>
            </VStack>
          ) : (
            <VStack spacing={4} py={8}>
              <Box
                p={4}
                borderRadius="xl"
                bg={`${ThemeColors.primaryColor}08`}
                border="2px dashed"
                borderColor={`${ThemeColors.primaryColor}40`}
              >
                <Users size={48} style={{ color: ThemeColors.primaryColor }} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.700" textAlign="center">
                Sign in to Start Earning
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Create an account or sign in to get your referral link and start earning rewards!
              </Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center" pt={4} pb={6}>
          <MotionButton
            onClick={handleClose}
            borderRadius="xl"
            px={8}
            py={6}
            bg="gray.100"
            color="gray.700"
            fontWeight="semibold"
            _hover={{ 
              bg: "gray.200",
              transform: "scale(1.05)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </MotionButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
