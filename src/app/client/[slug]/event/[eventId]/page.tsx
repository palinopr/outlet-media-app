import Link from "next/link";
import {
  ArrowLeft,
  Ticket,
  DollarSign,
  BarChart3,
  MapPin,
  Calendar,
  Users,
  Megaphone,
  Sparkles,
  Monitor,
  Smartphone,
  Phone,
  Store,
  RefreshCw,
} from "lucide-react";
import { fmtUsd, fmtNum, fmtDate, roasColor, timeAgo } from "@/lib/formatters";
import { getEventStatusCfg } from "../../lib";
import { getEventDetail } from "./data";
import { StatCard } from "../../components/stat-card";
import { ProgressBar } from "../../components/progress-bar";
import { AudienceSection } from "../../components/audience-section";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import { TicketSalesChart, type TicketChartRow } from "@/components/client/charts";

interface Props {
  params: Promise<{ slug: string; eventId: string }>;
}

function EventStatusBadge({ status }: { status: string }) {
  const cfg = getEventStatusCfg(status);
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default async function EventDetailPage({ params }: Props) {
  const { slug, eventId } = await params;
  const data = await getEventDetail(slug, eventId);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-white/60 text-sm">Event not found.</p>
        <Link
          href={`/client/${slug}`}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const { event: e, snapshots, audience, linkedCampaigns, channelBreakdown } = data;

  const chartData: TicketChartRow[] = snapshots.map((s) => {
    const dt = new Date(s.date + "T12:00:00");
    return {
      date: s.date,
      label: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ticketsSold: s.ticketsSold,
      gross: s.gross,
    };
  });

  return (
    <div className="space-y-6">
      {/* -- Header -- */}
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

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-cyan-400/70" />
                <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
                  Event Detail
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {e.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <EventStatusBadge status={e.status} />
                {e.date && (
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {fmtDate(e.date)}
                  </span>
                )}
                {e.venue && (
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {e.venue}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -- Key Metrics -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Ticket}
          iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
          label="Tickets Sold"
          value={fmtNum(e.ticketsSold)}
          sub={
            e.ticketsAvailable != null
              ? `${fmtNum(e.ticketsAvailable)} remaining`
              : undefined
          }
        />
        <StatCard
          icon={DollarSign}
          iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
          label="Revenue"
          value={e.gross != null && e.gross > 0 ? fmtUsd(e.gross) : "--"}
          sub={
            e.potentialRevenue != null && e.potentialRevenue > 0
              ? `${fmtUsd(e.potentialRevenue)} potential`
              : undefined
          }
        />
        <StatCard
          icon={BarChart3}
          iconColor="bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400"
          label="Sell-Through"
          value={e.sellThrough != null ? `${e.sellThrough}%` : "--"}
        />
        <StatCard
          icon={DollarSign}
          iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
          label="Avg Ticket"
          value={
            e.avgTicketPrice != null ? `$${e.avgTicketPrice.toFixed(0)}` : "--"
          }
        />
      </div>

      {/* -- Sell-Through Progress -- */}
      {e.sellThrough != null && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/60">
              Sell-Through Progress
            </span>
            <span className="text-xs font-bold text-white/90">{e.sellThrough}%</span>
          </div>
          <ProgressBar value={e.sellThrough} />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-white/30">0%</span>
            <span className="text-[10px] text-white/30">100%</span>
          </div>
        </div>
      )}

      {/* -- Ticket Sales Trend -- */}
      {chartData.length >= 2 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Sales Trend</span>
            <span className="text-xs text-white/45 ml-auto">
              {chartData.length} data points
            </span>
          </div>
          <TicketSalesChart data={chartData} />
        </section>
      )}

      {/* -- Sales Channel Breakdown -- */}
      {channelBreakdown && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Sales Channels</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {channelBreakdown.internet != null && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-white/60">Internet</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {channelBreakdown.internet.toFixed(0)}%
                </p>
              </div>
            )}
            {channelBreakdown.mobile != null && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-white/60">Mobile</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {channelBreakdown.mobile.toFixed(0)}%
                </p>
              </div>
            )}
            {channelBreakdown.box != null && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-white/60">Box Office</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {channelBreakdown.box.toFixed(0)}%
                </p>
              </div>
            )}
            {channelBreakdown.phone != null && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs text-white/60">Phone</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {channelBreakdown.phone.toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* -- Audience Demographics -- */}
      {audience && audience.totalFans > 0 && (
        <section>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Audience Profile</span>
            </div>
            <span className="text-xs text-white/45">
              {audience.totalFans.toLocaleString()} fans
            </span>
          </div>
          <p className="text-xs text-white/50 mb-4 ml-5.5">
            Demographics for this event
          </p>
          <AudienceSection demo={audience} />
        </section>
      )}

      {/* -- Linked Campaigns -- */}
      {linkedCampaigns.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Ad Campaigns</span>
            <span className="text-xs text-white/45 ml-auto">
              {linkedCampaigns.length} campaign{linkedCampaigns.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {linkedCampaigns.map((c) => (
              <Link
                key={c.campaignId}
                href={`/client/${slug}/campaign/${c.campaignId}`}
                className="glass-card p-4 hover:ring-1 hover:ring-white/10 hover:bg-white/[0.03] transition-all duration-200 group"
              >
                <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate mb-2">
                  {c.name}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-white/50 mb-0.5">Spend</p>
                    <p className="text-sm font-bold text-white">{fmtUsd(c.spend)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 mb-0.5">ROAS</p>
                    <p className={`text-sm font-bold ${roasColor(c.roas)}`}>
                      {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 mb-0.5">Clicks</p>
                    <p className="text-sm font-bold text-white/90">
                      {fmtNum(c.clicks)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* -- Last Updated -- */}
      {e.updatedAt && (
        <div className="flex items-center justify-center gap-1.5 py-2">
          <RefreshCw className="h-3 w-3 text-white/30" />
          <span className="text-[11px] text-white/30">
            Last updated {timeAgo(e.updatedAt)}
          </span>
        </div>
      )}

      <ClientPortalFooter dataSource="supabase" />
    </div>
  );
}
