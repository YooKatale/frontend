"use client";

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Heading,
  useToast,
  Divider,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useProductCommentsGetMutation,
  useCommentCreateMutation,
  useRatingCreateMutation,
} from "@slices/usersApiSlice";
import ButtonComponent from "./Button";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

const RatingAndComment = ({ productId, userInfo }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const chakraToast = useToast();
  const router = useRouter();

  const [getProductComments] = useProductCommentsGetMutation();
  const [createComment] = useCommentCreateMutation();

  // Fetch comments and ratings on component mount
  useEffect(() => {
    if (productId) {
      loadComments();
    }
  }, [productId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const res = await getProductComments(productId).unwrap();
      
      if (res.status === "Success" || res.status === "success") {
        setComments(res.data?.comments || res.comments || []);
        
        // Calculate average rating
        const ratings = res.data?.ratings || res.ratings || [];
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
          setAverageRating(sum / ratings.length);
          setTotalRatings(ratings.length);
        }
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      // Don't show error toast - comments might not exist yet
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      chakraToast({
        title: "Sign In Required",
        description: "Please sign in to rate and comment on products",
        status: "warning",
        duration: 5000,
        isClosable: false,
      });
      router.push("/signin");
      return;
    }

    if (rating === 0) {
      chakraToast({
        title: "Rating Required",
        description: "Please select a rating (1-5 stars)",
        status: "warning",
        duration: 5000,
        isClosable: false,
      });
      return;
    }

    if (!comment.trim()) {
      chakraToast({
        title: "Comment Required",
        description: "Please write a comment",
        status: "warning",
        duration: 5000,
        isClosable: false,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit rating and comment together
      const commentData = {
        productId: productId,
        userId: userInfo._id,
        rating: rating,
        comment: comment.trim(),
        userName: userInfo.firstname || userInfo.lastname || userInfo.email?.split("@")[0] || "Anonymous",
        userEmail: userInfo.email,
      };

      const res = await createComment(commentData).unwrap();

      if (res.status === "Success" || res.status === "success") {
        chakraToast({
          title: "Success",
          description: "Your rating and comment have been submitted!",
          status: "success",
          duration: 5000,
          isClosable: false,
        });

        // Reset form
        setRating(0);
        setComment("");
        setHoveredRating(0);

        // Reload comments to show the new one
        loadComments();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      chakraToast({
        title: "Error",
        description: error.data?.message || error.error || "Failed to submit comment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (ratingValue, interactive = false) => {
    return (
      <Flex gap={1}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (interactive ? hoveredRating || rating : ratingValue);
          return (
            <Box
              key={star}
              as="span"
              cursor={interactive ? "pointer" : "default"}
              onClick={interactive ? () => setRating(star) : undefined}
              onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
              onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
              color={filled ? "#FFD700" : "#E2E8F0"}
              transition="color 0.2s"
              display="inline-flex"
              alignItems="center"
            >
              <Star 
                size={20} 
                fill={filled ? "currentColor" : "none"} 
                stroke={filled ? "#FFD700" : "#E2E8F0"}
                style={{ transition: "all 0.2s" }}
              />
            </Box>
          );
        })}
      </Flex>
    );
  };

  return (
    <Box padding={{ base: "2rem 1rem", md: "2rem", xl: "2rem 2rem" }} marginTop="2rem">
      <Heading as="h2" size="lg" marginBottom="1.5rem" color={ThemeColors.darkColor}>
        Ratings & Reviews
      </Heading>

      {/* Average Rating Display */}
      {totalRatings > 0 && (
        <Box
          padding="1.5rem"
          borderRadius="lg"
          bg="gray.50"
          marginBottom="2rem"
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex alignItems="center" gap={4} flexWrap="wrap">
            <Box>
              <Text fontSize="3xl" fontWeight="bold" color={ThemeColors.darkColor}>
                {averageRating.toFixed(1)}
              </Text>
              <Text fontSize="sm" color="gray.600">
                out of 5
              </Text>
            </Box>
            <Box>
              {renderStars(Math.round(averageRating))}
              <Text fontSize="sm" color="gray.600" marginTop="0.5rem">
                Based on {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
              </Text>
            </Box>
          </Flex>
        </Box>
      )}

      {/* Comment Form */}
      {userInfo ? (
        <Box
          padding="1.5rem"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          marginBottom="2rem"
          bg="white"
        >
          <Heading as="h3" size="md" marginBottom="1rem" color={ThemeColors.darkColor}>
            Write a Review
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl marginBottom="1rem" isRequired>
              <FormLabel>Your Rating</FormLabel>
              <Box onMouseLeave={() => setHoveredRating(0)}>
                {renderStars(rating, true)}
              </Box>
              <Text fontSize="sm" color="gray.600" marginTop="0.5rem">
                {rating > 0 ? `You rated this product ${rating} ${rating === 1 ? "star" : "stars"}` : "Click to rate"}
              </Text>
            </FormControl>

            <FormControl marginBottom="1rem" isRequired>
              <FormLabel>Your Comment</FormLabel>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={4}
                resize="vertical"
                required
              />
            </FormControl>

            <ButtonComponent
              type="submit"
              text={isSubmitting ? "Submitting..." : "Submit Review"}
              size="regular"
              icon={isSubmitting && <Spinner size="sm" />}
            />
          </form>
        </Box>
      ) : (
        <Box
          padding="1.5rem"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          marginBottom="2rem"
          bg="gray.50"
          textAlign="center"
        >
          <Text marginBottom="1rem">
            Please{" "}
            <Text
              as="span"
              color={ThemeColors.darkColor}
              cursor="pointer"
              textDecoration="underline"
              onClick={() => router.push("/signin")}
            >
              sign in
            </Text>{" "}
            to leave a rating and review
          </Text>
        </Box>
      )}

      <Divider marginY="2rem" />

      {/* Comments List */}
      <Box>
        <Heading as="h3" size="md" marginBottom="1.5rem" color={ThemeColors.darkColor}>
          Customer Reviews ({comments.length})
        </Heading>

        {isLoading ? (
          <Flex justifyContent="center" padding="2rem">
            <Spinner size="lg" />
          </Flex>
        ) : comments.length === 0 ? (
          <Box
            padding="2rem"
            textAlign="center"
            borderRadius="lg"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text color="gray.600">No reviews yet. Be the first to review this product!</Text>
          </Box>
        ) : (
          <Box>
            {comments.map((item, index) => (
              <Box
                key={item._id || index}
                padding="1.5rem"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                marginBottom="1rem"
                bg="white"
              >
                <Flex alignItems="flex-start" gap={4}>
                  <Avatar
                    name={item.userName || item.user?.firstname || "User"}
                    size="md"
                    bg={ThemeColors.primaryColor}
                  />
                  <Box flex={1}>
                    <Flex alignItems="center" gap={2} marginBottom="0.5rem" flexWrap="wrap">
                      <Text fontWeight="bold" fontSize="md">
                        {item.userName || item.user?.firstname || item.user?.email?.split("@")[0] || "Anonymous"}
                      </Text>
                      {item.rating && (
                        <Flex alignItems="center" gap={1}>
                          {renderStars(item.rating)}
                          <Text fontSize="sm" color="gray.600" marginLeft="0.5rem">
                            {item.rating}/5
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                    <Text fontSize="xs" color="gray.600" marginBottom="0.75rem">
                      {formatDate(item.createdAt || item.date)}
                    </Text>
                    <Text fontSize="md" lineHeight="1.6" color="gray.700">
                      {item.comment || item.text}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RatingAndComment;

