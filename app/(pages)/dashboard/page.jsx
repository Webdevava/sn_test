"use client";

import DashboardPage from "./dashboard";
import NotificationsPanel from "@/components/dashboard/notification-panel";

export default function Dashboard() {
  return (
    <main className="flex w-full gap-4 h-[94vh] overflow-hidden">
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <DashboardPage />
      </div>
      <div className="pl-0 p-4">
        <NotificationsPanel className="h-full" />
      </div>
    </main>
  );
}