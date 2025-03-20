"use client"
import MainTopbar from "@/components/layouts/main-topbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* TopBar - hidden on small screens with md: breakpoint */}
      <div className="hidden sm:block">
        <MainTopbar/>
      </div>
      
      <main className="flex-1 overflow-auto p-3">
        {children}
      </main>
    </div>
  );
}