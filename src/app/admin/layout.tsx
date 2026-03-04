import type { ReactNode } from "react";
import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { ActivityTracker } from "@/components/admin/activity-tracker";
import { CommandPalette } from "@/components/admin/command-palette";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { CollapsibleSidebar } from "@/components/admin/collapsible-sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | Outlet Media",
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  let displayName = "Admin";
  let activityUserId = "";
  let activityUserEmail = "";

  if (clerkEnabled) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    let user: Awaited<ReturnType<typeof currentUser>> = null;
    try {
      user = await currentUser();
    } catch (err) {
      console.error("[admin/layout] Failed to fetch current user:", err);
    }

    activityUserId = user?.id ?? "";
    activityUserEmail = user?.emailAddresses[0]?.emailAddress ?? "";
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

    if (user) {
      const full = [user.firstName, user.lastName].filter(Boolean).join(" ");
      displayName = full || user.username || "Admin";
    }
  }

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      {activityUserId && <ActivityTracker userId={activityUserId} userEmail={activityUserEmail} />}
      {/* Desktop sidebar */}
      <CollapsibleSidebar clerkEnabled={clerkEnabled} displayName={displayName} />

      {/* Mobile: top bar + main stacked vertically. Desktop: just main (sidebar is beside) */}
      <div className="flex flex-col flex-1 min-w-0">
        <MobileSidebar clerkEnabled={clerkEnabled} displayName={displayName} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <AdminBreadcrumbs />
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
