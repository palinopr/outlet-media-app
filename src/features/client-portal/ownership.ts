import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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

export async function requireClientOwnerPage(
  slug: string,
): Promise<{ isAdmin: boolean; userId: string }> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  if (role === "admin") {
    return { isAdmin: true, userId };
  }

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) redirect("/client");
  if (access.role !== "owner") redirect(`/client/${slug}`);

  return { isAdmin: false, userId };
}

export async function requireInternalMetaManagementPage(
  slug: string,
  fallbackPath = `/client/${slug}/campaigns`,
): Promise<{ userId: string }> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  if (role === "admin") {
    return { userId };
  }

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) {
    redirect("/client");
  }

  redirect(fallbackPath);
}
