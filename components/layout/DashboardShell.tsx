'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { FloatingNav } from './FloatingNav';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6F5] selection:bg-[#00D084]/25 selection:text-[#0C2B24]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-7 pb-24 sm:pb-28 lg:pb-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Tactile Floating Segmented Navigation Dock */}
      <FloatingNav />
    </div>
  );
}

export default DashboardShell;
