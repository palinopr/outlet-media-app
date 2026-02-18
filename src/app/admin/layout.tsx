import type { ReactNode } from "react";

export const dynamic = "force-dynamic";
import { Separator } from "@/components/ui/separator";
import { NavLinks } from "@/components/admin/nav-links";
import { UserAvatar } from "@/components/admin/user-avatar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r border-border shrink-0">
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-xs font-bold">O</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Outlet Media</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ad Operations</p>
          </div>
        </div>
        <Separator />

        {/* Nav */}
        <NavLinks />

        <Separator />

        {/* User */}
        <div className="px-4 py-4 flex items-center gap-3">
          <UserAvatar clerkEnabled={clerkEnabled} />
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground">Outlet Media</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
