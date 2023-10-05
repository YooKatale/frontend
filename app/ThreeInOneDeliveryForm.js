import { Box, FormControl, FormLabel, Input, Select, Button } from '@chakra-ui/react';
import { useState } from 'react';

const ThreeInOneDeliveryForm = ({ onSubmit }) => {
  const [bike, setBike] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [motorcycle, setMotorcycle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ bike, vehicle, motorcycle });
  };

  return (
    <Box maxW="md" mx="auto" p="4">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Bike</FormLabel>
          <Input
            value={bike}
            onChange={(event) => setBike(event.target.value)}
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

export default ThreeInOneDeliveryForm;

