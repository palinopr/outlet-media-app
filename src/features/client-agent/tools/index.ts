import type { ClientAgentToolName } from "../tool-contracts";

import { getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown } from "./breakdowns";
import { compareEntities, getTimeseries } from "./compare-timeseries";
import { getCampaignDetails, getCreativeDetails, getEventDetails } from "./details";
import { getAdsOverview, getEventsOverview } from "./overview";
import { searchScope } from "./search";

export { searchScope } from "./search";
export { getAdsOverview, getEventsOverview } from "./overview";
export {
  getCampaignDetails,
  getCreativeDetails,
  getEventDetails,
} from "./details";
export {
  getDemographicBreakdown,
  getGeographyBreakdown,
  getPlacementBreakdown,
} from "./breakdowns";
export { compareEntities, getTimeseries } from "./compare-timeseries";

export const clientAgentToolHandlers: Record<ClientAgentToolName, unknown> = {
  search_scope: searchScope,
  get_ads_overview: getAdsOverview,
  get_events_overview: getEventsOverview,
  get_campaign_details: getCampaignDetails,
  get_event_details: getEventDetails,
  get_creative_details: getCreativeDetails,
  get_demographic_breakdown: getDemographicBreakdown,
  get_geography_breakdown: getGeographyBreakdown,
  get_placement_breakdown: getPlacementBreakdown,
  compare_entities: compareEntities,
  get_timeseries: getTimeseries,
};
