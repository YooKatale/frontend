"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "react-icons/fi";
import { ThemeColors } from "@constants/constants";
import { useGetCareersMutation } from "@slices/careersListSlice";
import { useJobApplicationMutation } from "@slices/applicationSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@lib/firebase";
import { v4 } from "uuid";

const MotionBox = motion(Box);

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
            textAlign="center"
          >
            <MotionBox variants={itemVariants}>
              <Text
                fontSize="sm" fontWeight="semibold"
                color={ThemeColors.primaryColor}
                letterSpacing="wider" textTransform="uppercase" mb="3"
              >
                We are hiring
              </Text>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold" lineHeight="shorter" mb="4"
                bgGradient={`linear(to-r, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                bgClip="text"
              >
                Join Our Team
              </Heading>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Box
                height="4px" width="80px" margin="0 auto 1.25rem"
                background={`linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`}
                borderRadius="full"
              />
              <Text
                fontSize={{ base: "md", md: "lg" }} color="gray.600"
                maxW="560px" mx="auto" lineHeight="tall"
              >
                Help us build Africa&apos;s largest digital food network. We&apos;re looking for passionate
                people who want to make a real impact.
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
                    <JobCard job={job} />
                  </MotionBox>
                ))}
              </VStack>
            ) : (
              <EmptyState />
            )}
          </MotionBox>

          {/* CTA footer */}
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            textAlign="center"
            py="8"
            px={{ base: 6, md: 10 }}
            bg="green.50"
            borderRadius="2xl"
            border="1px solid"
            borderColor="green.100"
          >
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color="gray.800" mb="2">
              Don&apos;t see a role that fits?
            </Text>
            <Text fontSize="md" color="gray.600">
              Send your CV directly to{" "}
              <Text as="span" color={ThemeColors.primaryColor} fontWeight="semibold">
                info@yookatale.com
              </Text>{" "}
              — we&apos;re always open to great talent.
            </Text>
          </MotionBox>

        </VStack>
      </Container>
    </Box>
  );
}

/* ─── Job Card ─── */
const JobCard = ({ job }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

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

  return (
    <Box
      bg="white" borderRadius="2xl"
      border="1px solid" borderColor="gray.100"
      boxShadow="0 4px 20px rgba(0,0,0,0.07)"
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
      <Flex px={{ base: 5, md: 8 }} py="4" gap="3" wrap="wrap">
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
      <Text as="span" color={ThemeColors.primaryColor} fontWeight="semibold">info@yookatale.com</Text>.
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
