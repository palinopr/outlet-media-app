import {
  DollarSign,
  TrendingUp,
  Users,
  Megaphone,
  Zap,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Target,
  Ticket,
} from "lucide-react";
import { getData, type DateRange } from "./data";
import { fmtUsd, fmtNum, roasColor, slugToLabel } from "@/lib/formatters";
import { roasLabel, generateInsights, DATE_OPTIONS } from "./lib";
import { ExportButton } from "@/components/client/export-button";
import { ClientPortalFooter } from "./components/client-portal-footer";
import { CampaignCard } from "./components/campaign-card";
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
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
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
  const data = await getData(slug, range);
  const { heroStats, campaigns, events, audience, dataSource, rangeLabel } = data;

  const insights = generateInsights(heroStats, campaigns, events, audience);
  const clientName = slugToLabel(slug);
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
              <span className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400/70">Client Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back, {clientName}</h1>
            <p className="text-sm text-white/40 mt-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {now}
              <span className="text-white/15">|</span>
              <span className="text-white/25">{rangeLabel}</span>
              {dataSource === "meta_api" && (
                <>
                  <span className="text-white/15">|</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start flex-wrap">
            <ExportButton />
            <div className="flex flex-wrap items-center gap-1 sm:gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {DATE_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={`?range=${opt.value}`}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${range === opt.value
                    ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
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
            <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">Ad Spend</span>
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
            <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">ROAS</span>
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold tracking-tighter leading-none ${roasColor(heroStats.blendedRoas)}`}>
            {heroStats.blendedRoas != null ? `${heroStats.blendedRoas.toFixed(1)}x` : "--"}
          </p>
          {heroStats.blendedRoas != null && (
            <p className={`text-[10px] mt-2 font-medium ${roasColor(heroStats.blendedRoas)}`}>{roasLabel(heroStats.blendedRoas)}</p>
          )}
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">Revenue</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none">
            {fmtUsd(heroStats.totalRevenue)}
          </p>
          <p className="text-[10px] text-white/20 mt-2">
            {fmtNum(heroStats.totalImpressions)} impressions | {fmtNum(heroStats.totalClicks)} clicks
          </p>
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
              <Megaphone className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">Campaigns</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {heroStats.activeCampaigns}
          </p>
          <p className="text-[10px] text-white/20 mt-2">
            {heroStats.activeCampaigns} active of {heroStats.totalCampaigns} total
          </p>
        </div>
      </div>

      {/* -- Smart Insights -- */}
      {insights.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 ring-1 ring-white/[0.08]">
              <Zap className="h-4 w-4 text-cyan-300" />
            </div>
            <span className="text-sm font-semibold text-white/80">Insights</span>
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${ins.type === "positive" ? "bg-emerald-400" : ins.type === "warning" ? "bg-amber-400" : "bg-white/30"}`} />
                <p className="text-sm text-white/50 leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -- Campaign Cards -- */}
      {campaigns.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="h-3.5 w-3.5 text-white/30" />
              <span className="section-label">Your Campaigns</span>
            </div>
            <span className="text-[10px] text-white/20">{rangeLabel}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((c) => (
              <CampaignCard key={c.campaignId} c={c} slug={slug} range={range} />
            ))}
          </div>
        </section>
      )}

      {/* -- Event Cards (Ticketmaster clients only) -- */}
      {events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-white/30" />
              <span className="section-label">Events</span>
            </div>
            <span className="text-[10px] text-white/20">{events.length} events</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        </section>
      )}

      {/* -- Audience Profile (TM clients) -- */}
      {audience && audience.totalFans > 0 && (
        <section>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-white/30" />
              <span className="section-label">Audience Profile</span>
            </div>
            <span className="text-[10px] text-white/20">{audience.totalFans.toLocaleString()} fans</span>
          </div>
          <p className="text-[11px] text-white/25 mb-4 ml-5.5">
            Aggregated from Ticketmaster event data
          </p>
          <AudienceSection demo={audience} />
        </section>
      )}

      {/* -- Footer -- */}
      <ClientPortalFooter dataSource={dataSource} />

    </div>
  );
}
