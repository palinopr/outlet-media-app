import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
type DemographicsRow = Database["public"]["Tables"]["tm_event_demographics"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ days?: string }>;
}

// --- Data fetching ---

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

function aggregateSnapshots(snapshots: { spend: number | null; roas: number | null }[]) {
  const valid = snapshots.filter((s) => s.spend != null && s.spend > 0);
  const totalSpendCents = valid.reduce((sum, s) => sum + (s.spend ?? 0), 0);
  const weightedRoas = valid.reduce((sum, s) => sum + (s.roas ?? 0) * (s.spend ?? 0), 0);
  const blendedRoas = totalSpendCents > 0 ? weightedRoas / totalSpendCents : null;
  return { totalSpendCents, blendedRoas };
}

async function getData(slug: string, days: 7 | 14) {
  if (!supabaseAdmin) return { events: [], snapshots: [], demographics: null };

  // Get campaign IDs for this client
  const campaignsRes = await supabaseAdmin
    .from("meta_campaigns")
    .select("campaign_id")
    .eq("client_slug", slug);
  const campaignIds = (campaignsRes.data ?? []).map((c) => c.campaign_id);

  // Date cutoff
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  // Fetch snapshots in date range
  const snapshotsRes = campaignIds.length > 0
    ? await supabaseAdmin
        .from("campaign_snapshots")
        .select("spend, roas")
        .in("campaign_id", campaignIds)
        .gte("snapshot_date", cutoffStr)
    : { data: [] };

  // Fetch events
  const eventsRes = await supabaseAdmin
    .from("tm_events")
    .select("*")
    .eq("client_slug", slug)
    .order("date", { ascending: true })
    .limit(50);
  const events = (eventsRes.data ?? []) as TmEvent[];

  // Fetch demographics with actual tm_ids
  let demographics: AudienceProfile | null = null;
  if (events.length > 0) {
    const tmIds = events.map((e) => e.tm_id);
    const d = await supabaseAdmin
      .from("tm_event_demographics")
      .select("*")
      .in("tm_id", tmIds);
    const rows = (d.data ?? []) as DemographicsRow[];
    if (rows.length > 0) demographics = buildAudienceProfile(rows);
  }

  return {
    events,
    snapshots: snapshotsRes.data ?? [],
    demographics,
  };
}

// --- Helpers ---

