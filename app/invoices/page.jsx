import React from 'react';

const invoiceData = {
  invoiceNumber: 'INV-2023-001',
  date: 'October 20, 2023',
  billingInfo: {
    name: 'John Doe',
    address: '123 Main Street',
    city: 'Cityville',
    zipCode: '12345',
  },
  items: [
    { description: 'Product A', quantity: 2, price: 50 },
    { description: 'Product B', quantity: 3, price: 30 },
  ],
};

const Invoice = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">Invoice</h1>
      <div className="md:flex md:justify-between md:mb-4">
        <div className="mb-4 md:mb-0">
          <p className="font-semibold">Invoice Number: {invoiceData.invoiceNumber}</p>
          <p className="font-semibold">Date: {invoiceData.date}</p>
        </div>
        <div>
          <p className="font-semibold">Bill To:</p>
          <p>{invoiceData.billingInfo.name}</p>
          <p>{invoiceData.billingInfo.address}</p>
          <p>
            {invoiceData.billingInfo.city}, {invoiceData.billingInfo.zipCode}
          </p>
        </div>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index} className="border">
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">${item.price}</td>
              <td className="border px-4 py-2">${item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p className="text-right">
          <strong>Subtotal: ${calculateSubtotal()}</strong>
        </p>
        <p className="text-right">
          <strong>Tax (10%): ${calculateTax()}</strong>
        </p>
        <p className="text-right">
          <strong>Total: ${calculateTotal()}</strong>
        </p>
      </div>
    </div>
  );
};

function calculateSubtotal() {
  return invoiceData.items.reduce((total, item) => total + item.quantity * item.price, 0);
}

function calculateTax() {
  return calculateSubtotal() * 0.1;
}

function calculateTotal() {
  return calculateSubtotal() + calculateTax();
}

export default Invoice;
