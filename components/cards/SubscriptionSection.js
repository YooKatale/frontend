import { Box } from '@mui/material';
import Image from 'next/image'; // or use MUI img if needed

export default function Subscription() {
  return (
    <Box
      component="a"
      href="/subscription"
      sx={{
        display: 'block',
        textDecoration: 'none',
        width: '100%', // Full width for mobile responsiveness
        margin: '0 auto', // Center the box on larger screens
      }}
    >
      <Image
        src="/assets/images/sub.jpg"
        alt="Subscription Image"
        layout="responsive" // Ensures responsiveness
        width={600} // Set appropriate width
        height={400} // Set appropriate height
        style={{
          objectFit: 'contain', // Ensures the image fits well within the container
        }}
      />
    </Box>
  );
}
