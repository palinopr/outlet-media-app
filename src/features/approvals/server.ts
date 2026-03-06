import { currentUser } from "@clerk/nextjs/server";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createSystemCampaignActionItem,
  findCampaignActionItemBySource,
  updateSystemCampaignActionItem,
} from "@/features/campaign-action-items/server";
import { getCurrentActor, logSystemEvent } from "@/features/system-events/server";

export type ApprovalAudience = "admin" | "client" | "shared";
export type ApprovalStatus = "approved" | "cancelled" | "pending" | "rejected";

export interface ApprovalRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientSlug: string;
  audience: ApprovalAudience;
  requestType: string;
  status: ApprovalStatus;
  title: string;
  summary: string | null;
  entityType: string | null;
  entityId: string | null;
  pageId: string | null;
  taskId: string | null;
  requestedById: string | null;
  requestedByName: string | null;
  decidedById: string | null;
  decidedByName: string | null;
  decidedAt: string | null;
  decisionNote: string | null;
  metadata: Record<string, unknown>;
}

interface CreateApprovalRequestInput {
  audience?: ApprovalAudience;
  clientSlug: string;
  entityId?: string | null;
  entityType?: string | null;
  metadata?: Record<string, unknown>;
  pageId?: string | null;
  requestType: string;
  summary?: string | null;
  taskId?: string | null;
  title: string;
}

interface ListApprovalRequestsOptions {
  audience?: ApprovalAudience | "all";
  clientSlug?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  limit?: number;
  status?: ApprovalStatus | "all";
}

interface ListCampaignApprovalRequestsOptions {
  audience?: ApprovalAudience | "all";
  clientSlug: string;
  campaignId: string;
  limit?: number;
  status?: ApprovalStatus | "all";
}

function approvalMatchesCampaign(approval: ApprovalRequest, campaignId: string) {
  if (approval.entityType === "campaign" && approval.entityId === campaignId) return true;
  return approval.metadata.campaignId === campaignId;
}

function approvalAssetId(approval: ApprovalRequest) {
  if (approval.requestType !== "asset_review") return null;
  if (approval.entityType === "asset" && approval.entityId) return approval.entityId;

  const metadataAssetId = approval.metadata.assetId;
  return typeof metadataAssetId === "string" ? metadataAssetId : null;
}

interface ResolveApprovalRequestInput {
  id: string;
  note?: string | null;
  status: Exclude<ApprovalStatus, "pending">;
}

function mapApproval(row: Record<string, unknown>): ApprovalRequest {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    clientSlug: row.client_slug as string,
    audience: row.audience as ApprovalAudience,
    requestType: row.request_type as string,
    status: row.status as ApprovalStatus,
    title: row.title as string,
    summary: (row.summary as string | null) ?? null,
    entityType: (row.entity_type as string | null) ?? null,
    entityId: (row.entity_id as string | null) ?? null,
    pageId: (row.page_id as string | null) ?? null,
    taskId: (row.task_id as string | null) ?? null,
    requestedById: (row.requested_by_id as string | null) ?? null,
    requestedByName: (row.requested_by_name as string | null) ?? null,
    decidedById: (row.decided_by_id as string | null) ?? null,
    decidedByName: (row.decided_by_name as string | null) ?? null,
    decidedAt: (row.decided_at as string | null) ?? null,
    decisionNote: (row.decision_note as string | null) ?? null,
    metadata: ((row.metadata as Record<string, unknown> | null) ?? {}) as Record<
      string,
      unknown
    >,
  };
}

function shouldEnqueueApprovalTriage(approval: ApprovalRequest) {
  return (
    approval.audience === "admin" &&
    (approval.requestType === "asset_review" || approval.requestType === "asset_import_review")
  );
}

