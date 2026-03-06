import { currentUser } from "@clerk/nextjs/server";
import { apiError } from "@/lib/api-helpers";
import { getMemberAccessForSlug } from "@/lib/member-access";

function normalizeWorkspaceClientSlug(clientSlug: string | null | undefined) {
  return !clientSlug || clientSlug === "admin" ? "admin" : clientSlug;
}

export async function requireWorkspaceClientAccess(
  userId: string,
  clientSlug: string | null | undefined,
) {
  const normalizedSlug = normalizeWorkspaceClientSlug(clientSlug);
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  const isAdmin = role === "admin";

  if (normalizedSlug === "admin") {
    return isAdmin ? { clientSlug: "admin", isAdmin: true } : apiError("Forbidden", 403);
  }

  if (isAdmin) {
    return { clientSlug: normalizedSlug, isAdmin: true };
  }

  const access = await getMemberAccessForSlug(userId, normalizedSlug);
  if (!access) {
    return apiError("Forbidden", 403);
  }

  return {
    clientSlug: normalizedSlug,
    isAdmin: false,
  };
}
