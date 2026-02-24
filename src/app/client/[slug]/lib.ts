import type { Database } from "@/lib/database.types";

// --- Database row types ---

export type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
export type DemographicsRow =
  Database["public"]["Tables"]["tm_event_demographics"]["Row"];

// --- Campaign types ---

export interface CampaignCard {
  campaignId: string;
  name: string;
  status: string;
  spend: number;
  roas: number | null;
  revenue: number | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  dailyBudget: number | null;
  startTime: string | null;
}

export interface HeroStats {
  totalSpend: number;
  blendedRoas: number | null;
  totalRevenue: number | null;
  totalImpressions: number;
  totalClicks: number;
  activeCampaigns: number;
  totalCampaigns: number;
  spendDelta: number | null;
  revenueDelta: number | null;
}

// --- Event types (for TM clients) ---

export interface EventCard {
  id: string;
  name: string;
  venue: string;
  city: string;
  date: string | null;
  status: string;
  ticketsSold: number;
  ticketsAvailable: number | null;
  sellThrough: number | null;
  avgTicketPrice: number | null;
  potentialRevenue: number | null;
  gross: number | null;
}

export interface AudienceProfile {
  totalFans: number;
  femalePct: number | null;
  malePct: number | null;
  marriedPct: number | null;
  childrenPct: number | null;
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
  educationHighSchool: number | null;
  educationCollege: number | null;
  educationGradSchool: number | null;
  paymentVisa: number | null;
  paymentMC: number | null;
  paymentAmex: number | null;
  paymentDiscover: number | null;
}

export interface Insight {
  text: string;
  type: "positive" | "neutral" | "warning";
}

// --- Campaign detail types ---

export interface AgeGenderBreakdown {
  age: string;
  gender: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  roas: number | null;
}

