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


const SignIn = ({ redirect, callback }) => {
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
      setLoading((prevState) => (prevState ? false : true));

      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials({ ...res }));

      chakraToast({
        title: "Logged In",
        description: `Successfully logged in as ${res?.lastname}`,
        status: "success",
        duration: 5000,
        isClosable: false,
      });

      if (callback) return callback({ loggedIn: true, user: res?._id });

      if (redirect) return push(redirect);

      push("/");
    } catch (err) {
      // set loading to be false
      setLoading((prevState) => (prevState ? false : true));

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
        <Box paddingBottom={"5rem"}>
          <Box padding={"1rem 0"}>
            <Heading as={"h2"} fontSize={"lg"} textAlign={"center"}>
              Access your account
            </Heading>
            <Text fontSize={"3xl"} textAlign={"center"}>
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
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    type="email"
                    id={`email${Math.random(0,10000)}`}
                    placeholder="Email is required"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="password is required"
                    name="password"
                    value={password}
                    id={`password${Math.random(0,10000)}`}
                    onChange={(e) => setPassword(e.target.value)}
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
               
                <Box padding={"0"}>
                  <ButtonComponent
                    size={"regular"}
                    type={"submit"}
                    text={"Sign In"}
                    icon={isLoading && <Loader size={20} />}
                  />
                </Box>


                <Box
                display="flex"
                justifyContent="flex-end" 
                marginTop="1rem">
                <Text>
                  <Link
                    href={"/forgotpassword"}
                    style={{ color: ThemeColors.darkColor }}
                  >
                    Forgot Password?
                  </Link>
                </Text>
  
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

export default SignIn;

