"use client";
import { PlusCircle } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { Button } from "@/components/ui/button";
// Sample data for the insurance chart
const chartData = [
  { insuranceType: "Life Ins", coverage: 50 },
  { insuranceType: "Health Ins", coverage: 60 },
  { insuranceType: "Vehicle Ins", coverage: 75 },
  { insuranceType: "Property Ins", coverage: 65 },
  { insuranceType: "Travel Ins", coverage: 85 },
];
// Chart configuration with labels and colors
const chartConfig = {
  coverage: {
    label: "Coverage",
    color: "#3B82F6", // Blue, matching FinancialDetailsChart
  },
};
// Custom Active Dot component to draw a line from X-axis to the dot
const CustomActiveDot = (props) => {
  const { cx, cy, chartHeight } = props; // Removed unused 'value' variable
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
  // Custom function to format coverage amount (in lakhs)
  const formatToLakhs = (value) => {
    return `${value}L`; // Format with "L"
  };
  return (
    <Card className="rounded-lg shadow-sm h-full">
      <CardHeader className="border-b flex items-center flex-row justify-between p-3 h-16">
        <CardTitle className="text-xl font-bold">
          Insurance Details Overview
        </CardTitle>
        <Button size="sm">
          <PlusCircle />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -10, top: 20, right: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            {/* X-axis with "Insurance Types" label */}
            <XAxis
              dataKey="insuranceType"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {/* Y-axis with "Total Coverage Amount" label */}
            <YAxis
              dataKey="coverage"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              tickFormatter={formatToLakhs}
            />
            <ChartTooltip
              cursor={false} // Disable default cursor line
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => `₹${value}L`}
            />
            <Line
              dataKey="coverage"
              type="linear"
              stroke="var(--color-coverage)"
              strokeWidth={2}
              dot={{ fill: "var(--color-coverage)", r: 4 }}
              activeDot={(props) => <CustomActiveDot {...props} chartHeight={400} />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}