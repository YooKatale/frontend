"use client";

import { Button, HStack, Text, Spinner, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useFollowSellerMutation,
  useUnfollowSellerMutation,
  useGetFollowersCountQuery,
  useIsFollowingQuery,
} from "@slices/followApiSlice";
import { ThemeColors } from "@constants/constants";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";

export default function FollowButton({ sellerId, size = "md" }) {
  const { userInfo } = useSelector((state) => state.auth);
  const toast = useToast();
  const [isFollowingState, setIsFollowingState] = useState(false);

  const { data: followersData, refetch: refetchFollowers } = useGetFollowersCountQuery(sellerId, {
    skip: !sellerId,
  });
  const { data: followingData, refetch: refetchFollowing } = useIsFollowingQuery(sellerId, {
    skip: !sellerId || !userInfo,
  });

  const [followSeller, { isLoading: isFollowing }] = useFollowSellerMutation();
  const [unfollowSeller, { isLoading: isUnfollowing }] = useUnfollowSellerMutation();

  useEffect(() => {
    if (followingData?.data !== undefined) {
      setIsFollowingState(followingData.data);
    }
  }, [followingData]);

  const followersCount = followersData?.data?.count || followersData?.count || 0;
  const isFollowing = isFollowingState;
  const isLoading = isFollowing || isUnfollowing;

  const handleToggleFollow = async () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to follow sellers",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isFollowing) {
        await unfollowSeller(sellerId).unwrap();
        setIsFollowingState(false);
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this seller",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await followSeller(sellerId).unwrap();
        setIsFollowingState(true);
        toast({
          title: "Following",
          description: "You are now following this seller",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      refetchFollowers();
      refetchFollowing();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update follow status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!sellerId) return null;

  return (
    <HStack spacing={3}>
      <Button
        onClick={handleToggleFollow}
        isLoading={isLoading}
        loadingText={isFollowing ? "Unfollowing..." : "Following..."}
        leftIcon={isFollowing ? <RiUserUnfollowLine /> : <RiUserFollowLine />}
        bg={isFollowing ? "gray.200" : ThemeColors.primaryColor}
        color={isFollowing ? "gray.700" : "white"}
        _hover={{
          bg: isFollowing ? "gray.300" : ThemeColors.secondaryColor,
        }}
        size={size}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Text fontSize="sm" color="gray.600">
        {followersCount} {followersCount === 1 ? "follower" : "followers"}
      </Text>
    </HStack>
  );
}
