import { currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import { type DateRange } from "@/lib/constants";
import { fetchAllCampaigns, type MetaCampaignCard } from "@/lib/meta-campaigns";
import type { ScopeFilter } from "@/lib/member-access";
import type { TmEvent, CampaignCard, EventCard } from "./types";
import { buildEventCard } from "./lib";

export type { DateRange };


async function getClientPortalReadClient() {
  if (!supabaseAdmin) return null;

  try {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string } | null)?.role;
    if (role === "admin") {
      return supabaseAdmin;
    }
  } catch {
    return null;
  }

  return (await createClerkSupabaseClient()) ?? null;
}

// --- Map shared MetaCampaignCard to client portal CampaignCard ---

export function toCampaignCard(c: MetaCampaignCard): CampaignCard {
  return {
    campaignId: c.campaignId,
    name: c.name,
    status: c.status,
    spend: c.spend,
    roas: c.roas,
    revenue: c.revenue,
    impressions: c.impressions,
    clicks: c.clicks,
    ctr: c.ctr,
    cpc: c.cpc,
    cpm: c.cpm,
    dailyBudget: c.dailyBudget,
    startTime: c.startTime,
  };
}

// --- Build event cards from TM data ---

function buildEventCards(events: TmEvent[]): EventCard[] {
  return events.map(buildEventCard);
}

// --- Campaigns page data (Meta API via shared module + daily insights) ---

export async function getCampaignsPageData(
  slug: string,
  range: DateRange,
  scope?: ScopeFilter,
): Promise<{
  campaigns: CampaignCard[];
  snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null; campaign_id: string }>;
  dataSource: "meta_api" | "supabase";
}> {
  const result = await fetchAllCampaigns(range, slug);

  let campaigns = result.campaigns
    .map(toCampaignCard)
    .sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return bTime - aTime;
    });

  if (scope?.allowedCampaignIds) {
    const allowed = new Set(scope.allowedCampaignIds);
    campaigns = campaigns.filter((c) => allowed.has(c.campaignId));
  }

  const campaignIds = new Set(campaigns.map((c) => c.campaignId));
  const snapshots = result.dailyInsights
    .filter((d) => campaignIds.has(d.campaignId))
    .map((d) => ({
      snapshot_date: d.date,
      roas: d.roas,
      spend: d.spend != null ? Math.round(d.spend * 100) : null,
      campaign_id: d.campaignId,
    }));

  return {
    campaigns,
    snapshots,
    dataSource: result.error ? "supabase" : "meta_api",
  };
}

// --- Events page data ---

export interface EventsPageData {
  events: EventCard[];
  totalEvents: number;
  onSaleCount: number;
  totalTicketsSold: number;
}

export async function getEventsPageData(
  slug: string,
  scope?: ScopeFilter,
): Promise<EventsPageData> {
  const db = await getClientPortalReadClient();

  let query = db
    ?.from("tm_events")
    .select("*")
    .eq("client_slug", slug)
    .order("date", { ascending: true });

  if (scope?.allowedEventIds && query) {
    query = query.in("id", scope.allowedEventIds);
  }

  const res = query ? await query : { data: null };
  const tmEvents = (res.data ?? []) as TmEvent[];
  const events = buildEventCards(tmEvents);

  const onSaleCount = events.filter(
    (e) => e.status.toLowerCase().replace(/_/g, "") === "onsale",
  ).length;

  const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);

  return {
    events,
    totalEvents: events.length,
    onSaleCount,
    totalTicketsSold,
  };
}
