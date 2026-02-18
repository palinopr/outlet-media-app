import type { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarContent } from "@/components/admin/sidebar-content";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (clerkEnabled) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    if (role !== "admin") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Access denied</p>
            <p className="text-sm text-muted-foreground">You don&apos;t have permission to access the admin area.</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Dark sidebar */}
      <aside className="dark hidden lg:flex w-60 flex-col bg-sidebar shrink-0 shadow-sm">
        <SidebarContent clerkEnabled={clerkEnabled} />
      </aside>

      {/* Mobile sidebar */}
      <MobileSidebar clerkEnabled={clerkEnabled} />

      {/* Main content — light background with max width and padding */}
      <main className="flex-1 overflow-auto min-w-0">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
