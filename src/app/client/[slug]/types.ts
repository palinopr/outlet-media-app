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

export interface HourlyBreakdown {
  hour: number; // 0-23
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0=Sun .. 6=Sat
  dayLabel: string; // "Mon", "Tue", etc.
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface Recommendation {
  title: string;
  detail: string;
  type: "success" | "opportunity" | "info";
}

export interface CampaignDetailData {
  campaign: CampaignCard;
  ageGender: AgeGenderBreakdown[];
  placements: PlacementBreakdown[];
  ads: AdCard[];
  hourly: HourlyBreakdown[];
  daily: DailyPoint[];
  recommendations: Recommendation[];
  dataSource: "meta_api" | "supabase";
  rangeLabel: string;
}

// --- Constants ---

export const AGE_BRACKETS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
