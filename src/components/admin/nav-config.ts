import {
  LayoutDashboard,
  Megaphone,
  BarChart3,
  CalendarDays,
  Users,
  UserCog,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
