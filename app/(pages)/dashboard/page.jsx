"use client";
import DashboardPage from "./dashboard";
import NotificationsPanel from "@/components/dashboard/notification-panel";
import MainTopbar from "@/components/layouts/main-topbar";

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Main content area */}
      <main className="flex flex-1 gap-4 overflow-hidden">
        <div className="flex-1 lg:p-8 p-2 md:p-4 md:mr-[23rem] lg:mr-[23rem] overflow-y-auto">
          <DashboardPage />
        </div>
        <div className="hidden md:block fixed mt-16 top-0 bottom-0 right-0 w-[23rem] p-2">
          <NotificationsPanel className="h-full" />
        </div>
      </main>
      <div className="sm:hidden block">
        <MainTopbar />
      </div>
    </div>
  );
}