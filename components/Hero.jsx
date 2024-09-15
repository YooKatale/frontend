"use client";

import { Box } from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box
      as="section"
      width="100%"
      maxWidth="87.5rem"  // 1400px converted to rem (1400 / 16 = 87.5rem)
      margin="0 auto"
      height={{ 
        base: "12.5rem",    // 12.5rem remains the same
        sm: "18.75rem",     // 18.75rem for small screens
        lg: "25rem"         // 25rem for larger screens
      }}
      backgroundImage="url('/assets/images/banner.jpg')"
      backgroundPosition="center"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
    />
  );
};

export default Hero;
