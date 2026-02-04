"use client";

import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const FlutterwavePayment = ({ data, callback, closeComponent }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const launched = useRef(false);

  const flwConfig = {
    public_key: "FLWPUBK-90aa8f20e8f80d3418dc9af31c93c3e9-X",
    tx_ref: Date.now(),
    amount: data?.total,
    currency: "UGX",
    payment_options: data?.paymentMethod === "card" ? "card" : "mobilemoneyuganda",
    customer: {
      email: userInfo?.email || "",
      phone_number: userInfo?.phone || "",
      name: [userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") || "Customer",
    },
    customizations: {
      title: data?.title || "Payment",
      description: data?.message || "",
      logo: "https://yookatale-server-app.onrender.com/uploads/logo1.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(flwConfig);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
      return;
    }
    if (!data?.total) return;
    if (launched.current) return;
    launched.current = true;

    const onClose = () => {
      closePaymentModal();
      if (typeof closeComponent === "function") closeComponent();
    };

    handleFlutterPayment({
      callback: (response) => {
        if (response?.status === "successful") {
          callback({
            status: "success",
            message: "",
            payment: {
              transactionID: response?.transaction_id,
              transactionTxRef: response?.tx_ref,
            },
          });
        } else {
          callback({ status: "error", message: response?.message || "Payment failed" });
        }
        closePaymentModal();
        if (typeof closeComponent === "function") closeComponent();
      },
      onClose,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount; modal close unmounts

  return null;
};

export default FlutterwavePayment;
