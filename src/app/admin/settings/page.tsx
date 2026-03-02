import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bot,
  Key,
  UserPlus,
  Megaphone,
  Ticket,
  Palette,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Radar,
  Cpu,
  Eye,
} from "lucide-react";
import { ClientOnboardForm } from "@/components/admin/client-onboard-form";

// ─── Agent type definitions ────────────────────────────────────────────────

const AGENT_TYPES = [
  {
    key: "boss",
    name: "Boss",
    description: "Orchestrator that delegates tasks, approves spawns, and supervises all agents",
    icon: Cpu,
    accent: "text-cyan-400",
  },
  {
    key: "media-buyer",
    name: "Media Buyer",
    description: "Meta Ads analysis and execution -- pulls campaigns, insights, and syncs spend data",
    icon: Megaphone,
    accent: "text-violet-400",
  },
  {
    key: "tm-agent",
    name: "TM Data",
    description: "Ticketmaster One scraper -- extracts events, ticket counts, and demographics",
    icon: Ticket,
    accent: "text-emerald-400",
  },
  {
    key: "creative",
    name: "Creative",
    description: "Ad creative review and copy generation for Meta campaigns",
    icon: Palette,
    accent: "text-rose-400",
  },
  {
    key: "reporting",
    name: "Reporting",
    description: "Cross-references Meta spend against TM1 ticket sales and generates ROAS reports",
    icon: BarChart3,
    accent: "text-amber-400",
  },
  {
    key: "client-manager",
    name: "Client Manager",
    description: "Handles per-client communication channels and portal data",
    icon: Users,
    accent: "text-blue-400",
  },
  {
    key: "general-chat",
    name: "General Chat",
    description: "Default conversational agent for unrouted channels",
    icon: MessageSquare,
    accent: "text-zinc-400",
  },
  {
    key: "schedule-control",
    name: "Schedule Control",
    description: "Manages cron schedules and manual job triggers",
    icon: Calendar,
    accent: "text-teal-400",
  },
  {
    key: "campaign-monitor",
    name: "Campaign Monitor",
    description: "Cross-references Meta spend against TM1 ticket sales, flags low-ROAS campaigns",
    icon: Radar,
    accent: "text-orange-400",
  },
  {
    key: "tm-demographics",
    name: "TM Demographics",
    description: "Fetches demographic breakdowns from TM One for all active events",
    icon: Eye,
    accent: "text-pink-400",
  },
];

// ─── API key display entries ───────────────────────────────────────────────

const API_KEYS = [
  { label: "META_ACCESS_TOKEN", masked: "EAALi...****", source: ".env.local" },
  { label: "TICKETMASTER_KEY", masked: "tm1_...****", source: ".env" },
  { label: "CLERK_SECRET_KEY", masked: "sk_live_...****", source: ".env.local" },
  { label: "NEXT_PUBLIC_SUPABASE_URL", masked: "https://...supabase.co", source: ".env.local" },
  { label: "SUPABASE_SERVICE_ROLE_KEY", masked: "eyJhbG...****", source: ".env" },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Agent configuration, API keys, and client management
          </p>
        </div>
        <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5">
          <Settings className="h-3 w-3" />
          Admin
        </Badge>
      </div>

      {/* ─── Section 1: Agent Configuration ──────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold">Agent Configuration</h2>
        </div>

        {/* Scheduler toggle card */}
        <Card className="border-border/60">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Scheduler</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All cron jobs are currently disabled. Jobs run via manual triggers only.
                </p>
              </div>
              {/* Toggle placeholder -- wire to scheduler state when ready */}
              <button
                type="button"
                disabled
                className="relative h-6 w-11 rounded-full bg-zinc-700 border border-border/60 cursor-not-allowed opacity-70 transition-colors"
                title="Scheduler toggle (disabled)"
              >
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-zinc-400 transition-transform" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Agent types grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AGENT_TYPES.map(({ key, name, description, icon: Icon, accent }) => (
            <div
              key={key}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 transition-all duration-150 hover:border-border/80"
            >
              <div className={`h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 ${accent}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
                <code className="text-[10px] text-muted-foreground/60 mt-1 block">{key}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section 2: API Keys ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold">API Keys</h2>
        </div>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>
              Keys are configured via environment variables on the host machine.
              They are not editable from this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {API_KEYS.map(({ label, masked, source }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border border-border/40 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium font-mono">{label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{masked}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 bg-white/[0.04] px-2 py-0.5 rounded shrink-0">
                    {source}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 border-dashed">
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">
              To rotate a key, update the corresponding environment variable in{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.env</code> or{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.env.local</code>{" "}
              and restart the agent process. The Meta token refreshes via the System User flow.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Section 3: Client Management ────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold">Client Management</h2>
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm">Onboard New Client</CardTitle>
            <CardDescription>
              Add a new promoter client. This creates their slug, sets up a client portal
              route, and sends an invite email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnboardForm />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
