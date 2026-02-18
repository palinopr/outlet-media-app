import type { ReactNode } from "react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  Bot,
  Users,
} from "lucide-react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/agents", label: "Agents", icon: Bot },
  { href: "/admin/clients", label: "Clients", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r">
        <div className="px-4 py-5">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Outlet Media
          </p>
        </div>
        <Separator />
        <nav className="flex-1 px-2 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="px-4 py-4 flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
