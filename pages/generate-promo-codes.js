import React, { useState } from 'react';
import axios from 'axios';
import './GeneratePromoCodes.css';

const GeneratePromoCodes = () => {
  const [count, setCount] = useState(50);
  const [codes, setCodes] = useState([]);

  const generateCodes = async () => {
    try {
      const response = await axios.post('/api/generate-codes', { count });
      setCodes(response.data.codes);
    } catch (error) {
      console.error('Error generating codes:', error);
    }
  };

  return (
    <div className="container">
      <h1>Generate Promo Codes</h1>
      <div className="controls">
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          min="1"
          className="count-input"
        />
        <button onClick={generateCodes} className="generate-button">
          Generate {count} Promo Codes
        </button>
      </div>
      <ul className="codes-list">
        {codes.map((code, index) => (
          <li key={index} className="code-item">
            {code.code}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GeneratePromoCodes;
