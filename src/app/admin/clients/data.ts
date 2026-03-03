import { supabaseAdmin } from "@/lib/supabase";
import { slugToLabel } from "@/lib/formatters";

export interface ClientSummary {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  joinedAt: string;
  activeShows: number;
  activeCampaigns: number;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
}

export async function getClientSummaries(): Promise<ClientSummary[]> {
  if (!supabaseAdmin) return [];

  const [campaignsRes, eventsRes] = await Promise.all([
    supabaseAdmin.from("meta_campaigns").select("client_slug, status, spend, roas, start_time"),
    supabaseAdmin.from("tm_events").select("client_slug").not("client_slug", "is", null),
  ]);

  if (!campaignsRes.data?.length) return [];

  // Count events per client
  const showsBySlug: Record<string, number> = {};
  for (const e of (eventsRes.data ?? [])) {
    const slug = e.client_slug as string;
    showsBySlug[slug] = (showsBySlug[slug] ?? 0) + 1;
  }

  // Group campaigns by slug
  const bySlug: Record<string, typeof campaignsRes.data> = {};
  for (const c of campaignsRes.data) {
    const slug = c.client_slug ?? "unknown";
    (bySlug[slug] ??= []).push(c);
  }

  return Object.entries(bySlug).map(([slug, rows]) => {
    const totalSpend = rows.reduce((s, c) => s + ((c.spend ?? 0) / 100), 0);
    const totalRevenue = rows.reduce((s, c) => s + ((c.spend ?? 0) / 100) * (c.roas ?? 0), 0);
    const activeCampaigns = rows.filter((c) => c.status === "ACTIVE").length;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    // Use earliest campaign start_time as "joined" date
    const startTimes = rows.map((c) => c.start_time).filter(Boolean) as string[];
    const earliest = startTimes.length > 0 ? startTimes.sort()[0] : null;
    const joinedAt = earliest
      ? new Date(earliest).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "—";

    return {
      id: slug,
      name: slugToLabel(slug),
      slug,
      type: "Music Promoter",
      status: activeCampaigns > 0 ? "active" : "paused",
      joinedAt,
      activeShows: showsBySlug[slug] ?? 0,
      activeCampaigns,
      totalSpend,
      totalRevenue,
      roas,
    };
  });
}
