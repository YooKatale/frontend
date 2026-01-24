"use client";

import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
  Button,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useMessagePostMutation } from "@slices/usersApiSlice";
import { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [sendMessage, { isLoading: isSending }] = useMessagePostMutation();
  const chakraToast = useToast();

  const validate = () => {
    const err = {};
    if (!name || !name.trim()) err.name = "Name is required";
    if (!email || !email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Invalid email";
    if (!message || !message.trim()) err.message = "Message is required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await sendMessage({ name: name.trim(), email: email.trim(), message: message.trim() }).unwrap();

      if (res.status === "Success") {
        setName("");
        setEmail("");
        setMessage("");
        setFormErrors({});
        chakraToast({
          title: "Success",
          description: res?.data?.message ?? "Message sent. Our team will get back to you shortly.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err?.data?.message ?? err?.data ?? err?.error ?? "Could not send message. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Box padding={{ base: "3rem 2rem", md: "3rem", xl: "3rem" }}>
        <Box>
          <Heading as="h3" size="md" textAlign="center">
            Contact
          </Heading>
          <Text className="secondary-light-font" fontSize="4xl" textAlign="center">
            Reach out to us
          </Text>
          <Flex>
            <Box height="0.2rem" width="8rem" margin="0.5rem auto" background={ThemeColors.primaryColor} />
          </Flex>
        </Box>

        <Box padding="2rem 0">
          <Flex>
            <Box margin="auto" width={{ base: "100%", md: "100%", xl: "60%" }}>
              <Box padding="1rem 0">
                <Text className="secondary-light-font" fontSize="lg" textAlign="center">
                  Leave a message and our dedicated team will get back to you shortly
                </Text>
              </Box>
              <Box padding="1rem" border={"1.7px solid " + ThemeColors.lightColor} borderRadius="md">
                <form onSubmit={handleSubmit}>
                  <Grid
                    gridTemplateColumns={{
                      base: "repeat(1, 1fr)",
                      md: "repeat(1, 1fr)",
                      xl: "repeat(2, 1fr)",
                    }}
                    gridGap="1rem"
                  >
                    <Box padding="0.5rem 0">
                      <FormControl isInvalid={!!formErrors.name}>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                          type="text"
                          placeholder="Your name"
                          name="name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
                          }}
                        />
                        <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box padding="0.5rem 0">
                      <FormControl isInvalid={!!formErrors.email} isRequired>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          name="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (formErrors.email) setFormErrors((p) => ({ ...p, email: "" }));
                          }}
                        />
                        <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Box padding="0.5rem 0">
                    <FormControl isInvalid={!!formErrors.message}>
                      <FormLabel htmlFor="message">Message</FormLabel>
                      <Textarea
                        name="message"
                        value={message}
                        placeholder="Type your message"
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (formErrors.message) setFormErrors((p) => ({ ...p, message: "" }));
                        }}
                        rows={4}
                      />
                      <FormErrorMessage>{formErrors.message}</FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box padding="1rem 0">
                    <Button
                      type="submit"
                      colorScheme="green"
                      isLoading={isSending}
                      isDisabled={isSending}
                      loadingText="Sending…"
                    >
                      Send message
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
