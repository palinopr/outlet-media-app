import { apiError } from "@/lib/api-helpers";
import { getMemberAccessForSlug } from "@/lib/member-access";

export async function requireClientOwner(
  userId: string,
  slug: string,
  action = "manage this client account",
): Promise<Response | null> {
  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) {
    return apiError("Forbidden", 403);
  }

  if (access.role !== "owner") {
    return apiError(`Only owners can ${action}`, 403);
  }

  return null;
}
