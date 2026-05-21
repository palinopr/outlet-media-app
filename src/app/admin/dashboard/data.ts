import { supabaseAdmin } from "@/lib/supabase";
import { computeMarginalRoas } from "@/lib/formatters";
import { buildTrendData } from "@/features/client-portal/insights";
import type { Database } from "@/lib/database.types";
import { applyEffectiveCampaignClientSlugs } from "@/lib/campaign-client-assignment";
import { getFunnelEngagementSummary, type FunnelEngagementSummary } from "@/features/meta/funnel-analytics";

export type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

interface SnapshotRow {
  snapshot_date: string;
  roas: number | null;
  spend: number | null;
  campaign_id: string;
}

export interface DashboardData {
  campaigns: MetaCampaign[];
  trendData: Array<{ date: string; roas: number; spend: number }>;
  marginalRoasByCampaign: Record<string, number | null>;
  fromDb: boolean;
  funnelEngagement: FunnelEngagementSummary;
}

const EMPTY: DashboardData = {
  campaigns: [],
  trendData: [],
  marginalRoasByCampaign: {},
  fromDb: false,
  funnelEngagement: {
    ctas: [],
    deviceSplit: [],
    fromDb: false,
    lookbackDays: 7,
    scrollDepths: [],
    sections: [],
    topSources: [],
    totals: {
      ctaClicks: 0,
      ctaCtr: null,
      ctaImpressions: 0,
      pageViews: 0,
      scroll75Rate: null,
      sessions: 0,
    },
    updatedAt: null,
  },
};

export async function getData(): Promise<DashboardData> {
  if (!supabaseAdmin) return EMPTY;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [campaignsRes, snapshotsRes, funnelEngagement] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select("*")
      .eq("status", "ACTIVE")
      .order("spend", { ascending: false })
      .limit(8),
    supabaseAdmin
      .from("campaign_snapshots")
      .select("campaign_id, snapshot_date, roas, spend")
      .gte("snapshot_date", thirtyDaysAgo)
      .order("snapshot_date", { ascending: true })
      .limit(500),
    getFunnelEngagementSummary({ lookbackDays: 7 }),
  ]);

  const campaigns = (await applyEffectiveCampaignClientSlugs(
    (campaignsRes.data ?? []) as MetaCampaign[],
  )) as MetaCampaign[];
  const snapshots = (snapshotsRes.data ?? []) as SnapshotRow[];

  const snapshotsByCampaign: Record<string, SnapshotRow[]> = {};
  for (const snapshot of snapshots) {
    (snapshotsByCampaign[snapshot.campaign_id] ??= []).push(snapshot);
  }

  const marginalRoasByCampaign: Record<string, number | null> = {};
  for (const campaign of campaigns) {
    const points = (snapshotsByCampaign[campaign.campaign_id] ?? []).map((snapshot) => ({
      date: snapshot.snapshot_date,
      spend: snapshot.spend,
      roas: snapshot.roas,
    }));
    marginalRoasByCampaign[campaign.campaign_id] = computeMarginalRoas(points);
  }

  return {
    campaigns,
    trendData: buildTrendData(snapshots),
    marginalRoasByCampaign,
    fromDb: campaigns.length > 0,
    funnelEngagement,
  };
}
