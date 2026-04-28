import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { getUserEmailAddresses, resolveClientPortalEntry } from "./entry";

type Viewer = "member" | "admin_preview";

type PortalAccessAllowed = {
  kind: "allowed";
  clientId?: string;
  clientSlug: string;
  scope: ScopeFilter | undefined;
  userId: string;
  viewer: Viewer;
};

type PortalAccessRedirect = {
  destination: string;
  kind: "redirect";
  viewer: Viewer;
};

type PortalAccessResolution = PortalAccessAllowed | PortalAccessRedirect;

async function isAdminPortalViewer() {
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  return meta.role === "admin";
}

export async function resolveClientPortalAccess(slug: string): Promise<PortalAccessResolution> {
  const { userId } = await auth();
  if (!userId) {
    return { destination: "/sign-in", kind: "redirect", viewer: "member" };
  }

  if (await isAdminPortalViewer()) {
    return {
      clientSlug: slug,
      kind: "allowed",
      scope: undefined,
      userId,
      viewer: "admin_preview",
    };
  }

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string | null };
  const entry = await resolveClientPortalEntry({
    emailAddresses: getUserEmailAddresses(user),
    preferredSlug: slug,
    role: meta.role ?? null,
    userId,
  });

  if (entry.kind === "pending") {
    return { destination: entry.destination, kind: "redirect", viewer: "member" };
  }
  if (entry.kind === "picker") {
    return { destination: entry.destination, kind: "redirect", viewer: "member" };
  }
  if (entry.kind === "portal" && entry.clientSlug !== slug) {
    return { destination: entry.destination, kind: "redirect", viewer: "member" };
  }

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) {
    return { destination: "/client/pending", kind: "redirect", viewer: "member" };
  }

  const scope =
    access.scope === "assigned"
      ? {
          allowedCampaignIds: access.allowedCampaignIds,
        }
      : undefined;

  return {
    clientId: access.clientId,
    clientSlug: access.clientSlug,
    kind: "allowed",
    scope,
    userId,
    viewer: "member",
  };
}

function requireResolvedClientAccess(
  resolution: PortalAccessResolution,
): PortalAccessAllowed {
  if (resolution.kind === "redirect") {
    redirect(resolution.destination);
  }

  return resolution;
}

export async function requireClientAccess(
  slug: string,
): Promise<{
  userId: string;
  scope: ScopeFilter | undefined;
}> {
  const access = requireResolvedClientAccess(await resolveClientPortalAccess(slug));
  return { userId: access.userId, scope: access.scope };
}

