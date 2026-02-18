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

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Mock data (replace with Supabase query once connected) ───────────────

const mockCampaigns = [
  {
    id: "c1",
    name: "Zamora Miami - Spring Tour",
    event: "Spring Tour 2026 - Kaseya Center",
    platform: "Facebook + Instagram",
    status: "active",
    spend: 4200,
    budget: 6000,
    roas: 5.2,
    revenue: 21840,
    impressions: 1_200_000,
    clicks: 28_800,
    ctr: 2.4,
    cpc: 0.15,
    startDate: "Feb 1, 2026",
  },
  {
    id: "c2",
    name: "Zamora Chicago - Q2 Push",
    event: "Spring Tour 2026 - United Center",
    platform: "Instagram",
    status: "active",
    spend: 2850,
    budget: 4000,
    roas: 3.8,
    revenue: 10830,
    impressions: 890_000,
    clicks: 16_910,
    ctr: 1.9,
    cpc: 0.17,
    startDate: "Feb 8, 2026",
  },
  {
    id: "c3",
    name: "Zamora National - Awareness",
    event: "Spring Tour 2026 - All Shows",
    platform: "Facebook + Instagram",
    status: "active",
    spend: 8100,
    budget: 12000,
    roas: 4.1,
    revenue: 33210,
    impressions: 3_400_000,
    clicks: 57_800,
    ctr: 1.7,
    cpc: 0.14,
    startDate: "Jan 25, 2026",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function fmtUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString("en-US");
}

function statusDot(s: string) {
  const colors: Record<string, string> = {
    active: "bg-emerald-400",
    paused: "bg-amber-400",
    completed: "bg-zinc-500",
  };
  return colors[s] ?? "bg-zinc-500";
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function ClientCampaigns({ params }: Props) {
  const { slug } = await params;
  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const totalSpend = mockCampaigns.reduce((a, c) => a + c.spend, 0);
  const totalRevenue = mockCampaigns.reduce((a, c) => a + c.revenue, 0);
  const totalImpressions = mockCampaigns.reduce((a, c) => a + c.impressions, 0);
  const blendedRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : "—";

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Total Ad Spend",
      value: fmtUsd(totalSpend),
      sub: "this month",
      icon: DollarSign,
    },
    {
      label: "Ad Revenue",
      value: fmtUsd(totalRevenue),
      sub: "attributed to campaigns",
      icon: TrendingUp,
    },
    {
      label: "Blended ROAS",
      value: `${blendedRoas}×`,
      sub: "return on ad spend",
      icon: Megaphone,
    },
    {
      label: "Total Impressions",
      value: fmtNum(totalImpressions),
      sub: "across all campaigns",
      icon: MousePointerClick,
    },
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
            <a
              href={`/client/${slug}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Overview
            </a>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs text-muted-foreground">Updated {now}</span>
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

        {/* Campaigns table */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Active Campaigns</h2>
          <Card className="border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground">Campaign</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Budget Used</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Spend</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">ROAS</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Impressions</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">CTR</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">CPC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((c) => {
                  const budgetPct = Math.round((c.spend / c.budget) * 100);
                  const budgetBarColor =
                    budgetPct >= 90
                      ? "bg-red-500"
                      : budgetPct >= 70
                      ? "bg-amber-500"
                      : "bg-emerald-500";
                  return (
                    <TableRow key={c.id} className="border-border/60">
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot(c.status)}`} />
                            <p className="text-sm font-medium">{c.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground pl-3.5">{c.event}</p>
                          <p className="text-xs text-muted-foreground pl-3.5">{c.platform} &middot; since {c.startDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[90px]">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${budgetBarColor}`}
                                style={{ width: `${Math.min(budgetPct, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums text-muted-foreground w-7 text-right">
                              {budgetPct}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {fmtUsd(c.spend)} / {fmtUsd(c.budget)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {fmtUsd(c.spend)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {fmtUsd(c.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            c.roas >= 4
                              ? "text-emerald-400"
                              : c.roas >= 2
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {c.roas}×
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        {fmtNum(c.impressions)}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        {c.ctr}%
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        ${c.cpc.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* How it works note */}
        <Card className="border-border/60 border-dashed">
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">
              Campaign data syncs automatically every 6 hours via the Outlet Media Meta Ads agent.
              Spend and ROAS numbers reflect real Meta Ads Manager data once connected.
              Questions about your campaigns? Contact your Outlet Media account manager.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="border-t border-border/60 pt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Powered by Outlet Media</span>
          <span>Data syncs every 6 hours</span>
        </div>

      </div>
    </div>
  );
}
