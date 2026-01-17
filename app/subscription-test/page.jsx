"use client";

/**
 * Subscription Email Test Page
 * 
 * Simple UI to test subscription emails and bulk subscription
 * Access at: /subscription-test
 */

import { useState } from "react";
import { Box, Button, Heading, Text, VStack, HStack, useToast, Spinner, Code, Divider } from "@chakra-ui/react";

export default function SubscriptionTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [bulkResults, setBulkResults] = useState(null);
  const toast = useToast();

  const handleTestEmails = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      const response = await fetch("/api/subscription/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTestResults(result);
        toast({
          title: "Test Emails Sent!",
          description: `Successfully sent ${result.successCount} out of ${result.total} test emails`,
          status: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send test emails",
          status: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSubscribe = async () => {
    setIsLoading(true);
    setBulkResults(null);

    try {
      // Read CSV file from public folder
      const response = await fetch("/email_list.csv");
      const csvText = await response.text();
      const lines = csvText.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
      const emails = lines
        .slice(1) // Skip header
        .map((line) => {
          const parts = line.split(",");
          return parts[0]?.trim().toLowerCase();
        })
        .filter((email) => email && email.includes("@"));

      if (emails.length === 0) {
        toast({
          title: "Error",
          description: "No valid emails found in CSV file",
          status: "error",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      // Send bulk subscription request
      const bulkResponse = await fetch("/api/subscription/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      });

      const result = await bulkResponse.json();

      if (bulkResponse.ok && result.success) {
        setBulkResults(result);
        toast({
          title: "Bulk Subscription Complete!",
          description: `Successfully processed ${result.successCount} out of ${result.total} emails`,
          status: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to process bulk subscription",
          status: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={10} px={4}>
      <Box maxW="800px" mx="auto" bg="white" p={8} borderRadius="lg" shadow="md">
        <Heading size="xl" mb={6} color="#185f2d">
          Yookatale Subscription Email System
        </Heading>

        <VStack spacing={6} align="stretch">
          {/* Test Emails Section */}
          <Box p={6} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
            <Heading size="md" mb={4} color="blue.700">
              Step 1: Test Emails (REQUIRED)
            </Heading>
            <Text mb={4} color="gray.700">
              Send test subscription emails to 3 test addresses first to verify the email template looks good.
            </Text>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Test emails: arihotimothy89@gmail.com, timothy.arihoz@protonmail.com, yookatale256@gmail.com
            </Text>
            <Button
              onClick={handleTestEmails}
              isLoading={isLoading}
              colorScheme="blue"
              size="lg"
              width="full"
            >
              {isLoading ? <Spinner size="sm" mr={2} /> : null}
              Send Test Emails
            </Button>

            {testResults && (
              <Box mt={4} p={4} bg="white" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Test Results:
                </Text>
                <Text>Total: {testResults.total}</Text>
                <Text color="green.600">Success: {testResults.successCount}</Text>
                <Text color="red.600">Errors: {testResults.errorCount}</Text>
                <Divider my={3} />
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Details:
                </Text>
                {testResults.results.map((result, idx) => (
                  <Text key={idx} fontSize="sm" color={result.status === "success" ? "green.600" : "red.600"}>
                    {result.status === "success" ? "✅" : "❌"} {result.email}: {result.message}
                  </Text>
                ))}
              </Box>
            )}
          </Box>

          {/* Bulk Subscription Section */}
          <Box p={6} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
            <Heading size="md" mb={4} color="green.700">
              Step 2: Bulk Subscribe All Emails
            </Heading>
            <Text mb={4} color="gray.700">
              After verifying test emails, subscribe all emails from email_list.csv and send them welcome emails.
            </Text>
            <Text fontSize="sm" color="gray.600" mb={4}>
              This will read email_list.csv and subscribe all emails to the database.
            </Text>
            <Button
              onClick={handleBulkSubscribe}
              isLoading={isLoading}
              colorScheme="green"
              size="lg"
              width="full"
            >
              {isLoading ? <Spinner size="sm" mr={2} /> : null}
              Subscribe All Emails from CSV
            </Button>

            {bulkResults && (
              <Box mt={4} p={4} bg="white" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Bulk Subscription Results:
                </Text>
                <Text>Total: {bulkResults.total}</Text>
                <Text color="green.600">Success: {bulkResults.successCount}</Text>
                <Text color="orange.600">Partial: {bulkResults.partialCount}</Text>
                <Text color="red.600">Errors: {bulkResults.errorCount}</Text>
                <Divider my={3} />
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Sample Results (first 10):
                </Text>
                {bulkResults.results.slice(0, 10).map((result, idx) => (
                  <Text key={idx} fontSize="sm" color={result.status === "success" ? "green.600" : result.status === "partial" ? "orange.600" : "red.600"}>
                    {result.status === "success" ? "✅" : result.status === "partial" ? "⚠️" : "❌"} {result.email}: {result.message}
                  </Text>
                ))}
                {bulkResults.results.length > 10 && (
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    ... and {bulkResults.results.length - 10} more
                  </Text>
                )}
              </Box>
            )}
          </Box>

          {/* Info Section */}
          <Box p={4} bg="gray.100" borderRadius="md">
            <Text fontSize="sm" color="gray.700">
              <strong>Note:</strong> Daily calendar emails are automatically scheduled via Vercel cron jobs.
              They will start sending once deployed to Vercel.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
