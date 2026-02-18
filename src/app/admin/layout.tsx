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
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-56 flex-col border-r border-border shrink-0">
        <SidebarContent clerkEnabled={clerkEnabled} />
      </aside>
      <MobileSidebar clerkEnabled={clerkEnabled} />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
