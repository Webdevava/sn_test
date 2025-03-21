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
  
  // Scroll to active tab when tab changes
  useEffect(() => {
    const activeElement = document.querySelector(`[data-state="active"]`)
    if (activeElement) {
      // Ensure the active tab is visible by scrolling to it
      const tabsList = document.querySelector('[role="tablist"]')
      if (tabsList) {
        const tabsRect = tabsList.getBoundingClientRect()
        const activeRect = activeElement.getBoundingClientRect()
        
        // Calculate the scroll position to center the active tab
        const scrollPos = activeElement.offsetLeft - tabsList.offsetLeft - (tabsRect.width / 2) + (activeRect.width / 2)
        
        tabsList.scrollLeft = Math.max(0, scrollPos)
      }
    }
  }, [activeTab])
  
  return (
    <div className="flex w-full h-full overflow-hidden">
      <main className="flex-1 p-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full h-full flex flex-col"
        >
          <div className="rounded-lg p-2 overflow-hidden">
            <TabsList className="bg-popover w-full overflow-x-auto flex no-scrollbar whitespace-nowrap">
              <TabsTrigger
                value="bank"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-16 sm:min-w-24 flex-shrink-0"
              >
                Bank
              </TabsTrigger>
              <TabsTrigger
                value="loan"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-16 sm:min-w-24 flex-shrink-0"
              >
                Loan
              </TabsTrigger>
              <TabsTrigger
                value="fdrd"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-16 sm:min-w-24 flex-shrink-0"
              >
                FDRD
              </TabsTrigger>
              <TabsTrigger
                value="demat"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-16 sm:min-w-24 flex-shrink-0"
              >
                Demat
              </TabsTrigger>
              <TabsTrigger
                value="stocks"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-16 sm:min-w-24 flex-shrink-0"
              >
                Stocks
              </TabsTrigger>
              <TabsTrigger
                value="mutual"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-16 sm:min-w-24 flex-shrink-0"
              >
                Mutual
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Add custom scrollbar hiding styles */}
          <style jsx global>{`
            .no-scrollbar {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;  /* Chrome, Safari and Opera */
            }
          `}</style>
          
          <div className="h-full overflow-auto rounded-lg">
            {children}
          </div>
        </Tabs>
      </main>
    </div>
  )
}