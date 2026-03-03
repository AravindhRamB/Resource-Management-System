// src/app/(dashboard)/layout.tsx

import DashboardLayout from "@/components/layout/dashboardLayout/dashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  // This simply wraps all child pages with your main dashboard layout
  return <DashboardLayout>{children}</DashboardLayout>;
}