function approvalTriagePrompt(approval: ApprovalRequest) {
  return [
    `A new approval request needs triage.`,
    `Client: ${approval.clientSlug}`,
    `Title: ${approval.title}`,
    approval.summary ? `Summary: ${approval.summary}` : null,
    `Request type: ${approval.requestType}`,
    `Approval ID: ${approval.id}`,
    `Give a concise review brief with:`,
    `1. what this request is about`,
    `2. what should happen next`,
    `3. any missing information or blockers`,
    `Keep it short and operational.`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function syncApprovalCampaignActionItem(
  approval: ApprovalRequest,
  actor: Awaited<ReturnType<typeof getCurrentActor>>,
  nextStatus?: "done" | "review" | "todo",
) {
  const campaignId =
    approval.entityType === "campaign"
      ? approval.entityId
      : typeof approval.metadata.campaignId === "string"
        ? approval.metadata.campaignId
        : null;

  if (!campaignId) return;

  const visibility = approval.audience === "admin" ? "admin_only" : "shared";
  const existing = await findCampaignActionItemBySource("approval_request", approval.id);

  if (!existing) {
    if (!nextStatus) return;

    await createSystemCampaignActionItem({
      actorId: actor.actorId,
      actorName: actor.actorName,
      actorType: actor.actorType,
      campaignId,
      clientSlug: approval.clientSlug,
      description: approval.summary,
      priority:
        approval.requestType === "asset_import_review" || approval.requestType === "asset_review"
          ? "high"
          : "medium",
      sourceEntityId: approval.id,
      sourceEntityType: "approval_request",
      status: nextStatus,
      title: `Review approval: ${approval.title}`,
      visibility,
    });
    return;
  }

  if (!nextStatus) return;

  await updateSystemCampaignActionItem({
    actorId: actor.actorId,
    actorName: actor.actorName,
    actorType: actor.actorType,
    itemId: existing.id,
    priority: nextStatus === "todo" ? "high" : existing.priority,
    status: nextStatus,
    visibility,
  });
}

async function isAdminUser() {
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  return meta.role === "admin";
}

export async function canAccessApprovalAudience(
  userId: string,
  clientSlug: string,
  audience: ApprovalAudience,
) {
  if (await isAdminUser()) return true;
  if (audience === "admin") return false;
  return !!(await getMemberAccessForSlug(userId, clientSlug));
}

export async function listApprovalRequests(
  options: ListApprovalRequestsOptions = {},
): Promise<ApprovalRequest[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("approval_requests")
    .select(
      "id, created_at, updated_at, client_slug, audience, request_type, status, title, summary, entity_type, entity_id, page_id, task_id, requested_by_id, requested_by_name, decided_by_id, decided_by_name, decided_at, decision_note, metadata",
    )
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 8);

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  if (options.entityType) {
    query = query.eq("entity_type", options.entityType);
  }

  if (options.entityId) {
    query = query.eq("entity_id", options.entityId);
  }

  if (options.audience && options.audience !== "all") {
    if (options.audience === "shared") {
      query = query.in("audience", ["shared", "client"]);
    } else {
      query = query.eq("audience", options.audience);
    }
  }

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[approvals] list failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapApproval(row as Record<string, unknown>));
}

export async function listCampaignApprovalRequests(
  options: ListCampaignApprovalRequestsOptions,
): Promise<ApprovalRequest[]> {
  const approvals = await listApprovalRequests({
    audience: options.audience,
    clientSlug: options.clientSlug,
    limit: Math.max((options.limit ?? 8) * 6, 24),
    status: options.status,
  });

  return approvals
    .filter((approval) => approvalMatchesCampaign(approval, options.campaignId))
    .slice(0, options.limit ?? 8);
}

