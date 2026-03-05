import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberships } from "@/lib/member-access";

export default async function RootPage() {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkEnabled) {
    redirect("/admin/dashboard");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/landing");
  }

  let user: Awaited<ReturnType<typeof currentUser>> = null;
  try {
    user = await currentUser();
  } catch (err) {
    console.error("[root] Failed to fetch current user:", err);
  }

  const meta = (user?.publicMetadata ?? {}) as {
    role?: string;
    client_slug?: string;
  };

  if (meta.role === "admin") {
    redirect("/admin/dashboard");
  }

  // Check client_members table for multi-client support
  const memberships = await getMemberships(userId);

  if (memberships.length === 1) {
    redirect(`/client/${memberships[0].clientSlug}`);
  }

  if (memberships.length > 1) {
    redirect("/client");
  }

  // Fallback: check legacy client_slug metadata
  if (meta.client_slug) {
    redirect(`/client/${meta.client_slug}`);
  }

  redirect("/client/pending");
}
