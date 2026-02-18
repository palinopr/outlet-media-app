import type { ReactNode } from "react";

export const dynamic = "force-dynamic";
import { SidebarContent } from "@/components/admin/sidebar-content";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-col border-r border-border shrink-0">
        <SidebarContent clerkEnabled={clerkEnabled} />
      </aside>

      {/* Mobile sidebar (hamburger + sheet drawer) */}
      <MobileSidebar clerkEnabled={clerkEnabled} />

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
