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
        <FormControl>
          <FormLabel>Vehicle</FormLabel>
          <Input
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Motorcycle</FormLabel>
          <Select
            value={motorcycle}
            onChange={(event) => setMotorcycle(event.target.value)}
          >
            <option value="bike">Bike</option>
            <option value="vehicle">Vehicle</option>
            <option value="motorcycle">Motorcycle</option>
          </Select>
        </FormControl>
        <Button mt="4" colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ThreeInOneDeliveryForm;

