"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FinancialDetailsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Map routes to tab values
  const tabRoutes = {
    'bank': '/personal-details/financial-details/bank',
    'loan': '/personal-details/financial-details/loan',
    'fdrd': '/personal-details/financial-details/fd-rd',
    'demat': '/personal-details/financial-details/demat-account',
    'stocks': '/personal-details/financial-details/stocks',
    'mutual': '/personal-details/financial-details/mutual-funds'
  }
  
  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname.includes('/bank')) return 'bank'
    if (pathname.includes('/loan')) return 'loan'
    if (pathname.includes('/fd-rd')) return 'fdrd'  // Fixed this line to match the actual URL
    if (pathname.includes('/demat-account')) return 'demat'
    if (pathname.includes('/stocks')) return 'stocks'
    if (pathname.includes('/mutual-funds')) return 'mutual'
    return 'bank' // Default tab
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTab())
  
  // Sync tab with URL on mount and when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [pathname])
  
  // Handle tab change and redirect
  const handleTabChange = (value) => {
    setActiveTab(value)
    router.push(tabRoutes[value])
  }
  
  return (
    <div className="flex w-full h-full overflow-hidden">
      <main className="flex-1 overflow-auto p-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full h-full flex flex-col"
        >
          <div className="rounded-lg p-2">
            <TabsList className="bg-popover w-fit">
              <TabsTrigger
                value="bank"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-fit min-w-24"
              >
                Bank
              </TabsTrigger>
              <TabsTrigger
                value="loan"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-fit min-w-24"
              >
                Loan
              </TabsTrigger>
              <TabsTrigger
                value="fdrd"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-fit min-w-24"
              >
                FDRD
              </TabsTrigger>
              <TabsTrigger
                value="demat"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-fit min-w-24"
              >
                Demat
              </TabsTrigger>
              <TabsTrigger
                value="stocks"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-fit min-w-24"
              >
                Stocks
              </TabsTrigger>
              <TabsTrigger
                value="mutual"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-fit min-w-24"
              >
                Mutual
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Content area - renders children regardless of tab */}
          <div className="h-full rounded-lg">
            {children}
          </div>
        </Tabs>
      </main>
    </div>
  )
}