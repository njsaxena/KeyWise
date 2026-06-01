import type { ReactNode } from "react";
import DashboardTopNav from "@/components/dashboard/DashboardTopNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardTopNav />
      <main className="bg-background">{children}</main>
    </div>
  );
}
