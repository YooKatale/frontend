"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  Flex,
  Icon,
  Badge,
  Divider,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiUser,
  FiPhone,
  FiFileText,
  FiUpload,
  FiSend,
  FiUsers,
  FiTrendingUp,
  FiHeart,
  FiShare2,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { ThemeColors } from "@constants/constants";
import { useGetCareersMutation } from "@slices/careersListSlice";
import { useJobApplicationMutation } from "@slices/applicationSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@lib/firebase";
import { v4 } from "uuid";

const MotionBox = motion(Box);

const SITE_URL = "https://www.yookatale.app";

const perks = [
  { icon: FiUsers, label: "Collaborative Team" },
  { icon: FiTrendingUp, label: "Growth Opportunities" },
  { icon: FiHeart, label: "Mission-Driven Work" },
];

function Careers() {
  const [careers, setCareers] = useState([]);
  const [fetchCareers] = useGetCareersMutation();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedJobId, setHighlightedJobId] = useState(null);

  const getCareers = async () => {
    try {
      const res = await fetchCareers().unwrap();
      if (res?.success === true) {
        setCareers(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCareers();
    // Read ?job=<id> from URL to auto-open a specific job when shared
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("job");
    if (jobId) setHighlightedJobId(jobId);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 16 } },
  };

  return (
    <Box as="section" bg="white" ref={sectionRef} overflow="hidden" position="relative">
      {/* Background blobs */}
      <Box
        position="absolute" top="0" right="0"
        w="350px" h="350px" borderRadius="full"
        bg="green.50" opacity="0.45" filter="blur(50px)"
        transform="translate(30%, -30%)" pointerEvents="none"
      />
      <Box
        position="absolute" bottom="10%" left="0"
        w="300px" h="300px" borderRadius="full"
        bg="green.50" opacity="0.35" filter="blur(45px)"
        transform="translateX(-30%)" pointerEvents="none"
      />

      <Container maxW="container.xl" py={{ base: "4rem", md: "6rem" }} position="relative" zIndex="1">
        <VStack spacing={{ base: 12, md: 16 }} align="stretch">

          {/* Hero */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {/* Banner image */}
            <MotionBox variants={itemVariants} mb={{ base: 8, md: 10 }}>
              <Box
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="0 8px 40px rgba(24,95,45,0.18)"
                position="relative"
                w="full"
                maxW="780px"
                mx="auto"
              >
                <Image
                  src="/assets/images/careers-banner.jpeg"
                  alt="YooKatale — We Are Hiring"
                  width={780}
                  height={780}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  priority
                />
              </Box>
            </MotionBox>

            {/* Heading block */}
            <MotionBox variants={itemVariants} textAlign="center">
              <Text
                fontSize="sm" fontWeight="semibold"
                color={ThemeColors.primaryColor}
                letterSpacing="wider" textTransform="uppercase" mb="3"
              >
                Open Positions
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold" lineHeight="shorter" mb="4"
                bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                bgClip="text"
              >
                Join Our Team
              </Heading>
              <Box
                height="4px" width="80px" margin="0 auto 1.25rem"
                background={`linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                borderRadius="full"
              />
              <Text
                fontSize={{ base: "md", md: "lg" }} color="gray.600"
                maxW="560px" mx="auto" lineHeight="tall"
              >
                We&apos;re looking for passionate people to help grow Uganda&apos;s leading food marketplace.
              </Text>
            </MotionBox>

            {/* Perks */}
            <MotionBox variants={itemVariants} mt="8">
              <Flex justify="center" gap={{ base: 4, md: 8 }} wrap="wrap">
                {perks.map((p, i) => (
                  <HStack key={i} spacing="2">
                    <Flex
                      w="32px" h="32px" align="center" justify="center"
                      borderRadius="lg" bg="green.50"
                    >
                      <Icon as={p.icon} color={ThemeColors.primaryColor} boxSize="15px" />
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">{p.label}</Text>
                  </HStack>
                ))}
              </Flex>
            </MotionBox>
          </MotionBox>

          {/* Job listings */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {careers && Array.isArray(careers) && careers.length > 0 ? (
              <VStack spacing="6" align="stretch">
                {careers.map((job, i) => (
                  <MotionBox key={job._id} variants={itemVariants} custom={i}>
                    <JobCard job={job} autoOpen={highlightedJobId === job._id} />
                  </MotionBox>
                ))}
              </VStack>
            ) : (
              <EmptyState />
            )}
          </MotionBox>

        </VStack>
      </Container>
    </Box>
  );
}

/* ─── Job Card ─── */
const JobCard = ({ job, autoOpen }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const sharePanelRef = useRef(null);

  const shareUrl = `${SITE_URL}/careers?job=${job?._id}`;
  const shareText = `${job?.title} at YooKatale | ${job?.location} | Salary: ${job?.salary} | Apply: ${shareUrl}`;

  // Auto-open details when job ID matches shared link
  useEffect(() => {
    if (autoOpen && job?._id) {
      setOpenDetails(true);
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [autoOpen, job?._id]);

  // Close share panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sharePanelRef.current && !sharePanelRef.current.contains(e.target)) {
        setShowSharePanel(false);
      }
    };
    if (showSharePanel) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSharePanel]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  };

  const toggleDetails = () => {
    setShowApplyForm(false);
    setOpenDetails((prev) => !prev);
  };

  const toggleApplyForm = () => {
    setOpenDetails(false);
    setShowApplyForm((prev) => !prev);
  };

  const handleShare = async () => {
    // Use native Web Share API on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job?.title} — YooKatale`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (_) {
        // User cancelled or API unavailable — fall through to panel
      }
    }
    setShowSharePanel((prev) => !prev);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      label: "WhatsApp",
      color: "#25D366",
      bg: "#e8fdf2",
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: "X / Twitter",
      color: "#000000",
      bg: "#f0f0f0",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${job?.title} at YooKatale | ${job?.location}`)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      color: "#1877F2",
      bg: "#e8f0fe",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      color: "#0A66C2",
      bg: "#e8f2fc",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <Box
      ref={cardRef}
      bg="white" borderRadius="2xl"
      border="1px solid" borderColor={autoOpen ? "green.200" : "gray.100"}
      boxShadow={autoOpen ? "0 8px 32px rgba(24,95,45,0.15)" : "0 4px 20px rgba(0,0,0,0.07)"}
      overflow="hidden"
      transition="box-shadow 0.2s, border-color 0.2s"
      _hover={{ boxShadow: "0 8px 32px rgba(24,95,45,0.12)", borderColor: "green.100" }}
    >
      {/* Card header */}
      <Box px={{ base: 5, md: 8 }} pt={{ base: 5, md: 7 }} pb="5">
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap="3">
          <Box flex="1">
            <Badge
              colorScheme="green" variant="subtle"
              fontSize="xs" borderRadius="full" px="3" py="1" mb="3"
            >
              {job?.category}
            </Badge>
            <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.800" mb="1">
              {job?.title}
            </Heading>
          </Box>
        </Flex>

        {/* Meta info grid */}
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap="3" mt="4"
        >
          <MetaItem icon={FiBriefcase} label="Reports to" value={job?.reportsTo} />
          <MetaItem icon={FiClock} label="Employment" value={job?.employment} />
          <MetaItem icon={FiFileText} label="Terms" value={job?.terms} />
          <MetaItem icon={FiDollarSign} label="Salary" value={job?.salary} />
          <MetaItem icon={FiCalendar} label="Closing Date" value={formatDate(job?.closingDate)} />
          <MetaItem icon={FiMapPin} label="Location" value={job?.location} />
        </Grid>
      </Box>

      <Divider borderColor="gray.100" />

      {/* Actions */}
      <Flex px={{ base: 5, md: 8 }} py="4" gap="3" wrap="wrap" align="center">
        <Button
          onClick={toggleDetails}
          size="sm"
          variant="outline"
          borderColor={ThemeColors.primaryColor}
          color={ThemeColors.primaryColor}
          borderRadius="lg"
          fontWeight="semibold"
          rightIcon={openDetails ? <FiChevronUp /> : <FiChevronDown />}
          _hover={{ bg: "green.50" }}
        >
          {openDetails ? "Hide Details" : "View Details"}
        </Button>
        <Button
          onClick={toggleApplyForm}
          size="sm"
          bg={ThemeColors.primaryColor}
          color="white"
          borderRadius="lg"
          fontWeight="semibold"
          leftIcon={<FiSend />}
          _hover={{ bg: ThemeColors.secondaryColor }}
        >
          Apply Now
        </Button>

        {/* Share button + panel */}
        <Box position="relative" ref={sharePanelRef}>
          <Button
            onClick={handleShare}
            size="sm"
            variant="ghost"
            borderRadius="lg"
            fontWeight="semibold"
            leftIcon={<FiShare2 />}
            color="gray.600"
            _hover={{ bg: "gray.100", color: "gray.800" }}
          >
            Share
          </Button>

          <AnimatePresence>
            {showSharePanel && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: 0,
                  zIndex: 50,
                  minWidth: "220px",
                }}
              >
                <Box
                  bg="white" borderRadius="xl"
                  border="1px solid" borderColor="gray.100"
                  boxShadow="0 8px 32px rgba(0,0,0,0.14)"
                  p="3"
                >
                  <Text fontSize="xs" fontWeight="semibold" color="gray.400" mb="2" px="1" textTransform="uppercase" letterSpacing="wide">
                    Share this job
                  </Text>
                  <VStack spacing="1" align="stretch">
                    {socialLinks.map((s) => (
                      <Box
                        key={s.label}
                        as="a"
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        alignItems="center"
                        gap="2"
                        px="3" py="2"
                        borderRadius="lg"
                        bg={s.bg}
                        _hover={{ opacity: 0.85 }}
                        cursor="pointer"
                        textDecoration="none"
                      >
                        {s.icon}
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">{s.label}</Text>
                      </Box>
                    ))}
                    {/* Copy link */}
                    <Box
                      display="flex" alignItems="center" gap="2"
                      px="3" py="2" borderRadius="lg"
                      bg={copied ? "green.50" : "gray.50"}
                      cursor="pointer"
                      onClick={handleCopy}
                      _hover={{ opacity: 0.85 }}
                    >
                      <Icon as={copied ? FiCheck : FiCopy} color={copied ? ThemeColors.primaryColor : "gray.500"} />
                      <Text fontSize="sm" fontWeight="medium" color={copied ? ThemeColors.primaryColor : "gray.700"}>
                        {copied ? "Link copied!" : "Copy link"}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Flex>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {openDetails && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Box px={{ base: 5, md: 8 }} pb="7" pt="2">
              <Divider borderColor="gray.100" mb="5" />
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="8">
                <Box>
                  <Text fontWeight="bold" fontSize="md" color="gray.800" mb="3">
                    Key Responsibilities
                  </Text>
                  <VStack align="start" spacing="2">
                    {job?.responsibilities?.map((item, i) => (
                      <HStack key={i} align="start" spacing="2">
                        <Box
                          w="6px" h="6px" borderRadius="full" mt="7px" flexShrink={0}
                          bg={ThemeColors.primaryColor}
                        />
                        <Text fontSize="sm" color="gray.600" lineHeight="tall">{item}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="md" color="gray.800" mb="3">
                    Key Requirements
                  </Text>
                  <VStack align="start" spacing="2">
                    {job?.requirements?.map((item, i) => (
                      <HStack key={i} align="start" spacing="2">
                        <Box
                          w="6px" h="6px" borderRadius="full" mt="7px" flexShrink={0}
                          bg={ThemeColors.secondaryColor}
                        />
                        <Text fontSize="sm" color="gray.600" lineHeight="tall">{item}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </Grid>

              {/* Apply note */}
              <Box
                mt="6" p="4" bg="green.50" borderRadius="xl"
                border="1px solid" borderColor="green.100"
              >
                <Text fontSize="sm" color="gray.700">
                  <Text as="span" fontWeight="semibold">To Apply:</Text> Send your resume to{" "}
                  <Text as="a" href="mailto:info@yookatale.app" color={ThemeColors.primaryColor} fontWeight="semibold">
                    info@yookatale.app
                  </Text>{" "}
                  or use the Apply Now button above. Specify the vacancy and location you wish to apply for.
                </Text>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply form */}
      <AnimatePresence initial={false}>
        {showApplyForm && (
          <motion.div
            key="apply-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Box px={{ base: 5, md: 8 }} pb="8" pt="2">
              <Divider borderColor="gray.100" mb="6" />
              <Text fontWeight="bold" fontSize="lg" color="gray.800" mb="5">
                Apply for {job?.title}
              </Text>
              <ApplyForm jobTitle={job?.title} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

/* ─── Meta item ─── */
const MetaItem = ({ icon, label, value }) => (
  <HStack
    spacing="2" px="3" py="2"
    bg="gray.50" borderRadius="lg"
    border="1px solid" borderColor="gray.100"
  >
    <Icon as={icon} color="gray.400" boxSize="14px" flexShrink={0} />
    <Box>
      <Text fontSize="10px" color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
        {label}
      </Text>
      <Text fontSize="sm" color="gray.700" fontWeight="medium" noOfLines={1}>
        {value || "—"}
      </Text>
    </Box>
  </HStack>
);

/* ─── Empty state ─── */
const EmptyState = () => (
  <Box
    textAlign="center" py="16" px="8"
    bg="gray.50" borderRadius="2xl"
    border="1px dashed" borderColor="gray.200"
  >
    <Flex
      w="64px" h="64px" align="center" justify="center"
      borderRadius="full" bg="green.50" mx="auto" mb="4"
    >
      <Icon as={FiBriefcase} boxSize="28px" color={ThemeColors.primaryColor} />
    </Flex>
    <Heading as="h3" fontSize="xl" color="gray.700" mb="2">
      No open positions right now
    </Heading>
    <Text color="gray.500" fontSize="md" maxW="400px" mx="auto">
      We&apos;re not actively hiring at the moment, but check back soon or send your CV to{" "}
      <Text as="a" href="mailto:info@yookatale.app" color={ThemeColors.primaryColor} fontWeight="semibold">
        info@yookatale.app
      </Text>.
    </Text>
  </Box>
);

/* ─── Apply form ─── */
const ApplyForm = ({ jobTitle }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitApplication] = useJobApplicationMutation();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleUpload = (files) => setFile(files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const imageRef = ref(storage, `/Applications/${file.name + v4()}`);
      const uploadFile = await uploadBytes(imageRef, file);
      if (uploadFile) {
        const downloadURL = await getDownloadURL(imageRef);
        const response = await submitApplication({ ...formData, resume: downloadURL });
        if (response.data.status === "Success") {
          setSubmitted(true);
          setFormData({ name: "", email: "", phone: "", coverLetter: "" });
          setFile(null);
        }
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again later.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <Box
        textAlign="center" py="10" px="6"
        bg="green.50" borderRadius="xl"
        border="1px solid" borderColor="green.100"
      >
        <Flex
          w="56px" h="56px" align="center" justify="center"
          borderRadius="full" bg="white" mx="auto" mb="3"
          boxShadow="md"
        >
          <Icon as={FiSend} boxSize="22px" color={ThemeColors.primaryColor} />
        </Flex>
        <Heading as="h4" fontSize="lg" color="gray.800" mb="1">Application submitted!</Heading>
        <Text color="gray.600" fontSize="sm">
          Thank you for applying. We&apos;ll be in touch soon.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      as="form" onSubmit={handleSubmit}
      bg="gray.50" borderRadius="xl" p={{ base: 5, md: 7 }}
      border="1px solid" borderColor="gray.100"
    >
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="5">
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb="1">
            <HStack spacing="1"><Icon as={FiUser} /><Text>Full Name</Text></HStack>
          </FormLabel>
          <Input
            name="name" value={formData.name} onChange={handleChange}
            placeholder="Jane Doe"
            bg="white" borderRadius="lg" borderColor="gray.200"
            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
            fontSize="sm"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb="1">
            <HStack spacing="1"><Icon as={FiMail} /><Text>Email</Text></HStack>
          </FormLabel>
          <Input
            type="email" name="email" value={formData.email} onChange={handleChange}
            placeholder="jane@example.com"
            bg="white" borderRadius="lg" borderColor="gray.200"
            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
            fontSize="sm"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb="1">
            <HStack spacing="1"><Icon as={FiPhone} /><Text>Phone</Text></HStack>
          </FormLabel>
          <Input
            type="tel" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="+256 700 000 000"
            bg="white" borderRadius="lg" borderColor="gray.200"
            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
            fontSize="sm"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb="1">
            <HStack spacing="1"><Icon as={FiUpload} /><Text>Attach CV (Resume)</Text></HStack>
          </FormLabel>
          <Input
            type="file" id="cv" onChange={(e) => handleUpload(e.target.files)}
            bg="white" borderRadius="lg" borderColor="gray.200"
            fontSize="sm" pt="1.5"
            _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
          />
        </FormControl>
      </Grid>

      <FormControl isRequired mt="5">
        <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb="1">
          <HStack spacing="1"><Icon as={FiFileText} /><Text>Cover Letter</Text></HStack>
        </FormLabel>
        <Textarea
          name="coverLetter" value={formData.coverLetter} onChange={handleChange}
          placeholder="Tell us why you're a great fit for this role..."
          maxLength={2500} rows={5}
          bg="white" borderRadius="lg" borderColor="gray.200"
          _focus={{ borderColor: ThemeColors.primaryColor, boxShadow: `0 0 0 1px ${ThemeColors.primaryColor}` }}
          fontSize="sm" resize="vertical"
        />
        <Text fontSize="xs" color="gray.400" mt="1" textAlign="right">
          {formData.coverLetter.length}/2500 characters
        </Text>
      </FormControl>

      <Button
        type="submit"
        isLoading={loading}
        loadingText="Submitting..."
        mt="6"
        bg={ThemeColors.primaryColor}
        color="white"
        borderRadius="lg"
        fontWeight="semibold"
        size="md"
        leftIcon={<FiSend />}
        _hover={{ bg: ThemeColors.secondaryColor }}
        _active={{ bg: ThemeColors.secondaryColor }}
      >
        Submit Application
      </Button>
    </Box>
  );
};

export default Careers;
