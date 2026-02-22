import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Megaphone, TrendingUp, MousePointerClick } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { RoasTrendChart, SpendTrendChart } from "@/components/charts/roas-trend-chart";

type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
}

// --- Data fetching ---

async function getCampaigns(slug: string) {
  if (!supabaseAdmin) return { campaigns: [], snapshots: [], fromDb: false };

  const [campaignsRes] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select("*")
      .eq("client_slug", slug)
      .order("spend", { ascending: false })
      .limit(50),
  ]);

  const campaigns = (campaignsRes.data ?? []) as MetaCampaign[];
  const campaignIds = campaigns.map((c) => c.campaign_id);

  let snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null; campaign_id: string }> = [];
  if (campaignIds.length > 0) {
    const { data } = await supabaseAdmin
      .from("campaign_snapshots")
      .select("snapshot_date, roas, spend, campaign_id")
      .in("campaign_id", campaignIds)
      .order("snapshot_date", { ascending: true })
      .limit(500);
    snapshots = data ?? [];
  }

  return { campaigns, snapshots, fromDb: Boolean(campaigns.length) };
}

function buildTrendData(snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null }>) {
  const byDate: Record<string, { roasSum: number; roasCount: number; spendSum: number }> = {};
  for (const s of snapshots) {
    const d = s.snapshot_date;
    if (!byDate[d]) byDate[d] = { roasSum: 0, roasCount: 0, spendSum: 0 };
    if (s.roas != null) { byDate[d].roasSum += s.roas; byDate[d].roasCount++; }
    if (s.spend != null) byDate[d].spendSum += s.spend / 100; // cents to dollars
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      roas: v.roasCount > 0 ? v.roasSum / v.roasCount : 0,
      spend: v.spendSum,
    }));
}

// --- Helpers ---

function centsToUsd(cents: number | null) { return cents == null ? null : cents / 100; }
function fmtObjective(raw: string | null) {
  if (!raw) return null;
  return raw.replace(/^OUTCOME_/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtUsd(n: number | null) {
  if (n == null) return "--";
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtNum(n: number | null) {
  if (n == null) return "--";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString("en-US");
}

function statusDot(s: string) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-400", active: "bg-emerald-400",
    PAUSED: "bg-amber-400", paused: "bg-amber-400",
    ARCHIVED: "bg-zinc-500",
  };
  return colors[s] ?? "bg-zinc-500";
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    ACTIVE: "Active", active: "Active",
    PAUSED: "Paused", paused: "Paused",
    ARCHIVED: "Archived",
  };
  return map[s] ?? s;
}

function slugToName(slug: string) {
  return slug.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// --- Page ---

export default async function ClientCampaigns({ params }: Props) {
  const { slug } = await params;
  const clientName = slugToName(slug);

  const { campaigns, snapshots, fromDb } = await getCampaigns(slug);
  const trendData = buildTrendData(snapshots);

  const totalSpend       = campaigns.reduce((a, c) => a + (centsToUsd(c.spend) ?? 0), 0);
  const totalRevenue     = campaigns.reduce((a, c) => a + (centsToUsd(c.spend) ?? 0) * (c.roas ?? 0), 0);
  const totalImpressions = campaigns.reduce((a, c) => a + (c.impressions ?? 0), 0);
  const blendedRoas      = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const heroStats = [
    {
      label: "Total Ad Spend",
      value: fmtUsd(totalSpend),
      sub: "last 30 days",
      icon: DollarSign,
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      label: "Ad Revenue",
      value: fmtUsd(totalRevenue),
      sub: "attributed to campaigns",
      icon: TrendingUp,
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      label: "Blended ROAS",
      value: blendedRoas > 0 ? blendedRoas.toFixed(1) + "x" : "--",
      sub: "return on ad spend",
      icon: Megaphone,
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "Total Impressions",
      value: fmtNum(totalImpressions),
      sub: "across all campaigns",
      icon: MousePointerClick,
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{clientName} Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">{now}</p>
        </div>
        <div className="flex items-center gap-4">
          <a href={`/client/${slug}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Back to overview
          </a>
          <div className="flex items-center gap-2">
            {fromDb ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span className="text-xs text-muted-foreground">Live data</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-xs text-muted-foreground">No data</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {heroStats.map(({ label, value, sub, icon: Icon, gradient, iconBg, iconColor }) => (
          <div key={label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className={`h-8 w-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trend charts */}
      {fromDb && trendData.length > 1 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-8">
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                ROAS Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoasTrendChart data={trendData} />
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Daily Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendTrendChart data={trendData} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaigns table */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-3">
          All Campaigns
          <span className="text-muted-foreground font-normal ml-2">({campaigns.length})</span>
        </h2>
        {campaigns.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card p-12 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No campaign data yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Syncs automatically every 6 hours</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground">Campaign</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Spend</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">ROAS</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Impressions</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">CTR</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">CPC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => {
                  const spend = centsToUsd(c.spend);
                  const revenue = spend != null && c.roas != null ? spend * c.roas : null;
                  return (
                    <TableRow key={c.id} className="border-border/40">
                      <TableCell>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot(c.status)}`} />
                          <div>
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{statusLabel(c.status)}{fmtObjective(c.objective) ? ` · ${fmtObjective(c.objective)}` : ""}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">{fmtUsd(spend)}</TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">{fmtUsd(revenue)}</TableCell>
                      <TableCell className="text-right">
                        <span className={`text-sm font-semibold tabular-nums ${
                          (c.roas ?? 0) >= 4 ? "text-emerald-400"
                          : (c.roas ?? 0) >= 2 ? "text-amber-400"
                          : c.roas != null ? "text-red-400"
                          : "text-muted-foreground"
                        }`}>
                          {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">{fmtNum(c.impressions)}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        {c.cpc != null ? "$" + c.cpc.toFixed(2) : "--"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 pt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Powered by Outlet Media</span>
        <span>Data syncs every 6 hours</span>
      </div>
    </>
  );
}
