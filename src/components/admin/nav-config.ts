import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  Users,
  UserCog,
  Settings,
  Activity,
  Bot,
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
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/agents", label: "Agents", icon: Bot },
];
