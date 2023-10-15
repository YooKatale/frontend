// pages/directory-submission.jsx
import { useState } from 'react';
import { chakra } from '@chakra-ui/react';
import { connectToDatabase } from '../database'; // Import the database connection module

const DirectorySubmission = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async () => {
    const db = await connectToDatabase(); // Establish a database connection

    // Create a new directory submission document
    await db.collection('directorySubmissions').insertOne({
      name,
      url,
    });

    // Redirect to the success page
    router.push('/directory-submission/success');
  };

  return (
    <chakra.div>
      <h1>Directory Submission</h1>
      <chakra.form onSubmit={handleSubmit}>
        <chakra.input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <chakra.input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <chakra.button type="submit">Submit</chakra.button>
      </chakra.form>
    </chakra.div>
  );
};

export default DirectorySubmission;

