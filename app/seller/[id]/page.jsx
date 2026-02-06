"use client";

import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DB_URL } from "@config/config";
import { AiFillStar, AiOutlinePhone } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { ThemeColors } from "@constants/constants";

export default function PublicSellerProfilePage() {
  const params = useParams();
  const id = params?.id;
  const [profile, setProfile] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const base = (DB_URL || "").replace(/\/api\/?$/, "") || "";

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([
      fetch(`${base}/api/seller/profile/${id}`, { credentials: "include" }).then((r) =>
        r.json()
      ),
      fetch(`${base}/api/seller/ratings/${id}`, { credentials: "include" }).then((r) =>
        r.json()
      ),
    ])
      .then(([profileRes, ratingRes]) => {
        if (cancelled) return;
        if (profileRes?.status === "Success" && profileRes.data) {
          setProfile(profileRes.data);
        } else {
          setError(profileRes?.message || "Seller not found");
        }
        if (ratingRes?.status === "Success" && ratingRes.data) {
          setRating(ratingRes.data);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, base]);

  if (loading) {
    return (
      <Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color={ThemeColors.primaryColor} />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box maxW="800px" mx="auto" px={4} py={8}>
        <Alert status="error">
          <AlertIcon />
          {error || "Seller not found"}
        </Alert>
      </Box>
    );
  }

  const lastSeen = profile.lastSeenAt
    ? (() => {
        const d = new Date(profile.lastSeenAt);
        const diffMs = Date.now() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 5) return "Online";
        if (diffMins < 60) return `Last seen ${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Last seen ${diffHours}h ago`;
        return `Last seen ${d.toLocaleDateString()}`;
      })()
    : null;

  return (
    <Box maxW="800px" mx="auto" px={4} py={8}>
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Flex align="center" gap={4}>
              <Avatar
                size="xl"
                name={profile.displayName || "Seller"}
                src={profile.avatar}
              />
              <Box flex="1">
                <Heading size="lg" mb={1}>
                  {profile.displayName || "Seller"}
                </Heading>
                {lastSeen && (
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    {lastSeen}
                  </Text>
                )}
                {rating && (rating.averageRating > 0 || rating.ratingCount > 0) && (
                  <HStack spacing={1}>
                    <AiFillStar color="gold" size={20} />
                    <Text fontWeight="600">
                      {Number(rating.averageRating).toFixed(1)}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      ({rating.ratingCount} review{rating.ratingCount !== 1 ? "s" : ""})
                    </Text>
                  </HStack>
                )}
              </Box>
            </Flex>

            {profile.bio && (
              <Box>
                <Text fontWeight="600" mb={2}>
                  About
                </Text>
                <Text color="gray.600">{profile.bio}</Text>
              </Box>
            )}

            <HStack spacing={4} flexWrap="wrap">
              {profile.phone && (
                <Button
                  as="a"
                  href={`tel:${profile.phone}`}
                  leftIcon={<AiOutlinePhone />}
                  size="sm"
                  colorScheme="green"
                >
                  Call
                </Button>
              )}
              {profile.whatsapp && (
                <Button
                  as="a"
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                  leftIcon={<BsWhatsapp />}
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                >
                  WhatsApp
                </Button>
              )}
            </HStack>

            {profile.followersCount !== undefined && (
              <Box>
                <Text fontWeight="600" mb={1}>
                  Followers
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={ThemeColors.primaryColor}>
                  {profile.followersCount}
                </Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
