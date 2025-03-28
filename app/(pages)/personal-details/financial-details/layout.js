"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function FinancialDetailsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabRoutes = {
    bank: "/personal-details/financial-details/bank",
    loan: "/personal-details/financial-details/loan",
    fdrd: "/personal-details/financial-details/fd-rd",
    demat: "/personal-details/financial-details/demat-account",
    stocks: "/personal-details/financial-details/stocks",
    mutual: "/personal-details/financial-details/mutual-funds",
  };

  const [activeTab, setActiveTab] = useState("bank");

  useEffect(() => {
    const determineActiveTab = () => {
      if (pathname.includes("/bank")) return "bank";
      if (pathname.includes("/loan")) return "loan";
      if (pathname.includes("/fd-rd")) return "fdrd";
      if (pathname.includes("/demat-account")) return "demat";
      if (pathname.includes("/stocks")) return "stocks";
      if (pathname.includes("/mutual-funds")) return "mutual";
      return "bank"; // Default tab
    };

    setActiveTab(determineActiveTab());
  }, [pathname]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    router.push(tabRoutes[value]);
  };

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
  );
}