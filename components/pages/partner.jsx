"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select, // Added Select for capturing transport
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import VendorForm from "@components/DeliveryForm";

const Partner = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // Vendor Information
    name: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    transport: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/submit-info", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        onSubmit("Data submitted successfully");
      } else {
        onSubmit("Error submitting data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      onSubmit("An unexpected error occurred");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      <VendorForm />
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Vendor Information */}
          <FormControl id="name">
            <FormLabel>Vendor's Name*</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Vendor's Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl id="address">
            <FormLabel>Address*</FormLabel>
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl id="phoneNumber">
            <FormLabel>Phone Number*</FormLabel>
            <Input
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl id="emailAddress">
            <FormLabel>Email Address*</FormLabel>
            <Input
              type="email"
              name="emailAddress"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={handleChange}
              required
            />
          </FormControl>

          {/* Delivery Information */}
          <FormControl id="motorcycle">
            <FormLabel>Motorcycle Information</FormLabel>
            <Input
              type="text"
              name="motorcycle"
              placeholder="Motorcycle details"
              value={formData.motorcycle}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="bicycle">
            <FormLabel>Bicycle Information</FormLabel>
            <Input
              type="text"
              name="bicycle"
              placeholder="Bicycle details"
              value={formData.bicycle}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="van">
            <FormLabel>Van Information</FormLabel>
            <Input
              type="text"
              name="van"
              placeholder="Van details"
              value={formData.van}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="transport">
            <FormLabel>Transport*</FormLabel>
            <Select
              name="transport"
              value={formData.transport}
              onChange={handleChange}
              required
            >
              <option value="bike">Bike</option>
              <option value="vehicle">Vehicle</option>
              <option value="motorcycle">Motorcycle</option>
            </Select>
          </FormControl>

          <Button type="submit" colorScheme="teal" className="bg-green-500">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Partner;

