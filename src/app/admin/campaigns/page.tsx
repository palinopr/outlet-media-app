import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Megaphone, ExternalLink, Plus, DollarSign, TrendingUp, Eye, MousePointerClick } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

// ─── Mock fallback ─────────────────────────────────────────────────────────

const MOCK: MetaCampaign[] = [
  { id: "c1", campaign_id: "c1", name: "Zamora Miami - Spring Tour", status: "ACTIVE", objective: "CONVERSIONS", daily_budget: null, lifetime_budget: 600000, spend: 4200, roas: 5.2, impressions: 1210000, clicks: 29040, reach: 890000, cpm: 3.47, cpc: 0.14, ctr: 0.024, client_slug: "zamora", tm_event_id: null, synced_at: "", created_at: "", updated_at: "" },
  { id: "c2", campaign_id: "c2", name: "Zamora Chicago - Q2 Push", status: "ACTIVE", objective: "CONVERSIONS", daily_budget: null, lifetime_budget: 400000, spend: 2850, roas: 3.8, impressions: 892000, clicks: 16948, reach: 640000, cpm: 3.19, cpc: 0.17, ctr: 0.019, client_slug: "zamora", tm_event_id: null, synced_at: "", created_at: "", updated_at: "" },
  { id: "c3", campaign_id: "c3", name: "Zamora National - Awareness", status: "ACTIVE", objective: "REACH", daily_budget: null, lifetime_budget: 1200000, spend: 8100, roas: 4.1, impressions: 3420000, clicks: 58140, reach: 2800000, cpm: 2.37, cpc: 0.14, ctr: 0.017, client_slug: "zamora", tm_event_id: null, synced_at: "", created_at: "", updated_at: "" },
  { id: "c4", campaign_id: "c4", name: "Zamora Houston - Early Access", status: "PAUSED", objective: "CONVERSIONS", daily_budget: null, lifetime_budget: 200000, spend: 1340, roas: 2.1, impressions: 420000, clicks: 6300, reach: 310000, cpm: 3.19, cpc: 0.21, ctr: 0.015, client_slug: "zamora", tm_event_id: null, synced_at: "", created_at: "", updated_at: "" },
];

// ─── Data fetching ─────────────────────────────────────────────────────────

async function getCampaigns(): Promise<{ campaigns: MetaCampaign[]; fromDb: boolean }> {
  if (!supabaseAdmin) return { campaigns: MOCK, fromDb: false };

  const { data, error } = await supabaseAdmin
    .from("meta_campaigns")
    .select("*")
    .order("spend", { ascending: false })
    .limit(100);

  if (error || !data?.length) return { campaigns: MOCK, fromDb: false };
  return { campaigns: data as MetaCampaign[], fromDb: true };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmtUsd(n: number | null) {
  if (n == null) return "—";
  return "$" + n.toLocaleString("en-US");
}
function fmtNum(n: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

// Meta stores budgets and spend in cents
function budgetDollars(n: number | null) {
  if (n == null) return null;
  return n / 100;
}
function spendDollars(n: number | null) {
  if (n == null) return null;
  return n / 100;
}

function statusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    ACTIVE:    { label: "Active",    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    PAUSED:    { label: "Paused",    classes: "bg-amber-500/10  text-amber-400  border-amber-500/20" },
    ARCHIVED:  { label: "Archived",  classes: "bg-zinc-500/10   text-zinc-400   border-zinc-500/20" },
    DELETED:   { label: "Deleted",   classes: "bg-red-500/10    text-red-400    border-red-500/20" },
    // lowercase variants from mock
    active:    { label: "Active",    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    paused:    { label: "Paused",    classes: "bg-amber-500/10  text-amber-400  border-amber-500/20" },
  };
  const { label, classes } = map[s] ?? { label: s, classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
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

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function CampaignsPage() {
  const { campaigns, fromDb } = await getCampaigns();

  const totalSpend = campaigns.reduce((s, c) => s + (spendDollars(c.spend) ?? 0), 0);
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions ?? 0), 0);
  const totalClicks = campaigns.reduce((s, c) => s + (c.clicks ?? 0), 0);
  const totalRevenue = campaigns.reduce((s, c) => s + (spendDollars(c.spend) ?? 0) * (c.roas ?? 0), 0);
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
              Mock data
            </span>
          )}
          <Button size="sm" className="gap-2 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spend",  value: fmtUsd(totalSpend),        icon: DollarSign },
          { label: "Avg. ROAS",    value: avgRoas > 0 ? avgRoas.toFixed(1) + "×" : "—", icon: TrendingUp },
          { label: "Impressions",  value: fmtNum(totalImpressions),  icon: Eye },
          { label: "Clicks",       value: fmtNum(totalClicks) + (overallCtr > 0 ? ` (${overallCtr.toFixed(1)}% CTR)` : ""), icon: MousePointerClick },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <Icon className="h-4 w-4 text-muted-foreground/60" />
              </div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns table */}
      <Card className="border-border/60">
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
            {campaigns.map((c) => (
              <TableRow key={c.id} className="border-border/60">
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{c.client_slug ?? "—"}</span>
                      <span className="text-xs text-muted-foreground/50">·</span>
                      <span className="text-xs text-muted-foreground">{c.objective}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell>
                  <BudgetBar spend={spendDollars(c.spend)} budget={budgetDollars(c.lifetime_budget ?? c.daily_budget)} />
                </TableCell>
                <TableCell className="text-right">
                  <RoasBadge roas={c.roas} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {fmtNum(c.impressions)}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {c.ctr != null ? (c.ctr * 100).toFixed(1) + "%" : "—"}
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
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Connect Meta CTA - only show when no live data */}
      {!fromDb && (
        <Card className="border-border/60 border-dashed">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Megaphone className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Connect Meta Ads</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Start the agent to pull live campaign data from the Meta Marketing API
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-2 h-8 text-xs shrink-0" asChild>
                <a href="/admin/agents">
                  Run Agent
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
