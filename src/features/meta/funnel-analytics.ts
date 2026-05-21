import { supabaseAdmin } from "@/lib/supabase";

export type FunnelEngagementRow = {
  created_at?: string | null;
  cta?: string | null;
  device_type?: string | null;
  event_name: string;
  funnel?: string | null;
  market?: string | null;
  meta_ad_id?: string | null;
  meta_ad_name?: string | null;
  placement?: string | null;
  sample_rate?: number | string | null;
  scroll_depth_pct?: number | null;
  section_id?: string | null;
  session_id?: string | null;
  site_source?: string | null;
  utm_content?: string | null;
};

export type FunnelMetric = {
  id: string;
  label: string;
  count: number;
  sessions?: number;
  rate?: number | null;
};

export type FunnelCtaMetric = FunnelMetric & {
  clicks: number;
  ctr: number | null;
  impressions: number;
};

export type FunnelCreativeMetric = FunnelMetric & {
  clicks: number;
  source: string;
};

export type FunnelEngagementSummary = {
  ctas: FunnelCtaMetric[];
  deviceSplit: FunnelMetric[];
  fromDb: boolean;
  lookbackDays: number;
  scrollDepths: FunnelMetric[];
  sections: FunnelMetric[];
  topSources: FunnelCreativeMetric[];
  totals: {
    ctaClicks: number;
    ctaCtr: number | null;
    ctaImpressions: number;
    pageViews: number;
    scroll75Rate: number | null;
    sessions: number;
  };
  updatedAt: string | null;
};

const ACTIVE_FUNNEL_MARKETS = new Map([
  ["ataca-sergio", new Set(["newark"])],
  ["9am", new Set(["orlando", "philadelphia", "dc", "atlanta"])],
]);

function isActiveFunnelMarket(row: Pick<FunnelEngagementRow, "funnel" | "market">) {
  if (!row.funnel || !row.market) return false;
  return ACTIVE_FUNNEL_MARKETS.get(row.funnel)?.has(row.market) ?? false;
}

const EMPTY_SUMMARY: FunnelEngagementSummary = {
  ctas: [],
  deviceSplit: [],
  fromDb: false,
  lookbackDays: 7,
  scrollDepths: [],
  sections: [],
  topSources: [],
  totals: {
    ctaClicks: 0,
    ctaCtr: null,
    ctaImpressions: 0,
    pageViews: 0,
    scroll75Rate: null,
    sessions: 0,
  },
  updatedAt: null,
};

function weight(_row: FunnelEngagementRow) {
  return 1;
}

function addCount(map: Map<string, number>, key: string, amount: number) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function addSession(map: Map<string, Set<string>>, key: string, sessionId: string | null | undefined) {
  if (!sessionId) return;
  const sessions = map.get(key) ?? new Set<string>();
  sessions.add(sessionId);
  map.set(key, sessions);
}

function roundCount(value: number) {
  return Math.round(value);
}

function rate(numerator: number, denominator: number) {
  if (denominator <= 0) return null;
  return numerator / denominator;
}

