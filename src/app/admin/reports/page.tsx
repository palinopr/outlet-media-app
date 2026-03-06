import Link from "next/link";
import {
  DollarSign,
  Eye,
  Target,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { DashboardActionCenterSection } from "@/components/dashboard/dashboard-action-center";
import { RoasTrendChart, SpendTrendChart } from "@/components/charts/roas-trend-chart";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { EventOperationsSection } from "@/components/events/event-operations-section";
import { getEventOperationsSummary } from "@/features/events/server";
import { DashboardOpsSummarySection } from "@/components/dashboard/dashboard-ops-summary";
import { getReportsData, getReportsWorkflowData } from "@/features/reports/server";
import { fmtNum, fmtUsd, roasColor, slugToLabel } from "@/lib/formatters";

interface Props {
  searchParams: Promise<{ client?: string }>;
}

function statusTone(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";
    case "PAUSED":
      return "bg-amber-500/10 text-amber-400 ring-amber-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 ring-slate-500/20";
  }
}

export default async function AdminReportsPage({ searchParams }: Props) {
  const { client } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;

  const [reports, workflow, eventOps] = await Promise.all([
    getReportsData({ clientSlug }),
    getReportsWorkflowData({
      clientSlug,
      limit: 4,
      mode: "admin",
    }),
    getEventOperationsSummary({
      clientSlug,
      limit: 5,
      mode: "admin",
    }),
  ]);

  const topPerformers = reports.campaigns
    .filter((campaign) => campaign.spend > 0 && campaign.roas != null)
    .sort((left, right) => (right.roas ?? 0) - (left.roas ?? 0))
    .slice(0, 5);

  const topEvents = reports.events
    .filter((event) => event.sellThrough != null)
    .sort((left, right) => (right.sellThrough ?? 0) - (left.sellThrough ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Traditional performance reporting across spend, ROAS, ticket movement, and workflow pressure."
      >
        {reports.clients.length > 0 ? <ClientFilter clients={reports.clients} /> : null}
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total spend"
          value={fmtUsd(reports.summary.totalSpend)}
          icon={DollarSign}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Revenue"
          value={fmtUsd(reports.summary.totalRevenue)}
          icon={Target}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          label="Blended ROAS"
          value={
            reports.summary.blendedRoas != null
              ? `${reports.summary.blendedRoas.toFixed(1)}x`
              : "---"
          }
          icon={TrendingUp}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor={roasColor(reports.summary.blendedRoas)}
        />
        <StatCard
          label="Impressions"
          value={fmtNum(reports.summary.totalImpressions)}
          icon={Eye}
          accent="from-amber-500/20 to-yellow-500/20"
          iconColor="text-amber-400"
        />
      </div>

      <DashboardOpsSummarySection
        campaignHrefPrefix="/admin/campaigns"
        description="Keep the traditional reporting surface connected to campaign workflow and the next decisions."
        emptyState="Campaign workflow pressure is clear right now."
        summary={workflow.opsSummary}
        title="Workflow summary"
        variant="admin"
      />

      <DashboardActionCenterSection
        actionCenter={workflow.actionCenter}
        assetHrefPrefix="/admin/assets"
        assetLibraryHref="/admin/assets"
        campaignHrefPrefix="/admin/campaigns"
        description="Use the report page to see which approvals and shared threads still need attention."
        eventHrefPrefix="/admin/events"
        showCrmFollowUps={false}
        variant="admin"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Trends</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Spend and ROAS
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                Last 30 days across {clientSlug ? slugToLabel(clientSlug) : "all clients"}.
              </p>
            </div>

            {reports.trendData.length > 1 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2f2f2f]">
                    <DollarSign className="h-4 w-4 text-cyan-500" />
                    Spend trend
                  </div>
                  <SpendTrendChart data={reports.trendData} />
                </div>
                <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2f2f2f]">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ROAS trend
                  </div>
                  <RoasTrendChart data={reports.trendData} />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
                Trend charts will appear here once enough reporting history is available.
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Campaign performance</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Top performers
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                Best ROAS campaigns with active spend in the current report window.
              </p>
            </div>

            {topPerformers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
                No campaigns have enough spend to rank yet.
              </div>
            ) : (
              <div className="space-y-3">
                {topPerformers.map((campaign, index) => (
                  <Link
                    key={campaign.campaignId}
                    href={`/admin/campaigns/${campaign.campaignId}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 transition-colors hover:bg-white"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#0f7b6c]">#{index + 1}</span>
                        <p className="truncate text-sm font-medium text-[#2f2f2f]">
                          {campaign.name}
                        </p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9b9a97]">
                        <span className="rounded-full bg-[#f1ece4] px-2 py-1 font-medium text-[#6f6a63]">
                          {slugToLabel(campaign.clientSlug)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 font-medium ring-1 ${statusTone(campaign.status)}`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${roasColor(campaign.roas)}`}>
                        {campaign.roas != null ? `${campaign.roas.toFixed(1)}x` : "---"}
                      </p>
                      <p className="mt-1 text-xs text-[#9b9a97]">
                        {fmtUsd(campaign.spend)} spend
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <AgentOutcomesPanel
            assetHrefPrefix="/admin/assets"
            campaignHrefPrefix="/admin/campaigns"
            crmHrefPrefix="/admin/crm"
            description="Agent follow-through tied to the same reporting window, so recommendations stay visible alongside the charts."
            eventHrefPrefix="/admin/events"
            outcomes={workflow.agentOutcomes}
            title="Agent follow-through"
            variant="admin"
          />

          <EventOperationsSection
            description="Event-level pressure on the reporting surface, so operators can connect performance and show execution."
            hrefPrefix="/admin/events"
            showClientSlug
            summary={eventOps}
            title="Event reporting pressure"
            variant="admin"
          />

          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Ticket momentum</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Strongest events
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                Shows with the highest sell-through in the current dataset.
              </p>
            </div>

            {topEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
                Ticketing rank data will appear here once events have enough sell-through context.
              </div>
            ) : (
              <div className="space-y-3">
                {topEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/admin/events/${event.id}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 transition-colors hover:bg-white"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-amber-500" />
                        <p className="truncate text-sm font-medium text-[#2f2f2f]">
                          {event.artist || event.name}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-[#9b9a97]">
                        {event.clientSlug ? slugToLabel(event.clientSlug) : "Unassigned"}
                        {event.venue ? ` • ${event.venue}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#2f2f2f]">
                        {event.sellThrough != null ? `${event.sellThrough}%` : "---"}
                      </p>
                      <p className="mt-1 text-xs text-[#9b9a97]">
                        {fmtNum(event.ticketsSold)} sold
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
