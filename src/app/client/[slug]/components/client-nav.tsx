"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Ticket,
  BarChart3,
  Scale,
  Settings,
  Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  slug: string;
}

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

export function ClientNav({ slug }: Props) {
  const pathname = usePathname();

  const links: NavLink[] = [
    { href: `/client/${slug}`, label: "Overview", icon: LayoutDashboard, matchExact: true },
    { href: `/client/${slug}/campaigns`, label: "Campaigns", icon: Megaphone },
    { href: `/client/${slug}/events`, label: "Events", icon: Ticket },
    { href: `/client/${slug}/reports`, label: "Reports", icon: BarChart3 },
    { href: `/client/${slug}/compare`, label: "Compare", icon: Scale },
    { href: `/client/${slug}/settings`, label: "Settings", icon: Settings },
  ];

  const isActive = (link: NavLink) =>
    link.matchExact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <nav className="flex-1 px-3 py-1">
      <div className="space-y-1">
        {links.map((link) => {
          const active = isActive(link);
          const Icon = link.icon;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "text-white/90 bg-white/[0.06] border border-white/[0.04]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-cyan-400" : "text-white/30"}`} />
              {link.label}
            </a>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <a
          href="mailto:hello@outletmedia.io"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all"
        >
          <Mail className="h-4 w-4" />
          Contact Support
        </a>
      </div>
    </nav>
  );
}
