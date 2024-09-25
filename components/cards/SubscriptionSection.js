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
        src="/assets/images/subnew.jpeg"
        alt="Subscription Image"
        layout="responsive" // Ensures responsiveness
        width={600} 
        height={400} 
        style={{
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
