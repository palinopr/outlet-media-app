import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, CheckCircle2, Key, Link2, Settings, TriangleAlert } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import type { ConnectedAccount } from "@/features/settings/connected-accounts";
import {
  buildConnectedAccountsSummary,
  getConnectedAccountHealth,
} from "@/features/settings/connected-accounts";
import { supabaseAdmin } from "@/lib/supabase";

// ─── API key display entries ───────────────────────────────────────────────

function getApiKeyStatus() {
  const keys = [
    { label: "META_ACCESS_TOKEN", envVar: "META_ACCESS_TOKEN", source: "host env" },
    { label: "CLERK_SECRET_KEY", envVar: "CLERK_SECRET_KEY", source: "host env" },
    { label: "NEXT_PUBLIC_SUPABASE_URL", envVar: "NEXT_PUBLIC_SUPABASE_URL", source: "host env" },
    { label: "SUPABASE_SERVICE_ROLE_KEY", envVar: "SUPABASE_SERVICE_ROLE_KEY", source: "host env" },
    { label: "INGEST_SECRET", envVar: "INGEST_SECRET", source: "host env" },
  ];
  return keys.map((k) => {
    const value = process.env[k.envVar];
    const configured = !!value && value.length > 0;
    const masked = configured ? "configured" : "not set";
    return { ...k, masked, configured };
  });
}

// ─── Page ──────────────────────────────────────────────────────────────────

import { AdminPageHeader } from "@/components/admin/page-header";

function formatErrorDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function SettingsPage() {
  const apiKeys = getApiKeyStatus();
  const connectedAccountsRes = await supabaseAdmin
    ?.from("client_accounts")
    .select(
      "id, client_slug, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at",
    )
    .order("connected_at", { ascending: false });
  const connectedAccounts = ((connectedAccountsRes?.data ?? []) as ConnectedAccount[]);
  const connectionSummary = buildConnectedAccountsSummary(connectedAccounts);
  const configuredIntegrationCount = apiKeys.filter((key) => key.configured).length;
  const missingIntegrationCount = apiKeys.length - configuredIntegrationCount;
  const connectionIssues = connectedAccounts
    .map((account) => ({ account, health: getConnectedAccountHealth(account) }))
    .filter(({ health }) => health.key !== "healthy");
  const applicationErrorsRes = await supabaseAdmin
    ?.from("application_errors")
    .select("id, created_at, digest, message, route, user_email")
    .order("created_at", { ascending: false })
    .limit(6);
  const applicationErrors = applicationErrorsRes?.data ?? [];

  const stats = [
    {
      accent: "from-cyan-500/20 to-blue-500/20",
      icon: Key,
      iconColor: "text-cyan-400",
      label: "Configured integrations",
      sub: "environment-backed keys ready",
      value: String(configuredIntegrationCount),
    },
    {
      accent: "from-amber-500/20 to-orange-500/20",
      icon: TriangleAlert,
      iconColor: missingIntegrationCount > 0 ? "text-amber-400" : "text-emerald-400",
      label: "Missing integrations",
      sub: "keys or host config not set",
      value: String(missingIntegrationCount),
    },
    {
      accent: "from-emerald-500/20 to-teal-500/20",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      label: "Healthy Meta links",
      sub: "ad accounts ready for campaign reads",
      value: String(connectionSummary.healthyCount),
    },
    {
      accent: "from-rose-500/20 to-orange-500/20",
      icon: Link2,
      iconColor: connectionSummary.attentionCount > 0 ? "text-rose-400" : "text-emerald-400",
      label: "Connection attention",
      sub: "expired, stale, or expiring Meta links",
      value: String(connectionSummary.attentionCount),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      <AdminPageHeader
        title="Settings"
        description="Environment configuration and integration health. Client creation lives in Clients; user access lives in Users."
      >
        <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5">
          <Settings className="h-3 w-3" />
          System
        </Badge>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-sm">API keys</CardTitle>
            </div>
            <CardDescription>
              Keys are configured via environment variables on the host. They are not editable in the dashboard.
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
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${configured ? "bg-emerald-400" : "bg-red-400"}`} />
                    <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground/60">
                      {source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-sm">Meta account health</CardTitle>
            </div>
            <CardDescription>
              Technical status for connected Meta ad accounts used by campaign reporting.
            </CardDescription>
            {connectionSummary.totalCount > 0 ? (
              <p className="text-xs text-muted-foreground">
                {connectionSummary.healthyCount} healthy • {connectionSummary.attentionCount} needing attention
              </p>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {connectedAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No Meta ad accounts are connected yet.
              </p>
            ) : connectionIssues.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All connected Meta ad accounts look healthy.
              </p>
            ) : (
              connectionIssues.map(({ account, health }) => (
                <div
                  key={account.id}
                  className="rounded-xl border border-border/60 bg-muted/20 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {account.ad_account_name || account.ad_account_id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {account.client_slug ?? "unassigned"} • {health.detail}
                      </p>
                    </div>
                    <span className="shrink-0 rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                      {health.label}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-rose-400" />
            <CardTitle className="text-sm">Recent app errors</CardTitle>
          </div>
          <CardDescription>
            Last recorded client-side errors from authenticated sessions. Use this before digging through host logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {applicationErrors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No application errors have been recorded.</p>
          ) : (
            applicationErrors.map((error) => (
              <div key={error.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{error.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {error.route ?? "unknown route"} • {formatErrorDate(error.created_at)}
                    </p>
                  </div>
                  {error.digest ? (
                    <span className="shrink-0 rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-mono text-rose-300">
                      {error.digest.slice(0, 10)}
                    </span>
                  ) : null}
                </div>
                {error.user_email ? (
                  <p className="mt-2 truncate text-[11px] text-muted-foreground/70">{error.user_email}</p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 border-dashed">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground">
            To rotate a key, update the corresponding host environment variable and redeploy the app.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
