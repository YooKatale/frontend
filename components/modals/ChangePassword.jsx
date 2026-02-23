"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import { useState } from "react";
import { DB_URL } from "@config/config";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = ({ isOpen, onClose }) => {
  const { userInfo } = useAuth();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast({ title: "Enter current password", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (!passwords.newPassword) {
      toast({ title: "Enter new password", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast({ title: "New password must be at least 6 characters", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Passwords do not match", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (passwords.newPassword === passwords.currentPassword) {
      toast({ title: "New password must differ from current", status: "error", duration: 4000, isClosable: true });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${DB_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: userInfo?._id,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || "Change password failed");

      if (data?.status === "Success") {
        toast({
          title: "Password changed",
          description: "Please sign in again with your new password.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        onClose();
        setTimeout(() => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("yookatale-app");
            window.location.href = "/signin";
          }
        }, 1500);
      } else {
        throw new Error(data?.message || "Change password failed");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err?.message || "Could not change password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!isOpen} onClose={onClose} size="md" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" mx={4}>
        <ModalHeader fontWeight="700" color="gray.800">
          Change password
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={2}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Current password</FormLabel>
                <InputGroup>
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    placeholder="Current password"
                    borderRadius="lg"
                    pr="10"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showCurrent ? "Hide" : "Show"}
                      size="sm"
                      variant="ghost"
                      icon={showCurrent ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowCurrent(!showCurrent)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>New password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    placeholder="Min. 6 characters"
                    borderRadius="lg"
                    pr="10"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showNew ? "Hide" : "Show"}
                      size="sm"
                      variant="ghost"
                      icon={showNew ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowNew(!showNew)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm new password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    borderRadius="lg"
                    pr="10"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirm ? "Hide" : "Show"}
                      size="sm"
                      variant="ghost"
                      icon={showConfirm ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowConfirm(!showConfirm)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Box p={3} bg="blue.50" borderRadius="lg">
                <Text fontSize="sm" color="blue.800">
                  After changing your password, you’ll be signed out and must sign in again with the new password.
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3} pt={4}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="green"
              isLoading={isLoading}
              loadingText="Updating…"
            >
              Change password
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ChangePassword;
