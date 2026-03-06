import { revalidatePath } from "next/cache";

function uniquePaths(paths: string[]) {
  return [...new Set(paths)];
}

type RevalidationTarget = {
  path: string;
  type?: "layout" | "page";
};

function uniqueTargets(targets: RevalidationTarget[]) {
  const seen = new Set<string>();
  const result: RevalidationTarget[] = [];

  for (const target of targets) {
    const key = `${target.path}:${target.type ?? "page"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(target);
  }

  return result;
}

function clientPaths(clientSlug: string | null | undefined, paths: string[]) {
  if (!clientSlug) return [];
  return paths.map((path) => path.replaceAll(":clientSlug", clientSlug));
}

function metadataString(metadata: Record<string, unknown> | null | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function portalClientSlug(clientSlug: string | null | undefined) {
  if (!clientSlug || clientSlug === "admin") return null;
  return clientSlug;
}

export function getCampaignWorkflowPaths(
  clientSlug: string | null | undefined,
  campaignId: string,
) {
  return uniquePaths([
    "/admin/activity",
    "/admin/campaigns",
    `/admin/campaigns/${campaignId}`,
    "/admin/conversations",
    "/admin/dashboard",
    "/admin/notifications",
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      `/client/:clientSlug/campaign/${campaignId}`,
      "/client/:clientSlug/campaigns",
      "/client/:clientSlug/conversations",
      "/client/:clientSlug/notifications",
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
  ]);
}

export function getAssetWorkflowPaths(clientSlug: string | null | undefined, assetId: string) {
  return uniquePaths([
    "/admin/activity",
    "/admin/assets",
    `/admin/assets/${assetId}`,
    "/admin/conversations",
    "/admin/dashboard",
    "/admin/notifications",
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      "/client/:clientSlug/assets",
      `/client/:clientSlug/assets/${assetId}`,
      "/client/:clientSlug/conversations",
      "/client/:clientSlug/notifications",
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
  ]);
}

export function getCrmWorkflowPaths(clientSlug: string | null | undefined, contactId: string) {
  return uniquePaths([
    "/admin/activity",
    "/admin/conversations",
    "/admin/crm",
    `/admin/crm/${contactId}`,
    "/admin/dashboard",
    "/admin/notifications",
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      "/client/:clientSlug/conversations",
      "/client/:clientSlug/crm",
      `/client/:clientSlug/crm/${contactId}`,
      "/client/:clientSlug/notifications",
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
  ]);
}

export function getEventWorkflowPaths(clientSlug: string | null | undefined, eventId: string) {
  return uniquePaths([
    "/admin/activity",
    "/admin/conversations",
    "/admin/dashboard",
    "/admin/events",
    `/admin/events/${eventId}`,
    "/admin/notifications",
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      "/client/:clientSlug/conversations",
      `/client/:clientSlug/event/${eventId}`,
      "/client/:clientSlug/events",
      "/client/:clientSlug/notifications",
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
  ]);
}

interface ApprovalWorkflowPathsInput {
  audience: "admin" | "client" | "shared";
  clientSlug: string | null | undefined;
  entityId?: string | null;
  entityType?: string | null;
  metadata?: Record<string, unknown> | null;
  pageId?: string | null;
  requestType?: string | null;
}

export function getApprovalWorkflowPaths(input: ApprovalWorkflowPathsInput) {
  const clientSlug = input.audience === "admin" ? null : input.clientSlug;
  const campaignId =
    input.entityType === "campaign" && input.entityId
      ? input.entityId
      : metadataString(input.metadata, "campaignId");
  const eventId =
    input.entityType === "event" && input.entityId
      ? input.entityId
      : metadataString(input.metadata, "eventId");
  const assetId =
    input.entityType === "asset" && input.entityId
      ? input.entityId
      : input.requestType === "asset_review" || input.requestType === "asset_import_review"
        ? metadataString(input.metadata, "assetId")
        : null;
  const contactId =
    input.entityType === "crm_contact" && input.entityId
      ? input.entityId
      : metadataString(input.metadata, "contactId");

  return uniquePaths([
    "/admin/activity",
    "/admin/approvals",
    "/admin/dashboard",
    "/admin/notifications",
    "/admin/reports",
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      "/client/:clientSlug/approvals",
      "/client/:clientSlug/notifications",
      "/client/:clientSlug/reports",
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
    ...(input.pageId ? [`/admin/workspace/${input.pageId}`] : []),
    ...(input.pageId && clientSlug ? [`/client/${clientSlug}/workspace/${input.pageId}`] : []),
    ...(campaignId ? getCampaignWorkflowPaths(clientSlug, campaignId) : []),
    ...(assetId ? getAssetWorkflowPaths(clientSlug, assetId) : []),
    ...(eventId ? getEventWorkflowPaths(clientSlug, eventId) : []),
    ...(contactId ? getCrmWorkflowPaths(clientSlug, contactId) : []),
  ]);
}

interface WorkspaceMutationTargetsInput {
  clientSlug?: string | null;
  includeActivity?: boolean;
  includeNotifications?: boolean;
  includeTasks?: boolean;
  pageIds?: Array<string | null | undefined>;
}

export function getWorkspaceMutationTargets(input: WorkspaceMutationTargetsInput) {
  const clientSlug = portalClientSlug(input.clientSlug);
  const pageIds = [...new Set((input.pageIds ?? []).filter((value): value is string => Boolean(value)))];

  return uniqueTargets([
    { path: "/admin/workspace", type: "layout" },
    ...(input.includeActivity ? [{ path: "/admin/activity" }] : []),
    ...(input.includeNotifications ? [{ path: "/admin/notifications" }] : []),
    ...(input.includeTasks ? [{ path: "/admin/workspace/tasks" }] : []),
    ...pageIds.map((pageId) => ({ path: `/admin/workspace/${pageId}` })),
    ...(clientSlug ? [{ path: `/client/${clientSlug}/workspace`, type: "layout" as const }] : []),
    ...(clientSlug && input.includeActivity ? [{ path: `/client/${clientSlug}/updates` }] : []),
    ...(clientSlug && input.includeNotifications ? [{ path: `/client/${clientSlug}/notifications` }] : []),
    ...(clientSlug && input.includeTasks ? [{ path: `/client/${clientSlug}/workspace/tasks` }] : []),
    ...pageIds.map((pageId) => ({
      path: clientSlug ? `/client/${clientSlug}/workspace/${pageId}` : "",
    })).filter((target) => target.path.length > 0),
  ]);
}

export function revalidateWorkspaceMutationTargets(input: WorkspaceMutationTargetsInput) {
  for (const target of getWorkspaceMutationTargets(input)) {
    revalidatePath(target.path, target.type);
  }
}

export function revalidateWorkflowPaths(paths: string[]) {
  for (const path of uniquePaths(paths)) {
    revalidatePath(path);
  }
}
