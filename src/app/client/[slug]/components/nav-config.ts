import { BarChart3, Megaphone, Ticket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

const BASE_NAV_LINKS: Omit<NavLink, "href">[] = [
  { label: "Campaigns", icon: Megaphone },
];

const REPORTS_NAV_LINK: Omit<NavLink, "href"> = {
  label: "Reports",
  icon: BarChart3,
};

const EVENTS_NAV_LINK: Omit<NavLink, "href"> = {
  label: "Events",
  icon: Ticket,
};

export type ClientNavOptions = {
  eventsEnabled?: boolean;
  reportsEnabled?: boolean;
};

export function getClientNavLinks(
  slug: string,
  options: ClientNavOptions = {},
): NavLink[] {
  const links = [...BASE_NAV_LINKS];
  if (options.reportsEnabled) links.push(REPORTS_NAV_LINK);
  if (options.eventsEnabled) links.push(EVENTS_NAV_LINK);

  return links.map((link) => {
    return {
      ...link,
      href: `/client/${slug}/${link.label.toLowerCase()}`,
    };
  });
}

export function isNavActive(link: NavLink, pathname: string): boolean {
  return link.matchExact ? pathname === link.href : pathname.startsWith(link.href);
}