export async function createApprovalRequest(
  input: CreateApprovalRequestInput,
): Promise<ApprovalRequest | null> {
  if (!supabaseAdmin) return null;

  const actor = await getCurrentActor();
  const { data, error } = await supabaseAdmin
    .from("approval_requests")
    .insert({
      client_slug: input.clientSlug,
      audience: input.audience ?? "shared",
      request_type: input.requestType,
      title: input.title,
      summary: input.summary ?? null,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      page_id: input.pageId ?? null,
      task_id: input.taskId ?? null,
      requested_by_id: actor.actorId,
      requested_by_name: actor.actorName,
      metadata: input.metadata ?? {},
    })
    .select(
      "id, created_at, updated_at, client_slug, audience, request_type, status, title, summary, entity_type, entity_id, page_id, task_id, requested_by_id, requested_by_name, decided_by_id, decided_by_name, decided_at, decision_note, metadata",
    )
    .single();

  if (error) {
    console.error("[approvals] create failed:", error.message);
    return null;
  }

  const approval = mapApproval(data as Record<string, unknown>);
  const campaignId =
    approval.entityType === "campaign"
      ? approval.entityId
      : typeof approval.metadata.campaignId === "string"
        ? approval.metadata.campaignId
        : null;
  const campaignName =
    typeof approval.metadata.campaignName === "string" ? approval.metadata.campaignName : null;

  await logSystemEvent({
    eventName: "approval_requested",
    actorId: actor.actorId,
    actorName: actor.actorName,
    clientSlug: input.clientSlug,
    visibility: input.audience === "admin" ? "admin_only" : "shared",
    entityType: "approval_request",
    entityId: approval.id,
    pageId: input.pageId ?? null,
    taskId: input.taskId ?? null,
    summary: `Approval requested: ${input.title}`,
    detail: input.summary ?? null,
    metadata: {
      approvalId: approval.id,
      audience: approval.audience,
      campaignId,
      campaignName,
      requestType: approval.requestType,
      sourceEntityId: input.entityId ?? null,
      sourceEntityType: input.entityType ?? null,
      ...approval.metadata,
    },
  });

  if (shouldEnqueueApprovalTriage(approval)) {
    const taskId = await enqueueExternalAgentTask({
      action: "triage-approval",
      prompt: approvalTriagePrompt(approval),
      toAgent: "assistant",
    });

    if (taskId) {
      await logSystemEvent({
        eventName: "agent_action_requested",
        actorType: "system",
        clientSlug: approval.clientSlug,
        visibility: "admin_only",
        entityType: "agent_task",
        entityId: taskId,
        summary: `Queued agent triage for approval "${approval.title}"`,
        detail: "Assistant will prepare a concise review brief for the internal team.",
        metadata: {
          approvalId: approval.id,
          toAgent: "assistant",
          taskId,
        },
      });
    }
  }

  await syncApprovalCampaignActionItem(approval, actor, "review");

  return approval;
}

export async function resolveApprovalRequest(
  input: ResolveApprovalRequestInput,
): Promise<ApprovalRequest | null> {
  if (!supabaseAdmin) return null;

  const actor = await getCurrentActor();

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("approval_requests")
    .select(
      "id, created_at, updated_at, client_slug, audience, request_type, status, title, summary, entity_type, entity_id, page_id, task_id, requested_by_id, requested_by_name, decided_by_id, decided_by_name, decided_at, decision_note, metadata",
    )
    .eq("id", input.id)
    .single();

  if (fetchError || !existing) {
    return null;
  }

  const existingApproval = mapApproval(existing as Record<string, unknown>);

  const { data, error } = await supabaseAdmin
    .from("approval_requests")
    .update({
      status: input.status,
      decision_note: input.note ?? null,
      decided_by_id: actor.actorId,
      decided_by_name: actor.actorName,
      decided_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select(
      "id, created_at, updated_at, client_slug, audience, request_type, status, title, summary, entity_type, entity_id, page_id, task_id, requested_by_id, requested_by_name, decided_by_id, decided_by_name, decided_at, decision_note, metadata",
    )
    .single();

  if (error) {
    console.error("[approvals] resolve failed:", error.message);
    return null;
  }

  const approval = mapApproval(data as Record<string, unknown>);
  const campaignId =
    approval.entityType === "campaign"
      ? approval.entityId
      : typeof approval.metadata.campaignId === "string"
        ? approval.metadata.campaignId
        : null;
  const campaignName =
    typeof approval.metadata.campaignName === "string" ? approval.metadata.campaignName : null;

  const assetId = approvalAssetId(approval);

  if (input.status === "approved" && assetId) {
    const { error: assetError } = await supabaseAdmin
      .from("ad_assets")
      .update({
        status: "approved",
      })
      .eq("id", assetId);

    if (assetError) {
      console.error("[approvals] Failed to mark asset approved:", assetError.message);
    }
  }

  const eventName =
    input.status === "approved"
      ? "approval_approved"
      : input.status === "rejected"
        ? "approval_rejected"
        : "approval_cancelled";

  await logSystemEvent({
    eventName,
    actorId: actor.actorId,
    actorName: actor.actorName,
    clientSlug: approval.clientSlug,
    visibility: approval.audience === "admin" ? "admin_only" : "shared",
    entityType: "approval_request",
    entityId: approval.id,
    pageId: approval.pageId,
    taskId: approval.taskId,
    summary: `${input.status[0].toUpperCase()}${input.status.slice(1)} approval: ${approval.title}`,
    detail: input.note ?? approval.summary,
    metadata: {
      approvalId: approval.id,
      campaignId,
      campaignName,
      previousStatus: existingApproval.status,
      requestType: approval.requestType,
      ...approval.metadata,
    },
  });

  await syncApprovalCampaignActionItem(
    approval,
    actor,
    input.status === "rejected" ? "todo" : "done",
  );

  return approval;
}
