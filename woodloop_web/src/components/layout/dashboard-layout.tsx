import type React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { getRoleNav } from "@/components/layout/role-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const nav = getRoleNav(role);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar items={nav.sidebar} title={nav.title} icon={nav.icon} />

      {/* Main content area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
