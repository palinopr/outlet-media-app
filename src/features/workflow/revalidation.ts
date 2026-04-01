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

function clientCampaignsPath(clientSlug: string | null | undefined) {
  if (!clientSlug) return [];
  return [`/client/${clientSlug}/campaigns`];
}

export function getCampaignWorkflowPaths(
  clientSlug: string | null | undefined,
  campaignId: string,
) {
  return uniquePaths([
    "/admin/activity",
    "/admin/campaigns",
    `/admin/campaigns/${campaignId}`,
    "/admin/dashboard",
    ...clientPaths(clientSlug, [
      `/client/:clientSlug/campaign/${campaignId}`,
      "/client/:clientSlug/campaigns",
    ]),
  ]);
}

export function getAssetWorkflowPaths(clientSlug: string | null | undefined, assetId: string) {
  void assetId;
  return uniquePaths([
    "/admin/activity",
    "/admin/campaigns",
    "/admin/dashboard",
    ...clientCampaignsPath(clientSlug),
  ]);
}

export function getCrmWorkflowPaths(clientSlug: string | null | undefined, contactId: string) {
  void contactId;
  return uniquePaths([
    "/admin/activity",
    "/admin/clients",
    "/admin/dashboard",
    ...clientCampaignsPath(clientSlug),
  ]);
}

export function getEventWorkflowPaths(clientSlug: string | null | undefined, eventId: string) {
  return uniquePaths([
    "/admin/activity",
    "/admin/dashboard",
    "/admin/events",
    `/admin/events/${eventId}`,
    ...clientPaths(clientSlug, [
      `/client/:clientSlug/event/${eventId}`,
      "/client/:clientSlug/events",
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
    "/admin/dashboard",
    ...(campaignId ? getCampaignWorkflowPaths(clientSlug, campaignId) : []),
    ...(assetId ? getAssetWorkflowPaths(clientSlug, assetId) : []),
    ...(eventId ? getEventWorkflowPaths(clientSlug, eventId) : []),
    ...(contactId ? getCrmWorkflowPaths(clientSlug, contactId) : []),
    ...clientCampaignsPath(clientSlug),
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
  const {
    includeActivity,
    clientSlug: _clientSlug,
    includeNotifications: _includeNotifications,
    includeTasks: _includeTasks,
    pageIds: _pageIds,
  } = input;

  // Workspace-only routes are retired from the shipped shell. Mutations now only need
  // to refresh the surviving summary surfaces that can still reflect shared activity.
  return uniqueTargets([
    { path: "/admin/dashboard" },
    ...(includeActivity ? [{ path: "/admin/activity" }] : []),
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

export function revalidateClientAgentPath(clientSlug: string) {
  revalidatePath(`/client/${clientSlug}/agent`);
}
