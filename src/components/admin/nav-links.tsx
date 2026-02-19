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
  UserCog,
} from "lucide-react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/agents", label: "Agents", icon: Bot },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/users", label: "Users", icon: UserCog },
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
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
              active
                ? "bg-white/[0.08] text-white font-medium shadow-sm"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                active ? "text-cyan-400" : "text-white/40"
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
