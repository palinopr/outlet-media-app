"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Megaphone,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { statusBadge } from "@/lib/formatters";
import { StatCard } from "@/components/admin/stat-card";
import { MembersSection } from "./members-section";
import { CampaignsSection } from "./campaigns-section";
import type { ClientDetail } from "@/app/admin/clients/data";

interface Props {
  client: ClientDetail;
}

export function ClientDetailView({ client }: Props) {
  const roasDisplay = client.roas > 0 ? client.roas.toFixed(1) + "x" : "\u2014";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Clients
      </Link>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <div className="flex items-center gap-3">
            <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {client.slug}
            </code>
            {statusBadge(client.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Members"
          value={String(client.memberCount)}
          accent="bg-blue-500/10 text-blue-400"
          variant="compact"
        />
        <StatCard
          icon={Megaphone}
          label="Active Campaigns"
          value={`${client.activeCampaigns} / ${client.totalCampaigns}`}
          accent="bg-purple-500/10 text-purple-400"
          variant="compact"
        />
        <StatCard
          icon={CalendarDays}
          label="Shows"
          value={String(client.activeShows)}
          accent="bg-amber-500/10 text-amber-400"
          variant="compact"
        />
        <StatCard
          icon={TrendingUp}
          label="ROAS"
          value={roasDisplay}
          accent="bg-emerald-500/10 text-emerald-400"
          variant="compact"
        />
      </div>

      <MembersSection client={client} />
      <CampaignsSection campaigns={client.campaigns} />
    </div>
  );
}
