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
}


export interface Insight {
  text: string;
  type: "positive" | "neutral" | "warning";
}

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
  hour: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface DailyPoint {
  date: string;
  dayOfWeek: number;
  dayLabel: string;
  spend: number;
  revenue: number | null;
  roas: number | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface GeographyBreakdown {
  market: string;
  marketType: "region" | "country";
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
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
  geography: GeographyBreakdown[];
  ads: AdCard[];
  hourly: HourlyBreakdown[];
  daily: DailyPoint[];
  recommendations: Recommendation[];
  dataSource: "meta_api" | "supabase";
  rangeLabel: string;
}

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
