import { supabaseAdmin } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";
import {
  buildAgentOutcomeView,
  type AgentOutcomeRequestRecord,
  type AgentOutcomeTaskRecord,
  type AgentOutcomeView,
  type AgentOutcomeVisibility,
} from "@/features/agent-outcomes/summary";

interface ListAgentOutcomesOptions {
  assetId?: string | null;
  audience?: "all" | AgentOutcomeVisibility;
  campaignId?: string | null;
  clientSlug?: string | null;
  contextType?: "all" | "campaign" | "crm_contact";
  crmContactId?: string | null;
  limit?: number;
  scopeCampaignIds?: string[] | null;
}

export interface AgentOutcomeContext {
  linkedActionItemId: string | null;
  linkedAssetFollowUpItemId: string | null;
  linkedCrmFollowUpItemId: string | null;
  request: AgentOutcomeRequestRecord;
  task: AgentOutcomeTaskRecord | null;
}

function mapRequestRow(row: Record<string, unknown>): AgentOutcomeRequestRecord {
  return {
    clientSlug: (row.client_slug as string | null) ?? null,
    createdAt: row.created_at as string,
    detail: (row.detail as string | null) ?? null,
    metadata: ((row.metadata as Record<string, unknown> | null) ?? {}) as Record<string, unknown>,
    summary: row.summary as string,
    taskId: row.entity_id as string,
    visibility: row.visibility as AgentOutcomeVisibility,
  };
}

function mapTaskRow(row: Record<string, unknown>): AgentOutcomeTaskRecord {
  return {
    action: row.action as string,
    completedAt: (row.completed_at as string | null) ?? null,
    createdAt: (row.created_at as string | null) ?? null,
    error: (row.error as string | null) ?? null,
    fromAgent: row.from_agent as string,
    id: row.id as string,
    params: (row.params as Json | null) ?? null,
    result: (row.result as Json | null) ?? null,
    startedAt: (row.started_at as string | null) ?? null,
    status: row.status as string,
    toAgent: row.to_agent as string,
  };
}

