import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClientSummaries } from "./data";
import { fmtUsd } from "@/lib/formatters";
import { StatCard } from "@/components/admin/stat-card";
import { ClientTable } from "@/components/admin/clients/client-table";
import {
  Users,
  DollarSign,
  Megaphone,
  TrendingUp,
} from "lucide-react";

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
          { ...stats[3], accent: "from-rose-500/20 to-pink-500/20", iconColor: "text-rose-400" },
        ].map((s) => (
          <StatCard key={s.label} {...s} size="lg" />
        ))}
      </div>

      {/* Clients table */}
      <ClientTable clients={clients} />

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
