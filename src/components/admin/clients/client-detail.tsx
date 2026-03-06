"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Megaphone,
  CalendarDays,
  TrendingUp,
  ImageIcon,
} from "lucide-react";
import { statusBadge } from "@/lib/formatters";
import { StatCard } from "@/components/admin/stat-card";
import { MembersSection } from "./members-section";
import { CampaignsSection } from "./campaigns-section";
import { AssetsSection } from "./assets-section";
import { ServicesSection } from "./services-section";
import { ClientCrmTab } from "./client-crm-tab";
import { ClientOverviewTab } from "./client-overview-tab";
import { EventsSection } from "./events-section";
import type { CrmDiscussionThread } from "@/features/crm-comments/server";
import type { CrmFollowUpItem } from "@/features/crm-follow-up-items/server";
import type { CrmOverview } from "@/features/crm/server";
import type { ClientDetail } from "@/app/admin/clients/data";
import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import type { DashboardOpsSummary } from "@/features/dashboard/summary";
import type { EventOperationsSummary } from "@/features/events/summary";
import type { SystemEvent } from "@/features/system-events/server";
import type { WorkQueueSummary } from "@/features/work-queue/summary";

type Tab =
  | "overview"
  | "members"
  | "campaigns"
  | "events"
  | "crm"
  | "assets"
  | "services";

interface Props {
  agentOutcomes: AgentOutcomeView[];
  client: ClientDetail;
  crmDiscussions: CrmDiscussionThread[];
  crmFollowUpItems: CrmFollowUpItem[];
  crmOverview: CrmOverview;
  eventOperations: EventOperationsSummary;
  opsSummary: DashboardOpsSummary;
  recentActivity: SystemEvent[];
  workQueue: WorkQueueSummary;
}

export function ClientDetailView({
  agentOutcomes,
  client,
  crmDiscussions,
  crmFollowUpItems,
  crmOverview,
  eventOperations,
  opsSummary,
  recentActivity,
  workQueue,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const roasDisplay = client.roas > 0 ? client.roas.toFixed(1) + "x" : "\u2014";

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview", count: client.needsAttention },
    { id: "members", label: "Members", count: client.memberCount },
    { id: "campaigns", label: "Campaigns", count: client.totalCampaigns },
    { id: "events", label: "Events", count: client.events.length },
    { id: "crm", label: "CRM", count: crmOverview.summary.totalContacts },
    { id: "assets", label: "Assets", count: client.assets.length },
    { id: "services", label: "Services", count: client.services.length },
  ];

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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        <StatCard
          icon={ImageIcon}
          label="Ad Assets"
          value={String(client.assets.length)}
          accent="bg-pink-500/10 text-pink-400"
          variant="compact"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 text-[10px] text-muted-foreground">
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <ClientOverviewTab
          agentOutcomes={agentOutcomes}
          clientSlug={client.slug}
          connectedAccounts={client.connectedAccounts}
          opsSummary={opsSummary}
          recentActivity={recentActivity}
          workQueue={workQueue}
        />
      )}
      {activeTab === "members" && <MembersSection client={client} />}
      {activeTab === "campaigns" && <CampaignsSection campaigns={client.campaigns} />}
      {activeTab === "events" && (
        <EventsSection events={client.events} summary={eventOperations} />
      )}
      {activeTab === "crm" && (
        <ClientCrmTab
          clientSlug={client.slug}
          discussions={crmDiscussions}
          followUpItems={crmFollowUpItems}
          overview={crmOverview}
        />
      )}
      {activeTab === "assets" && (
        <AssetsSection
          clientSlug={client.slug}
          initialAssets={client.assets}
          initialSources={client.assetSources}
        />
      )}
      {activeTab === "services" && (
        <ServicesSection
          clientId={client.id}
          initialServices={client.services}
        />
      )}
    </div>
  );
}
