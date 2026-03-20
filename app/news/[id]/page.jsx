"use client";

import { useNewsArticleFetchMutation, useNewsArticlesFetchMutation } from "@slices/usersApiSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box, Container, Heading, Text, Badge, HStack, VStack, Icon,
  Divider, Skeleton, Flex, Button,
} from "@chakra-ui/react";
import { FiArrowLeft, FiClock, FiUser, FiCalendar, FiShare2 } from "react-icons/fi";
import { ThemeColors } from "@constants/constants";

const CATEGORY_COLORS = {
  Company: "green", Promotions: "orange", "Food & Recipes": "yellow",
  Agriculture: "teal", Technology: "blue", General: "gray",
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80";

export default function NewsArticlePage({ params }) {
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);
  const [fetchNewsArticle] = useNewsArticleFetchMutation();
  const [fetchAll] = useNewsArticlesFetchMutation();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchNewsArticle(params.id).unwrap();
        if (res.status === "Success") {
          setArticle(res.data);
          // load related
          try {
            const allRes = await fetchAll().unwrap();
            if (allRes.status === "Success") {
              setRelated(allRes.data.filter((a) => (a._id || a.slug) !== (res.data._id || params.id)).slice(0, 3));
            }
          } catch {}
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [params.id]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: article?.title, url: window.location.href });
    } else if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const heroImg = imgErr || !article?.imageUrl ? FALLBACK_IMG : article.imageUrl;

  if (loading) return (
    <Box minH="100vh" bg="#f8faf9">
      <Skeleton h={{ base: "240px", md: "400px" }} />
      <Container maxW="780px" py={10}>
        <Skeleton h="12px" w="20%" mb={4} />
        <Skeleton h="36px" mb={3} />
        <Skeleton h="36px" w="70%" mb={6} />
        {[1,2,3,4,5].map(i => <Skeleton key={i} h="14px" mb={3} w={i % 2 === 0 ? "85%" : "100%"} />)}
      </Container>
    </Box>
  );

  if (!article) return (
    <Box minH="100vh" bg="#f8faf9" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Text fontSize="5xl">📰</Text>
        <Heading size="md" color="gray.600">Article not found</Heading>
        <Button as={Link} href="/news" leftIcon={<FiArrowLeft />} colorScheme="green" size="sm">Back to News</Button>
      </VStack>
    </Box>
  );

  return (
    <Box minH="100vh" bg="#f8faf9">
      {/* Hero image */}
      <Box position="relative" h={{ base: "240px", md: "420px" }} overflow="hidden">
        <Box as="img" src={heroImg} alt={article.title} onError={() => setImgErr(true)}
          w="100%" h="100%" objectFit="cover" />
        <Box position="absolute" inset={0} bgGradient="linear(to-b, transparent 40%, rgba(0,0,0,0.7) 100%)" />
        <Box position="absolute" bottom={6} left={6}>
          <Badge colorScheme={CATEGORY_COLORS[article.category] || "gray"} borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">
            {article.category || "General"}
          </Badge>
        </Box>
      </Box>

      <Container maxW="780px" px={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
        {/* Back link */}
        <Box mb={6}>
          <Link href="/news">
            <HStack spacing={2} color={ThemeColors.primaryColor} fontSize="sm" fontWeight="600" cursor="pointer" display="inline-flex">
              <Icon as={FiArrowLeft} /><Text>All News</Text>
            </HStack>
          </Link>
        </Box>

        {/* Title */}
        <Heading as="h1" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="800" color="gray.900" lineHeight="1.2" mb={5}>
          {article.title}
        </Heading>

        {/* Meta */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={3} mb={6}>
          <HStack spacing={4} color="gray.500" fontSize="sm" flexWrap="wrap">
            <HStack spacing={1.5}><Icon as={FiUser} /><Text>{article.author || "YooKatale Team"}</Text></HStack>
            <HStack spacing={1.5}><Icon as={FiCalendar} /><Text>{moment(article.createdAt).format("DD MMM YYYY")}</Text></HStack>
            <HStack spacing={1.5}><Icon as={FiClock} /><Text>{article.readTime || 3} min read</Text></HStack>
          </HStack>
          <Button size="xs" leftIcon={<FiShare2 />} variant="outline" borderRadius="full" colorScheme="green" onClick={handleShare}>
            Share
          </Button>
        </Flex>

        {article.summary && (
          <Box bg="green.50" borderLeft="4px solid" borderColor={ThemeColors.primaryColor}
            borderRadius="lg" p={4} mb={8}>
            <Text fontSize="md" color="gray.700" fontStyle="italic" lineHeight="1.7">{article.summary}</Text>
          </Box>
        )}

        <Divider mb={8} />

        {/* Article body */}
        <Box
          className="article-body"
          fontSize={{ base: "16px", md: "17px" }}
          lineHeight="1.85"
          color="gray.800"
          sx={{
            "h2, h3": { fontWeight: "700", color: "gray.900", mt: "1.8em", mb: "0.5em" },
            "h2": { fontSize: "1.4em" },
            "h3": { fontSize: "1.2em", color: ThemeColors.primaryColor },
            "p": { mb: "1.2em" },
            "ul, ol": { pl: "1.5em", mb: "1.2em" },
            "li": { mb: "0.4em" },
            "a": { color: ThemeColors.primaryColor, textDecoration: "underline" },
            "strong": { color: "gray.900" },
          }}
          dangerouslySetInnerHTML={{ __html: article.article || "" }}
        />

        <Divider my={10} />

        {/* Related articles */}
        {related.length > 0 && (
          <Box>
            <Heading size="md" mb={6} color="gray.800">More Articles</Heading>
            <VStack spacing={4} align="stretch">
              {related.map((a, i) => (
                <Link key={a._id || i} href={`/news/${a.slug || a._id}`} style={{ textDecoration: "none" }}>
                  <Flex
                    gap={4} align="center" bg="white" borderRadius="xl" p={4}
                    border="1px solid" borderColor="gray.100"
                    _hover={{ borderColor: "green.200", transform: "translateX(4px)" }}
                    transition="all 0.2s"
                  >
                    <Box w="72px" h="72px" borderRadius="lg" overflow="hidden" flexShrink={0}>
                      <Box as="img" src={a.imageUrl || FALLBACK_IMG} alt={a.title} w="100%" h="100%" objectFit="cover" />
                    </Box>
                    <Box flex={1} minW={0}>
                      <Badge colorScheme={CATEGORY_COLORS[a.category] || "gray"} fontSize="9px" mb={1}>{a.category}</Badge>
                      <Text fontWeight="600" fontSize="sm" color="gray.800" noOfLines={2}>{a.title}</Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>{moment(a.createdAt).fromNow()}</Text>
                    </Box>
                    <Icon as={FiArrowLeft} transform="rotate(180deg)" color="gray.300" flexShrink={0} />
                  </Flex>
                </Link>
              ))}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
}
