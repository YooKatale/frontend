"use client";

import { Box } from "@chakra-ui/react";
import Image from "next/image";

const ResponsiveBackground = ({ url }) => {
  return (
    <Box
      position="relative"
      width="100%"
      height={{ base: "50px", sm: "70px", md: "100px" }}
      overflow="hidden"
    >
      <Image
        src={url}
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
    </Box>
  );
};

export default ResponsiveBackground;
