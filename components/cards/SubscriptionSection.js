import { Box, Link } from '@mui/material';

const SubscriptionSection = () => {
  return (
    <Box 
      component="section" 
      sx={{
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '2rem'
      }}
    >
      {/* Link Component */}
      <Link href="/subscription" underline="none">
        {/* Image within Box */}
        <Box
          component="img"
          src="/assets/images/sub.jpg"
          alt="Subscription Image"
          sx={{
            width: { xs: '100%', sm: '80%', md: '60%' },  // Responsive width
            height: 'auto',  // Maintain aspect ratio
            maxHeight: '200px', // Limit max height
          }}
        />
      </Link>
    </Box>
  );
};

export default SubscriptionSection;
