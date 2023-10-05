"use client"
import { Box, FormControl, FormLabel, Input, Button, Select } from '@chakra-ui/react';
import { useState } from 'react';

const VendorForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [bike, setBike] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [motorcycle, setMotorcycle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name,
      phone,
      email,
      businessName,
      businessAddress,
      businessHours,
      bike,
      vehicle,
      motorcycle,
    });
  };

  return (
    <Box className="mx-auto p-4 bg-black mb-20 mt-20">
      <div className="flex flex-col lg:flex-row">
        <div className="p-4 rounded-xl bg-white">
          <p className="text-3xl text-left mb-4 text-dark">Fill out the form to start delivering</p>
          <form onSubmit={handleSubmit}>
            <FormControl className="mb-4">
              <FormLabel>Name*</FormLabel>
              <Input
                className="border-b border-dark italic hover:border-red focus:border-red px-2 py-1"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name Lastname"
                required
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Phone number*</FormLabel>
              <Input
                className="border border-dark italic hover:border-red focus:border-red rounded px-2 py-1"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0712378472"
                required
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Email address*</FormLabel>
              <Input
                className="border border-dark italic hover:border-red focus:border-red rounded px-2 py-1"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Business name*</FormLabel>
              <Input
                className="border border-dark italic hover:border-red focus:border-red rounded px-2 py-1"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Please enter your business name"
                required
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Business address*</FormLabel>
              <Input
                className="border border-dark italic hover:border-red focus:border-red rounded px-2 py-1"
                value={businessAddress}
                onChange={(event) => setBusinessAddress(event.target.value)}
                placeholder="Please enter business address"
                required
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Business hours*</FormLabel>
              <Input
                className="border border-dark italic hover:border-red focus:border-red rounded px-2 py-1"
                value={businessHours}
                onChange={(event) => setBusinessHours(event.target.value)}
                placeholder="Please enter business hours"
                required
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Vehicle*</FormLabel>
              <Select
                className="border border-dark rounded hover:border-red focus:border-red px-2 py-1 italic"
                value={motorcycle}
                onChange={(event) => setMotorcycle(event.target.value)}
                required
              >
                <option value="bike">Bike</option>
                <option value="vehicle">Vehicle</option>
                <option value="motorcycle">Motorcycle</option>
              </Select>
            </FormControl>
             <div className="text-center md:text-left">
               <Button className="mt-4 bg-dark text-white rounded-full pl-10 pr-10 hover:bg-teal-600 mx-auto" type="submit">
                 Sign up
               </Button>
             </div>
          </form>
        </div>
        <div className="p-4 w-full md:w-1/2 md:ml-5">
          <div className="mt-10">
            <h2 className="text-3xl text-white">Hello</h2>
            <p className="text-white mt-5">
              Do you want to set your own schedule and connect when it suits you? Get paid for delivering orders with the yookatale Courier App.
            </p>
            <h4 className="text-white font-bold mt-5">Sign up today!</h4>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default VendorForm;
