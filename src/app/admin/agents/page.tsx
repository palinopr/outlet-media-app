import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RunButton } from "@/components/admin/run-button";
import {
  Bot,
  ScrollText,
  CalendarDays,
  Megaphone,
  BarChart3,
  Terminal,
  CheckCircle2,
} from "lucide-react";

// ─── Agent definitions ─────────────────────────────────────────────────────

const agents = [
  {
    id: "tm-monitor",
    name: "TM One Monitor",
    description: "Opens your browser, logs into one.ticketmaster.com, and reads every event on your promoter account. Extracts TM1 numbers, ticket counts, gross revenue, and sale status. Runs every 2 hours automatically.",
    icon: CalendarDays,
    status: "idle" as const,
    lastRun: null as string | null,
    triggers: ["Every 2 hours (cron)", "Manual via Telegram or Run button"],
    outputs: ["Updates Supabase tm_events table", "Posts changes to your Telegram"],
  },
  {
    id: "meta-ads",
    name: "Meta Ads Manager",
    description: "Pulls campaign performance data from Facebook/Instagram Ads Manager. Tracks spend, ROAS, impressions, CTR, and CPC per campaign. Can create new campaigns when given event details.",
    icon: Megaphone,
    status: "idle" as const,
    lastRun: null as string | null,
    triggers: ["Every 6 hours (cron)", "Manual via Telegram or Run button"],
    outputs: ["Updates Supabase meta_campaigns table", "Posts spend alerts to Telegram"],
  },
  {
    id: "campaign-monitor",
    name: "Campaign Monitor",
    description: "Cross-references ticket sales with ad spend to compute true ROAS per show. Flags campaigns that are overspending relative to ticket velocity. Pauses underperformers automatically.",
    icon: BarChart3,
    status: "idle" as const,
    lastRun: null as string | null,
    triggers: ["Daily at 9am", "After each Meta Ads sync"],
    outputs: ["Pauses low-ROAS campaigns via Meta API", "Sends daily digest to Telegram"],
  },
];

const statusConfig = {
  idle: {
    label: "Idle",
    dot: "bg-zinc-500",
    classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
  running: {
    label: "Running",
    dot: "bg-emerald-400 animate-pulse",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  error: {
    label: "Error",
    dot: "bg-red-500",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Autonomous workers powered by Claude Code CLI
          </p>
        </div>
      </div>

      {/* Setup banner */}
      <Card className="border-border/60 border-dashed">
        <CardContent className="py-5">
          <div className="flex items-start gap-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 border border-border flex items-center justify-center shrink-0 mt-0.5">
              <Terminal className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Agent not running</p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                Start the agent on your Mac to enable autonomous monitoring and Telegram control.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {[
                  "cd agent",
                  "cp .env.example .env  # fill in credentials",
                  "npm install",
                  "npm start",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                    <code className="bg-muted px-2 py-0.5 rounded">{step}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent cards */}
      <div className="space-y-4">
        {agents.map((agent) => {
          const { label, dot, classes } = statusConfig[agent.status];
          const Icon = agent.icon;
          return (
            <Card key={agent.id} className="border-border/60">
              <CardContent className="py-5">
                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-semibold">{agent.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                          {label}
                        </span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" disabled>
                          <ScrollText className="h-3 w-3" />
                          Logs
                        </Button>
                        <RunButton agentId={agent.id} />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {agent.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Triggers</p>
                        <ul className="space-y-1">
                          {agent.triggers.map((t) => (
                            <li key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Outputs</p>
                        <ul className="space-y-1">
                          {agent.outputs.map((o) => (
                            <li key={o} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      Last run: {agent.lastRun ?? "Never — start the agent to activate"}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
