import {
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Ticket,
  Heart,
  Zap,
  ArrowUp,
  ArrowDown,
  Clock,
  Shield,
  Sparkles,
  Eye,
  Target,
  Smartphone,
  Globe,
  Building2,
  GraduationCap,
  CreditCard,
  Baby,
} from "lucide-react";
import { getData } from "./data";
import {
  type CityCardData,
  type AudienceProfile,
  fmtUsd,
  fmtDate,
  fmtNum,
  fmtPct,
  roasColor,
  roasLabel,
  getStatusCfg,
  generateInsights,
} from "./lib";
import { TicketSparkline } from "@/components/client/ticket-sparkline";
import { ExportButton } from "@/components/client/export-button";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ days?: string }>;
}

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

function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusCfg(status);
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

function ChannelRow({ label, icon: Icon, value }: { label: string; icon: React.ComponentType<{ className?: string }>; value: number | null }) {
  if (value == null) return null;
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-3.5 w-3.5 text-white/30 shrink-0" />
      <span className="text-xs text-white/50 w-16">{label}</span>
      <div className="flex-1 progress-track h-2">
        <div className="h-full rounded-full gradient-bar" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="text-xs font-semibold text-white/80 w-10 text-right">{value.toFixed(0)}%</span>
    </div>
  );
}

// --- City Card ---

function CityCard({ c }: { c: CityCardData }) {
  const cap = c.ticketsSold + c.ticketsAvailable;
  return (
    <div className="glass-card p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <p className="text-lg font-semibold text-white/90 truncate">{c.city}</p>
        {c.status && <StatusBadge status={c.status} />}
      </div>
      <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{fmtDate(c.date)}</span>
        </div>
        {c.venue && (
          <>
            <span className="text-white/15">|</span>
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{c.venue}</span>
            </div>
          </>
        )}
      </div>

      {/* Ticket velocity sparkline */}
      {c.dailyTickets.length >= 2 && (
        <div className="mb-4 -mx-1">
          <p className="text-[10px] text-white/25 mb-1 mx-1">Ticket velocity</p>
          <TicketSparkline data={c.dailyTickets} />
        </div>
      )}

      {/* Sell-through */}
      {c.sellThrough != null && cap > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-white/40">Sell-through</span>
            <span className="text-[11px] font-semibold text-white/80">{c.sellThrough}%</span>
          </div>
          <ProgressBar value={c.sellThrough} />
          <p className="text-[10px] text-white/20 mt-1.5">
            {c.ticketsSold.toLocaleString()} of {cap.toLocaleString()} tickets
          </p>
        </div>
      )}

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-auto">
        {c.showSpend > 0 && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Ad Spend</p>
            <p className="text-sm font-bold text-white/80">{fmtUsd(c.showSpend)}</p>
          </div>
        )}
        {c.showRoas != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">ROAS</p>
            <p className={`text-sm font-bold ${roasColor(c.showRoas)}`}>{c.showRoas.toFixed(1)}x</p>
          </div>
        )}
        {c.avgTicketPrice != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Avg Ticket</p>
            <p className="text-sm font-bold text-white/80">${c.avgTicketPrice.toFixed(0)}</p>
          </div>
        )}
        {c.edpViews != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Page Views</p>
            <p className="text-sm font-bold text-white/80">{fmtNum(c.edpViews)}</p>
          </div>
        )}
        {c.conversionRate != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Conversion</p>
            <p className="text-sm font-bold text-white/80">{c.conversionRate.toFixed(1)}%</p>
          </div>
        )}
        {c.gross != null && c.gross > 0 && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Revenue</p>
            <p className="text-sm font-bold text-emerald-400/80">{fmtUsd(c.gross)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Audience Section ---

function AudienceSection({ demo }: { demo: AudienceProfile }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Gender */}
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
          {demo.childrenPct != null && (
            <p className="text-[11px] text-white/30 mt-1">
              {demo.childrenPct.toFixed(0)}% have children
            </p>
          )}
        </div>
      )}

      {/* Age */}
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

      {/* Income */}
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

      {/* Education */}
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

      {/* Payment Methods */}
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

      {/* Family */}
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
  const { days: daysParam } = await searchParams;
  const days = daysParam === "14" ? 14 : 7;
  const { heroStats, cities, audience, channels, totalPotentialRevenue, totalCurrentRevenue } = await getData(slug, days);

  const insights = generateInsights(heroStats, cities, audience);
  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/_/g, " ");
  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hasChannelData = channels.mobile != null;
  const hasRevenueProjection = totalPotentialRevenue != null && totalCurrentRevenue != null && totalPotentialRevenue > 0;
  const revenuePct = hasRevenueProjection ? Math.round((totalCurrentRevenue! / totalPotentialRevenue!) * 100) : null;

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
            </p>
          </div>

          <div className="flex items-center gap-3 self-start">
            <ExportButton />
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {([7, 14] as const).map((d) => (
                <a
                  key={d}
                  href={`?days=${d}`}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${days === d
                    ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  }`}
                >
                  Last {d}d
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* -- Hero Stats (4 cards: Spend, ROAS, Revenue, Shows) -- */}
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
          <div className="flex items-center gap-2 mt-2">
            <Delta value={heroStats.spendDelta} />
            <span className="text-[10px] text-white/20">vs prev {days}d</span>
          </div>
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
          <div className="flex items-center gap-2 mt-2">
            <Delta value={heroStats.revenueDelta} />
            <span className="text-[10px] text-white/20">vs prev {days}d</span>
          </div>
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
              <Ticket className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">Shows</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {heroStats.showsRunning}
          </p>
          <p className="text-[10px] text-white/20 mt-2">Active events</p>
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

      {/* -- City Cards (Your Shows) -- */}
      {cities.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-white/30" />
              <span className="section-label">Your Shows</span>
            </div>
            <span className="text-[10px] text-white/20">{cities.length} events</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((c) => (
              <CityCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      {/* -- Sales Channels -- */}
      {hasChannelData && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Where Fans Buy Tickets</span>
          </div>
          <div className="glass-card p-5 space-y-3">
            <ChannelRow label="Mobile" icon={Smartphone} value={channels.mobile} />
            <ChannelRow label="Web" icon={Globe} value={channels.internet} />
            <ChannelRow label="Box Office" icon={Building2} value={channels.box} />
          </div>
        </section>
      )}

      {/* -- Revenue Projection -- */}
      {hasRevenueProjection && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Revenue Outlook</span>
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] text-white/30 mb-0.5">Current Ticket Revenue</p>
                <p className="text-xl font-bold text-white/90">{fmtUsd(totalCurrentRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/30 mb-0.5">Projected at Full Capacity</p>
                <p className="text-xl font-bold text-white/50">{fmtUsd(totalPotentialRevenue)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-white/30">Progress to projected</span>
              <span className="text-[10px] font-semibold text-white/60">{revenuePct}%</span>
            </div>
            <ProgressBar value={revenuePct ?? 0} />
          </div>
        </section>
      )}

      {/* -- Audience Profile -- */}
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
              <Clock className="h-3 w-3" />
              <span>Updates every 6 hours</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
