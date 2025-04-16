'use client';
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/dashboard/SummaryCards";
import NomineeChart from "@/components/dashboard/NomineeChart";
import FinancialDetailsChart from "@/components/dashboard/FinancialDetailsChart";
import InsuranceChart from "@/components/dashboard/InsuranceChart";
import UploadedDocs from "@/components/dashboard/UploadedDocs";
import NomineeShareChart from "@/components/dashboard_2/nominee-chart";
import Cookies from 'js-cookie';
import { getProfileDetail } from "@/lib/profile-api";

export default function DashboardPage() {
  // State to hold profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    isLoading: true,
  });

  useEffect(() => {
    // Define async function inside useEffect
    async function loadProfile() {
      try {
        // Directly call the API
        const response = await getProfileDetail();
        console.log("API Response:", response);
        
        // The response itself is the data object we need
        const userData = response;
        
        if (userData && userData.first_name) {
          // Direct access to the properties from response
          setProfileData({
            firstName: userData.first_name,
            lastName: userData.last_name || "",
            isLoading: false
          });
          
          console.log("Setting profile to:", userData.first_name, userData.last_name);
        } else {
          console.error("API response doesn't contain name fields:", userData);
          setProfileData({
            firstName: "John", 
            lastName: "Doe",
            isLoading: false
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileData({
          firstName: "John", 
          lastName: "Doe",
          isLoading: false
        });
      }
    }
    
    // Call the async function
    loadProfile();
  }, []);

  // Mock data for the financial summary
  const financialSummary = {
    netWorth: 500000,
    totalAssets: 200000,
    totalLiabilities: 300000,
    nominees: 4,
    financialAssets: 6,
    policies: 4,
  };

  // Mock data for the nominee chart
  const nomineeData = [
    { name: "Father", value: 40, color: "#4ade80" },
    { name: "Mother", value: 30, color: "#facc15" },
    { name: "Brother", value: 20, color: "#fb923c" },
    { name: "Sister", value: 10, color: "#3b82f6" },
  ];

  // Mock data for financial details chart
  const financialDetailsData = [
    { name: "Bank", value: 200000, color: "#4ade80" },
    { name: "FD/RD", value: 300000, color: "#f87171" },
    { name: "Demat Account", value: 250000, color: "#67e8f9" },
    { name: "Stocks", value: 800000, color: "#3b82f6" },
    { name: "Mutual Funds", value: 450000, color: "#a855f7" },
  ];

  // Mock data for insurance chart
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
                `Welcome, ${profileData.firstName || "John"} ${profileData.lastName || "Doe"} 👋`
              )}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Manage your Family, Financial, and Insurance details in one place. Stay secure and in control!
            </p>
          </div>
          <div className="flex space-x-2">
            <Tabs defaultValue="month" className="w-fit">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
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

        {/* Charts Section */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 order-1">
            <NomineeShareChart />
          </div>
          <div className="lg:col-span-2 order-2">
            <FinancialDetailsChart data={financialDetailsData} />
          </div>
        </div> */}

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