import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { useState } from 'react';

const VendorForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name,
      phone,
      email,
      businessName,
      businessAddress,
      businessHours,
    });
  };

  return (
    <Box maxW="md" mx="auto" p="4">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone number</FormLabel>
          <Input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Business name</FormLabel>
          <Input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Business address</FormLabel>
          <Input
            value={businessAddress}
            onChange={(event) => setBusinessAddress(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Business hours</FormLabel>
          <Input
            value={businessHours}
            onChange={(event) => setBusinessHours(event.target.value)}
          />
        </FormControl>
        <Button mt="4" colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default VendorForm;

