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
  useToast,
  Checkbox,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateListingMutation } from "@slices/listingsApiSlice";
import { useGetLocationsQuery } from "@slices/locationsApiSlice";
import { useProductsCategoriesGetMutation } from "@slices/productsApiSlice";
import { ThemeColors } from "@constants/constants";

export default function NewListingPage() {
  const router = useRouter();
  const toast = useToast();
  const [createListing, { isLoading }] = useCreateListingMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();

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

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    description: "",
    price: "",
    negotiable: false,
    locationId: "",
    addressLine: "",
    images: ["", ""],
  });
  const [error, setError] = useState("");

  const regions = Array.isArray(regionsData?.data) ? regionsData.data : [];
  const districts = Array.isArray(districtsData?.data) ? districtsData.data : [];
  const locationOptions = Array.isArray(locationsData?.data)
    ? locationsData.data
    : [];

  useEffect(() => {
    fetchCategories()
      .unwrap()
      .then((res) => {
        const cats = res?.categories || res || [];
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(() => {});
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "region") {
      setRegion(value);
      setDistrict("");
      setForm((prev) => ({ ...prev, locationId: "" }));
    } else if (name === "district") {
      setDistrict(value);
      setForm((prev) => ({ ...prev, locationId: "" }));
    } else if (name === "negotiable") {
      setForm((prev) => ({ ...prev, negotiable: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setImage = (index, url) => {
    setForm((prev) => {
      const next = [...(prev.images || ["", ""])];
      next[index] = url;
      return { ...prev, images: next };
    });
  };

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urls = (form.images || []).filter(Boolean);
    if (urls.length < 2) {
      setError("At least 2 image URLs are required");
      return;
    }
    setError("");
    try {
      await createListing({
        title: form.title,
        categoryId: form.categoryId,
        description: form.description,
        price: Number(form.price),
        negotiable: form.negotiable,
        locationId: form.locationId || undefined,
        addressLine: form.addressLine || undefined,
        images: urls,
      }).unwrap();
      toast({
        title: "Listing created",
        description: "Your listing has been submitted for approval.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/sell/listings");
    } catch (err) {
      setError(err?.data?.message || "Failed to create listing");
    }
  };

  return (
    <Box maxW="xl">
      <Heading size="lg" mb={4} color="gray.800">
        Add listing
      </Heading>
      <Box bg="white" p={6} borderRadius="xl" borderWidth="1px">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter listing title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                placeholder="Select category"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your listing"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price (UGX)</FormLabel>
              <Input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
              />
            </FormControl>

            <FormControl>
              <Checkbox
                name="negotiable"
                isChecked={form.negotiable}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, negotiable: e.target.checked }))
                }
              >
                Price is negotiable
              </Checkbox>
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
                <FormLabel>Location</FormLabel>
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
              <FormLabel>Images (URLs) - At least 2 required</FormLabel>
              {(form.images || []).map((img, idx) => (
                <Input
                  key={idx}
                  value={img}
                  onChange={(e) => setImage(idx, e.target.value)}
                  placeholder={`Image ${idx + 1} URL`}
                  mb={2}
                />
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addImage}
                mt={2}
              >
                Add another image
              </Button>
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
                isLoading={isLoading}
                bg={ThemeColors.primaryColor}
                color="white"
                _hover={{ bg: ThemeColors.secondaryColor }}
              >
                Submit for approval
              </Button>
              <Button as={Link} href="/sell/listings" variant="outline">
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
