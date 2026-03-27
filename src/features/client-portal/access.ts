import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { getClientPortalConfig } from "./config";
import { getUserEmailAddresses, resolveClientPortalEntry } from "./entry";

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

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string | null };
  const entry = await resolveClientPortalEntry({
    emailAddresses: getUserEmailAddresses(user),
    preferredSlug: slug,
    role: meta.role ?? null,
    userId,
  });

  if (entry.kind === "pending") redirect(entry.destination);
  if (entry.kind === "picker") redirect(entry.destination);
  if (entry.kind === "portal" && entry.clientSlug !== slug) {
    redirect(entry.destination);
  }

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) redirect("/client/pending");

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
  const [access, portalConfig] = await Promise.all([
    requireClientAccess(slug),
    getClientPortalConfig(slug),
  ]);

  if (!portalConfig?.eventsEnabled) {
    redirect(`/client/${slug}/campaigns`);
  }

  return access;
}

export async function requireClientReportsAccess(
  slug: string,
): Promise<{
  userId: string;
  scope: ScopeFilter | undefined;
}> {
  const [access, portalConfig] = await Promise.all([
    requireClientAccess(slug),
    getClientPortalConfig(slug),
  ]);

  if (!portalConfig?.reportsEnabled) {
    redirect(`/client/${slug}`);
  }

  return access;
}
