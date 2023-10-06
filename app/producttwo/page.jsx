"use client"
import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';

function ProductForm() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
  });

  const [message, setMessage] = useState(''); // State variable for displaying a message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4400/api/products', productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        setMessage('Product created successfully');
      } else {
        setMessage('Product creation failed');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setMessage('An error occurred');
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt="4"
      p="4"
      bg="white"
      rounded="lg"
      shadow="lg"
    >
      <form onSubmit={handleSubmit}>
      {message && <p>{message}</p>}
        <FormControl mb="4">
          <FormLabel htmlFor="name">Name:</FormLabel>
          <Input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            rounded="lg"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel htmlFor="description">Description:</FormLabel>
          <Textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
            rounded="lg"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel htmlFor="price">Price:</FormLabel>
          <Input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
            rounded="lg"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel htmlFor="quantity">Quantity:</FormLabel>
          <Input
            type="number"
            id="quantity"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            required
            rounded="lg"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel htmlFor="category">Category:</FormLabel>
          <Input
            type="text"
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
            rounded="lg"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel htmlFor="imageUrl">Image URL:</FormLabel>
          <Input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleChange}
            rounded="lg"
          />
        </FormControl>
        <Button
          type="submit"
          bg="blue.500"
          color="white"
          py="2"
          rounded="lg"
          _hover={{ bg: 'blue.600' }}
          _focus={{ outline: 'blue.400', bg: 'blue.400' }}
        >
          Create Product
        </Button>
        {message && <p>{message}</p>}
      </form>
    </Box>
  );
}

export default ProductForm;
