import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Bug, CheckCircle2, Key, Link2, ReceiptText, Settings, TriangleAlert } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { cleanAttributionQueryValue } from "@/features/meta/attribution";
import { sanitizeTicketmasterCapiSourceUrl } from "@/features/meta/conversions-api";
import {
  buildTicketmasterCapiEventMatchingBreakdown,
  buildTicketmasterCapiMatchingSummary,
  hasOptimizationGradeMetaObject,
} from "@/features/meta/ticketmaster-capi-diagnostics";
import type { ConnectedAccount } from "@/features/settings/connected-accounts";
import {
  buildConnectedAccountsSummary,
  getConnectedAccountHealth,
} from "@/features/settings/connected-accounts";
import { supabaseAdmin } from "@/lib/supabase";

// ─── API key display entries ───────────────────────────────────────────────

function getApiKeyStatus() {
  const keys = [
    { label: "CLERK_SECRET_KEY", envVar: "CLERK_SECRET_KEY", group: "Core auth", required: true },
    { label: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", envVar: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", group: "Core auth", required: true },
    { label: "NEXT_PUBLIC_SUPABASE_URL", envVar: "NEXT_PUBLIC_SUPABASE_URL", group: "Core database", required: true },
    { label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", envVar: "NEXT_PUBLIC_SUPABASE_ANON_KEY", group: "Core database", required: true },
    { label: "SUPABASE_SERVICE_ROLE_KEY", envVar: "SUPABASE_SERVICE_ROLE_KEY", group: "Core database", required: true },
    { label: "INGEST_SECRET", envVar: "INGEST_SECRET", group: "Core ingest", required: true },
    { label: "NEXT_PUBLIC_APP_URL", envVar: "NEXT_PUBLIC_APP_URL", group: "Runtime", required: false },
    { label: "APPLICATION_ERROR_ALERT_WINDOW_MINUTES", envVar: "APPLICATION_ERROR_ALERT_WINDOW_MINUTES", group: "Observability", required: false },
    { label: "META_ACCESS_TOKEN", envVar: "META_ACCESS_TOKEN", group: "Meta", required: false },
    { label: "META_AD_ACCOUNTS", envVar: "META_AD_ACCOUNTS", group: "Meta", required: false },
    { label: "META_AD_ACCOUNT_ID", envVar: "META_AD_ACCOUNT_ID", group: "Meta", required: false },
    { label: "META_CAPI_ACCESS_TOKEN", envVar: "META_CAPI_ACCESS_TOKEN", group: "Meta", required: false },
    { label: "META_CAPI_PIXEL_ID", envVar: "META_CAPI_PIXEL_ID", group: "Meta", required: false },
    { label: "META_CAPI_TEST_EVENT_CODE", envVar: "META_CAPI_TEST_EVENT_CODE", group: "Meta", required: false },
    { label: "TICKETMASTER_CAPI_PIXEL_SECRET", envVar: "TICKETMASTER_CAPI_PIXEL_SECRET", group: "Meta", required: false },
    { label: "META_APP_SECRET", envVar: "META_APP_SECRET", group: "Meta", required: false },
    { label: "RESEND_API_KEY", envVar: "RESEND_API_KEY", group: "Email", required: false },
    { label: "RESEND_FROM_EMAIL", envVar: "RESEND_FROM_EMAIL", group: "Email", required: false },
    { label: "CONTACT_FORM_TO_EMAIL", envVar: "CONTACT_FORM_TO_EMAIL", group: "Email", required: false },
    { label: "NEXT_PUBLIC_AUDIT_BOOKING_URL", envVar: "NEXT_PUBLIC_AUDIT_BOOKING_URL", group: "Landing", required: false },
    { label: "NEXT_PUBLIC_WHATSAPP_URL", envVar: "NEXT_PUBLIC_WHATSAPP_URL", group: "Landing", required: false },
  ];
  return keys.map((k) => {
    const value = process.env[k.envVar];
    const configured = !!value && value.length > 0;
    const masked = configured ? "configured" : k.required ? "missing" : "not configured";
    return { ...k, masked, configured, source: "host env" };
  });
}

// ─── Page ──────────────────────────────────────────────────────────────────

function formatErrorDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatCurrency(value: number | string | null, currency: string | null) {
  if (value === null || value === undefined) return "n/a";
  const parsed = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(parsed)) return "n/a";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(parsed);
}

