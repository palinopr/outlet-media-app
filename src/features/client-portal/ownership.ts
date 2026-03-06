import { currentUser } from "@clerk/nextjs/server";
import { apiError } from "@/lib/api-helpers";
import { getMemberAccessForSlug } from "@/lib/member-access";

export async function requireClientOwner(
  userId: string,
  slug: string,
  action = "manage this client account",
): Promise<Response | null> {
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  if (role === "admin") {
    return null;
  }

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) {
    return apiError("Forbidden", 403);
  }

  if (access.role !== "owner") {
    return apiError(`Only owners can ${action}`, 403);
  }

  return null;
}
