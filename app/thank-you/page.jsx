import React from 'react';

const ThankYouPage = () => {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
        Thank You for Shopping with Us!
      </h1>
      <p className="text-base md:text-xl text-gray-600 mb-2 text-center">
        Your order has been successfully placed.
      </p>
      <p className="text-base md:text-xl text-gray-600 text-center">
        We appreciate your business and look forward to serving you again.
      </p>
    </div>
  );
};

export default ThankYouPage;
