import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type TmEventRow = Database["public"]["Tables"]["tm_events"]["Row"];
export type DemoRow = Database["public"]["Tables"]["tm_event_demographics"]["Row"];
export type CampaignRow = { name: string; status: string; spend: number | null; roas: number | null };

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
    supabaseAdmin.from("meta_campaigns").select("name, status, spend, roas").not("client_slug", "is", null),
  ]);

  if (error) return { events: [], clients, demoMap: {}, campaigns: [], fromDb: false };

  const demoMap: Record<string, DemoRow> = {};
  for (const d of (demosRes.data ?? []) as DemoRow[]) {
    demoMap[d.tm_id] = d;
  }

  return {
    events: (data ?? []) as TmEventRow[],
    clients,
    demoMap,
    campaigns: (campaignsRes.data ?? []) as CampaignRow[],
    fromDb: Boolean(data?.length),
  };
}
