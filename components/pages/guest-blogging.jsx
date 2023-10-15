import { useState } from 'react';
import { FormControl, FormLabel, Input, Textarea, Button, chakra } from '@chakra-ui/react';

const GuestBlogging = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [pitch, setPitch] = useState('');

  const handleSubmit = async () => {
    // Submit the guest blogging pitch to the website owner
    // ...

    // Redirect to the success page
    // ...
  };

  return (
    <chakra.div>
      <h1>Guest Blogging</h1>
      <FormControl as="form" onSubmit={handleSubmit}>
        <FormLabel>Name</FormLabel>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormLabel>Website</FormLabel>
        <Input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <FormLabel>Pitch</FormLabel>
        <Textarea value={pitch} onChange={(e) => setPitch(e.target.value)} />
        <Button type="submit">Submit</Button>
      </FormControl>
    </chakra.div>
  );
};

export default GuestBlogging;

