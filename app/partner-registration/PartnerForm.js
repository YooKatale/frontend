import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import { Input } from "@components/ui/input";
import { usePartnerPostMutation } from "@slices/usersApiSlice";
import { Bike, Building, Loader2 } from "lucide-react";

const Partner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    location: "",
    products: "",
    message: "",
    type: "vendor",
    vehicleType: "",
  });

  const chakraToast = useToast();
  const [createPartnerPost] = usePartnerPostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading((prevState) => !prevState);

    try {
      const res = await createPartnerPost(formData).unwrap();

      if (res.status === "Success") {
        chakraToast({
          title: "Request Sent",
          description: "Your request has been sent successfully.",
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    } finally {
      setIsLoading(false);
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        location: "",
        products: "",
        message: "",
      });
    }
  };

  return (
    <div className="py-4">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Become a Partner</h1>
        <p className="text-sm text-gray-600">
          Grow Your Business With Us
        </p>
      </div>

      {/* Partner Type Selection */}
      <div className="flex justify-center gap-4">
        <div
          className={`flex items-center p-3 rounded-md border-2 ${
            formData.type === "vendor" ? "border-primary" : "border-gray-300"
          } cursor-pointer`}
          onClick={() => setFormData({ ...formData, type: "vendor" })}
        >
          <Building
            size={24}
            className={`${
              formData.type === "vendor" ? "text-primary" : "text-gray-400"
            } mr-2`}
          />
          <span className="text-gray-800">I am a Vendor</span>
        </div>
        <div
          className={`flex items-center p-3 rounded-md border-2 ${
            formData.type === "delivery" ? "border-primary" : "border-gray-300"
          } cursor-pointer`}
          onClick={() => setFormData({ ...formData, type: "delivery" })}
        >
          <Bike
            size={24}
            className={`${
              formData.type === "delivery" ? "text-primary" : "text-gray-400"
            } mr-2`}
          />
          <span className="text-gray-800">I am a Delivery Person</span>
        </div>
      </div>

      {/* Partner Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        {/* Fullname */}
        <Input
          type="text"
          name="fullname"
          placeholder="Fullname"
          value={formData.fullname}
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
        />

       
        {/* Email */}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Phone */}
        <Input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        {/* Location */}
        <Input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        {/* Products and Quantity */}
        {formData.type === "vendor" && (
          <textarea
            className="w-full max-h-[100px] border-[1.8px] border-gray-300 p-4 rounded-md mt-4"
            name="products"
            placeholder="Products and Quantity"
            value={formData.products}
            onChange={(e) => setFormData({ ...formData, products: e.target.value })}
          />
        )}

        {/* Vehicle Type */}
        {formData.type === "delivery" && (
          <select
            name="vehicleType"
            id="vehicleType"
            className="outline-none py-2 px-4 border-[1.7px] rounded-md w-full mt-4"
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
          >
            <option value="">Choose Vehicle Type</option>
            <option value="car">Car</option>
            <option value="motorbike">Motorbike</option>
            <option value="bicycle">Bicycle</option>
          </select>
        )}

        {/* Message */}
        <textarea
          className="w-full max-h-[100px] border-[1.8px] border-gray-300 p-4 rounded-md mt-4"
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />

        {/* Submit Button */}
        <div className="mt-6">
          <ButtonComponent
            text="Submit"
            type="submit"
            icon={isLoading && <Loader2 size={20} />}
          />
        </div>
      </form>
    </div>
  );
};

export default Partner;

