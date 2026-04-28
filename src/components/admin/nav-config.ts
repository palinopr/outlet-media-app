import {
  LayoutDashboard,
  Megaphone,
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
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
