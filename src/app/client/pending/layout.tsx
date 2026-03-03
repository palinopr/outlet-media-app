import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PendingLayout({ children }: { children: ReactNode }) {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (clerkEnabled) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
  }
  return <>{children}</>;
}
