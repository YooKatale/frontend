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
  Fade,
  ScaleFade,
  SlideFade,
  useDisclosure
} from '@chakra-ui/react';
import ButtonComponent from '@components/Button';
import { Loader, Store, MapPin, Phone, Mail, CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PlusOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { ThemeColors } from '@constants/constants';
import { useRegisterVendorMutation } from '@slices/vendorSlice';

const MotionBox = motion(Box);
const MotionForm = motion.form;

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
  const [formStep, setFormStep] = useState(1);
  const chakraToast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const [registerVendor] = useRegisterVendorMutation();

  // Form validation
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      chakraToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.terms) {
      chakraToast({
        title: 'Notice',
        description: 'Please agree to the terms and conditions to proceed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const data = {
        name: formData.name,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        vegan: formData.vegan,
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
        
        // Reset form with animation
        setTimeout(() => {
          setFormData({
            name: '',
            address: '',
            phone: '',
            email: '',
            category: '',
            vegan: false,
            terms: false,
          });
          setFormStep(1);
          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      setLoading(false);
      
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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const faqItems = [
    {
      question: 'How do I register my business on YooKatale?',
      answer: 'Fill out the registration form on this page with your store details. Our team will review and approve within 24 hours.',
    },
    {
      question: 'How long does registration process take?',
      answer: 'After submitting the form, your account will be reviewed and approved within 24 hours.',
    },
    {
      question: 'How do I collect my money on YooKatale?',
      answer: 'Payments are processed weekly through bank transfer. You\'ll receive payments every Monday for the previous week\'s sales.',
    },
    {
      question: 'What categories can I register under?',
      answer: 'We support various categories including Fresh Produce, Groceries, Restaurants, Services, and Specialty Foods.',
    },
    {
      question: 'Is there a registration fee?',
      answer: 'No, registering as a vendor on YooKatale is completely free!',
    },
  ];

  const categories = [
    'Fresh Produce',
    'Groceries',
    'Restaurant',
    'Bakery',
    'Butchery',
    'Dairy Products',
    'Beverages',
    'Health Foods',
    'Kitchen Supplies',
    'Food Delivery',
    'Catering Services',
    'Organic Foods',
    'Farm Produce',
    'Seafood',
    'Spices & Herbs',
    'International Cuisine',
    'Street Food',
    'Coffee Shop',
    'Juice Bar',
    'Supermarket',
    'Livestock farmer',
    'Fisherman',
    'Carbohydrates',
    'Protein',
    'Fats & Oils',
    'Vitamins',
    'Gas',
    'Knife Sharpening',
    'Breakfast',
    'Dairy',
    'Vegetables',
    'Juice',
    'Meals',
    'Root tubers',
    'Market',
    'Shop',
    'Dairy farmer',
    'Poultry farmer',
    'Egg supplier',
    'Honey supplier',
    'Cuisines',
    'Kitchen',
    'Supplements',
    'Gym',
    'Sunna & steam',
    'Hotel',
    'Chef',
    'Culinary',
  ];

  const FormInput = ({ icon: Icon, label, name, type = 'text', placeholder, ...props }) => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormControl className="mb-6" isInvalid={errors[name]}>
        <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
          <Icon size={18} style={{ color: ThemeColors.primaryColor }} />
          {label}
        </FormLabel>
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          required
          className={`border-2 rounded-xl px-4 py-3 text-lg transition-all duration-300
            ${errors[name] 
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500' 
              : 'border-gray-200 hover:border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
            }
          `}
          _focus={{
            boxShadow: `0 0 0 3px ${ThemeColors.primaryColor}20`,
            borderColor: ThemeColors.primaryColor,
          }}
          {...props}
        />
        {errors[name] && (
          <Text className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors[name]}
          </Text>
        )}
      </FormControl>
    </MotionBox>
  );

  const ProgressBar = () => (
    <Box className="mb-8">
      <Box className="flex items-center justify-between mb-2">
        <Text className="font-semibold text-gray-600">
          Step {formStep} of 2
        </Text>
        <Text className="font-bold" style={{ color: ThemeColors.primaryColor }}>
          {formStep === 1 ? 'Store Details' : 'Final Step'}
        </Text>
      </Box>
      <Box className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <MotionBox
          className="h-full"
          style={{
            background: `linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`
          }}
          initial={{ width: '50%' }}
          animate={{ width: formStep === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.5 }}
        />
      </Box>
    </Box>
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
          Join <span style={{ color: ThemeColors.primaryColor }}>YooKatale</span> as a Vendor
        </Heading>
        <Text className="text-xl text-gray-600 max-w-2xl mx-auto">
          Grow your business with thousands of customers. Register your store and start selling today!
        </Text>
      </MotionBox>

      <Box className="flex flex-col lg:flex-row gap-8">
        {/* Main Form Card */}
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-2/3"
        >
          <Card 
            className="shadow-2xl rounded-3xl border border-gray-100 overflow-hidden"
            bg="white"
          >
            <CardBody className="p-6 md:p-8">
              {/* Progress Indicator */}
              <ProgressBar />
              
              <MotionForm
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {formStep === 1 && (
                  <SlideFade in={formStep === 1}>
                    <VStack spacing={6}>
                      <Heading as="h2" className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <ShopOutlined style={{ color: ThemeColors.primaryColor }} />
                        Store Information
                      </Heading>
                      
                      <FormInput
                        icon={Store}
                        label="Store Name"
                        name="name"
                        placeholder="Enter your store name"
                      />
                      
                      <FormInput
                        icon={MapPin}
                        label="Store Address"
                        name="address"
                        placeholder="Enter complete address"
                      />
                      
                      <FormInput
                        icon={Phone}
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+256 XXX XXX XXX"
                      />
                      
                      <FormInput
                        icon={Mail}
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                      />
                      
                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="w-full"
                      >
                        <FormControl isInvalid={errors.category}>
                          <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <Store size={18} style={{ color: ThemeColors.primaryColor }} />
                            Business Category
                          </FormLabel>
                          <Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
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
                          {errors.category && (
                            <Text className="text-red-500 text-sm mt-1">{errors.category}</Text>
                          )}
                        </FormControl>
                      </MotionBox>
                      
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="w-full"
                      >
                        <HStack className="p-4 bg-gray-50 rounded-xl">
                          <input
                            type="checkbox"
                            name="vegan"
                            id="vegan"
                            checked={formData.vegan}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-300 focus:ring-green-600"
                            style={{ accentColor: ThemeColors.primaryColor }}
                          />
                          <label htmlFor="vegan" className="text-gray-700 cursor-pointer">
                            Our store offers vegetarian/vegan options
                          </label>
                        </HStack>
                      </MotionBox>
                      
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="w-full"
                      >
                        <ButtonComponent
                          text="Next Step"
                          size="lg"
                          type="button"
                          onClick={() => setFormStep(2)}
                          className="w-full py-3 text-lg"
                        />
                      </MotionBox>
                    </VStack>
                  </SlideFade>
                )}
                
                {formStep === 2 && (
                  <SlideFade in={formStep === 2}>
                    <VStack spacing={6}>
                      <Heading as="h2" className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <CheckCircleOutlined style={{ color: ThemeColors.primaryColor }} />
                        Final Step
                      </Heading>
                      
                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full p-6 rounded-xl"
                        style={{ backgroundColor: `${ThemeColors.primaryColor}08` }}
                      >
                        <VStack spacing={4} align="start">
                          <Text className="font-semibold text-gray-700">Review Your Information:</Text>
                          <Box className="space-y-2">
                            <Text><span className="font-medium">Store:</span> {formData.name || 'Not provided'}</Text>
                            <Text><span className="font-medium">Category:</span> {formData.category || 'Not selected'}</Text>
                            <Text><span className="font-medium">Phone:</span> {formData.phone || 'Not provided'}</Text>
                          </Box>
                        </VStack>
                      </MotionBox>
                      
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="w-full"
                      >
                        <HStack className="p-4 bg-gray-50 rounded-xl mb-4">
                          <input
                            type="checkbox"
                            name="terms"
                            id="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-300 focus:ring-green-600"
                            style={{ accentColor: ThemeColors.primaryColor }}
                          />
                          <label htmlFor="terms" className="text-gray-700 cursor-pointer">
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
                      
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="w-full flex gap-4"
                      >
                        <ButtonComponent
                          text="Back"
                          size="lg"
                          type="button"
                          variant="outline"
                          onClick={() => setFormStep(1)}
                          className="flex-1 py-3"
                        />
                        <ButtonComponent
                          text={isLoading ? 'Submitting...' : 'Submit Application'}
                          size="lg"
                          type="submit"
                          isLoading={isLoading}
                          loadingText="Processing..."
                          leftIcon={!isLoading && <Sparkles size={20} />}
                          className="flex-1 py-3"
                          style={{
                            background: `linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`,
                            color: 'white',
                          }}
                        />
                      </MotionBox>
                    </VStack>
                  </SlideFade>
                )}
              </MotionForm>
            </CardBody>
          </Card>
          
          {/* Benefits Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                icon: '🚀',
                title: 'Quick Onboarding',
                desc: 'Get approved and start selling within 24 hours'
              },
              {
                icon: '📱',
                title: 'Easy Management',
                desc: 'Manage orders and inventory from your dashboard'
              },
              {
                icon: '💰',
                title: 'Weekly Payments',
                desc: 'Reliable weekly payments directly to your bank'
              }
            ].map((benefit, idx) => (
              <Box
                key={idx}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Text className="text-2xl mb-2">{benefit.icon}</Text>
                <Text className="font-semibold text-gray-800">{benefit.title}</Text>
                <Text className="text-gray-600 text-sm">{benefit.desc}</Text>
              </Box>
            ))}
          </MotionBox>
        </MotionBox>
        
        {/* FAQ Section */}
        <MotionBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:w-1/3"
        >
          <Card className="shadow-xl rounded-3xl border border-gray-100 h-fit">
            <CardBody className="p-6">
              <Heading as="h3" className="text-2xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-6 h-6" style={{ color: ThemeColors.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Frequently Asked Questions
              </Heading>
              
              <VStack spacing={4} align="stretch">
                {faqItems.map((item, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        activeQuestion === index 
                          ? 'border-l-4' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      style={activeQuestion === index ? {
                        backgroundColor: `${ThemeColors.primaryColor}10`,
                        borderLeftColor: ThemeColors.primaryColor
                      } : {}}
                      onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                    >
                      <HStack justify="space-between" className="mb-2">
                        <Text className="font-semibold text-gray-800 pr-4">
                          {item.question}
                        </Text>
                        {activeQuestion === index ? (
                          <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: ThemeColors.primaryColor }} />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </HStack>
                      
                      <ScaleFade in={activeQuestion === index}>
                        {activeQuestion === index && (
                          <Text className="text-gray-600 mt-2 pl-2 border-l-2" style={{ borderLeftColor: `${ThemeColors.primaryColor}50` }}>
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
                <Text className="text-gray-600 mb-3">
                  Our support team is here to help you get started
                </Text>
                <HStack>
                  <Phone size={16} style={{ color: ThemeColors.primaryColor }} />
                  <Text className="font-medium">+256 700 123 456</Text>
                </HStack>
                <HStack className="mt-2">
                  <Mail size={16} style={{ color: ThemeColors.primaryColor }} />
                  <Text className="font-medium">vendors@yookatale.com</Text>
                </HStack>
              </Box>
            </CardBody>
          </Card>
        </MotionBox>
      </Box>
      
      {/* Success Animation (Hidden by default) */}
      {isLoading && (
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
