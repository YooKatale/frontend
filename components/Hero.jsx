"use client";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Images, ThemeColors } from "@constants/constants";
import Image from "next/image";
import Link from "next/link";
import ButtonComponent from "./Button";

const Hero = () => {
  return (
   
      <div className="lg:bg-[url('/assets/images/banner.jpg')] sm:bg-[url('/assets/images/banner.jpg')] bg-[url('/assets/images/banner1.png')] bg-cover bg-center lg:h-[450px] sm:h-[300px] h-[200px]"></div>
  
  );
};

export default Hero;
