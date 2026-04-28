import { supabaseAdmin } from "@/lib/supabase";
import { computeMarginalRoas } from "@/lib/formatters";
import { buildTrendData } from "@/features/client-portal/insights";
import type { Database } from "@/lib/database.types";
import { applyEffectiveCampaignClientSlugs } from "@/lib/campaign-client-assignment";

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
}

const EMPTY: DashboardData = {
  campaigns: [],
  trendData: [],
  marginalRoasByCampaign: {},
  fromDb: false,
};

export async function getData(): Promise<DashboardData> {
  if (!supabaseAdmin) return EMPTY;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [campaignsRes, snapshotsRes] = await Promise.all([
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
  };
}
