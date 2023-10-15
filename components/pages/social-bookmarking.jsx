// pages/social-bookmarking.jsx
import { useState } from 'react';
import { chakra } from '@chakra-ui/react';
import { connectToDatabase } from '../database'; // Import the database connection module

const SocialBookmarking = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = async () => {
    const db = await connectToDatabase(); // Establish a database connection

    // Save the URL for social bookmarking
    await db.collection('socialBookmarkings').insertOne({
      url,
    });

    // Redirect to the success page
    router.push('/social-bookmarking/success');
  };

  return (
    <chakra.div>
      <h1>Social Bookmarking</h1>
      <chakra.form onSubmit={handleSubmit}>
        <chakra.input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <chakra.button type="submit">Bookmark</chakra.button>
      </chakra.form>
    </chakra.div>
  );
};

export default SocialBookmarking;

