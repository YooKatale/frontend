import VendorForm from '@components/VendorForm';
=======
"use client";
import React from "react";
import PartnerComponent from "@components/Partner";
import QuestionsAndAnswers from "@components/Questions";

const PartnerPage = () => {
  return (
    <div>
      <VendorForm />
      {/* <ThreeInOneDeliveryForm /> */}
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/2 p-4">
        <QuestionsAndAnswers />
      </div>

      <div className="w-full md:w-1/2 p-4">
        <PartnerComponent onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default PartnerPage;

