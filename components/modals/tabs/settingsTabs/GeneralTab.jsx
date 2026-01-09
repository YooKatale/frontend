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
        <Box padding={"1rem 0"}>
          <Flex justifyContent={"end"} gap={3}>
            <ButtonComponent 
              type={"button"} 
              text={"Change Password"} 
              onClick={onPasswordOpen}
            />
            <ButtonComponent 
              type={"button"} 
              text={"Update Details"} 
              onClick={onUpdateOpen}
            />
          </Flex>
        </Box>
        <Box padding={"0.5rem 1rem"}>
          <Grid
            gridTemplateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gridGap={"1rem"}
          >
            <Box>
              <Text fontSize={"lg"}>First Name</Text>
              <Text
                fontSize={"md"}
                fontWeight={"bold"}
              >{`${userInfo?.firstname || 'N/A'}`}</Text>
            </Box>
            <Box>
              <Text fontSize={"lg"}>Last Name</Text>
              <Text
                fontSize={"md"}
                fontWeight={"bold"}
              >{`${userInfo?.lastname || 'N/A'}`}</Text>
            </Box>
            <Box>
              <Text fontSize={"lg"}>Email</Text>
              <Text
                fontSize={"md"}
                fontWeight={"bold"}
              >{`${userInfo?.email || 'N/A'}`}</Text>
            </Box>
            <Box>
              <Text fontSize={"lg"}>Phone Number</Text>
              <Text
                fontSize={"md"}
                fontWeight={"bold"}
              >{`${userInfo?.phone || 'N/A'}`}</Text>
            </Box>
            <Box>
              <Text fontSize={"lg"}>Gender</Text>
              <Text
                fontSize={"md"}
                fontWeight={"bold"}
              >{`${userInfo?.gender || 'N/A'}`}</Text>
            </Box>
            <Box>
              <Text fontSize={"lg"}>Vegan</Text>
              <Text fontSize={"md"} fontWeight={"bold"}>{`${
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
