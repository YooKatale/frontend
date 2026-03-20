"use client";

import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useClipboard,
  useToast,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useCreateReferralCodeMutation } from "@slices/usersApiSlice";
import { useAuth } from "@slices/authSlice";
import { useCallback, useEffect, useState } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";
import { Gift, Copy, Check, Mail, Send, Users } from "lucide-react";
import { ThemeColors } from "@constants/constants";

const shareUrl = "https://www.yookatale.app";
const defaultMessage =
  "Hey! I use YooKatale for fresh groceries and meals delivered fast. Join me and get a discount on your first order: https://yookatale.app";

async function generateReferralCode(userId) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const enc = new TextEncoder().encode(userId);
    const hash = await crypto.subtle.digest("SHA-256", enc);
    const hex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex.substring(0, 8);
  }
  let h = 0;
  const s = String(userId);
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).slice(0, 8);
}

export default function ReferralModal({ isOpen, onClose }) {
  const { userInfo } = useAuth();
  const chakraToast = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referralUrl, setReferralUrl] = useState("");
  const [invitee, setInvitee] = useState("");
  const [isSending, setIsSending] = useState(false);
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

  const handleCopy = useCallback(async () => {
    onCopy();
    if (!userInfo?._id || !referralCode) return;
    try {
      await createReferralCode({ referralCode, userId: userInfo._id }).unwrap();
    } catch {}
    chakraToast({ title: "Link copied", status: "success", duration: 2000, isClosable: true, position: "top" });
  }, [onCopy, userInfo?._id, referralCode, createReferralCode, chakraToast]);

  const handleSendInvite = useCallback(async () => {
    if (!invitee?.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: invitee.trim(), type: "invitation", referralCode }),
      });
      if (res.ok) {
        setInvitee("");
        chakraToast({ title: "Invite sent", description: `Invitation sent to ${invitee.trim()}`, status: "success", duration: 3000, isClosable: true, position: "top" });
      } else throw new Error();
    } catch {
      chakraToast({ title: "Failed to send invite", status: "error", duration: 3000, isClosable: true, position: "top" });
    } finally {
      setIsSending(false);
    }
  }, [invitee, referralCode, chakraToast]);

  const handleClose = useCallback(() => { setInvitee(""); onClose(); }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xs" closeOnOverlayClick>
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(6px)" />
      <ModalContent
        borderRadius="2xl"
        mx={4}
        maxW="400px"
        overflow="hidden"
        boxShadow="0 20px 60px rgba(0,0,0,0.15)"
      >
        {/* Compact header */}
        <Box
          bg={ThemeColors.primaryColor}
          px={5} pt={5} pb={4}
          position="relative"
        >
          <ModalCloseButton color="whiteAlpha.800" _hover={{ bg: "whiteAlpha.200" }} borderRadius="full" size="sm" top={3} right={3} />
          <HStack spacing={3} align="center">
            <Box
              w={9} h={9} borderRadius="lg" bg="whiteAlpha.200"
              display="flex" alignItems="center" justifyContent="center"
              flexShrink={0}
            >
              <Gift size={18} color="white" />
            </Box>
            <Box>
              <Text fontSize="md" fontWeight="700" color="white" lineHeight="1.2">Invite a Friend</Text>
              <Text fontSize="xs" color="whiteAlpha.800" mt={0.5}>Earn up to UGX 50,000 per referral</Text>
            </Box>
          </HStack>
        </Box>

        <ModalBody p={5}>
          {userInfo?._id ? (
            <VStack spacing={4} align="stretch">
              {/* Referral link */}
              <Box>
                <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.06em" mb={1.5}>
                  Your referral link
                </Text>
                <InputGroup size="sm">
                  <Input
                    value={referralUrl}
                    isReadOnly
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="gray.50"
                    fontSize="xs"
                    fontFamily="mono"
                    pr="80px"
                    _focus={{ borderColor: ThemeColors.primaryColor }}
                  />
                  <InputRightElement width="76px" h="full">
                    <Button
                      h="28px"
                      px={3}
                      size="xs"
                      borderRadius="md"
                      bg={hasCopied ? "green.500" : "gray.800"}
                      color="white"
                      fontWeight="700"
                      leftIcon={hasCopied ? <Check size={12} /> : <Copy size={12} />}
                      onClick={handleCopy}
                      _hover={{ bg: hasCopied ? "green.600" : "gray.700" }}
                      fontSize="xs"
                    >
                      {hasCopied ? "Copied" : "Copy"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>

              <Divider borderColor="gray.100" />

              {/* Email invite */}
              <Box>
                <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.06em" mb={1.5}>
                  Invite by email
                </Text>
                <HStack spacing={2}>
                  <Input
                    placeholder="friend@email.com"
                    type="email"
                    value={invitee}
                    onChange={(e) => setInvitee(e.target.value)}
                    size="sm"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="gray.50"
                    fontSize="sm"
                    _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: "none" }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendInvite(); }}
                  />
                  <Button
                    size="sm"
                    bg={ThemeColors.primaryColor}
                    color="white"
                    fontWeight="700"
                    borderRadius="lg"
                    px={4}
                    leftIcon={<Send size={12} />}
                    onClick={handleSendInvite}
                    isLoading={isSending}
                    isDisabled={!invitee.trim() || !referralCode}
                    _hover={{ bg: ThemeColors.secondaryColor }}
                    flexShrink={0}
                  >
                    Send
                  </Button>
                </HStack>
              </Box>

              <Divider borderColor="gray.100" />

              {/* Social share */}
              <Box>
                <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                  Share on social
                </Text>
                <HStack spacing={3} justify="center">
                  {[
                    { Component: WhatsappShareButton, Icon: WhatsappIcon, props: { url: shareUrl, title: defaultMessage, separator: ":: " } },
                    { Component: FacebookShareButton, Icon: FacebookIcon, props: { url: shareUrl, quote: defaultMessage, hashtag: "#yookatale" } },
                    { Component: TwitterShareButton, Icon: TwitterIcon, props: { url: shareUrl, title: defaultMessage } },
                    { Component: TelegramShareButton, Icon: TelegramIcon, props: { url: shareUrl, title: defaultMessage } },
                  ].map(({ Component, Icon: SocialIcon, props }, i) => (
                    <Box
                      key={i}
                      as="span"
                      transition="transform 0.15s"
                      _hover={{ transform: "scale(1.1)" }}
                      display="inline-block"
                    >
                      <Component {...props}>
                        <SocialIcon size={36} round />
                      </Component>
                    </Box>
                  ))}
                </HStack>
              </Box>
            </VStack>
          ) : (
            <VStack spacing={3} py={4} textAlign="center">
              <Box
                w={11} h={11} borderRadius="xl" mx="auto"
                bg={`${ThemeColors.primaryColor}12`}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Users size={20} color={ThemeColors.primaryColor} />
              </Box>
              <Text fontSize="sm" fontWeight="700" color="gray.700">Sign in to start earning</Text>
              <Text fontSize="xs" color="gray.500">Create an account to get your referral link and rewards.</Text>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
