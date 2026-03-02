import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

export interface AgentLastRun {
  agentId: string;
  status: string;
  finishedAt: string | null;
}

export interface Alert {
  id: string;
  message: string;
  level: string;
  created_at: string;
}

export interface SnapshotRow {
  snapshot_date: string;
  roas: number | null;
  spend: number | null;
  campaign_id: string;
}

interface DailyRow {
  snapshot_date: string;
  tickets_sold: number | null;
}

export interface DashboardData {
  events: TmEvent[];
  campaigns: MetaCampaign[];
  allCampaigns: Pick<MetaCampaign, "name" | "status" | "spend" | "roas" | "client_slug">[];
  agentRuns: AgentLastRun[];
  alerts: Alert[];
  trendData: Array<{ date: string; roas: number; spend: number }>;
  velocityData: Array<{ date: string; sold: number }>;
  snapshotsByCampaign: Record<string, SnapshotRow[]>;
  fromDb: boolean;
}

const EMPTY: DashboardData = {
  events: [],
  campaigns: [],
  allCampaigns: [],
  agentRuns: [],
  alerts: [],
  trendData: [],
  velocityData: [],
  snapshotsByCampaign: {},
  fromDb: false,
};

export async function getData(): Promise<DashboardData> {
  if (!supabaseAdmin) return EMPTY;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [eventsRes, campaignsRes, allCampaignsRes, agentRunsRes, alertsRes, snapshotsRes, dailyRes] =
    await Promise.all([
      supabaseAdmin.from("tm_events").select("*").order("date", { ascending: true }).limit(200),
      supabaseAdmin.from("meta_campaigns").select("*").eq("status", "ACTIVE").order("spend", { ascending: false }).limit(5),
      supabaseAdmin.from("meta_campaigns").select("name, status, spend, roas, client_slug").order("spend", { ascending: false }).limit(100),
      supabaseAdmin
        .from("agent_jobs")
        .select("agent_id, status, finished_at")
        .in("agent_id", ["meta-ads", "tm-monitor", "campaign-monitor"])
        .in("status", ["done", "error"])
        .order("finished_at", { ascending: false })
        .limit(20),
      supabaseAdmin
        .from("agent_alerts")
        .select("id, message, level, created_at")
        .is("read_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
      supabaseAdmin
        .from("campaign_snapshots")
        .select("campaign_id, snapshot_date, roas, spend")
        .gte("snapshot_date", thirtyDaysAgo)
        .order("snapshot_date", { ascending: true })
        .limit(500),
      supabaseAdmin
        .from("event_snapshots")
        .select("snapshot_date, tickets_sold")
        .gte("snapshot_date", thirtyDaysAgo)
        .not("tickets_sold", "is", null)
        .order("snapshot_date", { ascending: true }),
    ]);

  const events = (eventsRes.data ?? []) as TmEvent[];
  const campaigns = (campaignsRes.data ?? []) as MetaCampaign[];
  const allCampaigns = (allCampaignsRes.data ?? []) as Pick<MetaCampaign, "name" | "status" | "spend" | "roas" | "client_slug">[];
  const alerts = (alertsRes.data ?? []) as Alert[];
  const snapshots = (snapshotsRes.data ?? []) as SnapshotRow[];
  const dailyRows = (dailyRes.data ?? []) as DailyRow[];

  const seen = new Set<string>();
  const agentRuns: AgentLastRun[] = [];
  for (const row of agentRunsRes.data ?? []) {
    if (!seen.has(row.agent_id)) {
      seen.add(row.agent_id);
      agentRuns.push({ agentId: row.agent_id, status: row.status, finishedAt: row.finished_at });
    }
  }

  const snapshotsByCampaign: Record<string, SnapshotRow[]> = {};
  for (const s of snapshots) {
    (snapshotsByCampaign[s.campaign_id] ??= []).push(s);
  }

  const byDate: Record<string, { roasSum: number; roasCount: number; spendSum: number }> = {};
  for (const s of snapshots) {
    const d = s.snapshot_date;
    if (!byDate[d]) byDate[d] = { roasSum: 0, roasCount: 0, spendSum: 0 };
    if (s.roas != null) { byDate[d].roasSum += s.roas; byDate[d].roasCount++; }
    if (s.spend != null) byDate[d].spendSum += s.spend / 100;
  }
  const trendData = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      roas: v.roasCount > 0 ? v.roasSum / v.roasCount : 0,
      spend: v.spendSum,
    }));

  const dailyByDate: Record<string, number> = {};
  for (const row of dailyRows) {
    if (row.tickets_sold != null) {
      dailyByDate[row.snapshot_date] = (dailyByDate[row.snapshot_date] ?? 0) + row.tickets_sold;
    }
  }
  const velocityData = Object.entries(dailyByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sold]) => ({
      date: new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sold,
    }));

  return { events, campaigns, allCampaigns, agentRuns, alerts, trendData, velocityData, snapshotsByCampaign, fromDb: Boolean(campaigns.length) };
}
