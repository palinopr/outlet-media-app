import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClientSummaries } from "./data";
import { fmtUsd } from "@/lib/formatters";
import { StatCard } from "@/components/admin/stat-card";
import { ClientTable } from "@/components/admin/clients/client-table";
import {
  Users,
  BadgeCheck,
  MessageSquareMore,
  Image as ImageIcon,
} from "lucide-react";
import { compareClientWorkflowHealth } from "@/features/clients/summary";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function ClientsPage() {
  const clients = await getClientSummaries();

  const totalSpend = clients.reduce((s, c) => s + c.totalSpend, 0);
  const totalCampaigns = clients.reduce((s, c) => s + c.totalCampaigns, 0);
  const activeCampaigns = clients.reduce((s, c) => s + c.activeCampaigns, 0);
  const pendingApprovals = clients.reduce((s, c) => s + c.pendingApprovals, 0);
  const openDiscussions = clients.reduce((s, c) => s + c.openDiscussions, 0);
  const assetsNeedingReview = clients.reduce((s, c) => s + c.assetsNeedingReview, 0);
  const blendedRoas = totalSpend > 0
    ? clients.reduce((s, c) => s + c.totalRevenue, 0) / totalSpend
    : 0;
  const clientsNeedingAttention = clients.filter((client) => client.needsAttention > 0);
  const attentionClients = [...clientsNeedingAttention]
    .sort(compareClientWorkflowHealth)
    .slice(0, 6);

  const stats = [
    { label: "Clients Needing Attention", value: String(clientsNeedingAttention.length), sub: `${clients.length} total accounts`, icon: Users },
    { label: "Pending Approvals", value: String(pendingApprovals), sub: "decisions waiting", icon: BadgeCheck },
    { label: "Open Discussions", value: String(openDiscussions), sub: "threads needing a reply", icon: MessageSquareMore },
    { label: "Assets Needing Review", value: String(assetsNeedingReview), sub: `${activeCampaigns} active campaigns`, icon: ImageIcon },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">

      {/* Header */}
      <AdminPageHeader
        title="Clients"
        description="Manage promoter accounts, client access, and which accounts need an operating response right now."
      >
        <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
          {clientsNeedingAttention.length} need attention
        </Badge>
      </AdminPageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { ...stats[0], accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
          { ...stats[1], accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
          { ...stats[2], accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
          { ...stats[3], accent: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
        ].map((s) => (
          <StatCard key={s.label} {...s} size="lg" />
        ))}
      </div>

      <Card className="border-border/60">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Client health snapshot</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Accounts with the most pending approvals, discussions, next steps, and creative review pressure.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Blended ROAS</p>
              <p className="text-lg font-semibold">
                {blendedRoas > 0 ? `${blendedRoas.toFixed(1)}x` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">{fmtUsd(totalSpend)} spend across {totalCampaigns} campaigns</p>
            </div>
          </div>

          {attentionClients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
              No client accounts need operating attention right now.
            </div>
          ) : (
            <div className="grid gap-3 xl:grid-cols-3">
              {attentionClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="rounded-2xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{client.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {client.activeCampaigns} active campaigns · {fmtUsd(client.totalSpend)} spend
                      </p>
                    </div>
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
                      {client.needsAttention} pressure
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    {client.pendingApprovals > 0 ? <span>{client.pendingApprovals} approvals</span> : null}
                    {client.openDiscussions > 0 ? <span>{client.openDiscussions} discussions</span> : null}
                    {client.openActionItems > 0 ? <span>{client.openActionItems} next steps</span> : null}
                    {client.assetsNeedingReview > 0 ? <span>{client.assetsNeedingReview} assets to review</span> : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clients table */}
      <ClientTable clients={clients} />

      {/* Access note */}
      <Card className="border-border/60 border-dashed">
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            Clients get their own Clerk login at <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/sign-up</code>.
            Admins approve and assign them from the Users page.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
