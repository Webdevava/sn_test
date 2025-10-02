"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useLanguage } from "@/context/LanguageContext";

// Define the chart data for financial details
const chartData = [
  { category: "income", amount: 250000, fill: "var(--color-income)" },
  { category: "expenses", amount: 300000, fill: "var(--color-expenses)" },
  { category: "savings", amount: 150000, fill: "var(--color-savings)" },
  { category: "investments", amount: 100000, fill: "var(--color-investments)" },
];

// Define the chart configuration with translated labels
const chartConfig = {
  amount: {
    label: "amount",
  },
  income: {
    label: "income",
    color: "#10B981",
  },
  expenses: {
    label: "expenses",
    color: "#F97316",
  },
  savings: {
    label: "savings",
    color: "#3B82F6",
  },
  investments: {
    label: "investments",
    color: "#F59E0B",
  },
};

export default function FinancialDetailsChart() {
  const { t } = useLanguage();

  const formatToLakhs = (value) => {
    const lakhs = value / 100000;
    return `${lakhs.toFixed(1)}L`;
  };

  return (
    <Card className="rounded-lg shadow-sm w-full mx-auto">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg sm:text-xl font-bold">
          {t("financialDetails")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <ChartContainer 
          config={chartConfig} 
          className="w-full h-[250px] sm:h-[350px] md:h-[400px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              top: 20,
              right: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid 
              horizontal={false} 
              strokeDasharray="3, 3" 
              className="opacity-50" 
            />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              className="text-xs sm:text-sm"
              tickFormatter={(value) => t(chartConfig[value].label)}
            />
            <XAxis
              dataKey="amount"
              type="number"
              axisLine={false}
              tickLine={false}
              tickFormatter={formatToLakhs}
              className="text-xs sm:text-sm"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
            />
            <Bar
              dataKey="amount"
              layout="vertical"
              radius={5}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}