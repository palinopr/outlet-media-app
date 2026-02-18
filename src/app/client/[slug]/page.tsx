import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  DollarSign,
  Megaphone,
  Ticket,
  TrendingUp,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Mock data (replace with Supabase queries once connected) ──────────────

const mockShows = [
  {
    tm1: "1A2B3C4D5",
    event: "Spring Tour 2026",
    venue: "Kaseya Center",
    city: "Miami, FL",
    date: "Mar 15, 2026",
    sold: 1247,
    capacity: 1500,
    gross: 187050,
    status: "on_sale",
  },
  {
    tm1: "2B3C4D5E6",
    event: "Spring Tour 2026",
    venue: "United Center",
    city: "Chicago, IL",
    date: "Apr 2, 2026",
    sold: 892,
    capacity: 2000,
    gross: 133800,
    status: "on_sale",
  },
  {
    tm1: "3C4D5E6F7",
    event: "Spring Tour 2026",
    venue: "Toyota Center",
    city: "Houston, TX",
    date: "Apr 19, 2026",
    sold: 543,
    capacity: 1200,
    gross: 81450,
    status: "on_sale",
  },
  {
    tm1: "4D5E6F7G8",
    event: "Spring Tour 2026",
    venue: "Crypto.com Arena",
    city: "Los Angeles, CA",
    date: "May 8, 2026",
    sold: 2100,
    capacity: 3500,
    gross: 315000,
    status: "on_sale",
  },
  {
    tm1: "5E6F7G8H9",
    event: "Spring Tour 2026",
    venue: "Madison Square Garden",
    city: "New York, NY",
    date: "May 22, 2026",
    sold: 3450,
    capacity: 5000,
    gross: 517500,
    status: "on_sale",
  },
];

const mockCampaigns = [
  {
    name: "Zamora Miami - Spring Tour",
    platform: "Facebook + Instagram",
    status: "active",
    spend: 4200,
    roas: 5.2,
    impressions: "1.2M",
    ctr: "2.4%",
    revenue: 21840,
  },
  {
    name: "Zamora Chicago - Q2 Push",
    platform: "Instagram",
    status: "active",
    spend: 2850,
    roas: 3.8,
    impressions: "890K",
    ctr: "1.9%",
    revenue: 10830,
  },
  {
    name: "Zamora National - Awareness",
    platform: "Facebook + Instagram",
    status: "active",
    spend: 8100,
    roas: 4.1,
    impressions: "3.4M",
    ctr: "1.7%",
    revenue: 33210,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function sellPct(sold: number, cap: number) {
  return Math.round((sold / cap) * 100);
}

function statusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    on_sale: {
      label: "On Sale",
      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    sold_out: {
      label: "Sold Out",
      classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    cancelled: {
      label: "Cancelled",
      classes: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    upcoming: {
      label: "Upcoming",
      classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  };
  const { label, classes } = map[s] ?? map.upcoming;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}
    >
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function ClientDashboard({ params }: Props) {
  const { slug } = await params;

  const totalSold = mockShows.reduce((a, s) => a + s.sold, 0);
  const totalCapacity = mockShows.reduce((a, s) => a + s.capacity, 0);
  const totalGross = mockShows.reduce((a, s) => a + s.gross, 0);
  const totalSpend = mockCampaigns.reduce((a, c) => a + c.spend, 0);
  const totalRevenue = mockCampaigns.reduce((a, c) => a + c.revenue, 0);
  const blendedRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : "—";

  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Active Shows",
      value: mockShows.length.toString(),
      sub: "Spring Tour 2026",
      icon: CalendarDays,
    },
    {
      label: "Tickets Sold",
      value: fmt(totalSold),
      sub: `of ${fmt(totalCapacity)} available`,
      icon: Ticket,
    },
    {
      label: "Total Gross",
      value: fmtUsd(totalGross),
      sub: "across all shows",
      icon: DollarSign,
    },
    {
      label: "Active Campaigns",
      value: mockCampaigns.length.toString(),
      sub: "Facebook + Instagram",
      icon: Megaphone,
    },
    {
      label: "Ad Spend",
      value: fmtUsd(totalSpend),
      sub: "this month",
      icon: DollarSign,
    },
    {
      label: "Blended ROAS",
      value: `${blendedRoas}×`,
      sub: "return on ad spend",
      icon: TrendingUp,
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
              <p className="text-xs text-muted-foreground mt-0.5">Campaign Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-xs text-muted-foreground">Updated {now}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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

        {/* Shows */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Your Shows</h2>
          <Card className="border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground w-28">TM1 #</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Event / Venue</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">City</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Sell-Through</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Gross</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockShows.map((s) => {
                  const pct = sellPct(s.sold, s.capacity);
                  const barColor =
                    pct >= 90
                      ? "bg-emerald-500"
                      : pct >= 60
                      ? "bg-amber-500"
                      : "bg-zinc-500";
                  return (
                    <TableRow key={s.tm1} className="border-border/60">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {s.tm1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{s.event}</p>
                          <p className="text-xs text-muted-foreground">{s.venue}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.city}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {s.date}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
                            {pct}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {fmt(s.sold)} / {fmt(s.capacity)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {fmtUsd(s.gross)}
                      </TableCell>
                      <TableCell>{statusBadge(s.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Campaigns */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Active Ad Campaigns</h2>
          <div className="space-y-3">
            {mockCampaigns.map((c) => (
              <Card key={c.name} className="border-border/60">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <p className="text-sm font-medium truncate">{c.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.platform}</p>
                    </div>
                    <div className="flex gap-6 shrink-0 sm:text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Ad Spend</p>
                        <p className="text-sm font-medium tabular-nums">{fmtUsd(c.spend)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-sm font-medium tabular-nums">{fmtUsd(c.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p
                          className={`text-sm font-semibold tabular-nums ${
                            c.roas >= 4
                              ? "text-emerald-400"
                              : c.roas >= 2
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {c.roas}×
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="text-sm font-medium tabular-nums">{c.impressions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-sm font-medium tabular-nums">{c.ctr}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 pt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Powered by Outlet Media</span>
          <span>Data updates every 2 hours via autonomous agent</span>
        </div>

      </div>
    </div>
  );
}
