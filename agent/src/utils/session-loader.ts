/** Load cached session data (events, campaigns) from JSON files. */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { todayCST, yesterdayCST, tomorrowCST } from "./date-helpers.js";

export interface EventData {
  name: string;
  date: string;
  venue?: string;
  city?: string;
  artist?: string;
  tickets_sold?: number;
  tickets_total?: number;
  status?: string;
  tm1_id?: string;
}

export interface CampaignData {
  id?: string;
  name: string;
  status?: string;
  effective_status?: string;
  daily_budget?: string;
  daily_budget_cents?: number;
  lifetime_budget?: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  roas?: string;
  purchase_roas?: string;
  reach?: string;
}

export async function loadEvents(): Promise<EventData[]> {
  const path = "session/last-events.json";
  if (!existsSync(path)) return [];
  try {
    const raw = await readFile(path, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as EventData[];
    if (
      parsed &&
      typeof parsed === "object" &&
      "data" in parsed &&
      Array.isArray((parsed as { data: unknown }).data)
    ) {
      return (parsed as { data: EventData[] }).data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function loadCampaigns(): Promise<CampaignData[]> {
  const path = "session/last-campaigns.json";
  if (!existsSync(path)) return [];
  try {
    const raw = await readFile(path, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CampaignData[];
    if (
      parsed &&
      typeof parsed === "object" &&
      "data" in parsed &&
      Array.isArray((parsed as { data: unknown }).data)
    ) {
      return (parsed as { data: CampaignData[] }).data;
    }
    return [];
  } catch {
    return [];
  }
}

export function categorizeEvents(events: EventData[]) {
  const t = todayCST();
  const y = yesterdayCST();
  const tm = tomorrowCST();

  const today: EventData[] = [];
  const tomorrow: EventData[] = [];
  const yesterday: EventData[] = [];
  const upcoming: EventData[] = [];

  for (const ev of events) {
    const d = ev.date?.slice(0, 10);
    if (d === t) today.push(ev);
    else if (d === tm) tomorrow.push(ev);
    else if (d === y) yesterday.push(ev);
    else if (d && d > t) upcoming.push(ev);
  }

  return { today, tomorrow, yesterday, upcoming };
}
