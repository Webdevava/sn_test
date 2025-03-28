"use client"
import { useState, useEffect } from "react"
import { Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { User } from "lucide-react"
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
      className="text-xs sm:text-sm font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Enhanced legend component
const EnhancedLegend = ({ payload }) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-lg mx-auto mt-4 sm:mt-6 px-2">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs sm:text-sm truncate">{entry.value}</span>
          <span className="ml-auto text-xs sm:text-sm text-muted-foreground">{formatPercentage(entry.payload.share)}</span>
        </div>
      ))}
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-2 sm:p-3 shadow-lg">
        <div className="grid gap-1 sm:gap-2">
          <p className="font-semibold text-xs sm:text-sm">{data.name}</p>
          <p className="text-xs sm:text-sm">Share: {formatPercentage(data.share)}</p>
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
      <text x={cx} y={cy-10} textAnchor="middle" dominantBaseline="middle" className="text-base sm:text-xl font-semibold">
        {nominees}
      </text>
      <text x={cx} y={cy+10} textAnchor="middle" dominantBaseline="middle" className="text-xs sm:text-sm text-muted-foreground">
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

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center p-4">
      <User size={48} className="text-muted-foreground mb-4" />
      <h3 className="text-base sm:text-lg font-semibold mb-2">No Nominees Found</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
        You haven't added any nominees yet. Add a nominee to see their distribution.
      </p>
    </div>
  )

  if (loading) {
    return (
      <Card className="w-full  mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[380px]">
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full  mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[380px]">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="p-4">
        <div>
          <CardTitle className="text-lg sm:text-xl font-semibold">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        {chartData.length === 0 ? (
          <EmptyState />
        ) : (
          <ChartContainer 
            config={chartConfig} 
            className="h-[250px] sm:h-[350px] md:h-[400px] w-full"
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