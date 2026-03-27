import { Megaphone, Ticket } from "lucide-react";
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

const EVENTS_NAV_LINK: Omit<NavLink, "href"> = {
  label: "Events",
  icon: Ticket,
};

export function getClientNavLinks(
  slug: string,
  options: { eventsEnabled?: boolean } = {},
): NavLink[] {
  const links = [...BASE_NAV_LINKS];
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
