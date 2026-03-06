import type { Metadata } from "next";
import Link from "next/link";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { DashboardActionCenterSection } from "@/components/dashboard/dashboard-action-center";
import {
  Sparkles,
  Ticket,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { getEventsPageData } from "../data";
import { EventOperationsSection } from "@/components/events/event-operations-section";
import { getEventOperationsSummary, getEventsWorkflowData } from "@/features/events/server";
import { fmtNum, slugToLabel } from "@/lib/formatters";
import { EventsFilter } from "./events-filter";
import { requireClientAccess } from "@/features/client-portal/access";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string; q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Events`,
    description: `Event performance data for ${clientName}`,
  };
}

export default async function ClientEventsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { scope } = await requireClientAccess(slug, "ticketmaster", "eata");
  const { status, q } = await searchParams;

  const [{ events, totalEvents, onSaleCount, totalTicketsSold }, operations, workflow] = await Promise.all([
    getEventsPageData(slug, scope),
    getEventOperationsSummary({ clientSlug: slug, limit: 6, mode: "client", scope }),
    getEventsWorkflowData({ clientSlug: slug, limit: 4, mode: "client", scope }),
  ]);

  const clientName = slugToLabel(slug);

  return (
    <div className="space-y-6">
      {/* -- Header Banner -- */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <Link
            href={`/client/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-cyan-400/70" />
                <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
                  Events
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {clientName} Events
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* -- Summary Stats -- */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Total Events
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {totalEvents}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Ticket className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              On Sale
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none">
            {onSaleCount}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
              <Ticket className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Tickets Sold
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {fmtNum(totalTicketsSold)}
          </p>
        </div>
      </div>

      <EventOperationsSection
        description="The events with open follow-ups, discussion, and recent movement that may need attention."
        hrefPrefix={`/client/${slug}/event`}
        summary={operations}
        title="What needs follow-through"
        variant="client"
      />

      <DashboardActionCenterSection
        actionCenter={workflow.actionCenter}
        assetHrefPrefix={`/client/${slug}/assets`}
        assetLibraryHref={`/client/${slug}/assets`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        description="Open event approvals and shared event threads that still need a response."
        eventHrefPrefix={`/client/${slug}/event`}
        showCrmFollowUps={false}
        variant="client"
      />

      <AgentOutcomesPanel
        assetHrefPrefix={`/client/${slug}/assets`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        crmHrefPrefix={`/client/${slug}/crm`}
        description="Agent work connected to event operations, so show-level recommendations stay visible alongside ticket updates."
        eventHrefPrefix={`/client/${slug}/event`}
        outcomes={workflow.agentOutcomes}
        title="Event agent follow-through"
        variant="client"
      />

      {/* -- Events List with Filter -- */}
      {events.length > 0 ? (
        <EventsFilter
          events={events}
          slug={slug}
          initialStatus={status}
          initialQuery={q}
        />
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
            <Ticket className="h-6 w-6 text-white/30" />
          </div>
          <p className="text-sm text-white/60">No events found</p>
          <p className="text-xs text-white/40 mt-1">
            Event data will appear here once available
          </p>
        </div>
      )}
    </div>
  );
}
