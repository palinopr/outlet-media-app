import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase";

export interface ClientPortalConfig {
  clientId: string;
  eventsEnabled: boolean;
}

export const getClientPortalConfig = cache(
  async (slug: string): Promise<ClientPortalConfig | null> => {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("id, events_enabled")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[client-portal/config] failed to load portal config:", error.message);
      return null;
    }

    if (!data) return null;

    return {
      clientId: data.id,
      eventsEnabled: data.events_enabled ?? false,
    };
  },
);
