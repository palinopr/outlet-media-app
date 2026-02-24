import type { Database } from "@/lib/database.types";

// --- Database row types ---

export type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
export type DemographicsRow =
  Database["public"]["Tables"]["tm_event_demographics"]["Row"];

// --- Domain types ---

export interface HeroStats {
  totalSpend: number;
  blendedRoas: number | null;
  totalRevenue: number | null;
  showsRunning: number;
  spendDelta: number | null;
  revenueDelta: number | null;
}

export interface CityCardData {
  id: string;
  city: string;
  date: string | null;
  venue: string;
  status: string;
  ticketsSold: number;
  ticketsAvailable: number;
  sellThrough: number | null;
  avgTicketPrice: number | null;
  edpViews: number | null;
  conversionRate: number | null;
  potentialRevenue: number | null;
  gross: number | null;
  showSpend: number;
  showRoas: number | null;
  dailyTickets: { date: string; sold: number }[];
  channelMobile: number | null;
  channelInternet: number | null;
  channelBox: number | null;
  channelPhone: number | null;
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

export interface ChannelBreakdown {
  mobile: number | null;
  internet: number | null;
  box: number | null;
  phone: number | null;
}

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

type StatusKey =
  | "onsale"
  | "presale"
  | "soldout"
  | "offsale"
  | "cancelled"
  | "published";

const statusMap: Record<
  StatusKey,
  { label: string; text: string; bg: string; dot: string }
> = {
  onsale: { label: "On Sale", text: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  presale: { label: "Presale", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  soldout: { label: "Sold Out", text: "text-violet-400", bg: "bg-violet-400/10", dot: "bg-violet-400" },
  offsale: { label: "Off Sale", text: "text-zinc-400", bg: "bg-zinc-400/10", dot: "bg-zinc-400" },
  cancelled: { label: "Cancelled", text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  published: { label: "Published", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
};

export function getStatusCfg(status: string) {
  const key = (status ?? "").toLowerCase().replace(/_/g, "") as StatusKey;
  return (
    statusMap[key] ?? {
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
  cities: CityCardData[],
  audience: AudienceProfile | null,
): Insight[] {
  const out: Insight[] = [];

  // Best-selling market
  const ranked = cities
    .filter((c) => c.sellThrough != null)
    .sort((a, b) => (b.sellThrough ?? 0) - (a.sellThrough ?? 0));
  if (ranked.length >= 2) {
    out.push({
      text: `${ranked[0].city} is your best-selling market at ${ranked[0].sellThrough}% sell-through.`,
      type: "positive",
    });
  }

  // Strongest audience segment
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
        (audience.femalePct ?? 0) > (audience.malePct ?? 0)
          ? "Female"
          : "Male";
      out.push({
        text: `Your strongest audience: ${gender} ${ages[0].label} (${ages[0].pct?.toFixed(0)}% of buyers).`,
        type: "neutral",
      });
    }
  }

  // ROI statement
  if (hero.totalRevenue != null && hero.totalSpend > 0) {
    const ratio = hero.totalRevenue / hero.totalSpend;
    out.push({
      text: `Every $1 in ad spend has generated $${ratio.toFixed(2)} in attributed ticket revenue.`,
      type: ratio >= 2 ? "positive" : "neutral",
    });
  }

  // Conversion rate
  const withConversion = cities.filter((c) => c.conversionRate != null);
  if (withConversion.length > 0) {
    const avg =
      withConversion.reduce((s, c) => s + (c.conversionRate ?? 0), 0) /
      withConversion.length;
    if (avg > 2) {
      out.push({
        text: `Event pages convert at ${avg.toFixed(1)}% -- above the industry average.`,
        type: "positive",
      });
    }
  }

  return out.slice(0, 3);
}
