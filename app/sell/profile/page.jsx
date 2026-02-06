"use client";

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Card,
  CardBody,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  useGetSellerProfileQuery,
  useUpdateSellerProfileMutation,
} from "@slices/sellerApiSlice";
import { ThemeColors } from "@constants/constants";

export default function ProfilePage() {
  const toast = useToast();
  const { data: profileData, isLoading: loadingProfile } =
    useGetSellerProfileQuery();
  const [updateProfile, { isLoading: updating }] =
    useUpdateSellerProfileMutation();

  const [form, setForm] = useState({
    displayName: "",
    phone: "",
    whatsapp: "",
    bio: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setForm({
        displayName: profile.displayName || "",
        phone: profile.phone || "",
        whatsapp: profile.whatsapp || "",
        bio: profile.bio || "",
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateProfile(form).unwrap();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err?.data?.message || "Failed to update profile");
    }
  };

  if (loadingProfile) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color={ThemeColors.primaryColor} />
      </Box>
    );
  }

  const profile = profileData?.data || {};
  const lastSeen = profile.lastSeenAt
    ? new Date(profile.lastSeenAt).toLocaleString()
    : null;

  return (
    <Box maxW="xl">
      <Heading size="lg" mb={4} color="gray.800">
        Profile
      </Heading>
      <Card mb={6}>
        <CardBody>
          <Text fontSize="sm" color="gray.500" mb={1}>
            Followers
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {profile.followersCount ?? 0}
          </Text>
          {lastSeen && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              Last seen: {lastSeen}
            </Text>
          )}
        </CardBody>
      </Card>
      <Box bg="white" p={6} borderRadius="xl" borderWidth="1px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Display name</FormLabel>
              <Input
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder="Your display name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </FormControl>

            <FormControl>
              <FormLabel>WhatsApp</FormLabel>
              <Input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp number"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us about yourself"
              />
            </FormControl>

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              isLoading={updating}
              bg={ThemeColors.primaryColor}
              color="white"
              _hover={{ bg: ThemeColors.secondaryColor }}
            >
              Save profile
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
