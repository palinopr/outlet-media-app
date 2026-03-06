import { BadgeCheck, Clock3, Settings, ShieldCheck, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getSettingsData } from "./data";
import { SettingsView } from "./settings-view";
import { requireClientAccess } from "@/features/client-portal/access";
import { slugToLabel } from "@/lib/formatters";

// ConnectedAccountsList + connect flow hidden -- enable when white-label self-serve is ready

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireClientAccess(slug);

  const settingsData = await getSettingsData(slug);
  const ownerCount =
    settingsData?.members.filter((member) => member.role === "owner").length ?? 0;
  const activeConnections =
    settingsData?.connectedAccounts.filter((account) => account.status === "active").length ?? 0;
  const pendingInviteCount = settingsData?.pendingInvites.length ?? 0;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-violet-500/[0.08] to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <Settings className="h-4 w-4 text-cyan-400/70" />
            Account Settings
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {slugToLabel(slug)} team and integrations
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/60">
              Manage who has access to this client portal and which Meta ad accounts are connected to it.
            </p>
          </div>
        </div>
      </div>

      {settingsData ? (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          <StatCard
            icon={Users}
            iconColor="bg-white/[0.08] text-white/80"
            label="Team members"
            sub="people with portal access"
            value={String(settingsData.members.length)}
            variant="glass"
          />
          <StatCard
            icon={ShieldCheck}
            iconColor="bg-white/[0.08] text-white/80"
            label="Owners"
            sub="can manage team access"
            value={String(ownerCount)}
            variant="glass"
          />
          <StatCard
            icon={BadgeCheck}
            iconColor="bg-white/[0.08] text-white/80"
            label="Connected accounts"
            sub="Meta ad accounts linked here"
            value={String(settingsData.connectedAccounts.length)}
            variant="glass"
          />
          <StatCard
            icon={BadgeCheck}
            iconColor="bg-white/[0.08] text-white/80"
            label="Active links"
            sub="ready for campaign work"
            value={String(activeConnections)}
            variant="glass"
          />
          <StatCard
            icon={Clock3}
            iconColor="bg-white/[0.08] text-white/80"
            label="Pending invites"
            sub="people invited but not onboarded"
            value={String(pendingInviteCount)}
            variant="glass"
          />
        </div>
      ) : null}

      {settingsData && <SettingsView data={settingsData} />}
    </div>
  );
}
