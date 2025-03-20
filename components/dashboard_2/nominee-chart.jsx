"use client"
import { useState, useEffect } from "react"
import { Pie, PieChart, Cell } from "recharts"
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
import { Plus, User, X } from "@phosphor-icons/react/dist/ssr"
import { getNomineeOverview } from "@/lib/dashboard-api"

// Chart configuration
const chartConfig = {
  share: {
    label: "Share (%)",
  },
} 
const formatPercentage = (value) => `${value}%`

// Chart colors
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
]

// Generate shades for additional nominees beyond 4
const getColor = (index) => {
  if (index < 4) {
    return CHART_COLORS[index]
  } else {
    // Create shades of the base colors for nominees beyond 4
    const baseColorIndex = index % 4
    const shadeLevel = Math.floor(index / 4)
    // Using HSL opacity instead of color-mix
    return `hsla(var(--chart-${baseColorIndex + 1}), ${100 - shadeLevel * 20}%)`
  }
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="var(--foreground)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Enhanced legend component
const EnhancedLegend = ({ payload }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-lg mx-auto mt-6">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm truncate">{entry.value}</span>
          <span className="ml-auto text-sm text-muted-foreground">{formatPercentage(entry.payload.share)}</span>
        </div>
      ))}
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <div className="grid gap-2">
          <p className="font-semibold">{data.name}</p>
          <p>Share: {formatPercentage(data.share)}</p>
        </div>
      </div>
    )
  }
  return null
}

// Center label component to show total nominee count
const CenterLabel = ({ cx, cy, nominees }) => {
  return (
    <g>
      <text x={cx} y={cy-15} textAnchor="middle" dominantBaseline="middle" className="text-xl font-semibold">
        {nominees}
      </text>
      <text x={cx} y={cy+15} textAnchor="middle" dominantBaseline="middle" className="text-sm text-muted-foreground">
        {nominees === 1 ? 'Nominee' : 'Nominees'}
      </text>
    </g>
  )
}

function NomineeShareChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNomineeData = async () => {
      try {
        setLoading(true)
        const response = await getNomineeOverview()
        
        // Check if response and response.data exist
        if (!response || !response.data) {
          throw new Error("Invalid API response format")
        }

        // Directly use response.data since that's where the array is
        const nominees = response.data
        
        // Transform API data into chart-compatible format
        const transformedData = nominees.map((nominee, index) => ({
          name: `${nominee.first_name} ${nominee.last_name}`,
          share: nominee.asset_detail.reduce((sum, asset) => sum + asset.total_value, 0),
          // Use the getColor function for consistent coloring
          fill: getColor(index),
        }))
        
        setChartData(transformedData)
      } catch (err) {
        setError(err.message)
        console.error("Error details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNomineeData()
  }, [])

  const totalShare = chartData.reduce((sum, item) => sum + item.share, 0)

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6">
      <User size={64} className="text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Nominees Found</h3>
      <p className="text-muted-foreground mb-4">
        You haven't added any nominees yet. Add a nominee to see their distribution.
      </p>
      <Button className="rounded-full px-8">
        Add Nominee <Plus weight="duotone" />
      </Button>
    </div>
  )

  if (loading) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-semibold text-xl">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-semibold text-xl">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="font-semibold text-xl">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {chartData.length === 0 ? (
          <EmptyState />
        ) : (
          <ChartContainer 
            config={chartConfig} 
            className="h-full w-full min-h-[400px]"
          >
            <PieChart>
              <ChartTooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="share"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                innerRadius="40%"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              {/* Add center label showing total nominees */}
              <CenterLabel cx="50%" cy="50%" nominees={chartData.length} />
              <ChartLegend 
                content={<EnhancedLegend />}
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default NomineeShareChart