"use server";

import { adminGuard } from "@/lib/api-helpers";
import { applyEffectiveCampaignClientSlugs } from "@/lib/campaign-client-assignment";
import { supabaseAdmin } from "@/lib/supabase";

export type SearchableRecord = {
  id: string;
  type: "campaign" | "client";
  name: string;
  subtitle: string;
  href: string;
};

export async function fetchSearchableRecords(): Promise<SearchableRecord[]> {
  const err = await adminGuard();
  if (err) return [];
  if (!supabaseAdmin) return [];

  const [campaignsRes, clientsRes] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name, status, client_slug")
      .limit(100),
    supabaseAdmin
      .from("clients")
      .select("id, name, slug, status")
      .limit(100),
  ]);

  const effectiveCampaignRows = await applyEffectiveCampaignClientSlugs(
    ((campaignsRes.data ?? []) as Array<{
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
      status: string | null;
    }>),
  );

  const campaigns: SearchableRecord[] = effectiveCampaignRows.map((c) => ({
    id: c.campaign_id,
    type: "campaign" as const,
    name: c.name ?? "",
    subtitle: `${c.status ?? "unknown"} \u00b7 ${c.client_slug ?? "unassigned"}`,
    href: `/admin/campaigns/${c.campaign_id}`,
  }));

  const clients: SearchableRecord[] = (clientsRes.data ?? []).map((cl) => ({
    id: String(cl.id),
    type: "client" as const,
    name: cl.name ?? "",
    subtitle: cl.slug ?? "",
    href: `/admin/clients/${cl.id}`,
  }));

  return [...campaigns, ...clients];
}
