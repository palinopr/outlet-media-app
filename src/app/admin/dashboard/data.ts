import { supabaseAdmin } from "@/lib/supabase";
import { computeMarginalRoas } from "@/lib/formatters";
import { buildTrendData } from "@/app/client/[slug]/lib";
import type { Database } from "@/lib/database.types";
import { mapTaskToJob } from "@/lib/agent-jobs";
import { applyEffectiveCampaignClientSlugs } from "@/lib/campaign-client-assignment";

export type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
export type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

export interface AgentLastRun {
  agentId: string;
  status: string;
  finishedAt: string | null;
}

interface SnapshotRow {
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
  trendData: Array<{ date: string; roas: number; spend: number }>;
  velocityData: Array<{ date: string; sold: number }>;
  marginalRoasByCampaign: Record<string, number | null>;
  fromDb: boolean;
}

const EMPTY: DashboardData = {
  events: [],
  campaigns: [],
  allCampaigns: [],
  agentRuns: [],
  trendData: [],
  velocityData: [],
  marginalRoasByCampaign: {},
  fromDb: false,
};

export async function getData(): Promise<DashboardData> {
  if (!supabaseAdmin) return EMPTY;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [eventsRes, campaignsRes, allCampaignsRes, agentRunsRes, snapshotsRes, dailyRes] =
    await Promise.all([
      supabaseAdmin.from("tm_events").select("*").order("date", { ascending: true }).limit(200),
      supabaseAdmin.from("meta_campaigns").select("*").eq("status", "ACTIVE").order("spend", { ascending: false }).limit(5),
      supabaseAdmin.from("meta_campaigns").select("campaign_id, name, status, spend, roas, client_slug").order("spend", { ascending: false }).limit(100),
      supabaseAdmin
        .from("agent_tasks")
        .select("id, from_agent, to_agent, action, params, status, result, error, created_at, started_at, completed_at")
        .in("to_agent", ["meta-ads", "tm-monitor", "campaign-monitor"])
        .in("status", ["completed", "failed", "running", "pending"])
        .order("completed_at", { ascending: false })
        .limit(20),
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
  const campaigns = await applyEffectiveCampaignClientSlugs(
    ((campaignsRes.data ?? []) as MetaCampaign[]),
  ) as MetaCampaign[];
  const allCampaigns = await applyEffectiveCampaignClientSlugs(
    ((allCampaignsRes.data ?? []) as Pick<MetaCampaign, "name" | "status" | "spend" | "roas" | "client_slug" | "campaign_id">[]),
  ) as Pick<MetaCampaign, "name" | "status" | "spend" | "roas" | "client_slug">[];
  const snapshots = (snapshotsRes.data ?? []) as SnapshotRow[];
  const dailyRows = (dailyRes.data ?? []) as DailyRow[];

  const seen = new Set<string>();
  const agentRuns: AgentLastRun[] = [];
  for (const row of agentRunsRes.data ?? []) {
    const job = mapTaskToJob(row);
    if (!seen.has(job.agent_id)) {
      seen.add(job.agent_id);
      agentRuns.push({ agentId: job.agent_id, status: job.status, finishedAt: job.finished_at });
    }
  }

  const snapshotsByCampaign: Record<string, SnapshotRow[]> = {};
  for (const s of snapshots) {
    (snapshotsByCampaign[s.campaign_id] ??= []).push(s);
  }
  const trendData = buildTrendData(snapshots);

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

  const marginalRoasByCampaign: Record<string, number | null> = {};
  for (const c of campaigns) {
    const pts = (snapshotsByCampaign[c.campaign_id] ?? []).map(s => ({ date: s.snapshot_date, spend: s.spend, roas: s.roas }));
    marginalRoasByCampaign[c.campaign_id] = computeMarginalRoas(pts);
  }

  return { events, campaigns, allCampaigns, agentRuns, trendData, velocityData, marginalRoasByCampaign, fromDb: Boolean(campaigns.length) };
}
