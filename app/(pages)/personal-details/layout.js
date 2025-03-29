"use client"
import PersonalSidebar from "@/components/layouts/personal-sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function PersonalDetailsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const tabRoutes = {
    'family-details': {
      path: '/personal-details/family-details',
      label: 'Family Details'
    },
    'financial-details': {
      path: '/personal-details/financial-details',
      label: 'Financial Details'
    },
    'insurance-details': {
      path: '/personal-details/insurance-details',
      label: 'Insurance Details'
    }
  }
  
  const [activeTab, setActiveTab] = useState('family-details')
  
  const isMainRoute = pathname === '/personal-details'
  const isChildRoute = !isMainRoute
  
  useEffect(() => {
    // Determine active tab based on current pathname
    const determineActiveTab = () => {
      if (pathname.includes('family-details')) return 'family-details'
      if (pathname.includes('financial-details')) return 'financial-details'
      if (pathname.includes('insurance-details')) return 'insurance-details'
      return 'family-details' // Default tab
    }
    
    setActiveTab(determineActiveTab())
  }, [pathname])
  
  const handleTabChange = (value) => {
    setActiveTab(value)
    router.push(tabRoutes[value].path)
  }
  
  const handleBackClick = () => {
    router.push('/personal-details')
  }
  
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {isChildRoute && (
        <div className="md:hidden flex items-center p-4 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium">{tabRoutes[activeTab]?.label || 'Details'}</h2>
        </div>
      )}
      
      <div className="flex w-full h-full overflow-hidden p-2">
        <div className="hidden md:block">
          <PersonalSidebar />
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:ml-3 lg:ml-4 bg-card rounded-lg border">
          {isMainRoute ? (
            <div className="h-full">{children}</div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full h-full flex flex-col"
            >
              <div className="hidden md:block bg-popover rounded-lg p-2">
                <TabsList className="bg-popover w-fit">
                  {Object.entries(tabRoutes).map(([key, { label }]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="data-[state=active]:bg-foreground data-[state=active]:text-background w-fit"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <div className="h-full bg-popover overflow-auto rounded-lg mt-4">
                {children}
              </div>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}