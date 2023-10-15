// pages/image-sharing.jsx
import { useState } from 'react';
import { chakra } from '@chakra-ui/react';
import { connectToDatabase } from '../database'; // Import the database connection module

const ImageSharing = () => {
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async () => {
    const db = await connectToDatabase(); // Establish a database connection

    // Save the image URL to the database
    await db.collection('imageSharings').insertOne({
      imageUrl,
    });

    // Redirect to the success page
    router.push('/image-sharing/success');
  };

  return (
    <chakra.div>
      <h1>Image Sharing</h1>
      <chakra.form onSubmit={handleSubmit}>
        <chakra.input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <chakra.button type="submit">Share</chakra.button>
      </chakra.form>
    </chakra.div>
  );
};

export default ImageSharing;

