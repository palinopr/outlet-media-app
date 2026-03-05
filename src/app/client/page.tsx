import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getMemberships } from "@/lib/member-access";
import { ChevronRight, Building2 } from "lucide-react";

export default async function ClientPickerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  if (meta.role === "admin") redirect("/admin/dashboard");

  const memberships = await getMemberships(userId);

  if (memberships.length === 0) redirect("/client/pending");
  if (memberships.length === 1) redirect(`/client/${memberships[0].clientSlug}`);

  const firstName = user?.firstName ?? "there";

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="text-center space-y-2">
          <Image
            src="/images/brand/symbol-white.png"
            alt="Outlet Media"
            width={48}
            height={48}
            className="mx-auto h-12 w-12"
          />
          <h1 className="text-xl font-bold text-white">Hey {firstName}</h1>
          <p className="text-sm text-white/60">Select a client portal to view</p>
        </div>

        <div className="space-y-2">
          {memberships.map((m) => (
            <Link
              key={m.clientId}
              href={`/client/${m.clientSlug}`}
              className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
                  <Building2 className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{m.clientName}</p>
                  <p className="text-xs text-white/40 capitalize">{m.role}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <SignOutButton>
            <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white/60">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
