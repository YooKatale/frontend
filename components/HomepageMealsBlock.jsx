"use client";

import React, { useEffect, useState } from "react";
import { API_ORIGIN } from "@config/config";
import HomepageMealSection from "@components/HomepageMealSection";
import { Box } from "@chakra-ui/react";

const MEAL_TYPES = ["breakfast", "lunch", "supper"];

export default function HomepageMealsBlock() {
  const [slotsByType, setSlotsByType] = useState({ breakfast: [], lunch: [], supper: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = (API_ORIGIN || "").replace(/\/api\/?$/, "") || "https://yookatale-server.onrender.com";
    const url = (mealType) => `${base}/api/meal-calendar/slots/public?mealType=${mealType}`;

    let cancelled = false;
    setLoading(true);
    Promise.all(MEAL_TYPES.map((mealType) => fetch(url(mealType)).then((r) => r.json())))
      .then((results) => {
        if (cancelled) return;
        setSlotsByType({
          breakfast: results[0]?.status === "Success" && Array.isArray(results[0]?.data) ? results[0].data : [],
          lunch: results[1]?.status === "Success" && Array.isArray(results[1]?.data) ? results[1].data : [],
          supper: results[2]?.status === "Success" && Array.isArray(results[2]?.data) ? results[2].data : [],
        });
      })
      .catch(() => {
        if (!cancelled) setSlotsByType({ breakfast: [], lunch: [], supper: [] });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <Box bg="white" borderBottom="1px solid" borderColor="gray.100">
      <HomepageMealSection mealType="breakfast" slots={slotsByType.breakfast} loading={loading} />
      <HomepageMealSection mealType="lunch" slots={slotsByType.lunch} loading={loading} />
      <HomepageMealSection mealType="supper" slots={slotsByType.supper} loading={loading} />
    </Box>
  );
}
