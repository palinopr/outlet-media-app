import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase";

export interface ClientPortalConfig {
  clientId: string;
  slug: string;
  brandName: string | null;
  logoUrl: string | null;
  logoAlt: string | null;
}

// Server-only read. Call after the client layout/access resolver has already authorized the viewer.
export const getClientPortalConfig = cache(
  async (slug: string): Promise<ClientPortalConfig | null> => {
    if (!supabaseAdmin) return null;

    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("id, slug, portal_brand_name, portal_logo_url, portal_logo_alt")
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
      brandName: data.portal_brand_name,
      logoUrl: data.portal_logo_url,
      logoAlt: data.portal_logo_alt,
    };
  },
);
