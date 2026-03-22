import { FileBarChart2, LayoutDashboard, Megaphone, Ticket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

const BASE_NAV_LINKS: Omit<NavLink, "href">[] = [
  { label: "Overview", icon: LayoutDashboard, matchExact: true },
  { label: "Campaigns", icon: Megaphone },
];

const EVENTS_NAV_LINK: Omit<NavLink, "href"> = {
  label: "Events",
  icon: Ticket,
};

const REPORTS_NAV_LINK: Omit<NavLink, "href"> = {
  label: "Reports",
  icon: FileBarChart2,
};

function routeSegment(label: string): string {
  if (label === "Overview") return "";
  return label.toLowerCase();
}

export function getClientNavLinks(
  slug: string,
  options: { eventsEnabled?: boolean; reportsEnabled?: boolean } = {},
): NavLink[] {
  const links = [...BASE_NAV_LINKS];
  if (options.eventsEnabled) links.push(EVENTS_NAV_LINK);
  if (options.reportsEnabled) links.push(REPORTS_NAV_LINK);

  return links.map((link) => {
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
