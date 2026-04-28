import { revalidatePath } from "next/cache";

function uniquePaths(paths: string[]) {
  return [...new Set(paths)];
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
    "/admin/campaigns",
    "/admin/dashboard",
    ...clientCampaignsPath(clientSlug),
  ]);
}

export function getEventWorkflowPaths(clientSlug: string | null | undefined, eventId: string) {
  return uniquePaths([
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
  return uniquePaths([
    "/admin/dashboard",
    ...(campaignId ? getCampaignWorkflowPaths(clientSlug, campaignId) : []),
    ...(assetId ? getAssetWorkflowPaths(clientSlug, assetId) : []),
    ...(eventId ? getEventWorkflowPaths(clientSlug, eventId) : []),
    ...clientCampaignsPath(clientSlug),
  ]);
}

export function revalidateWorkflowPaths(paths: string[]) {
  for (const path of uniquePaths(paths)) {
    revalidatePath(path);
  }
}
