"use client";

import {
  Box,
  Heading,
  Select,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetSellerPerformanceQuery } from "@slices/sellerApiSlice";
import { ThemeColors } from "@constants/constants";

const timePeriods = ["daily", "weekly", "monthly"];

export default function PerformanceGraph() {
  const [period, setPeriod] = useState("weekly");
  const { data: performance, isLoading, error } = useGetSellerPerformanceQuery();

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color={ThemeColors.primaryColor} />
        <Text mt={4} color="gray.500">
          Loading performance data...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error?.data?.message || "Failed to load performance data"}
      </Alert>
    );
  }

  const data = performance?.data || performance || {};

  // Mock time-series data (in production, this would come from the backend)
  // For now, we'll generate sample data based on the period
  const generateTimeSeriesData = () => {
    const days = period === "daily" ? 7 : period === "weekly" ? 12 : 12;
    const chartData = [];
    const baseViews = data.viewCount || 0;
    const baseOrders = data.orderCount || 0;
    const baseRevenue = data.revenue || 0;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * (period === "daily" ? 1 : period === "weekly" ? 7 : 30));
      
      data.push({
        date: period === "daily" 
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : period === "weekly"
          ? `Week ${days - i + 1}`
          : date.toLocaleDateString("en-US", { month: "short" }),
        views: Math.floor(baseViews / days + Math.random() * (baseViews / days / 2)),
        orders: Math.floor(baseOrders / days + Math.random() * (baseOrders / days / 2)),
        revenue: Math.floor(baseRevenue / days + Math.random() * (baseRevenue / days / 2)),
      });
    }
    return chartData;
  };

  const chartData = generateTimeSeriesData();

  const metrics = [
    { label: "Total Views", value: data.viewCount ?? 0, color: ThemeColors.primaryColor },
    { label: "Orders", value: data.orderCount ?? 0, color: "#3182CE" },
    { label: "Revenue (UGX)", value: (data.revenue ?? 0).toLocaleString(), color: "#38A169" },
    { label: "Average Rating", value: (data.averageRating ?? 0).toFixed(1), color: "#D69E2E" },
    { label: "Reviews", value: data.ratingCount ?? 0, color: "#805AD5" },
  ];

  return (
    <VStack spacing={6} align="stretch">
      {/* Header with Period Selector */}
      <HStack justify="space-between" flexWrap="wrap">
        <Heading size="lg" color="gray.800">
          Performance Analytics
        </Heading>
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          maxW="200px"
          bg="white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
      </HStack>

      {/* Key Metrics Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} spacing={4}>
        {metrics.map((metric) => (
          <Card key={metric.label} bg="white">
            <CardBody>
              <Text fontSize="sm" color="gray.500" mb={1}>
                {metric.label}
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={metric.color}>
                {metric.value}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Views Chart */}
      <Card bg="white">
        <CardBody>
          <Heading size="sm" mb={4} color="gray.700">
            Views Over Time
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="views"
                stroke={ThemeColors.primaryColor}
                fill={ThemeColors.primaryColor}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Orders & Revenue Chart */}
      <Card bg="white">
        <CardBody>
          <Heading size="sm" mb={4} color="gray.700">
            Orders & Revenue Over Time
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="#3182CE"
                strokeWidth={2}
                name="Orders"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#38A169"
                strokeWidth={2}
                name="Revenue (UGX)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </VStack>
  );
}