function fmtUsd(n: number | null) { return n == null ? "--" : "$" + Math.round(n).toLocaleString("en-US"); }
function fmtDate(d: string | null) {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusBadge(s: string) {
  const key = (s ?? "").toLowerCase().replace(/_/g, "");
  const map: Record<string, { label: string; classes: string }> = {
    onsale:    { label: "On Sale",   classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    presale:   { label: "Presale",   classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    soldout:   { label: "Sold Out",  classes: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    offsale:   { label: "Off Sale",  classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
    cancelled: { label: "Cancelled", classes: "bg-red-500/10 text-red-400 border-red-500/20" },
    published: { label: "Published", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };
  const { label, classes } = map[key] ?? { label: s, classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

// --- Page ---

export default async function ClientDashboard({ params, searchParams }: Props) {
  const { slug } = await params;
  const { days: daysParam } = await searchParams;
  const days = daysParam === "14" ? 14 : 7;
  const { events, snapshots, demographics } = await getData(slug, days);
  const { totalSpendCents, blendedRoas } = aggregateSnapshots(snapshots);

  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ background: "#09090B", minHeight: "100vh", padding: "2rem" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ color: "#FAFAFA", fontSize: "1.25rem", fontWeight: 600 }}>
            {clientName} Campaign
          </h1>
          <p style={{ color: "#A1A1AA", fontSize: "0.75rem", marginTop: "0.25rem" }}>{now}</p>
        </div>

        {/* Date filter toggle */}
        <div style={{
          display: "flex",
          gap: "0.25rem",
          background: "#18181B",
          border: "1px solid #27272A",
          borderRadius: "0.5rem",
          padding: "0.25rem",
        }}>
          {([7, 14] as const).map((d) => (
            <a
              key={d}
              href={`?days=${d}`}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                textDecoration: "none",
                background: days === d ? "#FAFAFA" : "transparent",
                color: days === d ? "#09090B" : "#A1A1AA",
                transition: "all 0.15s",
              }}
            >
              Last {d}d
            </a>
          ))}
        </div>
      </div>

      {/* Hero numbers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          {
            label: "Total Spend",
            value: fmtUsd(totalSpendCents / 100),
            sub: `Last ${days} days`,
          },
          {
            label: "Blended ROAS",
            value: blendedRoas != null ? `${blendedRoas.toFixed(1)}x` : "--",
            sub: "Return on ad spend",
            valueColor: blendedRoas == null ? "#FAFAFA"
              : blendedRoas >= 3 ? "#4ADE80"
              : blendedRoas >= 2 ? "#FCD34D"
              : "#F87171",
          },
          {
            label: "Shows",
            value: String(events.length),
            sub: "On tour",
          },
        ].map(({ label, value, sub, valueColor }) => (
          <div key={label} style={{
            background: "#18181B",
            border: "1px solid #27272A",
            borderRadius: "0.75rem",
            padding: "1.5rem",
          }}>
            <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              {label}
            </p>
            <p style={{ color: valueColor ?? "#FAFAFA", fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>
              {value}
            </p>
            <p style={{ color: "#A1A1AA", fontSize: "0.75rem", marginTop: "0.375rem" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* City cards */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
          Your Shows
        </p>
        {events.length === 0 ? (
          <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "#A1A1AA", fontSize: "0.875rem" }}>No shows synced yet</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {events.map((e) => {
              const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
              const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : null;
              return (
                <div key={e.id} style={{
                  background: "#18181B",
                  border: "1px solid #27272A",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                }}>
                  {/* City */}
                  <p style={{ color: "#FAFAFA", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {e.city ?? e.name}
                  </p>
                  {/* Date + venue */}
                  <p style={{ color: "#A1A1AA", fontSize: "0.75rem", marginBottom: "1rem" }}>
                    {fmtDate(e.date)}{e.venue ? ` · ${e.venue}` : ""}
                  </p>
                  {/* Sell-through bar */}
                  {pct != null && cap > 0 && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                        <span style={{ color: "#A1A1AA", fontSize: "0.6875rem" }}>Sell-through</span>
                        <span style={{ color: "#FAFAFA", fontSize: "0.6875rem", fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          borderRadius: "9999px",
                          background: "#818CF8",
                          width: `${pct}%`,
                        }} />
                      </div>
                    </div>
                  )}
                  {/* Status badge */}
                  {e.status && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {statusBadge(e.status)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audience profile */}
      {demographics && demographics.totalFans > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
            Audience Profile · {demographics.totalFans.toLocaleString()} tracked fans
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>

            {/* Gender */}
            {(demographics.femalePct != null || demographics.malePct != null) && (
              <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "1.25rem" }}>
                <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Gender</p>
                {[
                  { label: "Female", value: demographics.femalePct, color: "#818CF8" },
                  { label: "Male", value: demographics.malePct, color: "#22D3EE" },
                ].map(({ label, value, color }) =>
                  value != null ? (
                    <div key={label} style={{ marginBottom: "0.625rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#A1A1AA", fontSize: "0.75rem" }}>{label}</span>
                        <span style={{ color: "#FAFAFA", fontSize: "0.75rem", fontWeight: 600 }}>{value.toFixed(0)}%</span>
                      </div>
                      <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px" }}>
                        <div style={{ height: "100%", borderRadius: "9999px", background: color, width: `${value}%` }} />
                      </div>
                    </div>
                  ) : null
                )}
                {demographics.marriedPct != null && (
                  <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", marginTop: "0.5rem" }}>
                    {demographics.marriedPct.toFixed(0)}% married
                  </p>
                )}
              </div>
            )}

            {/* Age */}
            {demographics.age1824 != null && (
              <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "1.25rem" }}>
                <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Age</p>
                {[
                  { label: "18\u201324", value: demographics.age1824 },
                  { label: "25\u201334", value: demographics.age2534 },
                  { label: "35\u201344", value: demographics.age3544 },
                  { label: "45\u201354", value: demographics.age4554 },
                  { label: "55+",   value: demographics.ageOver54 },
                ].map(({ label, value }) =>
                  value != null ? (
                    <div key={label} style={{ marginBottom: "0.625rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#A1A1AA", fontSize: "0.75rem" }}>{label}</span>
                        <span style={{ color: "#FAFAFA", fontSize: "0.75rem", fontWeight: 600 }}>{value.toFixed(0)}%</span>
                      </div>
                      <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px" }}>
                        <div style={{ height: "100%", borderRadius: "9999px", background: "#4ADE80", width: `${value}%` }} />
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {/* Income */}
            {demographics.income0_30 != null && (
              <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "1.25rem" }}>
                <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Household Income</p>
                {[
                  { label: "<$30k",    value: demographics.income0_30 },
                  { label: "$30\u201360k",  value: demographics.income30_60 },
                  { label: "$60\u201390k",  value: demographics.income60_90 },
                  { label: "$90\u2013125k", value: demographics.income90_125 },
                  { label: "$125k+",   value: demographics.incomeOver125 },
                ].map(({ label, value }) =>
                  value != null ? (
                    <div key={label} style={{ marginBottom: "0.625rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#A1A1AA", fontSize: "0.75rem" }}>{label}</span>
                        <span style={{ color: "#FAFAFA", fontSize: "0.75rem", fontWeight: 600 }}>{value.toFixed(0)}%</span>
                      </div>
                      <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px" }}>
                        <div style={{ height: "100%", borderRadius: "9999px", background: "#FCD34D", width: `${value}%` }} />
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: "1px solid #27272A", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#52525B", fontSize: "0.75rem" }}>Powered by Outlet Media</span>
        <span style={{ color: "#52525B", fontSize: "0.75rem" }}>Data updates every 6 hours</span>
      </div>
    </div>
  );
}
