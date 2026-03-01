"use client";

import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { MapPin, Leaf, Calendar, Smartphone } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import LocationSearchPicker from "./LocationSearchPicker";

const PLAY_STORE_APP_URL = "https://play.google.com/store/apps/details?id=com.yookataleapp.app&pcampaignid=web_share";

// Yookatale real focus: food, fresh produce, meal calendar, apps (professional icons only)
const SLIDES = [
  {
    tagIcon: Leaf,
    tagLabel: "Shop Fresh, Live Better",
    title: "Fresh Produce from Kampala to Your Table",
    titleEm: "Fresh",
    body: "Uganda's favourite fresh produce & groceries. Order from local farms and markets — same-day delivery in Kampala.",
    ctaPrimary: "Shop Groceries",
    ctaPrimaryHref: "/products",
    ctaSecondary: "Meal Calendar",
    ctaSecondaryHref: "/subscription",
    bg: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)",
    overlay: "linear-gradient(105deg, rgba(0,0,0,.6) 30%, rgba(0,0,0,.1) 100%)",
  },
  {
    tagIcon: Calendar,
    tagLabel: "Plan Your Week",
    title: "Meal Calendar & Subscription Boxes",
    titleEm: "Meal Calendar",
    body: "Get weekly fresh produce delivered. Choose your meal plan and we'll bring the best of the market to your door.",
    ctaPrimary: "View Plans",
    ctaPrimaryHref: "/subscription",
    ctaSecondary: "How It Works",
    ctaSecondaryHref: "/subscription",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    overlay: "linear-gradient(105deg, rgba(0,0,0,.7) 30%, rgba(0,0,0,.1) 100%)",
  },
  {
    tagIcon: Smartphone,
    tagLabel: "Yookatale Apps",
    title: "Order on the Go — Download Our App",
    titleEm: "Our App",
    body: "Shop fresh produce, track orders and get exclusive app-only deals. Available on Android and iOS.",
    ctaPrimary: "Get the App",
    ctaPrimaryHref: PLAY_STORE_APP_URL,
    ctaSecondary: "Browse Web",
    ctaSecondaryHref: "/products",
    bg: "linear-gradient(135deg, #185f2d 0%, #2d6a4f 100%)",
    overlay: "linear-gradient(105deg, rgba(0,0,0,.65) 30%, rgba(0,0,0,.1) 100%)",
  },
];

const PROMO_CARDS_LEFT = [
  { label: "Best Sellers", title: "Top Groceries This Week", href: "/search?q=groceries", bg: "linear-gradient(135deg, #1b4332, #40916c)" },
  { label: "Meal Calendar", title: "Weekly Fresh Box Plans", href: "/subscription", bg: "linear-gradient(135deg, #0f3460, #1565c0)" },
  { label: "Fresh Daily", title: "Vegetables & Fruits", href: "/search?q=vegetables", bg: "linear-gradient(135deg, #2d6a4f, #52b788)" },
];

const PROMO_CARDS_RIGHT = [
  { label: "Occasion", title: "Mother's Day — Special Offers", href: "/search?q=groceries", bg: "linear-gradient(135deg, #880e4f, #e91e63)" },
  { label: "Free Delivery", title: "Orders over UGX 50,000", href: "/products", bg: "linear-gradient(135deg, #212529, #495057)" },
  { label: "Download", title: "Yookatale App — Get Notified", href: PLAY_STORE_APP_URL, bg: "linear-gradient(135deg, #185f2d, #40916c)" },
];

function PromoCard({ label, title, href, bg }) {
  const isExternal = href.startsWith("http");
  const content = (
    <Box
      borderRadius="var(--radius)"
      overflow="hidden"
      cursor="pointer"
      transition="transform 0.22s ease, box-shadow 0.22s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "var(--shadow)" }}
    >
      <Box
        p={5}
        minH="140px"
        bg={bg}
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box position="absolute" inset={0} bg="linear-gradient(135deg, rgba(0,0,0,.65) 0%, rgba(0,0,0,.2) 100%)" />
        <Box position="relative" zIndex={1} color="white">
          <Text fontSize="10px" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" opacity={0.85}>
            {label}
          </Text>
          <Text fontFamily="var(--font-syne), Syne, sans-serif" fontSize="16px" fontWeight="800" lineHeight="1.2" mt={1} mb={2}>
            {title}
          </Text>
          <Text fontSize="12px" fontWeight="600" color="var(--gold)" display="flex" alignItems="center" gap={1}>
            {isExternal ? "Get the App →" : "Shop Now →"}
          </Text>
        </Box>
      </Box>
    </Box>
  );
  return isExternal ? (
    <Box as="a" href={href} target="_blank" rel="noopener noreferrer" display="block">
      {content}
    </Box>
  ) : (
    <Link href={href}>{content}</Link>
  );
}

