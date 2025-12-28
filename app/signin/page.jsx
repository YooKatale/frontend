"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@slices/usersApiSlice";
import { setCredentials } from "@slices/authSlice";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import ButtonComponent from "@components/Button";
import { Loader } from "lucide-react";


const SignIn = ({ redirect, callback, ismodal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const chakraToast = useToast();

  const { refresh, push } = useRouter();

  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (userInfo) return push("/");
  // }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // set loading to be true
      setLoading(true);

      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials({ ...res }));

      chakraToast({
        title: "Logged In",
        description: `Successfully logged in as ${res?.lastname || res?.firstname || 'User'}`,
        status: "success",
        duration: 5000,
        isClosable: false,
      });

      setLoading(false);

      if (callback) return callback({ loggedIn: true, user: res?._id });

      if (redirect) return push(redirect);

      push("/");
    } catch (err) {
      // set loading to be false
      setLoading(false);

      chakraToast({
        title: "Error has occured",
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
        <Box >
          <Box padding={"1rem 0"}>
            <Heading as={"h2"} fontSize={"lg"} textAlign={"center"}>
              Access your account
            </Heading>
            <Text fontSize={25} textAlign={"center"}>
              Sign In to continue
            </Text>
            <Flex>
              <Box
                height={"0.2rem"}
                width={"8rem"}
                margin={"0.5rem auto"}
                background={ThemeColors.primaryColor}
              ></Box>
            </Flex>
          </Box>
          <Flex>
            <Box
              margin={"auto"}
              width={{ base: "90%", md: "80%", xl: "50%" }}
              padding={{
                base: "2rem 0 5rem 0",
                md: "1rem 0 3rem 0",
                xl: "1rem",
              }}
            >
              <form onSubmit={submitHandler}>
                <FormControl mt={-6} isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Email is required"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="password is required"
                    name="password"
                    value={password}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>
                <Box padding="1rem 0">
                  <Text display="flex">
                    Create new account:{" "}
                    <Link
                      href={"/signup"}
                      style={{
                        color: ThemeColors.darkColor,
                        margin: "0 0.5rem",
                      }}
                    >
                      Sign Up
                    </Link>
                  </Text>
                </Box>
               
               
                <Box display="flex" justifyContent="space-between" alignItems="center" >
                  {/* Sign In Button on the Left */}
                  <Box>
                    <ButtonComponent
                      size={"regular"}
                      type={"submit"}
                      text={"Sign In"}
                      icon={isLoading && <Loader size={20} />}
                    />
                  </Box>
                  {/* Forgot Password on the Right */}
                  <Box>
                    <Text>
                      <Link href={"/forgotpassword"} style={{ color: ThemeColors.darkColor }}>
                        Forgot Password?
                      </Link>
                    </Text>
                  </Box>
                </Box>

              </form>
              {!ismodal &&
                <Text fontSize="3xl" textAlign="center">
                  <Link href="/subscription">
                    <Button variant={'outline'}
                      style={{ border: "1px solid #4CAF50", marginTop: 12 }}
                      _hover={{
                        //bg:'#C8E6C9',
                        color: '#388E3C'
                      }}
                    >
                      View Our Subscription Packages
                    </Button>
                  </Link>
                </Text>
              }  
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default SignIn;

