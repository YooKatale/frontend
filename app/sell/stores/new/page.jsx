"use client";

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateStoreMutation } from "@slices/storesApiSlice";
import { useGetLocationsQuery } from "@slices/locationsApiSlice";
import { ThemeColors } from "@constants/constants";

export default function NewStorePage() {
  const router = useRouter();
  const toast = useToast();
  const [createStore, { isLoading }] = useCreateStoreMutation();
  const { data: regionsData } = useGetLocationsQuery();
  const { data: districtsData } = useGetLocationsQuery(
    { region },
    { skip: !region }
  );
  const { data: locationsData } = useGetLocationsQuery(
    { region, district },
    { skip: !region || !district }
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    locationId: "",
    addressLine: "",
    openHours: "",
    contactPhone: "",
    contactWhatsApp: "",
  });
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [error, setError] = useState("");

  const regions = Array.isArray(regionsData?.data) ? regionsData.data : [];
  const districts = region
    ? Array.isArray(districtsData?.data)
      ? districtsData.data
      : []
    : [];
  const locationOptions = region && district && Array.isArray(locationsData?.data) ? locationsData.data : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "region") {
      setRegion(value);
      setDistrict("");
      setForm((prev) => ({ ...prev, locationId: "" }));
    } else if (name === "district") {
      setDistrict(value);
      setForm((prev) => ({ ...prev, locationId: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createStore(form).unwrap();
      toast({
        title: "Store created",
        description: "Your store has been submitted for approval.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/sell/stores");
    } catch (err) {
      setError(err?.data?.message || "Failed to create store");
    }
  };

  return (
    <Box maxW="xl">
      <Heading size="lg" mb={4} color="gray.800">
        Add store
      </Heading>
      <Box bg="white" p={6} borderRadius="xl" borderWidth="1px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Store name</FormLabel>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter store name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your store"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Region</FormLabel>
              <Select name="region" value={region} onChange={handleChange} placeholder="Select region">
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </FormControl>

            {region && (
              <FormControl>
                <FormLabel>District</FormLabel>
                <Select
                  name="district"
                  value={district}
                  onChange={handleChange}
                  placeholder="Select district"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            {region && district && (
              <FormControl>
                <FormLabel>Location (city/area)</FormLabel>
                <Select
                  name="locationId"
                  value={form.locationId}
                  onChange={handleChange}
                  placeholder="Select location"
                >
                  {locationOptions.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Address line</FormLabel>
              <Input
                name="addressLine"
                value={form.addressLine}
                onChange={handleChange}
                placeholder="Street address"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Open hours</FormLabel>
              <Input
                name="openHours"
                value={form.openHours}
                onChange={handleChange}
                placeholder="e.g. Mon–Fri 8am–6pm"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Contact phone</FormLabel>
              <Input
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </FormControl>

            <FormControl>
              <FormLabel>WhatsApp</FormLabel>
              <Input
                name="contactWhatsApp"
                value={form.contactWhatsApp}
                onChange={handleChange}
                placeholder="WhatsApp number"
              />
            </FormControl>

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Box display="flex" gap={3}>
              <Button
                type="submit"
                isLoading={isLoading}
                bg={ThemeColors.primaryColor}
                color="white"
                _hover={{ bg: ThemeColors.secondaryColor }}
              >
                Submit for approval
              </Button>
              <Button as={Link} href="/sell/stores" variant="outline">
                Cancel
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
