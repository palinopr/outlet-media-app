import { listEffectiveCampaignIdsForClientSlug } from "@/lib/campaign-client-assignment";
import type { ScopeFilter } from "@/lib/member-access";
import { getFeatureReadClient, supabaseAdmin } from "@/lib/supabase";
import { listVisibleAssetIdsForScope } from "@/features/assets/server";
import {
  approvalAssetId,
  approvalCampaignId,
  filterApprovalRequestsByScope,
} from "./summary";

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

const APPROVAL_SELECT =
  "id, created_at, updated_at, client_slug, audience, request_type, status, title, summary, entity_type, entity_id, page_id, task_id, requested_by_id, requested_by_name, decided_by_id, decided_by_name, decided_at, decision_note, metadata";

export function approvalMatchesCampaign(approval: ApprovalRequest, campaignId: string) {
  return approvalCampaignId(approval) === campaignId;
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

function buildApprovalListQuery(
  db: NonNullable<typeof supabaseAdmin>,
  requestedLimit: number,
  shouldOverfetchForScope: boolean,
  options: ListApprovalRequestsOptions,
  clientSlug?: string | null,
) {
  let query = db
    .from("approval_requests")
    .select(APPROVAL_SELECT)
    .order("created_at", { ascending: false })
    .limit(shouldOverfetchForScope ? Math.max(requestedLimit * 6, 24) : requestedLimit);

  if (clientSlug) {
    query = query.eq("client_slug", clientSlug);
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

  return query;
}


export async function listApprovalRequests(
  options: ListApprovalRequestsOptions = {},
): Promise<ApprovalRequest[]> {
  const approvalReadDb = await getFeatureReadClient(!!options.clientSlug);
  if (!approvalReadDb || !supabaseAdmin) return [];

  const requestedLimit = options.limit ?? 8;
  const shouldOverfetchForScope =
    !!options.scope &&
    (options.scope.allowedCampaignIds != null || options.scope.allowedEventIds != null);
  const effectiveCampaignIds = options.clientSlug
    ? await listEffectiveCampaignIdsForClientSlug(options.clientSlug)
    : [];
  const [primaryRes, campaignLinkedRes] = await Promise.all([
    buildApprovalListQuery(
      approvalReadDb,
      requestedLimit,
      shouldOverfetchForScope,
      options,
      options.clientSlug,
    ) ??
      Promise.resolve({ data: [], error: null }),
    options.clientSlug && effectiveCampaignIds.length > 0
      ? buildApprovalListQuery(
          supabaseAdmin,
          Math.max(requestedLimit * 8, 40),
          shouldOverfetchForScope,
          options,
          null,
        ) ?? Promise.resolve({ data: [], error: null })
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (primaryRes.error) {
    console.error("[approvals] list failed:", primaryRes.error.message);
    return [];
  }

  if (campaignLinkedRes.error) {
    console.error("[approvals] campaign-linked fallback failed:", campaignLinkedRes.error.message);
    return [];
  }

  const effectiveCampaignIdSet = new Set(effectiveCampaignIds);
  const approvals = [
    ...((primaryRes.data ?? []) as Record<string, unknown>[]),
    ...((campaignLinkedRes.data ?? []) as Record<string, unknown>[]).filter((row) => {
      if (!options.clientSlug) return false;
      const approval = mapApproval(row);
      const campaignId = approvalCampaignId(approval);
      return !!campaignId && effectiveCampaignIdSet.has(campaignId);
    }),
  ].reduce<ApprovalRequest[]>((merged, row) => {
    const approval = mapApproval(row as Record<string, unknown>);
    if (merged.some((item) => item.id === approval.id)) return merged;
    merged.push(approval);
    return merged;
  }, []);
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
    limit: Math.max((options.limit ?? 8) * 10, 40),
    scope: null,
    status: options.status,
  });

  return approvals
    .filter((approval) => approvalMatchesCampaign(approval, options.campaignId))
    .slice(0, options.limit ?? 8);
}

