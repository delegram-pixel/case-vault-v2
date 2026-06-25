import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary/30 min-h-dvh">
      {/* Fixed sidebar (desktop) */}
      <aside className="bg-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block">
        <SidebarNav />
      </aside>

      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
