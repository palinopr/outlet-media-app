import {
  getCampaignDetail,
  type CampaignDetailRangeInput,
} from "@/features/client-portal/campaign-detail";
import { getEventDetail } from "@/features/client-portal/event-detail";
import type { ScopeFilter } from "@/lib/member-access";
import type { ResolvedRange } from "./types";

function toCampaignDetailRange(range: ResolvedRange): CampaignDetailRangeInput {
  switch (range.preset) {
    case "today":
      return "today";
    case "yesterday":
      return "yesterday";
    case "last_7_days":
      return "7";
    case "last_30_days":
      return "30";
    case "lifetime":
      return "lifetime";
    case "this_week":
      return { since: range.startDate, until: range.endDate, label: "This Week" };
    case "this_month":
      return { since: range.startDate, until: range.endDate, label: "This Month" };
    case "this_quarter":
      return { since: range.startDate, until: range.endDate, label: "This Quarter" };
    case "custom":
      return { since: range.startDate, until: range.endDate, label: "Custom Range" };
  }
}

export async function loadClientAgentCampaignDetail({
  campaignId,
  range,
  scope,
  slug,
}: {
  campaignId: string;
  range: ResolvedRange;
  scope: ScopeFilter;
  slug: string;
}) {
  return getCampaignDetail(slug, campaignId, toCampaignDetailRange(range), scope);
}

export async function loadClientAgentEventDetail({
  eventId,
  scope,
  slug,
}: {
  eventId: string;
  scope: ScopeFilter;
  slug: string;
}) {
  return getEventDetail(slug, eventId, scope);
}
