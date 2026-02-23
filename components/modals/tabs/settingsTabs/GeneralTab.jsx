"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
  useToast,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useSelector } from "react-redux";
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield } from "react-icons/fi";
import { RiCakeLine, RiLeafLine } from "react-icons/ri";
import UpdateAccount from "@components/modals/UpdateAccount";
import ChangePassword from "@components/modals/ChangePassword";
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
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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
