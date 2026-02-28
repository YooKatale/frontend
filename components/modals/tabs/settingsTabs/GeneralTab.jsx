"use client";

import { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
  useToast,
  VStack,
  SimpleGrid,
  Avatar,
  Input,
} from "@chakra-ui/react";
import { ThemeColors, getUserAvatarUrl } from "@constants/constants";
import { useAuth } from "@slices/authSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@slices/authSlice";
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiCamera } from "react-icons/fi";
import { RiCakeLine, RiLeafLine } from "react-icons/ri";
import UpdateAccount from "@components/modals/UpdateAccount";
import ChangePassword from "@components/modals/ChangePassword";
import { useUpdateUserAvatarMutation } from "@slices/usersApiSlice";
import { DB_URL } from "@config/config";

const Field = ({ icon: IconComp, label, value, placeholder = "—" }) => (
  <Flex align="flex-start" gap={3} p={4} borderRadius="xl" bg="white" borderWidth="1px" borderColor="gray.200" _hover={{ borderColor: "gray.300", shadow: "sm" }} transition="all 0.2s">
    <Box p={2} borderRadius="lg" bg="green.50" color={ThemeColors.primaryColor}>
      <IconComp size={20} />
    </Box>
    <VStack align="stretch" spacing={0} flex={1} minW={0}>
      <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
      <Text fontSize="md" fontWeight="600" color="gray.800" noOfLines={2}>
        {value && String(value).trim() ? value : placeholder}
      </Text>
    </VStack>
  </Flex>
);

const GeneralTab = () => {
  const { userInfo } = useAuth();
  const dispatch = useDispatch();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [updateUserAvatar] = useUpdateUserAvatarMutation();

  const handleAvatarChange = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file || !userInfo?._id) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please choose an image file", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    setAvatarLoading(true);
    try {
      const res = await updateUserAvatar({ userId: userInfo._id, file }).unwrap();
      if (res?.data) {
        const updated = { ...userInfo, avatar: res.data.avatar ?? userInfo.avatar, ...res.data };
        dispatch(setCredentials(updated));
        toast({ title: "Profile picture updated", status: "success", duration: 4000, isClosable: true });
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.data?.message || err?.message || "Could not update picture",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${DB_URL}/users/${userInfo?._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok || data?.status === "Success") {
        toast({ title: "Account deleted", status: "success", duration: 4000, isClosable: true });
        if (typeof window !== "undefined") {
          localStorage.removeItem("yookatale-app");
          window.location.href = "/";
        }
      } else {
        toast({
          title: "Delete failed",
          description: data?.message || "Could not delete account",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e?.message || "Could not delete account",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <UpdateAccount isOpen={isUpdateOpen} onClose={onUpdateClose} />
      <ChangePassword isOpen={isPasswordOpen} onClose={onPasswordClose} />

      <VStack align="stretch" spacing={6}>
        <Box>
          <Text fontSize="lg" fontWeight="700" color="gray.800" mb={1}>
            Profile picture
          </Text>
          <Text fontSize="sm" color="gray.500" mb={3}>
            Update your profile photo
          </Text>
          <Flex align="center" gap={4}>
            <Avatar
              size="xl"
              name={`${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`.trim() || userInfo?.email}
              src={getUserAvatarUrl(userInfo)}
              bg="green.100"
              color="gray.700"
              objectFit="cover"
            />
            <VStack align="flex-start" spacing={2}>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                display="none"
                onChange={handleAvatarChange}
              />
              <Button
                leftIcon={<FiCamera />}
                size="sm"
                variant="outline"
                colorScheme="green"
                onClick={() => fileInputRef.current?.click()}
                isLoading={avatarLoading}
                loadingText="Uploading…"
                borderRadius="lg"
              >
                Update profile picture
              </Button>
            </VStack>
          </Flex>
        </Box>

        <Flex justify={{ base: "center", md: "flex-end" }} gap={3} flexWrap="wrap">
          <Button
            leftIcon={<FiShield />}
            variant="outline"
            colorScheme="green"
            size="md"
            onClick={onPasswordOpen}
            borderRadius="xl"
          >
            Change password
          </Button>
          <Button
            bg={ThemeColors.primaryColor}
            color="white"
            _hover={{ opacity: 0.9 }}
            size="md"
            onClick={onUpdateOpen}
            borderRadius="xl"
          >
            Update profile
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            size="md"
            onClick={handleDeleteAccount}
            isLoading={isDeleting}
            borderRadius="xl"
          >
            Delete account
          </Button>
        </Flex>

        <Box>
          <Text fontSize="lg" fontWeight="700" color="gray.800" mb={1}>
            Personal information
          </Text>
          <Text fontSize="sm" color="gray.500" mb={4}>
            View and manage your profile details
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
            <Field icon={FiUser} label="First name" value={userInfo?.firstname} />
            <Field icon={FiUser} label="Last name" value={userInfo?.lastname} />
            <Field icon={FiMail} label="Email" value={userInfo?.email} />
            <Field icon={FiPhone} label="Phone" value={userInfo?.phone} />
            <Field icon={RiCakeLine} label="Gender" value={userInfo?.gender} />
            <Field
              icon={RiLeafLine}
              label="Diet"
              value={userInfo?.vegan ? "Vegan" : "Not Vegan"}
              placeholder="Not set"
            />
            <Field icon={FiMapPin} label="Address" value={userInfo?.address} />
          </SimpleGrid>
        </Box>
      </VStack>
    </>
  );
};

export default GeneralTab;
