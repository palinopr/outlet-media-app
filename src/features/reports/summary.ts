export interface ReportsCampaignCard {
  campaignId: string;
  name: string;
  status: string;
  clientSlug: string;
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

export interface ReportsEventCard {
  id: string;
  name: string;
  venue: string;
  city: string;
  clientSlug: string | null;
  date: string | null;
  status: string;
  ticketsSold: number;
  ticketsAvailable: number | null;
  sellThrough: number | null;
  avgTicketPrice: number | null;
  potentialRevenue: number | null;
  gross: number | null;
  updatedAt: string | null;
  ticketPlatform: "ticketmaster" | "vivaticket" | "unknown";
  artist: string;
  ticketsSoldToday: number | null;
  revenueToday: number | null;
  conversionRate: number | null;
  edpTotalViews: number | null;
  edpAvgDailyViews: number | null;
}

export interface ReportsSummary {
  totalSpend: number;
  totalRevenue: number;
  blendedRoas: number | null;
  totalImpressions: number;
  totalClicks: number;
  totalTicketsSold: number;
  avgCpc: number | null;
  avgCtr: number | null;
}

export function buildReportsSummary(
  campaigns: ReportsCampaignCard[],
  events: ReportsEventCard[],
): ReportsSummary {
  let totalSpend = 0;
  let totalRevenue = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let weightedRoas = 0;
  let spendWithRoas = 0;
  let cpcSum = 0;
  let cpcCount = 0;
  let ctrSum = 0;
  let ctrCount = 0;

  for (const campaign of campaigns) {
    totalSpend += campaign.spend;
    totalRevenue += campaign.revenue ?? 0;
    totalImpressions += campaign.impressions;
    totalClicks += campaign.clicks;

    if (campaign.roas != null && campaign.spend > 0) {
      weightedRoas += campaign.roas * campaign.spend;
      spendWithRoas += campaign.spend;
    }

    if (campaign.cpc != null) {
      cpcSum += campaign.cpc;
      cpcCount += 1;
    }

    if (campaign.ctr != null) {
      ctrSum += campaign.ctr;
      ctrCount += 1;
    }
  }

  return {
    totalSpend,
    totalRevenue,
    blendedRoas: spendWithRoas > 0 ? weightedRoas / spendWithRoas : null,
    totalImpressions,
    totalClicks,
    totalTicketsSold: events.reduce((sum, event) => sum + event.ticketsSold, 0),
    avgCpc: cpcCount > 0 ? cpcSum / cpcCount : null,
    avgCtr: ctrCount > 0 ? ctrSum / ctrCount : null,
  };
}
