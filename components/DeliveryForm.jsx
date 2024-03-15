"use client"
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { DB_URL } from '@config/config';
import axios from 'axios';
import ButtonComponent from './Button';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { ThemeColors } from '@constants/constants';
import { PlusOutlined } from '@ant-design/icons';

const VendorForm = () => {
  const [fullname, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [transport, setTransport] = useState('bike');
  const [isLoading, setLoading] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [terms, setTerms] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const chakraToast = useToast();


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!terms) {
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
      await axios.post(`${DB_URL}/partner/new`, {
        fullname,
        phone,
        email,
        location,
        businessName,
        businessAddress,
        businessHours,
        transport,
        vegan,
      });
      chakraToast({
        title: 'Vendor form',
        description: 'Successfully Submitted driver form',
        status: 'success',
        duration: 5000,
        isClosable: false,
      });

      setName('');
      setPhone('');
      setBusinessName('');
      setBusinessAddress('');
      setBusinessHours('');
      setLocation('');
      setTransport('bike');
      setVegan(false);

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
    const { name, checked } = event.target;
    if (name === 'vegan') {
      setVegan(checked);
    } else if (name === 'terms') {
      setTerms(checked);
    }
  };

  const faqItems = [
    {
      question: 'How do I register to deliver with YooKatale?',
      answer: 'Fill in the delivery form to sign up as a delivery person.',
    },
    {
      question: 'How long does registration take?',
      answer: 'Within 24 hours your account will be reviewed and approved to start.',
    },
    {
      question: 'How do I get my earnings?',
      answer: 'Delivery payments are made weekly via Bank.',
    },
    {
      question: 'Why should I deliver for YooKatale?',
      answer: 'Earn your way, get access to a van, motorcycle, bicycle, or tricycle.',
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
 
    <Box className="mx-auto p-4 bg-black mb-20 mt-20">

        <Box
      className="mx-auto p-4 bg-black mb-20 mt-20"
      style={{ textAlign: 'center' }}
    >
      <p style={{color:'white', fontSize:'30px'}}>
        Become a Deliverer!
      </p>
    </Box>
      <div className="flex flex-col lg:flex-row">
        <div className="p-4 md:w-2/5 rounded-xl bg-white">
          <p className="text-3xl text-left mb-4 text-dark">
            Fill out the form to start delivering
          </p>
          <form onSubmit={handleSubmit}>
            <FormControl className="mb-4">
              <FormLabel>Name*</FormLabel>
              <Input
                className="border-b border-dark italic hover:border-red focus:border-red px-2 py-1"
                value={fullname}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter Full Name"
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
            <Box padding="0.5rem 0">
              <div className="flex">
                <input
                  type="checkbox"
                  name="vegan"
                  checked={vegan}
                  onChange={handleChange}
                  className="mr-4"
                />
                <p className="">Do you want to apply for a new Courier from YooKatale?</p>
              </div>
            </Box>

            <Box padding="0.5rem 0">
              <input
                type="checkbox"
                name="terms"
                checked={terms}
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
        </div>
        <div className="p-4 w-full md:w-1/2 md:ml-5">
          <div className="mt-10">
            <h2 className="text-3xl text-white">Hello</h2>
            <p className="text-white mt-5">
              Do you want to set your own schedule and connect when it suits you? Get paid for delivering orders with the yookatale Courier App.
            </p>
            <h4 className="text-white font-bold mt-5">Sign up today!</h4>
            <div className="mt-10 text-white">
            <h3 className="text-xl md:text-3xl text-left mb-4">Frequently Asked Questions</h3>
               {faqItems.map((item, index) => (
                  <div key={index} className="mb-4">
                   <p
                    className="text-white font-bold text-sm md:text-xl mb-2"
                    onClick={() => handleQuestionClick(index)}
                    style={{ cursor: 'pointer' }}
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
        </div>
      </div>
    </Box>
  );
};

export default VendorForm;
