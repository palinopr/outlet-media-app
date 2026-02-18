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
import { CopyButton } from "@/components/admin/copy-button";
import {
  Users,
  DollarSign,
  Megaphone,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

// ─── Mock data (replace with Supabase query once connected) ───────────────

const clients = [
  {
    id: "zamora",
    name: "Zamora",
    slug: "zamora",
    type: "Music Promoter",
    status: "active",
    joinedAt: "Jan 2026",
    activeShows: 8,
    activeCampaigns: 3,
    totalSpend: 24580,
    totalRevenue: 103236,
    roas: 4.2,
    lastActivity: "2 hours ago",
  },
];

const stats = [
  { label: "Total Clients", value: "1", sub: "1 active", icon: Users },
  { label: "Total Ad Spend", value: "$24,580", sub: "across all clients", icon: DollarSign },
  { label: "Active Campaigns", value: "3", sub: "running now", icon: Megaphone },
  { label: "Blended ROAS", value: "4.2×", sub: "avg return on ad spend", icon: TrendingUp },
];

function statusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    active: {
      label: "Active",
      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    paused: {
      label: "Paused",
      classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    inactive: {
      label: "Inactive",
      classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    },
  };
  const { label, classes } = map[s] ?? map.inactive;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}
    >
      {label}
    </span>
  );
}

function fmtUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage promoter accounts and their client portal access
          </p>
        </div>
        <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
          {clients.length} active
        </Badge>
      </div>

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

      {/* Clients table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">All Clients</h2>
        </div>
        <Card className="border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Client</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Shows</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Campaigns</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Total Spend</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Revenue</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">ROAS</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Portal</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => {
                const portalUrl = `/client/${c.slug}`;
                return (
                  <TableRow key={c.id} className="border-border/60">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.type} &middot; joined {c.joinedAt}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {c.activeShows}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {c.activeCampaigns}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">
                      {fmtUsd(c.totalSpend)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">
                      {fmtUsd(c.totalRevenue)}
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open
                        </a>
                        <CopyButton text={`/client/${c.slug}`} />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.lastActivity}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Portal info card */}
      <Card className="border-border/60 border-dashed">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Client Portal Access</p>
              <p className="text-xs text-muted-foreground mt-1">
                Each client gets a private URL at{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  /client/[slug]
                </code>
                . Share the link - no login required from the client side (Clerk
                protects admin routes only).
              </p>
            </div>
            <div className="shrink-0">
              <code className="text-xs bg-muted px-3 py-1.5 rounded block text-center">
                /client/zamora
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
