import { currentUser } from "@clerk/nextjs/server";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";
import { listVisibleAssetIdsForScope } from "@/features/assets/server";
import {
  createSystemCampaignActionItem,
  findCampaignActionItemBySource,
  updateSystemCampaignActionItem,
} from "@/features/campaign-action-items/server";
import {
  createNotification,
  listClientNotificationRecipients,
} from "@/features/notifications/server";
import { getCurrentActor, logSystemEvent } from "@/features/system-events/server";
import {
  approvalAssetId,
  approvalCampaignId,
  approvalEventId,
  approvalIsWithinScope,
  filterApprovalRequestsByScope,
} from "./summary";
import {
  getApprovalWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";

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
  scope?: ScopeFilter | null;
  status?: ApprovalStatus | "all";
}

interface ListCampaignApprovalRequestsOptions {
  audience?: ApprovalAudience | "all";
  clientSlug: string;
  campaignId: string;
  limit?: number;
  status?: ApprovalStatus | "all";
}

interface ListAssetApprovalRequestsOptions {
  assetId: string;
  audience?: ApprovalAudience | "all";
  clientSlug?: string | null;
  limit?: number;
  status?: ApprovalStatus | "all";
}

export function approvalMatchesCampaign(approval: ApprovalRequest, campaignId: string) {
  return approvalCampaignId(approval) === campaignId;
}

export function approvalMatchesEvent(approval: ApprovalRequest, eventId: string) {
  return approvalEventId(approval) === eventId;
}

