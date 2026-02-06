"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  Badge,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DisplayImages, ThemeColors } from "@constants/constants";
import { FormatCurr } from "@utils/utils";
import { DB_URL } from "@config/config";
import { AiOutlinePhone, AiOutlineUser, AiFillStar } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";

export default function ListingDetailPage({ params }) {
  const [listing, setListing] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerRating, setSellerRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const base = (DB_URL || "").replace(/\/api\/?$/, "") || "";

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${base}/api/listings/public/${id}`, { credentials: "include" });
        const json = await res.json();
        if (cancelled) return;
        if (json?.status !== "Success" || !json.data) {
          toast({ title: "Listing not found", status: "error", duration: 3000 });
          router.push("/marketplace");
          return;
        }
        setListing(json.data);
        const sellerId = json.data.sellerId?._id || json.data.sellerId;
        if (sellerId) {
          const [prRes, ratingRes] = await Promise.all([
            fetch(`${base}/api/seller/profile/${sellerId}`, { credentials: "include" }),
            fetch(`${base}/api/seller/ratings/${sellerId}`, { credentials: "include" }),
          ]);
          const prJson = await prRes.json();
          const ratingJson = await ratingRes.json();
          if (!cancelled && prJson?.status === "Success" && prJson.data) setSellerProfile(prJson.data);
          if (!cancelled && ratingJson?.status === "Success" && ratingJson.data) setSellerRating(ratingJson.data);
        }
      } catch (e) {
        if (!cancelled) toast({ title: "Failed to load listing", status: "error", duration: 3000 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params?.id, base]);

  if (loading) {
    return (
      <Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.500">Loading…</Text>
      </Box>
    );
  }
  if (!listing) return null;

  const sellerName =
    sellerProfile?.displayName ||
    (listing.sellerId
      ? [listing.sellerId.firstname, listing.sellerId.lastname].filter(Boolean).join(" ") || listing.sellerId.email
      : "Seller");
  const phone = sellerProfile?.phone || "";
  const whatsapp = sellerProfile?.whatsapp || phone || "";
  const lastSeen = sellerProfile?.lastSeenAt
    ? (() => {
        const d = new Date(sellerProfile.lastSeenAt);
        const diffMs = Date.now() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 5) return "Online";
        if (diffMins < 60) return `Last seen ${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Last seen ${diffHours}h ago`;
        return `Last seen ${d.toLocaleDateString()}`;
      })()
    : null;
  const sellerId = listing.sellerId?._id || listing.sellerId;

  return (
    <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={8}>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex={{ base: "none", md: "1" }}>
          <Box position="relative" borderRadius="lg" overflow="hidden" bg="gray.100" aspectRatio={4 / 3}>
            {listing.images?.[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" color="gray.400">
                No image
              </Box>
            )}
          </Box>
          {listing.images?.length > 1 && (
            <Flex gap={2} mt={2} flexWrap="wrap">
              {listing.images.slice(1, 5).map((src, i) => (
                <Box key={i} w="80px" h="80px" borderRadius="md" overflow="hidden" bg="gray.100">
                  <Box as="img" src={src} alt="" w="100%" h="100%" objectFit="cover" />
                </Box>
              ))}
            </Flex>
          )}
        </Box>
        <Box flex={{ base: "none", md: "1" }}>
          <Heading size="lg" color="gray.800" mb={2}>
            {listing.title}
          </Heading>
          <Flex align="center" gap={2} mb={3}>
            <Text fontSize="2xl" fontWeight="700" color={ThemeColors.primaryColor}>
              {FormatCurr(listing.price)}
            </Text>
            {listing.negotiable && (
              <Badge colorScheme="green" fontSize="sm">
                Negotiable
              </Badge>
            )}
          </Flex>
          {listing.description && (
            <Text color="gray.600" mb={6} whiteSpace="pre-wrap">
              {listing.description}
            </Text>
          )}

          {/* Seller block */}
          <Box
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
            bg="gray.50"
          >
            <Text fontWeight="600" mb={3} color="gray.700">
              Seller
            </Text>
            {(sellerRating?.averageRating > 0 || sellerRating?.ratingCount > 0) && (
              <Flex align="center" gap={1} mb={2}>
                <AiFillStar color="gold" size={18} />
                <Text fontWeight="600" color="gray.800">
                  {Number(sellerRating.averageRating).toFixed(1)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  ({sellerRating.ratingCount} review{sellerRating.ratingCount !== 1 ? "s" : ""})
                </Text>
              </Flex>
            )}
            <Flex align="center" gap={2} mb={2}>
              <AiOutlineUser color={ThemeColors.primaryColor} size={20} />
              <Text fontWeight="600" color="gray.800">
                {sellerName}
              </Text>
              {sellerId && (
                <ChakraLink
                  as={Link}
                  href={`/seller/${sellerId}`}
                  fontSize="sm"
                  color="green.600"
                >
                  View profile
                </ChakraLink>
              )}
            </Flex>
            {lastSeen && (
              <Text fontSize="sm" color="gray.500" mb={2}>
                {lastSeen}
              </Text>
            )}
            <Flex gap={2} flexWrap="wrap">
              {phone && (
                <Button
                  as="a"
                  href={`tel:${phone}`}
                  size="sm"
                  leftIcon={<AiOutlinePhone />}
                  colorScheme="green"
                  variant="outline"
                >
                  Call
                </Button>
              )}
              {whatsapp && (
                <Button
                  as="a"
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  leftIcon={<BsWhatsapp />}
                  colorScheme="green"
                >
                  WhatsApp
                </Button>
              )}
            </Flex>
          </Box>

          <Box mt={6}>
            <Button as={Link} href="/marketplace" variant="outline" colorScheme="green" size="md">
              Back to Marketplace
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
