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
        {/* ... rest of the form fields ... */}
        <Button mt="4" colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default VendorForm;

