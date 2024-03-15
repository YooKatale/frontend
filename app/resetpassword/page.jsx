"use client"; 

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import { useResetPasswordMutation } from "@slices/usersApiSlice"; 

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [isLoading, setLoading] = useState(false);
  const [isPasswordReset, setPasswordReset] = useState(false);
  const toast = useToast();

  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true); 
    try {
      const response = await resetPassword({ email, password });
      setLoading(false); 
      setPasswordReset(true); 
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false); 
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8" style={{height:'500px'}}>
      <Text textAlign="center" fontSize="3xl" fontWeight="bold" mb="4">
        Reset Your Password
      </Text>
      {!isPasswordReset ? (
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired mb="4">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired mb="4">
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="confirmPassword" isRequired mb="4">
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <br />
          <br />
          <Button type="submit" isLoading={isLoading} loadingText="Resetting..." style={{color:'white', backgroundColor:'green'}}>
            Reset Password
          </Button>
        </form>
      ) : (
        <Text textAlign="center" fontSize="lg">
          Your password has been reset successfully.
        </Text>
      )}
    </Box>
  );
};

export default ResetPasswordPage;