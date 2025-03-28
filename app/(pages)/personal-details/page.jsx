"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MainTopbar from "@/components/layouts/main-topbar";
import ProfileCard from "@/components/cards/sm_profile"; // Adjust the path as needed
import { Card } from "@/components/ui/card";

export default function PersonalDetails() {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openFinancial, setOpenFinancial] = useState(false);
  const [openInsurance, setOpenInsurance] = useState(false);

  // Main routes
  const mainRoutes = {
    "family-details": {
      path: "/personal-details/family-details",
      label: "Family Details",
    },
  };

  // Financial subitems
  const financialSubitems = {
    bank: {
      path: "/personal-details/financial-details/bank",
      label: "Bank Accounts",
    },
    loan: {
      path: "/personal-details/financial-details/loan",
      label: "Loans",
    },
    fdrd: {
      path: "/personal-details/financial-details/fd-rd",
      label: "FD/RD",
    },
    demat: {
      path: "/personal-details/financial-details/demat-account",
      label: "Demat Account",
    },
    stocks: {
      path: "/personal-details/financial-details/stocks",
      label: "Stocks",
    },
    mutual: {
      path: "/personal-details/financial-details/mutual-funds",
      label: "Mutual Funds",
    },
  };

  // Insurance subitems
  const insuranceSubitems = {
    health: {
      path: "/personal-details/insurance-details/health",
      label: "Health",
    },
    life: {
      path: "/personal-details/insurance-details/life",
      label: "Life",
    },
    property: {
      path: "/personal-details/insurance-details/property",
      label: "Property",
    },
    travel: {
      path: "/personal-details/insurance-details/travel",
      label: "Travel",
    },
    vehicle: {
      path: "/personal-details/insurance-details/vehicle",
      label: "Vehicle",
    },
  };

  // Redirect to default tab on desktop only
  useEffect(() => {
    if (isDesktop) {
      router.push("/personal-details/family-details");
    }
  }, [isDesktop, router]);

  // If we're on desktop, don't render the content
  // The redirection will happen via the useEffect
  if (isDesktop) {
    return null;
  }

  // On mobile, show sidebar above buttons with topbar at bottom
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Main content */}
      <div className="flex-1 w-full p-2 lg:p-6 order-first overflow-y-auto">
        {/* Sidebar on small screens */}
        <div className=" mb-6">
          
        <ProfileCard/>
        </div>

        <div className="w-full max-w-xl space-y-4 mx-auto">
          {/* Family Details Button with ChevronRight */}
          {Object.entries(mainRoutes).map(([key, { path, label }]) => (
            <Button
              key={key}
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push(path)}
            >
              {label}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ))}

          {/* Financial Details Collapsible */}
          <Collapsible
            open={openFinancial}
            onOpenChange={setOpenFinancial}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Financial Details
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                    openFinancial ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-popover rounded-b-lg overflow-hidden mt-1">
              <div className="p-2 space-y-2">
                {Object.entries(financialSubitems).map(([key, { path, label }]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => router.push(path)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Insurance Details Collapsible */}
          <Collapsible
            open={openInsurance}
            onOpenChange={setOpenInsurance}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Insurance Details
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                    openInsurance ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-popover rounded-b-lg overflow-hidden mt-1">
              <div className="p-2 space-y-2">
                {Object.entries(insuranceSubitems).map(([key, { path, label }]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => router.push(path)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Topbar: At bottom on mobile */}
      <div className="order-last absolute w-full bottom-0 -left-1">
        <MainTopbar />
      </div>
    </div>
  );
}