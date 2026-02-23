"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "@slices/authSlice";

const PopupAd = () => {
  const [display, setDisplay] = useState(false);
  const { userInfo } = useAuth();
  console.log("user", userInfo);

  useEffect(() => {
    setTimeout(() => {
      setDisplay((prev) => (prev ? false : true));
    }, 2500);
  }, []);

  return (
    <div
      className={`fixed lg:w-[500px] sm:w-[400px] w-[350px] p-6 bottom-4 left-4 flex items-center justify-center backdrop-blur-md bg-[#ffffffd7] rounded-md ${
        display ? "translate-y-0" : "translate-y-[150%]"
      }`}
    >
      <div
        className="absolute top-2 right-2 cursor-pointer"
        onClick={() => setDisplay((prev) => (prev ? false : true))}
      >
        <X size={20} />
      </div>
      {userInfo ? (
        <a
          href="https://www.quicket.co.ug/events/249213-silent-disco-pool-party-2-edition/#/"
          target="_blank"
          className="py-4 "
        >
          <img
            src={`./assets/images/pool-party-ad.jpg`}
            alt="pop-add"
            className="object-cover"
          />
        </a>
      ) : (
        <a
          href="/signin"
          className="py-4 "
        >
          <img
            src={`./assets/images/pool-party-ad.jpg`}
            alt="pop-add"
            className="object-cover"
          />
        </a>
      )}
    </div>
  );
};

export default PopupAd;
