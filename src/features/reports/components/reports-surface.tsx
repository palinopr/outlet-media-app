import {
  Activity,
  ArrowUpRight,
  FileBarChart2,
  Megaphone,
  Sparkles,
  Ticket,
} from "lucide-react";
import { fmtDate, fmtNum, fmtUsd, roasColor, slugToLabel } from "@/lib/formatters";
import type { ReportsData, ReportsWorkflowData } from "@/features/reports/server";

interface ReportsSurfaceProps {
  data: ReportsData;
  mode: "admin" | "client";
  workflow: ReportsWorkflowData;
}

function formatRoas(value: number | null) {
  if (value == null) return "--";
  return `${value.toFixed(2)}x`;
}

export function ReportsSurface({ data, mode, workflow }: ReportsSurfaceProps) {
  const summaryCards = [
    {
      icon: FileBarChart2,
      label: "Spend",
      value: fmtUsd(data.summary.totalSpend / 100),
      detail: `${data.campaigns.length} campaign${data.campaigns.length === 1 ? "" : "s"}`,
    },
    {
      icon: ArrowUpRight,
      label: "Revenue",
      value: fmtUsd(data.summary.totalRevenue),
      detail: `${data.dataSource === "meta_api" ? "Live Meta data" : "Supabase fallback"}`,
    },
    {
      icon: Sparkles,
      label: "Blended ROAS",
      value: formatRoas(data.summary.blendedRoas),
      detail: `${fmtNum(data.summary.totalClicks)} clicks`,
    },
    {
      icon: Ticket,
      label: "Tickets Sold",
      value: fmtNum(data.summary.totalTicketsSold),
      detail: `${data.events.length} event${data.events.length === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Icon className="h-4 w-4" />
                {card.label}
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight">{card.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Campaign Performance</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Top live and recent campaigns across the selected reporting scope.
          </p>

          <div className="mt-4 divide-y divide-border/60">
            {data.campaigns.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">
                No campaign data is available for this reporting scope yet.
              </p>
            ) : (
              data.campaigns.slice(0, 8).map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="grid gap-3 py-3 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.6fr))]"
                >
                  <div>
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {mode === "admin" ? slugToLabel(campaign.clientSlug) : "Campaign"} • {campaign.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Spend</p>
                    <p className="mt-1 text-sm">{fmtUsd(campaign.spend / 100)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Revenue</p>
                    <p className="mt-1 text-sm">{fmtUsd(campaign.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">ROAS</p>
                    <p className={`mt-1 text-sm font-medium ${roasColor(campaign.roas)}`}>
                      {formatRoas(campaign.roas)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Operational Readout</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Shared next-step signals derived from approvals, discussion, and events.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {workflow.opsSummary.metrics.map((metric) => (
              <div key={metric.key} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-xl font-semibold">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Pending approvals
              </p>
              <p className="mt-2 text-sm text-foreground">
                {workflow.actionCenter.approvals[0]?.title ?? "No approvals waiting right now."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {data.events.length > 0 ? (
        <section className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Event Snapshot</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent event-level performance where ticketing data is part of the account package.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.events.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-sm font-medium">{event.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {event.venue} • {fmtDate(event.date)}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Sold</p>
                    <p className="mt-1 font-medium">{fmtNum(event.ticketsSold)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Sell-through</p>
                    <p className="mt-1 font-medium">
                      {event.sellThrough == null ? "--" : `${event.sellThrough}%`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Gross</p>
                    <p className="mt-1 font-medium">{fmtUsd(event.gross)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Updated</p>
                    <p className="mt-1 font-medium">{fmtDate(event.updatedAt ?? event.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
