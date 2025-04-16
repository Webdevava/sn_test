"use client"
import { useState, useEffect } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
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
  ChartTooltip,
} from "@/components/ui/chart"
import { User } from "lucide-react"
import { getNomineeOverview } from "@/lib/dashboard-api"

// Chart configuration
const chartConfig = {
  share: {
    label: "Share (%)",
  },
}

// Format number as currency (₹)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

// Custom chart colors
const CHART_COLORS = [
  '#4B5EAA', // Primary blue
  '#34D399', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#10B981', // Emerald
]

// Get color for each nominee
const getColor = (index) => {
  return CHART_COLORS[index % CHART_COLORS.length];
}

// Custom label for the pie slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.65
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  
  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <div className="grid gap-1">
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: data.fill }}
            />
            <p className="font-semibold">{data.name}</p>
          </div>
          <p className="text-sm">Share: <span className="font-semibold">{(data.percent * 100).toFixed(1)}%</span></p>
          <p className="text-sm">Amount: <span className="font-semibold">{formatCurrency(data.actualValue)}</span></p>
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
      <text x={cx} y={cy-10} textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold">
        {nominees}
      </text>
      <text x={cx} y={cy+15} textAnchor="middle" dominantBaseline="middle" className="text-xs text-muted-foreground">
        {nominees === 1 ? 'Nominee' : 'Nominees'}
      </text>
    </g>
  )
}

// Custom legend component
const CustomLegend = ({ payload, totalAmount }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="grid grid-cols-1 gap-2 w-full">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center bg-muted/10 rounded-md p-2">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium truncate">
              {entry.value}
            </span>
            <span className="ml-auto text-xs font-semibold">
              {formatCurrency(entry.payload.actualValue)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-muted w-full text-center">
        <span className="text-xs font-medium text-muted-foreground">Total: </span>
        <span className="text-sm font-bold">{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  )
}

function NomineeShareChart() {
  const [chartData, setChartData] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNomineeData = async () => {
      try {
        setLoading(true)
        const response = await getNomineeOverview()
        
        if (!response || !response.data) {
          throw new Error("Invalid API response format")
        }
        
        const nominees = response.data
        
        // Calculate total estate value
        let total = 0
        nominees.forEach(nominee => {
          nominee.asset_detail.forEach(asset => {
            total += asset.total_value
          })
        })
        
        setTotalAmount(total)
        
        // Transform API data into chart-compatible format
        const transformedData = nominees.map((nominee, index) => {
          const nomineeValue = nominee.asset_detail.reduce((sum, asset) => sum + asset.total_value, 0)
          return {
            name: `${nominee.first_name} ${nominee.last_name}`,
            share: nomineeValue,
            actualValue: nomineeValue,
            percent: nomineeValue / total,
            fill: getColor(index),
          }
        })
        
        setChartData(transformedData)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching nominee data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNomineeData()
  }, [])

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-4">
      <User size={40} className="text-muted-foreground mb-3" />
      <h3 className="text-base font-semibold mb-2">No Nominees Found</h3>
      <p className="text-xs text-muted-foreground">
        You haven't added any nominees yet.
      </p>
    </div>
  )

  if (loading) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-muted rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded mb-2"></div>
            <div className="h-3 w-24 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading nominee data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="p-4">
        <div>
          <CardTitle className="text-lg font-semibold">Nominee Distribution</CardTitle>
          <CardDescription>Estate Share Allocation per Nominee</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        {chartData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:w-3/5">
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip content={<CustomTooltip />} />
                    <Pie
                      data={chartData}
                      dataKey="share"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="100%"
                      innerRadius="55%"
                      label={renderCustomizedLabel}
                      labelLine={false}
                      paddingAngle={0} // No space between sections
                      stroke="none" // No stroke between sections
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <CenterLabel cx="50%" cy="50%" nominees={chartData.length} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="w-full lg:w-2/5 mt-4 lg:mt-0 lg:pl-4">
              <div className="h-full">
                <CustomLegend 
                  payload={chartData.map(item => ({
                    value: item.name,
                    color: item.fill,
                    payload: item
                  }))}
                  totalAmount={totalAmount}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NomineeShareChart