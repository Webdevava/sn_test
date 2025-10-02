"use client";

import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from 'next/navigation';
import GeneralSettings from "./general";
import FaqSection from "./faq";
import Term from "./term";
import Policy from "./policy";
import { useLanguage } from "@/context/LanguageContext";

function TabHandler({ children, t }) {
  return <Suspense fallback={<div>{t("loading")}</div>}>{children}</Suspense>;
}

function TabContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || t("generalSettings");
  
  const handleTabChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };
  
  return (
    <PersonalDetails currentTab={currentTab} onTabChange={handleTabChange} t={t} />
  );
}

function PersonalDetails({ currentTab, onTabChange, t }) {
  return (
    <Card className="bg-popover border-0 shadow-none rounded-none min-h-full p-3 px-5 overflow-hidden h-[calc(100vh)] lg:h-[calc(100vh-4rem)]">
      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="w-full h-full flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">{t("settings")}</h1>
        
        {/* Mobile/Tablet View - Horizontal Tabs */}
        <div className="flex flex-col h-full gap-4 lg:hidden">
          <div className="bg-muted border rounded-lg w-full">
            <TabsList className="bg-muted flex">
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background flex-1 text-center font-semibold w-full px-2 text-sm my-1"
                value={t("generalSettings")}
              >
                {t("generalSettings")}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background flex-1 text-center font-semibold w-full px-2 text-sm my-1"
                value={t("faq")}
              >
                {t("faq")}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background flex-1 text-center font-semibold w-full px-2 text-sm my-1"
                value={t("termsAndConditions")}
              >
                {t("termsAndConditionsShort")}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background flex-1 text-center font-semibold w-full px-2 text-sm my-1"
                value={t("privacyPolicy")}
              >
                {t("privacyPolicyShort")}
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-auto pb-16 max-h-[calc(100vh-14rem)]">
            <TabsContent value={t("generalSettings")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <GeneralSettings />
              </div>
            </TabsContent>
            <TabsContent value={t("faq")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <FaqSection />
              </div>
            </TabsContent>
            <TabsContent value={t("termsAndConditions")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <Term />
              </div>
            </TabsContent>
            <TabsContent value={t("privacyPolicy")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <Policy />
              </div>
            </TabsContent>
          </div>
        </div>
        
        {/* Desktop View - Vertical Tabs */}
        <div className="hidden lg:flex h-full gap-6">
          <div className="bg-muted border rounded-lg p-2 sticky top-0 h-full">
            <TabsList className="bg-muted flex flex-col items-start justify-start h-full w-64 gap-2 p-4">
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value={t("generalSettings")}
              >
                {t("generalSettings")}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value={t("faq")}
              >
                {t("faq")}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value={t("termsAndConditions")}
              >
                {t("termsAndConditions")}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-foreground data-[state=active]:text-background w-full items-start justify-normal font-semibold p-2.5 px-4"
                value={t("privacyPolicy")}
              >
                {t("privacyPolicy")}
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-auto pb-16 max-h-[calc(100vh-8rem)]">
            <TabsContent value={t("generalSettings")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <GeneralSettings />
              </div>
            </TabsContent>
            <TabsContent value={t("faq")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <FaqSection />
              </div>
            </TabsContent>
            <TabsContent value={t("termsAndConditions")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <Term />
              </div>
            </TabsContent>
            <TabsContent value={t("privacyPolicy")} className="w-full m-0 pb-8">
              <div className="h-full rounded-lg">
                <Policy />
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
    <TabHandler t={useLanguage().t}>
      <TabContent />
    </TabHandler>
  );
}