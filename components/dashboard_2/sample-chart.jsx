"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Plus } from "@phosphor-icons/react/dist/ssr"

const chartData = [
  { month: "January", assets: 1.8, liabilities: 0.8 },
  { month: "February", assets: 3.0, liabilities: 1.2 },
  { month: "March", assets: 2.5, liabilities: 1.0 },
  { month: "April", assets: 3.2, liabilities: 1.9 },
  { month: "May", assets: 4.0, liabilities: 1.3 },
  { month: "June", assets: 4.5, liabilities: 1.2 },
]

const chartConfig = {
  assets: {
    label: "Assets",
    color: "color-mix(in oklch, var(--primary) 75%, transparent)", // 75% opacity
  },
  liabilities: {
    label: "Liabilities",
    color: "color-mix(in oklch, var(--primary) 25%, transparent)", // 25% opacity
  },
}

// Format number to lakhs (L) format
const formatToLakhs = (value) => {
  return `${value}L`
}

// Custom tooltip content component
const CustomTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const netWorth = (data.assets - data.liabilities).toFixed(2);
    
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="font-medium">{data.month}</p>
        <p className="text-sm text-primary">Assets: ₹{data.assets}L</p>
        <p className="text-sm text-primary-light">Liabilities: ₹{data.liabilities}L</p>
        <p className="text-sm font-semibold border-t pt-1 mt-1">Net Worth: ₹{netWorth}L</p>
      </div>
    );
  }
  
  return null;
};

function FinancialWorthChart() {
  return (
    <Card className={'h-full w-full'}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={'font-semibold text-xl'}>Financial Worth Analysis</CardTitle>
          <CardDescription>Monthly Assets vs Liabilities</CardDescription>
        </div>
        <Button  className={'rounded-full px-8'}>Add Platform <Plus weight="duotone"/></Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={formatToLakhs}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<CustomTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="assets"
              stackId="a"
              fill="var(--color-assets)"
              radius={16}
            >
              <LabelList
                dataKey="assets"
                position="center"
                className="fill-foreground"
                fontSize={16}
                fontWeight={600}
                formatter={(value) => `${value}L`}
              />
            </Bar>
            <Bar
              dataKey="liabilities"
              stackId="a"
              fill="var(--color-liabilities)"
              radius={16}
            >
              <LabelList
                dataKey="liabilities"
                position="center"
                className="fill-foreground"
                fontSize={16}
                fontWeight={600}
                formatter={(value) => `${value}L`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default FinancialWorthChart