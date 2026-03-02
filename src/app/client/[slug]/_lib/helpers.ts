import type { Database } from "@/lib/database.types";

// --- Database row types ---

export type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
export type DemographicsRow =
  Database["public"]["Tables"]["tm_event_demographics"]["Row"];

// --- Domain types ---

export interface CampaignCard {
  id: string;
  name: string;
  spendCents: number;
  roas: number | null;
  clicks: number;
  impressions: number;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
}

export interface TrendPoint {
  date: string;
  spend: number;
  roas: number;
}

export interface AudienceProfile {
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

// --- Number formatting ---

export function fmtUsd(n: number | null): string {
  return n == null ? "--" : "$" + Math.round(n).toLocaleString("en-US");
}

export function fmtDate(d: string | null): string {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtNum(n: number | null): string {
  if (n == null) return "--";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number | null): string {
  if (n == null) return "--";
  return n.toFixed(2) + "%";
}

// --- ROAS display helpers ---

export function roasColor(roas: number | null): string {
  if (roas == null) return "text-white/40";
  if (roas >= 3) return "text-emerald-400";
  if (roas >= 2) return "text-amber-400";
  return "text-red-400";
}

export function roasDot(roas: number | null): string {
  if (roas == null) return "bg-white/20";
  if (roas >= 3) return "bg-emerald-400";
  if (roas >= 2) return "bg-amber-400";
  return "bg-red-400";
}

export function roasLabel(roas: number | null): string {
  if (roas == null) return "No data";
  if (roas >= 4) return "Exceptional";
  if (roas >= 3) return "Strong";
  if (roas >= 2) return "Good";
  if (roas >= 1) return "Below target";
  return "Underperforming";
}

export function roasBg(roas: number | null): string {
  if (roas == null) return "bg-white/5";
  if (roas >= 3) return "bg-emerald-500/10";
  if (roas >= 2) return "bg-amber-500/10";
  return "bg-red-500/10";
}

// --- Status badge ---

export type StatusKey =
  | "onsale"
  | "presale"
  | "soldout"
  | "offsale"
  | "cancelled"
  | "published";

export const statusConfig: Record<
  StatusKey,
  { label: string; text: string; bg: string; dot: string }
> = {
  onsale: {
    label: "On Sale",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    dot: "bg-emerald-400",
  },
  presale: {
    label: "Presale",
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
  },
  soldout: {
    label: "Sold Out",
    text: "text-violet-400",
    bg: "bg-violet-400/10",
    dot: "bg-violet-400",
  },
  offsale: {
    label: "Off Sale",
    text: "text-zinc-400",
    bg: "bg-zinc-400/10",
    dot: "bg-zinc-400",
  },
  cancelled: {
    label: "Cancelled",
    text: "text-red-400",
    bg: "bg-red-400/10",
    dot: "bg-red-400",
  },
  published: {
    label: "Published",
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
  },
};

// --- Demographics ---

export function weightedAvg(
  rows: DemographicsRow[],
  key: keyof DemographicsRow,
): number | null {
  const valid = rows.filter(
    (r) => r[key] != null && (r.fans_total ?? 0) > 0,
  );
  if (!valid.length) return null;
  const totalWeight = valid.reduce((s, r) => s + (r.fans_total ?? 0), 0);
  const sum = valid.reduce(
    (s, r) => s + Number(r[key]) * (r.fans_total ?? 0),
    0,
  );
  return totalWeight > 0 ? sum / totalWeight : null;
}

export function buildAudienceProfile(
  demos: DemographicsRow[],
): AudienceProfile {
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

// --- Trend data builder ---

export function buildTrendData(
  snapshots: Array<{
    snapshot_date: string;
    roas: number | null;
    spend: number | null;
    campaign_id: string;
  }>,
): TrendPoint[] {
  const byDate: Record<
    string,
    { revenueSum: number; roasSpendSum: number; spendSum: number }
  > = {};
  for (const s of snapshots) {
    const d = s.snapshot_date;
    if (!byDate[d]) byDate[d] = { revenueSum: 0, roasSpendSum: 0, spendSum: 0 };
    if (s.roas != null && s.spend != null) {
      const spendDollars = s.spend / 100;
      byDate[d].revenueSum += spendDollars * s.roas;
      byDate[d].roasSpendSum += spendDollars;
    }
    if (s.spend != null) byDate[d].spendSum += s.spend / 100;
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      roas: v.roasSpendSum > 0 ? v.revenueSum / v.roasSpendSum : 0,
      spend: v.spendSum,
    }));
}
