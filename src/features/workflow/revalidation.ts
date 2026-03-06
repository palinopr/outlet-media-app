import { revalidatePath } from "next/cache";

function uniquePaths(paths: string[]) {
  return [...new Set(paths)];
}

function clientPaths(clientSlug: string | null | undefined, paths: string[]) {
  if (!clientSlug) return [];
  return paths.map((path) => path.replaceAll(":clientSlug", clientSlug));
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
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      `/client/:clientSlug/campaign/${campaignId}`,
      "/client/:clientSlug/campaigns",
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
    "/admin/dashboard",
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      "/client/:clientSlug/assets",
      `/client/:clientSlug/assets/${assetId}`,
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
  ]);
}

export function getCrmWorkflowPaths(clientSlug: string | null | undefined, contactId: string) {
  return uniquePaths([
    "/admin/activity",
    "/admin/crm",
    `/admin/crm/${contactId}`,
    "/admin/dashboard",
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      "/client/:clientSlug/crm",
      `/client/:clientSlug/crm/${contactId}`,
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
  ]);
}

export function getEventWorkflowPaths(clientSlug: string | null | undefined, eventId: string) {
  return uniquePaths([
    "/admin/activity",
    "/admin/dashboard",
    "/admin/events",
    `/admin/events/${eventId}`,
    "/admin/workspace",
    "/admin/workspace/tasks",
    ...clientPaths(clientSlug, [
      "/client/:clientSlug",
      `/client/:clientSlug/event/${eventId}`,
      "/client/:clientSlug/events",
      "/client/:clientSlug/updates",
      "/client/:clientSlug/workspace",
      "/client/:clientSlug/workspace/tasks",
    ]),
  ]);
}

export function revalidateWorkflowPaths(paths: string[]) {
  for (const path of uniquePaths(paths)) {
    revalidatePath(path);
  }
}
