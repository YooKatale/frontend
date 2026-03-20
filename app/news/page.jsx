"use client";

import { useNewsArticlesFetchMutation } from "@slices/usersApiSlice";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box, Container, Heading, Text, SimpleGrid, Badge, HStack,
  VStack, Input, InputGroup, InputLeftElement, Flex, Skeleton,
  Icon, Button,
} from "@chakra-ui/react";
import { FiSearch, FiClock, FiArrowRight, FiUser } from "react-icons/fi";
import { ThemeColors } from "@constants/constants";

const CATEGORIES = ["All", "Company", "Promotions", "Food & Recipes", "Agriculture", "Technology", "General"];

const CATEGORY_COLORS = {
  Company: "green",
  Promotions: "orange",
  "Food & Recipes": "yellow",
  Agriculture: "teal",
  Technology: "blue",
  General: "gray",
};

function ArticleImage({ src, alt, featured }) {
  const [err, setErr] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80";
  return (
    <Box
      as="img"
      src={err || !src ? fallback : src}
      alt={alt}
      onError={() => setErr(true)}
      w="100%" h="100%" objectFit="cover"
      transition="transform 0.4s ease"
      _groupHover={{ transform: "scale(1.04)" }}
    />
  );
}

function FeaturedCard({ article }) {
  return (
    <Link href={`/news/${article.slug || article._id}`} style={{ textDecoration: "none" }}>
      <Box
        role="group" position="relative" borderRadius="2xl" overflow="hidden"
        h={{ base: "300px", md: "420px" }} cursor="pointer"
        boxShadow="0 8px 40px rgba(0,0,0,0.15)"
      >
        <ArticleImage src={article.imageUrl} alt={article.title} featured />
        {/* Gradient overlay */}
        <Box
          position="absolute" inset={0}
          bgGradient="linear(to-t, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)"
        />
        <Box position="absolute" bottom={0} left={0} right={0} p={{ base: 5, md: 8 }}>
          <HStack spacing={2} mb={3} flexWrap="wrap">
            <Badge colorScheme={CATEGORY_COLORS[article.category] || "green"} borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">
              {article.category || "General"}
            </Badge>
            <Badge bg="rgba(255,255,255,0.15)" color="white" borderRadius="full" px={3} py={1} fontSize="xs">
              Featured
            </Badge>
          </HStack>
          <Heading as="h2" size={{ base: "md", md: "xl" }} color="white" lineHeight="1.25" mb={3} noOfLines={3}>
            {article.title}
          </Heading>
          <Text color="rgba(255,255,255,0.75)" fontSize="sm" noOfLines={2} mb={4}>{article.summary}</Text>
          <HStack spacing={4} color="rgba(255,255,255,0.6)" fontSize="xs">
            <HStack spacing={1}><Icon as={FiUser} /><Text>{article.author || "YooKatale Team"}</Text></HStack>
            <HStack spacing={1}><Icon as={FiClock} /><Text>{article.readTime || 3} min read</Text></HStack>
          </HStack>
        </Box>
      </Box>
    </Link>
  );
}

