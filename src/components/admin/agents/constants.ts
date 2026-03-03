import {
  Bot,
  CalendarDays,
  Megaphone,
  BarChart3,
  Cpu,
  Ticket,
  Palette,
  Users,
  MessageSquare,
  Calendar,
  Radar,
  Eye,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AgentInfo {
  name: string;
  icon: LucideIcon;
  accent: string;
  description?: string;
}

export const AGENT_CONFIG: Record<string, AgentInfo> = {
  // Discord agent types (shown on settings page)
  "boss":             { name: "Boss",             icon: Cpu,          accent: "text-cyan-400",    description: "Orchestrator that delegates tasks, approves spawns, and supervises all agents" },
  "media-buyer":      { name: "Media Buyer",      icon: Megaphone,    accent: "text-violet-400",  description: "Meta Ads analysis and execution -- pulls campaigns, insights, and syncs spend data" },
  "tm-agent":         { name: "TM Data",          icon: Ticket,       accent: "text-emerald-400", description: "Ticketmaster One scraper -- extracts events, ticket counts, and demographics" },
  "creative":         { name: "Creative",         icon: Palette,      accent: "text-rose-400",    description: "Ad creative review and copy generation for Meta campaigns" },
  "reporting":        { name: "Reporting",        icon: BarChart3,    accent: "text-amber-400",   description: "Cross-references Meta spend against TM1 ticket sales and generates ROAS reports" },
  "client-manager":   { name: "Client Manager",   icon: Users,        accent: "text-blue-400",    description: "Handles per-client communication channels and portal data" },
  "general-chat":     { name: "General Chat",     icon: MessageSquare, accent: "text-zinc-400",   description: "Default conversational agent for unrouted channels" },
  "schedule-control": { name: "Schedule Control", icon: Calendar,     accent: "text-teal-400",    description: "Manages cron schedules and manual job triggers" },
  "campaign-monitor": { name: "Campaign Monitor", icon: Radar,        accent: "text-orange-400",  description: "Cross-references Meta spend against TM1 ticket sales, flags low-ROAS campaigns" },
  "tm-demographics":  { name: "TM Demographics",  icon: Eye,          accent: "text-pink-400",    description: "Fetches demographic breakdowns from TM One for all active events" },

  // Job runner agent IDs (sidebar, chat, dashboard, history)
  "tm-monitor": { name: "TM One Monitor", icon: CalendarDays, accent: "text-emerald-400" },
  "meta-ads":   { name: "Meta Ads",       icon: Megaphone,    accent: "text-violet-400" },
  "think":      { name: "Think Cycle",    icon: Cpu,          accent: "text-cyan-400" },
  "assistant":  { name: "Chat",           icon: MessageSquare, accent: "text-zinc-400" },
  "heartbeat":  { name: "Heartbeat",      icon: Bot,          accent: "text-zinc-400" },
};

/** Ordered keys for the settings agent-type grid. */
export const AGENT_TYPE_KEYS = [
  "boss", "media-buyer", "tm-agent", "creative", "reporting",
  "client-manager", "general-chat", "schedule-control", "campaign-monitor", "tm-demographics",
] as const;

/** Agent IDs available for quick-run in the sidebar. */
export const QUICK_RUN_AGENTS = ["tm-monitor", "meta-ads", "campaign-monitor"] as const;

/** Agent IDs shown on the dashboard status panel. */
export const DASHBOARD_AGENTS = ["tm-monitor", "meta-ads", "campaign-monitor"] as const;

/** Look up agent display name, falling back to the raw key. */
export function agentName(key: string): string {
  return AGENT_CONFIG[key]?.name ?? key;
}

/** Look up agent icon, falling back to Bot. */
export function agentIcon(key: string): LucideIcon {
  return AGENT_CONFIG[key]?.icon ?? Bot;
}