function matchesContext(
  request: AgentOutcomeRequestRecord,
  assetId: string | null | undefined,
  campaignId: string | null | undefined,
  contextType: "all" | "campaign" | "crm_contact",
  crmContactId: string | null | undefined,
  scopeCampaignIds?: Set<string> | null,
) {
  const requestAssetId =
    typeof request.metadata.assetId === "string" ? request.metadata.assetId : null;
  const requestCampaignId =
    typeof request.metadata.campaignId === "string" ? request.metadata.campaignId : null;
  const requestCrmContactId =
    typeof request.metadata.crmContactId === "string" ? request.metadata.crmContactId : null;

  if (assetId && requestAssetId !== assetId) return false;
  if (contextType === "campaign" && !requestCampaignId) return false;
  if (contextType === "crm_contact" && !requestCrmContactId) return false;
  if (campaignId && requestCampaignId !== campaignId) return false;
  if (crmContactId && requestCrmContactId !== crmContactId) return false;
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
    .map((row) => mapRequestRow(row as Record<string, unknown>))
    .filter((request) =>
      matchesContext(
        request,
        options.assetId,
        options.campaignId,
        options.contextType ?? "all",
        options.crmContactId,
        scopeCampaignIds,
      ),
    );

  if (requests.length === 0) return [];

  const taskIds = [...new Set(requests.map((request) => request.taskId))];
  const [
    { data: taskRows, error: tasksError },
    { data: linkedRows, error: linkedError },
    { data: linkedAssetRows, error: linkedAssetError },
    { data: linkedCrmRows, error: linkedCrmError },
  ] =
    await Promise.all([
      supabaseAdmin
        .from("agent_tasks")
        .select(
          "id, action, from_agent, to_agent, params, result, error, status, created_at, started_at, completed_at",
        )
        .in("id", taskIds),
      supabaseAdmin
        .from("campaign_action_items")
        .select("id, source_entity_id")
        .eq("source_entity_type", "agent_task")
        .in("source_entity_id", taskIds),
      supabaseAdmin
        .from("asset_follow_up_items" as never)
        .select("id, source_entity_id")
        .eq("source_entity_type", "agent_task")
        .in("source_entity_id", taskIds),
      supabaseAdmin
        .from("crm_follow_up_items" as never)
        .select("id, source_entity_id")
        .eq("source_entity_type", "agent_task")
        .in("source_entity_id", taskIds),
    ]);

  if (tasksError) {
    console.error("[agent-outcomes] task lookup failed:", tasksError.message);
    return requests
      .slice(0, options.limit ?? 6)
      .map((request) => buildAgentOutcomeView(request));
  }

  if (linkedError) {
    console.error("[agent-outcomes] linked action lookup failed:", linkedError.message);
  }

  if (linkedAssetError) {
    console.error(
      "[agent-outcomes] linked asset follow-up lookup failed:",
      linkedAssetError.message,
    );
  }

  if (linkedCrmError) {
    console.error("[agent-outcomes] linked CRM follow-up lookup failed:", linkedCrmError.message);
  }

  const tasks = new Map<string, AgentOutcomeTaskRecord>();
  for (const row of taskRows ?? []) {
    tasks.set(row.id as string, mapTaskRow(row as Record<string, unknown>));
  }

  const linkedActionItems = new Map<string, string>();
  for (const row of linkedRows ?? []) {
    const sourceEntityId = row.source_entity_id as string | null;
    const itemId = row.id as string | null;
    if (sourceEntityId && itemId) {
      linkedActionItems.set(sourceEntityId, itemId);
    }
  }

  const linkedAssetFollowUpItems = new Map<string, string>();
  for (const row of (linkedAssetRows ?? []) as Record<string, unknown>[]) {
    const sourceEntityId = row.source_entity_id as string | null;
    const itemId = row.id as string | null;
    if (sourceEntityId && itemId) {
      linkedAssetFollowUpItems.set(sourceEntityId, itemId);
    }
  }

  const linkedCrmFollowUpItems = new Map<string, string>();
  for (const row of (linkedCrmRows ?? []) as Record<string, unknown>[]) {
    const sourceEntityId = row.source_entity_id as string | null;
    const itemId = row.id as string | null;
    if (sourceEntityId && itemId) {
      linkedCrmFollowUpItems.set(sourceEntityId, itemId);
    }
  }

  return requests
    .map((request) =>
      buildAgentOutcomeView(
        request,
        tasks.get(request.taskId),
        linkedActionItems.get(request.taskId) ?? null,
        linkedAssetFollowUpItems.get(request.taskId) ?? null,
        linkedCrmFollowUpItems.get(request.taskId) ?? null,
      ),
    )
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

export async function getAgentOutcomeContext(taskId: string): Promise<AgentOutcomeContext | null> {
  if (!supabaseAdmin) return null;

  const { data: requestRow, error: requestError } = await supabaseAdmin
    .from("system_events")
    .select("entity_id, created_at, client_slug, summary, detail, metadata, visibility")
    .eq("event_name", "agent_action_requested")
    .eq("entity_type", "agent_task")
    .eq("entity_id", taskId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (requestError) {
    console.error("[agent-outcomes] request lookup failed:", requestError.message);
    return null;
  }

  if (!requestRow) return null;

  const [
    { data: taskRow, error: taskError },
    { data: linkedRow, error: linkedError },
    { data: linkedAssetRow, error: linkedAssetError },
    { data: linkedCrmRow, error: linkedCrmError },
  ] =
    await Promise.all([
      supabaseAdmin
        .from("agent_tasks")
        .select(
          "id, action, from_agent, to_agent, params, result, error, status, created_at, started_at, completed_at",
        )
        .eq("id", taskId)
        .maybeSingle(),
      supabaseAdmin
        .from("campaign_action_items")
        .select("id")
        .eq("source_entity_type", "agent_task")
        .eq("source_entity_id", taskId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("asset_follow_up_items" as never)
        .select("id")
        .eq("source_entity_type", "agent_task")
        .eq("source_entity_id", taskId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("crm_follow_up_items" as never)
        .select("id")
        .eq("source_entity_type", "agent_task")
        .eq("source_entity_id", taskId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (taskError) {
    console.error("[agent-outcomes] task lookup failed:", taskError.message);
  }

  if (linkedError) {
    console.error("[agent-outcomes] linked action lookup failed:", linkedError.message);
  }

  if (linkedAssetError) {
    console.error(
      "[agent-outcomes] linked asset follow-up lookup failed:",
      linkedAssetError.message,
    );
  }

  if (linkedCrmError) {
    console.error("[agent-outcomes] linked CRM follow-up lookup failed:", linkedCrmError.message);
  }

  return {
    linkedActionItemId: (linkedRow?.id as string | null) ?? null,
    linkedAssetFollowUpItemId:
      ((linkedAssetRow as Record<string, unknown> | null)?.id as string | null) ?? null,
    linkedCrmFollowUpItemId: ((linkedCrmRow as Record<string, unknown> | null)?.id as string | null) ?? null,
    request: mapRequestRow(requestRow as Record<string, unknown>),
    task: taskRow ? mapTaskRow(taskRow as Record<string, unknown>) : null,
  };
}
