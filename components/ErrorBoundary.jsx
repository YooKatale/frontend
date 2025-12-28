"use client";

import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging (not shown to users)
    console.error('Application Error:', error, errorInfo);
    
    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI - user-friendly, no technical details
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          p={4}
        >
          <VStack spacing={4} textAlign="center" maxW="500px">
            <Heading size="lg" color="gray.800">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.600">
              We're sorry for the inconvenience. Please try refreshing the page.
            </Text>
            <Button
              colorScheme="blue"
              onClick={this.handleReload}
              size="lg"
            >
              Refresh Page
            </Button>
            <Text fontSize="sm" color="gray.500" mt={4}>
              If the problem persists, please contact support.
            </Text>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

