import { cache } from "react";
import { supabaseAdmin, createClerkSupabaseClient } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export interface ClientPortalConfig {
  clientId: string;
  slug: string;
  eventsEnabled: boolean;
  reportsEnabled: boolean;
  brandName: string | null;
  logoUrl: string | null;
  logoAlt: string | null;
}

export const getClientPortalConfig = cache(
  async (slug: string): Promise<ClientPortalConfig | null> => {
    let db: Awaited<ReturnType<typeof createClerkSupabaseClient>> | typeof supabaseAdmin;

    try {
      const user = await currentUser();
      const role = (user?.publicMetadata as { role?: string } | null)?.role;
      if (role === "admin") {
        if (!supabaseAdmin) return null;
        db = supabaseAdmin;
      } else {
        const clerkDb = await createClerkSupabaseClient();
        if (!clerkDb) return null;
        db = clerkDb;
      }
    } catch {
      return null;
    }

    const { data, error } = await db
      .from("clients")
      .select(
        "id, slug, events_enabled, reports_enabled, portal_brand_name, portal_logo_url, portal_logo_alt",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[client-portal/config] failed to load portal config:", error.message);
      return null;
    }

    if (!data) return null;

    return {
      clientId: data.id,
      slug: data.slug,
      eventsEnabled: data.events_enabled ?? false,
      reportsEnabled: data.reports_enabled ?? true,
      brandName: data.portal_brand_name,
      logoUrl: data.portal_logo_url,
      logoAlt: data.portal_logo_alt,
    };
  },
);
