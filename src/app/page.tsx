import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkEnabled) {
    redirect("/admin/dashboard");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as {
    role?: string;
    client_slug?: string;
  };

  if (meta.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (meta.client_slug) {
    redirect(`/client/${meta.client_slug}`);
  }

  // Logged in but no role or client assigned yet
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-2 max-w-sm">
        <p className="text-lg font-semibold">Account not configured</p>
        <p className="text-sm text-muted-foreground">
          Your account hasn&apos;t been assigned to a client yet. Contact Outlet
          Media to get access.
        </p>
      </div>
    </div>
  );
}
