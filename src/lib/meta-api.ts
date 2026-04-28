import { META_API_VERSION } from "@/lib/constants";

export type MetaInsightsTimeRange = {
  since: string;
  until: string;
};

/**
 * GET from Meta Graph API with Next.js revalidation (server-side reads).
 * Returns null on any failure instead of throwing.
 */
export async function metaGet<T>(url: URL, label?: string): Promise<T | null> {
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error(`[meta:${label ?? "unknown"}] HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    if (json.error) {
      console.error(`[meta:${label ?? "unknown"}] API error:`, json.error.message ?? json.error);
      return null;
    }
    return json as T;
  } catch (err) {
    console.error(`[meta:${label ?? "unknown"}] fetch failed:`, err);
    return null;
  }
}

/**
 * Build a Meta insights URL for a given campaign.
 */
export function metaInsightsUrl(
  campaignId: string,
  token: string,
  fields: string,
  opts?: {
    datePreset?: string;
    timeRange?: MetaInsightsTimeRange;
    breakdowns?: string;
    timeIncrement?: string;
    limit?: number;
  },
): URL {
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${campaignId}/insights`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("fields", fields);
  if (opts?.timeRange) {
    url.searchParams.set("time_range", JSON.stringify(opts.timeRange));
  } else if (opts?.datePreset) {
    url.searchParams.set("date_preset", opts.datePreset);
  }
  if (opts?.breakdowns) url.searchParams.set("breakdowns", opts.breakdowns);
  if (opts?.timeIncrement) url.searchParams.set("time_increment", opts.timeIncrement);
  if (opts?.limit) url.searchParams.set("limit", String(opts.limit));
  return url;
}

/** Meta Graph API base URL for a resource. */
export function metaUrl(path: string, token: string, params?: Record<string, string>): string {
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${path}`);
  url.searchParams.set("access_token", token);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  return url.toString();
}
