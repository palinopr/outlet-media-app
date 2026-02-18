"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-2 py-4 space-y-0.5">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              active
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
