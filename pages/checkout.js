import React, { useState } from 'react';
import UsePromoCode from './use-promo-code';

const Checkout = () => {
  // State to manage bulk products and promo code application
  const [bulkProducts, setBulkProducts] = useState([
    { id: 1, name: 'Meat', price: 100 },
    { id: 2, name: 'Rice', price: 150 },
    { id: 3, name: 'Irish potato', price: 200 }
  ]);
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);

  // Function to apply promo code
  const applyPromoCode = (code) => {
    // Replace with actual promo code logic
    if (code === 'SAMPLECODE') {
      // Apply discount to bulk products
      const updatedProducts = bulkProducts.map(product => ({
        ...product,
        discountedPrice: product.price * 0.8 // Apply 20% discount for demonstration
      }));
      setBulkProducts(updatedProducts);
      setPromoCodeApplied(true);
    }
  };

  // Function to calculate total price
  const calculateTotal = () => {
    let totalPrice = bulkProducts.reduce((acc, product) => 
      acc + (product.discountedPrice || product.price), 0
    );
    return totalPrice;
  };

  return (
    <div>
      <h1>Checkout</h1>
      <ul>
        {bulkProducts.map(product => (
          <li key={product.id}>
            {product.name} - ${product.discountedPrice || product.price}
          </li>
        ))}
      </ul>
      <p>Total Price: ${calculateTotal()}</p>
      {!promoCodeApplied && <UsePromoCode onApplyPromoCode={applyPromoCode} />}
      {promoCodeApplied && <p>Promo code applied successfully!</p>}
      <button>Place Order</button>
    </div>
  );
};

export default Checkout;
