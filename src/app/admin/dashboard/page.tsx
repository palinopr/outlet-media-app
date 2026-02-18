import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  Bot,
  Clock,
} from "lucide-react";

// ─── Mock data (replace with Supabase queries once connected) ──────────────

const stats = [
  {
    label: "Active Shows",
    value: "8",
    sub: "2 on sale this week",
    icon: CalendarDays,
    trend: "+2",
  },
  {
    label: "Tickets Sold",
    value: "12,847",
    sub: "of 18,200 available",
    icon: Ticket,
    trend: "+843 today",
  },
  {
    label: "Total Gross",
    value: "$2.1M",
    sub: "across all shows",
    icon: DollarSign,
    trend: "+$127K this week",
  },
  {
    label: "Active Campaigns",
    value: "3",
    sub: "Facebook + Instagram",
    icon: Megaphone,
    trend: null,
  },
  {
    label: "Ad Spend",
    value: "$24,580",
    sub: "this month",
    icon: DollarSign,
    trend: null,
  },
  {
    label: "Avg. ROAS",
    value: "4.2×",
    sub: "return on ad spend",
    icon: TrendingUp,
    trend: "+0.3 vs last month",
  },
];

const shows = [
  {
    tm1: "1A2B3C4D5",
    artist: "Zamora",
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
    artist: "Zamora",
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
    artist: "Zamora",
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
    artist: "Zamora",
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
    artist: "Zamora",
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

const campaigns = [
  {
    name: "Zamora Miami - Spring Tour",
    platform: "Facebook + Instagram",
    status: "active",
    spend: 4200,
    roas: 5.2,
    impressions: "1.2M",
    ctr: "2.4%",
  },
  {
    name: "Zamora Chicago - Q2 Push",
    platform: "Instagram",
    status: "active",
    spend: 2850,
    roas: 3.8,
    impressions: "890K",
    ctr: "1.9%",
  },
  {
    name: "Zamora National - Awareness",
    platform: "Facebook + Instagram",
    status: "active",
    spend: 8100,
    roas: 4.1,
    impressions: "3.4M",
    ctr: "1.7%",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

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
    on_sale: { label: "On Sale", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    sold_out: { label: "Sold Out", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    cancelled: { label: "Cancelled", classes: "bg-red-500/10 text-red-400 border-red-500/20" },
    upcoming: { label: "Upcoming", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  };
  const { label, classes } = map[s] ?? map.upcoming;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{now}</p>
        </div>
        <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
          Live data once connected
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(({ label, value, sub, icon: Icon, trend }) => (
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
              {trend && (
                <p className="text-xs text-emerald-400 mt-1.5 font-medium">{trend}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shows table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active Shows</h2>
          <a href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </a>
        </div>
        <Card className="border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground w-28">TM1 #</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Event</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">City</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Sold</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Gross</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shows.map((s) => (
                <TableRow key={s.tm1} className="border-border/60">
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.tm1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{s.artist}</p>
                      <p className="text-xs text-muted-foreground">{s.venue}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.city}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{s.date}</TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm font-medium tabular-nums">{fmt(s.sold)}</p>
                      <p className="text-xs text-muted-foreground">{sellPct(s.sold, s.capacity)}% of {fmt(s.capacity)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="text-sm font-medium tabular-nums">{fmtUsd(s.gross)}</p>
                  </TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Campaigns + Agent status row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active campaigns */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Active Campaigns</h2>
            <a href="/admin/campaigns" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <Card key={c.name} className="border-border/60">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <p className="text-sm font-medium truncate">{c.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.platform}</p>
                    </div>
                    <div className="flex gap-6 shrink-0 text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Spend</p>
                        <p className="text-sm font-medium tabular-nums">{fmtUsd(c.spend)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className="text-sm font-semibold text-emerald-400 tabular-nums">{c.roas}×</p>
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

        {/* Agent status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Agents</h2>
            <a href="/admin/agents" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Manage →
            </a>
          </div>
          <div className="space-y-3">
            <Card className="border-border/60">
              <CardContent className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">TM One Monitor</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                    <Zap className="h-3 w-3" />
                    Idle
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last run: not started
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Meta Ads Manager</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                    <Zap className="h-3 w-3" />
                    Idle
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last run: not started
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 border-dashed">
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground text-center">
                  Start the agent to enable<br />autonomous monitoring
                </p>
                <div className="mt-3 text-center">
                  <code className="text-xs bg-muted px-2 py-1 rounded">cd agent && npm start</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
