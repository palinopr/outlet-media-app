import {
  DollarSign,
  TrendingUp,
  Users,
  Megaphone,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Target,
  Ticket,
} from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getData, type DateRange } from "./data";
import { getScopeFilter } from "@/lib/member-access";
import { fmtUsd, fmtNum, roasColor, slugToLabel } from "@/lib/formatters";
import { roasLabel, DATE_OPTIONS } from "./lib";
import { ExportButton } from "@/components/client/export-button";
import { DateRangePicker } from "./components/date-range-picker";
import { ClientPortalFooter } from "./components/client-portal-footer";
import { CampaignSection } from "./components/campaign-section";
import { EventCard } from "./components/event-card";
import { AudienceSection } from "./components/audience-section";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string }>;
}

function Delta({ value }: { value: number | null }) {
  if (value == null) return null;
  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
      {positive ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}

export default async function ClientDashboard({ params, searchParams }: Props) {
  const { slug } = await params;
  const { range: rangeParam } = await searchParams;
  const validRanges: DateRange[] = ["today", "yesterday", "7", "14", "30", "lifetime"];
  const range: DateRange = validRanges.includes(rangeParam as DateRange) ? (rangeParam as DateRange) : "today";

  const { userId } = await auth();
  const scope = await getScopeFilter(userId, slug);
  const data = await getData(slug, range, scope);
  const { heroStats, campaigns, events, audience, dataSource, rangeLabel } = data;

  const clientName = slugToLabel(slug);

  let displayName = clientName;
  try {
    const user = await currentUser();
    if (user?.firstName) displayName = user.firstName;
  } catch { /* Clerk unavailable -- fall back to slug label */ }
  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">Ad Spend</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {fmtUsd(heroStats.totalSpend)}
          </p>
          {heroStats.spendDelta != null && (
            <div className="flex items-center gap-2 mt-2">
              <Delta value={heroStats.spendDelta} />
            </div>
          )}
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
              <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">ROAS</span>
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold tracking-tighter leading-none ${roasColor(heroStats.blendedRoas)}`}>
            {heroStats.blendedRoas != null ? `${heroStats.blendedRoas.toFixed(1)}x` : "--"}
          </p>
          {heroStats.blendedRoas != null && (
            <p className={`text-xs mt-2 font-medium ${roasColor(heroStats.blendedRoas)}`}>{roasLabel(heroStats.blendedRoas)}</p>
          )}
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">Revenue</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none">
            {fmtUsd(heroStats.totalRevenue)}
          </p>
          <p className="text-xs text-white/45 mt-2">
            {fmtNum(heroStats.totalImpressions)} impressions | {fmtNum(heroStats.totalClicks)} clicks
          </p>
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
              <Megaphone className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">Campaigns</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {heroStats.activeCampaigns}
          </p>
          <p className="text-xs text-white/45 mt-2">
            {heroStats.activeCampaigns} active of {heroStats.totalCampaigns} total
          </p>
        </div>
      </div>

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
