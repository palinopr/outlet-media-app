import {
  Megaphone,
  Ticket,
  Globe,
  Users,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SERVICE_KEYS = [
  "meta_ads",
  "ticketmaster",
  "eata",
  "crm",
  "workspace",
  "assets",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

export interface ServiceDefinition {
  name: string;
  description: string;
  icon: LucideIcon;
  portalRoutes: string[];
  category: "advertising" | "data" | "tools";
}

export const SERVICE_REGISTRY: Record<ServiceKey, ServiceDefinition> = {
  meta_ads: {
    name: "Meta Ads",
    description: "Facebook & Instagram ad campaigns, spend tracking, ROAS",
    icon: Megaphone,
    portalRoutes: ["campaigns", "campaign", "reports"],
    category: "advertising",
  },
  ticketmaster: {
    name: "Ticketmaster",
    description: "TM One event data, ticket sales, venue analytics",
    icon: Ticket,
    portalRoutes: ["events", "event"],
    category: "data",
  },
  eata: {
    name: "EATA / Vivaticket",
    description: "Vivaticket event data, ticket sales, revenue tracking",
    icon: Globe,
    portalRoutes: ["events", "event"],
    category: "data",
  },
  crm: {
    name: "CRM",
    description: "Contact management, lead tracking, client relationships",
    icon: Users,
    portalRoutes: ["crm"],
    category: "tools",
  },
  workspace: {
    name: "Workspace",
    description: "Shared docs, notes, and task management",
    icon: FileText,
    portalRoutes: ["workspace"],
    category: "tools",
  },
  assets: {
    name: "Assets",
    description: "Ad creatives, images, and video library",
    icon: ImageIcon,
    portalRoutes: ["assets"],
    category: "tools",
  },
};

export interface ServicePreset {
  id: string;
  name: string;
  description: string;
  services: ServiceKey[];
}

export const SERVICE_PRESETS: ServicePreset[] = [
  {
    id: "music_promoter",
    name: "Music Promoter",
    description: "Ads, ticketing, assets, workspace",
    services: ["meta_ads", "ticketmaster", "assets", "workspace"],
  },
  {
    id: "realtor",
    name: "Realtor",
    description: "Ads, CRM, assets",
    services: ["meta_ads", "crm", "assets"],
  },
  {
    id: "musician",
    name: "Musician",
    description: "Ads, assets, workspace",
    services: ["meta_ads", "assets", "workspace"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Pick services manually",
    services: [],
  },
];

export const ALWAYS_VISIBLE_ROUTES = ["", "settings"];

export function routeRequiresService(routeSegment: string): ServiceKey[] | null {
  if (ALWAYS_VISIBLE_ROUTES.includes(routeSegment)) return null;

  const required: ServiceKey[] = [];
  for (const [key, def] of Object.entries(SERVICE_REGISTRY)) {
    if (def.portalRoutes.includes(routeSegment)) {
      required.push(key as ServiceKey);
    }
  }
  return required.length > 0 ? required : null;
}
