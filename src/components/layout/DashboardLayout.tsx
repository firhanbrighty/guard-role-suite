import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-[#32aaff]-border" />
          <div className="flex items-center gap-2 text-sm font-medium">
            Admin Dashboard
          </div>
        </header>
        <main className="flex-1 space-y-4 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};