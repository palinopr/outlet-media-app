import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { requireService } from "@/lib/service-guard";
import type { ServiceKey } from "@/lib/service-registry";

async function isAdminPortalViewer() {
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  return meta.role === "admin";
}

export async function requireClientAccess(
  slug: string,
  ...serviceKeys: ServiceKey[]
): Promise<{
  userId: string;
  scope: ScopeFilter | undefined;
}> {
  if (serviceKeys.length > 0) {
    await requireService(slug, ...serviceKeys);
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  if (await isAdminPortalViewer()) {
    return { userId, scope: undefined };
  }

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) redirect("/client");

  const scope =
    access.scope === "assigned"
      ? {
          allowedCampaignIds: access.allowedCampaignIds,
          allowedEventIds: access.allowedEventIds,
        }
      : undefined;

  return { userId, scope };
}
