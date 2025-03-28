"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Define the chart data for financial details
const chartData = [
  { category: "income", amount: 250000, fill: "var(--color-income)" },
  { category: "expenses", amount: 300000, fill: "var(--color-expenses)" },
  { category: "savings", amount: 150000, fill: "var(--color-savings)" },
  { category: "investments", amount: 100000, fill: "var(--color-investments)" },
]

// Define the chart configuration with labels and colors
const chartConfig = {
  amount: {
    label: "Amount (₹)",
  },
  income: {
    label: "Income",
    color: "#10B981", // Green
  },
  expenses: {
    label: "Expenses",
    color: "#F97316", // Orange
  },
  savings: {
    label: "Savings",
    color: "#3B82F6", // Blue
  },
  investments: {
    label: "Investments",
    color: "#F59E0B", // Yellow
  },
}

export default function FinancialDetailsChart() {
  // Custom function to convert amount to lakhs and format as "XL"
  const formatToLakhs = (value) => {
    const lakhs = value / 100000; // Convert to lakhs
    return `${lakhs.toFixed(1)}L`; // Format to 1 decimal place with "L"
  };

  return (
    <Card className="rounded-lg shadow-sm w-full  mx-auto">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg sm:text-xl font-bold">
          Financial Details
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
              left: 10, // Reduced left margin for responsiveness
              top: 20,
              right: 20,
              bottom: 10
            }}
          >
            <CartesianGrid 
              horizontal={false} 
              strokeDasharray="3, 3" 
              className="opacity-50" 
            />
            {/* Y-axis with "Financial Assets" label */}
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              className="text-xs sm:text-sm"
              tickFormatter={(value) => chartConfig[value].label}
            />
            {/* X-axis with lakhs formatting */}
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
              barSize={40} // Slightly reduced bar size for better responsiveness
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}