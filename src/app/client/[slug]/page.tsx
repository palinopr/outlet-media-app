import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  MapPin,
  Calendar,
  Users,
  Activity,
  Ticket,
  Heart,
  Zap,
  ArrowUpRight,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";

type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
type DemographicsRow = Database["public"]["Tables"]["tm_event_demographics"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ days?: string }>;
}

// --- Types ---

interface CampaignCard {
  id: string;
  name: string;
  spendCents: number;
  roas: number | null;
}

interface AudienceProfile {
  totalFans: number;
  femalePct: number | null;
  malePct: number | null;
  age1824: number | null;
  age2534: number | null;
  age3544: number | null;
  age4554: number | null;
  ageOver54: number | null;
  income0_30: number | null;
  income30_60: number | null;
  income60_90: number | null;
  income90_125: number | null;
  incomeOver125: number | null;
  marriedPct: number | null;
}

// --- Helpers ---

function weightedAvg(rows: DemographicsRow[], key: keyof DemographicsRow): number | null {
  const valid = rows.filter((r) => r[key] != null && (r.fans_total ?? 0) > 0);
  if (!valid.length) return null;
  const totalWeight = valid.reduce((s, r) => s + (r.fans_total ?? 0), 0);
  const sum = valid.reduce((s, r) => s + Number(r[key]) * (r.fans_total ?? 0), 0);
  return totalWeight > 0 ? sum / totalWeight : null;
}

function buildAudienceProfile(demos: DemographicsRow[]): AudienceProfile {
  const totalFans = demos.reduce((s, d) => s + (d.fans_total ?? 0), 0);
  return {
    totalFans,
    femalePct: weightedAvg(demos, "fans_female_pct"),
    malePct: weightedAvg(demos, "fans_male_pct"),
    age1824: weightedAvg(demos, "age_18_24_pct"),
    age2534: weightedAvg(demos, "age_25_34_pct"),
    age3544: weightedAvg(demos, "age_35_44_pct"),
    age4554: weightedAvg(demos, "age_45_54_pct"),
    ageOver54: weightedAvg(demos, "age_over_54_pct"),
    income0_30: weightedAvg(demos, "income_0_30k_pct"),
    income30_60: weightedAvg(demos, "income_30_60k_pct"),
    income60_90: weightedAvg(demos, "income_60_90k_pct"),
    income90_125: weightedAvg(demos, "income_90_125k_pct"),
    incomeOver125: weightedAvg(demos, "income_over_125k_pct"),
    marriedPct: weightedAvg(demos, "fans_married_pct"),
  };
}

function fmtUsd(n: number | null) {
  return n == null ? "--" : "$" + Math.round(n).toLocaleString("en-US");
}

