import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Users,
  Megaphone,
  Heart,
  Zap,
  ArrowUp,
  ArrowDown,
  Clock,
  Shield,
  Sparkles,
  Eye,
  Target,
  MapPin,
  Calendar,
  Ticket,
  GraduationCap,
  CreditCard,
  Baby,
  ChevronRight,
} from "lucide-react";
import { getData, type DateRange } from "./data";
import {
  type CampaignCard,
  type EventCard,
  type AudienceProfile,
  fmtUsd,
  fmtDate,
  fmtNum,
  fmtPct,
  roasColor,
  roasLabel,
  getCampaignStatusCfg,
  getEventStatusCfg,
  generateInsights,
} from "./lib";
import { ExportButton } from "@/components/client/export-button";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string }>;
}

const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7", label: "7d" },
  { value: "14", label: "14d" },
  { value: "30", label: "30d" },
  { value: "lifetime", label: "Lifetime" },
];

// --- Small UI pieces ---

function ProgressBar({ value, color = "gradient" }: { value: number; color?: "gradient" | "cyan" | "violet" | "emerald" | "amber" }) {
  const barColors: Record<string, string> = { gradient: "", cyan: "bg-cyan-400", violet: "bg-violet-400", emerald: "bg-emerald-400", amber: "bg-amber-400" };
  return (
    <div className="progress-track h-1.5">
      <div className={`h-full rounded-full ${color === "gradient" ? "gradient-bar" : barColors[color]}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function DemoBar({ label, value, color }: { label: string; value: number | null; color: "cyan" | "violet" | "emerald" | "amber" }) {
  if (value == null) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs font-semibold text-white/90">{value.toFixed(0)}%</span>
      </div>
      <ProgressBar value={value} color={color} />
    </div>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const cfg = getCampaignStatusCfg(status);
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
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

// --- Campaign Card ---

function CampaignCardUI({ c, slug, range }: { c: CampaignCard; slug: string; range: DateRange }) {
  return (
    <Link
      href={`/client/${slug}/campaign/${c.campaignId}?range=${range}`}
      className="glass-card p-5 flex flex-col hover:ring-1 hover:ring-white/10 hover:bg-white/[0.03] transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-white/90 leading-tight group-hover:text-cyan-300 transition-colors">{c.name}</p>
        <div className="flex items-center gap-1.5">
          <CampaignStatusBadge status={c.status} />
          <ChevronRight className="h-3 w-3 text-white/15 group-hover:text-white/40 transition-colors" />
        </div>
      </div>
      {c.startTime && (
        <p className="text-[10px] text-white/25 mb-4">
          Since {fmtDate(c.startTime)}
          {c.dailyBudget != null && ` | ${fmtUsd(c.dailyBudget)}/day budget`}
        </p>
      )}

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-auto">
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Spend</p>
          <p className="text-lg font-bold text-white/90">{fmtUsd(c.spend)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">ROAS</p>
          <p className={`text-lg font-bold ${roasColor(c.roas)}`}>
            {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Revenue</p>
          <p className="text-sm font-bold text-emerald-400/80">{fmtUsd(c.revenue)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Impressions</p>
          <p className="text-sm font-bold text-white/70">{fmtNum(c.impressions)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Clicks</p>
          <p className="text-sm font-bold text-white/70">{fmtNum(c.clicks)}</p>
        </div>
        {c.ctr != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">CTR</p>
            <p className="text-sm font-bold text-white/70">{c.ctr.toFixed(2)}%</p>
          </div>
        )}
      </div>

      {/* ROAS indicator bar */}
      {c.roas != null && (
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/30">Performance</span>
            <span className={`text-[10px] font-semibold ${roasColor(c.roas)}`}>{roasLabel(c.roas)}</span>
          </div>
          <ProgressBar value={Math.min(c.roas * 25, 100)} />
        </div>
      )}
    </Link>
  );
}

// --- Event Card (for TM clients) ---

function EventCardUI({ e }: { e: EventCard }) {
  return (
    <div className="glass-card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-white/90 leading-tight truncate">{e.city || e.name}</p>
        <EventStatusBadge status={e.status} />
      </div>
      <div className="flex items-center gap-2 text-[10px] text-white/30 mb-4">
        <Calendar className="h-3 w-3" />
        <span>{fmtDate(e.date)}</span>
        {e.venue && (
          <>
            <span className="text-white/10">|</span>
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{e.venue}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-auto">
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Tickets Sold</p>
          <p className="text-sm font-bold text-white/80">{e.ticketsSold.toLocaleString()}</p>
        </div>
        {e.sellThrough != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Sell-Through</p>
            <p className="text-sm font-bold text-white/80">{e.sellThrough}%</p>
          </div>
        )}
        {e.avgTicketPrice != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Avg Ticket</p>
            <p className="text-sm font-bold text-white/80">${e.avgTicketPrice.toFixed(0)}</p>
          </div>
        )}
        {e.gross != null && e.gross > 0 && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Gross</p>
            <p className="text-sm font-bold text-emerald-400/80">{fmtUsd(e.gross)}</p>
          </div>
        )}
      </div>

      {e.sellThrough != null && (
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <ProgressBar value={e.sellThrough} />
        </div>
      )}
    </div>
  );
}

// --- Audience Section ---

function AudienceSection({ demo }: { demo: AudienceProfile }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(demo.femalePct != null || demo.malePct != null) && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-3.5 w-3.5 text-violet-400/60" />
            <span className="text-xs font-semibold text-white/60">Gender</span>
          </div>
          <DemoBar label="Female" value={demo.femalePct} color="violet" />
          <DemoBar label="Male" value={demo.malePct} color="cyan" />
          {demo.marriedPct != null && (
            <p className="text-[11px] text-white/30 mt-3 pt-3 border-t border-white/[0.06]">
              {demo.marriedPct.toFixed(0)}% married
            </p>
          )}
        </div>
      )}

      {demo.age1824 != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-3.5 w-3.5 text-emerald-400/60" />
            <span className="text-xs font-semibold text-white/60">Age</span>
          </div>
          <DemoBar label="18-24" value={demo.age1824} color="emerald" />
          <DemoBar label="25-34" value={demo.age2534} color="emerald" />
          <DemoBar label="35-44" value={demo.age3544} color="emerald" />
          <DemoBar label="45-54" value={demo.age4554} color="emerald" />
          <DemoBar label="55+" value={demo.ageOver54} color="emerald" />
        </div>
      )}

      {demo.income0_30 != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-3.5 w-3.5 text-amber-400/60" />
            <span className="text-xs font-semibold text-white/60">Household Income</span>
          </div>
          <DemoBar label="Under $30k" value={demo.income0_30} color="amber" />
          <DemoBar label="$30-60k" value={demo.income30_60} color="amber" />
          <DemoBar label="$60-90k" value={demo.income60_90} color="amber" />
          <DemoBar label="$90-125k" value={demo.income90_125} color="amber" />
          <DemoBar label="$125k+" value={demo.incomeOver125} color="amber" />
        </div>
      )}

      {demo.educationCollege != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-3.5 w-3.5 text-blue-400/60" />
            <span className="text-xs font-semibold text-white/60">Education</span>
          </div>
          <DemoBar label="High School" value={demo.educationHighSchool} color="cyan" />
          <DemoBar label="College" value={demo.educationCollege} color="cyan" />
          <DemoBar label="Grad School" value={demo.educationGradSchool} color="cyan" />
        </div>
      )}

      {demo.paymentVisa != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-3.5 w-3.5 text-cyan-400/60" />
            <span className="text-xs font-semibold text-white/60">Payment Methods</span>
          </div>
          <DemoBar label="Visa" value={demo.paymentVisa} color="cyan" />
          <DemoBar label="Mastercard" value={demo.paymentMC} color="violet" />
          <DemoBar label="Amex" value={demo.paymentAmex} color="emerald" />
          <DemoBar label="Discover" value={demo.paymentDiscover} color="amber" />
        </div>
      )}

      {demo.childrenPct != null && demo.marriedPct != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Baby className="h-3.5 w-3.5 text-rose-400/60" />
            <span className="text-xs font-semibold text-white/60">Family</span>
          </div>
          <DemoBar label="Married" value={demo.marriedPct} color="violet" />
          <DemoBar label="With Children" value={demo.childrenPct} color="emerald" />
        </div>
      )}
    </div>
  );
}

// ========================================
// PAGE
// ========================================

export default async function ClientDashboard({ params, searchParams }: Props) {
  const { slug } = await params;
  const { range: rangeParam } = await searchParams;
  const validRanges: DateRange[] = ["today", "yesterday", "7", "14", "30", "lifetime"];
  const range: DateRange = validRanges.includes(rangeParam as DateRange) ? (rangeParam as DateRange) : "lifetime";
  const data = await getData(slug, range);
  const { heroStats, campaigns, events, audience, dataSource, rangeLabel } = data;

  const insights = generateInsights(heroStats, campaigns, events, audience);
  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/_/g, " ");
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
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {DATE_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={`?range=${opt.value}`}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${range === opt.value
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
              <CampaignCardUI key={c.campaignId} c={c} slug={slug} range={range} />
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
              <EventCardUI key={e.id} e={e} />
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
      <footer className="pt-4 print:hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">O</span>
            </div>
            <span className="text-xs text-white/25 font-medium">Powered by Outlet Media</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-white/20">
              <Shield className="h-3 w-3" />
              <span>Secure Portal</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/20">
              <Eye className="h-3 w-3" />
              <span>{dataSource === "meta_api" ? "Live from Meta" : "Last sync"}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
