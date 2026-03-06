import { supabaseAdmin } from "@/lib/supabase";
import {
  buildAgentOutcomeView,
  type AgentOutcomeRequestRecord,
  type AgentOutcomeTaskRecord,
  type AgentOutcomeView,
  type AgentOutcomeVisibility,
} from "@/features/agent-outcomes/summary";

interface ListAgentOutcomesOptions {
  audience?: "all" | AgentOutcomeVisibility;
  campaignId?: string | null;
  clientSlug?: string | null;
  limit?: number;
  scopeCampaignIds?: string[] | null;
}

function matchesCampaign(
  request: AgentOutcomeRequestRecord,
  campaignId: string | null | undefined,
  scopeCampaignIds?: Set<string> | null,
) {
  const requestCampaignId =
    typeof request.metadata.campaignId === "string" ? request.metadata.campaignId : null;

  if (campaignId && requestCampaignId !== campaignId) return false;
  if (scopeCampaignIds && (!requestCampaignId || !scopeCampaignIds.has(requestCampaignId))) {
    return false;
  }
  return true;
}

export async function listAgentOutcomes(
  options: ListAgentOutcomesOptions = {},
): Promise<AgentOutcomeView[]> {
  if (!supabaseAdmin) return [];
  const scopeCampaignIds = options.scopeCampaignIds ? new Set(options.scopeCampaignIds) : null;

  let eventsQuery = supabaseAdmin
    .from("system_events")
    .select("entity_id, created_at, client_slug, summary, detail, metadata, visibility")
    .eq("event_name", "agent_action_requested")
    .eq("entity_type", "agent_task")
    .order("created_at", { ascending: false })
    .limit(Math.max((options.limit ?? 6) * 8, 24));

  if (options.clientSlug) {
    eventsQuery = eventsQuery.eq("client_slug", options.clientSlug);
  }

  if (options.audience && options.audience !== "all") {
    eventsQuery = eventsQuery.eq("visibility", options.audience);
  }

  const { data: eventRows, error: eventsError } = await eventsQuery;
  if (eventsError) {
    console.error("[agent-outcomes] event lookup failed:", eventsError.message);
    return [];
  }

  const requests: AgentOutcomeRequestRecord[] = (eventRows ?? [])
    .map((row) => ({
      clientSlug: (row.client_slug as string | null) ?? null,
      createdAt: row.created_at as string,
      detail: (row.detail as string | null) ?? null,
      metadata: ((row.metadata as Record<string, unknown> | null) ?? {}) as Record<
        string,
        unknown
      >,
      summary: row.summary as string,
      taskId: row.entity_id as string,
      visibility: row.visibility as AgentOutcomeVisibility,
    }))
    .filter((request) => matchesCampaign(request, options.campaignId, scopeCampaignIds));

  if (requests.length === 0) return [];

  const taskIds = [...new Set(requests.map((request) => request.taskId))];
  const { data: taskRows, error: tasksError } = await supabaseAdmin
    .from("agent_tasks")
    .select(
      "id, action, from_agent, to_agent, params, result, error, status, created_at, started_at, completed_at",
    )
    .in("id", taskIds);

  if (tasksError) {
    console.error("[agent-outcomes] task lookup failed:", tasksError.message);
    return requests
      .slice(0, options.limit ?? 6)
      .map((request) => buildAgentOutcomeView(request));
  }

  const tasks = new Map<string, AgentOutcomeTaskRecord>();
  for (const row of taskRows ?? []) {
    tasks.set(row.id as string, {
      action: row.action as string,
      completedAt: (row.completed_at as string | null) ?? null,
      createdAt: (row.created_at as string | null) ?? null,
      error: (row.error as string | null) ?? null,
      fromAgent: row.from_agent as string,
      id: row.id as string,
      params: row.params ?? null,
      result: row.result ?? null,
      startedAt: (row.started_at as string | null) ?? null,
      status: row.status as string,
      toAgent: row.to_agent as string,
    });
  }

  return requests
    .map((request) => buildAgentOutcomeView(request, tasks.get(request.taskId)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, options.limit ?? 6);
}

export async function listCampaignAgentOutcomes(
  clientSlug: string,
  campaignId: string,
  audience: "all" | AgentOutcomeVisibility,
  limit = 6,
) {
  return listAgentOutcomes({
    audience,
    campaignId,
    clientSlug,
    limit,
  });
}
