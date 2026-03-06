"use server";

import { supabaseAdmin } from "@/lib/supabase";

export type SearchableRecord = {
  id: string;
  type: "asset" | "campaign" | "event" | "client" | "crm_contact";
  name: string;
  subtitle: string;
  href: string;
};

export async function fetchSearchableRecords(): Promise<SearchableRecord[]> {
  if (!supabaseAdmin) return [];

  const [campaignsRes, eventsRes, clientsRes, crmContactsRes, assetsRes] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name, status, client_slug")
      .limit(100),
    supabaseAdmin
      .from("tm_events")
      .select("id, name, venue, city, client_slug")
      .limit(100),
    supabaseAdmin
      .from("clients")
      .select("id, name, slug, status")
      .limit(100),
    supabaseAdmin
      .from("crm_contacts" as never)
      .select("id, full_name, company, email, client_slug")
      .limit(100),
    supabaseAdmin
      .from("ad_assets")
      .select("id, file_name, client_slug, folder, status")
      .limit(100),
  ]);

  const campaigns: SearchableRecord[] = (campaignsRes.data ?? []).map((c) => ({
    id: c.campaign_id,
    type: "campaign" as const,
    name: c.name ?? "",
    subtitle: `${c.status ?? "unknown"} \u00b7 ${c.client_slug ?? "unassigned"}`,
    href: "/admin/campaigns",
  }));

  const events: SearchableRecord[] = (eventsRes.data ?? []).map((e) => ({
    id: e.id,
    type: "event" as const,
    name: e.name ?? "",
    subtitle: `${e.venue ?? ""} \u00b7 ${e.city ?? ""}`,
    href: "/admin/events",
  }));

  const clients: SearchableRecord[] = (clientsRes.data ?? []).map((cl) => ({
    id: String(cl.id),
    type: "client" as const,
    name: cl.name ?? "",
    subtitle: cl.slug ?? "",
    href: `/admin/clients/${cl.id}`,
  }));

  const crmContacts: SearchableRecord[] = (crmContactsRes.data ?? []).map((contact) => ({
    id: String((contact as Record<string, unknown>).id),
    type: "crm_contact" as const,
    name: String((contact as Record<string, unknown>).full_name ?? ""),
    subtitle: `${String((contact as Record<string, unknown>).client_slug ?? "")} \u00b7 ${String((contact as Record<string, unknown>).company ?? (contact as Record<string, unknown>).email ?? "")}`,
    href: `/admin/crm/${String((contact as Record<string, unknown>).id)}`,
  }));

  const assets: SearchableRecord[] = (assetsRes.data ?? []).map((asset) => ({
    id: String((asset as Record<string, unknown>).id),
    type: "asset" as const,
    name: String((asset as Record<string, unknown>).file_name ?? ""),
    subtitle: `${String((asset as Record<string, unknown>).client_slug ?? "")} \u00b7 ${String((asset as Record<string, unknown>).status ?? "")} \u00b7 ${String((asset as Record<string, unknown>).folder ?? "library")}`,
    href: `/admin/assets/${String((asset as Record<string, unknown>).id)}`,
  }));

  return [...campaigns, ...events, ...clients, ...crmContacts, ...assets];
}
