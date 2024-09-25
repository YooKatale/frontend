"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Spinner, useToast } from "@chakra-ui/react";
import ButtonComponent from "./Button";
import { useNewsletterPostMutation } from "@slices/usersApiSlice";
import { ChevronDown, X } from "lucide-react";
import axios from "axios";

const NewsletterForm = () => {
  const [NewsletterEmail, setNewsletterEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [userClosed, setUserClosed] = useState(false);
  const [createNewsletter] = useNewsletterPostMutation();
  const chakraToast = useToast();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading

    try {
      const res = await createNewsletter({ email: NewsletterEmail }).unwrap();

      if (res.status === "Success") {
        // Clear email value
        setNewsletterEmail("");

        setDisplay((prev) => (prev ? false : true));

        // // make call to api to send mail
        // const res = await axios.post("/api/mail", { email: NewsletterEmail });

        // if (res.statusText == "OK")
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

  
  useEffect(() => {
    if (!userClosed) {
      const timeoutId = setTimeout(() => {
        setDisplay(true);
      }, 2500);
      // Cleanup timeout -(In case of unexpected unmounting)
      return () => clearTimeout(timeoutId);
    }
  }, [userClosed]);
  const handleClose = () => {
    setDisplay(false);
    setUserClosed(true);
  };
  return (
   (display && <div
      // className={`fixed lg:w-[500px] sm:w-[400px] w-[350px] p-6 bottom-4 left-4 backdrop-blur-md bg-[#ffffffd7] rounded-md ${
      //   display ? "translate-y-0" : "translate-y-[150%]"
      // }`}

      className={`fixed lg:w-[500px] sm:w-[400px] w-[350px] p-6 bottom-4 left-4 backdrop-blur-md bg-[#ffffffd7] rounded-md 
        transition-transform duration-300 ease-in-out z-50`} // High z-index value
    >
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => handleClose()}
      >
        <ChevronDown size={25} />
      </div>
      <div className="py-4 ">
        <form onSubmit={handleNewsletterSubmit}>
          <div>
            <div>
              <h3 className="text-lg font-semibold">
                Subscribe to our newsletter
              </h3>
            </div>

            <div className="py-2">
              <Input
                type="text"
                name={"NewsletterEmail"}
                placeholder="Enter your email"
                value={NewsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
            </div>

            <div className="py-[0.3rem]">
              <p className="text-base">
                By clicking "Subscribe" I agree to receive news, promotions,
                information and offers from YooKatale
              </p>
            </div>

            <div className="py-2">
              {isLoading ? (
                <Spinner />
              ) : (
                <ButtonComponent type={"submit"} text={"Subscribe"} />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>)
  );
};

export default NewsletterForm;
