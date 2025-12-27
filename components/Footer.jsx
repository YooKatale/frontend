"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
  useClipboard,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import { useCreateReferralCodeMutation, useNewsletterPostMutation, useSendReferralEmailMutation } from "@slices/usersApiSlice";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter
} from "react-icons/fa";
import { useSelector } from "react-redux";
import ButtonComponent from "./Button";
import NewsletterForm from "./NewsletterForm";
//import PopupAd from "./PopupAd";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'next-share'
import { LinkedinShareButton } from "react-share";
const crypto = require('crypto');
const Footer = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [NewsletterEmail, setNewsletterEmail] = useState("");
  const [referralCode, setreferralCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isReferralLoading, setIsReferralLoading] = useState(false);
  const [createNewsletter] = useNewsletterPostMutation();
  const [createReferralCode]=useCreateReferralCodeMutation();
  const [sendMailInvitation]=useSendReferralEmailMutation()
  const chakraToast = useToast();
  const[invitee, setInvitee]=useState("")
  const { isOpen: isReferralOpen, onOpen: openRefferal, onClose: closeReferral } = useDisclosure();
  const shareUrl = "https://www.yookatale.app"; // URL to be shared
  const defaultMessage =
    "Hey, I am using YooKatale. Forget about cooking or going to the market. Enjoy a variety of customizable meals for breakfast, lunch & supper at discounted prices with access to credit, never miss a meal by using our premium, family & business subscription plans with friends and family!:: https://www.yookatale.app\n\nSign up for free today & invite friends & loved ones www.yookatale.app/signup\n\nEarn 20,000UGX to 50,000UGX & other Gifts for every member you invite.\n\nwww.yookatale.app/subscription"; // Default message

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading

    try {
      const res = await createNewsletter({ email: NewsletterEmail }).unwrap();

      if (res.status === "Success") {
        // Clear email value
        setNewsletterEmail("");

        return chakraToast({
          title: "Success",
          description: "Successfully subscribed to the newsletter",
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
  
  function generateReferralCode(userId) {
    const hash = crypto.createHash('sha256').update(userId).digest('hex');
    return hash.substring(0, 8);  // Return first 8 characters
  } 
  const [referralUrl, setreferralUrl] = useState("")
  
  useEffect(() => {
    if (userInfo?._id) {  // Ensure that userInfo and _id are defined
      const referralCodetemp = generateReferralCode(userInfo._id);
      setreferralCode(referralCodetemp)
      setreferralUrl(`https://yookatale.app/signup?ref=${referralCodetemp}`);
    }
  }, [userInfo]);  // Dependency array to run this when userInfo changes  

  const { hasCopied, onCopy } = useClipboard(referralUrl); 
  
 const handleOncopy=async()=>{
  onCopy()
  const toPayload={
    referralCode: referralCode,
    userId: userInfo?._id
  }
  try {
    const res = await createReferralCode(toPayload).unwrap()
  if (res.status === "Success") {
    chakraToast({
      title: "Success",
      description: "Your Referral link has been saved",
      status: "success",
      duration: 6000,
      isClosable: false,
      position:'top'
    });
  }
  } catch (error) {
    //alert(JSON.stringify(error))
    chakraToast({
      title: "Error",
      description: error.data.message,
      status: "error",
      duration: 6000,
      isClosable: false,
      position:'top'
    });
  }
  
}

const handleMailInvitation = async () => {
  setIsReferralLoading(true)
  const toPayload={
    email: invitee,
    referralCode: referralCode
  }
try {
  const res = await sendMailInvitation(toPayload)
  if (res?.data?.status === "Success") {
    setIsReferralLoading(false)
  return chakraToast({
    title: "Success",
    description: "Successfully sent Invitation",
    status: "success",
    duration: 5000,
    isClosable: false,
  });
}
} catch (error) {
  setIsReferralLoading(false)
  return chakraToast({
    title: "Error",
    description: "Sending Invitation failed",
    status: "error",
    duration: 5000,
    isClosable: false,
  });
}
}
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
                            href={
                              "https://www.linkedin.com/company/96071915/admin/feed/posts/"
                            }
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
                            href={
                              "https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09"
                            }
                          >
                            <FaTwitter
                              size={23}
                              color={ThemeColors.lightColor}
                              style={{}}
                            />
                          </Link>
                        </Box>
                        <Box margin={"0 0.7rem 0 0"}>
                          <Link href={"https://wa.me/256786118137"}>
                            <FaWhatsapp
                              size={23}
                              color={ThemeColors.lightColor}
                              style={{}}
                            />
                          </Link>
                        </Box>
                        <Box margin={"0 0.7rem 0 0"}>
                          <Link
                            href={
                              "https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d"
                            }
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
                            href={
                              "https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ=="
                            }
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
                      <Link href={"http://yookatale.com/news"}>
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
                <Image src="/assets/images/apple.svg" width={30} height={30} alt="appstore_img" />
                <div className="ml-1">
                  <Text color="white" fontSize="sm">
                    App Store
                  </Text>
                </div>
              </Link>
              <Link
                 href="/subscription"
                 className="mt-4 md:mt-0 md:ml-4 flex items-center p-2 border border-gray-300 border-opacity-50 rounded-md shadow-md"
              >
                 <Image src="/assets/images/google.svg" width={30} height={30} alt="playstore_img"/>
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
                onClick={()=>openRefferal()}
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

      <Modal isOpen={isReferralOpen} onClose={closeReferral} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent pt={3} pb={2}>
        <ModalHeader textAlign={'center'} textDecoration={'underline'}>Share Your Referral Link</ModalHeader>
        <ModalCloseButton />
        {userInfo?._id !==undefined ?
        <ModalBody>
          <Box mt={-4} mb={2} fontWeight={'400'}>
            <Text fontSize={15} mt={0}>Refer others and earn some extra cash. Simply share your referral link with your associates or businesses</Text>
              <List fontSize={14} styleType="disc" pl={8}>
                <ListItem>Make sure they signup using your referral link</ListItem>
                <ListItem>Confirm and claim your payout</ListItem>
              </List>
          </Box>
          <Box mb={6} fontWeight={'400'}>
          <FormControl>
            <FormLabel>Invite By Mail</FormLabel>
            <InputGroup>
            <Input 
              placeholder="Input email to invite" 
              type="email"
              disabled={isReferralLoading}
              value={invitee}
              onChange={(e)=>setInvitee(e.target.value)}
              _hover={{}}
            />
                <InputRightElement width={isReferralLoading?"6rem":"4.5rem"} mr={isReferralLoading &&1}>
                  <Button h="2rem" size="sm" style={{backgroundColor:'orange', color:'white', fontWeight:'500'}}
                  onClick={()=>{ handleMailInvitation()}}  isLoading={isReferralLoading} loadingText="Sending"
                  >
                    Invite
                  </Button>
                  {/*  */}
                </InputRightElement>
              </InputGroup>
          </FormControl>
          </Box>
          <Box mb={6}>
        <FormControl>
            <FormLabel>Referral URL</FormLabel>
            <InputGroup>
              <Input value={referralUrl} isDisabled _hover={{}}/>
              <InputRightElement width="4.5rem">
                <Button h="2rem" size="sm" style={{backgroundColor:'black', color:'white', fontWeight:'500'}}
                //onClick={onCopy}
                onClick={handleOncopy} 
                mr={hasCopied && 1} >
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          </Box>
          <Box justifyContent={'center'} textAlign={'center'}>
            <FacebookShareButton
              url={shareUrl}
              quote={defaultMessage}
              hashtag={'#yookatale'}
              style={{ padding: 3 }}
            >
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <WhatsappShareButton url={shareUrl} title={defaultMessage} style={{ padding: 3 }} separator=":: ">
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
            <TwitterShareButton url={shareUrl} title={defaultMessage} style={{ padding: 3 }}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} style={{ padding: 3 }} >
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
            <TelegramShareButton url={shareUrl} title={defaultMessage} style={{ padding: 3 }}>
              <TelegramIcon size={40} round />
            </TelegramShareButton>
            </Box>
        </ModalBody>
        :<ModalBody>
          <Box mt={-4} mb={2} fontWeight={'400'} textAlign={'center'} marginTop={3}>
            <Text fontSize={17} mt={0}>You need to Signin to be able to refer</Text>
          </Box>
        </ModalBody>

}
        <ModalFooter justifyContent={'center'} textAlign={'center'}>
         
            <Button colorScheme="gray" 
            onClick={()=>
              {closeReferral(); 
            setIsReferralLoading(false)
          }}>
              Close
            </Button>
            
          
        </ModalFooter>
      </ModalContent>
    </Modal>
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
