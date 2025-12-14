'use client';

import { useEffect, useState } from 'react';
import './styles.css';


const AdvertCard = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // // Check if blur should be enabled
    // const blurEnabled =false;
    setIsEnabled(false);
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="payment-blur-overlay">
      {/* <div className="payment-blur-content"> */}
        {/* <div className="payment-blur-message"> */}
          {/* <h2>🔒 Access Restricted</h2>...... */}
          {/* <p>Advertising</p> */}
          {/* <p className="payment-blur-subtitle">
            ....................................................
          </p> */}
        {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default AdvertCard;

