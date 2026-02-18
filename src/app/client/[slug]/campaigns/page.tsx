import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Megaphone, TrendingUp, MousePointerClick } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { RoasTrendChart, SpendTrendChart } from "@/components/charts/roas-trend-chart";

type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Data fetching ─────────────────────────────────────────────────────────

async function getCampaigns(slug: string) {
  if (!supabaseAdmin) return { campaigns: [], snapshots: [], fromDb: false };

  const [campaignsRes, snapshotsRes] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select("*")
      .eq("client_slug", slug)
      .order("spend", { ascending: false })
      .limit(50),
    // Fetch last 30 days of snapshots for campaigns belonging to this client
    supabaseAdmin
      .from("campaign_snapshots")
      .select("snapshot_date, roas, spend, campaign_id")
      .in(
        "campaign_id",
        // Subquery workaround: fetch campaign_ids first, then filter
        // We'll post-filter in JS after getting all snapshots
        ["placeholder"] // will be replaced below
      )
      .order("snapshot_date", { ascending: true })
      .limit(500),
  ]);

  const campaigns = (campaignsRes.data ?? []) as MetaCampaign[];
  const campaignIds = campaigns.map((c) => c.campaign_id);

  // Re-fetch snapshots with real campaign IDs
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

// Aggregate snapshots by date for trend charts
function buildTrendData(snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null }>) {
  const byDate: Record<string, { roasSum: number; roasCount: number; spendSum: number }> = {};
  for (const s of snapshots) {
    const d = s.snapshot_date;
    if (!byDate[d]) byDate[d] = { roasSum: 0, roasCount: 0, spendSum: 0 };
    if (s.roas != null) { byDate[d].roasSum += s.roas; byDate[d].roasCount++; }
    if (s.spend != null) byDate[d].spendSum += s.spend / 100; // cents → dollars
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      roas: v.roasCount > 0 ? v.roasSum / v.roasCount : 0,
      spend: v.spendSum,
    }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function centsToUsd(cents: number | null) { return cents == null ? null : cents / 100; }

function fmtUsd(n: number | null) {
  if (n == null) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtNum(n: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString("en-US");
}

function statusDot(s: string) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-400",
    active: "bg-emerald-400",
    PAUSED: "bg-amber-400",
    paused: "bg-amber-400",
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

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function ClientCampaigns({ params }: Props) {
  const { slug } = await params;
  const clientName = slugToName(slug);

  const { campaigns, snapshots, fromDb } = await getCampaigns(slug);
  const trendData = buildTrendData(snapshots);

  const totalSpend      = campaigns.reduce((a, c) => a + (centsToUsd(c.spend) ?? 0), 0);
  const totalRevenue    = campaigns.reduce((a, c) => a + (centsToUsd(c.spend) ?? 0) * (c.roas ?? 0), 0);
  const totalImpressions = campaigns.reduce((a, c) => a + (c.impressions ?? 0), 0);
  const blendedRoas     = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const stats = [
    { label: "Total Ad Spend",    value: fmtUsd(totalSpend),       sub: "last 30 days",              icon: DollarSign       },
    { label: "Ad Revenue",        value: fmtUsd(totalRevenue),     sub: "attributed to campaigns",   icon: TrendingUp       },
    { label: "Blended ROAS",      value: blendedRoas > 0 ? blendedRoas.toFixed(1) + "×" : "—", sub: "return on ad spend", icon: Megaphone },
    { label: "Total Impressions", value: fmtNum(totalImpressions), sub: "across all campaigns",      icon: MousePointerClick },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-foreground text-background flex items-center justify-center text-xs font-bold">
              {clientName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{clientName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ad Campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href={`/client/${slug}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Back to overview
            </a>
            <div className="flex items-center gap-2">
              {fromDb ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs text-muted-foreground">Live · {now}</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                  <span className="text-xs text-muted-foreground">No data · {now}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, sub, icon: Icon }) => (
            <Card key={label} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground/60" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trend charts */}
        {fromDb && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  ROAS Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RoasTrendChart data={trendData} />
              </CardContent>
            </Card>
            <Card className="border-border/60">
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
        <div>
          <h2 className="text-sm font-semibold mb-3">
            All Campaigns
            <span className="text-muted-foreground font-normal ml-2">({campaigns.length})</span>
          </h2>
          <Card className="border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
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
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                      No campaign data yet — syncs automatically every 6 hours
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((c) => {
                    const spend = centsToUsd(c.spend);
                    const revenue = spend != null && c.roas != null ? spend * c.roas : null;
                    return (
                      <TableRow key={c.id} className="border-border/60">
                        <TableCell>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot(c.status)}`} />
                            <div>
                              <p className="text-sm font-medium">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{statusLabel(c.status)} · {c.objective}</p>
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
                            {c.roas != null ? c.roas.toFixed(1) + "×" : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums text-muted-foreground">{fmtNum(c.impressions)}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                          {c.ctr != null ? (c.ctr * 100).toFixed(1) + "%" : "—"}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                          {c.cpc != null ? "$" + c.cpc.toFixed(2) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 pt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Powered by Outlet Media</span>
          <span>Data syncs every 6 hours</span>
        </div>

      </div>
    </div>
  );
}
