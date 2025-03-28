"use client";
import React, { useState, useEffect } from 'react';
import { 
  CartesianGrid, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis 
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getInsuranceOverview } from "@/lib/dashboard-api";

// Custom Active Dot component to draw a line from X-axis to the dot
const CustomActiveDot = (props) => {
  const { cx, cy, chartHeight } = props;
  // Calculate the Y position of the X-axis (bottom of the chart)
  const xAxisY = chartHeight - 30; // Adjust based on margin.bottom (20) + tick margin
  return (
    <g>
      {/* Vertical line from X-axis to dot */}
      <line
        x1={cx}
        y1={xAxisY} // Start at X-axis level
        x2={cx}
        y2={cy} // End at dot
        stroke="#3B82F6" // Blue line
        strokeWidth={2}
      />
      {/* The active dot itself */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#3B82F6"
        stroke="#fff"
        strokeWidth={2}
      />
    </g>
  );
};

export default function InsuranceChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart configuration with labels and colors
  const chartConfig = {
    coverage: {
      label: "Coverage",
      color: "#3B82F6", // Blue
    },
  };

  // Custom function to format coverage amount (in lakhs)
  const formatToLakhs = (value) => {
    return `${(value / 100000).toFixed(1)}L`; // Convert to lakhs
  };

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        setIsLoading(true);
        const response = await getInsuranceOverview();
        
        if (response?.status && response?.data) {
          const data = response.data;
          const formattedData = [
            { 
              insuranceType: "Life Ins", 
              coverage: data.life_insurance?.sum_assured || 0,
              count: data.life_insurance?.count || 0
            },
            { 
              insuranceType: "Health Ins", 
              coverage: data.health_insurance?.sum_assured || 0,
              count: data.health_insurance?.count || 0
            },
            { 
              insuranceType: "Vehicle Ins", 
              coverage: data.vehicle_insurance?.sum_assured || 0,
              count: data.vehicle_insurance?.count || 0
            },
            { 
              insuranceType: "Property Ins", 
              coverage: data.property_insurance?.sum_assured || 0,
              count: data.property_insurance?.count || 0
            },
            { 
              insuranceType: "Travel Ins", 
              coverage: data.travel_insurance?.sum_assured || 0,
              count: data.travel_insurance?.count || 0
            },
          ];
          
          setChartData(formattedData);
        } else {
          throw new Error("Failed to fetch insurance overview");
        }
      } catch (err) {
        console.error("Error fetching insurance data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsuranceData();
  }, []);

  if (isLoading) {
    return (
      <Card className="rounded-lg shadow-sm w-full mx-auto">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg sm:text-xl font-bold">
            Insurance Details Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center">
          Loading insurance data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-lg shadow-sm w-full mx-auto">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg sm:text-xl font-bold">
            Insurance Details Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-red-500">
          Failed to load insurance data. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow-sm w-full mx-auto">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg sm:text-xl font-bold">
          Insurance Details Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <ChartContainer
          config={chartConfig}
          className="w-full h-[250px] sm:h-[350px] md:h-[400px]"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -10,
              top: 20,
              right: 20,
              bottom: 20
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="opacity-50"
            />
            {/* X-axis with "Insurance Types" label */}
            <XAxis
              dataKey="insuranceType"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs sm:text-sm"
            />
            {/* Y-axis with "Total Coverage Amount" label */}
            <YAxis
              dataKey="coverage"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              tickFormatter={formatToLakhs}
              className="text-xs sm:text-sm"
            />
            <ChartTooltip
              cursor={false} // Disable default cursor line
              content={
                <ChartTooltipContent 
                  hideLabel 
                  formatter={(value, name) => {
                    const dataPoint = chartData.find(d => d[name] === value);
                    return [
                      `₹${formatToLakhs(value)}`,
                      `Count: ${dataPoint?.count || 0}`
                    ];
                  }}
                />
              }
            />
            <Line
              dataKey="coverage"
              type="linear"
              stroke="var(--color-coverage)"
              strokeWidth={2}
              dot={{ fill: "var(--color-coverage)", r: 4 }}
              activeDot={(props) => (
                <CustomActiveDot
                  {...props}
                  chartHeight={400}
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}