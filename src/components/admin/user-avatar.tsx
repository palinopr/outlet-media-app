"use client";

// Renders UserButton when Clerk is configured, a plain avatar otherwise.
// This avoids a runtime crash when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set.

import dynamic from "next/dynamic";

const ClerkUserButton = dynamic(
  () => import("@clerk/nextjs").then((m) => ({ default: m.UserButton })),
  { ssr: false }
);

interface Props {
  clerkEnabled: boolean;
}

export function UserAvatar({ clerkEnabled }: Props) {
  if (!clerkEnabled) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
        A
      </div>
    );
  }

  return <ClerkUserButton afterSignOutUrl="/sign-in" />;
}
