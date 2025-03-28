"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function InsuranceDetailsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const tabRoutes = {
    life: '/personal-details/insurance-details/life',
    health: '/personal-details/insurance-details/health',
    travel: '/personal-details/insurance-details/travel',
    vehicle: '/personal-details/insurance-details/vehicle',
    property: '/personal-details/insurance-details/property',
  }

  const [activeTab, setActiveTab] = useState('health')

  useEffect(() => {
    // Determine active tab based on current pathname
    const determineActiveTab = () => {
      if (pathname.includes('life')) return 'life'
      if (pathname.includes('health')) return 'health'
      if (pathname.includes('travel')) return 'travel'
      if (pathname.includes('vehicle')) return 'vehicle'
      if (pathname.includes('property')) return 'property'
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
      <main className="flex-1 p-0 lg:p-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full h-full flex flex-col"
        >
          <div className="rounded-lg p-2 overflow-hidden">
            <TabsList className="bg-popover flex flex-wrap justify-start gap-2 overflow-x-auto h-fit">
              {Object.keys(tabRoutes).map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-foreground data-[state=active]:text-background min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex-shrink-0 px-2 py-1"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="h-full overflow-auto rounded-lg">{children}</div>
        </Tabs>
      </main>
    </div>
  )
}