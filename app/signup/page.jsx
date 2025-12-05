"use client";

import {
  Box,
  Flex,
  FormControl,
  Heading,
  Text,
  FormLabel,
  Input,
  Button,
  Grid,
  Select,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "@slices/usersApiSlice";
import { setCredentials } from "@slices/authSlice";
import { redirect, useRouter } from "next/navigation";
import ButtonComponent from "@components/Button";
import { Loader } from "lucide-react";
import Image from "next/image";

const SignUp = () => {
  // states
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [vegan, setVegan] = useState(false);
  const [address, setAddress] = useState("");
  const [isLoading, setLoading] = useState(false);
const [referralCode, setReferralCode]= useState(null);
  const { push } = useRouter();

  const chakraToast = useToast();

  const dispatch = useDispatch();

  const [register] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) return push("/");
    if (typeof window !== 'undefined') {
      const urlpath = new URLSearchParams(window.location.search);
      urlpath.get('ref') !==undefined && setReferralCode(urlpath.get('ref'))
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // set loading to be true
      setLoading((prevState) => (prevState ? false : true));

      if (!e.target.terms.checked) {
        chakraToast({
          title: "Notice",
          description: "Please agree to the terms and conditions to proceed",
          status: "error",
          duration: 5000,
          isClosable: false,
        });

        return setLoading((prevState) => (prevState ? false : true));
      }
      const referenceCode = referralCode !== null && referralCode !== undefined && referralCode.toString().trim() !== ""? referralCode:undefined;

      const res = await register({
        firstname,
        lastname,
        email,
        phone,
        gender,
        vegan,
        dob,
        address,
        password,
        referenceCode
      }).unwrap();

      dispatch(setCredentials({ ...res }));

      chakraToast({
        title: "Logged In",
        description: `Successfully logged in as ${res?.lastname}`,
        status: "success",
        duration: 5000,
        isClosable: false,
      });

      push("/");
    } catch (err) {
      // set loading to be false
      setLoading((prevState) => (prevState ? false : true));

      chakraToast({
        title: "Error",
        description: err.data?.message
          ? err.data?.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <>
      <Box>
        <Box paddingBottom={"3rem"}>
          <Box padding={"1rem 0"}>
            <Heading as={"h2"} fontSize={"2xl"} textAlign={"center"} mb={4}>
              Welcome to Yookatale.
            </Heading>
            <Text fontSize={"xl"} textAlign={"center"} mb={2} fontWeight={"bold"}>
              Yoo mobile food market.
            </Text>
            <Flex>
              <Box
                height={"0.2rem"}
                width={"8rem"}
                margin={"0.5rem auto"}
                background={ThemeColors.primaryColor}
              ></Box>
            </Flex>
            <Box padding={"1.5rem 0"} textAlign={"center"}>
              <Text fontSize={"md"} mb={3} lineHeight={"1.8"}>
                Forget about cooking or going to the market by subscribing for Freemium, Premium, Family or Business Plan.
              </Text>
              <Text fontSize={"md"} mb={3} lineHeight={"1.8"}>
                Discover and customize your meals, set your own time when to eat, where to eat from with friends, family and loved ones while earning loyalty rewards, gifts and discounts.
              </Text>
            </Box>
            <Box padding={"1rem 0"} textAlign={"center"}>
              <Text fontSize={"md"} mb={2}>
                <Link href="/signup" style={{ color: ThemeColors.darkColor, textDecoration: "underline" }}>
                  Freely Signup www.yookatale.app/signup
                </Link>
              </Text>
              <Text fontSize={"md"} mb={2}>
                <Link href="/subscription" style={{ color: ThemeColors.darkColor, textDecoration: "underline" }}>
                  Subscribe www.yookatale.app/subscription
                </Link>
              </Text>
              <Text fontSize={"md"} mb={3}>
                <Link href="/partner" style={{ color: ThemeColors.darkColor, textDecoration: "underline" }}>
                  Partner with us www.yookatale.app/partner
                </Link>
              </Text>
            </Box>
            
            {/* Payment Options */}
            <Box padding={"1.5rem 0"} textAlign={"center"}>
              <Heading as={"h3"} fontSize={"lg"} mb={3}>
                Payment Options
              </Heading>
              <Flex justifyContent={"center"} flexWrap={"wrap"} gap={3}>
                <Box
                  padding={"1rem 1.5rem"}
                  border={"1.7px solid " + ThemeColors.darkColor}
                  borderRadius={"0.5rem"}
                  minWidth={"150px"}
                >
                  <Text fontSize={"md"} textAlign={"center"}>
                    Mobile Money
                  </Text>
                </Box>
                <Box
                  padding={"1rem 1.5rem"}
                  border={"1.7px solid " + ThemeColors.darkColor}
                  borderRadius={"0.5rem"}
                  minWidth={"150px"}
                >
                  <Text fontSize={"md"} textAlign={"center"}>
                    Credit/Debit Card
                  </Text>
                </Box>
                <Box
                  padding={"1rem 1.5rem"}
                  border={"1.7px solid " + ThemeColors.darkColor}
                  borderRadius={"0.5rem"}
                  minWidth={"150px"}
                >
                  <Text fontSize={"md"} textAlign={"center"}>
                    Cash on Delivery
                  </Text>
                </Box>
                <Box
                  padding={"1rem 1.5rem"}
                  border={"1.7px solid " + ThemeColors.darkColor}
                  borderRadius={"0.5rem"}
                  minWidth={"150px"}
                >
                  <Text fontSize={"md"} textAlign={"center"}>
                    Pay Later
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Android & iOS Icons */}
            <Box padding={"1.5rem 0"} textAlign={"center"}>
              <Flex justifyContent={"center"} gap={4} flexWrap={"wrap"}>
                <Link
                  href="/subscription"
                  className="flex items-center p-2 border border-gray-300 border-opacity-50 rounded-md shadow-md"
                >
                  <Image src="/assets/images/apple.svg" width={30} height={30} alt="appstore_img" />
                  <Text color={ThemeColors.darkColor} fontSize="sm" ml={2}>
                    App Store
                  </Text>
                </Link>
                <Link
                  href="/subscription"
                  className="flex items-center p-2 border border-gray-300 border-opacity-50 rounded-md shadow-md"
                >
                  <Image src="/assets/images/google.svg" width={30} height={30} alt="playstore_img" />
                  <Text color={ThemeColors.darkColor} fontSize="sm" ml={2}>
                    Google Play
                  </Text>
                </Link>
              </Flex>
            </Box>
          </Box>
          <Flex>
            <Box
              margin={"auto"}
              width={{ base: "90%", md: "80%", xl: "60%" }}
              padding={"1rem"}
            >
              <form onSubmit={handleSubmit}>
                <Grid
                  gridTemplateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(1, 1fr)",
                    xl: "repeat(2, 1fr)",
                  }}
                  gridGap={"1rem"}
                >
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="firstname">Firstname</FormLabel>
                      <Input
                        type="text"
                        id="firstname"
                        placeholder="firstname is required"
                        name="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="lastname">Lastname</FormLabel>
                      <Input
                        type="text"
                        id="lastname"
                        placeholder="lastname is required"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                </Grid>
                <Grid
                  gridTemplateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(1, 1fr)",
                    xl: "repeat(2, 1fr)",
                  }}
                  gridGap={"1rem"}
                >
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <Input
                        type="text"
                        placeholder="Include country code [+256.....]"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="gender">Gender</FormLabel>
                      <Select
                        placeholder="Select gender"
                        name="gender"
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid
                  gridTemplateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(1, 1fr)",
                    xl: "repeat(2, 1fr)",
                  }}
                  gridGap={"1rem"}
                >
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="email">Email *</FormLabel>
                      <Input
                        type="text"
                        id={`email${Math.random(0,10000)}`}
                        placeholder="email is required"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="dob">Date of Birth *</FormLabel>
                      <Input
                        type="date"
                        id="dob"
                        placeholder=""
                        name="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                </Grid>

                <Grid
                  gridTemplateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(1, 1fr)",
                    xl: "repeat(2, 1fr)",
                  }}
                  gridGap={"1rem"}
                >
                  <Box padding={"0.5rem 0"}>
                    <FormControl>
                      <FormLabel htmlFor="address">Address</FormLabel>
                      <Input
                        type="text"
                        id="address"
                        placeholder=""
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </FormControl>
                  </Box>
                  {referralCode!==null && referralCode.toString()!==""?
                  <Box padding={"0.5rem 0"}>
                  <FormControl>
                      <FormLabel htmlFor="email">Referral Code</FormLabel>
                      <Input
                      disabled
                      _hover={{}}
                        type="text"
                        id="referralCode"
                        placeholder=""
                        name="referralCode"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                      />
                    </FormControl>
                  </Box>:null}
                </Grid>

               
                <Box padding={"0.5rem 0"}>
                  <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="password is required"
                      name="password"
                      id={`password${Math.random(0,10000)}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box padding="1rem 0">
                  <Text display="flex">
                    Access your account{" "}
                    <Link
                      href={"/signin"}
                      style={{
                        color: ThemeColors.darkColor,
                        margin: "0 0.5rem",
                      }}
                    >
                      Sign In
                    </Link>
                  </Text>
                </Box>

                <Box padding={"0.5rem 0"}>
                  <div className="flex">
                    <input
                      type="checkbox"
                      name="vegan"
                      value={vegan}
                      onChange={(e) => setVegan(e.target.value)}
                      className="mr-4"
                    />
                    <p className="">Are you vegetarian ?</p>
                  </div>
                </Box>

                <Box padding={"0.5rem 0"}>
                  <input type="checkbox" name="terms" className="mr-4" />I agree
                  to the{" "}
                  <Link href={"/usage"}>
                    <span style={{ color: ThemeColors.darkColor }}>
                      terms and conditions
                    </span>
                  </Link>
                </Box>

                <Box padding={"0.5rem 0"}>
                  <ButtonComponent
                    type={"submit"}
                    text={"Sign Up"}
                    icon={isLoading && <Loader />}
                    size={"regular"}
                  />
                </Box>
              </form>

              <Text fontSize="3xl" textAlign="center">
                <Link href="/subscription">
                   <ButtonComponent
                    size="regular"
                    type="button"
                    text="View Our Subscription Packages"
                    icon={false} 
                     />
                </Link>
             </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default SignUp;