type TicketmasterCapiEvent = {
  attempt_count: number;
  attribution_handoff_id: string | null;
  attribution_match_confidence: string | null;
  attribution_match_method: string | null;
  attribution_matched_at: string | null;
  created_at: string;
  currency: string | null;
  error_message: string | null;
  event_id: string;
  event_name: string;
  funnel?: string | null;
  id: string;
  is_test: boolean;
  last_seen_at: string;
  market?: string | null;
  meta_ad_id: string | null;
  meta_ad_name: string | null;
  meta_adset_id: string | null;
  meta_adset_name: string | null;
  meta_campaign_id: string | null;
  meta_campaign_name: string | null;
  meta_ok: boolean;
  meta_status: number | null;
  om_click_id: string | null;
  om_session_id: string | null;
  order_hash: string | null;
  order_id: string | null;
  placement: string | null;
  quantity: number | null;
  skip_reason: string | null;
  source_url: string | null;
  ticketmaster_event_date: string | null;
  ticketmaster_event_id: string | null;
  ticketmaster_event_name: string | null;
  utm_content?: string | null;
  value: number | string | null;
};

type RevenueSummary = {
  acceptedRate: number;
  averageOrderValue: number;
  failures: number;
  purchases: number;
  revenue: number;
  tickets: number;
};

type TicketmasterAttributionHandoff = {
  click_id: string | null;
  created_at: string;
  fbc: string | null;
  fbclid: string | null;
  fbp: string | null;
  funnel: string | null;
  id: string;
  market: string | null;
  meta_ad_id: string | null;
  meta_adset_id: string | null;
  meta_campaign_id: string | null;
  session_id: string | null;
  ticketmaster_event_id: string | null;
  ticketmaster_event_name: string | null;
};

type HandoffCaptureSummary = {
  clickIdRows: number;
  fbcRows: number;
  fbclidRows: number;
  fbpRows: number;
  metaAdRows: number;
  metaAdsetRows: number;
  metaCampaignRows: number;
  metaObjectCaptureRate: number;
  metaObjectRows: number;
  rows: number;
  sessionIdRows: number;
};

function numericValue(value: number | string | null) {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
}

function summarizePurchases(events: TicketmasterCapiEvent[]): RevenueSummary {
  const purchases = events.filter((event) => event.event_name === "Purchase" && !event.is_test && !event.skip_reason && numericValue(event.value) > 0);
  const accepted = purchases.filter((event) => event.meta_ok);
  const revenue = purchases.reduce((sum, event) => sum + numericValue(event.value), 0);
  const tickets = purchases.reduce((sum, event) => sum + (event.quantity ?? 0), 0);
  return {
    acceptedRate: purchases.length === 0 ? 0 : Math.round((accepted.length / purchases.length) * 100),
    averageOrderValue: purchases.length === 0 ? 0 : revenue / purchases.length,
    failures: events.filter((event) => Boolean(event.skip_reason || event.error_message || (!event.meta_ok && event.meta_status))).length,
    purchases: purchases.length,
    revenue,
    tickets,
  };
}

function safeAdminLabel(value: string | null | undefined, fallback: string) {
  return cleanAttributionQueryValue("utm_content", value) ?? cleanAttributionQueryValue("ticketmaster_event_id", value) ?? fallback;
}

function safeAdminAdLabel(value: string | null | undefined, fallback: string) {
  return cleanAttributionQueryValue("utm_content", value) ?? cleanAttributionQueryValue("ad_id", value) ?? fallback;
}

function safeAdminErrorMessage(value: string | null | undefined) {
  if (!value) return undefined;
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/(?:^|[^A-Za-z0-9])(?:\+?\d[\d\s().-]{7,}\d)(?=$|[^A-Za-z0-9])|\d{10,}/g, "[redacted-phone]")
    .replace(/(sk_live|sk_test|xox[baprs]-|ghp_|ya29\.|access[_-]?token|api[_-]?key|secret|password|bearer)[^\s]*/gi, "[redacted-secret]")
    .slice(0, 500);
}

