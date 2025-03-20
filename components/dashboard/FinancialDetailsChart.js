"use client"

import { PlusCircle } from "lucide-react"
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
import { Button } from "../ui/button"

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
    <Card className="rounded-lg shadow-sm h-full">
      <CardHeader className="border-b flex items-center flex-row justify-between p-3 h-16">
        <CardTitle className="text-xl font-bold">
          Financial Details
        </CardTitle>
        <Button size="sm">
          <PlusCircle/>
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 25, // Increased left margin to accommodate Y-axis label
              top: 20,
              right: 20,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3, 3" />
            {/* Y-axis with "Financial Assets" label */}
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value].label}
            >
              <text
                x={-50} // Position the label to the left of the Y-axis
                y={150} // Center vertically (adjust as needed)
                textAnchor="middle"
                angle={270} // Rotate 270 degrees for vertical text
                style={{ fontSize: "14px", fill: "#666" }}
              >
                Financial Assets
              </text>
            </YAxis>
            {/* X-axis with lakhs formatting */}
            <XAxis
              dataKey="amount"
              type="number"
              axisLine={false}
              tickLine={false}
              tickFormatter={formatToLakhs}
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
              barSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}