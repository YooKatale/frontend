"use client";

import { Box } from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box
      as="section"
      width="100%"
      maxWidth="1400px"
      margin="0 auto"
      height={{ base: "12.5rem", sm: "18.75rem", lg: "25rem" }}
      backgroundImage="url('/assets/images/banner.jpg')"
      backgroundPosition="center"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
    />
  );
};

export default Hero;
