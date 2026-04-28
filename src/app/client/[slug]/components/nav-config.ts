import { Megaphone } from "lucide-react";
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

export function getClientNavLinks(slug: string): NavLink[] {
  return BASE_NAV_LINKS.map((link) => ({
    ...link,
    href: `/client/${slug}/${link.label.toLowerCase()}`,
  }));
}

export function isNavActive(link: NavLink, pathname: string): boolean {
  return link.matchExact ? pathname === link.href : pathname.startsWith(link.href);
}