function fmtDate(d: string | null) {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function roasColor(roas: number | null): string {
  if (roas == null) return "text-white/40";
  if (roas >= 3) return "text-emerald-400";
  if (roas >= 2) return "text-amber-400";
  return "text-red-400";
}

function roasDot(roas: number | null): string {
  if (roas == null) return "bg-white/20";
  if (roas >= 3) return "bg-emerald-400";
  if (roas >= 2) return "bg-amber-400";
  return "bg-red-400";
}

function roasLabel(roas: number | null): string {
  if (roas == null) return "No data";
  if (roas >= 4) return "Exceptional";
  if (roas >= 3) return "Strong";
  if (roas >= 2) return "Good";
  if (roas >= 1) return "Below target";
  return "Underperforming";
}

function roasBg(roas: number | null): string {
  if (roas == null) return "bg-white/5";
  if (roas >= 3) return "bg-emerald-500/10";
  if (roas >= 2) return "bg-amber-500/10";
  return "bg-red-500/10";
}

type StatusKey = "onsale" | "presale" | "soldout" | "offsale" | "cancelled" | "published";

const statusConfig: Record<StatusKey, { label: string; text: string; bg: string; dot: string }> = {
  onsale: { label: "On Sale", text: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  presale: { label: "Presale", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  soldout: { label: "Sold Out", text: "text-violet-400", bg: "bg-violet-400/10", dot: "bg-violet-400" },
  offsale: { label: "Off Sale", text: "text-zinc-400", bg: "bg-zinc-400/10", dot: "bg-zinc-400" },
  cancelled: { label: "Cancelled", text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  published: { label: "Published", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
};

function StatusBadge({ status }: { status: string }) {
  const key = (status ?? "").toLowerCase().replace(/_/g, "") as StatusKey;
  const cfg = statusConfig[key] ?? { label: status, text: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400" };
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// --- Data fetching ---

async function getData(slug: string, days: 7 | 14) {
  if (!supabaseAdmin) return { campaignCards: [], events: [], demographics: null };

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const [campaignsRes, eventsRes] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name")
      .eq("client_slug", slug),
    supabaseAdmin
      .from("tm_events")
      .select("*")
      .eq("client_slug", slug)
      .order("date", { ascending: true })
      .limit(50),
  ]);

  const campaigns = campaignsRes.data ?? [];
  const events = (eventsRes.data ?? []) as TmEvent[];
  const campaignIds = campaigns.map((c) => c.campaign_id);

  const snapshotsRes = campaignIds.length > 0
    ? await supabaseAdmin
      .from("campaign_snapshots")
      .select("campaign_id, spend, roas")
      .in("campaign_id", campaignIds)
      .gte("snapshot_date", cutoffStr)
    : { data: [] };

  const byId = new Map<string, { spend: number; roasWeighted: number }>();
  for (const s of (snapshotsRes.data ?? [])) {
    const cur = byId.get(s.campaign_id) ?? { spend: 0, roasWeighted: 0 };
    cur.spend += s.spend ?? 0;
    cur.roasWeighted += (s.roas ?? 0) * (s.spend ?? 0);
    byId.set(s.campaign_id, cur);
  }

  const campaignCards: CampaignCard[] = campaigns
    .map((c) => {
      const snap = byId.get(c.campaign_id);
      const spendCents = snap?.spend ?? 0;
      const roas = snap && snap.spend > 0 ? snap.roasWeighted / snap.spend : null;
      return { id: c.campaign_id, name: c.name ?? "", spendCents, roas };
    })
    .filter((c) => c.spendCents > 0)
    .sort((a, b) => b.spendCents - a.spendCents);

  let demographics: AudienceProfile | null = null;
  if (events.length > 0) {
    const tmIds = events.map((e) => e.tm_id);
    const demosRes = await supabaseAdmin
      .from("tm_event_demographics")
      .select("*")
      .in("tm_id", tmIds);
    const rows = (demosRes.data ?? []) as DemographicsRow[];
    if (rows.length > 0) demographics = buildAudienceProfile(rows);
  }

  return { campaignCards, events, demographics };
}

// --- Progress Bar Component ---

function ProgressBar({
  value,
  color = "gradient",
  height = "h-1.5",
}: {
  value: number;
  color?: "gradient" | "cyan" | "violet" | "emerald" | "amber";
  height?: string;
}) {
  const barColors: Record<string, string> = {
    gradient: "",
    cyan: "bg-cyan-400",
    violet: "bg-violet-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
  };

  return (
    <div className={`progress-track ${height}`}>
      <div
        className={`h-full rounded-full ${color === "gradient" ? "gradient-bar" : barColors[color]}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

// --- Stat Helpers ---

function DemoBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color: "cyan" | "violet" | "emerald" | "amber";
}) {
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

// --- Page ---

export default async function ClientDashboard({ params, searchParams }: Props) {
  const { slug } = await params;
  const { days: daysParam } = await searchParams;
  const days = daysParam === "14" ? 14 : 7;
  const { campaignCards, events, demographics } = await getData(slug, days);

  const totalSpendCents = campaignCards.reduce((s, c) => s + c.spendCents, 0);
  const totalWeightedRoas = campaignCards.reduce((s, c) => s + (c.roas ?? 0) * c.spendCents, 0);
  const blendedRoas = totalSpendCents > 0 ? totalWeightedRoas / totalSpendCents : null;

  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/_/g, " ");
  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  // Performance insight message
  const insightMessage = blendedRoas != null
    ? blendedRoas >= 3
      ? "Your campaigns are performing exceptionally well. Keep up the momentum!"
      : blendedRoas >= 2
        ? "Campaign performance is solid. We're optimizing for even better results."
        : "We're actively tuning your campaigns to improve returns."
    : "Your campaign data is being collected. Check back soon for insights.";

  return (
    <div className="space-y-6">

      {/* ─── Welcome Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/[0.06] to-transparent rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400/70" />
              <span className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400/70">Client Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {clientName}
            </h1>
            <p className="text-sm text-white/40 mt-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {now}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start">
            {([7, 14] as const).map((d) => (
              <a
                key={d}
                href={`?days=${d}`}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${days === d
                    ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  }`}
              >
                Last {d} days
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Hero Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Spend */}
        <div className="glass-card hero-stat-card stat-glow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
                <DollarSign className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="section-label">Total Spend</span>
            </div>
          </div>
          <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter leading-none">
            {fmtUsd(totalSpendCents / 100)}
          </p>
          <p className="text-xs text-white/25 mt-2.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last {days} days
          </p>
        </div>

        {/* Blended ROAS */}
        <div className="glass-card hero-stat-card stat-glow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
                <TrendingUp className="h-4 w-4 text-violet-400" />
              </div>
              <span className="section-label">Blended ROAS</span>
            </div>
            {blendedRoas != null && (
              <span className={`badge-status text-[10px] ${roasColor(blendedRoas)} ${roasBg(blendedRoas)}`}>
                <ArrowUpRight className="h-3 w-3" />
                {roasLabel(blendedRoas)}
              </span>
            )}
          </div>
          <p className={`text-4xl sm:text-5xl font-extrabold tracking-tighter leading-none ${roasColor(blendedRoas)}`}>
            {blendedRoas != null ? `${blendedRoas.toFixed(1)}x` : "--"}
          </p>
          <p className="text-xs text-white/25 mt-2.5">Return on ad spend</p>
        </div>

        {/* Campaigns Count */}
        <div className="glass-card hero-stat-card stat-glow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="section-label">Active Campaigns</span>
            </div>
          </div>
          <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter leading-none">
            {campaignCards.length}
          </p>
          <p className="text-xs text-white/25 mt-2.5">Running this period</p>
        </div>
      </div>

      {/* ─── Performance Insight ─── */}
      <div className="glass-card p-5 flex items-start gap-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 ring-1 ring-white/[0.08] shrink-0">
          <Zap className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white/80 mb-1">Performance Insight</p>
          <p className="text-sm text-white/40 leading-relaxed">{insightMessage}</p>
        </div>
      </div>

      {/* ─── Campaign Cards ─── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Your Campaigns</span>
          </div>
          <span className="text-[10px] text-white/20">{campaignCards.length} active</span>
        </div>

        {campaignCards.length === 0 ? (
          <div className="glass-card py-16 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06] mx-auto mb-4">
              <Activity className="h-6 w-6 text-white/20" />
            </div>
            <p className="text-sm font-medium text-white/50 mb-1">No campaign data yet</p>
            <p className="text-xs text-white/25">Campaign metrics will appear here once data starts flowing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaignCards.map((c) => {
              const spendDollars = c.spendCents / 100;
              return (
                <div key={c.id} className="glass-card campaign-card p-6">
                  <div className="flex items-start justify-between mb-5">
                    <p className="text-base font-semibold text-white/90 truncate pr-4">
                      {c.name}
                    </p>
                    {c.roas != null && (
                      <span className={`badge-status text-[10px] shrink-0 ${roasColor(c.roas)} ${roasBg(c.roas)}`}>
                        {roasLabel(c.roas)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <DollarSign className="h-3 w-3 text-white/30" />
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/35">Spend</span>
                      </div>
                      <p className="text-2xl font-bold text-white/90">
                        {fmtUsd(spendDollars)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <TrendingUp className="h-3 w-3 text-white/30" />
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/35">ROAS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${roasDot(c.roas)}`} />
                        <p className={`text-2xl font-bold ${roasColor(c.roas)}`}>
                          {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Visual performance bar */}
                  {c.roas != null && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-white/30">Performance</span>
                        <span className="text-[10px] text-white/50 font-medium">{Math.min(Math.round(c.roas * 25), 100)}%</span>
                      </div>
                      <ProgressBar value={Math.min(c.roas * 25, 100)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Shows ─── */}
      {events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-white/30" />
              <span className="section-label">Your Shows</span>
            </div>
            <span className="text-[10px] text-white/20">{events.length} events</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => {
              const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
              const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : null;
              return (
                <div key={e.id} className="glass-card p-5">
                  <p className="text-base font-semibold text-white/90 mb-0.5 truncate">
                    {e.city ?? e.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{fmtDate(e.date)}</span>
                    </div>
                    {e.venue && (
                      <>
                        <span className="text-white/15">·</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{e.venue}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {pct != null && cap > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-white/40">Sell-through</span>
                        <span className="text-[11px] font-semibold text-white/80">{pct}%</span>
                      </div>
                      <ProgressBar value={pct} />
                      <p className="text-[10px] text-white/20 mt-1.5">
                        {(e.tickets_sold ?? 0).toLocaleString()} of {cap.toLocaleString()} tickets
                      </p>
                    </div>
                  )}

                  {e.status && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <StatusBadge status={e.status} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Audience Profile ─── */}
      {demographics && demographics.totalFans > 0 && (
        <section>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-white/30" />
              <span className="section-label">Audience Profile</span>
            </div>
            <span className="text-[10px] text-white/20">{demographics.totalFans.toLocaleString()} fans</span>
          </div>
          <p className="text-[11px] text-white/25 mb-4 ml-5.5">
            Aggregated from Ticketmaster event data
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Gender */}
            {(demographics.femalePct != null || demographics.malePct != null) && (
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-3.5 w-3.5 text-violet-400/60" />
                  <span className="text-xs font-semibold text-white/60">Gender</span>
                </div>
                <DemoBar label="Female" value={demographics.femalePct} color="violet" />
                <DemoBar label="Male" value={demographics.malePct} color="cyan" />
                {demographics.marriedPct != null && (
                  <p className="text-[11px] text-white/30 mt-3 pt-3 border-t border-white/[0.06]">
                    {demographics.marriedPct.toFixed(0)}% married
                  </p>
                )}
              </div>
            )}

            {/* Age */}
            {demographics.age1824 != null && (
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-3.5 w-3.5 text-emerald-400/60" />
                  <span className="text-xs font-semibold text-white/60">Age</span>
                </div>
                <DemoBar label="18–24" value={demographics.age1824} color="emerald" />
                <DemoBar label="25–34" value={demographics.age2534} color="emerald" />
                <DemoBar label="35–44" value={demographics.age3544} color="emerald" />
                <DemoBar label="45–54" value={demographics.age4554} color="emerald" />
                <DemoBar label="55+" value={demographics.ageOver54} color="emerald" />
              </div>
            )}

            {/* Income */}
            {demographics.income0_30 != null && (
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-3.5 w-3.5 text-amber-400/60" />
                  <span className="text-xs font-semibold text-white/60">Household Income</span>
                </div>
                <DemoBar label="<$30k" value={demographics.income0_30} color="amber" />
                <DemoBar label="$30–60k" value={demographics.income30_60} color="amber" />
                <DemoBar label="$60–90k" value={demographics.income60_90} color="amber" />
                <DemoBar label="$90–125k" value={demographics.income90_125} color="amber" />
                <DemoBar label="$125k+" value={demographics.incomeOver125} color="amber" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Footer ─── */}
      <footer className="pt-4">
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
