"use client";

// import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
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

// Define the chart data for the nominees
const chartData = [
  { nominee: "father", percentage: 40, fill: "var(--color-father)" },
  { nominee: "mother", percentage: 30, fill: "var(--color-mother)" },
  { nominee: "brother", percentage: 20, fill: "var(--color-brother)" },
  { nominee: "sister", percentage: 10, fill: "var(--color-sister)" },
];

// Define the chart configuration with labels and colors
const chartConfig = {
  percentage: {
    label: "Percentage",
  },
  father: {
    label: "Father",
    color: "#10B981", // Green
  },
  mother: {
    label: "Mother",
    color: "#F59E0B", // Yellow
  },
  brother: {
    label: "Brother",
    color: "#F97316", // Orange
  },
  sister: {
    label: "Sister",
    color: "#3B82F6", // Blue
  },
};

export default function NomineeChart() {
  return (
    <Card className="flex flex-col rounded-lg shadow-sm border h-full">
      <CardHeader className="border-b flex items-center flex-row justify-between p-3 h-16">
        <CardTitle className="text-lg sm:text-xl font-bold">
          Nominee Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full sm:flex-1 aspect-square max-h-[250px] sm:max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="nominee"
              innerRadius={90}  // Reduced for smaller screens
              outerRadius={140}  // Reduced for smaller screens
              className="sm:[&_circle]:inner-r-[90] sm:[&_circle]:outer-r-[140] " // Responsive radii
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl sm:text-2xl font-bold"
            >
              4
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs sm:text-xs"
            >
              Total Nominee
            </text>
          </PieChart>
        </ChartContainer>

        <div className="space-y-2 min-w-0 w-full sm:w-auto sm:min-w-40 mt-4 sm:mt-0">
          {chartData.map((item, i) => (
            <div
              key={i}
              className="flex items-center border p-1 sm:p-1.5 rounded-lg"
            >
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2"
                style={{ backgroundColor: chartConfig[item.nominee].color }}
              ></div>
              <span className="text-xs sm:text-sm font-semibold mr-1 truncate">
                {chartConfig[item.nominee].label} {item.percentage}%
              </span>
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}