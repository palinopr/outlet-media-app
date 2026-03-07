import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { applyEffectiveCampaignClientSlugs } from "@/lib/campaign-client-assignment";

export type TmEventRow = Database["public"]["Tables"]["tm_events"]["Row"];
export type DemoRow = Database["public"]["Tables"]["tm_event_demographics"]["Row"];
export type CampaignRow = {
  name: string;
  status: string;
  spend: number | null;
  roas: number | null;
  client_slug?: string | null;
  campaign_id?: string;
};

export interface EventsData {
  events: TmEventRow[];
  clients: string[];
  demoMap: Record<string, DemoRow>;
  campaigns: CampaignRow[];
  fromDb: boolean;
}

export async function getEvents(clientSlug: string | null): Promise<EventsData> {
  if (!supabaseAdmin) return { events: [], clients: [], demoMap: {}, campaigns: [], fromDb: false };

  // Distinct client list for the filter dropdown
  const clientsRes = await supabaseAdmin
    .from("tm_events")
    .select("client_slug")
    .not("client_slug", "is", null);

  const clients = [...new Set((clientsRes.data ?? []).map((r) => r.client_slug as string))].sort();

  const query = supabaseAdmin
    .from("tm_events")
    .select("*")
    .order("date", { ascending: true })
    .limit(200);

  if (clientSlug) query.eq("client_slug", clientSlug);

  const [{ data, error }, demosRes, campaignsRes] = await Promise.all([
    query,
    supabaseAdmin.from("tm_event_demographics").select("tm_id, fans_total, fans_female_pct, fans_male_pct, age_25_34_pct, age_35_44_pct"),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name, status, spend, roas, client_slug"),
  ]);

  if (error) return { events: [], clients, demoMap: {}, campaigns: [], fromDb: false };

  const demoMap: Record<string, DemoRow> = {};
  for (const d of (demosRes.data ?? []) as DemoRow[]) {
    demoMap[d.tm_id] = d;
  }

  const effectiveCampaignRows = await applyEffectiveCampaignClientSlugs(
    ((campaignsRes.data ?? []) as Array<{
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
      status: string | null;
      spend: number | null;
      roas: number | null;
    }>),
  );

  return {
    events: (data ?? []) as TmEventRow[],
    clients,
    demoMap,
    campaigns: effectiveCampaignRows
      .filter((campaign) => !clientSlug || campaign.client_slug === clientSlug)
      .map((campaign) => ({
        campaign_id: campaign.campaign_id,
        client_slug: campaign.client_slug,
        name: campaign.name ?? campaign.campaign_id,
        status: campaign.status ?? "unknown",
        spend: campaign.spend ?? null,
        roas: campaign.roas ?? null,
      })) as CampaignRow[],
    fromDb: Boolean(data?.length),
  };
}
