import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserEmailAddresses,
  resolveClientPortalEntry,
} from "@/features/client-portal/entry";

interface RootPageProps {
  searchParams?: Promise<{
    invite_id?: string;
  }>;
}

export default async function RootPage({ searchParams }: RootPageProps) {
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
    invite_id?: string | null;
    role?: string | null;
  };
  const params = await searchParams;
  const queryInviteId = typeof params?.invite_id === "string" ? params.invite_id : null;
  const metadataInviteId = typeof meta.invite_id === "string" ? meta.invite_id : null;
  const entry = await resolveClientPortalEntry({
    emailAddresses: getUserEmailAddresses(user),
    inviteId: queryInviteId ?? metadataInviteId,
    role: meta.role ?? null,
    userId,
  });

  redirect(entry.destination);
}
