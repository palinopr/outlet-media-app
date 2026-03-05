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
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Eye,
  MousePointerClick,
  Zap,
  Target,
} from "lucide-react";
import { fmtUsd, fmtNum, fmtDate, roasColor, timeAgo } from "@/lib/formatters";
import { getEventDetail } from "./data";
import { StatCard } from "../../components/stat-card";
import { ProgressBar } from "../../components/progress-bar";
import { EventStatusBadge } from "../../components/event-status-badge";
import { AudienceSection } from "../../components/audience-section";
import { requireService } from "@/lib/service-guard";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import {
  TicketSalesChart,
  type TicketChartRow,
  DailySalesChart,
} from "@/components/client/charts";
import type { SalesVelocity, TicketPlatform } from "../../types";

interface Props {
  params: Promise<{ slug: string; eventId: string }>;
}

const PLATFORM_LABELS: Record<TicketPlatform, { name: string; color: string }> = {
  ticketmaster: { name: "Ticketmaster", color: "bg-blue-500/10 text-blue-400 ring-blue-500/20" },
  vivaticket: { name: "Vivaticket", color: "bg-orange-500/10 text-orange-400 ring-orange-500/20" },
  unknown: { name: "Unknown", color: "bg-white/10 text-white/50 ring-white/10" },
};

