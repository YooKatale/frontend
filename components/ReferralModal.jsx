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
  TelegramShareButton,
  TelegramIcon,
} from "next-share";

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
  const { userInfo } = useSelector((state) => state.auth);
  const chakraToast = useToast();
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
          title: "Success",
          description: "Your referral link has been saved",
          status: "success",
          duration: 6000,
          isClosable: false,
          position: "top",
        });
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err?.data?.message || "Could not save referral link",
        status: "error",
        duration: 6000,
        isClosable: false,
        position: "top",
      });
    }
  }, [onCopy, userInfo?._id, referralCode, createReferralCode, chakraToast]);

  const handleMailInvitation = useCallback(async () => {
    if (!invitee?.trim()) {
      chakraToast({
        title: "Error",
        description: "Please enter an email address",
        status: "error",
        duration: 3000,
        isClosable: true,
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
          title: "Success",
          description: "Invitation sent successfully",
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      } else throw new Error("Failed to send invitation");
    } catch (e) {
      chakraToast({
        title: "Error",
        description: "Sending invitation failed",
        status: "error",
        duration: 5000,
        isClosable: false,
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
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false} size="lg">
      <ModalOverlay />
      <ModalContent pt={3} pb={2}>
        <ModalHeader textAlign="center" textDecoration="underline">
          Share Your Referral Link
        </ModalHeader>
        <ModalCloseButton />
        {userInfo?._id !== undefined ? (
          <ModalBody>
            <Box mt={-4} mb={2} fontWeight="400">
              <Text fontSize={15} mt={0}>
                Refer others and earn some extra cash. Simply share your referral
                link with your associates or businesses
              </Text>
              <List fontSize={14} styleType="disc" pl={8}>
                <ListItem>Make sure they sign up using your referral link</ListItem>
                <ListItem>Confirm and claim your payout</ListItem>
              </List>
            </Box>
            <Box mb={6} fontWeight="400">
              <FormControl>
                <FormLabel>Invite By Mail</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Input email to invite"
                    type="email"
                    disabled={isReferralLoading}
                    value={invitee}
                    onChange={(e) => setInvitee(e.target.value)}
                    _hover={{}}
                  />
                  <InputRightElement
                    width={isReferralLoading ? "6rem" : "4.5rem"}
                    mr={isReferralLoading ? 1 : 0}
                  >
                    <Button
                      h="2rem"
                      size="sm"
                      bg="orange.400"
                      color="white"
                      fontWeight="500"
                      _hover={{ bg: "orange.500" }}
                      onClick={handleMailInvitation}
                      isLoading={isReferralLoading}
                      loadingText="Sending"
                      isDisabled={!referralCode}
                    >
                      Invite
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
            <Box mb={6}>
              <FormControl>
                <FormLabel>Referral URL</FormLabel>
                <InputGroup>
                  <Input value={referralUrl} isDisabled _hover={{}} />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="2rem"
                      size="sm"
                      bg="black"
                      color="white"
                      fontWeight="500"
                      _hover={{ bg: "gray.800" }}
                      onClick={handleOnCopy}
                      mr={hasCopied ? 1 : 0}
                    >
                      {hasCopied ? "Copied" : "Copy"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
            <Box justifyContent="center" textAlign="center">
              <FacebookShareButton
                url={shareUrl}
                quote={defaultMessage}
                hashtag="#yookatale"
                style={{ padding: 3 }}
              >
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <WhatsappShareButton
                url={shareUrl}
                title={defaultMessage}
                style={{ padding: 3 }}
                separator=":: "
              >
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
              <TwitterShareButton
                url={shareUrl}
                title={defaultMessage}
                style={{ padding: 3 }}
              >
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} style={{ padding: 3 }}>
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
              <TelegramShareButton
                url={shareUrl}
                title={defaultMessage}
                style={{ padding: 3 }}
              >
                <TelegramIcon size={40} round />
              </TelegramShareButton>
            </Box>
          </ModalBody>
        ) : (
          <ModalBody>
            <Box mt={-4} mb={2} fontWeight="400" textAlign="center" marginTop={3}>
              <Text fontSize={17} mt={0}>
                You need to sign in to refer friends
              </Text>
            </Box>
          </ModalBody>
        )}
        <ModalFooter justifyContent="center" textAlign="center">
          <Button colorScheme="gray" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
