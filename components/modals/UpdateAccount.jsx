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
  Select,
  Grid,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { DB_URL } from "@config/config";
import { setCredentials } from "@slices/authSlice";
import { ThemeColors } from "@constants/constants";

const UpdateAccount = ({ isOpen, onClose }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    vegan: false,
  });

  useEffect(() => {
    if (userInfo && isOpen) {
      setUserData({
        firstname: userInfo.firstname || "",
        lastname: userInfo.lastname || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
        gender: userInfo.gender || "",
        vegan: !!userInfo.vegan,
      });
    }
  }, [userInfo, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${DB_URL}/users/${userInfo?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstname: userData.firstname.trim(),
          lastname: userData.lastname.trim(),
          email: userData.email.trim(),
          phone: userData.phone?.trim() || "",
          address: userData.address?.trim() || "",
          gender: userData.gender || undefined,
          vegan: userData.vegan,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Update failed");
      }

      if (data?.status === "Success" && data?.data) {
        const updated = { ...userInfo, ...data.data };
        dispatch(setCredentials(updated));
        toast({
          title: "Profile updated",
          description: "Your details have been saved.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error(data?.message || "Update failed");
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.message || "Could not update profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" mx={4}>
        <ModalHeader color="gray.800" fontWeight="700">
          Update profile
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={2}>
            <VStack spacing={4} align="stretch">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <FormControl isRequired>
                  <FormLabel>First name</FormLabel>
                  <Input
                    value={userData.firstname}
                    onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                    placeholder="First name"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last name</FormLabel>
                  <Input
                    value={userData.lastname}
                    onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                    placeholder="Last name"
                    borderRadius="lg"
                  />
                </FormControl>
              </Grid>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="Email"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone number</FormLabel>
                <Input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  placeholder="+256760730254"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  placeholder="Select gender"
                  borderRadius="lg"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Diet</FormLabel>
                <Select
                  value={userData.vegan ? "vegan" : "not-vegan"}
                  onChange={(e) => setUserData({ ...userData, vegan: e.target.value === "vegan" })}
                  borderRadius="lg"
                >
                  <option value="not-vegan">Not Vegan</option>
                  <option value="vegan">Vegan</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  value={userData.address}
                  onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                  placeholder="Delivery address"
                  borderRadius="lg"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3} pt={4}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              bg={ThemeColors.primaryColor}
              color="white"
              _hover={{ opacity: 0.9 }}
              isLoading={isLoading}
              loadingText="Saving…"
            >
              Save changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UpdateAccount;
