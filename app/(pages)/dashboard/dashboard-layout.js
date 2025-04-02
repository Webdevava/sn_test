"use client";

import React from "react";
import MainTopbar from "@/components/layouts/main-topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Topbar - visible at bottom for mobile */}
      <div className="sm:hidden">
        <MainTopbar />
      </div>
    </div>
  );
}