function approvalMatchesAsset(approval: ApprovalRequest, assetId: string) {
  return approvalAssetId(approval) === assetId;
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

function approvalCampaignContext(approval: ApprovalRequest) {
  const campaignId =
    approval.entityType === "campaign"
      ? approval.entityId
      : typeof approval.metadata.campaignId === "string"
        ? approval.metadata.campaignId
        : null;
  const campaignName =
    typeof approval.metadata.campaignName === "string" ? approval.metadata.campaignName : null;

  return { campaignId, campaignName };
}

async function syncApprovalCampaignActionItem(
  approval: ApprovalRequest,
  actor: Awaited<ReturnType<typeof getCurrentActor>>,
  nextStatus?: "done" | "review" | "todo",
) {
  const { campaignId } = approvalCampaignContext(approval);

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

function shouldEnqueueApprovedCreativeHandoff(approval: ApprovalRequest, status: ApprovalStatus) {
  if (status !== "approved") return false;
  if (
    approval.requestType !== "asset_import_review" &&
    approval.requestType !== "asset_review"
  ) {
    return false;
  }

  return !!approvalCampaignContext(approval).campaignId;
}

function approvedCreativeHandoffPrompt(approval: ApprovalRequest) {
  const { campaignId, campaignName } = approvalCampaignContext(approval);
  const assetName =
    typeof approval.metadata.assetName === "string" ? approval.metadata.assetName : null;
  const importedCount =
    typeof approval.metadata.imported === "number" ? approval.metadata.imported : null;

  return [
    `Approved campaign creative is ready for Meta review.`,
    `Client: ${approval.clientSlug}`,
    campaignName ? `Campaign: ${campaignName}` : null,
    campaignId ? `Campaign ID: ${campaignId}` : null,
    `Approval ID: ${approval.id}`,
    `Request type: ${approval.requestType}`,
    assetName ? `Asset: ${assetName}` : null,
    importedCount != null
      ? `Imported assets approved: ${importedCount}`
      : null,
    approval.summary ? `Summary: ${approval.summary}` : null,
    `Decide whether this approved creative should trigger a Meta draft or campaign update.`,
    `Return a short operational brief with:`,
    `1. recommended next Meta action`,
    `2. missing creative/copy/spec information`,
    `3. any blockers before launch or update`,
    `Keep it concise and execution-focused.`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function maybeEnqueueApprovedCreativeHandoff(approval: ApprovalRequest) {
  if (!shouldEnqueueApprovedCreativeHandoff(approval, approval.status)) return;

  const { campaignId, campaignName } = approvalCampaignContext(approval);
  const taskId = await enqueueExternalAgentTask({
    action: "draft-meta-creative-handoff",
    prompt: approvedCreativeHandoffPrompt(approval),
    toAgent: "meta-ads",
  });

  if (!taskId) return;

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "system",
    clientSlug: approval.clientSlug,
    visibility: "admin_only",
    entityType: "agent_task",
    entityId: taskId,
    summary: `Queued Meta creative handoff for "${approval.title}"`,
    detail: "Meta ads agent will review the approved creative and prepare the next recommendation.",
    metadata: {
      approvalId: approval.id,
      campaignId,
      campaignName,
      requestType: approval.requestType,
      taskId,
      toAgent: "meta-ads",
      ...approval.metadata,
    },
  });
}

async function notifyClientApprovalAudience(
  approval: ApprovalRequest,
  actor: Awaited<ReturnType<typeof getCurrentActor>>,
) {
  if (approval.audience !== "client" && approval.audience !== "shared") return;

  const recipientIds = await listClientNotificationRecipients(approval.clientSlug, {
    entityId: approval.id,
    entityType: "approval_request",
    excludeUserId: actor.actorId,
  });

  await Promise.all(
    recipientIds.map((userId) =>
      createNotification({
        clientSlug: approval.clientSlug,
        entityId: approval.id,
        entityType: "approval_request",
        fromUserId: actor.actorId,
        fromUserName: actor.actorName,
        message: approval.title,
        title: "Approval requested",
        type: "approval",
        userId,
      }),
    ),
  );
}

async function notifyApprovalRequesterResolved(
  approval: ApprovalRequest,
  actor: Awaited<ReturnType<typeof getCurrentActor>>,
) {
  if (!approval.requestedById || approval.requestedById === actor.actorId) return;

  const statusLabel =
    approval.status[0].toUpperCase() + approval.status.slice(1);

  await createNotification({
    clientSlug: approval.clientSlug,
    entityId: approval.id,
    entityType: "approval_request",
    fromUserId: actor.actorId,
    fromUserName: actor.actorName,
    message: approval.title,
    title: `${statusLabel} approval`,
    type: "approval",
    userId: approval.requestedById,
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

export async function getApprovalRequestById(id: string): Promise<ApprovalRequest | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("approval_requests")
    .select(
      "id, created_at, updated_at, client_slug, audience, request_type, status, title, summary, entity_type, entity_id, page_id, task_id, requested_by_id, requested_by_name, decided_by_id, decided_by_name, decided_at, decision_note, metadata",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[approvals] get by id failed:", error.message);
    return null;
  }

  return data ? mapApproval(data as Record<string, unknown>) : null;
}

export async function canAccessApprovalRequest(userId: string, approval: ApprovalRequest) {
  if (await isAdminUser()) return true;
  if (approval.audience === "admin") return false;

  const access = await getMemberAccessForSlug(userId, approval.clientSlug);
  if (!access) return false;
  if (access.scope !== "assigned") return true;

  const scope = {
    allowedCampaignIds: access.allowedCampaignIds,
    allowedEventIds: access.allowedEventIds,
  };
  const assetId = approvalAssetId(approval);
  const allowedAssetIds =
    assetId != null
      ? await listVisibleAssetIdsForScope(approval.clientSlug, [assetId], scope)
      : null;

  return approvalIsWithinScope(approval, {
    allowedCampaignIds: access.allowedCampaignIds,
    allowedEventIds: access.allowedEventIds,
  }, allowedAssetIds);
}

export async function listApprovalRequests(
  options: ListApprovalRequestsOptions = {},
): Promise<ApprovalRequest[]> {
  if (!supabaseAdmin) return [];

  const requestedLimit = options.limit ?? 8;
  const shouldOverfetchForScope =
    !!options.scope &&
    (options.scope.allowedCampaignIds != null || options.scope.allowedEventIds != null);

  let query = supabaseAdmin
    .from("approval_requests")
    .select(
      "id, created_at, updated_at, client_slug, audience, request_type, status, title, summary, entity_type, entity_id, page_id, task_id, requested_by_id, requested_by_name, decided_by_id, decided_by_name, decided_at, decision_note, metadata",
    )
    .order("created_at", { ascending: false })
    .limit(shouldOverfetchForScope ? Math.max(requestedLimit * 6, 24) : requestedLimit);

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

  const approvals = (data ?? []).map((row) => mapApproval(row as Record<string, unknown>));
  const allowedAssetIds =
    options.scope && options.clientSlug
      ? await listVisibleAssetIdsForScope(
          options.clientSlug,
          approvals
            .map((approval) => approvalAssetId(approval))
            .filter((assetId): assetId is string => assetId != null),
          options.scope,
        )
      : null;
  const filtered = options.scope
    ? filterApprovalRequestsByScope(approvals, options.scope, allowedAssetIds)
    : approvals;
  return filtered.slice(0, requestedLimit);
}

export async function listCampaignApprovalRequests(
  options: ListCampaignApprovalRequestsOptions,
): Promise<ApprovalRequest[]> {
  const approvals = await listApprovalRequests({
    audience: options.audience,
    clientSlug: options.clientSlug,
    limit: Math.max((options.limit ?? 8) * 6, 24),
    scope: null,
    status: options.status,
  });

  return approvals
    .filter((approval) => approvalMatchesCampaign(approval, options.campaignId))
    .slice(0, options.limit ?? 8);
}

export async function listAssetApprovalRequests(
  options: ListAssetApprovalRequestsOptions,
): Promise<ApprovalRequest[]> {
  const approvals = await listApprovalRequests({
    audience: options.audience,
    clientSlug: options.clientSlug,
    limit: Math.max((options.limit ?? 8) * 6, 24),
    scope: null,
    status: options.status,
  });

  return approvals
    .filter((approval) => approvalMatchesAsset(approval, options.assetId))
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
  const { campaignId, campaignName } = approvalCampaignContext(approval);

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

  await notifyClientApprovalAudience(approval, actor);

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
  revalidateWorkflowPaths(
    getApprovalWorkflowPaths({
      audience: approval.audience,
      clientSlug: approval.clientSlug,
      entityId: approval.entityId,
      entityType: approval.entityType,
      metadata: approval.metadata,
      pageId: approval.pageId,
      requestType: approval.requestType,
    }),
  );

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
  const { campaignId, campaignName } = approvalCampaignContext(approval);

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
  await notifyApprovalRequesterResolved(approval, actor);
  await maybeEnqueueApprovedCreativeHandoff(approval);
  revalidateWorkflowPaths(
    getApprovalWorkflowPaths({
      audience: approval.audience,
      clientSlug: approval.clientSlug,
      entityId: approval.entityId,
      entityType: approval.entityType,
      metadata: approval.metadata,
      pageId: approval.pageId,
      requestType: approval.requestType,
    }),
  );

  return approval;
}
