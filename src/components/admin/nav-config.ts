import {
  LayoutDashboard,
  BarChart3,
  Megaphone,
  CalendarDays,
  BriefcaseBusiness,
  BadgeCheck,
  BellRing,
  MessageSquareMore,
  Bot,
  Users,
  UserCog,
  Activity,
  Settings,
  FileText,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/assets", label: "Assets", icon: ImageIcon },
  { href: "/admin/crm", label: "CRM", icon: BriefcaseBusiness },
  { href: "/admin/approvals", label: "Approvals", icon: BadgeCheck },
  { href: "/admin/notifications", label: "Notifications", icon: BellRing },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquareMore },
  { href: "/admin/agents", label: "Agents", icon: Bot },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/workspace", label: "Workspace", icon: FileText },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
