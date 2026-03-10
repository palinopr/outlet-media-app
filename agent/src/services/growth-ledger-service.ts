import { createLedgerTask, type LedgerTask } from "./ledger-service.js";
import {
  isGrowthAccountPlatform,
  isGrowthAgentKey,
  isGrowthInboundSourceType,
  isGrowthInboundStatus,
  isGrowthLeadStatus,
  isGrowthPlaybookPod,
  isGrowthPlaybookStatus,
  isGrowthTaskAction,
} from "../growth/contracts.js";
import type {
  CreateGrowthAgentTaskInput,
  CreateGrowthInboundEventInput,
  CreateGrowthLeadInput,
  CreateGrowthPlaybookInput,
  GrowthInboundRow,
  GrowthLeadRow,
  GrowthPlaybookRow,
  UpdateGrowthLeadInput,
} from "./growth-ledger-types.js";
import {
  compactRecord,
  requireSupabase,
  resolveGrowthAccountId,
  resolveGrowthInboundEventId,
  resolveGrowthJobId,
  resolveGrowthLaneId,
  resolveGrowthLeadId,
  resolveGrowthPostTargetId,
  safeLogGrowthEvent,
} from "./growth-ledger-resolve.js";

// Barrel re-exports
export * from "./growth-ledger-types.js";
export {
  logGrowthEvent,
  safeLogGrowthEvent,
  listGrowthAccounts,
  listGrowthLanes,
  listGrowthIdeas,
  listGrowthJobs,
  listGrowthTargets,
  listGrowthPlaybooks,
  listGrowthInboundEvents,
  listGrowthLeads,
  listGrowthPublishAttempts,
} from "./growth-ledger-resolve.js";
export {
  upsertGrowthAccount,
  upsertGrowthLane,
  createGrowthIdea,
  createGrowthContentJob,
  createGrowthPostTarget,
  createGrowthPublishAttempt,
  updateGrowthPublishAttempt,
} from "./growth-ledger-writers.js";

export async function createGrowthInboundEvent(
  input: CreateGrowthInboundEventInput,
): Promise<GrowthInboundRow> {
  if (!isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth inbound platform: ${input.platform}`);
  }

  if (!isGrowthInboundSourceType(input.sourceType)) {
    throw new Error(`Invalid growth inbound source type: ${input.sourceType}`);
  }

  const status = input.status ?? "new";
  if (!isGrowthInboundStatus(status)) {
    throw new Error(`Invalid growth inbound status: ${status}`);
  }

  const supabase = requireSupabase();
  const accountId = await resolveGrowthAccountId(input.accountRef);
  const contentJobId = input.contentJobRef
    ? await resolveGrowthJobId(input.contentJobRef)
    : null;
  const postTargetId = await resolveGrowthPostTargetId(input.postTargetRef);

  const { data, error } = await supabase
    .from("growth_inbound_events")
    .insert({
      account_id: accountId,
      content_job_id: contentJobId,
      post_target_id: postTargetId,
      platform: input.platform,
      source_type: input.sourceType,
      sender_handle: input.senderHandle ?? null,
      sender_display_name: input.senderDisplayName ?? null,
      body_text: input.bodyText,
      event_at: input.eventAt ?? new Date().toISOString(),
      status,
      metadata: input.metadata ?? {},
    })
    .select("id, platform, source_type, status")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_inbound_event",
    eventName: "growth_inbound_event_created",
    metadata: {
      accountId,
      contentJobId,
      platform: input.platform,
      postTargetId,
      sourceType: input.sourceType,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth inbound captured from ${input.platform}`,
  });

  return data as GrowthInboundRow;
}

export async function createGrowthLead(
  input: CreateGrowthLeadInput,
): Promise<GrowthLeadRow> {
  const status = input.status ?? "new";
  if (!isGrowthLeadStatus(status)) {
    throw new Error(`Invalid growth lead status: ${status}`);
  }

  if (input.platform && !isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth lead platform: ${input.platform}`);
  }

  if (
    input.score != null &&
    (!Number.isFinite(input.score) || input.score < 0 || input.score > 100)
  ) {
    throw new Error("Growth lead score must be between 0 and 100.");
  }

  const supabase = requireSupabase();
  const inboundEventId = await resolveGrowthInboundEventId(input.inboundEventRef);
  const laneId = await resolveGrowthLaneId(input.laneRef);
  const accountId = await resolveGrowthAccountId(input.accountRef);

  const { data, error } = await supabase
    .from("growth_leads")
    .insert({
      inbound_event_id: inboundEventId,
      lane_id: laneId,
      source_account_id: accountId,
      platform: input.platform ?? null,
      contact_name: input.contactName ?? null,
      company_name: input.companyName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      status,
      score: input.score ?? null,
      summary: input.summary ?? null,
      next_action: input.nextAction ?? null,
      owner_name: input.ownerName ?? null,
      metadata: input.metadata ?? {},
    })
    .select("id, lane_id, source_account_id, status, score, summary")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_lead",
    eventName: "growth_lead_created",
    metadata: {
      accountId,
      inboundEventId,
      laneId,
      platform: input.platform ?? null,
      score: input.score ?? null,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth lead created${input.contactName ? `: ${input.contactName}` : ""}`,
  });

  return data as GrowthLeadRow;
}