function PlatformBadge({ platform }: { platform: TicketPlatform }) {
  const cfg = PLATFORM_LABELS[platform];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${cfg.color}`}>
      <Ticket className="h-2.5 w-2.5" />
      {cfg.name}
    </span>
  );
}

function TrendIcon({ trend }: { trend: SalesVelocity["trend"] }) {
  if (trend === "accelerating") return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
  if (trend === "decelerating") return <TrendingDown className="h-3.5 w-3.5 text-rose-400" />;
  return <Minus className="h-3.5 w-3.5 text-white/40" />;
}

function trendColor(trend: SalesVelocity["trend"]): string {
  if (trend === "accelerating") return "text-emerald-400";
  if (trend === "decelerating") return "text-rose-400";
  return "text-white/50";
}

export default async function EventDetailPage({ params }: Props) {
  const { slug, eventId } = await params;
  await requireService(slug, "ticketmaster", "eata");
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

  const { event: e, snapshots, dailyDeltas, velocity, audience, linkedCampaigns, channelBreakdown } = data;

  const chartData: TicketChartRow[] = snapshots.map((s) => {
    const dt = new Date(s.date + "T12:00:00");
    return {
      date: s.date,
      label: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ticketsSold: s.ticketsSold,
      gross: s.gross,
    };
  });

  const hasEdpData = e.edpTotalViews != null || e.conversionRate != null;
  const hasTodayData = e.ticketsSoldToday != null || e.revenueToday != null;

  // Compute days until event even when velocity is null (needs just an event date)
  const daysUntilEvent = e.date
    ? Math.max(0, Math.round((new Date(e.date).getTime() - Date.now()) / 86400000))
    : null;

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
              {e.artist && e.artist !== e.name && (
                <p className="text-sm text-white/50 mt-0.5">{e.artist}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <EventStatusBadge status={e.status} />
                <PlatformBadge platform={e.ticketPlatform} />
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
                {daysUntilEvent != null && daysUntilEvent > 0 && (
                  <span className="text-xs text-amber-400/80 flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    {daysUntilEvent}d until event
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

      {/* -- Event Overview (always visible) -- */}
      {(daysUntilEvent != null || (e.gross != null && e.gross > 0)) && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Event Overview</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {daysUntilEvent != null && daysUntilEvent > 0 && (
              <div className="glass-card p-4">
                <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Countdown</p>
                <p className="text-2xl font-bold text-amber-400">{daysUntilEvent}</p>
                <p className="text-[10px] text-white/40">days until show</p>
              </div>
            )}
            {e.gross != null && e.gross > 0 && e.ticketsSold > 0 && (
              <div className="glass-card p-4">
                <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Revenue Per Ticket</p>
                <p className="text-lg font-bold text-emerald-400">
                  ${(e.gross / e.ticketsSold).toFixed(2)}
                </p>
                <p className="text-[10px] text-white/40">avg across all sales</p>
              </div>
            )}
            {e.gross != null && e.gross > 0 && (
              <div className="glass-card p-4">
                <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Total Revenue</p>
                <p className="text-lg font-bold text-white">{fmtUsd(e.gross)}</p>
                <p className="text-[10px] text-white/40">
                  {e.ticketPlatform === "vivaticket" ? "EUR" : "USD"} gross
                </p>
              </div>
            )}
            {snapshots.length > 0 && (
              <div className="glass-card p-4">
                <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Data Points</p>
                <p className="text-lg font-bold text-white">{snapshots.length}</p>
                <p className="text-[10px] text-white/40">
                  {snapshots.length === 1
                    ? "tracking starts today"
                    : `since ${new Date(snapshots[0].date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* -- Today's Activity (when available) -- */}
      {hasTodayData && (
        <div className="grid grid-cols-2 gap-3">
          {e.ticketsSoldToday != null && (
            <StatCard
              icon={Zap}
              iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
              label="Sold Today"
              value={fmtNum(e.ticketsSoldToday)}
            />
          )}
          {e.revenueToday != null && (
            <StatCard
              icon={DollarSign}
              iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
              label="Revenue Today"
              value={fmtUsd(e.revenueToday)}
            />
          )}
        </div>
      )}

      {/* -- Sales Momentum -- */}
      {velocity && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Sales Momentum</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="glass-card p-4">
              <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Avg Daily Sales</p>
              <p className="text-lg font-bold text-white">
                {fmtNum(velocity.avgDailySales)}
              </p>
              <p className="text-[10px] text-white/40">tickets/day</p>
            </div>

            {velocity.recentDailySales != null && (
              <div className="glass-card p-4">
                <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Recent Pace</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-white">
                    {fmtNum(velocity.recentDailySales)}
                  </p>
                  <TrendIcon trend={velocity.trend} />
                </div>
                {velocity.trendPct != null && (
                  <p className={`text-[10px] ${trendColor(velocity.trend)}`}>
                    {velocity.trendPct > 0 ? "+" : ""}{velocity.trendPct}% vs earlier
                  </p>
                )}
              </div>
            )}

            {velocity.daysUntilEvent != null && velocity.daysUntilEvent > 0 && (
              <div className="glass-card p-4">
                <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Days Until Event</p>
                <p className="text-lg font-bold text-amber-400">
                  {velocity.daysUntilEvent}
                </p>
                <p className="text-[10px] text-white/40">
                  {e.date ? fmtDate(e.date) : ""}
                </p>
              </div>
            )}

            {velocity.projectedTotalSold != null && (
              <div className="glass-card p-4">
                <p className="text-[10px] text-white/50 mb-1 uppercase tracking-wider">Projected Total</p>
                <p className="text-lg font-bold text-violet-400">
                  {fmtNum(velocity.projectedTotalSold)}
                </p>
                <p className="text-[10px] text-white/40">at current pace</p>
              </div>
            )}
          </div>
        </section>
      )}

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

      {/* -- Daily Sales Activity -- */}
      {dailyDeltas.length >= 2 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Daily Sales Activity</span>
            <span className="text-xs text-white/45 ml-auto">
              {dailyDeltas.length} days
            </span>
          </div>
          <DailySalesChart data={dailyDeltas} />
        </section>
      )}

      {/* -- Ticket Sales Trend (Cumulative) -- */}
      {chartData.length >= 2 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Cumulative Sales</span>
            <span className="text-xs text-white/45 ml-auto">
              {chartData.length} data points
            </span>
          </div>
          <TicketSalesChart data={chartData} />
        </section>
      )}

      {/* -- Event Discovery (TM One data) -- */}
      {hasEdpData && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Event Discovery</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {e.edpTotalViews != null && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-white/60">Page Views</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {fmtNum(e.edpTotalViews)}
                </p>
                <p className="text-[10px] text-white/40">total event page views</p>
              </div>
            )}
            {e.edpAvgDailyViews != null && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs text-white/60">Daily Views</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {fmtNum(e.edpAvgDailyViews)}
                </p>
                <p className="text-[10px] text-white/40">avg views/day</p>
              </div>
            )}
            {e.conversionRate != null && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-white/60">Conversion</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {e.conversionRate.toFixed(1)}%
                </p>
                <p className="text-[10px] text-white/40">view to purchase</p>
              </div>
            )}
          </div>
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
            {([
              { key: "internet" as const, icon: Monitor, color: "text-cyan-400", label: "Internet" },
              { key: "mobile" as const, icon: Smartphone, color: "text-violet-400", label: "Mobile" },
              { key: "box" as const, icon: Store, color: "text-emerald-400", label: "Box Office" },
              { key: "phone" as const, icon: Phone, color: "text-amber-400", label: "Phone" },
            ])
              .filter((ch) => channelBreakdown[ch.key] != null)
              .map((ch) => {
                const Icon = ch.icon;
                return (
                  <div key={ch.key} className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-3.5 w-3.5 ${ch.color}`} />
                      <span className="text-xs text-white/60">{ch.label}</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {channelBreakdown[ch.key]!.toFixed(0)}%
                    </p>
                  </div>
                );
              })}
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
            Demographics from ticketing data
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
