"use client"
import { Box, FormControl, FormLabel, Input, Button, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { DB_URL } from '@config/config';
import axios from 'axios';
import ButtonComponent from './Button';
import { Loader2 } from 'lucide-react';

const VendorForm = ({ onSubmit }) => {
  const [fullname, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [transport, setTransport] = useState("bike");
  const [successMessage, setSucessMessage] = useState('');
  const [isLoading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${DB_URL}/partner/new`, {
        fullname,
        phone,
        email,
        location,
        businessName,
        businessAddress,
        businessHours,
        transport,
      });
      setName('');
      setPhone('');
      setBusinessName('');
      setBusinessAddress('');
      setBusinessHours('');
      setLocation('');
      setTransport('bike');
      setSucessMessage('Form submitted successfully!');
      setTimeout(() => {
        setSucessMessage('');
      }, 5000);
    

    } catch (error) {
      console.error('Error creating partner', error);
    }
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
                value={fullname}
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
              <FormLabel>Location*</FormLabel>
              <Input
                className="border border-dark italic hover:border-red focus:border-red rounded px-2 py-1"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Please enter your location"
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
              <FormLabel>Transport*</FormLabel>
              <Select
                className="border border-dark rounded hover:border-red focus:border-red px-2 py-1 italic"
                value={transport}
                onChange={(event) => setTransport(event.target.value)}
                required
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
                    type={"button"}
                    icon={isLoading && <Loader2 size={20} />}
                  />
             </div>
             {successMessage && (
              <div className="text-dark text-center mt-4">{successMessage}</div>
            )}
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