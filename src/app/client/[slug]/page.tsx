import {
  Users,
  Megaphone,
  Clock,
  Sparkles,
  Ticket,
  ListChecks,
  Calendar,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getData } from "./data";
import { parseRange } from "@/lib/constants";
import { fmtNum, slugToLabel, fmtTodayLong } from "@/lib/formatters";
import { DATE_OPTIONS, generateInsights } from "./lib";
import { ExportButton } from "@/components/client/export-button";
import { DateRangePicker } from "./components/date-range-picker";
import { InsightsPanel } from "./components/insights-panel";
import { ClientPortalFooter } from "./components/client-portal-footer";
import { CampaignSection } from "./components/campaign-section";
import { EventCard } from "./components/event-card";
import { AudienceSection } from "./components/audience-section";
import { requireClientAccess } from "@/features/client-portal/access";
import { getDashboardOpsSummary } from "@/features/dashboard/server";
import { OverviewCampaignJumpSection } from "./components/overview-campaign-jump-section";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string }>;
}

function normalizeEventStatus(status: string | null) {
  return (status ?? "").toLowerCase().replace(/_/g, "");
}

export default async function ClientDashboard({ params, searchParams }: Props) {
  const { slug } = await params;
  const { range: rangeParam } = await searchParams;
  const range = parseRange(rangeParam);

  const { scope } = await requireClientAccess(slug);
  const [dashboardData, opsSummary, user] = await Promise.all([
    getData(slug, range, scope),
    getDashboardOpsSummary({
      clientSlug: slug,
      limit: 6,
      mode: "client",
      scopeCampaignIds: scope?.allowedCampaignIds,
    }),
    currentUser().catch(() => null),
  ]);
  const { heroStats, campaigns, events, audience, dataSource, rangeLabel } = dashboardData;
  const insights = generateInsights(heroStats, campaigns, events, audience);

  const clientName = slugToLabel(slug);

  let displayName = clientName;
  if (user?.firstName) displayName = user.firstName;
  const now = fmtTodayLong();
  const onSaleEvents = events.filter((event) => normalizeEventStatus(event.status) === "onsale").length;
  const heroCards = events.length > 0
    ? [
        {
          icon: Megaphone,
          iconBg: "bg-cyan-500/10",
          iconRing: "ring-cyan-500/20",
          iconColor: "text-cyan-400",
          label: "Live Campaigns",
          sub: `${heroStats.totalCampaigns} total campaigns`,
          value: heroStats.activeCampaigns.toString(),
          valueColor: "text-white",
        },
        {
          icon: ListChecks,
          iconBg: "bg-violet-500/10",
          iconRing: "ring-violet-500/20",
          iconColor: "text-violet-400",
          label: "All Campaigns",
          sub: `${heroStats.totalCampaigns - heroStats.activeCampaigns} not live right now`,
          value: heroStats.totalCampaigns.toString(),
          valueColor: "text-white",
        },
        {
          icon: Ticket,
          iconBg: "bg-emerald-500/10",
          iconRing: "ring-emerald-500/20",
          iconColor: "text-emerald-400",
          label: "Total Events",
          sub: `${onSaleEvents} on sale right now`,
          value: events.length.toString(),
          valueColor: "text-white",
        },
        {
          icon: Calendar,
          iconBg: "bg-blue-500/10",
          iconRing: "ring-blue-500/20",
          iconColor: "text-blue-400",
          label: "On Sale Now",
          sub: `${events.length - onSaleEvents} not on sale`,
          value: onSaleEvents.toString(),
          valueColor: "text-white",
        },
      ]
    : [
        {
          icon: Megaphone,
          iconBg: "bg-cyan-500/10",
          iconRing: "ring-cyan-500/20",
          iconColor: "text-cyan-400",
          label: "Live Campaigns",
          sub: `${heroStats.totalCampaigns} total campaigns`,
          value: heroStats.activeCampaigns.toString(),
          valueColor: "text-white",
        },
        {
          icon: ListChecks,
          iconBg: "bg-violet-500/10",
          iconRing: "ring-violet-500/20",
          iconColor: "text-violet-400",
          label: "All Campaigns",
          sub: `${heroStats.totalCampaigns - heroStats.activeCampaigns} not live right now`,
          value: heroStats.totalCampaigns.toString(),
          valueColor: "text-white",
        },
        {
          icon: Users,
          iconBg: "bg-emerald-500/10",
          iconRing: "ring-emerald-500/20",
          iconColor: "text-emerald-400",
          label: "Audience Reach",
          sub: `${fmtNum(heroStats.totalClicks)} clicks`,
          value: fmtNum(heroStats.totalImpressions),
          valueColor: "text-white",
        },
        {
          icon: Calendar,
          iconBg: "bg-blue-500/10",
          iconRing: "ring-blue-500/20",
          iconColor: "text-blue-400",
          label: "Reporting Window",
          sub: "Currently selected range",
          value: rangeLabel,
          valueColor: "text-white",
        },
      ];

  return (
    <div className="space-y-6">

      {/* -- Welcome Banner -- */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400/70" />
              <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">Client Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back, {displayName}</h1>
            <p className="text-sm text-white/60 mt-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {now}
              <span className="text-white/30">|</span>
              <span className="text-white/50">{rangeLabel}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start flex-wrap">
            <ExportButton />
            <DateRangePicker options={DATE_OPTIONS} current={range} />
          </div>
        </div>
      </div>

      {/* -- Hero Stats -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {heroCards.map(({ icon: Icon, iconBg, iconRing, iconColor, label, sub, value, valueColor }) => (
          <div key={label} className="glass-card hero-stat-card stat-glow p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${iconBg} ring-1 ${iconRing}`}>
                <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-white/60">{label}</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-extrabold tracking-tighter leading-none ${valueColor}`}>
              {value}
            </p>
            <p className="text-xs text-white/45 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {campaigns.length > 0 && (
        <OverviewCampaignJumpSection
          attentionCampaigns={opsSummary.attentionCampaigns}
          campaigns={campaigns}
          metrics={opsSummary.metrics}
          range={range}
          slug={slug}
        />
      )}

      {/* -- Smart Insights -- */}
      <InsightsPanel insights={insights} />


      {/* -- Campaign Cards with Filter -- */}
      {campaigns.length > 0 && (
        <CampaignSection
          campaigns={campaigns}
          slug={slug}
          range={range}
          rangeLabel={rangeLabel}
        />
      )}

      {/* -- Event Cards (Ticketmaster clients only) -- */}
      {events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Events</span>
            </div>
            <span className="text-xs text-white/45">{events.length} events</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <EventCard key={e.id} e={e} slug={slug} />
            ))}
          </div>
        </section>
      )}

      {/* -- Audience Profile (TM clients) -- */}
      {audience && audience.totalFans > 0 && (
        <section>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Audience Profile</span>
            </div>
            <span className="text-xs text-white/45">{audience.totalFans.toLocaleString()} fans</span>
          </div>
          <p className="text-xs text-white/50 mb-4 ml-5.5">
            Aggregated from event ticketing data
          </p>
          <AudienceSection demo={audience} />
        </section>
      )}

      {/* -- Footer -- */}
      <ClientPortalFooter dataSource={dataSource} />

    </div>
  );
}
