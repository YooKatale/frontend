"use client";

import { useEffect, useState } from 'react';
import LocationSearchPicker from './LocationSearchPicker';

/**
 * Location Gate Component (Like Glovo)
 * Requires location selection before accessing the app/web
 * Shows immediately on page load if location not set
 */
export default function LocationGate({ children }) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if location is already saved
    const savedLocation = localStorage.getItem('yookatale_delivery_location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setShowLocationPicker(true);
      }
    } else {
      setIsLoading(false);
      setShowLocationPicker(true);
    }
  }, []);

  const handleLocationSelected = (locationData) => {
    // Save location to localStorage
    localStorage.setItem('yookatale_delivery_location', JSON.stringify(locationData));
    setLocation(locationData);
    setShowLocationPicker(false);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (showLocationPicker || !location) {
    return (
      <LocationSearchPicker
        onLocationSelected={handleLocationSelected}
        required={true}
        onClose={() => {
          // Can't close if location is required - reload to retry
          if (!location) {
            window.location.reload();
          }
        }}
      />
    );
  }

  return children;
}
