"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import VendorForm from "@components/DeliveryForm";
import ButtonComponent from "@components/Button";
import { DB_URL } from "@config/config";
import { Loader2 } from "lucide-react";

const Partner = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    transport: "bike",
  });
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${DB_URL}/vendor/new`, formData);
      setSuccessMessage('Form submitted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
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
  <div className="mb-10">
    <VendorForm />
    <Box p={4} borderWidth={1} borderRadius="lg" w={{ base: "100%", md: "md" }} mx="auto"> {/* Set the width to full on mobile and medium on larger screens */}
      <form onSubmit={handleSubmit}>
       <p className="text-3xl text-left mb-4 text-dark">Fill out the vendor form</p>
       <Stack spacing={4}>
            <FormControl id="name">
              <FormLabel>Vendor's Name*</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Vendor's Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border border-dark rounded hover:border-red focus:border-red px-2 py-1 italic"
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
                className="border border-dark rounded hover:border-red focus:border-red px-2 py-1 italic"
              />
            </FormControl>
            <FormControl id="phoneNumber">
              <FormLabel>Phone Number*</FormLabel>
              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border border-dark rounded hover:border-red focus:border-red px-2 py-1 italic"
              />
            </FormControl>
            <FormControl id="emailAddress">
              <FormLabel>Email Address*</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-dark rounded hover:border-red focus:border-red px-2 py-1 italic"
              />
            </FormControl>

            {/* Delivery Information */}
            <FormControl id="transport">
              <FormLabel>Transport*</FormLabel>
              <Select
                name="transport"
                value={formData.transport}
                onChange={handleChange}
                required
                className="border border-dark rounded hover:border-red focus:border-red px-2 py-1 italic"
              >
                <option value="bike">Bike</option>
                <option value="vehicle">Vehicle</option>
                <option value="motorcycle">Motorcycle</option>
              </Select>
            </FormControl>

            <div className="text-center md:text-left">
              <ButtonComponent
                text={"Sign Up"}
                size={"lg"}
                type={"submit"}
                icon={isLoading && <Loader2 size={20} />}
              />
            </div>
          </Stack>
        {successMessage && (
          <div className="text-dark text-center mt-4">{successMessage}</div>
        )}
      </form>
    </Box>
  </div>
  );
};

export default Partner;

