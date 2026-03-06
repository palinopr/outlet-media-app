import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  DollarSign,
  MousePointerClick,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EventCommentsPanel } from "@/components/events/event-comments-panel";
import { EventFollowUpItemsPanel } from "@/components/events/event-follow-up-items-panel";
import { StatCard } from "@/components/admin/stat-card";
import { EventOperatingPanel } from "@/components/admin/events/event-operating-panel";
import { DashboardOpsSummarySection } from "@/components/dashboard/dashboard-ops-summary";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getDashboardOpsSummary } from "@/features/dashboard/server";
import { listEventComments } from "@/features/event-comments/server";
import { listEventFollowUpItems } from "@/features/event-follow-up-items/server";
import { getEventOperatingData } from "@/features/events/server";
import { listEventSystemEvents } from "@/features/system-events/server";
import { fmtDate, fmtNum, fmtUsd, slugToLabel } from "@/lib/formatters";

interface Props {
  params: Promise<{ eventId: string }>;
}

function eventSellThrough(sold: number, available: number | null) {
  if (available == null) return null;
  const capacity = sold + available;
  if (capacity <= 0) return null;
  return Math.round((sold / capacity) * 100);
}

export default async function AdminEventDetailPage({ params }: Props) {
  const { eventId } = await params;
  const { userId } = await auth();
  const data = await getEventOperatingData(eventId);
  if (!data) notFound();

  const { event, linkedCampaigns, clients } = data;
  const linkedCampaignIds = linkedCampaigns.map((campaign) => campaign.campaignId);
  const [opsSummary, events, agentOutcomes, comments, followUpItems] = await Promise.all([
    getDashboardOpsSummary({
      clientSlug: event.clientSlug ?? undefined,
      limit: 5,
      mode: "admin",
      scopeCampaignIds: linkedCampaignIds,
    }),
    listEventSystemEvents({
      audience: "all",
      clientSlug: event.clientSlug ?? undefined,
      eventId: event.id,
      limit: 8,
    }),
    listAgentOutcomes({
      audience: "all",
      clientSlug: event.clientSlug ?? undefined,
      limit: 4,
      scopeCampaignIds: linkedCampaignIds,
    }),
    listEventComments({
      audience: "all",
      eventId,
    }),
    listEventFollowUpItems({
      audience: "all",
      eventId,
      limit: 24,
    }),
  ]);

  const totalCampaignSpend = linkedCampaigns.reduce(
    (sum, campaign) => sum + ((campaign.spend ?? 0) / 100),
    0,
  );
  const averageRoas =
    linkedCampaigns.length > 0
      ? linkedCampaigns.reduce((sum, campaign) => sum + (campaign.roas ?? 0), 0) /
        linkedCampaigns.length
      : null;
  const sellThrough = eventSellThrough(event.ticketsSold, event.ticketsAvailable);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to events
        </Link>
      </div>

      <AdminPageHeader
        title={event.artist || event.name}
        description="Event operating view across ticketing, linked campaigns, and event activity."
      >
        <div className="flex flex-wrap items-center gap-2">
          {event.clientSlug ? (
            <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
              {slugToLabel(event.clientSlug)}
            </span>
          ) : (
            <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
              Unassigned client
            </span>
          )}
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {event.status}
          </span>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {fmtDate(event.date)}
          </span>
        </div>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Tickets sold"
          value={fmtNum(event.ticketsSold)}
          icon={Ticket}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Sell-through"
          value={sellThrough != null ? `${sellThrough}%` : "---"}
          icon={TrendingUp}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          label="Linked spend"
          value={fmtUsd(totalCampaignSpend)}
          icon={DollarSign}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-400"
        />
        <StatCard
          label="Linked ROAS"
          value={averageRoas != null ? `${averageRoas.toFixed(1)}x` : "---"}
          icon={MousePointerClick}
          accent="from-amber-500/20 to-yellow-500/20"
          iconColor="text-amber-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
        <div className="space-y-6">
          <EventOperatingPanel event={event} clients={clients} />

          <EventCommentsPanel
            allowAdminOnly
            allowCreateFollowUpItems
            canDeleteAny
            comments={comments}
            currentUserId={userId ?? ""}
            eventId={eventId}
            linkedFollowUpSourceIds={followUpItems
              .filter((item) => item.sourceEntityType === "event_comment" && item.sourceEntityId)
              .map((item) => item.sourceEntityId as string)}
            description="Keep ticketing notes, promotion context, and client-facing discussion attached directly to this event."
            title="Event discussion"
            variant="admin"
          />

          <EventFollowUpItemsPanel
            canManage
            eventId={eventId}
            items={followUpItems}
            title="Event next steps"
            description="Track ticketing, promotion, and delivery follow-through without leaving the event page."
            emptyState="No event follow-up items are active yet."
            variant="admin"
          />

          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Linked campaigns</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Promotion campaigns
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                Campaigns linked to this event through the shared promotion workflow.
              </p>
            </div>

            {linkedCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
                No campaigns are linked to this event yet.
              </div>
            ) : (
              <div className="space-y-3">
                {linkedCampaigns.map((campaign) => (
                  <Link
                    key={campaign.campaignId}
                    href={`/admin/campaigns/${campaign.campaignId}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 transition-colors hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2f2f2f]">{campaign.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9b9a97]">
                        <span>{campaign.status}</span>
                        <span>&middot;</span>
                        <span>{fmtNum(campaign.impressions ?? 0)} impressions</span>
                        <span>&middot;</span>
                        <span>{fmtNum(campaign.clicks ?? 0)} clicks</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#2f2f2f]">
                        {fmtUsd(((campaign.spend ?? 0) / 100) || null)}
                      </p>
                      <p className="mt-1 text-xs text-[#9b9a97]">
                        {campaign.roas != null ? `${campaign.roas.toFixed(1)}x ROAS` : "No ROAS yet"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <DashboardOpsSummarySection
            campaignHrefPrefix="/admin/campaigns"
            description="See the promotion workflow attached to this event without jumping between campaign pages."
            emptyState="No linked campaign workflows need attention for this event right now."
            summary={opsSummary}
            title="Promotion workflow"
            variant="admin"
          />

          <WorkspaceActivityFeed
            assetHrefPrefix="/admin/assets"
            events={events}
            basePath="/admin/events"
            title="Event activity"
            description="Recent ticketing and event-state changes attached to this show."
            emptyState="Event activity will appear here as the team updates ticketing, status, or client assignment."
          />

          <AgentOutcomesPanel
            canCreateActionItems
            outcomes={agentOutcomes}
            title="Agent follow-through"
            description="Agent work tied to the linked campaign workflow for this event."
            emptyState="No agent work is attached to this event yet."
            variant="admin"
            campaignHrefPrefix="/admin/campaigns"
          />

          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <p className="text-sm font-medium text-[#787774]">Event snapshot</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
              Quick context
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Venue</p>
                <p className="mt-2 text-sm font-medium text-[#2f2f2f]">{event.venue}</p>
                <p className="mt-1 text-xs text-[#9b9a97]">{event.city ?? "No city set"}</p>
              </div>
              <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Date</p>
                <p className="mt-2 text-sm font-medium text-[#2f2f2f]">{fmtDate(event.date)}</p>
                <p className="mt-1 text-xs text-[#9b9a97]">
                  Updated {event.updatedAt ? fmtDate(event.updatedAt) : "recently"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
