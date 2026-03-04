import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Bot, Key, UserPlus } from "lucide-react";
import { ClientOnboardForm } from "@/components/admin/client-onboard-form";
import { AGENT_CONFIG, AGENT_TYPE_KEYS } from "@/components/admin/agents/constants";

// ─── API key display entries ───────────────────────────────────────────────

function getApiKeyStatus() {
  const keys = [
    { label: "META_ACCESS_TOKEN", envVar: "META_ACCESS_TOKEN", source: ".env.local" },
    { label: "TICKETMASTER_KEY", envVar: "TICKETMASTER_API_KEY", source: ".env" },
    { label: "CLERK_SECRET_KEY", envVar: "CLERK_SECRET_KEY", source: ".env.local" },
    { label: "NEXT_PUBLIC_SUPABASE_URL", envVar: "NEXT_PUBLIC_SUPABASE_URL", source: ".env.local" },
    { label: "SUPABASE_SERVICE_ROLE_KEY", envVar: "SUPABASE_SERVICE_ROLE_KEY", source: ".env" },
    { label: "INGEST_SECRET", envVar: "INGEST_SECRET", source: ".env" },
  ];
  return keys.map((k) => {
    const value = process.env[k.envVar];
    const configured = !!value && value.length > 0;
    // Show first 4 chars + **** if configured, never show more
    const masked = configured ? `${value.slice(0, 4)}...****` : "not set";
    return { ...k, masked, configured };
  });
}

// ─── Page ──────────────────────────────────────────────────────────────────

import { AdminPageHeader } from "@/components/admin/page-header";

export default function SettingsPage() {
  const apiKeys = getApiKeyStatus();
  return (
    <div className="space-y-4 sm:space-y-8">

      {/* Header */}
      <AdminPageHeader
        title="Settings"
        description="Agent configuration, API keys, and client management"
      >
        <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5">
          <Settings className="h-3 w-3" />
          Admin
        </Badge>
      </AdminPageHeader>

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
            </div>
          </CardContent>
        </Card>

        {/* Agent types grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AGENT_TYPE_KEYS.map((key) => {
            const { name, description, icon: Icon, accent } = AGENT_CONFIG[key];
            return (
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
            );
          })}
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
              {apiKeys.map(({ label, masked, source, configured }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border border-border/40 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium font-mono">{label}</p>
                    <p className={`text-[11px] mt-0.5 font-mono ${configured ? "text-muted-foreground" : "text-red-400"}`}>
                      {masked}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`h-2 w-2 rounded-full ${configured ? "bg-emerald-400" : "bg-red-400"}`} />
                    <span className="text-[10px] text-muted-foreground/60 bg-white/[0.04] px-2 py-0.5 rounded">
                      {source}
                    </span>
                  </div>
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
