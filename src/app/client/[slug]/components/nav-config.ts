import {
  LayoutDashboard,
  Megaphone,
  Ticket,
  BarChart3,
  Image as ImageIcon,
  FileText,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

export function getClientNavLinks(slug: string): NavLink[] {
  return [
    { href: `/client/${slug}`, label: "Overview", icon: LayoutDashboard, matchExact: true },
    { href: `/client/${slug}/campaigns`, label: "Campaigns", icon: Megaphone },
    { href: `/client/${slug}/events`, label: "Events", icon: Ticket },
    { href: `/client/${slug}/reports`, label: "Reports", icon: BarChart3 },
    { href: `/client/${slug}/assets`, label: "Assets", icon: ImageIcon },
    { href: `/client/${slug}/workspace`, label: "Workspace", icon: FileText },
    { href: `/client/${slug}/settings`, label: "Settings", icon: Settings },
  ];
}

export function isNavActive(link: NavLink, pathname: string): boolean {
  return link.matchExact ? pathname === link.href : pathname.startsWith(link.href);
}