export interface PlacementBreakdown {
  platform: string;
  position: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface AdCard {
  adId: string;
  name: string;
  status: string;
  thumbnailUrl: string | null;
  creativeTitle: string | null;
  creativeBody: string | null;
  spend: number;
  impressions: number;
  clicks: number;
  reach: number | null;
  ctr: number | null;
  cpc: number | null;
  roas: number | null;
  revenue: number | null;
}

export interface CampaignDetailData {
  campaign: CampaignCard;
  ageGender: AgeGenderBreakdown[];
  placements: PlacementBreakdown[];
  ads: AdCard[];
  dataSource: "meta_api" | "supabase";
  rangeLabel: string;
}

// Age bracket labels used by Meta
export const AGE_BRACKETS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;

// --- Formatting ---

export function fmtUsd(n: number | null): string {
  if (n == null) return "--";
  if (Math.abs(n) >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + Math.round(n).toLocaleString("en-US");
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
  return n.toFixed(1) + "%";
}

export function roasColor(roas: number | null): string {
  if (roas == null) return "text-white/40";
  if (roas >= 3) return "text-emerald-400";
  if (roas >= 2) return "text-amber-400";
  return "text-red-400";
}

export function roasLabel(roas: number | null): string {
  if (roas == null) return "No data";
  if (roas >= 4) return "Exceptional";
  if (roas >= 3) return "Strong";
  if (roas >= 2) return "Good";
  if (roas >= 1) return "Below target";
  return "Underperforming";
}

// --- Status ---

type CampaignStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";

const campaignStatusMap: Record<
  CampaignStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  ACTIVE: { label: "Active", text: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  PAUSED: { label: "Paused", text: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400" },
  DELETED: { label: "Deleted", text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  ARCHIVED: { label: "Archived", text: "text-zinc-400", bg: "bg-zinc-400/10", dot: "bg-zinc-400" },
};

export function getCampaignStatusCfg(status: string) {
  const key = status.toUpperCase() as CampaignStatus;
  return (
    campaignStatusMap[key] ?? {
      label: status,
      text: "text-white/40",
      bg: "bg-white/5",
      dot: "bg-white/40",
    }
  );
}

type EventStatus = "onsale" | "presale" | "soldout" | "offsale" | "cancelled" | "published";

const eventStatusMap: Record<
  EventStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  onsale: { label: "On Sale", text: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  presale: { label: "Presale", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  soldout: { label: "Sold Out", text: "text-violet-400", bg: "bg-violet-400/10", dot: "bg-violet-400" },
  offsale: { label: "Off Sale", text: "text-zinc-400", bg: "bg-zinc-400/10", dot: "bg-zinc-400" },
  cancelled: { label: "Cancelled", text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  published: { label: "Published", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
};

export function getEventStatusCfg(status: string) {
  const key = (status ?? "").toLowerCase().replace(/_/g, "") as EventStatus;
  return (
    eventStatusMap[key] ?? {
      label: status,
      text: "text-amber-400",
      bg: "bg-amber-400/10",
      dot: "bg-amber-400",
    }
  );
}

// --- Demographics builder ---

export function weightedAvg(
  rows: DemographicsRow[],
  key: keyof DemographicsRow,
): number | null {
  const valid = rows.filter((r) => r[key] != null && (r.fans_total ?? 0) > 0);
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
    marriedPct: weightedAvg(demos, "fans_married_pct"),
    childrenPct: weightedAvg(demos, "fans_with_children_pct"),
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
    educationHighSchool: weightedAvg(demos, "education_high_school_pct"),
    educationCollege: weightedAvg(demos, "education_college_pct"),
    educationGradSchool: weightedAvg(demos, "education_grad_school_pct"),
    paymentVisa: weightedAvg(demos, "payment_visa_pct"),
    paymentMC: weightedAvg(demos, "payment_mc_pct"),
    paymentAmex: weightedAvg(demos, "payment_amex_pct"),
    paymentDiscover: weightedAvg(demos, "payment_discover_pct"),
  };
}

// --- Smart insights ---

export function generateInsights(
  hero: HeroStats,
  campaigns: CampaignCard[],
  events: EventCard[],
  audience: AudienceProfile | null,
): Insight[] {
  const out: Insight[] = [];

  // ROI statement
  if (hero.totalRevenue != null && hero.totalSpend > 0) {
    const ratio = hero.totalRevenue / hero.totalSpend;
    out.push({
      text: `Every $1 in ad spend has generated $${ratio.toFixed(2)} in attributed revenue.`,
      type: ratio >= 2 ? "positive" : "neutral",
    });
  }

  // Best performing campaign
  const withRoas = campaigns.filter((c) => c.roas != null && c.spend > 0);
  if (withRoas.length >= 2) {
    const best = withRoas.sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))[0];
    out.push({
      text: `"${best.name}" is your top performer at ${best.roas?.toFixed(1)}x ROAS.`,
      type: "positive",
    });
  }

  // Active campaign count
  const active = campaigns.filter((c) => c.status === "ACTIVE");
  if (active.length > 0 && campaigns.length > active.length) {
    out.push({
      text: `${active.length} of ${campaigns.length} campaigns currently active.`,
      type: "neutral",
    });
  }

  // Best-selling event (TM clients)
  if (events.length > 0) {
    const ranked = events
      .filter((e) => e.sellThrough != null)
      .sort((a, b) => (b.sellThrough ?? 0) - (a.sellThrough ?? 0));
    if (ranked.length >= 1) {
      out.push({
        text: `${ranked[0].city} is your top market at ${ranked[0].sellThrough}% sell-through.`,
        type: "positive",
      });
    }
  }

  // Audience segment
  if (audience) {
    const ages = [
      { label: "18-24", pct: audience.age1824 },
      { label: "25-34", pct: audience.age2534 },
      { label: "35-44", pct: audience.age3544 },
      { label: "45-54", pct: audience.age4554 },
      { label: "55+", pct: audience.ageOver54 },
    ]
      .filter((a) => a.pct != null)
      .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));
    if (ages.length > 0) {
      const gender =
        (audience.femalePct ?? 0) > (audience.malePct ?? 0) ? "Female" : "Male";
      out.push({
        text: `Core audience: ${gender} ${ages[0].label} (${ages[0].pct?.toFixed(0)}% of buyers).`,
        type: "neutral",
      });
    }
  }

  return out.slice(0, 3);
}
