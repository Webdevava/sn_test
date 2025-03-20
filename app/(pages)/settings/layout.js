import React from "react";

export default function SettingsLayout({ children }) {
  return (
    <main className="flex flex-1">
        <div
          id="page-container"
          className="p-0 w-full flex-1 "
        >
          {children}
        </div>
      
    </main>
  );
}
