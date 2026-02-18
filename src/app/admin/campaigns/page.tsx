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

// ─── Mock data – replaced by Meta API / Supabase when connected ───────────

const campaigns = [
  {
    id: "c1",
    name: "Zamora Miami – Spring Tour",
    event: "Miami, FL · Mar 15",
    platform: "Facebook + Instagram",
    objective: "CONVERSIONS",
    status: "active",
    budget: 6000,
    spend: 4200,
    roas: 5.2,
    revenue: 21840,
    impressions: 1_210_000,
    reach: 890_000,
    clicks: 29_040,
    ctr: 2.4,
    cpc: 0.14,
    cpm: 3.47,
  },
  {
    id: "c2",
    name: "Zamora Chicago – Q2 Push",
    event: "Chicago, IL · Apr 2",
    platform: "Instagram",
    objective: "CONVERSIONS",
    status: "active",
    budget: 4000,
    spend: 2850,
    roas: 3.8,
    revenue: 10830,
    impressions: 892_000,
    reach: 640_000,
    clicks: 16_948,
    ctr: 1.9,
    cpc: 0.17,
    cpm: 3.19,
  },
  {
    id: "c3",
    name: "Zamora National – Awareness",
    event: "All shows",
    platform: "Facebook + Instagram",
    objective: "REACH",
    status: "active",
    budget: 12000,
    spend: 8100,
    roas: 4.1,
    revenue: 33210,
    impressions: 3_420_000,
    reach: 2_800_000,
    clicks: 58_140,
    ctr: 1.7,
    cpc: 0.14,
    cpm: 2.37,
  },
  {
    id: "c4",
    name: "Zamora Houston – Early Access",
    event: "Houston, TX · Apr 19",
    platform: "Facebook",
    objective: "CONVERSIONS",
    status: "paused",
    budget: 2000,
    spend: 1340,
    roas: 2.1,
    revenue: 2814,
    impressions: 420_000,
    reach: 310_000,
    clicks: 6_300,
    ctr: 1.5,
    cpc: 0.21,
    cpm: 3.19,
  },
];

const totalSpend    = campaigns.reduce((s, c) => s + c.spend, 0);
const totalRevenue  = campaigns.reduce((s, c) => s + c.revenue, 0);
const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
const totalClicks   = campaigns.reduce((s, c) => s + c.clicks, 0);
const avgRoas       = totalSpend > 0 ? totalRevenue / totalSpend : 0;
const overallCtr    = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmtUsd(n: number) { return "$" + n.toLocaleString("en-US"); }
function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

function statusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    active:    { label: "Active",    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    paused:    { label: "Paused",    classes: "bg-amber-500/10  text-amber-400  border-amber-500/20" },
    completed: { label: "Completed", classes: "bg-zinc-500/10   text-zinc-400   border-zinc-500/20" },
    error:     { label: "Error",     classes: "bg-red-500/10    text-red-400    border-red-500/20" },
  };
  const { label, classes } = map[s] ?? map.paused;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

function BudgetBar({ spend, budget }: { spend: number; budget: number }) {
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

function RoasBadge({ roas }: { roas: number }) {
  const color = roas >= 4 ? "text-emerald-400" : roas >= 2.5 ? "text-blue-400" : "text-amber-400";
  return <span className={`text-sm font-semibold tabular-nums ${color}`}>{roas.toFixed(1)}×</span>;
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
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
          <span className="text-xs text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded">
            Mock data
          </span>
          <Button size="sm" className="gap-2 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spend",      value: fmtUsd(totalSpend),         icon: DollarSign },
          { label: "Avg. ROAS",        value: avgRoas.toFixed(1) + "×",   icon: TrendingUp },
          { label: "Impressions",      value: fmtNum(totalImpressions),   icon: Eye },
          { label: "Clicks",           value: fmtNum(totalClicks) + ` (${overallCtr.toFixed(1)}% CTR)`, icon: MousePointerClick },
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
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Revenue</TableHead>
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
                      <span className="text-xs text-muted-foreground">{c.event}</span>
                      <span className="text-xs text-muted-foreground/50">·</span>
                      <span className="text-xs text-muted-foreground">{c.platform}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell>
                  <BudgetBar spend={c.spend} budget={c.budget} />
                </TableCell>
                <TableCell className="text-right">
                  <RoasBadge roas={c.roas} />
                </TableCell>
                <TableCell className="text-right text-sm font-medium tabular-nums">
                  {fmtUsd(c.revenue)}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {fmtNum(c.impressions)}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {c.ctr.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  ${c.cpc.toFixed(2)}
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

      {/* Connect Meta CTA */}
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
                  Add <code className="bg-muted px-1 rounded text-xs">META_ACCESS_TOKEN</code> and <code className="bg-muted px-1 rounded text-xs">META_AD_ACCOUNT_ID</code> to your .env to see live data
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="gap-2 h-8 text-xs shrink-0" asChild>
              <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Meta Developers
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
