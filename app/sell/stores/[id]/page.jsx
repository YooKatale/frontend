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
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  useGetStoreQuery,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} from "@slices/storesApiSlice";
import { useGetLocationsQuery } from "@slices/locationsApiSlice";
import { ThemeColors } from "@constants/constants";

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const toast = useToast();

  const { data: storeData, isLoading: loadingStore } = useGetStoreQuery(id, {
    skip: !id,
  });
  const [updateStore, { isLoading: updating }] = useUpdateStoreMutation();
  const [deleteStore, { isLoading: deleting }] = useDeleteStoreMutation();

  const { data: regionsData } = useGetLocationsQuery();
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
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
  const [error, setError] = useState("");

  const regions = Array.isArray(regionsData?.data) ? regionsData.data : [];
  const districts = Array.isArray(districtsData?.data) ? districtsData.data : [];
  const locationOptions = Array.isArray(locationsData?.data)
    ? locationsData.data
    : [];

  useEffect(() => {
    if (storeData?.data) {
      const store = storeData.data;
      setForm({
        name: store.name || "",
        description: store.description || "",
        locationId:
          typeof store.locationId === "object" && store.locationId?._id
            ? store.locationId._id
            : store.locationId || "",
        addressLine: store.addressLine || "",
        openHours: store.openHours || "",
        contactPhone: store.contactPhone || "",
        contactWhatsApp: store.contactWhatsApp || "",
      });
      const loc =
        typeof store.locationId === "object" ? store.locationId : null;
      if (loc?.region) setRegion(loc.region);
      if (loc?.district) setDistrict(loc.district);
    }
  }, [storeData]);

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
      await updateStore({ id, ...form }).unwrap();
      toast({
        title: "Store updated",
        description: "Your store has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/sell/stores");
    } catch (err) {
      setError(err?.data?.message || "Failed to update store");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    try {
      await deleteStore(id).unwrap();
      toast({
        title: "Store deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/sell/stores");
    } catch (err) {
      setError(err?.data?.message || "Failed to delete store");
    }
  };

  if (loadingStore) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color={ThemeColors.primaryColor} />
      </Box>
    );
  }

  return (
    <Box maxW="xl">
      <Heading size="lg" mb={4} color="gray.800">
        Edit store
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
              <Select
                name="region"
                value={region}
                onChange={handleChange}
                placeholder="Select region"
              >
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

            <HStack spacing={3}>
              <Button
                type="submit"
                isLoading={updating}
                bg={ThemeColors.primaryColor}
                color="white"
                _hover={{ bg: ThemeColors.secondaryColor }}
              >
                Update store
              </Button>
              <Button
                onClick={handleDelete}
                isLoading={deleting}
                colorScheme="red"
                variant="outline"
              >
                Delete
              </Button>
              <Button as={Link} href="/sell/stores" variant="outline">
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
