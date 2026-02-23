import { Box } from "@chakra-ui/react";
const ResponsiveBackground = ({ url }) => {
  return (
    <Box
    sx={{
      height: { base: '50px', sm: '70px', md: '100px' },
      bgSize: "contain", // Make the entire image is visible
      bgRepeat: "no-repeat",
    }}
    >
    <img 
    src={url} 
    alt="Banner" 
    style={{
      width: '100%',
      height: '100%',
    }} 
  />
</Box>
  );
};

export default ResponsiveBackground;
