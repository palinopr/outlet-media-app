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
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Eye,
  MousePointerClick,
  Target,
  Zap,
  Monitor,
  Smartphone,
  Phone,
  Store,
} from "lucide-react";
import { fmtUsd, fmtNum, fmtDate, roasColor, timeAgo } from "@/lib/formatters";
import { getEventDetail } from "./data";
import { ProgressBar } from "../../components/progress-bar";
import { EventStatusBadge } from "../../components/event-status-badge";
import { AudienceSection } from "../../components/audience-section";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import {
  TicketSalesChart,
  type TicketChartRow,
  DailySalesChart,
} from "@/components/client/charts";
import type { SalesVelocity, TicketPlatform } from "../../types";
import { getDaysUntilEvent } from "../../lib";
import { requireClientAccess } from "@/features/client-portal/access";

interface Props {
  params: Promise<{ slug: string; eventId: string }>;
}

const PLATFORM_LABELS: Record<TicketPlatform, { name: string; color: string }> = {
  ticketmaster: { name: "Ticketmaster", color: "bg-blue-500/10 text-blue-400 ring-blue-500/20" },
  vivaticket: { name: "Vivaticket", color: "bg-orange-500/10 text-orange-400 ring-orange-500/20" },
  unknown: { name: "Unknown", color: "bg-white/10 text-white/50 ring-white/10" },
};

