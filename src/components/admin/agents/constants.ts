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
  // Single-runtime labels shown on admin surfaces. These are job labels and
  // display names, not separate deployed agents.
  "boss":             { name: "Outlet Agent",    icon: Cpu,          accent: "text-cyan-400",    description: "Single Discord runtime that handles operator chat, queue handling, and task execution." },
  "media-buyer":      { name: "Meta Ads Work",   icon: Megaphone,    accent: "text-violet-400",  description: "Task label for Meta ads analysis and execution handled by the same runtime." },
  "tm-agent":         { name: "Ticketmaster Work", icon: Ticket,     accent: "text-emerald-400", description: "Task label for Ticketmaster event and sales work handled by the same runtime." },
  "creative":         { name: "Creative Review", icon: Palette,      accent: "text-rose-400",    description: "Task label for creative review and copy feedback from the same runtime." },
  "reporting":        { name: "Reporting",       icon: BarChart3,    accent: "text-amber-400",   description: "Task label for report generation and results review handled by the same runtime." },
  "growth-supervisor": { name: "Growth Tasks",    icon: Cpu,          accent: "text-lime-400",    description: "Legacy task label for growth work handled by the same runtime." },
  "tiktok-supervisor": { name: "TikTok Drafts",   icon: Radar,        accent: "text-fuchsia-400", description: "Legacy task label for TikTok drafting and review handled by the same runtime." },
  "content-finder":   { name: "Content Research", icon: Palette,      accent: "text-cyan-400",    description: "Task label for angle, hook, and content research handled by the same runtime." },
  "lead-qualifier":   { name: "Lead Triage",      icon: Users,        accent: "text-emerald-400", description: "Task label for lead scoring and next-step recommendations handled by the same runtime." },
  "publisher-tiktok": { name: "TikTok Publishing", icon: Bot,         accent: "text-pink-400",    description: "Task label for assisted TikTok publishing handled by the same runtime." },
  "client-manager":   { name: "Client Messaging", icon: Users,        accent: "text-blue-400",    description: "Task label for client-facing messaging and portal updates handled by the same runtime." },
  "general-chat":     { name: "General Chat",     icon: MessageSquare, accent: "text-zinc-400",   description: "Fallback conversational label for unrouted requests." },
  "schedule-control": { name: "Manual Controls",  icon: Calendar,     accent: "text-teal-400",    description: "Manual job trigger label. There is no background scheduler in the current runtime." },
  "campaign-monitor": { name: "Campaign Monitor", icon: Radar,        accent: "text-orange-400",  description: "Task label for campaign monitoring and low-ROAS alerts handled by the same runtime." },
  "tm-demographics":  { name: "TM Demographics",  icon: Eye,          accent: "text-pink-400",    description: "Task label for Ticketmaster demographics work handled by the same runtime." },
  "email-agent":      { name: "Email Agent",      icon: MessageSquare, accent: "text-amber-400",  description: "Private Gmail monitoring, classification, and draft replies." },
  "don-omar-agent":   { name: "Don Omar",         icon: Ticket,        accent: "text-orange-400", description: "Task label for Don Omar ticketing monitoring handled by the same runtime." },

  // Job labels surfaced in the dashboard, chat, and history views.
  "tm-monitor": { name: "TM One Monitor", icon: CalendarDays, accent: "text-emerald-400" },
  "meta-ads":   { name: "Meta Ads",       icon: Megaphone,    accent: "text-violet-400" },
  "think":      { name: "Analysis Run",   icon: Cpu,          accent: "text-cyan-400", description: "Internal reasoning label used by the single runtime while it works through a request." },
  "assistant":  { name: "Chat",           icon: MessageSquare, accent: "text-zinc-400" },
  "heartbeat":  { name: "Heartbeat",      icon: Bot,          accent: "text-zinc-400" },
};

/** Ordered keys for the settings agent-type grid. */
export const AGENT_TYPE_KEYS = [
  "boss", "assistant", "heartbeat", "meta-ads", "tm-monitor", "campaign-monitor", "think",
  "media-buyer", "tm-agent", "reporting", "creative", "client-manager", "general-chat", "schedule-control",
  "tm-demographics", "publisher-tiktok", "lead-qualifier", "content-finder", "growth-supervisor", "tiktok-supervisor", "don-omar-agent",
] as const;

/** Agent IDs available for quick-run in the sidebar. */
export const QUICK_RUN_AGENTS = ["tm-monitor", "meta-ads", "campaign-monitor"] as const;

/** Agent IDs shown on the dashboard status panel. */
export const DASHBOARD_AGENTS = ["tm-monitor", "meta-ads", "campaign-monitor"] as const;

/** Look up agent display name, falling back to the raw key. */
export function agentName(key: string): string {
  return AGENT_CONFIG[key]?.name ?? key;
}
