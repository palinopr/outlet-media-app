import { revalidatePath } from "next/cache";

function uniquePaths(paths: string[]) {
  return [...new Set(paths)];
}

function clientPaths(clientSlug: string | null | undefined, paths: string[]) {
  if (!clientSlug) return [];
  return paths.map((path) => path.replaceAll(":clientSlug", clientSlug));
}

export function getCampaignRevalidationPaths(
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

export function revalidateCampaignPaths(paths: string[]) {
  for (const path of uniquePaths(paths)) {
    revalidatePath(path);
  }
}
