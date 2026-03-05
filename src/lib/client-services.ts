import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import type { ServiceKey } from "./service-registry";

export interface ClientService {
  id: string;
  clientId: string;
  serviceKey: ServiceKey;
  enabled: boolean;
  config: Record<string, unknown>;
}

export const getEnabledServices = cache(
  async (slug: string): Promise<ServiceKey[] | null> => {
    if (!supabaseAdmin) return null;

    const { data } = await supabaseAdmin
      .from("client_services")
      .select("service_key, clients!inner(slug)")
      .eq("clients.slug", slug)
      .eq("enabled", true);

    if (!data || data.length === 0) return null;

    return data.map((r) => r.service_key as ServiceKey);
  },
);

export async function getClientServices(
  clientId: string,
): Promise<ClientService[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from("client_services")
    .select("id, client_id, service_key, enabled, config")
    .eq("client_id", clientId);

  if (!data) return [];

  return data.map((r) => ({
    id: r.id,
    clientId: r.client_id,
    serviceKey: r.service_key as ServiceKey,
    enabled: r.enabled,
    config: (r.config ?? {}) as Record<string, unknown>,
  }));
}

export async function toggleClientService(
  clientId: string,
  serviceKey: ServiceKey,
  enabled: boolean,
  config?: Record<string, unknown>,
): Promise<void> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("client_services")
    .upsert(
      {
        client_id: clientId,
        service_key: serviceKey,
        enabled,
        config: config ?? {},
      },
      { onConflict: "client_id,service_key" },
    );

  if (error) throw new Error(error.message);
}

export async function seedClientServices(
  clientId: string,
  serviceKeys: ServiceKey[],
): Promise<void> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const rows = serviceKeys.map((key) => ({
    client_id: clientId,
    service_key: key,
    enabled: true,
  }));

  if (rows.length === 0) return;

  const { error } = await supabaseAdmin
    .from("client_services")
    .upsert(rows, { onConflict: "client_id,service_key" });

  if (error) throw new Error(error.message);
}