function titleize(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sortedMetrics(counts: Map<string, number>, sessions?: Map<string, Set<string>>, denominator?: number): FunnelMetric[] {
  return Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      label: titleize(id),
      count: roundCount(count),
      sessions: sessions?.get(id)?.size,
      rate: denominator ? rate(count, denominator) : null,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function sourceKey(row: FunnelEngagementRow) {
  return row.meta_ad_name || row.utm_content || row.meta_ad_id || row.placement || row.site_source || "unknown";
}

function isSourceClick(row: FunnelEngagementRow) {
  if (row.event_name === "ticket_redirect") return true;
  return row.event_name === "ticket_click" && row.funnel !== "ataca-sergio";
}

export function aggregateFunnelEngagement(rows: FunnelEngagementRow[], lookbackDays = 7): FunnelEngagementSummary {
  const sessions = new Set<string>();
  const sections = new Map<string, number>();
  const sectionSessions = new Map<string, Set<string>>();
  const scrollDepths = new Map<string, number>();
  const scrollDepthSessions = new Map<string, Set<string>>();
  const deviceSplit = new Map<string, number>();
  const ctaImpressions = new Map<string, number>();
  const ctaClicks = new Map<string, number>();
  const ctaSessions = new Map<string, Set<string>>();
  const sourceCounts = new Map<string, number>();
  const sourceClicks = new Map<string, number>();
  const sourceSessions = new Map<string, Set<string>>();
  const sessionsAt75 = new Set<string>();
  let pageViews = 0;
  let totalCtaImpressions = 0;
  let totalCtaClicks = 0;
  let latest: string | null = null;

  for (const row of rows) {
    if (!isActiveFunnelMarket(row)) continue;
    const eventWeight = weight(row);
    if (row.session_id) sessions.add(row.session_id);
    if (row.created_at && (!latest || row.created_at > latest)) latest = row.created_at;

    if (row.event_name === "page_view") {
      pageViews += eventWeight;
      addCount(deviceSplit, row.device_type || "unknown", eventWeight);
    }

    if (row.event_name === "section_visible" && row.section_id) {
      addCount(sections, row.section_id, eventWeight);
      addSession(sectionSessions, row.section_id, row.session_id);
    }

    if (row.event_name === "scroll_depth" && row.scroll_depth_pct) {
      const key = `${row.scroll_depth_pct}%`;
      addCount(scrollDepths, key, eventWeight);
      addSession(scrollDepthSessions, key, row.session_id);
      if (row.scroll_depth_pct >= 75 && row.session_id) sessionsAt75.add(row.session_id);
    }

    if (row.event_name === "cta_impression" && row.cta) {
      totalCtaImpressions += eventWeight;
      addCount(ctaImpressions, row.cta, eventWeight);
      addSession(ctaSessions, row.cta, row.session_id);
    }

    if (row.event_name === "ticket_click" && row.cta) {
      totalCtaClicks += eventWeight;
      addCount(ctaClicks, row.cta, eventWeight);
      addSession(ctaSessions, row.cta, row.session_id);
    }

    if (["page_view", "qualified_view", "section_visible", "cta_impression", "ticket_click", "ticket_redirect"].includes(row.event_name)) {
      const key = sourceKey(row);
      addCount(sourceCounts, key, eventWeight);
      addSession(sourceSessions, key, row.session_id);
      if (isSourceClick(row)) {
        addCount(sourceClicks, key, eventWeight);
      }
    }
  }

  const ctaIds = new Set([...ctaImpressions.keys(), ...ctaClicks.keys()]);
  const ctas = Array.from(ctaIds)
    .map((id) => {
      const impressions = roundCount(ctaImpressions.get(id) ?? 0);
      const clicks = roundCount(ctaClicks.get(id) ?? 0);
      return {
        id,
        label: titleize(id),
        count: clicks,
        clicks,
        ctr: rate(clicks, impressions),
        impressions,
        sessions: ctaSessions.get(id)?.size,
      };
    })
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions || a.label.localeCompare(b.label));

  const topSources = Array.from(sourceCounts.entries())
    .map(([id, count]) => ({
      id,
      label: titleize(id),
      count: roundCount(count),
      clicks: roundCount(sourceClicks.get(id) ?? 0),
      sessions: sourceSessions.get(id)?.size,
      source: id,
    }))
    .sort((a, b) => b.clicks - a.clicks || b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 8);

  return {
    ctas,
    deviceSplit: sortedMetrics(deviceSplit, undefined, pageViews),
    fromDb: rows.length > 0,
    lookbackDays,
    scrollDepths: sortedMetrics(scrollDepths, scrollDepthSessions, pageViews),
    sections: sortedMetrics(sections, sectionSessions, pageViews),
    topSources,
    totals: {
      ctaClicks: roundCount(totalCtaClicks),
      ctaCtr: rate(totalCtaClicks, totalCtaImpressions),
      ctaImpressions: roundCount(totalCtaImpressions),
      pageViews: roundCount(pageViews),
      scroll75Rate: rate(sessionsAt75.size, sessions.size),
      sessions: sessions.size,
    },
    updatedAt: latest,
  };
}

export async function getFunnelEngagementSummary({
  lookbackDays = 7,
  limit = 10_000,
}: {
  lookbackDays?: number;
  limit?: number;
} = {}): Promise<FunnelEngagementSummary> {
  if (!supabaseAdmin) return { ...EMPTY_SUMMARY, lookbackDays };

  const since = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("marketing_attribution_events")
    .select([
      "created_at",
      "cta",
      "device_type",
      "event_name",
      "funnel",
      "market",
      "meta_ad_id",
      "meta_ad_name",
      "placement",
      "sample_rate",
      "scroll_depth_pct",
      "section_id",
      "session_id",
      "site_source",
      "utm_content",
    ].join(","))
    .gte("created_at", since)
    .in("event_name", ["page_view", "qualified_view", "scroll_depth", "section_visible", "cta_impression", "ticket_click", "ticket_redirect"])
    .in("funnel", Array.from(ACTIVE_FUNNEL_MARKETS.keys()))
    .in("market", Array.from(new Set(Array.from(ACTIVE_FUNNEL_MARKETS.values()).flatMap((markets) => Array.from(markets)))))
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[funnel-analytics] failed to load funnel engagement:", error.message);
    return { ...EMPTY_SUMMARY, lookbackDays };
  }

  return aggregateFunnelEngagement((data ?? []) as unknown as FunnelEngagementRow[], lookbackDays);
}
