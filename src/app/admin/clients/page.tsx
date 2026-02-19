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
import { supabaseAdmin } from "@/lib/supabase";
import {
  Users,
  DollarSign,
  Megaphone,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ClientSummary {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  joinedAt: string;
  activeShows: number;
  activeCampaigns: number;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
}

// Derive a display name from a slug (e.g. "happy_paws" → "Happy Paws")
function slugToName(slug: string) {
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Data fetching ─────────────────────────────────────────────────────────

async function getClientSummaries(): Promise<ClientSummary[]> {
  if (!supabaseAdmin) return [];

  // Fetch all campaigns in one query — group by client_slug in JS
  const { data: campaigns } = await supabaseAdmin
    .from("meta_campaigns")
    .select("client_slug, status, spend, roas");

  if (!campaigns?.length) return [];

  // Group by slug
  const bySlug: Record<string, typeof campaigns> = {};
  for (const c of campaigns) {
    const slug = c.client_slug ?? "unknown";
    (bySlug[slug] ??= []).push(c);
  }

  return Object.entries(bySlug).map(([slug, rows]) => {
    const totalSpend = rows.reduce((s, c) => s + ((c.spend ?? 0) / 100), 0);
    const totalRevenue = rows.reduce((s, c) => s + ((c.spend ?? 0) / 100) * (c.roas ?? 0), 0);
    const activeCampaigns = rows.filter((c) => c.status === "ACTIVE").length;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    return {
      id: slug,
      name: slugToName(slug),
      slug,
      type: "Music Promoter",
      status: activeCampaigns > 0 ? "active" : "paused",
      joinedAt: "Jan 2026",
      activeShows: 0,         // TM1 not connected yet
      activeCampaigns,
      totalSpend,
      totalRevenue,
      roas,
    };
  });
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmtUsd(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

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
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function ClientsPage() {
  const clients = await getClientSummaries();

  const totalSpend = clients.reduce((s, c) => s + c.totalSpend, 0);
  const totalCampaigns = clients.reduce((s, c) => s + c.activeCampaigns, 0);
  const blendedRoas = totalSpend > 0
    ? clients.reduce((s, c) => s + c.totalRevenue, 0) / totalSpend
    : 0;

  const stats = [
    { label: "Total Clients",    value: String(clients.length),         sub: `${clients.length} active`,        icon: Users      },
    { label: "Total Ad Spend",   value: fmtUsd(totalSpend),             sub: "across all clients",              icon: DollarSign },
    { label: "Active Campaigns", value: String(totalCampaigns),         sub: "running now",                     icon: Megaphone  },
    { label: "Blended ROAS",     value: blendedRoas > 0 ? blendedRoas.toFixed(1) + "x" : "—", sub: "avg return on ad spend", icon: TrendingUp },
  ];

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
        {[
          { ...stats[0], accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
          { ...stats[1], accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
          { ...stats[2], accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
          { ...stats[3], accent: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
        ].map(({ label, value, sub, icon: Icon, accent, iconColor }) => (
          <div key={label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className={`h-7 w-7 rounded-lg bg-white/[0.06] flex items-center justify-center ${iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
            </div>
          </div>
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
                        {c.roas > 0 ? c.roas.toFixed(1) + "x" : "—"}
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
                . Share the link — no login required from the client side (Clerk
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
