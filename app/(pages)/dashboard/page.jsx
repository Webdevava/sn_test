"use client";
import DashboardPage from "./dashboard";
import NotificationsPanel from "@/components/dashboard/notification-panel";
import MainTopbar from "@/components/layouts/main-topbar";

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto">
      {/* Topbar: At bottom on small screens, at top on larger screens */}
      {/* <div className="sm:hidden block sm:order-last">
        <MainTopbar />
      </div> */}
      
      {/* Main content area */}
      <main className="flex flex-1 gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2 lg:p-8">
          <DashboardPage />
        </div>
        <div className="hidden md:block lg:pl-0 lg:p-4 overflow-y-auto max-h-full">
          <NotificationsPanel className="h-full" />
        </div>
      </main>

      <div className="sm:hidden block sm:order-first">
        <MainTopbar />
      </div>
    </div>
  );
}