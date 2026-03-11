import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { getClientPortalConfig } from "./config";

async function isAdminPortalViewer() {
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  return meta.role === "admin";
}

export async function requireClientAccess(
  slug: string,
): Promise<{
  userId: string;
  scope: ScopeFilter | undefined;
}> {
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

export async function requireClientEventsAccess(
  slug: string,
): Promise<{
  userId: string;
  scope: ScopeFilter | undefined;
}> {
  const access = await requireClientAccess(slug);
  const portalConfig = await getClientPortalConfig(slug);

  if (!portalConfig?.eventsEnabled) {
    redirect(`/client/${slug}`);
  }

  return access;
}
