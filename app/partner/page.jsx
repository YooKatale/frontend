"use client";

import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import ButtonComponent from '@components/Button';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { ThemeColors } from '@constants/constants';
import { PlusOutlined } from '@ant-design/icons';
import VendorForm from '@components/DeliveryForm'; 

const Partner = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    category: '', 
    vegan: false,
    terms: false,
  });
  const [isLoading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const chakraToast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!formData.terms) {
      chakraToast({
        title: 'Notice',
        description: 'Please agree to the terms and conditions to proceed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${DB_URL}/vendor/new`, formData);
      chakraToast({
        title: 'Vendor form',
        description: 'Successfully Submitted vendor form',
        status: 'success',
        duration: 5000,
        isClosable: false,
      });

      
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        category: '', 
        vegan: false,
        terms: false,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);

      chakraToast({
        title: 'Error',
        description: error.data?.message
          ? error.data?.message
          : error.data || error.error,
        status: 'error',
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const faqItems = [
    {
      question: 'How do I register my business on YooKatale?',
      answer:
        'Visit Partner page and fill in the vendor registration form yookatale.com/partner',
    },
    {
      question: 'How long does registration process take?',
      answer:
        'After filling in the form, your account will be reviewed and approved within 24 hours.',
    },
    {
      question: 'How do I collect my money on YooKatale?',
      answer: 'YooKatale vendor payments are processed weekly through a Bank account.',
    },
  ];

  const handleQuestionClick = (index) => {
    if (index === activeQuestion) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  }

  return (
    <div>
      <p style={{textAlign:'center', marginTop:'20px', fontSize:'50px'}}>
        Partner With Us
      </p>
     
      <Box
        className="mx-auto p-4 bg-black mb-20 mt-20"
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <Box
          className="mx-auto p-4 bg-white mb-20 mt-20"
          style={{ textAlign: 'center' }}
        >
          <p className="text-3xl text-left mb-4 text-dark">
            Become Our Vendor Today!
          </p>
        </Box>
        <Box className="p-4 md:w-2/5 rounded-xl bg-white">
          <p className="text-3xl text-left mb-4 text-dark">
            Fill out the vendor form
          </p>
          <form onSubmit={handleSubmit}>
            <FormControl className="mb-4">
              <FormLabel>Vendor's Name*</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Vendor's Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border border-dark italic hover:border-red focus:border-red px-2 py-1"
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Address*</FormLabel>
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="border border-dark italic hover-border-red focus-border-red rounded px-2 py-1"
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Phone Number*</FormLabel>
              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border border-dark italic hover-border-red focus-border-red rounded px-2 py-1"
              />
            </FormControl>
            <FormControl className="mb-4">
              <FormLabel>Email Address*</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-dark italic hover-border-red focus-border-red rounded px-2 py-1"
              />
            </FormControl>

       
            <FormControl className="mb-4">
              <FormLabel>Category*</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="border border-dark italic hover-border-red focus-border-red rounded px-2 py-1"
              >
                <option value="Livestock farmer">Livestock farmer</option>
                <option value="Dairy farmer">Dairy farmer</option>
                <option value="Poultry farmer">Poultry farmer</option>
                <option value="Egg supplier">Egg supplier</option>
                <option value="Honey supplier">Honey supplier</option>
                <option value="Fruit grower">Fruit grower</option>
                <option value="Vegetable grower">Vegetable grower</option>
                <option value="Grain farmer">Grain farmer</option>
                <option value="Fisherman">Fisherman</option>
              </Select>
            </FormControl>

            <Box padding="0.5rem 0">
              <div className="flex">
                <input
                  type="checkbox"
                  name="vegan"
                  checked={formData.vegan}
                  onChange={handleChange}
                  className="mr-4"
                />
                <p className="">Are you vegetarian?</p>
              </div>
            </Box>

            <Box padding="0.5rem 0">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-4"
              />
              I agree to the{' '}
              <Link href="/vendor-terms">
                <span style={{ color: ThemeColors.darkColor }}>
                  terms and conditions
                </span>
              </Link>
            </Box>

            <div className="text-center md:text-left">
              <ButtonComponent
                text="Sign Up"
                size="lg"
                type="submit"
                icon={isLoading && <Loader size={20} />}
              />
            </div>
          </form>
        </Box>

        <Box className="p-4 w-full md:w-1/2 md:ml-5">
          <div className="mt-10">
            <div className="mt-10 text-white">
              <h3 className="text-xl md:text-3xl text-left mb-4">Frequently Asked Questions</h3>
              {faqItems.map((item, index) => (
                <div key={index} className="mb-4">
                  <p
                    className="text-white font-bold text-sm md:text-xl mb-2"
                    onClick={() => handleQuestionClick(index)}
                    style={{ cursor: 'pointer', borderRadius: '2px' }}
                  >
                    <span
                      className="icon-circle mr-6"
                      style={{
                        backgroundColor: activeQuestion === index ? 'black' : 'white',
                      }}
                    >
                      <PlusOutlined style={{ color: activeQuestion === index ? 'white' : 'black' }} />
                    </span>
                    {item.question}
                  </p>
                  <div className="ml-10">
                    {activeQuestion === index && (
                      <p className="text-gray-300">{item.answer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Box>

 
      <VendorForm />

      {/* Frequently Asked Questions */}
      <Box className="p-4 w-full md:w-1/2 md:ml-5">
        {/* FAQ Items */}
      </Box>
    </div>
  );
};

export default Partner;