export function safeAdminSourceUrl(value: string | null | undefined) {
  const sanitized = sanitizeTicketmasterCapiSourceUrl(value ?? undefined);
  if (!sanitized) return undefined;
  try {
    const parsed = new URL(sanitized);
    return `${parsed.origin}${parsed.pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

function hasSafeMetaObject(value: string | null | undefined, key: "ad_id" | "adset_id" | "campaign_id") {
  return Boolean(cleanAttributionQueryValue(key, value));
}

function summarizeHandoffCapture(rows: TicketmasterAttributionHandoff[]): HandoffCaptureSummary {
  let clickIdRows = 0;
  let fbcRows = 0;
  let fbclidRows = 0;
  let fbpRows = 0;
  let metaAdRows = 0;
  let metaAdsetRows = 0;
  let metaCampaignRows = 0;
  let metaObjectRows = 0;
  let sessionIdRows = 0;

  for (const row of rows) {
    const hasMetaAd = hasSafeMetaObject(row.meta_ad_id, "ad_id");
    const hasMetaAdset = hasSafeMetaObject(row.meta_adset_id, "adset_id");
    const hasMetaCampaign = hasSafeMetaObject(row.meta_campaign_id, "campaign_id");
    if (hasMetaAd) metaAdRows += 1;
    if (hasMetaAdset) metaAdsetRows += 1;
    if (hasMetaCampaign) metaCampaignRows += 1;
    if (hasMetaAd || hasMetaAdset || hasMetaCampaign) metaObjectRows += 1;
    if (row.click_id) clickIdRows += 1;
    if (row.session_id) sessionIdRows += 1;
    if (row.fbclid) fbclidRows += 1;
    if (row.fbc) fbcRows += 1;
    if (row.fbp) fbpRows += 1;
  }

  return {
    clickIdRows,
    fbcRows,
    fbclidRows,
    fbpRows,
    metaAdRows,
    metaAdsetRows,
    metaCampaignRows,
    metaObjectCaptureRate: rows.length === 0 ? 0 : Math.round((metaObjectRows / rows.length) * 100),
    metaObjectRows,
    rows: rows.length,
    sessionIdRows,
  };
}

function groupHandoffsByEvent(rows: TicketmasterAttributionHandoff[]) {
  const groups = new Map<string, TicketmasterAttributionHandoff[]>();
  rows.forEach((row) => {
    const eventId = cleanAttributionQueryValue("ticketmaster_event_id", row.ticketmaster_event_id);
    const eventName = cleanAttributionQueryValue("utm_content", row.ticketmaster_event_name);
    const funnel = cleanAttributionQueryValue("om_funnel", row.funnel);
    const market = cleanAttributionQueryValue("om_market", row.market);
    const key = [
      eventId ? `id:${eventId.toLowerCase()}` : `name:${eventName?.toLowerCase() ?? "unknown-event"}`,
      funnel ?? "no-funnel",
      market ?? "no-market",
    ].join("|");
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });

  return Array.from(groups.entries())
    .map(([key, eventRows]) => {
      const first = eventRows[0];
      return {
        ...summarizeHandoffCapture(eventRows),
        eventId: cleanAttributionQueryValue("ticketmaster_event_id", first.ticketmaster_event_id) ?? null,
        funnel: cleanAttributionQueryValue("om_funnel", first.funnel) ?? null,
        key,
        market: cleanAttributionQueryValue("om_market", first.market) ?? null,
        name: safeAdminLabel(first.ticketmaster_event_name ?? first.ticketmaster_event_id, "Unknown event"),
      };
    })
    .sort((a, b) => {
      if (b.rows !== a.rows) return b.rows - a.rows;
      if (b.metaObjectRows !== a.metaObjectRows) return b.metaObjectRows - a.metaObjectRows;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 4);
}

function groupPurchasesByEvent(events: TicketmasterCapiEvent[]) {
  const groups = new Map<string, TicketmasterCapiEvent[]>();
  events
    .filter((event) => event.event_name === "Purchase" && !event.is_test && !event.skip_reason && numericValue(event.value) > 0)
    .forEach((event) => {
      const key = safeAdminLabel(event.ticketmaster_event_name ?? event.ticketmaster_event_id, "Unknown event");
      groups.set(key, [...(groups.get(key) ?? []), event]);
    });
  return Array.from(groups.entries())
    .map(([name, rows]) => ({ name, ...summarizePurchases(rows) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function groupPurchasesByAd(events: TicketmasterCapiEvent[]) {
  const groups = new Map<string, TicketmasterCapiEvent[]>();
  events
    .filter((event) => event.event_name === "Purchase" && !event.is_test && !event.skip_reason && numericValue(event.value) > 0 && hasOptimizationGradeMetaObject(event))
    .forEach((event) => {
      const key = safeAdminAdLabel(event.meta_ad_name ?? event.meta_ad_id ?? event.meta_adset_name ?? event.meta_adset_id ?? event.meta_campaign_name ?? event.meta_campaign_id, "Unknown ad");
      groups.set(key, [...(groups.get(key) ?? []), event]);
    });
  return Array.from(groups.entries())
    .map(([name, rows]) => ({ name, ...summarizePurchases(rows) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function buildTicketmasterRevenueMetrics(rows: TicketmasterCapiEvent[]) {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayRows = rows.filter((event) => new Date(event.created_at).getTime() >= todayStart.getTime());
  const sevenDayRows = rows.filter((event) => new Date(event.created_at).getTime() >= now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDayRows = rows.filter((event) => new Date(event.created_at).getTime() >= now - 30 * 24 * 60 * 60 * 1000);
  return {
    adBreakdown: groupPurchasesByAd(thirtyDayRows),
    eventBreakdown: groupPurchasesByEvent(thirtyDayRows),
    sevenDaySummary: summarizePurchases(sevenDayRows),
    thirtyDaySummary: summarizePurchases(thirtyDayRows),
    todaySummary: summarizePurchases(todayRows),
  };
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
  const requiredKeys = apiKeys.filter((key) => key.required);
  const optionalKeys = apiKeys.filter((key) => !key.required);
  const configuredRequiredCount = requiredKeys.filter((key) => key.configured).length;
  const missingRequiredCount = requiredKeys.length - configuredRequiredCount;
  const configuredOptionalCount = optionalKeys.filter((key) => key.configured).length;
  const connectionIssues = connectedAccounts
    .map((account) => ({ account, health: getConnectedAccountHealth(account) }))
    .filter(({ health }) => health.key !== "healthy");
  const applicationErrorsRes = await supabaseAdmin
    ?.from("application_errors")
    .select("id, created_at, digest, message, route, user_email")
    .order("created_at", { ascending: false })
    .limit(6);
  const applicationErrors = applicationErrorsRes?.data ?? [];
  const ticketmasterCapiEventsRes = await supabaseAdmin
    ?.from("ticketmaster_capi_events")
    .select(
      "id, created_at, last_seen_at, attempt_count, event_name, event_id, order_id, order_hash, om_click_id, om_session_id, attribution_handoff_id, attribution_match_method, attribution_match_confidence, attribution_matched_at, ticketmaster_event_id, ticketmaster_event_name, ticketmaster_event_date, value, currency, quantity, meta_status, meta_ok, skip_reason, error_message, is_test, source_url, funnel, market, meta_campaign_id, meta_campaign_name, meta_adset_id, meta_adset_name, meta_ad_id, meta_ad_name, placement, utm_content",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  const ticketmasterCapiRows = (ticketmasterCapiEventsRes?.data ?? []) as TicketmasterCapiEvent[];
  const ticketmasterHandoffsRes = await supabaseAdmin
    ?.from("ticketmaster_attribution_handoffs")
    .select("id, created_at, ticketmaster_event_id, ticketmaster_event_name, funnel, market, click_id, session_id, fbclid, fbc, fbp, meta_campaign_id, meta_adset_id, meta_ad_id")
    .order("created_at", { ascending: false })
    .limit(500);
  const ticketmasterHandoffs = (ticketmasterHandoffsRes?.data ?? []) as TicketmasterAttributionHandoff[];
  const handoffSummary = summarizeHandoffCapture(ticketmasterHandoffs);
  const handoffEventBreakdown = groupHandoffsByEvent(ticketmasterHandoffs);
  const ticketmasterCapiEvents = ticketmasterCapiRows.slice(0, 12);
  const {
    adBreakdown,
    eventBreakdown,
    sevenDaySummary,
    thirtyDaySummary,
    todaySummary,
  } = buildTicketmasterRevenueMetrics(ticketmasterCapiRows);
  const matchingSummary = buildTicketmasterCapiMatchingSummary(ticketmasterCapiRows);
  const eventMatchingBreakdown = buildTicketmasterCapiEventMatchingBreakdown(ticketmasterCapiRows).slice(0, 6);

  const stats = [
    {
      accent: "from-cyan-500/20 to-blue-500/20",
      icon: Key,
      iconColor: "text-cyan-400",
      label: "Required config",
      sub: "auth, database, and ingest env ready",
      value: `${configuredRequiredCount}/${requiredKeys.length}`,
    },
    {
      accent: "from-amber-500/20 to-orange-500/20",
      icon: TriangleAlert,
      iconColor: missingRequiredCount > 0 ? "text-amber-400" : "text-emerald-400",
      label: "Missing required",
      sub: "must be fixed before production work",
      value: String(missingRequiredCount),
    },
    {
      accent: "from-emerald-500/20 to-teal-500/20",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      label: "Healthy Meta links",
      sub: `${connectionSummary.attentionCount} needing attention`,
      value: String(connectionSummary.healthyCount),
    },
    {
      accent: "from-rose-500/20 to-orange-500/20",
      icon: Bug,
      iconColor: applicationErrors.length > 0 ? "text-rose-400" : "text-emerald-400",
      label: "Recent app errors",
      sub: "latest recorded client errors",
      value: String(applicationErrors.length),
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
              Keys are configured via environment variables on the host. Required keys must be present; optional keys are shown for active integrations only.
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              {configuredRequiredCount}/{requiredKeys.length} required ready • {configuredOptionalCount}/{optionalKeys.length} optional configured
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiKeys.map(({ label, masked, source, configured, group, required }) => (
                <div
                  key={label}
                  className="flex flex-col gap-3 rounded-md border border-border/40 bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-medium">{label}</p>
                    <p
                      className={`mt-0.5 font-mono text-[11px] ${
                        configured
                          ? "text-muted-foreground"
                          : required
                            ? "text-red-400"
                            : "text-muted-foreground/70"
                      }`}
                    >
                      {masked}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${configured ? "bg-emerald-400" : required ? "bg-red-400" : "bg-muted-foreground/40"}`} />
                    <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground/60">
                      {group}
                    </span>
                    <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground/60">
                      {required ? "required" : "optional"}
                    </span>
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
            <ReceiptText className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-sm">Ticketmaster CAPI revenue</CardTitle>
          </div>
          <CardDescription>
            Confirmed Ticketmaster purchase revenue received by the custom pixel, separate from Meta ad spend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Today revenue", value: formatCurrency(todaySummary.revenue, "USD"), sub: `${todaySummary.purchases} purchases` },
              { label: "7-day revenue", value: formatCurrency(sevenDaySummary.revenue, "USD"), sub: `${sevenDaySummary.tickets} tickets` },
              { label: "30-day revenue", value: formatCurrency(thirtyDaySummary.revenue, "USD"), sub: `${thirtyDaySummary.purchases} purchases` },
              { label: "Avg order", value: formatCurrency(thirtyDaySummary.averageOrderValue, "USD"), sub: "30-day AOV" },
              { label: "Meta accepted", value: `${thirtyDaySummary.acceptedRate}%`, sub: `${thirtyDaySummary.failures} issues` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-lg font-semibold">{item.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Revenue by Ticketmaster event</p>
              {eventBreakdown.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No purchase revenue recorded in the last 30 days.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {eventBreakdown.map((event) => (
                    <div key={event.name} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.purchases} purchases • {event.tickets} tickets</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">{formatCurrency(event.revenue, "USD")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Revenue by ad/ad set</p>
              {adBreakdown.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Waiting on deterministic/high-confidence ad attribution before optimization-grade ad revenue appears here.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {adBreakdown.map((ad) => (
                    <div key={ad.name} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{ad.name}</p>
                        <p className="text-xs text-muted-foreground">{ad.purchases} purchases • {ad.acceptedRate}% accepted</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">{formatCurrency(ad.revenue, "USD")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <CardTitle className="text-sm">Ticketmaster CAPI matching quality</CardTitle>
          </div>
          <CardDescription>
            Accepted purchase sends versus ad-level matching quality from the last 500 CAPI rows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Accepted", value: `${matchingSummary.acceptedCount}/${matchingSummary.purchaseCount}`, sub: `${matchingSummary.acceptedRate}% Meta accepted` },
              { label: "Ad-level rows", value: String(matchingSummary.directMetaObjectCount), sub: `${matchingSummary.adLevelCoverageRate}% direct coverage` },
              { label: "Optimization-grade", value: String(matchingSummary.optimizationGradeCount), sub: "deterministic/high plus Meta object ID" },
              { label: "CFC candidates", value: String(matchingSummary.cfcCandidateCount), sub: "numeric ad IDs found in CFC/source" },
              { label: "Unknown", value: String(matchingSummary.unknownCount), sub: "no usable match context" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-lg font-semibold">{item.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Confidence split</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-2">
                {Object.entries(matchingSummary.confidenceCounts).map(([label, count]) => (
                  <div key={label} className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-1 text-base font-semibold">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Diagnosis</p>
                  <p className="mt-2 text-sm font-medium">
                    {matchingSummary.status === "healthy"
                      ? "Ad-level matching is usable"
                      : matchingSummary.status === "accepted_without_direct_matching"
                        ? "CAPI is accepted, but ad-level matching is missing"
                        : matchingSummary.status === "accepted_without_optimization_grade_matching"
                          ? "CAPI is accepted, but optimization-grade matching is missing"
                        : matchingSummary.status === "acceptance_issue"
                          ? "Meta acceptance needs review"
                          : "Waiting for purchase data"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {matchingSummary.nextAction}
                  </p>
                </div>
                <div className="grid shrink-0 grid-cols-2 gap-2 text-right">
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Direct TM</p>
                    <p className="text-sm font-semibold">{matchingSummary.directTicketmasterParamCount}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Handoff</p>
                    <p className="text-sm font-semibold">{matchingSummary.handoffDerivedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Matching by Ticketmaster event</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Use this to see which event is actually getting deterministic ad matching.
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground/60">Top {eventMatchingBreakdown.length} by purchase count</p>
            </div>

            {eventMatchingBreakdown.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No non-test purchase rows available for event-level matching.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {eventMatchingBreakdown.map((event) => (
                  <div key={event.key} className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{event.name}</p>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground/70">
                          {event.eventId ?? "no event id"}
                          {event.funnel || event.market ? ` • ${[event.funnel, event.market].filter(Boolean).join(" / ")}` : ""}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-left sm:grid-cols-4 lg:min-w-[520px]">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Accepted</p>
                          <p className="text-sm font-semibold">{event.acceptedCount}/{event.purchaseCount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Ad-level</p>
                          <p className="text-sm font-semibold">{event.directMetaObjectCount} <span className="text-xs font-normal text-muted-foreground">({event.adLevelCoverageRate}%)</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Opt grade</p>
                          <p className="text-sm font-semibold">{event.optimizationGradeCount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Unknown</p>
                          <p className="text-sm font-semibold">{event.unknownCount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground/70">
                      <span>{formatCurrency(event.revenue, "USD")}</span>
                      <span>{event.tickets} tickets</span>
                      <span>{event.confidenceCounts.deterministic} deterministic</span>
                      <span>{event.confidenceCounts.high} high</span>
                      <span>{event.confidenceCounts.medium} medium</span>
                      <span>{event.confidenceCounts.low} low</span>
                      <span>{event.cfcCandidateCount} CFC candidates</span>
                      <span className={event.status === "healthy" ? "text-emerald-300" : "text-amber-300"}>
                        {event.status === "healthy" ? "usable" : event.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">First-party handoff capture</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Counts from the latest {handoffSummary.rows} Ticketmaster redirect handoffs before checkout.
                </p>
              </div>
              <p className={handoffSummary.metaObjectRows > 0 ? "text-[11px] text-emerald-300" : "text-[11px] text-amber-300"}>
                {handoffSummary.metaObjectRows}/{handoffSummary.rows} with Meta object IDs
              </p>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {[
                { label: "Meta objects", value: String(handoffSummary.metaObjectRows), sub: `${handoffSummary.metaObjectCaptureRate}% capture` },
                { label: "Ad IDs", value: String(handoffSummary.metaAdRows), sub: "numeric ad IDs" },
                { label: "Ad set IDs", value: String(handoffSummary.metaAdsetRows), sub: "numeric ad set IDs" },
                { label: "Campaign IDs", value: String(handoffSummary.metaCampaignRows), sub: "numeric campaign IDs" },
                { label: "Click/session", value: `${handoffSummary.clickIdRows}/${handoffSummary.sessionIdRows}`, sub: "first-party context" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-white/[0.03] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-base font-semibold">{item.value}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground/70">
              <span>fbclid {handoffSummary.fbclidRows}</span>
              <span>fbc {handoffSummary.fbcRows}</span>
              <span>fbp {handoffSummary.fbpRows}</span>
            </div>

            {handoffEventBreakdown.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No Ticketmaster redirect handoffs have been captured yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {handoffEventBreakdown.map((event) => (
                  <div key={event.key} className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{event.name}</p>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground/70">
                          {event.eventId ?? "no event id"}
                          {event.funnel || event.market ? ` • ${[event.funnel, event.market].filter(Boolean).join(" / ")}` : ""}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-left sm:grid-cols-4 lg:min-w-[520px]">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Handoffs</p>
                          <p className="text-sm font-semibold">{event.rows}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Meta IDs</p>
                          <p className="text-sm font-semibold">{event.metaObjectRows} <span className="text-xs font-normal text-muted-foreground">({event.metaObjectCaptureRate}%)</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Click/session</p>
                          <p className="text-sm font-semibold">{event.clickIdRows}/{event.sessionIdRows}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">FB context</p>
                          <p className="text-sm font-semibold">{event.fbclidRows}/{event.fbcRows}/{event.fbpRows}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-sm">Ticketmaster CAPI events</CardTitle>
          </div>
          <CardDescription>
            Recent Custom IMG pixel hits from Ticketmaster and whether Meta accepted the server event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ticketmasterCapiEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No Ticketmaster CAPI events have been recorded yet.</p>
          ) : (
            ticketmasterCapiEvents.map((event) => {
              const adminSourceUrl = safeAdminSourceUrl(event.source_url);
              const adLabel = safeAdminAdLabel(event.meta_ad_name ?? event.meta_ad_id ?? event.meta_adset_name ?? event.meta_adset_id, "n/a");
              const hasClickContext = Boolean(event.om_click_id || event.om_session_id || event.attribution_handoff_id);
              const hasAdContext = adLabel !== "n/a";
              const statusLabel = event.skip_reason
                ? event.skip_reason
                : event.meta_ok
                  ? "Meta accepted"
                  : event.meta_status
                    ? `Meta HTTP ${event.meta_status}`
                    : "received";
              const statusClass = event.meta_ok
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : event.skip_reason || event.error_message
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : "border-muted-foreground/20 bg-white/[0.04] text-muted-foreground";
              return (
                <div key={event.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {event.event_name} • {formatCurrency(event.value, event.currency)}
                        {event.quantity ? ` • ${event.quantity} ticket${event.quantity === 1 ? "" : "s"}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {safeAdminLabel(event.ticketmaster_event_name ?? event.ticketmaster_event_id, "unknown event")} • {formatErrorDate(event.created_at)}
                      </p>
                      <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground/70">
                        order {event.order_hash ? "hashed" : event.order_id ? "stored" : "n/a"} • event_id {cleanAttributionQueryValue("meta_event_id", event.event_id) ? "stored" : "n/a"}
                      </p>
                      {(hasClickContext || hasAdContext) ? (
                        <p className="mt-1 truncate font-mono text-[11px] text-emerald-200/70">
                          {hasClickContext ? "click context captured" : "no click context"} • ad {adLabel}
                        </p>
                      ) : null}
                      {event.attribution_match_method ? (
                        <p className="mt-1 truncate font-mono text-[11px] text-cyan-200/70">
                          attribution {event.attribution_match_confidence ?? "unknown"} • {event.attribution_match_method}
                          {event.attribution_handoff_id ? " • handoff matched" : ""}
                        </p>
                      ) : null}
                      {adminSourceUrl ? (
                        <p className="mt-1 truncate text-[11px] text-muted-foreground/60">{adminSourceUrl}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`rounded border px-2 py-0.5 text-[10px] font-medium ${statusClass}`}>
                        {statusLabel}
                      </span>
                      {event.attempt_count > 1 ? (
                        <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground/70">
                          {event.attempt_count} hits
                        </span>
                      ) : null}
                      {event.is_test ? (
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">test</span>
                      ) : null}
                    </div>
                  </div>
                  {safeAdminErrorMessage(event.error_message) ? (
                    <p className="mt-2 rounded bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200">
                      {safeAdminErrorMessage(event.error_message)}
                    </p>
                  ) : null}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

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
