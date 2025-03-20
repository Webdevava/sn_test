'use client'

import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from 'next/navigation';
import GeneralSettings from "./general";
import FaqSection from "./faq";
import Term from "./term";
import Policy from "./policy";

function TabHandler({ children }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

function TabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentTab = searchParams.get('tab') || 'General Settings';

  const handleTabChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <PersonalDetails currentTab={currentTab} onTabChange={handleTabChange} />
  );
}

function PersonalDetails({ currentTab, onTabChange }) {
  return (
    <Card className="bg-popover border-0 shadow-none rounded-none min-h-full p-3 px-5 overflow-hidden h-[calc(100vh)] lg:h-[calc(100vh-4rem)]">
      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="w-full h-full flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex h-full gap-6">
          {/* Fixed TabsList */}
          <div className="bg-muted border rounded-lg p-2 sticky top-0 h-full ">
            <TabsList className="bg-muted flex flex-col items-start justify-start h-full w-64 gap-2 p-4">
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value="General Settings"
              >
                General Settings
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value="FAQ"
              >
                FAQ
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value="Terms & Conditions"
              >
                Terms & Conditions
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value="Privacy Policy"
              >
                Privacy Policy
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable TabsContent */}
          <div className="flex-1 overflow-auto max-h-[calc(100vh-8rem)]">
            <TabsContent value="General Settings" className="w-full m-0">
              <div className="h-full rounded-lg">
                <GeneralSettings />
              </div>
            </TabsContent>
            <TabsContent value="FAQ" className="w-full m-0">
              <div className="h-full rounded-lg">
                <FaqSection/>
              </div>
            </TabsContent>
            <TabsContent value="Terms & Conditions" className="w-full m-0">
              <div className="h-full rounded-lg">
                <Term/>
              </div>
            </TabsContent>
            <TabsContent value="Privacy Policy" className="w-full m-0">
              <div className="h-full rounded-lg">
                <Policy/>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Card>
  );
}

export default function Settings() {
  return (
    <TabHandler>
      <TabContent />
    </TabHandler>
  );
}