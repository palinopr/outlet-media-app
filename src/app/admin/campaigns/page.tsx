import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Megaphone, ExternalLink, DollarSign, TrendingUp, Eye, MousePointerClick } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { Suspense } from "react";

type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

// ─── Data fetching ─────────────────────────────────────────────────────────

async function getCampaigns(clientSlug: string | null): Promise<{ campaigns: MetaCampaign[]; clients: string[]; fromDb: boolean }> {
  if (!supabaseAdmin) return { campaigns: [], clients: [], fromDb: false };

  // Always fetch the distinct client list for the filter dropdown
  const allRes = await supabaseAdmin
    .from("meta_campaigns")
    .select("client_slug")
    .not("client_slug", "is", null);

  const clients = [...new Set((allRes.data ?? []).map((r) => r.client_slug as string))].sort();

  const query = supabaseAdmin
    .from("meta_campaigns")
    .select("*")
    .order("spend", { ascending: false })
    .limit(100);

  if (clientSlug) query.eq("client_slug", clientSlug);

  const { data, error } = await query;
  if (error) return { campaigns: [], clients, fromDb: false };
  return { campaigns: (data ?? []) as MetaCampaign[], clients, fromDb: Boolean(data?.length) };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmtUsd(n: number | null) {
  if (n == null) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}
function fmtNum(n: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}
function centsToUsd(n: number | null) { return n == null ? null : n / 100; }

function statusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    ACTIVE:   { label: "Active",   classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    PAUSED:   { label: "Paused",   classes: "bg-amber-500/10  text-amber-400  border-amber-500/20" },
    ARCHIVED: { label: "Archived", classes: "bg-zinc-500/10   text-zinc-400   border-zinc-500/20" },
    DELETED:  { label: "Deleted",  classes: "bg-red-500/10    text-red-400    border-red-500/20" },
  };
  const entry = map[s.toUpperCase()] ?? { label: s, classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${entry.classes}`}>
      {entry.label}
    </span>
  );
}

function BudgetBar({ spend, budget }: { spend: number | null; budget: number | null }) {
  if (spend == null || budget == null) {
    return <span className="text-xs text-muted-foreground tabular-nums">{fmtUsd(spend)}</span>;
  }
  const pct = Math.min(100, Math.round((spend / budget) * 100));
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-blue-500";
  return (
    <div className="min-w-[100px]">
      <div className="flex justify-between text-xs mb-1">
        <span className="tabular-nums">{fmtUsd(spend)}</span>
        <span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-muted-foreground mt-1 tabular-nums">of {fmtUsd(budget)}</div>
    </div>
  );
}

function RoasBadge({ roas }: { roas: number | null }) {
  if (roas == null) return <span className="text-sm text-muted-foreground">—</span>;
  const color = roas >= 4 ? "text-emerald-400" : roas >= 2.5 ? "text-blue-400" : "text-amber-400";
  return <span className={`text-sm font-semibold tabular-nums ${color}`}>{roas.toFixed(1)}×</span>;
}

function fmtObjective(raw: string | null) {
  if (!raw) return null;
  return raw.replace(/^OUTCOME_/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugToLabel(slug: string | null) {
  if (!slug) return "—";
  return slug.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ─── Page ──────────────────────────────────────────────────────────────────

interface Props {
  searchParams: Promise<{ client?: string }>;
}

export default async function CampaignsPage({ searchParams }: Props) {
  const { client } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;

  const { campaigns, clients, fromDb } = await getCampaigns(clientSlug);

  const totalSpend = campaigns.reduce((s, c) => s + (centsToUsd(c.spend) ?? 0), 0);
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions ?? 0), 0);
  const totalClicks = campaigns.reduce((s, c) => s + (c.clicks ?? 0), 0);
  const totalRevenue = campaigns.reduce((s, c) => s + (centsToUsd(c.spend) ?? 0) * (c.roas ?? 0), 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const overallCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Facebook and Instagram ad campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          {fromDb ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live from Supabase
            </span>
          ) : (
            <span className="text-xs text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded">
              No data
            </span>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spend",  value: fmtUsd(totalSpend),        icon: DollarSign, accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
          { label: "Avg. ROAS",    value: avgRoas > 0 ? avgRoas.toFixed(1) + "x" : "---", icon: TrendingUp, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
          { label: "Impressions",  value: fmtNum(totalImpressions),  icon: Eye, accent: "from-blue-500/20 to-indigo-500/20", iconColor: "text-blue-400" },
          { label: "Clicks / CTR", value: fmtNum(totalClicks) + (overallCtr > 0 ? ` (${overallCtr.toFixed(1)}%)` : ""), icon: MousePointerClick, accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
        ].map(({ label, value, icon: Icon, accent, iconColor }) => (
          <div key={label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className={`h-7 w-7 rounded-lg bg-white/[0.06] flex items-center justify-center ${iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Campaigns table */}
      <Card className="border-border/60">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="text-sm font-semibold">
            {clientSlug ? slugToLabel(clientSlug) : "All clients"}
            <span className="text-muted-foreground font-normal ml-1.5">({campaigns.length})</span>
          </p>
          <Suspense>
            <ClientFilter clients={clients} selected={clientSlug ?? "all"} />
          </Suspense>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Campaign</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Budget spent</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">ROAS</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Impressions</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">CTR</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">CPC</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-xs text-muted-foreground">
                  {fromDb ? "No campaigns match this filter" : "No campaign data — run the Meta sync agent to pull live data"}
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id} className="border-border/60">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{slugToLabel(c.client_slug)}</span>
                        <span className="text-xs text-muted-foreground/50">·</span>
                        <span className="text-xs text-muted-foreground">{fmtObjective(c.objective)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell>
                    <BudgetBar
                      spend={centsToUsd(c.spend)}
                      budget={centsToUsd(c.lifetime_budget ?? c.daily_budget)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <RoasBadge roas={c.roas} />
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                    {fmtNum(c.impressions)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                    {c.ctr != null ? c.ctr.toFixed(2) + "%" : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                    {c.cpc != null ? "$" + c.cpc.toFixed(2) : "—"}
                  </TableCell>
                  <TableCell>
                    <a
                      href="https://www.facebook.com/adsmanager"
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {!fromDb && (
        <Card className="border-border/60 border-dashed">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Megaphone className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">No campaign data</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Run the Meta sync agent to pull live data from the Meta Marketing API
                  </p>
                </div>
              </div>
              <a
                href="/admin/agents"
                className="text-xs border border-border/60 px-3 py-1.5 rounded hover:bg-muted transition-colors shrink-0"
              >
                Run Agent
              </a>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
