"use client";

export const fetchCareers = async () => {
    try {
      const response = await fetch("http://localhost:4400/api/careers");
      if (!response.ok) {
        throw new Error("Failed to fetch careers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching careers:", error);
      throw error;
    }
  };