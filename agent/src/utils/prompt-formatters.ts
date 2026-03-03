/** Format session data into prompt-friendly text blocks. */

import type { CampaignData, EventData } from "./session-loader.js";

export interface DemographicsData {
  fans_total?: number | null;
  fans_male_pct?: number | null;
  fans_female_pct?: number | null;
  fans_married_pct?: number | null;
  fans_with_children_pct?: number | null;
  age_18_24_pct?: number | null;
  age_25_34_pct?: number | null;
  age_35_44_pct?: number | null;
  age_45_54_pct?: number | null;
  age_over_54_pct?: number | null;
  income_0_30k_pct?: number | null;
  income_30_60k_pct?: number | null;
  income_60_90k_pct?: number | null;
  income_90_125k_pct?: number | null;
  income_over_125k_pct?: number | null;
}

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

function pct(v: number | null | undefined): string {
  return v != null ? `${v}%` : "--";
}

/** Format demographics data into a readable text block for agent prompts. */
export function formatDemographics(d: DemographicsData): string {
  const lines: string[] = [];

  if (d.fans_total != null) {
    lines.push(`Total fans tracked: ${d.fans_total.toLocaleString()}`);
  }

  if (d.fans_male_pct != null || d.fans_female_pct != null) {
    lines.push(`Gender: Male ${pct(d.fans_male_pct)} / Female ${pct(d.fans_female_pct)}`);
  }

  const ageParts = [
    d.age_18_24_pct != null ? `18-24: ${pct(d.age_18_24_pct)}` : null,
    d.age_25_34_pct != null ? `25-34: ${pct(d.age_25_34_pct)}` : null,
    d.age_35_44_pct != null ? `35-44: ${pct(d.age_35_44_pct)}` : null,
    d.age_45_54_pct != null ? `45-54: ${pct(d.age_45_54_pct)}` : null,
    d.age_over_54_pct != null ? `55+: ${pct(d.age_over_54_pct)}` : null,
  ].filter(Boolean);
  if (ageParts.length > 0) {
    lines.push(`Age: ${ageParts.join(", ")}`);
  }

  const incomeParts = [
    d.income_0_30k_pct != null ? `<$30k: ${pct(d.income_0_30k_pct)}` : null,
    d.income_30_60k_pct != null ? `$30-60k: ${pct(d.income_30_60k_pct)}` : null,
    d.income_60_90k_pct != null ? `$60-90k: ${pct(d.income_60_90k_pct)}` : null,
    d.income_90_125k_pct != null ? `$90-125k: ${pct(d.income_90_125k_pct)}` : null,
    d.income_over_125k_pct != null ? `$125k+: ${pct(d.income_over_125k_pct)}` : null,
  ].filter(Boolean);
  if (incomeParts.length > 0) {
    lines.push(`Income: ${incomeParts.join(", ")}`);
  }

  if (d.fans_married_pct != null) {
    lines.push(`Married: ${pct(d.fans_married_pct)}`);
  }
  if (d.fans_with_children_pct != null) {
    lines.push(`With children: ${pct(d.fans_with_children_pct)}`);
  }

  return lines.length > 0 ? lines.join("\n") : "No demographics data available.";
}
