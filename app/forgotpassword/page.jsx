"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useResetPasswordMutation } from "@slices/usersApiSlice";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLinkSent, setLinkSent] = useState(false);
  const toast = useToast();
  const router = useRouter()

  const [resetPassword] = useResetPasswordMutation();
  // const resetLink = `${window.location.origin}/resetpassword/page.jsx`;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await resetPassword({ email });
      if(response.data.status === 200){
        toast({
          title: "Password Reset Request Sent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push(`/resetpassword/${response.data.token}`)
        setLoading(false);
        setLinkSent(true);
      }
      setLoading(false);
      setLinkSent(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Email address not found.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8" style={{ height: "400px" }}>
      <p style={{ textAlign: "center", fontSize: "30px" }}>
        Recover Your Account
      </p>
      <br />
      <br />
      {!isLinkSent ? (
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            mt="4"
            isLoading={isLoading}
            loadingText="Sending..."
            style={{
              backgroundColor: "black",
              color: "white",
              _hover: {
                backgroundColor: "blue",
              },
            }}
          >
            Send Reset Link
          </Button>
        </form>
      ) : (
        <Text textAlign="center" fontSize="lg">
          {/* Password reset link has been sent to your email. Please check your
          inbox (and spam folder) for further instructions. */}
          Password reset request has been sent. Please wait to be redirected.
        </Text>
      )}
      <br />
      <br />
      <Box padding="1rem 0">
        <Text display="flex">
          Back to Login:{" "}
          <Link href={"/signin"} style={{ color: "green", margin: "0 0.5rem" }}>
            Sign In
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
