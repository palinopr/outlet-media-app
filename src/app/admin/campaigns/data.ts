import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { type SnapshotPoint } from "@/lib/formatters";

export type { SnapshotPoint };
export type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

export interface CampaignsData {
  campaigns: MetaCampaign[];
  clients: string[];
  snapshotsByCampaign: Record<string, SnapshotPoint[]>;
  fromDb: boolean;
}

export async function getCampaigns(clientSlug: string | null): Promise<CampaignsData> {
  if (!supabaseAdmin) return { campaigns: [], clients: [], snapshotsByCampaign: {}, fromDb: false };

  // Always fetch the distinct client list for the filter dropdown
  const allRes = await supabaseAdmin
    .from("meta_campaigns")
    .select("client_slug")
    .not("client_slug", "is", null);

  const clients = [...new Set((allRes.data ?? []).map((r) => r.client_slug as string))].sort();

  const query = supabaseAdmin
    .from("meta_campaigns")
    .select("*")
    .order("spend", { ascending: false })
    .limit(100);

  if (clientSlug) query.eq("client_slug", clientSlug);

  const cutoff = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);

  const [{ data, error }, { data: snapData }] = await Promise.all([
    query,
    supabaseAdmin
      .from("campaign_snapshots")
      .select("campaign_id, snapshot_date, roas, spend")
      .gte("snapshot_date", cutoff)
      .order("snapshot_date", { ascending: true }),
  ]);

  if (error) return { campaigns: [], clients, snapshotsByCampaign: {}, fromDb: false };

  // Group snapshots by campaign_id
  const snapshotsByCampaign: Record<string, SnapshotPoint[]> = {};
  for (const row of (snapData ?? [])) {
    const id = row.campaign_id;
    (snapshotsByCampaign[id] ??= []).push({
      snapshot_date: row.snapshot_date,
      roas: row.roas,
      spend: row.spend,
    });
  }

  return {
    campaigns: (data ?? []) as MetaCampaign[],
    clients,
    snapshotsByCampaign,
    fromDb: Boolean(data?.length),
  };
}
