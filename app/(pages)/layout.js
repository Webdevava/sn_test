"use client";
import MainTopbar from "@/components/layouts/main-topbar";
import Topbar from "@/components/layouts/topbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* TopBar - show Topbar on sm screens, MainTopbar on md and above */}
      <div className="block">
        <div className="block sm:hidden">
          <Topbar />
        </div>
        <div className="hidden sm:block">
          <MainTopbar />
        </div>
      </div>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}