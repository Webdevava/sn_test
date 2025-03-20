"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FinancialDetailsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const tabRoutes = {
    'bank': '/personal-details/financial-details/bank',
    'loan': '/personal-details/financial-details/loan',
    'fdrd': '/personal-details/financial-details/fd-rd',
    'demat': '/personal-details/financial-details/demat-account',
    'stocks': '/personal-details/financial-details/stocks',
    'mutual': '/personal-details/financial-details/mutual-funds'
  }
  
  const [activeTab, setActiveTab] = useState('bank')
  
  useEffect(() => {
    // Determine active tab based on current pathname
    const determineActiveTab = () => {
      if (pathname.includes('/bank')) return 'bank'
      if (pathname.includes('/loan')) return 'loan'
      if (pathname.includes('/fd-rd')) return 'fdrd'
      if (pathname.includes('/demat-account')) return 'demat'
      if (pathname.includes('/stocks')) return 'stocks'
      if (pathname.includes('/mutual-funds')) return 'mutual'
      return 'bank' // Default tab
    }
    
    setActiveTab(determineActiveTab())
  }, [pathname])
  
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
          <div className="h-full rounded-lg">
            {children}
          </div>
        </Tabs>
      </main>
    </div>
  )
}