"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  Bot,
  Users,
  BriefcaseBusiness,
  UserCog,
  Activity,
  Settings,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/assets", label: "Assets", icon: ImageIcon },
  { href: "/admin/crm", label: "CRM", icon: BriefcaseBusiness },
  { href: "/admin/agents", label: "Agents", icon: Bot },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/workspace", label: "Workspace", icon: FileText },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface NavLinksProps {
  collapsed?: boolean;
}

export function NavLinks({ collapsed }: NavLinksProps) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <nav className="px-2 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center justify-center h-10 w-full rounded-lg transition-all duration-150",
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
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    );
  }

  return (
    <nav className="px-2 py-4 space-y-0.5">
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
