"use client";

import { Box, Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import UpdateAccount from "@components/modals/UpdateAccount";
import ChangePassword from "@components/modals/ChangePassword";

const GeneralTab = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();

  return (
    <>
      {/* Modals */}
      {isUpdateOpen && <UpdateAccount closeModal={onUpdateClose} />}
      {isPasswordOpen && <ChangePassword closeModal={onPasswordClose} />}

      <Box>
        <Box padding={"1rem 0"} mb={4}>
          <Flex 
            justifyContent={{ base: "center", md: "end" }} 
            gap={3}
            flexWrap="wrap"
          >
            <ButtonComponent 
              type={"button"} 
              text={"Change Password"} 
              onClick={onPasswordOpen}
              size="regular"
            />
            <ButtonComponent 
              type={"button"} 
              text={"Update Details"} 
              onClick={onUpdateOpen}
              size="regular"
            />
          </Flex>
        </Box>
        <Box 
          padding={"1.5rem"} 
          bg="gray.50" 
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            mb={4}
            color="gray.800"
          >
            Personal Information
          </Text>
          <Grid
            gridTemplateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gridGap={"1.5rem"}
          >
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ boxShadow: "sm" }}
            >
              <Text fontSize={"sm"} color="gray.600" mb={1}>First Name</Text>
              <Text
                fontSize={"lg"}
                fontWeight={"bold"}
                color="gray.800"
              >{`${userInfo?.firstname || 'N/A'}`}</Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ boxShadow: "sm" }}
            >
              <Text fontSize={"sm"} color="gray.600" mb={1}>Last Name</Text>
              <Text
                fontSize={"lg"}
                fontWeight={"bold"}
                color="gray.800"
              >{`${userInfo?.lastname || 'N/A'}`}</Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ boxShadow: "sm" }}
            >
              <Text fontSize={"sm"} color="gray.600" mb={1}>Email</Text>
              <Text
                fontSize={"lg"}
                fontWeight={"bold"}
                color="gray.800"
              >{`${userInfo?.email || 'N/A'}`}</Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ boxShadow: "sm" }}
            >
              <Text fontSize={"sm"} color="gray.600" mb={1}>Phone Number</Text>
              <Text
                fontSize={"lg"}
                fontWeight={"bold"}
                color="gray.800"
              >{`${userInfo?.phone || 'N/A'}`}</Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ boxShadow: "sm" }}
            >
              <Text fontSize={"sm"} color="gray.600" mb={1}>Gender</Text>
              <Text
                fontSize={"lg"}
                fontWeight={"bold"}
                color="gray.800"
              >{`${userInfo?.gender || 'N/A'}`}</Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ boxShadow: "sm" }}
            >
              <Text fontSize={"sm"} color="gray.600" mb={1}>Vegan</Text>
              <Text fontSize={"lg"} fontWeight={"bold"} color="gray.800">{`${
                userInfo?.vegan ? "Vegan" : "Not Vegan"
              }`}</Text>
            </Box>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default GeneralTab;
