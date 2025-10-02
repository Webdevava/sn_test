"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/dashboard/SummaryCards";
import InsuranceChart from "@/components/dashboard/InsuranceChart";
import UploadedDocs from "@/components/dashboard/UploadedDocs";
import NomineeShareChart from "@/components/dashboard_2/nominee-chart";
import { getProfileDetail } from "@/lib/profile-api";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage(); // ✅ use translator function
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    isLoading: true,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfileDetail();
        const userData = response;

        if (userData && userData.first_name) {
          setProfileData({
            firstName: userData.first_name,
            lastName: userData.last_name || "",
            isLoading: false,
          });
        } else {
          setProfileData({
            firstName: "John",
            lastName: "Doe",
            isLoading: false,
          });
        }
      } catch (error) {
        setProfileData({
          firstName: "John",
          lastName: "Doe",
          isLoading: false,
        });
      }
    }
    loadProfile();
  }, []);

  // Mock data
  const financialSummary = {
    netWorth: 500000,
    totalAssets: 200000,
    totalLiabilities: 300000,
    nominees: 4,
    financialAssets: 6,
    policies: 4,
  };

  const insuranceData = [
    { name: "Life Insurance", value: 100 },
    { name: "Health Insurance", value: 75 },
    { name: "Vehicle Insurance", value: 50 },
    { name: "Property Insurance", value: 25 },
    { name: "Travel Insurance", value: 50 },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {profileData.isLoading ? (
                <span className="inline-block w-40 h-6 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                `${t("welcome")}, ${profileData.firstName || "John"} ${
                  profileData.lastName || "Doe"
                } 👋`
              )}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {t("dashboardSubtext")}
            </p>
          </div>
          <div className="flex space-x-2">
            <Tabs defaultValue="month" className="w-fit">
              <TabsList>
                <TabsTrigger value="month">{t("month")}</TabsTrigger>
                <TabsTrigger value="quarter">{t("quarter")}</TabsTrigger>
                <TabsTrigger value="year">{t("year")}</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6">
          <SummaryCards financialSummary={financialSummary} />
        </div>

        {/* Nominee Share Chart */}
        <div className="lg:col-span-1 order-1 mb-4">
          <NomineeShareChart />
        </div>

        {/* Insurance and Documents Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="order-1">
            <InsuranceChart data={insuranceData} />
          </div>
          <div className="order-2">
            <UploadedDocs />
          </div>
        </div>
      </div>
    </div>
  );
}
