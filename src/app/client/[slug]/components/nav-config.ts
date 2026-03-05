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
import type { ServiceKey } from "@/lib/service-registry";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
  requiredService?: ServiceKey | ServiceKey[];
}

const NAV_LINKS: Omit<NavLink, "href">[] = [
  { label: "Overview", icon: LayoutDashboard, matchExact: true },
  { label: "Campaigns", icon: Megaphone, requiredService: "meta_ads" },
  { label: "Events", icon: Ticket, requiredService: ["ticketmaster", "eata"] },
  { label: "Reports", icon: BarChart3, requiredService: "meta_ads" },
  { label: "Assets", icon: ImageIcon, requiredService: "assets" },
  { label: "Workspace", icon: FileText, requiredService: "workspace" },
  { label: "Settings", icon: Settings },
];

function routeSegment(label: string): string {
  if (label === "Overview") return "";
  return label.toLowerCase();
}

export function getClientNavLinks(
  slug: string,
  enabledServices?: ServiceKey[] | null,
): NavLink[] {
  return NAV_LINKS.filter((link) => {
    if (!link.requiredService) return true;
    if (!enabledServices) return true;

    const required = Array.isArray(link.requiredService)
      ? link.requiredService
      : [link.requiredService];
    return required.some((key) => enabledServices.includes(key));
  }).map((link) => {
    const segment = routeSegment(link.label);
    return {
      ...link,
      href: segment ? `/client/${slug}/${segment}` : `/client/${slug}`,
    };
  });
}

export function isNavActive(link: NavLink, pathname: string): boolean {
  return link.matchExact ? pathname === link.href : pathname.startsWith(link.href);
}