function ArticleCard({ article }) {
  return (
    <Link href={`/news/${article.slug || article._id}`} style={{ textDecoration: "none" }}>
      <Box
        role="group" borderRadius="xl" overflow="hidden" bg="white"
        border="1px solid" borderColor="gray.100"
        boxShadow="0 2px 12px rgba(0,0,0,0.06)"
        transition="all 0.25s ease"
        _hover={{ transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", borderColor: "green.200" }}
        h="100%" display="flex" flexDir="column"
      >
        <Box h="200px" overflow="hidden" position="relative">
          <ArticleImage src={article.imageUrl} alt={article.title} />
          <Box position="absolute" top={3} left={3}>
            <Badge colorScheme={CATEGORY_COLORS[article.category] || "gray"} borderRadius="full" px={2.5} py={0.5} fontSize="10px" fontWeight="700">
              {article.category || "General"}
            </Badge>
          </Box>
        </Box>
        <Flex direction="column" flex={1} p={5}>
          <Heading as="h3" fontSize="md" fontWeight="700" color="gray.800" lineHeight="1.4" mb={2} noOfLines={2}>
            {article.title}
          </Heading>
          <Text fontSize="sm" color="gray.500" noOfLines={3} mb={4} flex={1} lineHeight="1.6">
            {article.summary || article.title}
          </Text>
          <Flex justify="space-between" align="center" mt="auto">
            <HStack spacing={3} fontSize="xs" color="gray.400">
              <HStack spacing={1}><Icon as={FiUser} /><Text noOfLines={1}>{article.author || "YooKatale"}</Text></HStack>
              <HStack spacing={1}><Icon as={FiClock} /><Text>{article.readTime || 3} min</Text></HStack>
            </HStack>
            <HStack spacing={1} color={ThemeColors.primaryColor} fontSize="xs" fontWeight="600">
              <Text>Read</Text><Icon as={FiArrowRight} />
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <Box borderRadius="xl" overflow="hidden" bg="white" border="1px solid" borderColor="gray.100">
      <Skeleton h="200px" />
      <Box p={5}>
        <Skeleton h="12px" mb={2} w="30%" />
        <Skeleton h="18px" mb={2} />
        <Skeleton h="18px" mb={3} w="80%" />
        <Skeleton h="12px" w="60%" />
      </Box>
    </Box>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [fetchNewsArticles] = useNewsArticlesFetchMutation();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchNewsArticles().unwrap();
        if (res.status === "Success") setArticles(res.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = articles.filter((a) => {
    const matchCat = category === "All" || a.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.summary?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((a) => a.featured);
  const regular = filtered.filter((a) => !a.featured);

  return (
    <Box bg="#f8faf9" minH="100vh">
      {/* Hero Banner */}
      <Box
        bgGradient={`linear(135deg, #061806 0%, ${ThemeColors.primaryColor} 60%, #2d8c2d 100%)`}
        py={{ base: 12, md: 20 }} px={4}
      >
        <Container maxW="900px" textAlign="center">
          <Badge bg="rgba(255,255,255,0.15)" color="white" borderRadius="full" px={4} py={1.5} fontSize="xs" fontWeight="700" letterSpacing="wider" mb={4}>
            YOOKATALE NEWS
          </Badge>
          <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} color="white" fontWeight="800" lineHeight="1.15" mb={4}>
            Stories & Updates from Uganda&apos;s Food Marketplace
          </Heading>
          <Text color="rgba(255,255,255,0.75)" fontSize={{ base: "md", md: "lg" }} maxW="560px" mx="auto" mb={8} lineHeight="1.7">
            Company news, food recipes, promotions, market insights and more — all in one place.
          </Text>
          {/* Search bar */}
          <Box maxW="460px" mx="auto">
            <InputGroup size="lg" bg="white" borderRadius="xl" boxShadow="0 4px 24px rgba(0,0,0,0.15)">
              <InputLeftElement pl={4} pointerEvents="none" h="52px">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                h="52px" pl="3rem" pr={4} fontSize="sm" border="none"
                placeholder="Search articles..."
                borderRadius="xl" bg="transparent"
                value={search} onChange={(e) => setSearch(e.target.value)}
                _focus={{ boxShadow: "none" }}
              />
            </InputGroup>
          </Box>
        </Container>
      </Box>

      <Container maxW="1200px" px={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
        {/* Category filters */}
        <Box mb={8} overflowX="auto" pb={2}>
          <HStack spacing={2} minW="max-content">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                borderRadius="full"
                px={5}
                fontWeight="600"
                fontSize="13px"
                onClick={() => setCategory(cat)}
                bg={category === cat ? ThemeColors.primaryColor : "white"}
                color={category === cat ? "white" : "gray.600"}
                border="1px solid"
                borderColor={category === cat ? ThemeColors.primaryColor : "gray.200"}
                _hover={{ bg: category === cat ? ThemeColors.secondaryColor || "#1f793a" : "gray.50" }}
                transition="all 0.2s"
              >
                {cat}
              </Button>
            ))}
          </HStack>
        </Box>

        {loading ? (
          <>
            <Skeleton h="400px" borderRadius="2xl" mb={8} />
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </SimpleGrid>
          </>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={20}>
            <Text fontSize="5xl" mb={4}>📰</Text>
            <Heading size="md" color="gray.600" mb={2}>No articles found</Heading>
            <Text color="gray.400" fontSize="sm">Try a different search term or category</Text>
          </Box>
        ) : (
          <>
            {/* Featured articles */}
            {featured.length > 0 && (
              <Box mb={10}>
                {featured.length === 1 ? (
                  <FeaturedCard article={featured[0]} />
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                    {featured.map((a, i) => <FeaturedCard key={a._id || i} article={a} />)}
                  </SimpleGrid>
                )}
              </Box>
            )}

            {/* Regular articles grid */}
            {regular.length > 0 && (
              <>
                {featured.length > 0 && (
                  <Flex align="center" mb={6} gap={3}>
                    <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color="gray.400">Latest Articles</Text>
                    <Box flex={1} h="1px" bg="gray.200" />
                    <Text fontSize="xs" color="gray.400">{regular.length} article{regular.length !== 1 ? "s" : ""}</Text>
                  </Flex>
                )}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                  {regular.map((article, i) => (
                    <ArticleCard key={article._id || i} article={article} />
                  ))}
                </SimpleGrid>
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