const Hero = () => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("yookatale_delivery_location");
    if (saved) {
      try {
        setDeliveryLocation(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const goTo = useCallback((index) => {
    setCurrentSlide((index + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(currentSlide + 1), 5000);
    return () => clearInterval(t);
  }, [currentSlide, goTo]);

  const handleLocationSelected = (location) => {
    localStorage.setItem("yookatale_delivery_location", JSON.stringify(location));
    setDeliveryLocation(location);
    setShowLocationPicker(false);
  };

  return (
    <>
      <Box as="section" py={{ base: 3, md: 5 }} bg="var(--surface)" px={{ base: 4, md: 6 }}>
        <Box maxW="1280px" mx="auto">
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={4}
            align="stretch"
            gridTemplateColumns={{ lg: "220px 1fr 220px" }}
          >
            {/* Left promo column - desktop only */}
            <Box display={{ base: "none", lg: "flex" }} flexDir="column" gap={3} flex="0 0 220px">
              {PROMO_CARDS_LEFT.map((card) => (
                <PromoCard key={card.title} {...card} />
              ))}
            </Box>

            {/* Center slider */}
            <Box flex="1" position="relative" borderRadius="var(--radius-lg)" overflow="hidden" minH={{ base: "320px", sm: "380px", md: "420px" }}>
              <Flex
                transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                transform={`translateX(-${currentSlide * 100}%)`}
                width="100%"
              >
                {SLIDES.map((slide, i) => (
                  <Box
                    key={i}
                    flex="0 0 100%"
                    minH={{ base: "320px", sm: "380px", md: "420px" }}
                    display="flex"
                    alignItems="center"
        position="relative"
        overflow="hidden"
      >
                    <Box position="absolute" inset={0} bg={slide.bg} />
                    <Box position="absolute" inset={0} bg={slide.overlay} />
                    <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={10} maxW="500px">
                      {/* Location badge - only on first slide */}
                      {i === 0 && (
                        <Box mb={4}>
          <Box
            as="button"
            onClick={() => setShowLocationPicker(true)}
            display="flex"
            alignItems="center"
            gap={2}
            px={4}
            py={2.5}
            bg="white"
            borderRadius="full"
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            _hover={{
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            }}
            transition="all 0.2s"
          >
            <MapPin size={18} color="#185F2D" />
                            <Text fontSize="13px" fontWeight="600" color="gray.800" noOfLines={1} maxW="200px">
                              {deliveryLocation?.address || "Select location"}
            </Text>
            <Text fontSize="20px" color="gray.400">›</Text>
          </Box>
        </Box>
                      )}
                      <Flex
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        gap={2}
                        bg="var(--gold)"
                        color="white"
                        px={3}
                        py={1.5}
                        borderRadius="4px"
                        fontSize="11px"
                        fontWeight="700"
                        textTransform="uppercase"
                        letterSpacing="0.06em"
                        mb={3}
                      >
                        {(() => { const TagIcon = slide.tagIcon; return <TagIcon size={14} strokeWidth={2.5} />; })()}
                        {slide.tagLabel}
                      </Flex>
                      <Text
                        as="h1"
                        fontFamily="var(--font-syne), Syne, sans-serif"
                        fontSize={{ base: "24px", sm: "28px", md: "clamp(26px, 3.5vw, 42px)" }}
                        fontWeight="800"
                        lineHeight="1.1"
                        color="white"
                        mb={3}
                      >
                        {slide.title.split(slide.titleEm)[0]}
                        <Text as="span" color="var(--gold)">{slide.titleEm}</Text>
                        {slide.title.split(slide.titleEm)[1] || ""}
                      </Text>
                      <Text fontSize="14px" color="rgba(255,255,255,0.85)" mb={6} lineHeight="1.6">
                        {slide.body}
                      </Text>
                      <Flex gap={3} flexWrap="wrap">
                        {slide.ctaPrimaryHref.startsWith("http") ? (
                          <Box
                            as="a"
                            href={slide.ctaPrimaryHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            display="inline-flex"
                            alignItems="center"
                            gap={2}
                            px={6}
                            py={3}
                            borderRadius="var(--radius-sm)"
                            bg="var(--brand)"
                            color="white"
                            fontFamily="var(--font-syne), Syne, sans-serif"
                            fontWeight="700"
                            fontSize="14px"
                            transition="all 0.22s"
                            _hover={{ bg: "var(--brand-dk)", transform: "translateY(-1px)", boxShadow: "0 4px 16px rgba(24,95,45,0.35)" }}
                          >
                            {slide.ctaPrimary}
                          </Box>
                        ) : (
                          <Link href={slide.ctaPrimaryHref}>
                            <Box
                              as="span"
                              display="inline-flex"
                              alignItems="center"
                              gap={2}
                              px={6}
                              py={3}
                              borderRadius="var(--radius-sm)"
                              bg="var(--brand)"
                              color="white"
                              fontFamily="var(--font-syne), Syne, sans-serif"
                              fontWeight="700"
                              fontSize="14px"
                              transition="all 0.22s"
                              _hover={{ bg: "var(--brand-dk)", transform: "translateY(-1px)", boxShadow: "0 4px 16px rgba(24,95,45,0.35)" }}
                            >
                              {slide.ctaPrimary}
                            </Box>
                          </Link>
                        )}
                        {slide.ctaSecondaryHref.startsWith("http") ? (
                          <Box
                            as="a"
                            href={slide.ctaSecondaryHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            display="inline-flex"
                            alignItems="center"
                            gap={2}
                            px={6}
                            py={3}
                            borderRadius="var(--radius-sm)"
                            bg="white"
                            color="var(--brand)"
                            fontFamily="var(--font-syne), Syne, sans-serif"
                            fontWeight="700"
                            fontSize="14px"
                            transition="all 0.22s"
                            _hover={{ bg: "var(--brand-lt)" }}
                          >
                            {slide.ctaSecondary}
                          </Box>
                        ) : (
                          <Link href={slide.ctaSecondaryHref}>
                            <Box
                              as="span"
                              display="inline-flex"
                              alignItems="center"
                              gap={2}
                              px={6}
                              py={3}
                              borderRadius="var(--radius-sm)"
                              bg="white"
                              color="var(--brand)"
                              fontFamily="var(--font-syne), Syne, sans-serif"
                              fontWeight="700"
                              fontSize="14px"
                              transition="all 0.22s"
                              _hover={{ bg: "var(--brand-lt)" }}
                            >
                              {slide.ctaSecondary}
                            </Box>
                          </Link>
                        )}
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </Flex>

              {/* Slider arrows */}
              <IconButton
                aria-label="Previous slide"
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                zIndex={10}
                size="md"
                w="40px"
                h="40px"
                borderRadius="full"
                bg="rgba(255,255,255,0.9)"
                boxShadow="var(--shadow-sm)"
                _hover={{ bg: "white", boxShadow: "var(--shadow)" }}
                onClick={() => goTo(currentSlide - 1)}
                icon={<Box as="span" fontSize="18px">‹</Box>}
              />
              <IconButton
                aria-label="Next slide"
                position="absolute"
                right={3}
                top="50%"
                transform="translateY(-50%)"
                zIndex={10}
                size="md"
                w="40px"
                h="40px"
                borderRadius="full"
                bg="rgba(255,255,255,0.9)"
                boxShadow="var(--shadow-sm)"
                _hover={{ bg: "white", boxShadow: "var(--shadow)" }}
                onClick={() => goTo(currentSlide + 1)}
                icon={<Box as="span" fontSize="18px">›</Box>}
              />

              {/* Dots */}
              <Flex position="absolute" bottom={4} left="50%" transform="translateX(-50%)" gap={2} zIndex={10}>
                {SLIDES.map((_, i) => (
                  <Box
                    key={i}
                    as="button"
                    aria-label={`Slide ${i + 1}`}
                    w={i === currentSlide ? 6 : 2}
                    h={2}
                    borderRadius="full"
                    bg={i === currentSlide ? "white" : "rgba(255,255,255,0.5)"}
                    transition="all 0.22s"
                    onClick={() => goTo(i)}
                  />
                ))}
              </Flex>
            </Box>

            {/* Right promo column - desktop only */}
            <Box display={{ base: "none", lg: "flex" }} flexDir="column" gap={3} flex="0 0 220px">
              {PROMO_CARDS_RIGHT.map((card) => (
                <PromoCard key={card.title} {...card} />
              ))}
            </Box>
          </Flex>

          {/* Mobile: horizontal promo strip below slider */}
          <Flex
            display={{ base: "flex", lg: "none" }}
            gap={3}
            overflowX="auto"
            py={4}
            px={1}
            sx={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
          >
            {[...PROMO_CARDS_LEFT, ...PROMO_CARDS_RIGHT].slice(0, 3).map((card) => (
              <Box key={card.title} flex="0 0 200px">
                <PromoCard {...card} />
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>

      {showLocationPicker && (
        <LocationSearchPicker
          onLocationSelected={handleLocationSelected}
          onClose={() => setShowLocationPicker(false)}
          initialAddress={deliveryLocation?.address}
          required={false}
        />
      )}
    </>
  );
};

export default Hero;
