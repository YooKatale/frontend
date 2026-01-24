"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useNewsletterPostMutation } from "@slices/usersApiSlice";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import ButtonComponent from "./Button";
import NewsletterForm from "./NewsletterForm";
import ReferralModal from "./ReferralModal";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
const Footer = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [NewsletterEmail, setNewsletterEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [createNewsletter] = useNewsletterPostMutation();
  const chakraToast = useToast();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading

    try {
      const res = await createNewsletter({ email: NewsletterEmail }).unwrap();

      if (res.status === "Success") {
        // Clear email value
        setNewsletterEmail("");

        // Send newsletter email using direct SMTP (NOT backend invitation endpoint)
        try {
          await fetch("/api/mail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: NewsletterEmail, type: 'newsletter' }),
          });
          console.log("✅ Newsletter email sent to:", NewsletterEmail);
        } catch (emailError) {
          console.error("⚠️ Failed to send newsletter email:", emailError);
          // Don't show error to user - newsletter subscription was successful
        }

        return chakraToast({
          title: "Success",
          description: "Successfully subscribed to the newsletter. Newsletter email sent!",
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      }
    } catch (err) {
      // Display error message
      chakraToast({
        title: "Error",
        description: err.data?.message
          ? err.data.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {/* // modal newsletter form  */}
      <NewsletterForm />
      {/* <PopupAd /> */}

      <Box borderTop={"1.7px solid " + ThemeColors.lightColor} id="refer">
        <Box padding={"1rem 0 2rem 0"} background={"#0c0c0c"}>
          <Flex>
            <Box width={"80%"} margin={"auto"}>
              <Grid
                gridTemplateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gridGap={"1rem"}
              >
                <Box padding={"1rem 0"}>
                  <Stack>
                    <Box padding={"0.5rem 0"}>
                      <Text
                        display={"flex"}
                        margin={"0.3rem 0"}
                        color={ThemeColors.lightColor}
                      >
                        <FaPhone
                          size={20}
                          color={ThemeColors.lightColor}
                          style={{ margin: "0 0.3rem 0 0" }}
                        />{" "}
                        +256786118137
                      </Text>
                      <Text
                        display={"flex"}
                        margin={"0.3rem 0"}
                        color={ThemeColors.lightColor}
                      >
                        <FaEnvelope
                          size={20}
                          color={ThemeColors.lightColor}
                          style={{ margin: "0 0.3rem 0 0" }}
                        />
                        info@yookatale.app
                      </Text>
                    </Box>
                    <Box padding={"1rem 0"}>
                      <Flex>
                        <Box margin={"0 0.7rem 0 0"}>
                          <Link
                            href="https://www.linkedin.com/company/96071915/admin/feed/posts/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaLinkedin
                              size={23}
                              color={ThemeColors.lightColor}
                              style={{}}
                            />
                          </Link>
                        </Box>
                        <Box margin={"0 0.7rem 0 0"}>
                          <Link
                            href="https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaTwitter
                              size={23}
                              color={ThemeColors.lightColor}
                              style={{}}
                            />
                          </Link>
                        </Box>
                        <Box margin={"0 0.7rem 0 0"}>
                          <Link
                            href="https://wa.me/256786118137"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaWhatsapp
                              size={23}
                              color={ThemeColors.lightColor}
                              style={{}}
                            />
                          </Link>
                        </Box>
                        <Box margin={"0 0.7rem 0 0"}>
                          <Link
                            href="https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaFacebook
                              size={23}
                              color={ThemeColors.lightColor}
                              style={{}}
                            />
                          </Link>
                        </Box>
                        <Box margin={"0 0.7rem 0 0"}>
                          <Link
                            href="https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ=="
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaInstagram
                              size={23}
                              color={ThemeColors.lightColor}
                            />
                          </Link>
                        </Box>
                      </Flex>
                    </Box>
                  </Stack>
                </Box>

                <Box
                  padding={"1rem 0"}
                  display={{ base: "block", md: "block", xl: "none" }}
                >
                  <form onSubmit={handleNewsletterSubmit}>
                    <Box borderRadius={"0.5rem"} padding={"0.5rem"}>
                      <Box>
                        <Text
                          fontSize={"lg"}
                          fontWeight={"bold"}
                          textAlign={{
                            base: "center",
                            md: "center",
                            xl: "left",
                          }}
                          color={ThemeColors.lightColor}
                        >
                          Subscribe to our newsletter
                        </Text>
                      </Box>
                      <Box padding={"1rem 0"}>
                        <Input
                          type="text"
                          name={"NewsletterEmail"}
                          placeholder="Enter your email"
                          value={NewsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          color={ThemeColors.lightColor}
                        />
                      </Box>
                      <Box padding={"0.3rem 0"}>
                        <Text
                          fontSize={"sm"}
                          textAlign={{
                            base: "center",
                            md: "center",
                            xl: "left",
                          }}
                          color={ThemeColors.lightColor}
                        >
                          By clicking "Subscribe" I agree to receive news,
                          promotions, information and offers from YooKatale
                        </Text>
                      </Box>
                      <Box padding={"0.5rem 0"}>
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <ButtonComponent type={"submit"} text={"Subscribe"} />
                        )}
                      </Box>
                    </Box>
                  </form>
                </Box>

                <Box padding={"1rem 0"}>
                  <Stack padding={"1rem"}>
                    {userInfo && (
                      <Box margin={"0.3rem 0"}>
                        <Link href={"/subscription"}>
                          <Text
                            color={ThemeColors.lightColor}
                            _hover={{ color: ThemeColors.darkColor }}
                          >
                            Go Premium
                          </Text>
                        </Link>
                      </Box>
                    )}
                    <Box margin={"0.3rem 0"}>
                      <Link href={"/contact"}>
                        <Text
                          color={ThemeColors.lightColor}
                          _hover={{ color: ThemeColors.darkColor }}
                        >
                          Contact
                        </Text>
                      </Link>
                    </Box>
                    <Box margin={"0.3rem 0"}>
                      <Link href={"/about"}>
                        <Text
                          color={ThemeColors.lightColor}
                          _hover={{ color: ThemeColors.darkColor }}
                        >
                          About
                        </Text>
                      </Link>
                    </Box>
                    <Box margin={"0.3rem 0"}>
                      <Link href="/news">
                        <Text
                          color={ThemeColors.lightColor}
                          _hover={{ color: ThemeColors.darkColor }}
                        >
                          News Blog
                        </Text>
                      </Link>
                    </Box>
                    <Box margin={"0.3rem 0"}>
                      <Link href={"/advertising"}>
                        <Text
                          color={ThemeColors.lightColor}
                          _hover={{ color: ThemeColors.darkColor }}
                        >
                          Advertise
                        </Text>
                      </Link>
                    </Box>
                      <Box margin={"0.3rem 0"}>
                        <Link href={"/careers"}>
                          <Text color={ThemeColors.lightColor} _hover={{ color: ThemeColors.darkColor }}>
                            Careers
                          </Text>
                        </Link>
                      </Box>
                  </Stack>
                </Box>
                <Box
                  padding={"1rem 0"}
                  display={{ base: "none", md: "none", xl: "block" }}
                >
                  <form onSubmit={handleNewsletterSubmit}>
                    <Box borderRadius={"0.5rem"} padding={"0.5rem"}>
                      <Box>
                        <Text
                          fontSize={"lg"}
                          fontWeight={"bold"}
                          textAlign={{
                            base: "center",
                            md: "center",
                            xl: "left",
                          }}
                          color={ThemeColors.lightColor}
                        >
                          Subscribe to our newsletter
                        </Text>
                      </Box>
                      <Box padding={"1rem 0"}>
                        <Input
                          type="text"
                          name={"NewsletterEmail"}
                          placeholder="Enter your email"
                          value={NewsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          color={ThemeColors.lightColor}
                        />
                      </Box>
                      <Box padding={"0.3rem 0"}>
                        <Text
                          fontSize={"sm"}
                          textAlign={{
                            base: "center",
                            md: "center",
                            xl: "left",
                          }}
                          color={ThemeColors.lightColor}
                        >
                          By clicking "Subscribe" I agree to receive news,
                          promotions, information and offers from YooKatale
                        </Text>
                      </Box>
                      <Box padding={"0.5rem 0"}>
                        <ButtonComponent
                          type={"submit"}
                          text={"Subscribe"}
                          icon={isLoading && <Loader size={20} />}
                        />
                      </Box>
                    </Box>
                  </form>
                </Box>
              </Grid>
            </Box>
          </Flex>
          <Flex justifyContent="center">
            <Box className="mt-3 text-center md:flex mx-auto">
              <Link
                href="/subscription"
                className="md:mr-1 flex items-center p-2 border border-gray-300 border-opacity-50 rounded-md shadow-md"
              >
                <Image 
                  src="/assets/images/apple.svg" 
                  width={30} 
                  height={30} 
                  alt="appstore_img"
                  style={{ width: "30px", height: "auto" }}
                />
                <div className="ml-1">
                  <Text color="white" fontSize="sm">
                    App Store
                  </Text>
                </div>
              </Link>
              <Link
                 href="https://play.google.com/store/apps/details?id=com.yookataleapp.app"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="mt-4 md:mt-0 md:ml-4 flex items-center p-2 border border-gray-300 border-opacity-50 rounded-md shadow-md"
              >
                 <Image 
                   src="/assets/images/google.svg" 
                   width={30} 
                   height={30} 
                   alt="playstore_img"
                   style={{ width: "30px", height: "auto" }}
                 />
                <div className="ml-1">
                   <Text color="white" fontSize="sm">
                    Google Play
                    </Text>
                </div>
               </Link>
              </Box>
            </Flex> 
          </Box>
          
        <Flex
          direction={{ base: "column", md: "column", xl: "row" }}
          justifyContent={{ base: "center", md: "center", xl: "none" }}
        >
          <Box padding={{ base: "0.5rem 0", md: "0.5rem 0", xl: "1rem 2rem" }}>
            <Flex
              fontSize="md"
              justifyContent={{ base: "center", md: "center", xl: "none" }}
              alignItems="center"
              flexWrap="wrap"
            >
              <Text as="span" fontSize="md">
                &copy; {new Date().getFullYear()}
              </Text>
              <Text
                as="span"
                color={ThemeColors.primaryColor}
                margin={"0 0.3rem"}
                fontSize="lg"
                textTransform={"uppercase"}
              >
                yookatale
              </Text>
              <Text as="span" fontSize="md" style={{ margin: "0.1rem 0 0 0" }}>
                All rights reserved
              </Text>
            </Flex>
          </Box>

          <Spacer display={{ base: "none", md: "none", xl: "block" }} />

          <Box padding={{ base: "0.5rem 0", md: "0.5rem 0", xl: "none" }}>
            <Flex
              justifyContent={"center"}
              direction={{ base: "column", md: "column", xl: "row" }}
            >
              <Button
                color={ThemeColors.primaryColor}
                margin={"0.5rem"}
                fontSize="lg"
                textTransform={"uppercase"}
                textAlign={"center"}
                onClick={openReferral}
              >
                Invite A Friend
              </Button>

              {/* <Flex justifyContent={"center"} gap={"2"}>
                <FacebookShareButton url={shareUrl} quote={defaultMessage}>
                  <FacebookIcon size={25} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={defaultMessage}>
                  <TwitterIcon size={25} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={defaultMessage}>
                  <WhatsappIcon size={25} round />
                </WhatsappShareButton>
                <InstapaperShareButton url={shareUrl} title={defaultMessage}>
                  <InstapaperIcon size={25} round />
                </InstapaperShareButton>
                <LinkedinShareButton url={shareUrl} title={defaultMessage}>
                  <LinkedinIcon size={25} round />
                </LinkedinShareButton>
                <TelegramShareButton url={shareUrl} title={defaultMessage}>
                  <TelegramIcon size={25} round />
                </TelegramShareButton>
              </Flex> */}
            </Flex>
          </Box>
          <Spacer display={{ base: "none", md: "none", xl: "block" }} />
          <Box padding={{ base: "0", md: "0", xl: "1rem 0" }}>
            <Flex justifyContent={{ base: "center", md: "center", xl: "none" }}>
              <Link href={"/news"}>
                <Box
                  padding={{
                    base: "1rem 0.5rem",
                    md: "1rem 0.5rem",
                    xl: "0 0.5rem",
                  }}
                >
                  <p className="text-md">News</p>
                </Box>
              </Link>
              <Link href={"/partner"}>
                <Box
                  padding={{
                    base: "1rem 0.5rem",
                    md: "1rem 0.5rem",
                    xl: "0 0.5rem",
                  }}
                >
                  <p className="text-md">Partner</p>
                </Box>
              </Link>
              <Link href={"/faqs"}>
                <Box
                  padding={{
                    base: "1rem 0.5rem",
                    md: "1rem 0.5rem",
                    xl: "0 0.5rem",
                  }}
                >
                  <p className="text-md">Faqs</p>
                </Box>
              </Link>
              <Link href={"/privacy"}>
                <Box
                  padding={{
                    base: "1rem 0.5rem",
                    md: "1rem 0.5rem",
                    xl: "0 0.5rem",
                  }}
                >
                  <p className="text-md">Privacy Policy</p>
                </Box>
              </Link>
              <Link href={"/usage"}>
                <Box
                  padding={{
                    base: "1rem 0.5rem",
                    md: "1rem 0.5rem",
                    xl: "0 0.5rem",
                  }}
                >
                   <p className="text-md">Usage Policy</p>
                </Box>
              </Link>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />
    </>
  );
};

export default Footer;


// import React from 'react'

// function Footer() {
//   return (
//     <div>Footer</div>
//   )
// }

// export default Footer
