"use client";

import {
  Box,
  Button,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@slices/authSlice";
import { useLogoutMutation } from "@slices/usersApiSlice";
import { ThemeColors } from "@constants/constants";

const SettingsTab = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const chakraToast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      try {
        await logoutUser().unwrap();
      } catch (error) {
        console.error("Logout API error:", error);
      }
      dispatch(logout());
      if (typeof window !== "undefined") {
        localStorage.removeItem("yookatale-app");
        sessionStorage.clear();
      }
      chakraToast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      chakraToast({
        title: "Error",
        description: "An error occurred while logging out. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Box padding={{ base: "1rem", md: "2rem" }}>
        <Box marginBottom="2rem">
          <Text fontSize="2xl" fontWeight="bold" color={ThemeColors.darkColor} marginBottom="0.5rem">
            Account Settings
          </Text>
          <Text fontSize="md" color="gray.600">
            Manage your account preferences and security settings
          </Text>
        </Box>

        <Box
          padding={{ base: "1.5rem", md: "2rem" }}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
          boxShadow="sm"
        >
          <Box marginBottom="1.5rem">
            <Text fontSize="lg" fontWeight="semibold" color={ThemeColors.darkColor} marginBottom="0.5rem">
              Sign Out
            </Text>
            <Text fontSize="sm" color="gray.600" marginBottom="1rem">
              Sign out of your account. You will need to sign in again to access your account.
            </Text>
            <Button
              leftIcon={<LogOut size={18} />}
              colorScheme="red"
              onClick={onOpen}
              size="md"
              _hover={{ bg: "red.600" }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Box>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Sign Out
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to sign out? You will need to sign in again to access your account.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isLoggingOut}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleLogout}
                ml={3}
                isLoading={isLoggingOut}
                loadingText="Signing Out..."
              >
                Sign Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SettingsTab;