export default async function EventDetailPage({ params }: Props) {
  const { slug, eventId } = await params;
  const { scope } = await requireClientAccess(slug, "ticketmaster", "eata");
  const data = await getEventDetail(slug, eventId, scope);

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

  const daysUntilEvent = getDaysUntilEvent(e.date);
  const hasTodayData = e.ticketsSoldToday != null || e.revenueToday != null;
  const hasEdpData = e.edpTotalViews != null || e.conversionRate != null;
  const currency = e.ticketPlatform === "vivaticket" ? "EUR" : "USD";

  return (
    <div className="space-y-4">
      {/* -- Header -- */}
      <div className="space-y-4">
        <Link
          href={`/client/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to dashboard
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Event Detail
              </h1>
              <EventStatusBadge status={e.status} />
              <PlatformBadge platform={e.ticketPlatform} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/58">
              <span className="font-medium text-white/92">{e.name}</span>
              {e.venue && (
                <>
                  <span className="text-white/24">&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {e.venue}
                  </span>
                </>
              )}
              {e.date && (
                <>
                  <span className="text-white/24">&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {fmtDate(e.date)}
                  </span>
                </>
              )}
            </div>
          </div>

          {daysUntilEvent != null && daysUntilEvent > 0 && (
            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Countdown</p>
              <p className="mt-1 text-xl font-bold tracking-tight text-amber-400">
                {daysUntilEvent} days
              </p>
            </div>
          )}
        </div>
      </div>

      {/* -- Key Metrics Row -- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Tickets Sold"
          value={fmtNum(e.ticketsSold)}
          sub={e.ticketsAvailable != null ? `${fmtNum(e.ticketsAvailable)} remaining` : undefined}
        />
        <MetricCard
          label="Revenue"
          value={e.gross != null && e.gross > 0 ? fmtUsd(e.gross) : "--"}
          sub={e.gross != null && e.gross > 0 ? `${currency} gross` : undefined}
        />
        <MetricCard
          label="Sell-Through"
          value={e.sellThrough != null ? `${e.sellThrough}%` : "--"}
        />
        <MetricCard
          label="Avg Ticket"
          value={e.avgTicketPrice != null ? `$${e.avgTicketPrice.toFixed(0)}` : "--"}
        />
      </div>

      {/* -- Sell-Through Progress -- */}
      {e.sellThrough != null && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/60">Sell-Through Progress</span>
            <span className="text-xs font-bold text-white/90">{e.sellThrough}%</span>
          </div>
          <ProgressBar value={e.sellThrough} />
        </div>
      )}

      {/* -- Today's Activity -- */}
      {hasTodayData && (
        <div className="grid grid-cols-2 gap-3">
          {e.ticketsSoldToday != null && (
            <SnapshotCard label="Sold Today" value={fmtNum(e.ticketsSoldToday)} icon={<Zap className="h-3.5 w-3.5 text-cyan-400" />} />
          )}
          {e.revenueToday != null && (
            <SnapshotCard label="Revenue Today" value={fmtUsd(e.revenueToday)} icon={<DollarSign className="h-3.5 w-3.5 text-emerald-400" />} />
          )}
        </div>
      )}

      {/* -- Row: Sales Charts + Momentum (3 columns) -- */}
      {(chartData.length >= 2 || dailyDeltas.length >= 2 || velocity) && (
        <div className="grid gap-3 xl:grid-cols-3">
          {chartData.length >= 2 && (
            <section className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-white/50" />
                <span className="section-label">Cumulative sales</span>
                <span className="ml-auto text-xs text-white/45">{chartData.length} points</span>
              </div>
              <TicketSalesChart data={chartData} />
            </section>
          )}

          {dailyDeltas.length >= 2 && (
            <section className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-white/50" />
                <span className="section-label">Daily sales activity</span>
                <span className="ml-auto text-xs text-white/45">{dailyDeltas.length} days</span>
              </div>
              <DailySalesChart data={dailyDeltas} />
            </section>
          )}

          {velocity && (
            <section className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-white/50" />
                <span className="section-label">Sales momentum</span>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-4">
                <MomentumRow
                  label="Avg Daily Sales"
                  value={fmtNum(velocity.avgDailySales)}
                  sub="tickets/day"
                />
                {velocity.recentDailySales != null && (
                  <MomentumRow
                    label="Recent Pace"
                    value={fmtNum(velocity.recentDailySales)}
                    sub={velocity.trendPct != null ? `${velocity.trendPct > 0 ? "+" : ""}${velocity.trendPct}% vs earlier` : undefined}
                    trend={velocity.trend}
                  />
                )}
                {velocity.projectedTotalSold != null && (
                  <MomentumRow
                    label="Projected Total"
                    value={fmtNum(velocity.projectedTotalSold)}
                    sub="at current pace"
                    highlight="violet"
                  />
                )}
                {velocity.daysUntilEvent != null && velocity.daysUntilEvent > 0 && (
                  <MomentumRow
                    label="Days Until Event"
                    value={String(velocity.daysUntilEvent)}
                    sub={e.date ? fmtDate(e.date) : undefined}
                    highlight="amber"
                  />
                )}
              </div>
            </section>
          )}
        </div>
      )}

      {/* -- Row: Event Discovery + Sales Channels (conditional) -- */}
      {(hasEdpData || channelBreakdown) && (
        <div className="grid gap-3 xl:grid-cols-2">
          {hasEdpData && (
            <section className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-white/50" />
                <span className="section-label">Event discovery</span>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
                <div className="grid grid-cols-3 gap-4">
                  {e.edpTotalViews != null && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Page Views</p>
                      <p className="mt-1 text-lg font-bold text-white">{fmtNum(e.edpTotalViews)}</p>
                    </div>
                  )}
                  {e.edpAvgDailyViews != null && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Daily Views</p>
                      <p className="mt-1 text-lg font-bold text-white">{fmtNum(e.edpAvgDailyViews)}</p>
                    </div>
                  )}
                  {e.conversionRate != null && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Conversion</p>
                      <p className="mt-1 text-lg font-bold text-emerald-400">{e.conversionRate.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {channelBreakdown && (
            <section className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5 text-white/50" />
                <span className="section-label">Sales channels</span>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
                <div className="grid grid-cols-4 gap-4">
                  <ChannelCell icon={Monitor} label="Internet" value={channelBreakdown.internet} color="text-cyan-400" />
                  <ChannelCell icon={Smartphone} label="Mobile" value={channelBreakdown.mobile} color="text-violet-400" />
                  <ChannelCell icon={Store} label="Box Office" value={channelBreakdown.box} color="text-emerald-400" />
                  <ChannelCell icon={Phone} label="Phone" value={channelBreakdown.phone} color="text-amber-400" />
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* -- Row: Audience + Linked Campaigns (2 columns) -- */}
      <div className="grid gap-3 xl:grid-cols-2">
        {audience && audience.totalFans > 0 && (
          <section className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Audience profile</span>
              <span className="ml-auto text-xs text-white/45">
                {audience.totalFans.toLocaleString()} fans
              </span>
            </div>
            <AudienceSection demo={audience} />
          </section>
        )}

        {linkedCampaigns.length > 0 && (
          <section className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Megaphone className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Linked ad campaigns</span>
              <span className="ml-auto text-xs text-white/45">
                {linkedCampaigns.length} campaign{linkedCampaigns.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium">Campaign</th>
                    <th className="px-3 py-2.5 text-right text-[10px] uppercase tracking-wider text-white/40 font-medium">Spend</th>
                    <th className="px-3 py-2.5 text-right text-[10px] uppercase tracking-wider text-white/40 font-medium">ROAS</th>
                    <th className="px-3 py-2.5 text-right text-[10px] uppercase tracking-wider text-white/40 font-medium">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedCampaigns.map((c) => (
                    <tr key={c.campaignId} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.04] transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/client/${slug}/campaign/${c.campaignId}`}
                          className="text-xs font-medium text-white/80 hover:text-cyan-300 transition-colors"
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-right text-xs text-white/80 tabular-nums">
                        {fmtUsd(c.spend)}
                      </td>
                      <td className={`px-3 py-3 text-right text-xs font-medium tabular-nums ${roasColor(c.roas)}`}>
                        {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
                      </td>
                      <td className="px-3 py-3 text-right text-xs text-white/80 tabular-nums">
                        {c.clicks != null ? fmtNum(c.clicks) : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* -- Footer -- */}
      {e.updatedAt && (
        <p className="text-center text-[11px] text-white/30">
          Last updated {timeAgo(e.updatedAt)}
        </p>
      )}

      <ClientPortalFooter dataSource="supabase" />
    </div>
  );
}

/* ---------- Small helper components ---------- */

function PlatformBadge({ platform }: { platform: TicketPlatform }) {
  const cfg = PLATFORM_LABELS[platform];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${cfg.color}`}>
      <Ticket className="h-2.5 w-2.5" />
      {cfg.name}
    </span>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1.5 text-lg font-bold tracking-tight text-white leading-tight">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-white/35">{sub}</p>}
    </div>
  );
}

function SnapshotCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
        <p className="text-lg font-bold tracking-tight text-white">{value}</p>
      </div>
    </div>
  );
}

function MomentumRow({
  label,
  value,
  sub,
  trend,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: SalesVelocity["trend"] | null;
  highlight?: "violet" | "amber";
}) {
  const valueColor = highlight === "violet"
    ? "text-violet-400"
    : highlight === "amber"
      ? "text-amber-400"
      : "text-white";

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
        {sub && <p className="text-[10px] text-white/40">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${valueColor}`}>{value}</span>
        {trend && <TrendIcon trend={trend} />}
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: SalesVelocity["trend"] }) {
  if (trend === "accelerating") return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
  if (trend === "decelerating") return <TrendingDown className="h-3.5 w-3.5 text-rose-400" />;
  return <Minus className="h-3.5 w-3.5 text-white/40" />;
}

function ChannelCell({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Monitor;
  label: string;
  value: number | null;
  color: string;
}) {
  if (value == null) return null;
  return (
    <div>
      <Icon className={`h-3.5 w-3.5 ${color} mb-1`} />
      <p className="text-[10px] text-white/40">{label}</p>
      <p className="text-sm font-bold text-white">{value.toFixed(0)}%</p>
    </div>
  );
}
