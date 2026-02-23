"use client";

import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Container,
  ScaleFade,
  SlideFade,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from '@chakra-ui/react';
import ButtonComponent from '@components/Button';
import { 
  Loader, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Truck,
  User,
  Clock,
  Building2,
  Bike,
  Car,
  Motorcycle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@slices/authSlice';
import { motion } from 'framer-motion';
import { 
  ShopOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CarOutlined
} from '@ant-design/icons';
import { ThemeColors } from '@constants/constants';
import { useRegisterVendorMutation } from '@slices/vendorSlice';
import { useSubmitDeliveryFormMutation } from '@slices/deliveryFormSlice';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Partner = () => {
  const [activeTab, setActiveTab] = useState(0);
  const chakraToast = useToast();
  const router = useRouter();
  const { userInfo } = useAuth();

  // Vendor Form State
  const [vendorFormData, setVendorFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    category: '',
    vegan: false,
    terms: false,
  });
  const [vendorFormStep, setVendorFormStep] = useState(1);
  const [isVendorLoading, setIsVendorLoading] = useState(false);
  const [vendorErrors, setVendorErrors] = useState({});
  const [registerVendor] = useRegisterVendorMutation();

  // Delivery Form State
  const [deliveryFormData, setDeliveryFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    location: '',
    businessName: '',
    businessAddress: '',
    businessHours: '',
    transport: 'bike',
    numberPlate: '',
    vegan: false,
    terms: false,
  });
  const [isDeliveryLoading, setIsDeliveryLoading] = useState(false);
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [submitDeliveryForm] = useSubmitDeliveryFormMutation();

  // FAQ State
  const [activeVendorQuestion, setActiveVendorQuestion] = useState(null);
  const [activeDeliveryQuestion, setActiveDeliveryQuestion] = useState(null);

  // Vendor Form Handlers
  const validateVendorForm = () => {
    const newErrors = {};
    if (!vendorFormData.name.trim()) newErrors.name = 'Store name is required';
    if (!vendorFormData.address.trim()) newErrors.address = 'Address is required';
    if (!vendorFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]+$/.test(vendorFormData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!vendorFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorFormData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!vendorFormData.category) newErrors.category = 'Please select a category';
    setVendorErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVendorSubmit = async (event) => {
    event.preventDefault();
    if (!validateVendorForm()) {
      chakraToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!vendorFormData.terms) {
      chakraToast({
        title: 'Notice',
        description: 'Please agree to the terms and conditions to proceed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsVendorLoading(true);
    try {
      const data = {
        name: vendorFormData.name,
        address: vendorFormData.address,
        email: vendorFormData.email,
        phone: vendorFormData.phone,
        category: vendorFormData.category,
        vegan: vendorFormData.vegan,
        status: 'Unverified'
      };
      const response = await registerVendor(data).unwrap();
      if (response.status === "Success") {
        chakraToast({
          title: 'Application Submitted! 🎉',
          description: 'Your vendor application has been received. We\'ll review it within 24 hours.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        setTimeout(() => {
          setVendorFormData({
            name: '',
            address: '',
            phone: '',
            email: '',
            category: '',
            vegan: false,
            terms: false,
          });
          setVendorFormStep(1);
          setIsVendorLoading(false);
          // Redirect to seller stores page if user is logged in
          if (userInfo) {
            setTimeout(() => {
              router.push('/sell/stores');
            }, 2000);
          }
        }, 1500);
      }
    } catch (error) {
      setIsVendorLoading(false);
      chakraToast({
        title: 'Error',
        description: error.data?.message || error.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleVendorChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (vendorErrors[name]) {
      setVendorErrors(prev => ({ ...prev, [name]: '' }));
    }
    setVendorFormData({ ...vendorFormData, [name]: newValue });
  };

  // Delivery Form Handlers
  const validateDeliveryForm = () => {
    const newErrors = {};
    if (!deliveryFormData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!deliveryFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]+$/.test(deliveryFormData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!deliveryFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryFormData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!deliveryFormData.location.trim()) newErrors.location = 'Location is required';
    if (!deliveryFormData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!deliveryFormData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!deliveryFormData.businessHours.trim()) newErrors.businessHours = 'Business hours are required';
    if (deliveryFormData.transport !== 'bike' && !deliveryFormData.numberPlate.trim()) {
      newErrors.numberPlate = 'Number plate is required';
    }
    setDeliveryErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeliverySubmit = async (event) => {
    event.preventDefault();
    if (!validateDeliveryForm()) {
      chakraToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!deliveryFormData.terms) {
      chakraToast({
        title: 'Notice',
        description: 'Please agree to the terms and conditions to proceed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsDeliveryLoading(true);
    try {
      const payload = {
        fullname: deliveryFormData.fullname,
        phone: deliveryFormData.phone,
        email: deliveryFormData.email,
        location: deliveryFormData.location,
        businessName: deliveryFormData.businessName,
        businessAddress: deliveryFormData.businessAddress,
        businessHours: deliveryFormData.businessHours,
        transport: deliveryFormData.transport,
        vegan: deliveryFormData.vegan,
      };
      if (deliveryFormData.transport !== 'bike') {
        payload.numberPlate = deliveryFormData.numberPlate;
      }
      await submitDeliveryForm(payload).unwrap();
      chakraToast({
        title: 'Application Submitted! 🎉',
        description: 'Your delivery application has been received. We\'ll review it within 24 hours.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setTimeout(() => {
        setDeliveryFormData({
          fullname: '',
          phone: '',
          email: '',
          location: '',
          businessName: '',
          businessAddress: '',
          businessHours: '',
          transport: 'bike',
          numberPlate: '',
          vegan: false,
          terms: false,
        });
        setIsDeliveryLoading(false);
      }, 1500);
    } catch (error) {
      setIsDeliveryLoading(false);
      chakraToast({
        title: 'Error',
        description: error.data?.message || error.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleDeliveryChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (deliveryErrors[name]) {
      setDeliveryErrors(prev => ({ ...prev, [name]: '' }));
    }
    setDeliveryFormData({ ...deliveryFormData, [name]: newValue });
  };

  // FAQ Data
  const vendorFaqItems = [
    {
      question: 'How do I register my business on YooKatale?',
      answer: 'Fill out the vendor registration form on this page with your store details including name, address, contact information, and business category. Our team will review and approve your application within 24 hours.',
    },
    {
      question: 'How long does the registration process take?',
      answer: 'After submitting the form, your account will be reviewed and approved within 24 hours. You\'ll receive an email notification once your application is approved.',
    },
    {
      question: 'How do I collect my money on YooKatale?',
      answer: 'Payments are processed weekly through bank transfer. You\'ll receive payments every Monday for the previous week\'s sales. All payment details are managed through your vendor dashboard.',
    },
    {
      question: 'What categories can I register under?',
      answer: 'We support various categories including Fresh Produce, Groceries, Restaurants, Bakery, Butchery, Dairy Products, Beverages, Health Foods, Kitchen Supplies, Food Delivery, Catering Services, Organic Foods, and many more.',
    },
    {
      question: 'Is there a registration fee?',
      answer: 'No, registering as a vendor on YooKatale is completely free! There are no hidden fees or charges. You only pay a small commission on successful sales.',
    },
    {
      question: 'Can I update my store information after registration?',
      answer: 'Yes, you can update your store information, business hours, and other details anytime through your vendor dashboard after your account is approved.',
    },
  ];

  const deliveryFaqItems = [
    {
      question: 'How do I register to deliver with YooKatale?',
      answer: 'Fill out the delivery form on this page with your personal details, business information, and preferred transport method. Our team will review your application and get back to you within 24 hours.',
    },
    {
      question: 'How long does registration take?',
      answer: 'Within 24 hours your account will be reviewed and approved to start delivering. You\'ll receive an email notification with your login credentials once approved.',
    },
    {
      question: 'How do I get my earnings?',
      answer: 'Delivery payments are made weekly via bank transfer every Monday. You can track your earnings in real-time through the delivery app dashboard.',
    },
    {
      question: 'Why should I deliver for YooKatale?',
      answer: 'Earn your way with flexible schedules, competitive rates, and the freedom to work when it suits you. Get access to delivery vehicles (van, motorcycle, bicycle, or tricycle) if needed, and enjoy weekly reliable payments.',
    },
    {
      question: 'What transport options are available?',
      answer: 'You can deliver using a bike, motorcycle, or vehicle. If you choose vehicle or motorcycle, you\'ll need to provide your number plate. We also offer vehicle assistance programs for qualified delivery partners.',
    },
    {
      question: 'Can I set my own schedule?',
      answer: 'Yes! One of the biggest advantages of delivering with YooKatale is setting your own schedule. Work when it suits you and connect to the app whenever you\'re ready to accept deliveries.',
    },
  ];

  const categories = [
    'Fresh Produce', 'Groceries', 'Restaurant', 'Bakery', 'Butchery',
    'Dairy Products', 'Beverages', 'Health Foods', 'Kitchen Supplies',
    'Food Delivery', 'Catering Services', 'Organic Foods', 'Farm Produce',
    'Seafood', 'Spices & Herbs', 'International Cuisine', 'Street Food',
    'Coffee Shop', 'Juice Bar', 'Supermarket', 'Livestock farmer',
    'Fisherman', 'Carbohydrates', 'Protein', 'Fats & Oils', 'Vitamins',
    'Gas', 'Knife Sharpening', 'Breakfast', 'Dairy', 'Vegetables',
    'Juice', 'Meals', 'Root tubers', 'Market', 'Shop', 'Dairy farmer',
    'Poultry farmer', 'Egg supplier', 'Honey supplier', 'Cuisines',
    'Kitchen', 'Supplements', 'Gym', 'Sunna & steam', 'Hotel', 'Chef', 'Culinary',
  ];

  const FormInput = ({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, error, ...props }) => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormControl className="mb-6" isInvalid={error}>
        <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
          <Icon size={18} style={{ color: ThemeColors.primaryColor }} />
          {label}
        </FormLabel>
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className={`border-2 rounded-xl px-4 py-3 text-lg transition-all duration-300 w-full ${
            error 
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500' 
              : 'border-gray-200 hover:border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
          }`}
          _focus={{
            boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
            borderColor: ThemeColors.primaryColor,
          }}
          {...props}
        />
        {error && (
          <Text className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </Text>
        )}
      </FormControl>
    </MotionBox>
  );

  return (
    <Container maxW="container.xl" className="py-8 md:py-12">
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Box 
          className="inline-block p-3 rounded-full mb-4"
          style={{ backgroundColor: `${ThemeColors.primaryColor}15` }}
        >
          <Store className="w-12 h-12" style={{ color: ThemeColors.primaryColor }} />
        </Box>
        <Heading as="h1" className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Partner with <span style={{ color: ThemeColors.primaryColor }}>YooKatale</span>
        </Heading>
        <Text className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Join thousands of vendors and delivery partners. Register your store or become a delivery driver today!
        </Text>
      </MotionBox>

      {/* Tabs for Vendor and Delivery Forms */}
      <Tabs 
        index={activeTab} 
        onChange={setActiveTab}
        colorScheme="green"
        variant="enclosed"
        className="mb-8"
      >
        <TabList className="flex flex-wrap justify-center gap-2 mb-8">
          <Tab 
            className="px-6 py-3 text-lg font-semibold rounded-t-xl"
            _selected={{
              color: 'white',
              bg: ThemeColors.primaryColor,
            }}
            style={{
              color: activeTab === 0 ? 'white' : ThemeColors.primaryColor,
              backgroundColor: activeTab === 0 ? ThemeColors.primaryColor : 'transparent',
            }}
          >
            <HStack>
              <Store size={20} />
              <Text>Vendor Registration</Text>
            </HStack>
          </Tab>
          <Tab 
            className="px-6 py-3 text-lg font-semibold rounded-t-xl"
            _selected={{
              color: 'white',
              bg: ThemeColors.primaryColor,
            }}
            style={{
              color: activeTab === 1 ? 'white' : ThemeColors.primaryColor,
              backgroundColor: activeTab === 1 ? ThemeColors.primaryColor : 'transparent',
            }}
          >
            <HStack>
              <Truck size={20} />
              <Text>Delivery Partner</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Vendor Registration Tab */}
          <TabPanel>
            <Box className="flex flex-col lg:flex-row gap-8">
              {/* Vendor Form */}
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-2/3 shadow-2xl rounded-3xl border border-gray-100 overflow-hidden"
                bg="white"
              >
                <CardBody className="p-6 md:p-8">
                  <Heading as="h2" className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <ShopOutlined style={{ color: ThemeColors.primaryColor }} />
                    Store Registration Form
                  </Heading>

                  <form onSubmit={handleVendorSubmit}>
                    {vendorFormStep === 1 && (
                      <SlideFade in={vendorFormStep === 1}>
                        <VStack spacing={6}>
                          <FormInput
                            icon={Store}
                            label="Store Name *"
                            name="name"
                            placeholder="Enter your store name"
                            value={vendorFormData.name}
                            onChange={handleVendorChange}
                            error={vendorErrors.name}
                          />
                          
                          <FormInput
                            icon={MapPin}
                            label="Store Address *"
                            name="address"
                            placeholder="Enter complete address"
                            value={vendorFormData.address}
                            onChange={handleVendorChange}
                            error={vendorErrors.address}
                          />
                          
                          <FormInput
                            icon={Phone}
                            label="Phone Number *"
                            name="phone"
                            type="tel"
                            placeholder="+256 XXX XXX XXX"
                            value={vendorFormData.phone}
                            onChange={handleVendorChange}
                            error={vendorErrors.phone}
                          />
                          
                          <FormInput
                            icon={Mail}
                            label="Email Address *"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={vendorFormData.email}
                            onChange={handleVendorChange}
                            error={vendorErrors.email}
                          />
                          
                          <MotionBox className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                            <FormControl isInvalid={vendorErrors.category}>
                              <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                <Store size={18} style={{ color: ThemeColors.primaryColor }} />
                                Business Category *
                              </FormLabel>
                              <Select
                                name="category"
                                value={vendorFormData.category}
                                onChange={handleVendorChange}
                                required
                                className="border-2 rounded-xl px-4 py-3 text-lg border-gray-200 hover:border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 transition-all duration-300"
                                placeholder="Select your category"
                                _focus={{
                                  boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
                                  borderColor: ThemeColors.primaryColor,
                                }}
                              >
                                {categories.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </Select>
                              {vendorErrors.category && (
                                <Text className="text-red-500 text-sm mt-1">{vendorErrors.category}</Text>
                              )}
                            </FormControl>
                          </MotionBox>
                          
                          <MotionBox className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
                            <HStack className="p-4 bg-gray-50 rounded-xl">
                              <input
                                type="checkbox"
                                name="vegan"
                                id="vegan"
                                checked={vendorFormData.vegan}
                                onChange={handleVendorChange}
                                className="w-5 h-5 rounded border-gray-300 focus:ring-green-600"
                                style={{ accentColor: ThemeColors.primaryColor }}
                              />
                              <label htmlFor="vegan" className="text-gray-700 cursor-pointer">
                                Our store offers vegetarian/vegan options
                              </label>
                            </HStack>
                          </MotionBox>
                          
                          <MotionBox className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
                            <ButtonComponent
                              text="Next Step →"
                              size="lg"
                              type="button"
                              onClick={() => setVendorFormStep(2)}
                              className="w-full py-3 text-lg font-semibold"
                            />
                          </MotionBox>
                        </VStack>
                      </SlideFade>
                    )}
                    
                    {vendorFormStep === 2 && (
                      <SlideFade in={vendorFormStep === 2}>
                        <VStack spacing={6}>
                          <Heading as="h2" className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <CheckCircleOutlined style={{ color: ThemeColors.primaryColor }} />
                            Review & Submit
                          </Heading>
                          
                          <MotionBox className="w-full p-6 rounded-xl" style={{ backgroundColor: `${ThemeColors.primaryColor}08` }}>
                            <VStack spacing={4} align="start">
                              <Text className="font-semibold text-gray-700">Review Your Information:</Text>
                              <Box className="space-y-2">
                                <Text><span className="font-medium">Store:</span> {vendorFormData.name || 'Not provided'}</Text>
                                <Text><span className="font-medium">Category:</span> {vendorFormData.category || 'Not selected'}</Text>
                                <Text><span className="font-medium">Phone:</span> {vendorFormData.phone || 'Not provided'}</Text>
                                <Text><span className="font-medium">Email:</span> {vendorFormData.email || 'Not provided'}</Text>
                                <Text><span className="font-medium">Address:</span> {vendorFormData.address || 'Not provided'}</Text>
                              </Box>
                            </VStack>
                          </MotionBox>
                          
                          <MotionBox className="w-full">
                            <HStack className="p-4 bg-gray-50 rounded-xl mb-4">
                              <input
                                type="checkbox"
                                name="terms"
                                id="vendor-terms"
                                checked={vendorFormData.terms}
                                onChange={handleVendorChange}
                                className="w-5 h-5 rounded border-gray-300 focus:ring-green-600"
                                style={{ accentColor: ThemeColors.primaryColor }}
                              />
                              <label htmlFor="vendor-terms" className="text-gray-700 cursor-pointer">
                                I agree to the{' '}
                                <Link href="/vendor-terms" className="font-semibold hover:underline" style={{ color: ThemeColors.primaryColor }}>
                                  Terms & Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="font-semibold hover:underline" style={{ color: ThemeColors.primaryColor }}>
                                  Privacy Policy
                                </Link>
                              </label>
                            </HStack>
                          </MotionBox>
                          
                          <MotionBox className="w-full flex gap-4">
                            <ButtonComponent
                              text="← Back"
                              size="lg"
                              type="button"
                              variant="outline"
                              onClick={() => setVendorFormStep(1)}
                              className="flex-1 py-3 font-semibold"
                            />
                            <ButtonComponent
                              text={isVendorLoading ? 'Submitting...' : 'Submit Application'}
                              size="lg"
                              type="submit"
                              isLoading={isVendorLoading}
                              loadingText="Processing..."
                              leftIcon={!isVendorLoading && <Sparkles size={20} />}
                              className="flex-1 py-3 font-semibold"
                              style={{
                                background: `linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`,
                                color: 'white',
                              }}
                            />
                          </MotionBox>
                        </VStack>
                      </SlideFade>
                    )}
                  </form>
                </CardBody>
              </MotionCard>

              {/* Vendor FAQ */}
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:w-1/3 shadow-xl rounded-3xl border border-gray-100 h-fit"
              >
                <CardBody className="p-6">
                  <Heading as="h3" className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6" style={{ color: ThemeColors.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vendor FAQs
                  </Heading>
                  
                  <VStack spacing={4} align="stretch">
                    {vendorFaqItems.map((item, index) => (
                      <MotionBox
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            activeVendorQuestion === index 
                              ? 'border-l-4' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          style={activeVendorQuestion === index ? {
                            backgroundColor: `${ThemeColors.primaryColor}10`,
                            borderLeftColor: ThemeColors.primaryColor
                          } : {}}
                          onClick={() => setActiveVendorQuestion(activeVendorQuestion === index ? null : index)}
                        >
                          <HStack justify="space-between" className="mb-2">
                            <Text className="font-semibold text-gray-800 pr-4 text-sm">
                              {item.question}
                            </Text>
                            {activeVendorQuestion === index ? (
                              <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: ThemeColors.primaryColor }} />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </HStack>
                          
                          <ScaleFade in={activeVendorQuestion === index}>
                            {activeVendorQuestion === index && (
                              <Text className="text-gray-600 mt-2 pl-2 border-l-2 text-sm" style={{ borderLeftColor: `${ThemeColors.primaryColor}50` }}>
                                {item.answer}
                              </Text>
                            )}
                          </ScaleFade>
                        </Box>
                      </MotionBox>
                    ))}
                  </VStack>
                </CardBody>
              </MotionCard>
            </Box>
          </TabPanel>

          {/* Delivery Partner Tab */}
          <TabPanel>
            <Box className="flex flex-col lg:flex-row gap-8">
              {/* Delivery Form */}
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-2/3 shadow-2xl rounded-3xl border border-gray-100 overflow-hidden"
                bg="white"
              >
                <CardBody className="p-6 md:p-8">
                  <Heading as="h2" className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Truck style={{ color: ThemeColors.primaryColor }} size={24} />
                    Delivery Partner Registration
                  </Heading>

                  <form onSubmit={handleDeliverySubmit}>
                    <VStack spacing={6}>
                      <FormInput
                        icon={User}
                        label="Full Name *"
                        name="fullname"
                        placeholder="Enter your full name"
                        value={deliveryFormData.fullname}
                        onChange={handleDeliveryChange}
                        error={deliveryErrors.fullname}
                      />
                      
                      <FormInput
                        icon={Phone}
                        label="Phone Number *"
                        name="phone"
                        type="tel"
                        placeholder="+256 XXX XXX XXX"
                        value={deliveryFormData.phone}
                        onChange={handleDeliveryChange}
                        error={deliveryErrors.phone}
                      />
                      
                      <FormInput
                        icon={Mail}
                        label="Email Address *"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={deliveryFormData.email}
                        onChange={handleDeliveryChange}
                        error={deliveryErrors.email}
                      />
                      
                      <FormInput
                        icon={MapPin}
                        label="Location *"
                        name="location"
                        placeholder="Enter your location"
                        value={deliveryFormData.location}
                        onChange={handleDeliveryChange}
                        error={deliveryErrors.location}
                      />
                      
                      <FormInput
                        icon={Building2}
                        label="Business Name *"
                        name="businessName"
                        placeholder="Enter your business name"
                        value={deliveryFormData.businessName}
                        onChange={handleDeliveryChange}
                        error={deliveryErrors.businessName}
                      />
                      
                      <FormInput
                        icon={MapPin}
                        label="Business Address *"
                        name="businessAddress"
                        placeholder="Enter business address"
                        value={deliveryFormData.businessAddress}
                        onChange={handleDeliveryChange}
                        error={deliveryErrors.businessAddress}
                      />
                      
                      <FormInput
                        icon={Clock}
                        label="Business Hours *"
                        name="businessHours"
                        placeholder="e.g., 8:00 AM - 6:00 PM"
                        value={deliveryFormData.businessHours}
                        onChange={handleDeliveryChange}
                        error={deliveryErrors.businessHours}
                      />
                      
                      <MotionBox className="w-full">
                        <FormControl>
                          <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <CarOutlined style={{ color: ThemeColors.primaryColor }} />
                            Transport Method *
                          </FormLabel>
                          <Select
                            name="transport"
                            value={deliveryFormData.transport}
                            onChange={handleDeliveryChange}
                            required
                            className="border-2 rounded-xl px-4 py-3 text-lg border-gray-200 hover:border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 transition-all duration-300"
                            _focus={{
                              boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
                              borderColor: ThemeColors.primaryColor,
                            }}
                          >
                            <option value="bike">Bike</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="vehicle">Vehicle</option>
                          </Select>
                        </FormControl>
                      </MotionBox>
                      
                      {deliveryFormData.transport !== 'bike' && (
                        <MotionBox className="w-full" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                          <FormInput
                            icon={Car}
                            label="Number Plate *"
                            name="numberPlate"
                            placeholder="Enter vehicle number plate"
                            value={deliveryFormData.numberPlate}
                            onChange={handleDeliveryChange}
                            error={deliveryErrors.numberPlate}
                          />
                        </MotionBox>
                      )}
                      
                      <MotionBox className="w-full">
                        <HStack className="p-4 bg-gray-50 rounded-xl">
                          <input
                            type="checkbox"
                            name="vegan"
                            id="delivery-vegan"
                            checked={deliveryFormData.vegan}
                            onChange={handleDeliveryChange}
                            className="w-5 h-5 rounded border-gray-300 focus:ring-green-600"
                            style={{ accentColor: ThemeColors.primaryColor }}
                          />
                          <label htmlFor="delivery-vegan" className="text-gray-700 cursor-pointer">
                            Do you want to apply for a new Courier from YooKatale?
                          </label>
                        </HStack>
                      </MotionBox>
                      
                      <MotionBox className="w-full">
                        <HStack className="p-4 bg-gray-50 rounded-xl mb-4">
                          <input
                            type="checkbox"
                            name="terms"
                            id="delivery-terms"
                            checked={deliveryFormData.terms}
                            onChange={handleDeliveryChange}
                            className="w-5 h-5 rounded border-gray-300 focus:ring-green-600"
                            style={{ accentColor: ThemeColors.primaryColor }}
                          />
                          <label htmlFor="delivery-terms" className="text-gray-700 cursor-pointer">
                            I agree to the{' '}
                            <Link href="/vendor-terms" className="font-semibold hover:underline" style={{ color: ThemeColors.primaryColor }}>
                              Terms & Conditions
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="font-semibold hover:underline" style={{ color: ThemeColors.primaryColor }}>
                              Privacy Policy
                            </Link>
                          </label>
                        </HStack>
                      </MotionBox>
                      
                      <MotionBox className="w-full">
                        <ButtonComponent
                          text={isDeliveryLoading ? 'Submitting...' : 'Submit Application'}
                          size="lg"
                          type="submit"
                          isLoading={isDeliveryLoading}
                          loadingText="Processing..."
                          leftIcon={!isDeliveryLoading && <Sparkles size={20} />}
                          className="w-full py-3 text-lg font-semibold"
                          style={{
                            background: `linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`,
                            color: 'white',
                          }}
                        />
                      </MotionBox>
                    </VStack>
                  </form>
                </CardBody>
              </MotionCard>

              {/* Delivery FAQ */}
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:w-1/3 shadow-xl rounded-3xl border border-gray-100 h-fit"
              >
                <CardBody className="p-6">
                  <Heading as="h3" className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6" style={{ color: ThemeColors.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Delivery FAQs
                  </Heading>
                  
                  <VStack spacing={4} align="stretch">
                    {deliveryFaqItems.map((item, index) => (
                      <MotionBox
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            activeDeliveryQuestion === index 
                              ? 'border-l-4' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          style={activeDeliveryQuestion === index ? {
                            backgroundColor: `${ThemeColors.primaryColor}10`,
                            borderLeftColor: ThemeColors.primaryColor
                          } : {}}
                          onClick={() => setActiveDeliveryQuestion(activeDeliveryQuestion === index ? null : index)}
                        >
                          <HStack justify="space-between" className="mb-2">
                            <Text className="font-semibold text-gray-800 pr-4 text-sm">
                              {item.question}
                            </Text>
                            {activeDeliveryQuestion === index ? (
                              <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: ThemeColors.primaryColor }} />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </HStack>
                          
                          <ScaleFade in={activeDeliveryQuestion === index}>
                            {activeDeliveryQuestion === index && (
                              <Text className="text-gray-600 mt-2 pl-2 border-l-2 text-sm" style={{ borderLeftColor: `${ThemeColors.primaryColor}50` }}>
                                {item.answer}
                              </Text>
                            )}
                          </ScaleFade>
                        </Box>
                      </MotionBox>
                    ))}
                  </VStack>
                  
                  {/* Support Info */}
                  <Box 
                    className="mt-8 p-4 rounded-xl"
                    style={{ 
                      background: `linear-gradient(to right, ${ThemeColors.primaryColor}15, ${ThemeColors.secondaryColor}15)`
                    }}
                  >
                    <Text className="font-semibold text-gray-800 mb-2">Need Help?</Text>
                    <Text className="text-gray-600 mb-3 text-sm">
                      Our support team is here to help you get started
                    </Text>
                    <HStack>
                      <Phone size={16} style={{ color: ThemeColors.primaryColor }} />
                      <Text className="font-medium text-sm">+256 700 123 456</Text>
                    </HStack>
                    <HStack className="mt-2">
                      <Mail size={16} style={{ color: ThemeColors.primaryColor }} />
                      <Text className="font-medium text-sm">delivery@yookatale.com</Text>
                    </HStack>
                  </Box>
                </CardBody>
              </MotionCard>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Benefits Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: '🚀',
            title: 'Quick Onboarding',
            desc: 'Get approved and start within 24 hours'
          },
          {
            icon: '📱',
            title: 'Easy Management',
            desc: 'Manage everything from your dashboard'
          },
          {
            icon: '💰',
            title: 'Weekly Payments',
            desc: 'Reliable weekly payments to your bank'
          }
        ].map((benefit, idx) => (
          <Box
            key={idx}
            className="p-6 bg-white rounded-xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ borderColor: `${ThemeColors.primaryColor}20` }}
          >
            <Text className="text-4xl mb-3">{benefit.icon}</Text>
            <Text className="font-bold text-gray-800 text-lg mb-2">{benefit.title}</Text>
            <Text className="text-gray-600">{benefit.desc}</Text>
          </Box>
        ))}
      </MotionBox>

      {/* Loading Overlay */}
      {(isVendorLoading || isDeliveryLoading) && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white p-8 rounded-3xl shadow-2xl text-center"
          >
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: ThemeColors.primaryColor }} />
            <Text className="text-xl font-semibold">Processing your application...</Text>
            <Text className="text-gray-600 mt-2">Please wait a moment</Text>
          </MotionBox>
        </MotionBox>
      )}
    </Container>
  );
};

export default Partner;
