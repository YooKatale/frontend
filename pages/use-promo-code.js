import React, { useState } from 'react';
import axios from 'axios';
import './UsePromoCode.css';

const UsePromoCode = ({ onApplyPromoCode }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const useCode = async () => {
    try {
      const response = await axios.post('/api/use-code', { code });
      setMessage(response.data.message);
      } catch (error) {
      setMessage(error.response.data.message);
      }
      };

  return (
    <div className="use-promo-code-container">
      <h1>Use Promo Code</h1>
      <div className="input-container">
        <input 
          type="text" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder="Enter promo code"
          className="promo-input"
        />
        <button onClick={useCode} className="use-button">Use Code</button>
      </div>
      <p className="message">{message}</p>
    </div>
  );
};

export default UsePromoCode;
