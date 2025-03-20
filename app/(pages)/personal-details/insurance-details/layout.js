"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function InsuranceDetailsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const tabRoutes = {
    'health': '/personal-details/insurance-details/health',
    'life': '/personal-details/insurance-details/life',
    'property': '/personal-details/insurance-details/property',
    'travel': '/personal-details/insurance-details/travel',
    'vehicle': '/personal-details/insurance-details/vehicle'
  }

  const [activeTab, setActiveTab] = useState('health')

  useEffect(() => {
    // Determine active tab based on current pathname
    const determineActiveTab = () => {
      if (pathname.includes('health')) return 'health'
      if (pathname.includes('life')) return 'life'
      if (pathname.includes('property')) return 'property'
      if (pathname.includes('travel')) return 'travel'
      if (pathname.includes('vehicle')) return 'vehicle'
      return 'health' // Default tab
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
                value="health"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-24"
              >
                Health
              </TabsTrigger>
              <TabsTrigger
                value="life"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-24"
              >
                Life
              </TabsTrigger>
              <TabsTrigger
                value="property"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-24"
              >
                Property
              </TabsTrigger>
              <TabsTrigger
                value="travel"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-24"
              >
                Travel
              </TabsTrigger>
              <TabsTrigger
                value="vehicle"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-24"
              >
                Vehicle
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="h-full bg-background rounded-lg">
            {children}
          </div>
        </Tabs>
      </main>
    </div>
  )
}