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
import { useLanguage } from "@/context/LanguageContext";

// Custom Active Dot component to draw a line from X-axis to the dot
const CustomActiveDot = (props) => {
  const { cx, cy, chartHeight } = props;
  const xAxisY = chartHeight - 30;
  return (
    <g>
      <line
        x1={cx}
        y1={xAxisY}
        x2={cx}
        y2={cy}
        stroke="#3B82F6"
        strokeWidth={2}
      />
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
  const { t } = useLanguage();
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart configuration with translated labels
  const chartConfig = {
    coverage: {
      label: t("coverage"),
      color: "#3B82F6",
    },
    lifeInsurance: { label: t("lifeInsurance") },
    healthInsurance: { label: t("healthInsurance") },
    vehicleInsurance: { label: t("vehicleInsurance") },
    propertyInsurance: { label: t("propertyInsurance") },
    travelInsurance: { label: t("travelInsurance") },
  };

  const formatToLakhs = (value) => {
    return `${(value / 100000).toFixed(1)}L`;
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
              insuranceType: "lifeInsurance", 
              coverage: data.life_insurance?.sum_assured || 0,
              count: data.life_insurance?.count || 0,
            },
            { 
              insuranceType: "healthInsurance", 
              coverage: data.health_insurance?.sum_assured || 0,
              count: data.health_insurance?.count || 0,
            },
            { 
              insuranceType: "vehicleInsurance", 
              coverage: data.vehicle_insurance?.sum_assured || 0,
              count: data.vehicle_insurance?.count || 0,
            },
            { 
              insuranceType: "propertyInsurance", 
              coverage: data.property_insurance?.sum_assured || 0,
              count: data.property_insurance?.count || 0,
            },
            { 
              insuranceType: "travelInsurance", 
              coverage: data.travel_insurance?.sum_assured || 0,
              count: data.travel_insurance?.count || 0,
            },
          ];
          
          setChartData(formattedData);
        } else {
          throw new Error(t("failedLoadInsurance"));
        }
      } catch (err) {
        console.error("Error fetching insurance data:", err);
        setError(t("failedLoadInsurance"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsuranceData();
  }, [t]);

  if (isLoading) {
    return (
      <Card className="rounded-lg shadow-sm w-full mx-auto">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg sm:text-xl font-bold">
            {t("insuranceOverview")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center">
          {t("loadingInsurance")}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-lg shadow-sm w-full mx-auto">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg sm:text-xl font-bold">
            {t("insuranceOverview")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow-sm w-full mx-auto">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg sm:text-xl font-bold">
          {t("insuranceOverview")}
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
              bottom: 20,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="opacity-50"
            />
            <XAxis
              dataKey="insuranceType"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs sm:text-sm"
              tickFormatter={(value) => chartConfig[value].label}
            />
            <YAxis
              dataKey="coverage"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              tickFormatter={formatToLakhs}
              className="text-xs sm:text-sm"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  hideLabel 
                  formatter={(value, name) => {
                    const dataPoint = chartData.find(d => d[name] === value);
                    return [
                      `₹${formatToLakhs(value)}`,
                      `${t("count")}: ${dataPoint?.count || 0}`,
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