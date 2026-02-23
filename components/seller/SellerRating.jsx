"use client";

import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Divider,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  Avatar,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreateSellerRatingMutation,
  useGetSellerRatingsQuery,
  useGetSellerRatingStatsQuery,
} from "@slices/ratingsApiSlice";
import { ThemeColors } from "@constants/constants";
import { RiStarFill, RiStarLine } from "react-icons/ri";

export default function SellerRating({ sellerId }) {
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats } = useGetSellerRatingStatsQuery(sellerId, {
    skip: !sellerId,
  });
  const { data: ratingsData, isLoading, refetch } = useGetSellerRatingsQuery(
    { sellerId, page, limit: 10 },
    { skip: !sellerId }
  );
  const [createRating, { isLoading: isSubmitting }] = useCreateSellerRatingMutation();

  const averageRating = stats?.averageRating || 0;
  const ratingCount = stats?.ratingCount || 0;
  const ratings = ratingsData?.data?.list || [];
  const totalRatings = ratingsData?.data?.total || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to rate sellers",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createRating({
        sellerId,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setRating(0);
      setComment("");
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to submit rating",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderStars = (value, interactive = false) => {
    return (
      <HStack spacing={1}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (interactive ? hoverRating || rating : value);
          return (
            <Box
              key={star}
              as="button"
              type={interactive ? "button" : undefined}
              onClick={interactive ? () => setRating(star) : undefined}
              onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
              onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
              cursor={interactive ? "pointer" : "default"}
              color={isFilled ? ThemeColors.primaryColor : "gray.300"}
              fontSize="xl"
            >
              {isFilled ? <RiStarFill /> : <RiStarLine />}
            </Box>
          );
        })}
      </HStack>
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Rating Stats */}
      <Card bg="white">
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" color={ThemeColors.primaryColor}>
                {averageRating.toFixed(1)}
              </Text>
              {renderStars(Math.round(averageRating))}
              <Text fontSize="sm" color="gray.500" mt={2}>
                Based on {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb={2}>
                Rating Distribution
              </Text>
              {[5, 4, 3, 2, 1].map((starValue) => {
                const count = 0; // Would need backend to provide distribution
                const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                return (
                  <HStack key={starValue} mb={1}>
                    <Text fontSize="sm" minW="60px">
                      {starValue} star
                    </Text>
                    <Box flex="1" bg="gray.200" h="8px" borderRadius="full" overflow="hidden">
                      <Box
                        bg={ThemeColors.primaryColor}
                        h="100%"
                        w={`${percentage}%`}
                        transition="width 0.3s"
                      />
                    </Box>
                    <Text fontSize="sm" minW="30px" textAlign="right">
                      {count}
                    </Text>
                  </HStack>
                );
              })}
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Rating Form */}
      {userInfo && (
        <Card bg="white">
          <CardBody>
            <Heading size="sm" mb={4}>
              Write a Review
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Your Rating</FormLabel>
                  {renderStars(rating, true)}
                </FormControl>
                <FormControl>
                  <FormLabel>Your Review (Optional)</FormLabel>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                  />
                </FormControl>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  bg={ThemeColors.primaryColor}
                  color="white"
                  _hover={{ bg: ThemeColors.secondaryColor }}
                >
                  Submit Review
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      )}

      <Divider />

      {/* Ratings List */}
      <Box>
        <Heading size="md" mb={4}>
          Reviews ({totalRatings})
        </Heading>
        {isLoading ? (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" color={ThemeColors.primaryColor} />
          </Box>
        ) : ratings.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            No reviews yet. Be the first to review!
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {ratings.map((review) => (
              <Card key={review._id} bg="white">
                <CardBody>
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Avatar
                        size="sm"
                        name={
                          review.raterId?.firstname && review.raterId?.lastname
                            ? `${review.raterId.firstname} ${review.raterId.lastname}`
                            : review.raterId?.email || "Anonymous"
                        }
                      />
                      <Box>
                        <Text fontWeight="semibold" fontSize="sm">
                          {review.raterId?.firstname && review.raterId?.lastname
                            ? `${review.raterId.firstname} ${review.raterId.lastname}`
                            : review.raterId?.email || "Anonymous"}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>
                    </HStack>
                    {renderStars(review.rating)}
                  </HStack>
                  {review.comment && (
                    <Text mt={2} color="gray.700">
                      {review.comment}
                    </Text>
                  )}
                </CardBody>
              </Card>
            ))}
            {totalRatings > ratings.length && (
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                isDisabled={ratings.length >= totalRatings}
              >
                Load More Reviews
              </Button>
            )}
          </VStack>
        )}
      </Box>
    </VStack>
  );
}