export async function updateGrowthLead(
  input: UpdateGrowthLeadInput,
): Promise<GrowthLeadRow> {
  const leadId = await resolveGrowthLeadId(input.leadRef);
  const supabase = requireSupabase();

  if (input.status && !isGrowthLeadStatus(input.status)) {
    throw new Error(`Invalid growth lead status: ${input.status}`);
  }

  if (
    input.score != null &&
    (!Number.isFinite(input.score) || input.score < 0 || input.score > 100)
  ) {
    throw new Error("Growth lead score must be between 0 and 100.");
  }

  const payload = compactRecord({
    status: input.status,
    score: input.score,
    summary: input.summary,
    next_action: input.nextAction,
    owner_name: input.ownerName,
    metadata: input.metadata,
  });

  const { data, error } = await supabase
    .from("growth_leads")
    .update(payload)
    .eq("id", leadId)
    .select("id, lane_id, source_account_id, status, score, summary")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_lead",
    eventName: "growth_lead_updated",
    metadata: {
      nextAction: input.nextAction ?? null,
      score: input.score ?? null,
      status: input.status ?? null,
    },
    source: input.source ?? "worker",
    summary: `Growth lead updated: ${input.leadRef}`,
  });

  return data as GrowthLeadRow;
}

export async function createGrowthPlaybook(
  input: CreateGrowthPlaybookInput,
): Promise<GrowthPlaybookRow> {
  if (!isGrowthPlaybookPod(input.pod)) {
    throw new Error(`Invalid growth playbook pod: ${input.pod}`);
  }

  if (input.platform && !isGrowthAccountPlatform(input.platform)) {
    throw new Error(`Invalid growth playbook platform: ${input.platform}`);
  }

  const status = input.status ?? "active";
  if (!isGrowthPlaybookStatus(status)) {
    throw new Error(`Invalid growth playbook status: ${status}`);
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("growth_playbooks")
    .insert({
      pod: input.pod,
      platform: input.platform ?? null,
      title: input.title,
      status,
      summary: input.summary,
      body_markdown: input.bodyMarkdown,
      metadata: input.metadata ?? {},
    })
    .select("id, pod, title, status")
    .single();

  if (error) throw new Error(error.message);

  await safeLogGrowthEvent({
    actorName: input.actorName ?? "growth-ledger",
    correlationId: data.id,
    entityId: data.id,
    entityType: "growth_playbook",
    eventName: "growth_playbook_created",
    metadata: {
      platform: input.platform ?? null,
      pod: input.pod,
      status,
    },
    source: input.source ?? "worker",
    summary: `Growth playbook created: ${input.title}`,
  });

  return data as GrowthPlaybookRow;
}

export async function createGrowthAgentTask(
  input: CreateGrowthAgentTaskInput,
): Promise<LedgerTask> {
  if (!isGrowthAgentKey(input.from)) {
    throw new Error(`Invalid growth task source agent: ${input.from}`);
  }

  if (!isGrowthAgentKey(input.to)) {
    throw new Error(`Invalid growth task target agent: ${input.to}`);
  }

  if (!isGrowthTaskAction(input.action)) {
    throw new Error(`Invalid growth task action: ${input.action}`);
  }

  const task = await createLedgerTask({
    from: input.from,
    to: input.to,
    action: input.action,
    params: input.params ?? {},
    tier: input.tier ?? "green",
  });

  await safeLogGrowthEvent({
    actorName: input.actorName ?? input.from,
    correlationId: input.correlationId ?? task.id,
    causationId: input.causationId ?? null,
    entityId: task.id,
    entityType: "agent_task",
    eventName: "agent_action_requested",
    metadata: {
      action: input.action,
      fromAgent: input.from,
      params: input.params ?? {},
      taskId: task.id,
      tier: input.tier ?? "green",
      toAgent: input.to,
    },
    source: "worker",
    summary: `Growth task requested: ${input.action} -> ${input.to}`,
  });

  return task;
}
