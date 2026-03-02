/** Format session data into prompt-friendly text blocks. */

import type { CampaignData, EventData } from "./session-loader.js";

export function campaignsSummary(campaigns: CampaignData[]): string {
  if (campaigns.length === 0) return "No campaign data available.";
  return campaigns
    .map((c) => {
      const status = c.effective_status || c.status || "unknown";
      const spend = c.spend ? `$${parseFloat(c.spend).toFixed(2)}` : "--";
      const budget = c.daily_budget
        ? `$${(parseFloat(c.daily_budget) / 100).toFixed(2)}/day`
        : c.daily_budget_cents
          ? `$${(c.daily_budget_cents / 100).toFixed(2)}/day`
          : "--";
      const roas = c.purchase_roas || c.roas || "--";
      return `- ${c.name}: ${status} | spend=${spend} budget=${budget} roas=${roas}`;
    })
    .join("\n");
}

export function eventsSummary(events: EventData[], label: string): string {
  if (events.length === 0) return `No ${label} events.`;
  return events
    .map((ev) => {
      const tickets =
        ev.tickets_sold != null && ev.tickets_total != null
          ? ` | ${ev.tickets_sold}/${ev.tickets_total} tickets`
          : "";
      return `- ${ev.name} @ ${ev.venue || "TBD"}, ${ev.city || ""}${tickets}`;
    })
    .join("\n");
}
