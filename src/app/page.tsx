import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkEnabled) {
    redirect("/admin/dashboard");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/landing");
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

  redirect("/client/pending");
}
