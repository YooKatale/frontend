import { Box } from '@mui/material';

const ResponsiveBackground = ({ url }) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%', // Full width
        height: '350px', // Default height for larger screens
        '@media (max-width: 600px)': {
          height: '200px', // Adjust height for small screens like phones
          backgroundSize: 'contain', // Ensure proper scaling on smaller screens
        },
        '@media (min-width: 600px) and (max-width: 960px)': {
          height: '250px', // Adjust height for tablets
        },
        '@media (min-width: 960px)': {
          height: '350px', // Default height for larger screens
        },
      }}
    />
  );
};

export default ResponsiveBackground;
